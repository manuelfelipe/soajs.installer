'use strict';

var searches = [
	{
		"_id": "System-stats-2",
		"_type": "search",
		"_source": {
			"title": "System stats",
			"description": "",
			"hits": 0,
			"columns": [
				"_source"
			],
			"sort": [
				"@timestamp",
				"desc"
			],
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"index\":\"*-controller-*\",\"query\":{\"query_string\":{\"query\":\"type: system\",\"analyze_wildcard\":true}},\"highlight\":{\"pre_tags\":[\"@kibana-highlighted-field@\"],\"post_tags\":[\"@/kibana-highlighted-field@\"],\"fields\":{\"*\":{}},\"require_field_match\":false,\"fragment_size\":2147483647},\"filter\":[]}"
			}
		}
	},
	{
		"_id": "System-wide-2",
		"_type": "search",
		"_source": {
			"title": "System wide",
			"description": "",
			"hits": 0,
			"columns": [
				"beat.name",
				"cpu.user_p",
				"cpu.steal",
				"load.load1",
				"load.load5",
				"mem.used",
				"mem.used_p"
			],
			"sort": [
				"@timestamp",
				"desc"
			],
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"index\":\"*-controller-*\",\"query\":{\"query_string\":{\"query\":\"*\",\"analyze_wildcard\":true}},\"highlight\":{\"pre_tags\":[\"@kibana-highlighted-field@\"],\"post_tags\":[\"@/kibana-highlighted-field@\"],\"fields\":{\"*\":{}},\"fragment_size\":2147483647},\"filter\":[{\"meta\":{\"negate\":false,\"index\":\"topbeat-*\",\"key\":\"type\",\"value\":\"system\",\"disabled\":false},\"query\":{\"match\":{\"type\":{\"query\":\"system\",\"type\":\"phrase\"}}}}]}"
			}
		}
	},
	{
		"_id": "Processes-2",
		"_type": "search",
		"_source": {
			"title": "Processes",
			"description": "",
			"hits": 0,
			"columns": [
				"proc.name",
				"proc.cpu.user_p",
				"proc.mem.rss_p",
				"proc.mem.rss",
				"proc.state",
				"proc.cpu.start_time"
			],
			"sort": [
				"@timestamp",
				"desc"
			],
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"index\":\"*-controller-*\",\"query\":{\"query_string\":{\"query\":\"*\",\"analyze_wildcard\":true}},\"highlight\":{\"pre_tags\":[\"@kibana-highlighted-field@\"],\"post_tags\":[\"@/kibana-highlighted-field@\"],\"fields\":{\"*\":{}},\"fragment_size\":2147483647},\"filter\":[{\"meta\":{\"negate\":false,\"index\":\"topbeat-*\",\"key\":\"type\",\"value\":\"proc\",\"disabled\":false},\"query\":{\"match\":{\"type\":{\"query\":\"proc\",\"type\":\"phrase\"}}}}]}"
			}
		}
	},
	{
		"_id": "Filesystem-stats-2",
		"_type": "search",
		"_source": {
			"title": "Filesystem stats",
			"description": "",
			"hits": 0,
			"columns": [
				"_source"
			],
			"sort": [
				"@timestamp",
				"desc"
			],
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"index\":\"*-controller-*\",\"query\":{\"query_string\":{\"query\":\"type: filesystem\",\"analyze_wildcard\":true}},\"highlight\":{\"pre_tags\":[\"@kibana-highlighted-field@\"],\"post_tags\":[\"@/kibana-highlighted-field@\"],\"fields\":{\"*\":{}},\"require_field_match\":false,\"fragment_size\":2147483647},\"filter\":[]}"
			}
		}
	},
	{
		"_id": "Proc-stats-2",
		"_type": "search",
		"_source": {
			"title": "Proc stats",
			"description": "",
			"hits": 0,
			"columns": [
				"_source"
			],
			"sort": [
				"@timestamp",
				"desc"
			],
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"index\":\"*-controller-*\",\"query\":{\"query_string\":{\"query\":\"type: process\",\"analyze_wildcard\":true}},\"highlight\":{\"pre_tags\":[\"@kibana-highlighted-field@\"],\"post_tags\":[\"@/kibana-highlighted-field@\"],\"fields\":{\"*\":{}},\"require_field_match\":false,\"fragment_size\":2147483647},\"filter\":[]}"
			}
		}
	},
	{
		"_id": "Filesystem-stats",
		"_type": "search",
		"_source": {
			"sort": [
				"@timestamp",
				"desc"
			],
			"hits": 0,
			"description": "",
			"title": "Filesystem stats",
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"index\":\"topbeat-*\",\"query\":{\"query_string\":{\"query\":\"type: filesystem\",\"analyze_wildcard\":true}},\"highlight\":{\"pre_tags\":[\"@kibana-highlighted-field@\"],\"post_tags\":[\"@/kibana-highlighted-field@\"],\"fields\":{\"*\":{}},\"require_field_match\":false,\"fragment_size\":2147483647},\"filter\":[]}"
			},
			"columns": [
				"_source"
			]
		}
	},
	{
		"_id": "Proc-stats",
		"_type": "search",
		"_source": {
			"sort": [
				"@timestamp",
				"desc"
			],
			"hits": 0,
			"description": "",
			"title": "Proc stats",
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"index\":\"topbeat-*\",\"query\":{\"query_string\":{\"query\":\"type: process\",\"analyze_wildcard\":true}},\"highlight\":{\"pre_tags\":[\"@kibana-highlighted-field@\"],\"post_tags\":[\"@/kibana-highlighted-field@\"],\"fields\":{\"*\":{}},\"require_field_match\":false,\"fragment_size\":2147483647},\"filter\":[]}"
			},
			"columns": [
				"_source"
			]
		}
	},
	{
		"_id": "Processes",
		"_type": "search",
		"_source": {
			"sort": [
				"@timestamp",
				"desc"
			],
			"hits": 0,
			"description": "",
			"title": "Processes",
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"index\":\"topbeat-*\",\"query\":{\"query_string\":{\"query\":\"*\",\"analyze_wildcard\":true}},\"highlight\":{\"pre_tags\":[\"@kibana-highlighted-field@\"],\"post_tags\":[\"@/kibana-highlighted-field@\"],\"fields\":{\"*\":{}},\"fragment_size\":2147483647},\"filter\":[{\"meta\":{\"negate\":false,\"index\":\"topbeat-*\",\"key\":\"type\",\"value\":\"proc\",\"disabled\":false},\"query\":{\"match\":{\"type\":{\"query\":\"proc\",\"type\":\"phrase\"}}}}]}"
			},
			"columns": [
				"proc.name",
				"proc.cpu.user_p",
				"proc.mem.rss_p",
				"proc.mem.rss",
				"proc.state",
				"proc.cpu.start_time"
			]
		}
	},
	{
		"_id": "System-stats",
		"_type": "search",
		"_source": {
			"sort": [
				"@timestamp",
				"desc"
			],
			"hits": 0,
			"description": "",
			"title": "System stats",
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"index\":\"topbeat-*\",\"query\":{\"query_string\":{\"query\":\"type: system\",\"analyze_wildcard\":true}},\"highlight\":{\"pre_tags\":[\"@kibana-highlighted-field@\"],\"post_tags\":[\"@/kibana-highlighted-field@\"],\"fields\":{\"*\":{}},\"require_field_match\":false,\"fragment_size\":2147483647},\"filter\":[]}"
			},
			"columns": [
				"_source"
			]
		}
	},
	{
		"_id": "System-wide",
		"_type": "search",
		"_source": {
			"sort": [
				"@timestamp",
				"desc"
			],
			"hits": 0,
			"description": "",
			"title": "System wide",
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"index\":\"topbeat-*\",\"query\":{\"query_string\":{\"query\":\"*\",\"analyze_wildcard\":true}},\"highlight\":{\"pre_tags\":[\"@kibana-highlighted-field@\"],\"post_tags\":[\"@/kibana-highlighted-field@\"],\"fields\":{\"*\":{}},\"fragment_size\":2147483647},\"filter\":[{\"meta\":{\"negate\":false,\"index\":\"topbeat-*\",\"key\":\"type\",\"value\":\"system\",\"disabled\":false},\"query\":{\"match\":{\"type\":{\"query\":\"system\",\"type\":\"phrase\"}}}}]}"
			},
			"columns": [
				"beat.name",
				"cpu.user_p",
				"cpu.steal",
				"load.load1",
				"load.load5",
				"mem.used",
				"mem.used_p"
			]
		}
	}
];

module.exports = searches;