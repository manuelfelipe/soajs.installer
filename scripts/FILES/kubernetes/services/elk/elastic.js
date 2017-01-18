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
							"image": "elasticsearch:2.4.1",
							"imagePullPolicy": "IfNotPresent",
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
