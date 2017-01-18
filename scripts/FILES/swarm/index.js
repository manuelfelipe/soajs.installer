'use strict';
var Docker = require('dockerode');
var async = require('async');
var fs = require('fs');
var exec = require('child_process').exec;
var soajs = require('soajs');
var request = require('request');

var config = require('./config.js');
var folder = config.folder;
delete require.cache[config.profile];
var profile = require(config.profile);
var mongo = new soajs.mongo(profile);
var analyticsCollection = 'analytics';
var utilLog = require('util');
var dbConfiguration = require('../../../data/startup/environments/dashboard');
if (dbConfiguration.dbs.es_clusters) {
	var esClient = new soajs.es(dbConfiguration.dbs.es_clusters);
}
var lib = {
	
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
			if (!config.docker.certsPath) {
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
		
		async.eachSeries(services, function (oneService, callback) {
			lib.deployService(deployer, oneService, callback);
		}, cb);
	},
	
	importData: function (mongoInfo, cb) {
		utilLog.log('Importing provision data to:', profile.servers[0].host + ":" + profile.servers[0].port);
		var dataImportFile = __dirname + "/../dataImport/index.js";
		var execString = process.env.NODE_PATH + " " + dataImportFile;
		exec(execString, cb);
	},
	
	deployService: function (deployer, options, cb) {
		deployer.createService(options, function (error, result) {
			if (options.Name === 'elasticsearch') {
				lib.configureElastic(deployer, options, cb);
			}
			else {
				lib.configureKibana(deployer, options, cb);
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
		//TODO: only remove SOAJS services
		deployer.listServices({}, function (error, services) {
			if (error) return cb(error);
			
			async.each(services, function (oneService, callback) {
				var serviceOptions = {id: oneService.ID};
				lib.deleteService(deployer, serviceOptions, callback);
			}, function (error, result) {
				if (error) return cb(error);
				
				//force remove containers instead of waiting for them to be automatically removed
				//TODO: only remove SOAJS containers
				deployer.listContainers({}, function (error, containers) {
					if (error) return cb(error);
					
					async.each(containers, function (oneContainer, callback) {
						var containerOptions = {id: oneContainer.Id};
						lib.deleteContainer(deployer, containerOptions, callback);
					}, cb);
				});
			});
		});
	},
	
	getServiceIPs: function (serviceName, deployer, replicaCount, counter, cb) {
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
					return lib.getServiceIPs(serviceName, deployer, replicaCount, counter, cb);
				}, 1000);
			}
			else {
				utilLog.log(""); //intentional, to force writting a new line.
				return cb(null, oneContainer);
			}
		});
	},
	
	addMongoInfo: function (services, mongoInfo, cb) {
		var mongoEnv = [];
		
		if (config.mongo.prefix && config.mongo.prefix !== "") {
			mongoEnv.push('SOAJS_MONGO_PREFIX=' + config.mongo.prefix);
		}
		if (config.mongo.external) {
			// if (!config.dataLayer.mongo.url || !config.dataLayer.mongo.port) {
			if (!profile.servers[0].host || !profile.servers[0].port) {
				utilLog.log('ERROR: External Mongo information is missing URL or port, make sure SOAJS_MONGO_EXTERNAL_URL and SOAJS_MONGO_EXTERNAL_PORT are set ...');
				return cb('ERROR: missing mongo information');
			}
			
			mongoEnv.push('SOAJS_MONGO_NB=' + profile.servers.length);
			for (var i = 0; i < profile.servers.length; i++) {
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
		var elasticURL;
		if (config.elasticsearch) {
			elasticURL = 'http://';
			if (config.elasticsearch.username && config.elasticsearch.password) {
				elasticURL += config.elasticsearch.username + ':' + config.elasticsearch.password + '@';
			}
			elasticURL += config.elasticsearch.url + ':' + config.elasticsearch.port;
		}
		else {
			elasticURL = 'http://' + config.docker.machineIP + ':' + serviceOptions.EndpointSpec.Ports[0].PublishedPort;
		}
		
		lib.getServiceIPs(serviceOptions.Name, deployer, serviceOptions.Mode.Replicated.Replicas, function (error, elasticIPs) {
			if (error) return cb(error);
			
			pingElastic(0, function () {
				utilLog.log('Configuring elasticsearch ...');
				async.parallel({
					"mapping": function (callback) {
						putMapping(callback);
					},
					"settings": function (callback) {
						putSettings(callback);
					}
					
				}, function (err) {
					if (err) return cb(err);
					
					return cb(null, true);
				});
			});
		});
		function pingElastic(counter, cb) {
			var options = {
				method: 'GET',
				uri: elasticURL
			};
			request(options, function (error, response, body) {
				if (error && (error.code === 'ECONNREFUSED' || error.code === 'ECONNRESET')) {
					lib.printProgress('Waiting for ' + serviceOptions.Name + ' server to become available', counter++);
					setTimeout(function () {
						return pingElastic(counter, cb);
					}, 1000);
				}
				else {
					return cb(null, true);
				}
			});
		}
		
		function putMapping(cb) {
			mongo.find('analytics', {_type: 'mapping'}, function (error, mappings) {
				if (error) return cb(error);
				async.each(mappings, function (oneMapping, callback) {
					var options = {
						method: 'PUT',
						uri: elasticURL + '/_template/' + oneMapping._name + '/',
						json: true,
						body: oneMapping._json
					};
					request(options, function (error, response, body) {
						return callback(error, body);
					});
				}, cb);
			});
		}
		
		function putSettings(cb) {
			var condition = {
				"$and": [
					{
						"_type": "settings"
					},
					{
						"_json.env": "dashboard"
					}
				]
			};
			var criteria = {"$set": {"_json.enabled": "true"}};
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
		var info = {};
		var dockerServiceName = serviceOptions.Name;
		var serviceGroup, serviceName, serviceEnv;
		
		if (serviceOptions.Labels) {
			serviceGroup = serviceOptions.Labels['soajs.service.group'];
			serviceName = serviceOptions.Labels['soajs.service'];
			serviceEnv = serviceOptions.Labels['soajs.env'];
		}
		
		if (serviceGroup === 'core') {
			info.type = (serviceName === 'controller') ? 'controller' : 'service';
		}
		else if (serviceGroup === 'nginx') {
			info.type = 'nginx';
		}
		else {
			return cb(null, true);
		}
		
		var replicaCount = serviceOptions.Mode.Replicated.Replicas;
		
		utilLog.log('Fetching analytics for ' + serviceName);
		info.env = serviceEnv;
		info.running = true;
		info.recordType = 'container';
		
		lib.getServiceIPs(dockerServiceName, deployer, replicaCount, function (error, serviceIPs) {
			if (error) return cb(error);
			var options = {
				"$and": [
					{
						"_type": {
							"$in": ["dashboard", "visualization", "searches"]
						}
					},
					{
						"_service": serviceGroup
					}
				]
				
			};
			var analyticsArray = [];
			// var index_Pattern = {
			// 	index: {
			// 		_index: '.kibana',
			// 		_type: 'index-pattern',
			// 		_id: '4.6.2'
			//
			// 	}
			// };
			// serviceIPs.forEach(function (task_Name, key) {
			// 	if (key == 0) {
			// 		var body= {
			// 			title: 'filebeat' + '-' + serviceIndex,
			// 			timeFieldName: '@timestamp'
			// 		};
			// 		analyticsArray = analyticsArray.concat([index_Pattern, oneRecord._source]);
			// 	}
			// });

			mongo.find(analyticsCollection, options, function (error, records) {
				if (error) {
					return cb(error);
				}
				records.forEach(function (oneRecord) {
					if (Array.isArray(serviceIPs) && serviceIPs.length > 0) {
						serviceIPs.forEach(function (task_Name) {
							oneRecord = JSON.stringify(oneRecord);
							oneRecord = oneRecord.replace(/%taskName%/g, task_Name.name);
							
							if (oneRecord._type === "visualization" || oneRecord._type === "search") {
								var serviceIndex = serviceName + "-";
								if (oneRecord._injector === "service") {
									serviceIndex = serviceIndex + "*";
								}
								else if (oneRecord._injector === "env") {
									serviceIndex = serviceIndex + serviceEnv + "-" + "*";
								}
								else if (oneRecord._injector === "taskName") {
									serviceIndex = serviceIndex + serviceEnv + "-" + task_Name.name + "-" + "*";
								}
								oneRecord = oneRecord.replace(/%serviceIndex%/g, serviceIndex);
							}
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
				if (analyticsArray.length !== 0) {
					esClient.checkIndex('.kibana', function (error, response) {
						if (error) {
							return cb(error);
						}
						if (response) {
							esClient.bulk(analyticsArray, function (error, response) {
								return cb(error, response);
							});
						}
						else {
							esClient.createIndex('.kibana', function (error, response) {
								if (error) {
									return cb(error);
								}
								esClient.bulk(analyticsArray, function (error, response) {
									return cb(error, true);
								});
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
			index: {
				_index: '.kibana',
				_type: 'config',
				_id: '4.6.2'
			}
		};
		var body = {"defaultIndex": "topbeat*"};
		var record = [index, body];
		mongo.findOne(analyticsCollection, {"_type": "settings"}, function (err, result) {
			if (err) {
				return cb(err);
			}
			if (result && result._json && result._json.enabled) {
				esClient.bulk(record, function (err) {
					if (err) {
						console.log(err)
						return cb(err);
					}
					return cb();
				})
			}
			else {
				return cb();
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
