'use strict';

var gConfig = require("../../config.js");
var components = {
	service: {
		"apiVersion": "v1",
		"kind": "Service",
		"metadata": {
			"name": "elasticsearch",
			"labels": {
				"soajs.content": "true",
				"soajs.env.code": "dashboard",
				"soajs.service.name": "elasticsearch",
				"soajs.service.group": "elk",
				"soajs.service.label": "elasticsearch"
			}
		},
		"spec": {
			"type": "NodePort",
			"selector": {
				"soajs.service.label": "elasticsearch"
			},
			"ports": [
				{
					"protocol": "TCP",
					"port": 9200,
					"targetPort": 9200,
					"nodePort": 30920
				}
			]
		}
	},
	deployment: {
		"apiVersion": "extensions/v1beta1",
		"kind": "Deployment",
		"metadata": {
			"name": "elasticsearch",
			"labels": {
				"soajs.env.code": "dashboard",
				"soajs.service.name": "elasticsearch",
				"soajs.service.group": "elk",
				"soajs.service.label": "elasticsearch"
			}
		},
		"spec": {
			"replicas": 1,
			"selector": {
				"matchLabels": {
					"soajs.service.label": "elasticsearch"
				}
			},
			"template": {
				"metadata": {
					"name": "elasticsearch",
					"labels": {
						"soajs.service.name": "elasticsearch",
						"soajs.service.group": "elk",
						"soajs.service.label": "elasticsearch"
					}
				},
				"spec": {
					"containers": [
						{
							"name": "elasticsearch",
							"image": "elasticsearch:2.4.1",
							"imagePullPolicy": "IfNotPresent",
							"command": ["elasticsearch", "-Des.insecure.allow.root=true"],
							"ports": [
								{
									
									"containerPort": 9200
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
