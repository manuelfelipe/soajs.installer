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
					"port": 9200,
					"targetPort": 9200,
					"nodePort": ( 5000 + 9200 )
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
							"image": "elasticsearch:2.4.1",
							"command": ["elasticsearch", "-Des.insecure.allow.root=true"],
							"ports": [
								{
									
									"containerPort": 9200
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
