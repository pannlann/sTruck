jQuery.sap.declare("SpicersTruck.Component");
jQuery.sap.require("SpicersTruck.util.Formatter");

sap.ui.core.UIComponent.extend("SpicersTruck.Component", {
	metadata : {
		routing : {
			config : {
				routerClass : SpicersTruck.MyRouter,
				transition : "show",
				targetControl : "SpicersTruck",
				targetAggregation : "pages",
				clearTarget : false
			},
			routes : routingLogic
		}
	},
	init : function() {

		// set global models
		var deviceModel;
		var appModel;

		// instantiate app
		application = new sap.m.App("SpicersTruck");

		// get local storage
		sharedStorage = window.localStorage;

		// setup device information
		deviceModel = new sap.ui.model.json.JSONModel({
			isPhone : jQuery.device.is.phone,
			isNoPhone : !jQuery.device.is.phone,
			listMode : (jQuery.device.is.phone) ? "None" : "SingleSelectMaster",
			listItemType : (jQuery.device.is.phone) ? "Active" : "Inactive"
		});

		// setup app information
		appModel = new sap.ui.model.json.JSONModel({
			version : getAppVersion()
		});

		// set models
		application.setModel(deviceModel, "device");
		application.setModel(appModel, "app");

		// call overridden init (calls createContent)
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
		// create router
		router = this.getRouter();
		this.routeHandler = new sap.m.routing.RouteMatchedHandler(router);
		router.initialize();

		// initilize hashChanger
		hashChanger = new sap.ui.core.routing.HashChanger();

	},
	createContent : function() {

		// var appView = new sap.ui.jsview("app", "view.App");
		appView = sap.ui.view({
			id : "app",
			viewName : "SpicersTruck.view.App",
			type : sap.ui.core.mvc.ViewType.JS
		});

		return appView;
	},
	destroy : function() {

		if (this.routeHandler) {
			this.routeHandler.destroy();
		}
		// call overridden destroy
		sap.ui.core.UIComponent.prototype.destroy.apply(this, arguments);
	},
});