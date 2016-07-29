sap.ui.controller("SpicersTruck.view.Delivery", {

	onInit : function() {

		deliveryController = this;
	},

	pressDeliveryBack : function(evt) {

		logoff();
		returnDelJSON = {ReturnDelItemCollection : []};
		clearCurrentDeliverySelection();
		hashChanger.setHash(router.getURL("Shipment"));
	},

	confirmDeliveryPressed : function(evt) {

		var returnDelModel = new sap.ui.model.json.JSONModel();
		returnDelModel.setData(returnDelJSON);
		application.setModel(returnDelModel, 'ReturnDel');
		
		hashChanger.setHash(router.getURL("ConfirmDelivery"));
		confirmDeliveryController.getGeolocation();
		confirmDeliveryController.getView().byId('signatureInput').clear();
		confirmDeliveryController.getView().byId('recipientInput').setValue('');
		confirmDeliveryController.getView().byId('commentInput').setValue('');

		getXCSRFToken();
		deliveryController.getAllCustomerDN();
		confirmDeliveryController.getView().byId('customerDNTable').selectAll();
		
	},
	
	getAllCustomerDN : function(){
		var temp;
		customerDNList = [];
		var currentCustomer = deliveryController.getView().getModel('Delivery').getData().Customer;
		var dnList = shipmentController.getView().getModel('SelectedShipment').getData().DeliveryHeaderCollection.results
		var currentCustomerDN = dnList.findAll({Customer : currentCustomer});
		for(var i = 0; i < currentCustomerDN.length; i++){
			temp = {
			        'Delivery':currentCustomerDN[i].Delivery,
			        'TotalUnit':currentCustomerDN[i].TotalUnit.replace(/^0+/, '')
			}
			customerDNList.add(temp);
		}
		var customerDNModel = new sap.ui.model.json.JSONModel();
		customerDNModel.setData(customerDNList);
		application.setModel(customerDNModel, 'customerDN');

	},

	returnButtonPressed : function(evt) {

		console.log('return press');
		var button = evt.getSource();
		var selectedLine = button.getParent();
		var selectedLineData = selectedLine.getModel('Delivery').getProperty(selectedLine.getBindingContextPath());
		var isPressed = button.getPressed();

		matchedIndex = returnDelJSON.ReturnDelItemCollection.findIndex({
			"Delivery" : selectedLineData.Delivery,
			"DeliveryItem" : selectedLineData.DeliveryItem,
		});

		// if return is pressed, add object or update value in JSON object
		if (isPressed) {

			if (matchedIndex >= 0) {
				// update qty
				returnDelJSON.ReturnDelItemCollection[matchedIndex].Qty = parseFloat(returnDelJSON.ReturnDelItemCollection[matchedIndex].Qty) + parseFloat(selectedLineData.Qty);
				returnDelJSON.ReturnDelItemCollection[matchedIndex].Qty = returnDelJSON.ReturnDelItemCollection[matchedIndex].Qty.toString();
			} else {
				// add object
				var returnDel = {
					"Delivery" : selectedLineData.Delivery,
					"DeliveryItem" : selectedLineData.DeliveryItem,
					"Material" : selectedLineData.Material,
				  "MaterialDesc" : selectedLineData.MaterialDesc,			
					"Qty" : selectedLineData.Qty,
					"QtyUom" : selectedLineData.QtyUom
				}
				returnDelJSON.ReturnDelItemCollection.push(returnDel);
				returnDelJSON.Delivery = selectedLineData.Delivery;

			}

		} else {
			// if return is unpressed, remove object or subtract value in JSON object
			if (matchedIndex >= 0) {
				// update qty
				returnDelJSON.ReturnDelItemCollection[matchedIndex].Qty = parseFloat(returnDelJSON.ReturnDelItemCollection[matchedIndex].Qty) - parseFloat(selectedLineData.Qty);
				if (returnDelJSON.ReturnDelItemCollection[matchedIndex].Qty == 0) {
					// remove object
					returnDelJSON.ReturnDelItemCollection.removeAt(matchedIndex);
				} else {
					returnDelJSON.ReturnDelItemCollection[matchedIndex].Qty = returnDelJSON.ReturnDelItemCollection[matchedIndex].Qty.toString();
				}
			}
		}
	},
});