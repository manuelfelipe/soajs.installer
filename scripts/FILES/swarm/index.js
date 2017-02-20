'use strict';
var Docker = require('dockerode');
var async = require('async');

var path = require('path');
var fs = require('fs');
var Grid = require('gridfs-stream');
var exec = require('child_process').exec;
var soajs = require('soajs');
var request = require('request');

var config = require('./config.js');
delete require.cache[config.profile];
var profile = require(config.profile);
var mongo = new soajs.mongo(profile);
var analyticsCollection = 'analytics';
var utilLog = require('util');
var dbConfiguration = require('../../../data/startup/environments/dashboard');
if (dbConfiguration.dbs.clusters.es_clusters) {
	if(dbConfiguration.dbs.clusters.es_clusters.analytics){
		delete dbConfiguration.dbs.clusters.es_clusters.analytics;
	}
	var esClient = new soajs.es(dbConfiguration.dbs.clusters.es_clusters);
}
var lib = {
	"loadCustomData": function (cb) {
		var dataDir = process.env.SOAJS_DATA_FOLDER;
		
		fs.exists(path.normalize(dataDir + "/../custom.js"), function (exists) {
			if (!exists) {
				return cb(null);
			}
			else {
				delete require.cache[require.resolve(path.normalize(dataDir + "/../custom.js"))];
				var customData = require(path.normalize(dataDir + "/../custom.js"));
				return cb(customData);
			}
		});
	},
	
    ifSwarmExists: function (deployer, cb) {
        deployer.info(function (error, info) {
            if (error) return cb(error);

            var swarmExists = false;
            if (info.Swarm) {
                swarmExists = (info.Swarm.LocalNodeState === 'active' && info.Swarm.Nodes > 0);
            }

            return cb(null, swarmExists);
        });
    },

    printProgress: function (message, counter) {
        process.stdout.clearLine();
        process.stdout.write(showTimestamp() + ' - ' + message + ' ' + showDots() + '\r');

        function showDots() {
            var output = '';
            var numOfDots = counter % 5;
            for (var i = 0; i < numOfDots; i++) {
                output += '.';
            }
            return output;
        }

        function showTimestamp() {
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var now = new Date();
            return '' + now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getHours() + ':' +
                ((now.getMinutes().toString().length === 2) ? now.getMinutes() : '0' + now.getMinutes()) + ':' +
                ((now.getSeconds().toString().length === 2) ? now.getSeconds() : '0' + now.getSeconds());
        }
    },

    getDeployer: function (dockerObj, cb) {
        var deployerConfig = {
            "host": dockerObj.machineIP,
            "port": dockerObj.machinePort
        };
        if (typeof (deployerConfig.host) === 'string' && deployerConfig.host === '127.0.0.1') {
            return cb(null, new Docker({socketPath: config.docker.socketPath}));
        }
        else {
        	if(!config.docker.certsPath){
        		return cb(new Error('No certificates found for remote machine.'));
	        }
            deployerConfig.ca = fs.readFileSync(config.docker.certsPath + '/ca.pem');
            deployerConfig.cert = fs.readFileSync(config.docker.certsPath + '/cert.pem');
            deployerConfig.key = fs.readFileSync(config.docker.certsPath + '/key.pem');

            return cb(null, new Docker(deployerConfig));
        }
    },

    getContent: function (type, group, cb) {
        var path = config.services.path.dir + group + '/';
        fs.exists(path, function (exists) {
            if (!exists) {
                utilLog.log('Folder [' + path + '] does not exist, skipping ...');
                return cb(null, true);
            }

            fs.readdir(path, function (error, content) {
                if (error) return cb(error);

                var regex = new RegExp('[a-zA-Z0-9]*\.' + config.services.path.fileType, 'g');
                var loadContent, allContent = [];
                content.forEach(function (oneContent) {
                    if (oneContent.match(regex)) {
                        try {
                            loadContent = require(path + oneContent);
                        }
                        catch (e) {
                            return cb(e);
                        }
                        allContent.push(loadContent);
                    }
                });
                return cb(null, allContent);
            });
        });
    },

    deployGroup: function (type, services, deployer, cb) {
        if (services.length === 0) {
            utilLog.log('No services of type [' + type + '] found, skipping ...');
            return cb(null, true);
        }

        if (type === 'db' && config.mongo.external) {
            utilLog.log('External Mongo deployment detected, data containers will not be deployed ...');
            return cb(null, true);
        }
	    if (type === 'elk' && !config.analytics) {
		    return cb(null, true);
	    }

        async.eachSeries(services, function (oneService, callback) {
            lib.deployService(deployer, oneService, callback);
        }, cb);
    },

    importData: function (mongoInfo, cb) {
        utilLog.log('Importing provision data to:', profile.servers[0].host + ":" + profile.servers[0].port);
        var dataImportFile = __dirname + "/../dataImport/index.js";
        var execString = process.env.NODE_PATH + " " + dataImportFile;
        exec(execString, function(error, stdout, stderr) {
	        if (error) {
		        console.log(error);
		        console.log(stdout);
		        console.log(stderr);
		        return cb(error)
	        }
	        return cb(null, true)
        });
    },
	
	importCertificates: function (cb) {
		lib.loadCustomData(function(customFile) {
			if(!customFile.deployment.certsRequired)
				return cb(null, true);
			
			else{
				utilLog.log('Importing certifictes to:', profile.servers[0].host + ":" + profile.servers[0].port);
				copyCACertificate(function(caErr){
					if(caErr){
						utilLog.log("Error while copying the certificate of type CA");
						throw new Error(caErr);
					}
					copyCertCertificate(function(certErr){
						if(certErr){
							utilLog.log("Error while copying the certificate of type Cert");
							throw new Error(certErr);
						}
						copyKeyCertificate(function(keyErr){
							if(keyErr){
								utilLog.log("Error while copying the certificate of type Key");
								throw new Error(keyErr);
							}
							
							return cb();
						});
					});
				});
			}
			
			function getDb(soajs) {
				profile.name = "core_provision";
				mongo = new soajs.mongo(profile);
				return mongo;
			}
			
			function copyCACertificate(cb) {
				
				var fileData = {
					filename: "CA Certificate",
					metadata: {
						platform: 'docker',
						certType: 'ca',
						env: {
							'DASHBOARD':[customFile.deployment.deployDriver.split('.')[1] + "." + customFile.deployment.deployDriver.split('.')[2]]
						}
					}
				};
				
				getDb(soajs).getMongoDB(function (error, db) {
					if(error) {
						throw new Error(error);
					}
					var gfs = Grid(db, getDb(soajs).mongodb);
					var writeStream = gfs.createWriteStream(fileData);
					var readStream = fs.createReadStream(customFile.deployment.certificates.caCertificate);
					readStream.pipe(writeStream);
					
					writeStream.on('error', function (error) {
						return cb(error);
					});
					writeStream.on('close', function (file) {
						return cb(null, true);
					});
				});
			}
			
			function copyCertCertificate(cb) {
				
				var fileData = {
					filename: "Cert Certificate",
					metadata: {
						platform: 'docker',
						certType: 'cert',
						env: {
							'DASHBOARD':[customFile.deployment.deployDriver.split('.')[1] + "." + customFile.deployment.deployDriver.split('.')[2]]
						}
					}
				};
				
				getDb(soajs).getMongoDB(function (error, db) {
					if(error) {
						throw new Error(error);
					}
					var gfs = Grid(db, getDb(soajs).mongodb);
					var writeStream = gfs.createWriteStream(fileData);
					var readStream = fs.createReadStream(customFile.deployment.certificates.certCertificate);
					readStream.pipe(writeStream);
					writeStream.on('error', function (error) {
						return cb(error);
					});
					writeStream.on('close', function (file) {
						return cb(null, true);
					});
				});
			}
			
			function copyKeyCertificate(cb) {
				
				var fileData = {
					filename: "Key Certificate",
					metadata: {
						platform: 'docker',
						certType: 'key',
						env: {
							'DASHBOARD':[customFile.deployment.deployDriver.split('.')[1] + "." + customFile.deployment.deployDriver.split('.')[2]]
						}
					}
				};
				
				getDb(soajs).getMongoDB(function (error, db) {
					if(error) {
						throw new Error(error);
					}
					var gfs = Grid(db, getDb(soajs).mongodb);
					var writeStream = gfs.createWriteStream(fileData);
					var readStream = fs.createReadStream(customFile.deployment.certificates.keyCertificate);
					readStream.pipe(writeStream);
					writeStream.on('error', function (error) {
						return cb(error);
					});
					writeStream.on('close', function (file) {
						return cb(null, true);
					});
				});
			}
			
		});
	},
	
	getServiceNames: function (serviceName, deployer, replicaCount, counter, cb) {
		if (typeof (counter) === 'function') {
			cb = counter; //counter wasn't passed as param
			counter = 0;
		}
		var params = {
			filters: {
				label: ['com.docker.swarm.service.name=' + serviceName],
				status: ['running']
			}
		};
		deployer.listContainers(params, function (err, result) {
			if (err) return cb(err);
			
			var oneContainer = [];
			for (var cid in result) {
				oneContainer.push({
					name: result[cid].Labels['com.docker.swarm.task.name']
				});
			}
			if (oneContainer.length !== replicaCount) {
				//Containers may not have been attached to network yet
				lib.printProgress('Waiting for ' + serviceName + ' containers to become available', counter++);
				setTimeout(function () {
					return lib.getServiceNames(serviceName, deployer, replicaCount, counter, cb);
				}, 1000);
			}
			else {
				utilLog.log(""); //intentional, to force writting a new line.
				return cb(null, oneContainer);
			}
		});
	},
	
	deployService: function (deployer, options, cb) {
		if (options.Name === 'elasticsearch' && config.elasticsearch && config.elasticsearch.external) {
			utilLog.log('External Elasticsearch deployment detected, Elasticsearch containers will not be deployed ...');
			lib.configureElastic(deployer, options, cb);
		}
		deployer.createService(options, function (error, result) {
			if (config.analytics) {
				if (options.Name === 'elasticsearch') {
					lib.configureElastic(deployer, options, cb);
				}
				else {
					lib.configureKibana(deployer, options, cb);
				}
			}
			else {
				return cb(null, true);
			}
		});
	},
	
    deleteService: function (deployer, options, cb) {
        var service = deployer.getService(options.id);
        service.remove(cb);
    },

    deleteContainer: function (deployer, options, cb) {
        var container = deployer.getContainer(options.id);
        container.remove({force: true}, cb);
    },
	
	deletePreviousServices: function (deployer, cb) {
		var filters = { label: { 'soajs.content': true }};
		deployer.listServices({ filters: filters }, function (error, services) {
			if (error) return cb(error);
			
			async.each(services, function (oneService, callback) {
				var serviceOptions = {id: oneService.ID};
				lib.deleteService(deployer, serviceOptions, callback);
			}, function (error, result) {
				if (error) return cb(error);
				
				//force remove containers instead of waiting for them to be automatically removed
				deployer.listContainers({ filters: filters }, function (error, containers) {
					if (error) return cb(error);
					
					async.each(containers, function (oneContainer, callback) {
						var containerOptions = {id: oneContainer.Id};
						lib.deleteContainer(deployer, containerOptions, callback);
					}, cb);
				});
			});
		});
	},

    addMongoInfo: function (services, mongoInfo, cb) {
        var mongoEnv = [];

        if(config.mongo.prefix && config.mongo.prefix !== ""){
	        mongoEnv.push('SOAJS_MONGO_PREFIX=' + config.mongo.prefix);
        }
        if (config.mongo.external) {
            // if (!config.dataLayer.mongo.url || !config.dataLayer.mongo.port) {
            if (!profile.servers[0].host || !profile.servers[0].port) {
                utilLog.log('ERROR: External Mongo information is missing URL or port, make sure SOAJS_MONGO_EXTERNAL_URL and SOAJS_MONGO_EXTERNAL_PORT are set ...');
                return cb('ERROR: missing mongo information');
            }

            mongoEnv.push('SOAJS_MONGO_NB=' + profile.servers.length);
            for(var i = 0; i < profile.servers.length; i++){
	            mongoEnv.push('SOAJS_MONGO_IP_' + (i + 1) + '=' + profile.servers[i].host);
	            mongoEnv.push('SOAJS_MONGO_PORT_' + (i + 1) + '=' + profile.servers[i].port);
            }

            if (profile.credentials && profile.credentials.username && profile.credentials.password) {
                mongoEnv.push('SOAJS_MONGO_USERNAME=' + profile.credentials.username);
                mongoEnv.push('SOAJS_MONGO_PASSWORD=' + profile.credentials.password);
                mongoEnv.push('SOAJS_MONGO_AUTH_DB=' + profile.URLParam.authSource);
            }

            if (profile.URLParam.ssl) {
                mongoEnv.push('SOAJS_MONGO_SSL=' + profile.URLParam.ssl);
            }
        }
        else {
        	//only one server in this case, internal mongo container id
	        mongoEnv.push('SOAJS_MONGO_NB=1');
	        mongoEnv.push('SOAJS_MONGO_IP_1=' + profile.servers[0].host);
	        mongoEnv.push('SOAJS_MONGO_PORT_1=' + profile.servers[0].port);
        }

        services.forEach(function (oneService) {
            oneService.TaskTemplate.ContainerSpec.Env = oneService.TaskTemplate.ContainerSpec.Env.concat(mongoEnv);
        });

        return cb(null, services);
    },

    inspectSwarm: function (deployer, cb) {
        deployer.swarmInspect(cb);
    },

    saveSwarmTokens: function (swarmInfo) {
        Object.keys(swarmInfo.JoinTokens).forEach(function (oneType) {
            config.docker.swarmConfig.tokens[oneType.toLowerCase()] = swarmInfo.JoinTokens[oneType];
        });
    },
	
    prepareSwarmNetwork: function (deployer, cb) {
        var netName = config.docker.network;
        var params = {}, found;
        params.filters = {
            type: {
                custom: true
            }
        };

        deployer.listNetworks(params, function (error, networks) {
            if (error) return cb(error);

            for (var i = 0; i < networks.length; i++) {
                if (networks[i].Name === netName) {
                    found = true;
                    break;
                }
            }

            if (found) {
                utilLog.log(netName + ' network found, proceeding ...');
                return cb(null, true);
            }
            else {
                utilLog.log(netName + ' network not found, creating ...');
                var networkParams = {
                    Name: netName,
                    Driver: 'overlay',
                    Internal: false,
                    CheckDuplicate: true,
                    EnableIPv6: false,
                    IPAM: {
                        Driver: 'default'
                    }
                };

                return deployer.createNetwork(networkParams, cb);
            }
        });
    },
	
	configureElastic: function (deployer, serviceOptions, cb) {
		lib.getServiceNames(serviceOptions.Name, deployer, serviceOptions.Mode.Replicated.Replicas, function (error, elasticIPs) {
			if (error) return cb(error);
			pingElastic(function () {
				utilLog.log('Configuring elasticsearch ...');
				async.parallel({
					"template": function (callback) {
						putTemplate(callback);
					},
					"settings": function (callback) {
						putSettings(callback);
					},
					"mapping": function (callback) {
						putMapping(callback);
					}
					
				}, function (err) {
					if (err) return cb(err);
					
					return cb(null, true);
				});
			});
		});
		
		function pingElastic(cb) {
			esClient.ping(function (error) {
				if (error) {
					lib.printProgress('Waiting for ' + serviceOptions.Name + ' server to become connected');
					setTimeout(function () {
						pingElastic(cb);
					}, 2000);
				}
				else {
					infoElastic(function (err) {
						return cb(err, true);
					})
				}
			});
		}
		
		function infoElastic(cb) {
			esClient.db.info(function (error) {
				if (error) {
					lib.printProgress('Waiting for ' + serviceOptions.Name + ' server to become available');
					setTimeout(function () {
						infoElastic(cb);
					}, 3000);
				}
				else {
					return cb(null, true);
				}
			});
		}
		
		function putTemplate(cb) {
			mongo.find('analytics', {_type: 'mapping'}, function (error, mappings) {
				if (error) return cb(error);
				async.each(mappings, function (oneMapping, callback) {
					var options = {
						'name': oneMapping._name,
						'body': oneMapping._json
					};
					esClient.db.indices.putTemplate(options, function (error) {
						return callback(error, true);
					});
				}, cb);
			});
		}
		
		function putMapping(cb) {
			var mapping = {
				index: '.kibana',
				type: 'dashboard',
				body: {
					"dashboard": {
						"properties": {
							"title": {"type": "string"},
							"hits": {"type": "integer"},
							"description": {"type": "string"},
							"panelsJSON": {
								"properties": {
									"type": {"type": "string"},
									"optionsJSON": {"type": "string"},
									"uiStateJSON": {"type": "string"},
									"version": {"type": "integer"},
									"timeRestore": {"type": "boolean"},
									"timeTo": {"type": "string"},
									"timeFrom": {"type": "string"},
									"kibanaSavedObjectMeta": {
										"properties": {
											"searchSourceJSON": {
												"type": "string"
											}
										}
									}
								}
							}
						}
					}
				}
			};
			var options= {
				index: '.kibana',
				type: 'dashboard'
			};
			
			esClient.db.indices.existsType(options, function (error, result) {
				if (error || !result) {
					esClient.db.indices.create(mapping, function (error) {
						return cb(error, true);
					});
				}
				else{
					return cb(null, true);
				}
			});
			
			
		}
		
		function putSettings(cb) {
			var condition = {
				"$and": [
					{
						"_type": "settings"
					}
				]
			};
			var criteria = {"$set": {"_env.dashboard": true}};
			if (dbConfiguration.dbs.es_clusters){
				criteria["$set"]._cluster = dbConfiguration.dbs.es_clusters;
			}
			var options = {
				"safe": true,
				"multi": false,
				"upsert": true
			};
			mongo.update('analytics', condition, criteria, options, function (error, body) {
				if (error) {
					return cb(error);
				}
				return cb(null, body)
			});
		}
		
	},
	
	configureKibana: function (deployer, serviceOptions, cb) {
		var dockerServiceName = serviceOptions.Name;
		var serviceGroup, serviceName, serviceEnv, serviceType;
		
		if (serviceOptions.Labels) {
			serviceGroup = serviceOptions.Labels['soajs.service.group'];
			serviceName = serviceOptions.Labels['soajs.service.repo.name'];
			serviceEnv = serviceOptions.Labels['soajs.env.code'];
		}
		if (serviceGroup === 'soajs-core-services') {
			serviceType = (serviceName === 'controller') ? 'controller' : 'service';
		}
		else if (serviceGroup === 'nginx') {
			serviceType = 'nginx';
			serviceName = 'nginx';
		}
		else {
			return cb(null, true);
		}
		var replicaCount = serviceOptions.Mode.Replicated.Replicas;
		utilLog.log('Fetching analytics for ' + serviceName);
		lib.getServiceNames(dockerServiceName, deployer, replicaCount, function (error, serviceIPs) {
			if (error) return cb(error);
			var options = {
				"$and": [
					{
						"_type": {
							"$in": ["dashboard", "visualization", "search"]
						}
					},
					{
						"_service": serviceType
					}
				]
				
			};
			var analyticsArray = [];
			serviceEnv.replace(/[\/*?"<>|,.-]/g, "_");
			//insert index-patterns to kibana
			serviceIPs.forEach(function (task_Name, key) {
				task_Name.name = task_Name.name.replace(/[\/*?"<>|,.-]/g, "_");
				
				//filebeat-service-environment-taskname-*
				
				analyticsArray = analyticsArray.concat(
					[
						{
							index: {
								_index: '.kibana',
								_type: 'index-pattern',
								_id: 'filebeat-' + serviceName + "-" + serviceEnv + "-" + task_Name.name + "-" + "*"
							}
						},
						{
							title: 'filebeat-' + serviceName + "-" + serviceEnv + "-" + task_Name.name + "-" + "*",
							timeFieldName: '@timestamp'
						}
					]
				);
				
				analyticsArray = analyticsArray.concat(
					[
						{
							index: {
								_index: '.kibana',
								_type: 'index-pattern',
								_id: 'topbeat-' + serviceName + "-" + serviceEnv + "-" + task_Name.name + "-" + "*"
							}
						},
						{
							title: 'topbeat-' + serviceName + "-" + serviceEnv + "-" + task_Name.name + "-" + "*",
							timeFieldName: '@timestamp'
						}
					]
				);
				
				analyticsArray = analyticsArray.concat(
					[
						{
							index: {
								_index: '.kibana',
								_type: 'index-pattern',
								_id: '*-' + serviceName + "-" + serviceEnv + "-" + task_Name.name + "-" + "*"
							}
						},
						{
							title: '*-' + serviceName + "-" + serviceEnv + "-" + task_Name.name + "-" + "*",
							timeFieldName: '@timestamp'
						}
					]
				);
				
				if (key == 0) {
					//filebeat-service-environment-*
					
					analyticsArray = analyticsArray.concat(
						[
							{
								index: {
									_index: '.kibana',
									_type: 'index-pattern',
									_id: 'filebeat-' + serviceName + "-" + serviceEnv + "-" + "*"
								}
							},
							{
								title: 'filebeat-' + serviceName + "-" + serviceEnv + "-" + "*",
								timeFieldName: '@timestamp'
							}
						]
					);
					
					analyticsArray = analyticsArray.concat(
						[
							{
								index: {
									_index: '.kibana',
									_type: 'index-pattern',
									_id: 'topbeat-' + serviceName + "-" + serviceEnv + "-" + "*"
								}
							},
							{
								title: 'topbeat-' + serviceName + "-" + serviceEnv + "-" + "*",
								timeFieldName: '@timestamp'
							}
						]
					);
					
					analyticsArray = analyticsArray.concat(
						[
							{
								index: {
									_index: '.kibana',
									_type: 'index-pattern',
									_id: '*-' + serviceName + "-" + serviceEnv + "-" + "*"
								}
							},
							{
								title: '*-' + serviceName + "-" + serviceEnv + "-" + "*",
								timeFieldName: '@timestamp'
							}
						]
					);
					
					//filebeat-service-environment-*
					
					
					analyticsArray = analyticsArray.concat(
						[
							{
								index: {
									_index: '.kibana',
									_type: 'index-pattern',
									_id: 'filebeat-' + serviceName + '-' + "*"
								}
							},
							{
								title: 'filebeat-' + serviceName + '-' + "*",
								timeFieldName: '@timestamp'
							}
						]
					);
					
					
					analyticsArray = analyticsArray.concat(
						[
							{
								index: {
									_index: '.kibana',
									_type: 'index-pattern',
									_id: 'topbeat-' + serviceName + "-" + "*"
								}
							},
							{
								title: 'topbeat-' + serviceName + "-" + "*",
								timeFieldName: '@timestamp'
							}
						]
					);
					
					
					analyticsArray = analyticsArray.concat(
						[
							{
								index: {
									_index: '.kibana',
									_type: 'index-pattern',
									_id: '*-' + serviceName + "-" + "*"
								}
							},
							{
								title: '*-' + serviceName + "-" + "*",
								timeFieldName: '@timestamp'
							}
						]
					);
				}
			});
			
			//insert visualization, search and deshbord rrecords per service  to kibana
			mongo.find(analyticsCollection, options, function (error, records) {
				if (error) {
					return cb(error);
				}
				records.forEach(function (oneRecord) {
					if (Array.isArray(serviceIPs) && serviceIPs.length > 0) {
						serviceIPs.forEach(function (task_Name) {
							task_Name.name = task_Name.name.replace(/[\/*?"<>|,.-]/g, "_");
							var serviceIndex;
							if (oneRecord._type === "visualization" || oneRecord._type === "search") {
								serviceIndex = serviceName + "-";
								if (oneRecord._injector === "service") {
									serviceIndex = serviceIndex + "*";
								}
								else if (oneRecord._injector === "env") {
									serviceIndex = serviceIndex + serviceEnv + "-" + "*";
								}
								else if (oneRecord._injector === "taskName") {
									serviceIndex = serviceIndex + serviceEnv + "-" + task_Name.name + "-" + "*";
								}
							}
							oneRecord = JSON.stringify(oneRecord);
							if (serviceIndex) {
								oneRecord = oneRecord.replace(/%serviceIndex%/g, serviceIndex);
							}
							oneRecord = oneRecord.replace(/%injector%/g, task_Name.name);
							oneRecord = JSON.parse(oneRecord);
							var recordIndex = {
								index: {
									_index: '.kibana',
									_type: oneRecord._type,
									_id: oneRecord.id
								}
							};
							
							analyticsArray = analyticsArray.concat([recordIndex, oneRecord._source]);
						});
					}
				});
				
				function esBulk(array, cb) {
					esClient.bulk(array, function (error, response) {
						if (error) {
							return cb(error)
						}
						return cb(error, response);
					});
				}
				
				if (analyticsArray.length !== 0) {
					esClient.checkIndex('.kibana', function (error, response) {
						if (error) {
							return cb(error);
						}
						if (response) {
							esBulk(analyticsArray, cb);
						}
						else {
							esClient.createIndex('.kibana', function (error) {
								if (error) {
									return cb(error);
								}
								esBulk(analyticsArray, cb);
							})
						}
					});
				}
				else {
					return cb(null, true);
				}
			});
		});
	},
	
	setDefaultIndex: function (cb) {
		//todo
		//remove hard coded id
		
		var index = {
			index: ".kibana",
			type: 'config',
			body: {
				doc: {"defaultIndex": "topbeat-nginx-dashboard-*"}
			}
		};
		var condition = {
			index: ".kibana",
			type: 'config'
		};
		esClient.db.search(condition, function (err, res){
			if (err) {
				return cb(err);
			}
			if (res && res.hits && res.hits.hits && res.hits.hits.length> 0){
				mongo.findOne(analyticsCollection, {"_type": "settings"}, function (err, result) {
					if (err) {
						return cb(err);
					}
					if (result && result._env && result._env.dashboard) {
						index.id = res.hits.hits[0]._id;
						esClient.db.update(index, cb);
					}
					else {
						return cb(null, true);
					}
				});
			}
			else{
				return cb(null, true);
			}
		});
		
	},
	
	closeDbCon: function (cb) {
		mongo.closeDb();
		if (esClient) {
			esClient.close();
		}
		return cb();
	}
};

module.exports = lib;
