'use strict';
//done
var topbeat = [
	{
		"id": "Topbeat-%taskName%",
		"_type": "dashboard",
		"_shipper": "topbeat",
		"_service": "controller",
		"_injector": "taskname",
		"_source": {
			"title": "Metrics-%taskName%",
			"hits": 0,
			"description": "",
			"panelsJSON": "[{\"col\":1,\"id\":\"System-load-%taskName%\",\"panelIndex\":2,\"row\":1,\"size_x\":12,\"size_y\":4,\"type\":\"visualization\"},{\"col\":7,\"id\":\"Process-status-%taskName%\",\"panelIndex\":4,\"row\":5,\"size_x\":6,\"size_y\":4,\"type\":\"visualization\"},{\"col\":1,\"id\":\"Memory-usage-%taskName%\",\"panelIndex\":5,\"row\":9,\"size_x\":6,\"size_y\":4,\"type\":\"visualization\"},{\"col\":7,\"id\":\"CPU-usage-%taskName%\",\"panelIndex\":7,\"row\":9,\"size_x\":6,\"size_y\":4,\"type\":\"visualization\"},{\"col\":1,\"id\":\"CPU-usage-per-process-%taskName%\",\"panelIndex\":8,\"row\":13,\"size_x\":6,\"size_y\":4,\"type\":\"visualization\"},{\"col\":7,\"id\":\"Memory-usage-per-process-%taskName%\",\"panelIndex\":9,\"row\":13,\"size_x\":6,\"size_y\":4,\"type\":\"visualization\"},{\"col\":1,\"id\":\"Top-processes-%taskName%\",\"panelIndex\":10,\"row\":17,\"size_x\":6,\"size_y\":5,\"type\":\"visualization\"},{\"col\":1,\"id\":\"Servers-%taskName%\",\"panelIndex\":11,\"row\":5,\"size_x\":6,\"size_y\":4,\"type\":\"visualization\"},{\"col\":7,\"id\":\"Disk-utilization-over-time-%taskName%\",\"panelIndex\":12,\"row\":17,\"size_x\":6,\"size_y\":5,\"type\":\"visualization\"},{\"id\":\"Disk-usage-%taskName%\",\"type\":\"visualization\",\"panelIndex\":13,\"size_x\":6,\"size_y\":4,\"col\":1,\"row\":22},{\"id\":\"Disk-usage-overview-%taskName%\",\"type\":\"visualization\",\"panelIndex\":14,\"size_x\":6,\"size_y\":4,\"col\":7,\"row\":22}]",
			"optionsJSON": "{\"darkTheme\":false}",
			"uiStateJSON": "{}",
			"version": 1,
			"timeRestore": false,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"filter\":[{\"query\":{\"query_string\":{\"analyze_wildcard\":true,\"query\":\"*\"}}}]}"
			}
		}
	}
];

module.exports = topbeat;