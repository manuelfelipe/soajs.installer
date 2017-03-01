'use strict';
var gConfig = require("../../config.js");
var config = {
    servName: 'logstash',
    servReplica: 1,
    servNetwork: [{Target: gConfig.docker.network}],

    image: {
        prefix: gConfig.imagePrefix,
        name: 'logstash'
    },
    env: [],
    labels: {
	    "soajs.content": "true",
	    "soajs.env.code": "dashboard",
	    "soajs.service.type": "elk",
	    "soajs.service.name": "dashboard-logstash",
	    "soajs.service.group": "elk",
	    "soajs.service.label": "dashboard-logstash"
    },
    command: [
        "bash",
        "-c",
        "chown logstash:logstash /conf/logstash.conf; logstash -f /conf/logstash.conf"
    ],
    exposedPorts: []
};

var elasticURL = '';
if (process.env.SOAJS_ELASTIC_EXTERNAL && process.env.SOAJS_ELASTIC_EXTERNAL_URL && process.env.SOAJS_ELASTIC_EXTERNAL_PORT) {
    elasticURL = process.env.SOAJS_ELASTIC_EXTERNAL_URL + ':' + process.env.SOAJS_ELASTIC_EXTERNAL_PORT + '/';
    if (process.env.SOAJS_ELASTIC_USERNAME && process.env.SOAJS_ELASTIC_PASSWORD) {
        elasticURL = 'http://' + process.env.SOAJS_ELASTIC_USERNAME + ':' + process.env.SOAJS_ELASTIC_PASSWORD + '@' + elasticURL;
    }

    config.env.push('SOAJS_ELASTIC_EXTERNAL_URL=' + elasticURL);
}

module.exports = {
    "Name": config.servName,
    "TaskTemplate": {
        "ContainerSpec": {
            "Image": config.image.prefix + '/' + config.image.name,
            "Env": config.env,
            "Command": [config.command[0]],
            "Args": config.command.splice(1)
        },
        "Placement": {},
        "Resources": {
            "Limits": {
                "MemoryBytes": 209715200.0
            }
        },
        "RestartPolicy": {
            "Condition": "any",
            "MaxAttempts": 5
        }
    },
    "Mode": {
        "Replicated": {
            "Replicas": config.servReplica
        }
    },
    "UpdateConfig": {
        "Delay": 500.0,
        "Parallelism": 2,
        "FailureAction": "pause"
    },
    "Networks": config.servNetwork,
    "EndpointSpec": {
        "Mode": "vip",
        "Ports": config.exposedPorts
    },
    "Labels": config.labels
};
