sap.ui.controller("SpicersTruck.view.ConfirmDelivery", {

	onInit : function() {

		confirmDeliveryController = this;
	},

	confirmDeliveryBackPressed : function(evt) {

		hashChanger.setHash(router.getURL("Delivery"));
	},

	confirmReceivePressed : function(evt) {

		var recipientValue = confirmDeliveryController.getView().byId('recipientInput').getValue();
		var commentValue = confirmDeliveryController.getView().byId('commentInput').getValue();
		var signatureInput = confirmDeliveryController.getView().byId('signatureInput');

		customerDNComfirmedList = [];
		
		var customerDNModel = application.getModel('customerDN');
		var customerDNConfirmedPath = confirmDeliveryController.getView().byId('customerDNTable').getSelectedContextPaths();
		for(var i = 0; i < customerDNConfirmedPath.length; i++){
			customerDNComfirmedList.add(customerDNModel.getProperty(customerDNConfirmedPath[i]).Delivery);
		}
		
		// check recipient value
		if (recipientValue.length > 0 && signatureInput.isEmpty() == false && customerDNConfirmedPath.length > 0) {
			confirmDeliveryController.attachSignature();
		} else {
			if(signatureInput.isEmpty()){				
				sap.m.MessageToast.show("Please sign to confirm receive the delivery.");
			}else if(customerDNConfirmedPath.length == 0) {
				sap.m.MessageToast.show("Please select delivery received.");				
			}else {				
				sap.m.MessageToast.show("Please enter recipient name.");
			}
		}

	},

	attachSignature : function() {
		// get signature
		var recipientValue = confirmDeliveryController.getView().byId('recipientInput').getValue();
		var commentValue = confirmDeliveryController.getView().byId('commentInput').getValue();
		var signatureInput = confirmDeliveryController.getView().byId('signatureInput');
		var signatureBase64 = signatureInput.getSignature().split(',')[1];
		var deliveryName = "Recipient Name : " + recipientValue;
		var deliveryTime = "Delivery Time : " + Date.present().toString("dd/MM/yyyy HH:mm");
		var deliveryGeo = "Geolocation : " + confirmDeliveryController.getView().byId('geolocationInput').getText();
		currentConfirmedDN = customerDNComfirmedList.pop();
		var attachmentPayload = {
			'OrderNo' : currentConfirmedDN,
			'Signature' : signatureBase64,
			'Timestamp' : deliveryTime,
			'Geolocation' : deliveryGeo,
			'Recipient' : deliveryName,
			'DocumentType' : 'D',
			'Comment' : commentValue
		};

		var busyMessage = "Confirming Delivery " + currentConfirmedDN +"...";
		busyDialog.setText(busyMessage);
		busyDialog.open();

		var query = ODATA_URL + oDataUrl.ConfirmDelivery;
		executeQuery(query, CRUD_POST, confirmDeliveryController.successAttachSignature, defaultErrorCallback, attachmentPayload);
	},

	successAttachSignature : function(data) {
		busyDialog.close();
		
		var selectedDelivery = currentConfirmedDN;
		var selectedShipmentData = shipmentController.getView().getModel('SelectedShipment').getData();
		var selectedDeliveryIndex = selectedShipmentData.DeliveryHeaderCollection.results.findIndex({
			Delivery : selectedDelivery,
		});

		if (selectedDeliveryIndex >= 0) {
			selectedShipmentData.DeliveryHeaderCollection.results[selectedDeliveryIndex].DeliveredFlag = 'X';
			
			var selectedShipmentModel = shipmentController.getView().getModel('SelectedShipment')
			selectedShipmentModel.setData(selectedShipmentData);
			application.setModel(selectedShipmentModel, 'SelectedShipment');
			
		}

		if(customerDNComfirmedList.length > 0){
			confirmDeliveryController.attachSignature();			
		} else {
		
			hashChanger.setHash(router.getURL("Shipment"));
			sap.m.MessageToast.show("Confim the delivery successfully.");		
		}

	},	
	
	clearSignaturePressed : function(evt) {

		confirmDeliveryController.getView().byId('signatureInput').clear();
	},

	getGeolocation : function(evt) {

		// get location from browser
		if (typeof Windows === 'undefined') {
			confirmDeliveryController.getBrowserGeolocation();
		} else {
			// windows app
			confirmDeliveryController.getWinGeolocation();
		}
	},

	getWinGeolocation : function() {

		var geolocator = new Windows.Devices.Geolocation.Geolocator();
		getGeopositionPromise = geolocator.getGeopositionAsync();
		getGeopositionPromise.done(function(pos) {

			var coord = pos.coordinate;
			var currentLocation = coord.point.position.latitude + ', ' + coord.point.position.longitude;
			confirmDeliveryController.getView().byId('geolocationInput').setText(currentLocation);

		}, function(err) {

		});
	},

	getBrowserGeolocation : function() {

		navigator.geolocation.getCurrentPosition(function(position) {

			var currentLocation = position.coords.latitude + ', ' + position.coords.longitude;
			confirmDeliveryController.getView().byId('geolocationInput').setText(currentLocation);
		}, function getLocationError(error) {

			var currentLocation = 'Cannot determine location';
			confirmDeliveryController.getView().byId('geolocationInput').setText(currentLocation);
		});

	},


	createReturnDelivery : function() {

		busyDialog.setText('Creating Return Order...');
		busyDialog.open();

		for (var i = 0; i < returnDelJSON.ReturnDelItemCollection.length; i++) {
			delete returnDelJSON.ReturnDelItemCollection[i].Material;
			delete returnDelJSON.ReturnDelItemCollection[i].MaterialDesc;
		}

		var query = ODATA_URL + oDataUrl.ReturnDelivery;
		executeQuery(query, CRUD_POST, this.successCreateReturnDel, defaultErrorCallback, returnDelJSON);

	},

	successCreateReturnDel : function(data) {

		busyDialog.close();
		sap.m.MessageToast.show("Return order has been created successfully. Please bring the goods back to the warehouse.");

		var truckId = mainController.getView().byId('truckIdInput').getValue();
		mainController.login(truckId);
	},

});