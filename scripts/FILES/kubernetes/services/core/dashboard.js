'use strict';
var gConfig = require("../../config.js");

var components = {
    service: {
        "apiVersion": "v1",
        "kind": "Service",
        "metadata": {
            "name": "dashboard-dashboard-service",
            "labels": {
                "soajs.content": "true",
                "soajs.env.code": "dashboard",

                "soajs.service.name": "dashboard",
                "soajs.service.group": "soajs-core-services",
                "soajs.service.type": "service",
                "soajs.service.version": "1",
                "soajs.service.label": "dashboard-dashboard"
            }
        },
        "spec": {
            "selector": {
                "soajs.service.label": "dashboard-dashboard"
            },
            "ports": [
                {
                    "name": "service-port",
                    "protocol": "TCP",
                    "port": 4003,
                    "targetPort": 4003
                },
                {
                    "name": "maintenance-port",
                    "protocol": "TCP",
                    "port": 5003,
                    "targetPort": 5003
                }
            ]
        }
    },
    deployment: {
        "apiVersion": "extensions/v1beta1",
        "kind": "Deployment",
        "metadata": {
            "name": "dashboard-dashboard",
            "labels": {
                "soajs.content": "true",
                "soajs.env.code": "dashboard",

                "soajs.service.name": "dashboard",
                "soajs.service.group": "soajs-core-services",
                "soajs.service.type": "service",
                "soajs.service.version": "1",
                "soajs.service.label": "dashboard-dashboard"
            }
        },
        "spec": {
            "replicas": gConfig.kubernetes.replicas,
            "selector": {
                "matchLabels": {
                    "soajs.service.label": "dashboard-dashboard"
                }
            },
            "template": {
                "metadata": {
                    "name": "dashboard-dashboard",
                    "labels": {
                        "soajs.content": "true",
                        "soajs.env.code": "dashboard",

                        "soajs.service.name": "dashboard",
                        "soajs.service.group": "soajs-core-services",
                        "soajs.service.type": "service",
                        "soajs.service.version": "1",
                        "soajs.service.label": "dashboard-dashboard"
                    }
                },
                "spec": {
                    "containers": [
                        {
                            "name": "dashboard-dashboard",
	                        "image": gConfig.imagePrefix + "/soajs",
                            "imagePullPolicy": gConfig.imagePullPolicy,
                            "workingDir": "/opt/soajs/FILES/deployer/",
                            "command": ["./soajsDeployer.sh"],
                            "args": ["-T", "service", "-X", "deploy", "-L"],
                            "env": [
                                {
                                    "name": "NODE_ENV",
                                    "value": "production"
                                },
                                {
                                    "name": "SOAJS_ENV",
                                    "value": "dashboard"
                                },
                                {
                                    "name": "SOAJS_PROFILE",
                                    "value": "/opt/soajs/FILES/profiles/profile.js"
                                },
                                {
                                    "name": "SOAJS_SRV_AUTOREGISTERHOST",
                                    "value": "true"
                                },
                                {
                                    "name": "SOAJS_GIT_OWNER",
                                    "value": "soajs"
                                },
                                {
                                    "name": "SOAJS_GIT_BRANCH",
                                    "value": gConfig.git.branch
                                },
                                {
                                    "name": "SOAJS_GIT_REPO",
                                    "value": "soajs.dashboard"
                                },
                                {
                                    "name": "SOAJS_DEPLOY_HA",
                                    "value": "kubernetes"
                                },
                                {
                                    "name": "SOAJS_HA_IP",
                                    "valueFrom": {
                                        "fieldRef": {
                                            "fieldPath": "status.podIP"
                                        }
                                    }
                                },
                                {
                                    "name": "SOAJS_HA_NAME",
                                    "valueFrom": {
                                        "fieldRef": {
                                            "fieldPath": "metadata.name"
                                        }
                                    }
                                }
                            ],
                            "volumeMounts": [
                                {
                                    "mountPath": gConfig.kubernetes.volumes.log.path,
                                    "name": gConfig.kubernetes.volumes.log.label
                                }
                            ]
                        }
                    ],
                    "volumes": [
                        {
                            "name": gConfig.kubernetes.volumes.log.label,
                            "hostPath": {
                                "path": gConfig.kubernetes.volumes.log.path
                            }
                        }
                    ]
                }
            }
        }
    }
};

module.exports = components;
