'use strict';
var gConfig = require("../../config.js");

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
			"ports": []
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
			"replicas": gConfig.kubernetes.replicas,
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
							"image": gConfig.imagePrefix + "/logstash",
							"imagePullPolicy": "IfNotPresent",
							"command": [
								"bash",
								"-c",
								"chown logstash:logstash /conf/logstash.conf; logstash -f /conf/logstash.conf"
							],
							"ports": []
						}
					]
				}
			}
		}
	}
};

module.exports = components;
