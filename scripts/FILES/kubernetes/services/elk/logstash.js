'use strict';
var gConfig = require("../../config.js");

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
			"ports": []
		}
	},
	deployment: {
		"apiVersion": "extensions/v1beta1",
		"kind": "Deployment",
		"metadata": {
			"name": "dashboard-soajsdata"
		},
		"spec": {
			"replicas": gConfig.kubernetes.replicas,
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
							"image": gConfig.imagePrefix + "/logstash",
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
