/**
 * Created by ragheb on 1/17/17.
 */
'use strict';
'use strict';
var gConfig = require("../../config.js");

var components = {
	deployment: {
		"apiVersion": "extensions/v1beta1",
		"kind": "Deployment",
		"metadata": {
			"name": "filebeat",
			"labels": {
				"soajs.env.code": "dashboard",
				"soajs.service.name": "filebeat",
				"soajs.service.group": "elk",
				"soajs.service.label": "filebeat"
			}
		},
		"spec": {
			"replicas": 1,
			"selector": {
				"matchLabels": {
					"soajs.service.label": "filebeat"
				}
			},
			"template": {
				"metadata": {
					"name": "filebeat",
					"labels": {
						"soajs.env.code": "dashboard",
						"soajs.service.name": "filebeat",
						"soajs.service.group": "elk",
						"soajs.service.label": "filebeat"
					}
				},
				"spec": {
					"containers": [
						{
							"name": "filebeat",
							"image": gConfig.imagePrefix + "/filebeat",
							"imagePullPolicy": "IfNotPresent",
							"command": [
								"filebeat",  "-e",  "-c", "/etc/filebeat/filebeat.yml"
							],
							"ports": [
								{
									
									"containerPort": 12201
								}
							],
							"env": [
								{
									"name": "SOAJS_ENV",
									"value": "dashboard"
								},
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
