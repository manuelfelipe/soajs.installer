'use strict';

var components = {
	service: {
		"apiVersion": "v1",
		"kind": "Service",
		"metadata": {
			"name": "dashboard-soajsdata",
			"labels": {
				"soajs.content": "true",
				"soajs.env.code": "dashboard",
				"soajs.service.name": "soajsdata",
				"soajs.service.group": "elk",
				"soajs.service.label": "dashboard-soajsdata"
			}
		},
		"spec": {
			"type": "NodePort",
			"selector": {
				"soajs.service.label": "dashboard-soajsdata"
			},
			"ports": [
				{
					"protocol": "TCP",
					"port": 32601,
					"targetPort": 5601,
					"nodePort": 32601
				}
			]
		}
	},
	deployment: {
		"apiVersion": "extensions/v1beta1",
		"kind": "Deployment",
		"metadata": {
			"name": "dashboard-soajsdata",
			"labels": {
				"soajs.env.code": "dashboard",
				"soajs.service.name": "soajsdata",
				"soajs.service.group": "elk",
				"soajs.service.label": "dashboard-soajsdata"
			}
		},
		"spec": {
			"replicas": 1,
			"selector": {
				"matchLabels": {
					"soajs.service.label": "dashboard-soajsdata"
				}
			},
			"template": {
				"metadata": {
					"name": "dashboard-soajsdata",
					"labels": {
						"soajs.env.code": "dashboard",
						
						"soajs.service.name": "soajsdata",
						"soajs.service.group": "elk",
						"soajs.service.label": "dashboard-soajsdata"
					}
				},
				"spec": {
					"containers": [
						{
							"name": "dashboard-soajsdata",
							"image": "kibana:4.6.2",
							"imagePullPolicy": "IfNotPresent",
							"command": ["kibana"],
							"ports": [
								{
									"containerPort": 5601
								}
							]
						}
					]
				}
			}
		}
	}
};

module.exports = components;
