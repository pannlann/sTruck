sap.ui.controller("SpicersTruck.view.Main", {
	onInit : function() {

		mainController = this;
	},

	onAfterRendering : function() {

		// remove splash screen
		$("#appLoadingIndicator").remove();
	},

	pressedLogin : function(evt) {

		console.log('pressedLogin');
		var truckId = mainController.getView().byId('truckIdInput').getValue().trim();
		var carrierId = mainController.getView().byId('carrierIdInput').getValue().trim();
		var shipmentId = mainController.getView().byId('shipmentIdInput').getValue().trim();
		
		this.login(truckId, carrierId, shipmentId);
	},

	login : function(truckId, carrierId, shipmentId) {
		busyDialog.setText('Retriving Shipment Information');
		busyDialog.open();
		var query = ODATA_URL + oDataUrl.Shipment;
		query = query.replace("{TruckID}", truckId);
		query = query.replace("{CarrierID}", carrierId);
		query = query.replace("{ShipmentID}", shipmentId);

		executeQuery(query, CRUD_GET, this.loginCallback);

	},
	
	shipmentIdChange : function(evt){
		mainController.getView().byId('truckIdInput').setValue('');
		mainController.getView().byId('carrierIdInput').setValue('');
		
	},

	carrierIdChange : function(evt){
		mainController.getView().byId('truckIdInput').setValue('');
		mainController.getView().byId('shipmentIdInput').setValue('');
	},

	truckIdChange : function(evt){
		mainController.getView().byId('carrierIdInput').setValue('');
		mainController.getView().byId('shipmentIdInput').setValue('');
	},

	loginCallback : function(data) {

		shipmentCollection = data.d;
		if (shipmentCollection.results.length > 0) {
			
			var truckId = shipmentCollection.results[0].Vehicle; 
		  var carrierText = shipmentCollection.results[0].CarrierText;
			// set shipment data globally
			shipmentModel = new sap.ui.model.json.JSONModel();
			shipmentModel.setData(shipmentCollection);
			application.setModel(shipmentModel, 'Shipment');
			
			hashChanger.setHash(router.getURL("ShipmentList"));

			// update shipment view title
			var shipmentTitle = carrierText + ' - ' + truckId;;
			shipmentListController.getView().byId('shipmentListPage').setTitle(shipmentTitle);
			clearCurrentShipmentSelection();

		} else {
			sap.m.MessageToast.show('No Shipment available. Please check your truck id.');			
		}
		busyDialog.close();

	},

});