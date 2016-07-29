jQuery.sap.require("sap.m.MessageBox");

sap.ui.jsview("SpicersTruck.view.App", {

	/**
	 * Specifies the Controller belonging to this View. In the case that it is not
	 * implemented, or that "null" is returned, this View does not have a
	 * Controller.
	 * 
	 * @memberOf view.App
	 */
	getControllerName : function() {

		return "SpicersTruck.view.App";
	},

	/**
	 * Is initially called once after the Controller has been instantiated. It is
	 * the place where the UI is constructed. Since the Controller is given to
	 * this method, its event handlers can be attached right away.
	 * 
	 * @memberOf view.App
	 */
	createContent : function(oController) {

		 this.setDisplayBlock(true);// to avoid scroll bars on desktop the root

		// start app with main screen
		// init all views to make it quicker to navigate
		mainView = sap.ui.view({
			id : "main",
			viewName : "SpicersTruck.view.Main",
			type : sap.ui.core.mvc.ViewType.XML
		});
		
		shipmentListView  = sap.ui.view({
			id : "shipmentList",
			viewName : "SpicersTruck.view.ShipmentList",
			type : sap.ui.core.mvc.ViewType.XML
		});

		shipmentView  = sap.ui.view({
			id : "shipment",
			viewName : "SpicersTruck.view.Shipment",
			type : sap.ui.core.mvc.ViewType.XML
		});

		deliveryView  = sap.ui.view({
			id : "delivery",
			viewName : "SpicersTruck.view.Delivery",
			type : sap.ui.core.mvc.ViewType.XML
		});

		confirmDeliveryView  = sap.ui.view({
			id : "confirmDelivery",
			viewName : "SpicersTruck.view.ConfirmDelivery",
			type : sap.ui.core.mvc.ViewType.XML
		});

		// instantiate busy dialog
		busyDialog = new sap.m.BusyDialog();

		// show main page at the start of the app
		application.addPage(mainView);

		return application;
	}

});