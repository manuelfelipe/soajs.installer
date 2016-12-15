'use strict';

var config = {
    servName: 'kibana',
    servReplica: 1,
    servNetwork: [{Target: 'soajsnet'}],

    image: {
        prefix: '',
        name: 'kibana:4.6.2'
    },
    env: [],
    labels: {},
    command: [
        "kibana"
    ],
    exposedPorts: [
        {
            "Protocol": "tcp",
            "PublishedPort": 5601,
            "TargetPort": 5601
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
