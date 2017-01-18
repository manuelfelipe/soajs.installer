/**
 * Created by ragheb on 1/17/17.
 */
'use strict';
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
			"ports": [
				{
					"protocol": "TCP",
					"port": 12201,
					"targetPort": 12201,
					"nodePort": ( 12201 + 9200 )
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
							"image": gConfig.imagePrefix + "/filebeat",
							"imagePullPolicy": "IfNotPresent",
							"command": [
								"bash",
								"-c",
								"chown filebeat:filebeat /etc/filebeat/filebeat.yml; filebeat -f /etc/filebeat/filebeat.yml"
							],
							"ports": [
								{
									
									"containerPort": 12201
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
