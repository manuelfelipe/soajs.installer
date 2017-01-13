'use strict';
var visuals = [
	{
		"_id": "Response-Codes",
		"_type": "visualization",
		"_source": {
			"title": "Response Codes",
			"visState": "{\"title\":\"Response Codes\",\"type\":\"table\",\"params\":{\"perPage\":10,\"showPartialRows\":false,\"showMeticsAtAllLevels\":false},\"aggs\":[{\"id\":\"1\",\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"response\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\",\"customLabel\":\"Response Code\"}}],\"listeners\":{}}",
			"uiStateJSON": "{}",
			"description": "",
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"index\":\"filebeat-nginx-dashboard-*\",\"query\":{\"query_string\":{\"query\":\"*\",\"analyze_wildcard\":true}},\"filter\":[]}"
			}
		}
	},
	{
		"_id": "Map",
		"_type": "visualization",
		"_source": {
			"title": "Map",
			"visState": "{\"title\":\"Map\",\"type\":\"tile_map\",\"params\":{\"mapType\":\"Scaled Circle Markers\",\"isDesaturated\":true,\"addTooltip\":true,\"heatMaxZoom\":16,\"heatMinOpacity\":0.1,\"heatRadius\":25,\"heatBlur\":15,\"heatNormalizeData\":true,\"wms\":{\"enabled\":false,\"url\":\"https://basemap.nationalmap.gov/arcgis/services/USGSTopo/MapServer/WMSServer\",\"options\":{\"version\":\"1.3.0\",\"layers\":\"0\",\"format\":\"image/png\",\"transparent\":true,\"attribution\":\"Maps provided by USGS\",\"styles\":\"\"}}},\"aggs\":[{\"id\":\"1\",\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"type\":\"geohash_grid\",\"schema\":\"segment\",\"params\":{\"field\":\"geoip.location\",\"autoPrecision\":true,\"precision\":2}}],\"listeners\":{}}",
			"uiStateJSON": "{}",
			"description": "",
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"index\":\"filebeat-nginx-dashboard-*\",\"query\":{\"query_string\":{\"query\":\"*\",\"analyze_wildcard\":true}},\"filter\":[]}"
			}
		}
	},
	{
		"_id": "TimeStamp",
		"_type": "visualization",
		"_source": {
			"title": "TimeStamp",
			"visState": "{\"title\":\"TimeStamp\",\"type\":\"histogram\",\"params\":{\"addLegend\":true,\"addTimeMarker\":false,\"addTooltip\":true,\"defaultYExtents\":false,\"mode\":\"stacked\",\"scale\":\"linear\",\"setYExtents\":false,\"shareYAxis\":true,\"times\":[],\"yAxis\":{}},\"aggs\":[{\"id\":\"1\",\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"@timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}}}],\"listeners\":{}}",
			"uiStateJSON": "{}",
			"description": "",
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"index\":\"filebeat-nginx-dashboard-*\",\"query\":{\"query_string\":{\"analyze_wildcard\":true,\"query\":\"*\"}},\"filter\":[]}"
			}
		}
	},
	{
		"_id": "Bytes",
		"_type": "visualization",
		"_source": {
			"title": "Bytes",
			"visState": "{\"title\":\"Bytes\",\"type\":\"histogram\",\"params\":{\"shareYAxis\":true,\"addTooltip\":true,\"addLegend\":true,\"scale\":\"linear\",\"mode\":\"stacked\",\"times\":[],\"addTimeMarker\":false,\"defaultYExtents\":false,\"setYExtents\":false,\"yAxis\":{}},\"aggs\":[{\"id\":\"1\",\"type\":\"sum\",\"schema\":\"metric\",\"params\":{\"field\":\"bytes\"}},{\"id\":\"2\",\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"@timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}}}],\"listeners\":{}}",
			"uiStateJSON": "{}",
			"description": "",
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"index\":\"filebeat-nginx-dashboard-*\",\"query\":{\"query_string\":{\"query\":\"*\",\"analyze_wildcard\":true}},\"filter\":[]}"
			}
		}
	},
	{
		"_id": "Agents",
		"_type": "visualization",
		"_source": {
			"title": "Agents",
			"visState": "{\"title\":\"Agents\",\"type\":\"pie\",\"params\":{\"addLegend\":true,\"addTooltip\":true,\"isDonut\":false,\"shareYAxis\":true},\"aggs\":[{\"id\":\"1\",\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"type\":\"terms\",\"schema\":\"segment\",\"params\":{\"field\":\"user_agent.name\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\"}},{\"id\":\"3\",\"type\":\"terms\",\"schema\":\"segment\",\"params\":{\"field\":\"user_agent.os_name\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\"}}],\"listeners\":{}}",
			"uiStateJSON": "{}",
			"description": "",
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"index\":\"filebeat-nginx-dashboard-*\",\"query\":{\"query_string\":{\"analyze_wildcard\":true,\"query\":\"*\"}},\"filter\":[]}"
			}
		}
	},
	{
		"_id": "Top-10-Requests",
		"_type": "visualization",
		"_source": {
			"title": "Top 10 Requests",
			"visState": "{\"title\":\"Top 10 Requests\",\"type\":\"table\",\"params\":{\"perPage\":10,\"showPartialRows\":false,\"showMeticsAtAllLevels\":false},\"aggs\":[{\"id\":\"1\",\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"request\",\"size\":10,\"order\":\"desc\",\"orderBy\":\"1\"}}],\"listeners\":{}}",
			"uiStateJSON": "{}",
			"description": "",
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"index\":\"filebeat-nginx-dashboard-*\",\"query\":{\"query_string\":{\"query\":\"*\",\"analyze_wildcard\":true}},\"filter\":[]}"
			}
		}
	},
	{
		"_id": "Top-10-Nginx-Errors",
		"_type": "visualization",
		"_source": {
			"title": "Top 10 Nginx Errors",
			"visState": "{\"title\":\"New Visualization\",\"type\":\"table\",\"params\":{\"perPage\":10,\"showPartialRows\":false,\"showMeticsAtAllLevels\":false},\"aggs\":[{\"id\":\"1\",\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"errormessage\",\"size\":10,\"order\":\"desc\",\"orderBy\":\"1\",\"customLabel\":\"Error Message\"}}],\"listeners\":{}}",
			"uiStateJSON": "{}",
			"description": "",
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"index\":\"filebeat-nginx-dashboard-*\",\"query\":{\"query_string\":{\"query\":\"*\",\"analyze_wildcard\":true}},\"filter\":[]}"
			}
		}
	},
	{
		"_id": "Top-10-IP's",
		"_type": "visualization",
		"_source": {
			"title": "Top 10 IP's",
			"visState": "{\"title\":\"Top 10 IP's\",\"type\":\"table\",\"params\":{\"perPage\":10,\"showPartialRows\":false,\"showMeticsAtAllLevels\":false},\"aggs\":[{\"id\":\"1\",\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"geoip.ip\",\"size\":10,\"order\":\"desc\",\"orderBy\":\"1\",\"customLabel\":\"IP\"}},{\"id\":\"3\",\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"geoip.country_name\",\"size\":10,\"order\":\"desc\",\"orderBy\":\"1\",\"customLabel\":\"Country\"}}],\"listeners\":{}}",
			"uiStateJSON": "{}",
			"description": "",
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"index\":\"filebeat-nginx-dashboard-*\",\"query\":{\"query_string\":{\"query\":\"*\",\"analyze_wildcard\":true}},\"filter\":[]}"
			}
		}
	},
	{
		"_id": "Top-5-agents",
		"_type": "visualization",
		"_source": {
			"title": "Top 5 agents",
			"visState": "{\"title\":\"New Visualization\",\"type\":\"pie\",\"params\":{\"shareYAxis\":true,\"addTooltip\":true,\"addLegend\":true,\"isDonut\":false},\"aggs\":[{\"id\":\"1\",\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"type\":\"terms\",\"schema\":\"segment\",\"params\":{\"field\":\"user_agent.name\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\"}},{\"id\":\"3\",\"type\":\"terms\",\"schema\":\"segment\",\"params\":{\"field\":\"user_agent.os_name\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\"}}],\"listeners\":{}}",
			"uiStateJSON": "{}",
			"description": "",
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"index\":\"filebeat-controller-*\",\"query\":{\"query_string\":{\"query\":\"*\",\"analyze_wildcard\":true}},\"filter\":[]}"
			}
		}
	},
	{
		"_id": "Top-20-Countries",
		"_type": "visualization",
		"_source": {
			"title": "Top 20 Countries",
			"visState": "{\"title\":\"New Visualization\",\"type\":\"pie\",\"params\":{\"shareYAxis\":true,\"addTooltip\":true,\"addLegend\":true,\"isDonut\":true},\"aggs\":[{\"id\":\"1\",\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"type\":\"terms\",\"schema\":\"segment\",\"params\":{\"field\":\"geoip.country_name\",\"size\":20,\"order\":\"desc\",\"orderBy\":\"1\",\"customLabel\":\"\"}}],\"listeners\":{}}",
			"uiStateJSON": "{}",
			"description": "",
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"index\":\"filebeat-nginx-dashboard-*\",\"query\":{\"query_string\":{\"query\":\"*\",\"analyze_wildcard\":true}},\"filter\":[]}"
			}
		}
	},
	{
		"_id": "Top-10-Countries",
		"_type": "visualization",
		"_source": {
			"title": "Top 10 Countries",
			"visState": "{\"title\":\"Top 20 Countries\",\"type\":\"pie\",\"params\":{\"shareYAxis\":true,\"addTooltip\":true,\"addLegend\":true,\"isDonut\":true},\"aggs\":[{\"id\":\"1\",\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"type\":\"terms\",\"schema\":\"segment\",\"params\":{\"field\":\"geoip.country_name\",\"size\":10,\"order\":\"desc\",\"orderBy\":\"1\",\"customLabel\":\"\"}}],\"listeners\":{}}",
			"uiStateJSON": "{}",
			"description": "",
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"index\":\"filebeat-nginx-dashboard-*\",\"query\":{\"query_string\":{\"query\":\"*\",\"analyze_wildcard\":true}},\"filter\":[]}"
			}
		}
	},
	{
		"_id": "CPU-usage-per-process",
		"_type": "visualization",
		"_source": {
			"visState": "{\"type\":\"area\",\"params\":{\"shareYAxis\":true,\"addTooltip\":true,\"addLegend\":true,\"smoothLines\":false,\"scale\":\"linear\",\"interpolate\":\"linear\",\"mode\":\"stacked\",\"times\":[],\"addTimeMarker\":false,\"defaultYExtents\":false,\"setYExtents\":false,\"yAxis\":{}},\"aggs\":[{\"id\":\"1\",\"type\":\"avg\",\"schema\":\"metric\",\"params\":{\"field\":\"proc.cpu.user_p\"}},{\"id\":\"2\",\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"@timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}}},{\"id\":\"3\",\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"proc.name\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\"}}],\"listeners\":{}}",
			"description": "",
			"title": "CPU usage per process",
			"version": 1,
			"savedSearchId": "Proc-stats",
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"filter\":[]}"
			}
		}
	},
	{
		"_id": "CPU-usage",
		"_type": "visualization",
		"_source": {
			"visState": "{\"type\":\"area\",\"params\":{\"shareYAxis\":true,\"addTooltip\":true,\"addLegend\":true,\"smoothLines\":false,\"scale\":\"linear\",\"interpolate\":\"linear\",\"mode\":\"stacked\",\"times\":[],\"addTimeMarker\":false,\"defaultYExtents\":false,\"setYExtents\":false,\"yAxis\":{}},\"aggs\":[{\"id\":\"1\",\"type\":\"max\",\"schema\":\"metric\",\"params\":{\"field\":\"cpu.system_p\"}},{\"id\":\"2\",\"type\":\"max\",\"schema\":\"metric\",\"params\":{\"field\":\"cpu.user_p\"}},{\"id\":\"3\",\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"@timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}}},{\"id\":\"4\",\"type\":\"terms\",\"schema\":\"split\",\"params\":{\"field\":\"beat.name\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\",\"row\":true}}],\"listeners\":{}}",
			"description": "",
			"title": "CPU usage",
			"uiStateJSON": "{}",
			"version": 1,
			"savedSearchId": "System-stats",
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"filter\":[]}"
			}
		}
	},
	{
		"_id": "Disk-usage-overview",
		"_type": "visualization",
		"_source": {
			"visState": "{\"type\":\"histogram\",\"params\":{\"shareYAxis\":true,\"addTooltip\":true,\"addLegend\":true,\"scale\":\"linear\",\"mode\":\"stacked\",\"times\":[],\"addTimeMarker\":false,\"defaultYExtents\":false,\"setYExtents\":false,\"yAxis\":{}},\"aggs\":[{\"id\":\"1\",\"type\":\"avg\",\"schema\":\"metric\",\"params\":{\"field\":\"fs.used_p\"}},{\"id\":\"2\",\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"@timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}}},{\"id\":\"3\",\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"beat.name\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\"}}],\"listeners\":{}}",
			"description": "",
			"title": "Disk usage overview",
			"version": 1,
			"savedSearchId": "Filesystem-stats",
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"filter\":[]}"
			}
		}
	},
	{
		"_id": "Disk-usage",
		"_type": "visualization",
		"_source": {
			"visState": "{\"type\":\"table\",\"params\":{\"perPage\":10,\"showPartialRows\":false,\"showMeticsAtAllLevels\":false},\"aggs\":[{\"id\":\"1\",\"type\":\"avg\",\"schema\":\"metric\",\"params\":{\"field\":\"fs.used\"}},{\"id\":\"2\",\"type\":\"avg\",\"schema\":\"metric\",\"params\":{\"field\":\"fs.used_p\"}},{\"id\":\"3\",\"type\":\"avg\",\"schema\":\"metric\",\"params\":{\"field\":\"fs.total\"}},{\"id\":\"4\",\"type\":\"avg\",\"schema\":\"metric\",\"params\":{\"field\":\"fs.free\"}},{\"id\":\"5\",\"type\":\"avg\",\"schema\":\"metric\",\"params\":{\"field\":\"fs.free\"}},{\"id\":\"6\",\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"fs.device_name\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\"}},{\"id\":\"7\",\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"fs.mount_point\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\"}}],\"listeners\":{}}",
			"description": "",
			"title": "Disk usage",
			"version": 1,
			"savedSearchId": "Filesystem-stats",
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"filter\":[]}"
			}
		}
	},
	{
		"_id": "Disk-utilization-over-time",
		"_type": "visualization",
		"_source": {
			"visState": "{\"type\":\"area\",\"params\":{\"shareYAxis\":true,\"addTooltip\":true,\"addLegend\":true,\"smoothLines\":false,\"scale\":\"linear\",\"interpolate\":\"linear\",\"mode\":\"overlap\",\"times\":[],\"addTimeMarker\":false,\"defaultYExtents\":false,\"setYExtents\":false,\"yAxis\":{}},\"aggs\":[{\"id\":\"1\",\"type\":\"avg\",\"schema\":\"metric\",\"params\":{\"field\":\"fs.used_p\"}},{\"id\":\"2\",\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"@timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}}},{\"id\":\"3\",\"type\":\"terms\",\"schema\":\"split\",\"params\":{\"field\":\"beat.name\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\",\"row\":true}},{\"id\":\"4\",\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"fs.mount_point\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\"}}],\"listeners\":{}}",
			"description": "",
			"title": "Disk utilization over time",
			"uiStateJSON": "{}",
			"version": 1,
			"savedSearchId": "Filesystem-stats",
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"filter\":[]}"
			}
		}
	},
	{
		"_id": "Evolution-of-the-CPU-times-per-process",
		"_type": "visualization",
		"_source": {
			"visState": "{\"type\":\"area\",\"params\":{\"shareYAxis\":true,\"addTooltip\":true,\"addLegend\":true,\"smoothLines\":false,\"scale\":\"linear\",\"interpolate\":\"linear\",\"mode\":\"stacked\",\"times\":[],\"addTimeMarker\":false,\"defaultYExtents\":false,\"setYExtents\":false,\"yAxis\":{}},\"aggs\":[{\"id\":\"1\",\"type\":\"avg\",\"schema\":\"metric\",\"params\":{\"field\":\"proc.cpu.user_p\"}},{\"id\":\"2\",\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"@timestamp\",\"interval\":\"s\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}}},{\"id\":\"3\",\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"proc.name\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\"}}],\"listeners\":{}}",
			"description": "",
			"title": "Evolution of the CPU times per process",
			"version": 1,
			"savedSearchId": "Processes",
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"filter\":[]}"
			}
		}
	},
	{
		"_id": "Memory-usage",
		"_type": "visualization",
		"_source": {
			"visState": "{\"type\":\"area\",\"params\":{\"shareYAxis\":true,\"addTooltip\":true,\"addLegend\":true,\"smoothLines\":false,\"scale\":\"linear\",\"interpolate\":\"linear\",\"mode\":\"stacked\",\"times\":[],\"addTimeMarker\":false,\"defaultYExtents\":false,\"setYExtents\":false,\"yAxis\":{}},\"aggs\":[{\"id\":\"1\",\"type\":\"avg\",\"schema\":\"metric\",\"params\":{\"field\":\"mem.used_p\"}},{\"id\":\"2\",\"type\":\"avg\",\"schema\":\"metric\",\"params\":{\"field\":\"swap.used_p\"}},{\"id\":\"3\",\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"@timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}}},{\"id\":\"4\",\"type\":\"terms\",\"schema\":\"split\",\"params\":{\"field\":\"beat.name\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\",\"row\":true}}],\"listeners\":{}}",
			"description": "",
			"title": "Memory usage",
			"uiStateJSON": "{}",
			"version": 1,
			"savedSearchId": "System-stats",
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"filter\":[]}"
			}
		}
	},
	{
		"_id": "Process-status",
		"_type": "visualization",
		"_source": {
			"visState": "{\"type\":\"pie\",\"params\":{\"shareYAxis\":true,\"addTooltip\":true,\"addLegend\":true,\"isDonut\":false},\"aggs\":[{\"id\":\"1\",\"type\":\"cardinality\",\"schema\":\"metric\",\"params\":{\"field\":\"proc.pid\"}},{\"id\":\"2\",\"type\":\"terms\",\"schema\":\"segment\",\"params\":{\"field\":\"beat.name\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\"}},{\"id\":\"3\",\"type\":\"terms\",\"schema\":\"segment\",\"params\":{\"field\":\"proc.state\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\"}}],\"listeners\":{}}",
			"description": "",
			"title": "Process status",
			"uiStateJSON": "{}",
			"version": 1,
			"savedSearchId": "Proc-stats",
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"filter\":[]}"
			}
		}
	},
	{
		"_id": "System-load",
		"_type": "visualization",
		"_source": {
			"visState": "{\"type\":\"line\",\"params\":{\"shareYAxis\":true,\"addTooltip\":true,\"addLegend\":true,\"showCircles\":true,\"smoothLines\":false,\"interpolate\":\"linear\",\"scale\":\"linear\",\"drawLinesBetweenPoints\":true,\"radiusRatio\":9,\"times\":[],\"addTimeMarker\":false,\"defaultYExtents\":false,\"setYExtents\":false,\"yAxis\":{}},\"aggs\":[{\"id\":\"1\",\"type\":\"avg\",\"schema\":\"metric\",\"params\":{\"field\":\"load.load1\"}},{\"id\":\"2\",\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"@timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}}},{\"id\":\"3\",\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"beat.name\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\"}}],\"listeners\":{}}",
			"description": "",
			"title": "System load",
			"version": 1,
			"savedSearchId": "System-stats",
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"filter\":[]}"
			}
		}
	},
	{
		"_id": "Top-10-HTTP-requests",
		"_type": "visualization",
		"_source": {
			"visState": "{\"type\":\"table\",\"params\":{\"perPage\":10,\"showPartialRows\":false,\"showMeticsAtAllLevels\":false},\"aggs\":[{\"id\":\"1\",\"type\":\"sum\",\"schema\":\"metric\",\"params\":{\"field\":\"count\"}},{\"id\":\"2\",\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"query\",\"size\":10,\"order\":\"desc\",\"orderBy\":\"1\"}}],\"listeners\":{}}",
			"description": "",
			"title": "Top 10 HTTP requests",
			"version": 1,
			"savedSearchId": "Web-transactions",
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"filter\":[]}"
			}
		}
	},
	{
		"_id": "Top-10-memory-consumers",
		"_type": "visualization",
		"_source": {
			"visState": "{\"type\":\"histogram\",\"params\":{\"shareYAxis\":true,\"addTooltip\":true,\"addLegend\":true,\"scale\":\"linear\",\"mode\":\"stacked\",\"times\":[],\"addTimeMarker\":false,\"defaultYExtents\":false,\"setYExtents\":false,\"yAxis\":{}},\"aggs\":[{\"id\":\"1\",\"type\":\"avg\",\"schema\":\"metric\",\"params\":{\"field\":\"proc.mem.rss_p\"}},{\"id\":\"2\",\"type\":\"terms\",\"schema\":\"segment\",\"params\":{\"field\":\"proc.name\",\"size\":10,\"order\":\"desc\",\"orderBy\":\"1\"}}],\"listeners\":{}}",
			"description": "",
			"title": "Top 10 memory consumers",
			"version": 1,
			"savedSearchId": "Processes",
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"filter\":[]}"
			}
		}
	},
	{
		"_id": "Top-10-processes-by-total-CPU-usage",
		"_type": "visualization",
		"_source": {
			"visState": "{\"aggs\":[{\"id\":\"1\",\"params\":{\"field\":\"proc.cpu.total\"},\"schema\":\"metric\",\"type\":\"max\"},{\"id\":\"2\",\"params\":{\"field\":\"proc.name\",\"order\":\"desc\",\"orderBy\":\"1\",\"size\":10},\"schema\":\"segment\",\"type\":\"terms\"}],\"listeners\":{},\"params\":{\"addLegend\":true,\"addTimeMarker\":false,\"addTooltip\":true,\"defaultYExtents\":false,\"mode\":\"stacked\",\"scale\":\"linear\",\"setYExtents\":false,\"shareYAxis\":true,\"times\":[],\"yAxis\":{}},\"type\":\"histogram\"}",
			"description": "",
			"title": "Top 10 processes by total CPU usage",
			"version": 1,
			"savedSearchId": "Processes",
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"filter\":[]}"
			}
		}
	},
	{
		"_id": "Top-processes",
		"_type": "visualization",
		"_source": {
			"visState": "{\"type\":\"table\",\"params\":{\"perPage\":10,\"showPartialRows\":false,\"showMeticsAtAllLevels\":false},\"aggs\":[{\"id\":\"1\",\"type\":\"max\",\"schema\":\"metric\",\"params\":{\"field\":\"proc.cpu.user_p\"}},{\"id\":\"2\",\"type\":\"max\",\"schema\":\"metric\",\"params\":{\"field\":\"proc.mem.rss\"}},{\"id\":\"3\",\"type\":\"max\",\"schema\":\"metric\",\"params\":{\"field\":\"proc.mem.rss_p\"}},{\"id\":\"5\",\"type\":\"max\",\"schema\":\"metric\",\"params\":{\"field\":\"proc.mem.share\"}},{\"id\":\"6\",\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"proc.name\",\"size\":10,\"order\":\"desc\",\"orderBy\":\"1\"}}],\"listeners\":{}}",
			"description": "",
			"title": "Top processes",
			"version": 1,
			"savedSearchId": "Proc-stats",
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"filter\":[]}"
			}
		}
	},
	{
		"_id": "Disk-utilization-over-time-2",
		"_type": "visualization",
		"_source": {
			"title": "Disk utilization over time",
			"visState": "{\"type\":\"area\",\"params\":{\"shareYAxis\":true,\"addTooltip\":true,\"addLegend\":true,\"smoothLines\":false,\"scale\":\"linear\",\"interpolate\":\"linear\",\"mode\":\"overlap\",\"times\":[],\"addTimeMarker\":false,\"defaultYExtents\":false,\"setYExtents\":false,\"yAxis\":{}},\"aggs\":[{\"id\":\"1\",\"type\":\"avg\",\"schema\":\"metric\",\"params\":{\"field\":\"fs.used_p\"}},{\"id\":\"2\",\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"@timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}}},{\"id\":\"3\",\"type\":\"terms\",\"schema\":\"split\",\"params\":{\"field\":\"beat.name\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\",\"row\":true}},{\"id\":\"4\",\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"fs.mount_point\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\"}}],\"listeners\":{},\"title\":\"Disk utilization over time\"}",
			"uiStateJSON": "{}",
			"description": "",
			"savedSearchId": "Filesystem-stats-2",
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"filter\":[]}"
			}
		}
	},
	{
		"_id": "Memory-usage-2",
		"_type": "visualization",
		"_source": {
			"title": "Memory usage",
			"visState": "{\"type\":\"area\",\"params\":{\"shareYAxis\":true,\"addTooltip\":true,\"addLegend\":true,\"smoothLines\":false,\"scale\":\"linear\",\"interpolate\":\"linear\",\"mode\":\"stacked\",\"times\":[],\"addTimeMarker\":false,\"defaultYExtents\":false,\"setYExtents\":false,\"yAxis\":{}},\"aggs\":[{\"id\":\"1\",\"type\":\"avg\",\"schema\":\"metric\",\"params\":{\"field\":\"mem.used_p\"}},{\"id\":\"2\",\"type\":\"avg\",\"schema\":\"metric\",\"params\":{\"field\":\"swap.used_p\"}},{\"id\":\"3\",\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"@timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}}},{\"id\":\"4\",\"type\":\"terms\",\"schema\":\"split\",\"params\":{\"field\":\"beat.name\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\",\"row\":true}}],\"listeners\":{},\"title\":\"Memory usage\"}",
			"uiStateJSON": "{}",
			"description": "",
			"savedSearchId": "System-stats-2",
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"filter\":[]}"
			}
		}
	},
	{
		"_id": "Memory-usage-per-process-2",
		"_type": "visualization",
		"_source": {
			"title": "Memory usage per process",
			"visState": "{\"type\":\"area\",\"params\":{\"shareYAxis\":true,\"addTooltip\":true,\"addLegend\":true,\"smoothLines\":false,\"scale\":\"linear\",\"interpolate\":\"linear\",\"mode\":\"stacked\",\"times\":[],\"addTimeMarker\":false,\"defaultYExtents\":false,\"setYExtents\":false,\"yAxis\":{}},\"aggs\":[{\"id\":\"1\",\"type\":\"max\",\"schema\":\"metric\",\"params\":{\"field\":\"proc.mem.rss_p\"}},{\"id\":\"2\",\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"@timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}}},{\"id\":\"3\",\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"proc.name\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\"}}],\"listeners\":{},\"title\":\"Memory usage per process\"}",
			"uiStateJSON": "{}",
			"description": "",
			"savedSearchId": "Proc-stats-2",
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"filter\":[]}"
			}
		}
	},
	{
		"_id": "Process-status-2",
		"_type": "visualization",
		"_source": {
			"title": "Process status",
			"visState": "{\"type\":\"pie\",\"params\":{\"shareYAxis\":true,\"addTooltip\":true,\"addLegend\":true,\"isDonut\":false},\"aggs\":[{\"id\":\"1\",\"type\":\"cardinality\",\"schema\":\"metric\",\"params\":{\"field\":\"proc.pid\"}},{\"id\":\"2\",\"type\":\"terms\",\"schema\":\"segment\",\"params\":{\"field\":\"beat.name\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\"}},{\"id\":\"3\",\"type\":\"terms\",\"schema\":\"segment\",\"params\":{\"field\":\"proc.state\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\"}}],\"listeners\":{},\"title\":\"Process status\"}",
			"uiStateJSON": "{}",
			"description": "",
			"savedSearchId": "Proc-stats-2",
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"filter\":[]}"
			}
		}
	},
	{
		"_id": "Servers-2",
		"_type": "visualization",
		"_source": {
			"title": "Servers",
			"visState": "{\"type\":\"table\",\"params\":{\"perPage\":10,\"showPartialRows\":false,\"showMeticsAtAllLevels\":false},\"aggs\":[{\"id\":\"1\",\"type\":\"avg\",\"schema\":\"metric\",\"params\":{\"field\":\"cpu.user_p\"}},{\"id\":\"3\",\"type\":\"avg\",\"schema\":\"metric\",\"params\":{\"field\":\"cpu.system_p\"}},{\"id\":\"4\",\"type\":\"max\",\"schema\":\"metric\",\"params\":{\"field\":\"mem.total\"}},{\"id\":\"5\",\"type\":\"max\",\"schema\":\"metric\",\"params\":{\"field\":\"mem.used\"}},{\"id\":\"8\",\"type\":\"max\",\"schema\":\"metric\",\"params\":{\"field\":\"mem.used_p\"}},{\"id\":\"6\",\"type\":\"max\",\"schema\":\"metric\",\"params\":{\"field\":\"mem.free\"}},{\"id\":\"9\",\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"beat.name\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\"}}],\"listeners\":{},\"title\":\"Servers\"}",
			"uiStateJSON": "{}",
			"description": "",
			"savedSearchId": "System-stats-2",
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"filter\":[]}"
			}
		}
	},
	{
		"_id": "Top-processes-2",
		"_type": "visualization",
		"_source": {
			"title": "Top processes",
			"visState": "{\"type\":\"table\",\"params\":{\"perPage\":10,\"showPartialRows\":false,\"showMeticsAtAllLevels\":false},\"aggs\":[{\"id\":\"1\",\"type\":\"max\",\"schema\":\"metric\",\"params\":{\"field\":\"proc.cpu.user_p\"}},{\"id\":\"2\",\"type\":\"max\",\"schema\":\"metric\",\"params\":{\"field\":\"proc.mem.rss\"}},{\"id\":\"3\",\"type\":\"max\",\"schema\":\"metric\",\"params\":{\"field\":\"proc.mem.rss_p\"}},{\"id\":\"5\",\"type\":\"max\",\"schema\":\"metric\",\"params\":{\"field\":\"proc.mem.share\"}},{\"id\":\"6\",\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"proc.name\",\"size\":10,\"order\":\"desc\",\"orderBy\":\"1\"}}],\"listeners\":{},\"title\":\"Top processes\"}",
			"uiStateJSON": "{}",
			"description": "",
			"savedSearchId": "Proc-stats-2",
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"filter\":[]}"
			}
		}
	},
	{
		"_id": "Disk-usage-2",
		"_type": "visualization",
		"_source": {
			"title": "Disk usage",
			"visState": "{\"type\":\"table\",\"params\":{\"perPage\":10,\"showPartialRows\":false,\"showMeticsAtAllLevels\":false},\"aggs\":[{\"id\":\"1\",\"type\":\"avg\",\"schema\":\"metric\",\"params\":{\"field\":\"fs.used\"}},{\"id\":\"2\",\"type\":\"avg\",\"schema\":\"metric\",\"params\":{\"field\":\"fs.used_p\"}},{\"id\":\"3\",\"type\":\"avg\",\"schema\":\"metric\",\"params\":{\"field\":\"fs.total\"}},{\"id\":\"4\",\"type\":\"avg\",\"schema\":\"metric\",\"params\":{\"field\":\"fs.free\"}},{\"id\":\"5\",\"type\":\"avg\",\"schema\":\"metric\",\"params\":{\"field\":\"fs.free\"}},{\"id\":\"6\",\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"fs.device_name\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\"}},{\"id\":\"7\",\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"fs.mount_point\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\"}}],\"listeners\":{},\"title\":\"Disk usage\"}",
			"uiStateJSON": "{}",
			"description": "",
			"savedSearchId": "Filesystem-stats-2",
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"filter\":[]}"
			}
		}
	},
	{
		"_id": "Disk-usage-overview-2",
		"_type": "visualization",
		"_source": {
			"title": "Disk usage overview",
			"visState": "{\"type\":\"histogram\",\"params\":{\"shareYAxis\":true,\"addTooltip\":true,\"addLegend\":true,\"scale\":\"linear\",\"mode\":\"stacked\",\"times\":[],\"addTimeMarker\":false,\"defaultYExtents\":false,\"setYExtents\":false,\"yAxis\":{}},\"aggs\":[{\"id\":\"1\",\"type\":\"avg\",\"schema\":\"metric\",\"params\":{\"field\":\"fs.used_p\"}},{\"id\":\"2\",\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"@timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}}},{\"id\":\"3\",\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"beat.name\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\"}}],\"listeners\":{},\"title\":\"Disk usage overview\"}",
			"uiStateJSON": "{}",
			"description": "",
			"savedSearchId": "Filesystem-stats-2",
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"filter\":[]}"
			}
		}
	},
	{
		"_id": "Evolution-of-the-CPU-times-per-process-2",
		"_type": "visualization",
		"_source": {
			"title": "Evolution of the CPU times per process",
			"visState": "{\"type\":\"area\",\"params\":{\"shareYAxis\":true,\"addTooltip\":true,\"addLegend\":true,\"smoothLines\":false,\"scale\":\"linear\",\"interpolate\":\"linear\",\"mode\":\"stacked\",\"times\":[],\"addTimeMarker\":false,\"defaultYExtents\":false,\"setYExtents\":false,\"yAxis\":{}},\"aggs\":[{\"id\":\"1\",\"type\":\"avg\",\"schema\":\"metric\",\"params\":{\"field\":\"proc.cpu.user_p\"}},{\"id\":\"2\",\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"@timestamp\",\"interval\":\"s\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}}},{\"id\":\"3\",\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"proc.name\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\"}}],\"listeners\":{},\"title\":\"Evolution of the CPU times per process\"}",
			"uiStateJSON": "{}",
			"description": "",
			"savedSearchId": "Processes-2",
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"filter\":[]}"
			}
		}
	},
	{
		"_id": "System-load-2",
		"_type": "visualization",
		"_source": {
			"title": "System load",
			"visState": "{\"type\":\"line\",\"params\":{\"shareYAxis\":true,\"addTooltip\":true,\"addLegend\":true,\"showCircles\":true,\"smoothLines\":false,\"interpolate\":\"linear\",\"scale\":\"linear\",\"drawLinesBetweenPoints\":true,\"radiusRatio\":9,\"times\":[],\"addTimeMarker\":false,\"defaultYExtents\":false,\"setYExtents\":false,\"yAxis\":{}},\"aggs\":[{\"id\":\"1\",\"type\":\"avg\",\"schema\":\"metric\",\"params\":{\"field\":\"load.load1\"}},{\"id\":\"2\",\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"@timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}}},{\"id\":\"3\",\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"beat.name\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\"}}],\"listeners\":{},\"title\":\"System load\"}",
			"uiStateJSON": "{}",
			"description": "",
			"savedSearchId": "System-stats-2",
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"filter\":[]}"
			}
		}
	},
	{
		"_id": "CPU-usage-per-process-2",
		"_type": "visualization",
		"_source": {
			"title": "CPU usage per process",
			"visState": "{\"type\":\"area\",\"params\":{\"shareYAxis\":true,\"addTooltip\":true,\"addLegend\":true,\"smoothLines\":false,\"scale\":\"linear\",\"interpolate\":\"linear\",\"mode\":\"stacked\",\"times\":[],\"addTimeMarker\":false,\"defaultYExtents\":false,\"setYExtents\":false,\"yAxis\":{}},\"aggs\":[{\"id\":\"1\",\"type\":\"avg\",\"schema\":\"metric\",\"params\":{\"field\":\"proc.cpu.user_p\"}},{\"id\":\"2\",\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"@timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}}},{\"id\":\"3\",\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"proc.name\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\"}}],\"listeners\":{},\"title\":\"CPU usage per process\"}",
			"uiStateJSON": "{}",
			"description": "",
			"savedSearchId": "Proc-stats-2",
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"filter\":[]}"
			}
		}
	},
	{
		"_id": "CPU-usage-2",
		"_type": "visualization",
		"_source": {
			"title": "CPU usage",
			"visState": "{\"type\":\"area\",\"params\":{\"shareYAxis\":true,\"addTooltip\":true,\"addLegend\":true,\"smoothLines\":false,\"scale\":\"linear\",\"interpolate\":\"linear\",\"mode\":\"stacked\",\"times\":[],\"addTimeMarker\":false,\"defaultYExtents\":false,\"setYExtents\":false,\"yAxis\":{}},\"aggs\":[{\"id\":\"1\",\"type\":\"max\",\"schema\":\"metric\",\"params\":{\"field\":\"cpu.system_p\"}},{\"id\":\"2\",\"type\":\"max\",\"schema\":\"metric\",\"params\":{\"field\":\"cpu.user_p\"}},{\"id\":\"3\",\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"@timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}}},{\"id\":\"4\",\"type\":\"terms\",\"schema\":\"split\",\"params\":{\"field\":\"beat.name\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\",\"row\":true}}],\"listeners\":{},\"title\":\"CPU usage\"}",
			"uiStateJSON": "{}",
			"description": "",
			"savedSearchId": "System-stats-2",
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"filter\":[]}"
			}
		}
	},
	{
		"_id": "Servers",
		"_type": "visualization",
		"_source": {
			"visState": "{\"type\":\"table\",\"params\":{\"perPage\":10,\"showPartialRows\":false,\"showMeticsAtAllLevels\":false},\"aggs\":[{\"id\":\"1\",\"type\":\"avg\",\"schema\":\"metric\",\"params\":{\"field\":\"cpu.user_p\"}},{\"id\":\"3\",\"type\":\"avg\",\"schema\":\"metric\",\"params\":{\"field\":\"cpu.system_p\"}},{\"id\":\"4\",\"type\":\"max\",\"schema\":\"metric\",\"params\":{\"field\":\"mem.total\"}},{\"id\":\"5\",\"type\":\"max\",\"schema\":\"metric\",\"params\":{\"field\":\"mem.used\"}},{\"id\":\"8\",\"type\":\"max\",\"schema\":\"metric\",\"params\":{\"field\":\"mem.used_p\"}},{\"id\":\"6\",\"type\":\"max\",\"schema\":\"metric\",\"params\":{\"field\":\"mem.free\"}},{\"id\":\"9\",\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"beat.name\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\"}}],\"listeners\":{}}",
			"description": "",
			"title": "Servers",
			"version": 1,
			"savedSearchId": "System-stats",
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"filter\":[]}"
			}
		}
	},
	{
		"_id": "Controller-top-10-errors",
		"_type": "visualization",
		"_source": {
			"title": "Controller top 10 errors",
			"visState": "{\"title\":\"New Visualization\",\"type\":\"table\",\"params\":{\"perPage\":10,\"showPartialRows\":false,\"showMeticsAtAllLevels\":false},\"aggs\":[{\"id\":\"1\",\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"type\":\"filters\",\"schema\":\"bucket\",\"params\":{\"filters\":[{\"input\":{\"query\":{\"query_string\":{\"query\":\"level:ERROR\",\"analyze_wildcard\":true}}},\"label\":\"\"}]}},{\"id\":\"4\",\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"err.message\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\",\"customLabel\":\"Error Message\"}},{\"id\":\"5\",\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"err.stack\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\",\"customLabel\":\"Error Stack\"}},{\"id\":\"6\",\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"err.code\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\",\"customLabel\":\"Error Code\"}}],\"listeners\":{}}",
			"uiStateJSON": "{}",
			"description": "",
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"index\":\"*-controller-*\",\"query\":{\"query_string\":{\"query\":\"*\",\"analyze_wildcard\":true}},\"filter\":[]}"
			}
		}
	},
	{
		"_id": "controller-agents",
		"_type": "visualization",
		"_source": {
			"title": "controller agents",
			"visState": "{\"title\":\"New Visualization\",\"type\":\"pie\",\"params\":{\"shareYAxis\":true,\"addTooltip\":true,\"addLegend\":true,\"isDonut\":false},\"aggs\":[{\"id\":\"1\",\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"type\":\"terms\",\"schema\":\"segment\",\"params\":{\"field\":\"user_agent.name\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\"}},{\"id\":\"3\",\"type\":\"terms\",\"schema\":\"segment\",\"params\":{\"field\":\"user_agent.os_name\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\"}}],\"listeners\":{}}",
			"uiStateJSON": "{}",
			"description": "",
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"index\":\"*-controller-*\",\"query\":{\"query_string\":{\"query\":\"*\",\"analyze_wildcard\":true}},\"filter\":[]}"
			}
		}
	},
	{
		"_id": "controller-top-10-ip's",
		"_type": "visualization",
		"_source": {
			"title": "controller top 10 ip's",
			"visState": "{\"title\":\"New Visualization\",\"type\":\"table\",\"params\":{\"perPage\":10,\"showPartialRows\":false,\"showMeticsAtAllLevels\":false},\"aggs\":[{\"id\":\"1\",\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"geoip.ip\",\"size\":10,\"order\":\"desc\",\"orderBy\":\"1\"}}],\"listeners\":{}}",
			"uiStateJSON": "{}",
			"description": "",
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"index\":\"*-controller-*\",\"query\":{\"query_string\":{\"query\":\"*\",\"analyze_wildcard\":true}},\"filter\":[]}"
			}
		}
	},
	{
		"_id": "Top-10-Services",
		"_type": "visualization",
		"_source": {
			"title": "Top 10 Services",
			"visState": "{\"title\":\"New Visualization\",\"type\":\"pie\",\"params\":{\"shareYAxis\":true,\"addTooltip\":true,\"addLegend\":true,\"isDonut\":false},\"aggs\":[{\"id\":\"1\",\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"type\":\"terms\",\"schema\":\"segment\",\"params\":{\"field\":\"serviceName\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\"}}],\"listeners\":{}}",
			"uiStateJSON": "{}",
			"description": "",
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"index\":\"*-controller-*\",\"query\":{\"query_string\":{\"query\":\"*\",\"analyze_wildcard\":true}},\"filter\":[]}"
			}
		}
	},
	{
		"_id": "date-time-picker",
		"_type": "visualization",
		"_source": {
			"title": "date time picker",
			"visState": "{\"title\":\"New Visualization\",\"type\":\"time\",\"params\":{\"enable_quick\":true,\"enable_relative\":true,\"enable_absolut\":true,\"enable_animation\":true},\"aggs\":[],\"listeners\":{}}",
			"uiStateJSON": "{}",
			"description": "",
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"query\":{\"query_string\":{\"query\":\"*\",\"analyze_wildcard\":true}},\"filter\":[]}"
			}
		}
	},
	{
		"_id": "Memory-usage-per-process",
		"_type": "visualization",
		"_source": {
			"title": "Memory usage per process",
			"visState": "{\"title\":\"Memory usage per process\",\"type\":\"area\",\"params\":{\"shareYAxis\":true,\"addTooltip\":true,\"addLegend\":true,\"smoothLines\":false,\"scale\":\"linear\",\"interpolate\":\"linear\",\"mode\":\"stacked\",\"times\":[],\"addTimeMarker\":false,\"defaultYExtents\":false,\"setYExtents\":false,\"yAxis\":{}},\"aggs\":[{\"id\":\"1\",\"type\":\"max\",\"schema\":\"metric\",\"params\":{\"field\":\"proc.mem.rss_p\"}},{\"id\":\"2\",\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"@timestamp\",\"interval\":\"auto\",\"customInterval\":\"2h\",\"min_doc_count\":1,\"extended_bounds\":{}}},{\"id\":\"3\",\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"proc.name\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\"}}],\"listeners\":{}}",
			"uiStateJSON": "{\"vis\":{\"colors\":{\"java\":\"#64B0C8\"}}}",
			"description": "",
			"savedSearchId": "Proc-stats-2",
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"filter\":[]}"
			}
		}
	},
	{
		"_id": "Controller-top-10-Warnings",
		"_type": "visualization",
		"_source": {
			"title": "Controller top 10 Warnings",
			"visState": "{\"title\":\"Controller top 10 Fatal\",\"type\":\"table\",\"params\":{\"perPage\":10,\"showPartialRows\":false,\"showMeticsAtAllLevels\":false},\"aggs\":[{\"id\":\"1\",\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"type\":\"filters\",\"schema\":\"bucket\",\"params\":{\"filters\":[{\"input\":{\"query\":{\"query_string\":{\"query\":\"level:WARN\",\"analyze_wildcard\":true}}},\"label\":\"\"}]}},{\"id\":\"3\",\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"msg\",\"size\":10,\"order\":\"desc\",\"orderBy\":\"1\"}}],\"listeners\":{}}",
			"uiStateJSON": "{}",
			"description": "",
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"index\":\"*-controller-*\",\"query\":{\"query_string\":{\"query\":\"*\",\"analyze_wildcard\":true}},\"filter\":[]}"
			}
		}
	},
	{
		"_id": "Controller-top-10-Fatal",
		"_type": "visualization",
		"_source": {
			"title": "Controller top 10 Fatal",
			"visState": "{\"title\":\"Controller top 10 Fatal\",\"type\":\"table\",\"params\":{\"perPage\":10,\"showPartialRows\":false,\"showMeticsAtAllLevels\":false},\"aggs\":[{\"id\":\"1\",\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"3\",\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"msg\",\"size\":10,\"order\":\"desc\",\"orderBy\":\"1\",\"customLabel\":\"Fatal Message\"}},{\"id\":\"4\",\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"@timestamp\",\"size\":10,\"order\":\"desc\",\"orderBy\":\"1\"}}],\"listeners\":{}}",
			"uiStateJSON": "{}",
			"description": "",
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"index\":\"*-controller-*\",\"query\":{\"query_string\":{\"query\":\"level:FATAL\",\"analyze_wildcard\":true}},\"filter\":[]}"
			}
		}
	},
	{
		"_id": "request-count",
		"_type": "visualization",
		"_source": {
			"title": "request count",
			"visState": "{\"title\":\"New Visualization\",\"type\":\"metric\",\"params\":{\"handleNoResults\":true,\"fontSize\":\"33\"},\"aggs\":[{\"id\":\"1\",\"type\":\"count\",\"schema\":\"metric\",\"params\":{\"customLabel\":\"Request Count\"}}],\"listeners\":{}}",
			"uiStateJSON": "{}",
			"description": "",
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"index\":\"filebeat-nginx-dashboard-*\",\"query\":{\"query_string\":{\"query\":\"*\",\"analyze_wildcard\":true}},\"filter\":[]}"
			}
		}
	},
	{
		"_id": "Sum-of-bytes",
		"_type": "visualization",
		"_source": {
			"title": "Sum of bytes",
			"visState": "{\"title\":\"Sum of bytes\",\"type\":\"metric\",\"params\":{\"handleNoResults\":true,\"fontSize\":\"33\"},\"aggs\":[{\"id\":\"1\",\"type\":\"sum\",\"schema\":\"metric\",\"params\":{\"field\":\"bytes\"}}],\"listeners\":{}}",
			"uiStateJSON": "{}",
			"description": "",
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"index\":\"filebeat-nginx-dashboard-*\",\"query\":{\"query_string\":{\"query\":\"*\",\"analyze_wildcard\":true}},\"filter\":[]}"
			}
		}
	},
	{
		"_id": "To-5-Methods",
		"_type": "visualization",
		"_source": {
			"title": "To 5 Methods",
			"visState": "{\"title\":\"New Visualization\",\"type\":\"pie\",\"params\":{\"shareYAxis\":true,\"addTooltip\":true,\"addLegend\":true,\"isDonut\":false},\"aggs\":[{\"id\":\"1\",\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"type\":\"terms\",\"schema\":\"segment\",\"params\":{\"field\":\"verb\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\",\"customLabel\":\"Top 5 Methods\"}}],\"listeners\":{}}",
			"uiStateJSON": "{}",
			"description": "",
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"index\":\"filebeat-nginx-dashboard-*\",\"query\":{\"query_string\":{\"query\":\"*\",\"analyze_wildcard\":true}},\"filter\":[]}"
			}
		}
	},
	{
		"_id": "Top-5-Methods",
		"_type": "visualization",
		"_source": {
			"title": "Top 5 Methods",
			"visState": "{\"title\":\"To 5 Methods\",\"type\":\"pie\",\"params\":{\"shareYAxis\":true,\"addTooltip\":true,\"addLegend\":true,\"isDonut\":false},\"aggs\":[{\"id\":\"1\",\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"type\":\"terms\",\"schema\":\"segment\",\"params\":{\"field\":\"verb\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\",\"customLabel\":\"Top 5 Methods\"}}],\"listeners\":{}}",
			"uiStateJSON": "{}",
			"description": "",
			"version": 1,
			"kibanaSavedObjectMeta": {
				"searchSourceJSON": "{\"index\":\"filebeat-nginx-dashboard-*\",\"query\":{\"query_string\":{\"query\":\"*\",\"analyze_wildcard\":true}},\"filter\":[]}"
			}
		}
	}
];

module.exports = visuals;