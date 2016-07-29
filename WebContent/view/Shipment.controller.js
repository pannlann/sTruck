sap.ui.controller("SpicersTruck.view.Shipment", {
	contactModel : null,
	onInit : function() {

		shipmentController = this;
	},

	shipmentBackPressed : function(evt) {

		clearCurrentShipmentSelection();
		hashChanger.setHash(router.getURL("ShipmentList"));
		
	},

	deliveryItemPressed : function(evt) {

		// setup delivery Model
		var selectedPath = evt.getParameters().listItem.getBindingContextPath();
		var selectedDeliveryData = application.getModel('SelectedShipment').getProperty(selectedPath);

		deliveryModel = new sap.ui.model.json.JSONModel();
		deliveryModel.setData(selectedDeliveryData);
		application.setModel(deliveryModel, 'Delivery');

		// clear return json
		returnDelJSON = {ReturnDelItemCollection : []};
		
		hashChanger.setHash(router.getURL("Delivery"));

		// get contact lists
//		this.getContactList(selectedDeliveryData.Customer);

	},

	getContactListCallback : function(data) {

		if (this.contactModel == null) {
			this.contactModel = new sap.ui.model.json.JSONModel();
		}

		var contactCollection = data.d;
		contactModel.setData(contactCollection);
		application.setModel(contactModel, 'Contact');

	},

	getContactList : function(customerNo) {

		var query = ODATA_URL + oDataUrl.ContactList;
		query = query.replace("{Customer}", customerNo);

		executeQuery(query, CRUD_GET, this.getContactListCallback);

	},
});