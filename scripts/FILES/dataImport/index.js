/**
 * Created by Nicolas on 12/7/16.
 */
/***************************************************************
 *
 * DASHBOARD CORE_PROVISION
 *
 ***************************************************************/
var soajs = require("soajs");
var dataFolder = process.env.SOAJS_DATA_FOLDER;
delete require.cache[process.env.SOAJS_PROFILE];
var async= require("async");
var profile = require(process.env.SOAJS_PROFILE);
profile.name = "core_provision";
var mongo = new soajs.mongo(profile);
var fs= require("fs");
mongo.dropDatabase(function () {
	lib.addExtKeys(function (errKeys) {
        if(errKeys){
            throw new Error("Error while importing external keys \n"+ errKeys);
        }
		lib.addEnvs(function (errEnvs) {
			if(errEnvs){
				throw new Error("Error while importing environments \n" + errEnvs)
			}
			lib.addProducts(function (errProducts) {
                if(errProducts){
                    throw new Error("Error while importing products \n"+ errProducts);
                }
				lib.addServices(function (errServices) {
                    if(errServices){
                        throw new Error("Error while importing services \n"+ errServices);
                    }
					lib.addTenants(function (errTenants) {
                        if(errTenants){
                            throw new Error("Error while importing tenants \n"+ errTenants)
                        }
						lib.addGitAccounts(function (errGit) {
                            if(errGit){
                                throw new Error("Error while importing git accounts \n"+ errGit);
                            }
							lib.addAnalytics(function (errAnalytics) {
                                if(errAnalytics){
                                    throw new Error("Error while importing analytics \n"+ errAnalytics);
                                }
								lib.provisionIndex(function (errProvisionIndex) {
                                    if(errProvisionIndex){
                                        throw new Error("Error while indexing provision data \n"+ errProvisionIndex);
                                    }
									mongo.closeDb();
									profile.name = "DBTN_urac";
									mongo = new soajs.mongo(profile);
									mongo.dropDatabase(function () {
										lib.addUsers(function (errUsers) {
                                            if(errUsers){
                                                throw new Error("Error while importing users \n"+ errUsers);
                                            }
											lib.addGroups(function (errGroups) {
                                                if(errGroups){
                                                    console.log("Error while importing groups \n"+ errGroups);
                                                }
												lib.uracIndex(function (errUracIndex) {
                                                    if(errUracIndex){
                                                        throw new Error("Error while indexing urac records \n"+ errUracIndex);
                                                    }
													mongo.closeDb();
												});
											});
										});
									});
								});
							});
						});
					});
				});
			});
		});
	});
});

