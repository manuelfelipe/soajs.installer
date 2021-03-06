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
var folder = config.folder;
delete require.cache[config.profile];
var profile = require(config.profile);
var mongo = new soajs.mongo(profile);

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

    deployService: function (deployer, options, cb) {
        deployer.createService(options, cb);
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

    getServiceIPs: function (serviceName, deployer, replicaCount, counter, cb) {
        if (typeof (counter) === 'function') {
            cb = counter; //counter wasn't passed as param
            counter = 0;
        }

        var network = deployer.getNetwork(config.docker.network);
        network.inspect(function (error, result) {
            if (error) return cb(error);

            var oneContainer, ips = [];
            for (var cid in result.Containers) {
                oneContainer = result.Containers[cid];
                if (oneContainer.Name.indexOf(serviceName) !== -1) {
                    ips.push({
                        name: oneContainer.Name,
                        ip: oneContainer.IPv4Address.substring(0, oneContainer.IPv4Address.indexOf('/'))
                    });
                }
            }

            if (ips.length !== replicaCount) {
                //Containers may not have been attached to network yet
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
	        mongoEnv.push('SOAJS_MONGO_PREFIX=' + config.mongo.prefix);
        }
        
        if (config.mongo.external) {
	        if(config.mongo.rsName && config.mongo.rsName !== ""){
		        mongoEnv.push('SOAJS_MONGO_RSNAME=' + config.mongo.rsName);
	        }
	        
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


    closeDbCon: function (cb) {
        mongo.closeDb();
        return cb();
    }
};

module.exports = lib;
