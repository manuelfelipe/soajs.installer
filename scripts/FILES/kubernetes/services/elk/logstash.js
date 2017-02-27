'use strict';
var gConfig = require("../../config.js");

var components = {
	service: {
		"apiVersion": "v1",
		"kind": "Service",
		"metadata": {
			"name": "logstash",
			"labels": {
				"soajs.content": "true",
				"soajs.env.code": "dashboard",
				"soajs.service.name": "logstash",
				"soajs.service.group": "elk",
				"soajs.service.label": "logstash"
			}
		},
		"spec": {
			"selector": {
				"soajs.service.label": "logstash"
			},
			"ports": [
				{
					"port": 12201,
					"targetPort": 12201
				}
			]
		}
	},
	deployment: {
		"apiVersion": "extensions/v1beta1",
		"kind": "Deployment",
		"metadata": {
			"name": "logstash",
			"labels": {
				"soajs.env.code": "dashboard",
				"soajs.service.name": "logstash",
				"soajs.service.group": "elk",
				"soajs.service.label": "logstash"
			}
		},
		"spec": {
			"replicas": gConfig.kubernetes.replicas,
			"selector": {
				"matchLabels": {
					"soajs.service.label": "logstash"
				}
			},
			"template": {
				"metadata": {
					"name": "logstash",
					"labels": {
						"soajs.service.name": "logstash",
						"soajs.service.group": "elk",
						"soajs.service.label": "logstash"
					}
				},
				"spec": {
					"containers": [
						{
							"name": "logstash",
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