var lib = {
	/*
	 DASHBOARD EXT KEYS
	 */
	"addExtKeys": function (cb) {
		var record = require(dataFolder + "extKeys/keys.js");
		mongo.insert("dashboard_extKeys", record, cb);
	},
	
	/*
	 Environments
	 */
	"addEnvs": function (cb) {
		var record = require(dataFolder + "environments/dashboard.js");
		record._id = mongo.ObjectId(record._id);
		mongo.insert("environment", record, cb);
	},
	
	/*
	 Products
	 */
	"addProducts": function (cb) {
		var record = require(dataFolder + "products/dsbrd.js");
		record._id = mongo.ObjectId(record._id);
		mongo.insert("products", record, cb);
	},
	
	/*
	 Services
	 */
	"addServices": function (cb) {
		var record = require(dataFolder + "services/index.js");
		mongo.insert("services", record, cb);
	},
	
	/*
	 Tenants
	 */
	"addTenants": function (cb) {
		var record = require(dataFolder + "tenants/owner.js");
		
		record._id = mongo.ObjectId(record._id);
		record.applications.forEach(function (oneApp) {
			oneApp.appId = mongo.ObjectId(oneApp.appId);
		});
		
		mongo.insert("tenants", record, cb);
	},
	
	/*
	 Git Accounts
	 */
	"addGitAccounts": function (cb) {
		var record = require(dataFolder + "gitAccounts/soajsRepos.js");
		record._id = mongo.ObjectId(record._id);
		mongo.insert("git_accounts", record, cb);
	},
	
	/*
	 Analytics
	 */
	"addAnalytics": function (cb) {
		
		/*
		Deprecated!
		//var control_dashboard_fb = require(dataFolder + "analytics/control_dashboard_fb.js"); //pending peter
		var dashboard_taskName_tb = require(dataFolder + "analytics/dashboard_taskName_tb.js");
		var dashboard_service_tb = require(dataFolder + "analytics/dashboard_service_tb.js");
		var mappings = require(dataFolder + "analytics/mappings.js");
		var nginx_dashboard_fb = require(dataFolder + "analytics/nginx_dashboard_fb.js");
		//var searches_control_tb = require(dataFolder + "analytics/searches_control_tb.js");//pending peter
		var searches_taskName_tb = require(dataFolder + "analytics/searches_taskName_tb.js");
		var searches_service_tb = require(dataFolder + "analytics/searches_service_tb.js");
		//var service_dashboard_fb = require(dataFolder + "analytics/service_dashboard_fb.js");//pending peter
		var settings = require(dataFolder + "analytics/settings.js");//pending peter
		//var visuals_control_fb = require(dataFolder + "analytics/visuals_control_fb.js");
		var visuals_nginx_fb = require(dataFolder + "analytics/visuals_nginx_fb.js");//pending peter
		//var visuals_service_fb = require(dataFolder + "analytics/visuals_service_fb.js");//pending peter
		var visuals_taskName_tb = require(dataFolder + "analytics/visuals_taskName_tb.js");
		var visuals_service_tb = require(dataFolder + "analytics/visuals_service_tb.js");
		
		var records= dashboard_taskName_tb.concat(dashboard_service_tb).concat(mappings).concat(nginx_dashboard_fb).concat(visuals_nginx_fb).concat(visuals_taskName_tb).concat(visuals_service_tb).concat(searches_taskName_tb).concat(searches_service_tb);
		records.concat(visuals_nginx_fb);
		records.concat(settings);*/
		var records = [];
		fs.readdir(dataFolder + "analytics", function(err, items) {
			async.forEachOf(items, function (item, key, callback) {
				if (key === 0) {
					records = require(dataFolder + "analytics/" + items[key]);
				}
				else {
					records = records.concat(require(dataFolder + "analytics/" + item))
				}
				callback();
			}, function () {
				mongo.insert("analytics", records, cb);
			});
		});
		
		
	},
	/***************************************************************
	 *
	 * DASHBOARD URAC
	 *
	 ***************************************************************/
	/*
	 Users
	 */
	"addUsers": function (cb) {
		var record = require(dataFolder + "urac/users/owner.js");
		mongo.insert("users", record, cb);
	},
	
	/*
	 Groups
	 */
	"addGroups": function (cb) {
		var record = require(dataFolder + "urac/groups/owner.js");
		mongo.insert("groups", record, cb);
	},
	
	"errorLogger": function (error) {
		if (error) {
			return console.log(error);
		}
	},
	
	//users
	"provisionIndex": function (cb) {
		mongo.ensureIndex("users", {username: 1}, {unique: true}, lib.errorLogger);
		mongo.ensureIndex("users", {email: 1}, {unique: true}, lib.errorLogger);
		mongo.ensureIndex("users", {username: 1, status: 1}, null, lib.errorLogger);
		mongo.ensureIndex("users", {email: 1, status: 1}, null, lib.errorLogger);
		mongo.ensureIndex("users", {groups: 1, 'tenant.id': 1}, null, lib.errorLogger);
		mongo.ensureIndex("users", {username: 1, 'tenant.id': 1}, null, lib.errorLogger);
		mongo.ensureIndex("users", {status: 1}, null, lib.errorLogger);
		mongo.ensureIndex("users", {locked: 1}, null, lib.errorLogger);
		mongo.ensureIndex("users", {'tenant.id': 1}, null, lib.errorLogger);
		return cb();
	},
	
	"uracIndex": function (cb) {
		//groups
		mongo.ensureIndex("groups", {code: 1, 'tenant.id': 1}, null, lib.errorLogger);
		mongo.ensureIndex("groups", {code: 1}, null, lib.errorLogger);
		mongo.ensureIndex("groups", {'tenant.id': 1}, null, lib.errorLogger);
		mongo.ensureIndex("groups", {locked: 1}, null, lib.errorLogger);
		//tokens
		mongo.ensureIndex("tokens", {token: 1}, {unique: true}, lib.errorLogger);
		mongo.ensureIndex("tokens", {userId: 1, service: 1, status: 1}, null, lib.errorLogger);
		mongo.ensureIndex("tokens", {token: 1, service: 1, status: 1}, null, lib.errorLogger);
		return cb();
		
	}
};