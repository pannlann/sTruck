sap.ui.controller("SpicersTruck.view.ShipmentList", {
	onInit : function() {

		shipmentListController = this;
	},

	pressShipmentListBack : function(evt){
		logoff();
		hashChanger.setHash(router.getURL(""));
	},
	
	shipmentListPressed : function(evt){
		// setup selected shipment Model
		var selectedPath = evt.getParameters().listItem.getBindingContextPath();
		var selectedShipmentData = application.getModel('Shipment').getProperty(selectedPath);

		selectedShipmentModel = new sap.ui.model.json.JSONModel();
		selectedShipmentModel.setData(selectedShipmentData);
		application.setModel(selectedShipmentModel, 'SelectedShipment');

		// update shipment view title
//		var shipmentTitle = "Shipment# " + selectedShipmentData.Shipment;
		var shipmentTitle = "Shipment Detail";
		shipmentController.getView().byId('shipmentPage').setTitle(shipmentTitle);
		clearCurrentDeliverySelection();

		hashChanger.setHash(router.getURL("Shipment"));

		
	}
});