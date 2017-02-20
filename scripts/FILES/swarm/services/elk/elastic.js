'use strict';
var gConfig = require("../../config.js");
var config = {
    servName: 'elasticsearch',
    servReplica: 1,
    servNetwork: [{Target: gConfig.docker.network}],

    image: {
        prefix: '',
        name: 'elasticsearch:2.4.1'
    },
    env: [],
    labels: {},
    command: [
        "elasticsearch",
        "-Des.insecure.allow.root=true"
    ],
    exposedPorts: [
        {
            "Protocol": "tcp",
            "PublishedPort": 9200,
            "TargetPort": 9200
        }
    ],
	mounts: [
		{
			"Type": "volume",
			"Source": gConfig.docker.volumes.log.label,
			"Target": gConfig.docker.volumes.log.path
		}
	]
};

module.exports = {
    "Name": config.servName,
    "TaskTemplate": {
        "ContainerSpec": {
            "Image": config.image.name,
            "Env": config.env,
            "Command": [config.command[0]],
            "Args": config.command.splice(1)
        },
        "Placement": {},
        "Resources": {
            "Limits": {
                "MemoryBytes": 524288000.0
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
