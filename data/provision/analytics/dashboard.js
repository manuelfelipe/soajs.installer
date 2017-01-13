'use strict';

var dashboards = [
	{
		"_id": "Nginx",
		"_type": "dashboard",
		"_source": {
			"title": "Nginx",
			"hits": 0,
			"description": "",
			"panelsJSON": "[{\"col\":1,\"id\":\"TimeStamp\",\"panelIndex\":1,\"row\":1,\"size_x\":5,\"size_y\":4,\"type\":\"visualization\"},{\"col\":8,\"id\":\"Bytes\",\"panelIndex\":2,\"row\":1,\"size_x\":5,\"size_y\":4,\"type\":\"visualization\"},{\"col\":1,\"id\":\"Top-10-IP's\",\"panelIndex\":3,\"row\":5,\"size_x\":4,\"size_y\":4,\"type\":\"visualization\"},{\"col\":5,\"id\":\"Agents\",\"panelIndex\":4,\"row\":5,\"size_x\":5,\"size_y\":4,\"type\":\"visualization\"},{\"col\":1,\"id\":\"Map\",\"panelIndex\":6,\"row\":9,\"size_x\":5,\"size_y\":5,\"type\":\"visualization\"},{\"col\":10,\"id\":\"Response-Codes\",\"panelIndex\":7,\"row\":5,\"size_x\":3,\"size_y\":4,\"type\":\"visualization\"},{\"col\":10,\"id\":\"Top-10-Requests\",\"panelIndex\":8,\"row\":9,\"size_x\":3,\"size_y\":5,\"type\":\"visualization\"},{\"col\":6,\"id\":\"Top-10-Countries\",\"panelIndex\":9,\"row\":9,\"size_x\":4,\"size_y\":5,\"type\":\"visualization\"},{\"id\":\"Top-10-Nginx-Errors\",\"type\":\"visualization\",\"panelIndex\":10,\"size_x\":5,\"size_y\":4,\"col\":1,\"row\":14},{\"id\":\"Sum-of-bytes\",\"type\":\"visualization\",\"panelIndex\":11,\"size_x\":2,\"size_y\":2,\"col\":6,\"row\":1},{\"id\":\"request-count\",\"type\":\"visualization\",\"panelIndex\":12,\"size_x\":2,\"size_y\":2,\"col\":6,\"row\":3}]",
			"optionsJSON": "{\"darkTheme\":false}",
			"uiStateJSON": "{\"P-4\":{\"spy\":{\"mode\":{\"fill\":false,\"name\":null}}},\"P-6\":{\"spy\":{\"mode\":{\"fill\":false,\"name\":null}}},\"P-8\":{\"spy\":{\"mode\":{\"fill\":false,\"name\":\"table\"}}},\"P-9\":{\"spy\":{\"mode\":{\"fill\":false,\"name\":null}}}}",
			"version": 1,
			"timeRestore": false,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"filter\":[{\"query\":{\"query_string\":{\"analyze_wildcard\":true,\"query\":\"*\"}}}]}"
			}
		}
	},
	{
		"_id": "Topbeat-Dashboard",
		"_type": "dashboard",
		"_source": {
			"hits": 0,
			"timeFrom": "now-15m",
			"timeRestore": true,
			"description": "",
			"title": "Topbeat-Dashboard",
			"uiStateJSON": "{}",
			"panelsJSON": "[{\"col\":1,\"id\":\"Navigation\",\"panelIndex\":1,\"row\":1,\"size_x\":3,\"size_y\":4,\"type\":\"visualization\"},{\"col\":4,\"id\":\"System-load\",\"panelIndex\":2,\"row\":1,\"size_x\":9,\"size_y\":4,\"type\":\"visualization\"},{\"col\":8,\"id\":\"Process-status\",\"panelIndex\":4,\"row\":5,\"size_x\":5,\"size_y\":4,\"type\":\"visualization\"},{\"col\":1,\"id\":\"Memory-usage\",\"panelIndex\":5,\"row\":9,\"size_x\":6,\"size_y\":4,\"type\":\"visualization\"},{\"col\":7,\"id\":\"CPU-usage\",\"panelIndex\":7,\"row\":9,\"size_x\":6,\"size_y\":4,\"type\":\"visualization\"},{\"col\":1,\"id\":\"CPU-usage-per-process\",\"panelIndex\":8,\"row\":13,\"size_x\":6,\"size_y\":4,\"type\":\"visualization\"},{\"col\":7,\"id\":\"Memory-usage-per-process\",\"panelIndex\":9,\"row\":13,\"size_x\":6,\"size_y\":4,\"type\":\"visualization\"},{\"col\":1,\"id\":\"Top-processes\",\"panelIndex\":10,\"row\":17,\"size_x\":6,\"size_y\":5,\"type\":\"visualization\"},{\"col\":1,\"id\":\"Servers\",\"panelIndex\":11,\"row\":5,\"size_x\":7,\"size_y\":4,\"type\":\"visualization\"},{\"col\":7,\"id\":\"Disk-utilization-over-time\",\"panelIndex\":12,\"row\":17,\"size_x\":6,\"size_y\":5,\"type\":\"visualization\"}]",
			"timeTo": "now",
			"optionsJSON": "{\"darkTheme\":false}",
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"filter\":[{\"query\":{\"query_string\":{\"analyze_wildcard\":true,\"query\":\"*\"}}}]}"
			}
		}
	},
	{
		"_id": "controller",
		"_type": "dashboard",
		"_source": {
			"title": "controller",
			"hits": 0,
			"description": "",
			"panelsJSON": "[{\"col\":1,\"id\":\"System-load-2\",\"panelIndex\":1,\"row\":7,\"size_x\":12,\"size_y\":3,\"type\":\"visualization\"},{\"col\":1,\"id\":\"Servers-2\",\"panelIndex\":3,\"row\":10,\"size_x\":6,\"size_y\":4,\"type\":\"visualization\"},{\"col\":7,\"id\":\"Memory-usage-per-process-2\",\"panelIndex\":5,\"row\":10,\"size_x\":6,\"size_y\":4,\"type\":\"visualization\"},{\"col\":7,\"id\":\"CPU-usage-per-process-2\",\"panelIndex\":6,\"row\":14,\"size_x\":6,\"size_y\":4,\"type\":\"visualization\"},{\"col\":1,\"id\":\"Top-processes-2\",\"panelIndex\":7,\"row\":14,\"size_x\":6,\"size_y\":4,\"type\":\"visualization\"},{\"col\":1,\"id\":\"Controller-top-10-errors\",\"panelIndex\":10,\"row\":1,\"size_x\":4,\"size_y\":4,\"type\":\"visualization\"},{\"col\":5,\"id\":\"Controller-top-10-Warnings\",\"panelIndex\":11,\"row\":1,\"size_x\":4,\"size_y\":4,\"type\":\"visualization\"},{\"col\":9,\"id\":\"Controller-top-10-Fatal\",\"panelIndex\":12,\"row\":1,\"size_x\":4,\"size_y\":4,\"type\":\"visualization\"},{\"col\":4,\"id\":\"date-time-picker\",\"panelIndex\":13,\"row\":5,\"size_x\":8,\"size_y\":2,\"type\":\"visualization\"}]",
			"optionsJSON": "{\"darkTheme\":false}",
			"uiStateJSON": "{}",
			"version": 1,
			"timeRestore": true,
			"timeTo": "2016-12-19T14:09:00.000Z",
			"timeFrom": "2016-12-19T14:00:00.000Z",
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"filter\":[{\"query\":{\"query_string\":{\"analyze_wildcard\":true,\"query\":\"*\"}}}]}"
			}
		}
	}
];

module.exports = dashboards;