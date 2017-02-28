'use strict';
var K8Api = require('kubernetes-client');
var async = require('async');

var path = require('path');
var fs = require('fs');
var Grid = require('gridfs-stream');
var exec = require('child_process').exec;
var soajs = require('soajs');
var request = require('request');

var config = require('./config.js');
var folder = config.folder;
delete require.cache[config.profile];
var profile = require(config.profile);
var mongo = new soajs.mongo(profile);
var analyticsCollection = 'analytics';
var dbConfiguration = require('../../../data/startup/environments/dashboard');

if (dbConfiguration.dbs.clusters.es_clusters) {
	if(dbConfiguration.dbs.clusters.es_clusters.analytics){
		delete dbConfiguration.dbs.clusters.es_clusters.analytics;
	}
	dbConfiguration.dbs.es_clusters.servers = [{
		"host": process.env.CONTAINER_HOST.toString(),
		"port": 30920
	}];
	var esClient = new soajs.es(dbConfiguration.dbs.es_clusters);
}
var utilLog = require('util');

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

    printProgress: function (message, counter) {
        process.stdout.clearLine();
        process.stdout.write(showTimestamp() + ' - ' + message + ' ' + showDots() + '\r');

        function showDots() {
            var output = '';
            var numOfDots = counter % 5;
            for (var i = 0; i < numOfDots; i++) { output += '.'; }
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

    getDeployer: function (deployerConfig, cb) {
        if(!config.kubernetes.certsPath){
	        return cb(new Error('No certificates found for remote machine.'));
        }
        var deployer = {};

        var certsName = {
            "ca": '/ca.pem',
            "cert": '/apiserver.pem',
            "key": '/apiserver-key.pem'
        };
        lib.loadCustomData(function(body){
            if(body.deployment.deployDriver === 'container.kubernetes.local' && process.platform === 'darwin'){
                certsName = {
                    "ca": '/ca.crt',
                    "cert": '/apiserver.crt',
                    "key": '/apiserver.key'
                };
            }

            deployerConfig.ca = fs.readFileSync(config.kubernetes.certsPath + certsName.ca);
            deployerConfig.cert = fs.readFileSync(config.kubernetes.certsPath + certsName.cert);
            deployerConfig.key = fs.readFileSync(config.kubernetes.certsPath + certsName.key);

            deployerConfig.version = 'v1beta1';
            deployer.extensions = new K8Api.Extensions(deployerConfig);

            deployerConfig.version = 'v1';
            deployer.core = new K8Api.Core(deployerConfig);
            return cb(null, deployer);
        });
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
        exec(execString, function (error, stdout, stderr) {
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
						platform: 'kubernetes',
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
						platform: 'kubernetes',
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
						platform: 'kubernetes',
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
	
	deployService: function (deployer, options, cb) {
		if (options.service) {
			deployer.core.namespaces.services.post({body: options.service}, function (error) {
				if (error) return cb(error);
				return createDeployment(function (err) {
					if (config.analytics) {
						if (options.deployment.metadata.name === "elasticsearch") {
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
			});
		}
		else {
			return createDeployment(cb);
		}
		function createDeployment(cb) {
			deployer.extensions.namespaces.deployments.post({body: options.deployment}, cb);
		}
	},
	
	deleteDeployments: function (deployer, options, cb) {
		var filter = { labelSelector: 'soajs.content=true', gracePeriodSeconds: 0 };
		deployer.extensions.namespaces.deployments.delete({qs: filter}, cb);
	},

    deleteKubeServices: function (deployer, options, cb) {
        var filter = { labelSelector: 'type=soajs-service' };
        deployer.core.namespaces.services.get({qs: filter}, function (error, serviceList) {
            if (error) return cb(error);

            async.each(serviceList.items, function (oneService, callback) {
                deployer.core.namespaces.services.delete({ name: oneService.metadata.name }, callback);
            }, cb);
        });
    },
	
	deletePods: function (deployer, options, cb) {
		//force delete all pods for a better cleanup
		var filter = { labelSelector: 'soajs.content=true', gracePeriodSeconds: 0 };
		deployer.core.namespaces.pods.delete({qs: filter}, cb);
	},
	
	deletePreviousServices: function (deployer, cb) {
		lib.deleteDeployments(deployer, {}, function (error) {
			if (error) return cb(error);
			
			lib.deleteKubeServices(deployer, {}, function (error) {
				if (error) return cb(error);
				
				lib.deletePods(deployer, {}, cb);
			});
		});
	},
	
	getServiceIPs: function (serviceName, deployer, replicaCount, counter, cb) {
		if (typeof (counter) === 'function') {
			cb = counter; //counter wasn't passed as param
			counter = 0;
		}
		
		deployer.core.namespaces.pods.get({}, function (error, podList) {
			if (error) return cb(error);
			var onePod, ips = [];
			if (podList && podList.items && Array.isArray(podList.items)) {
				podList.items.forEach(function (onePod) {
					if (onePod.metadata.labels['soajs.service.label'] === serviceName && onePod.status.phase === 'Running') {
						ips.push({
							name: onePod.metadata.name,
							ip: onePod.status.podIP
						});
					}
				});
			}
			
			if (ips.length !== replicaCount) {
				//pod containers may not be ready yet
				lib.printProgress('Waiting for ' + serviceName + ' containers to become available', counter++);
				setTimeout(function () {
					return lib.getServiceIPs(serviceName, deployer, replicaCount, counter, cb);
				}, 1000);
			}
			else {
				utilLog.log(""); //intentional, to force writting a new line.
				return cb(null, ips);
			}
		});
	},

    addMongoInfo: function (services, mongoInfo, cb) {
        var mongoEnv = [];

        if(config.mongo.prefix && config.mongo.prefix !== ""){
            mongoEnv.push({name: 'SOAJS_MONGO_PREFIX', value: config.mongo.prefix});
        }
	
	    if (config.mongo.external) {
		    if(config.mongo.rsName && config.mongo.rsName !== null){
			    mongoEnv.push({name: 'SOAJS_MONGO_RSNAME', value: config.mongo.rsName});
		    }
		    
            // if (!config.dataLayer.mongo.url || !config.dataLayer.mongo.port) {
            if (!profile.servers[0].host || !profile.servers[0].port) {
                utilLog.log('ERROR: External Mongo information is missing URL or port, make sure SOAJS_MONGO_EXTERNAL_URL and SOAJS_MONGO_EXTERNAL_PORT are set ...');
                return cb('ERROR: missing mongo information');
            }

            mongoEnv.push({ name: 'SOAJS_MONGO_NB', value: '' + profile.servers.length });
            for(var i = 0; i < profile.servers.length; i++){
                mongoEnv.push({name: 'SOAJS_MONGO_IP_' + (i + 1), value: profile.servers[i].host});
                mongoEnv.push({name: 'SOAJS_MONGO_PORT_' + (i + 1), value: '' + profile.servers[i].port});
            }

            if (profile.credentials && profile.credentials.username && profile.credentials.password) {
                mongoEnv.push({ name: 'SOAJS_MONGO_USERNAME', value: profile.credentials.username });
                mongoEnv.push({ name: 'SOAJS_MONGO_PASSWORD', value: profile.credentials.password });
                mongoEnv.push({ name: 'SOAJS_MONGO_AUTH_DB', value: profile.URLParam.authSource });
            }

            if(profile.URLParam.ssl){
                mongoEnv.push({ name: 'SOAJS_MONGO_SSL', value: profile.URLParam.ssl });
            }
        }
        else {
            mongoEnv.push({ name: 'SOAJS_MONGO_NB', value: '1' });
            mongoEnv.push({ name: 'SOAJS_MONGO_IP_1', value: profile.servers[0].host});
            mongoEnv.push({ name: 'SOAJS_MONGO_PORT_1', value: '27017'});
        }

        services.forEach(function (oneService) {
            oneService.deployment.spec.template.spec.containers[0].env = oneService.deployment.spec.template.spec.containers[0].env.concat(mongoEnv);
        });

        return cb(null, services);
    },
	
	configureElastic: function (deployer, serviceOptions, cb) {
		lib.getServiceIPs(serviceOptions.deployment.metadata.name , deployer, serviceOptions.deployment.spec.replicas, function (error, elasticIPs) {
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
					lib.printProgress('Waiting for ' + serviceOptions.deployment.metadata.name + ' server to become connected');
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
					lib.printProgress('Waiting for ' + serviceOptions.deployment.metadata.name+ ' server to become available');
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
			var options = {
				index: '.kibana',
				type: 'dashboard'
			};
			
			esClient.db.indices.existsType(options, function (error, result) {
				if (error || !result) {
					esClient.db.indices.create(mapping, function (error, result) {
						return cb(error, true);
					});
				}
				else {
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
			if (dbConfiguration.dbs.es_clusters) {
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
		var dockerServiceName = serviceOptions.deployment.metadata.name;
		var serviceGroup, serviceName, serviceEnv, serviceType;
		
		if (serviceOptions.deployment.metadata.labels) {
			serviceGroup = serviceOptions.deployment.metadata.labels['soajs.service.group'];
			serviceName = serviceOptions.deployment.metadata.labels['soajs.service.repo.name'];
			serviceEnv = serviceOptions.deployment.metadata.labels['soajs.env.code'];
		}
		if (serviceGroup === 'soajs-core-services') {
			serviceType = (serviceName === 'soajs_controller') ? 'soajs_controller' : 'service';
		}
		else if (serviceGroup === 'nginx') {
			serviceType = 'nginx';
			serviceName = 'nginx';
		}
		else {
			return cb(null, true);
		}
		var replicaCount = serviceOptions.deployment.spec.replicas;
		utilLog.log('Fetching analytics for ' + serviceName);
		lib.getServiceIPs(dockerServiceName, deployer, replicaCount, function (error, serviceIPs) {
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
