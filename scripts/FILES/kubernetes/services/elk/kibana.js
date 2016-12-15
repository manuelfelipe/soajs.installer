'use strict';

var components = {
	service: {
		"apiVersion": "v1",
		"kind": "Service",
		"metadata": {
			"name": "dashboard-soajsdata",
			"labels": {
				"type": "soajs-service"
			}
		},
		"spec": {
			"type": "NodePort",
			"selector": {
				"soajs-app": "dashboard-soajsdata"
			},
			"ports": [
				{
					"protocol": "TCP",
					"port": 5601,
					"targetPort": 5601,
					"nodePort": ( 5000 + 5601 )
				}
			]
		}
	},
	deployment: {
		"apiVersion": "extensions/v1beta1",
		"kind": "Deployment",
		"metadata": {
			"name": "dashboard-soajsdata"
		},
		"spec": {
			"replicas": 1,
			"selector": {
				"matchLabels": {
					"soajs-app": "dashboard-soajsdata"
				}
			},
			"template": {
				"metadata": {
					"name": "dashboard-soajsdata",
					"labels": {
						"soajs-app": "dashboard-soajsdata"
					}
				},
				"spec": {
					"containers": [
						{
							"name": "dashboard-soajsdata",
							"image": "kibana:4.6.2",
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
