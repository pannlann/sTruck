jQuery.sap.declare("SpicersTruck.util.Global");

var application;
// ----------- VIEWS ----------
var appView;
var mainView;
// -------------------Controller
var appController;
var mainController;
var shipmentController;
var shipmentListController;
var deliveryController;
var confirmDeliveryController;
// ------------Model
var shipmentModel;
var shipmentCollection;
var deliveryModel;
var deliveryCollection;

// /----------GLOBAL VARIABLE-----------------
var sharedStorage;
var router;
var hashChanger;
var xcsrftoken;
var username;
var busyDialog;
var currentConfirmedDN;
var returnDelJSON = {
	ReturnDelItemCollection : []
};
var customerDNList = [];
var customerDNComfirmedList = [];
// ---------- oData URL -----------------
var oDataUrl = {
	Shipment : 'ShipmentCollection?$filter=Vehicle eq \'{TruckID}\' and Carrier eq \'{CarrierID}\' and Shipment eq \'{ShipmentID}\'&$expand=DeliveryHeaderCollection/DeliveryTruckItemCollection&$format=json',
	ContactList : 'ContactCollection?$filter=Customer eq \'{Customer}\'&$format=json',
	Attachment : 'AttachmentCollection',
	ConfirmDelivery : 'ConfirmDeliveryCollection',
	ReturnDelivery : 'ReturnDelHeaderCollection'
}

function getXCSRFToken() {

	$.ajax({
		type : CRUD_GET,
		url : ODATA_URL,
		timeout : 5000,
		headers : {
			"X-CSRF-Token" : "Fetch",
			"Accept" : 'application/json',
			"Authorization" : 'Basic ' + btoa(USERNAME + ':' + PASSWORD)
		},

		success : function(data, textStatus, jqXHR) {

			xcsrftoken = jqXHR.getResponseHeader("x-csrf-token");
		},

		error : function(xhr, textStatus, errorThrown) {

			defaultErrorCallback(xhr, textStatus, errorThrown);
		},
	});

}

function executeQuery(query, operation, successCallback, errorCallback, payloadData) {

	var isGetTokenSuccessful;
	var ajaxHeader;

	if (operation != CRUD_GET) {
		// refresh token before call create query
		getXCSRFToken();

		ajaxHeader = {
			"X-CSRF-Token" : xcsrftoken,
			"Authorization" : 'Basic ' + btoa(USERNAME + ':' + PASSWORD),
			"Content-Type" : "application/json"
		}
	} else {

		ajaxHeader = {
			"X-CSRF-Token" : "fetch",
			"Authorization" : 'Basic ' + btoa(USERNAME + ':' + PASSWORD),
			"Content-Type" : "application/json"
		}

	}
	setTimeout(function() {

		$.ajax({
			type : operation,
			url : query,
			data : JSON.stringify(payloadData),
			dataType : "json",
			headers : ajaxHeader,
			success : function(data, textStatus, jqXHR) {

				var tempToken = jqXHR.getResponseHeader('x-csrf-token');
				if (tempToken != null) {
					xcsrftoken = tempToken;
				}
				if (typeof (successCallback) != 'undefined') {
					successCallback(data);
				}
			},
			error : function(xhr, textStatus, errorThrown) {

				if (typeof (errorCallback) != 'undefined') {
					errorCallback(xhr, textStatus, errorThrown);
				} else {
					defaultErrorCallback(xhr, textStatus, errorThrown, errorCallback);
				}

			},
		});
	}, 1000);

}

function clearAuthentication() {

	try {
		document.execCommand("ClearAuthenticationCache", "false");
	} catch (e) {
		console.log(e);
	}
}

// save { } into local storage

function saveLocalStorage(oData) {

	if (typeof (Windows) != "undefined") {
		if (typeof (Windows.Storage) != "underfined") {
			var storage = Windows.Storage;
			var settings = storage.ApplicationData.current.roamingSettings;
			settings.values["userData"] = JSON.stringify(oData);
		} else {
			if (typeof (Storage) !== "undefined") {
				localStorage.userData = JSON.stringify(oData);
			}
		}
	} else {
		if (typeof (Storage) !== "undefined") {
			localStorage.userData = JSON.stringify(oData);
		}
	}
}

function getAppVersion() {

	if (typeof (Windows) != "undefined") {
		var p = Windows.ApplicationModel.Package.current.id.version;
		return "Version: " + p.major + "." + p.minor + "." + p.build + "." + p.revision;
	} else {
		return "Version: Browser";
	}
}

function defaultErrorCallback(xhr, textStatus, errorThrown, errorFunction) {

	var errorMessage;

	console.log(xhr);
	busyDialog.close();
	if (xhr.readyState == 4) {
		if (xhr.status == 401) {
			errorMessage = "User " + username + " is unauthorized.";
		} else if (xhr.status == 401) {
			errorMessage = "Connection error. System may not be available. Please contact system administrator.";
		} else {
			var resText = xhr.responseText;
			var resObj;
			if (resText) {
				var resObj = JSON.parse(resText);
				var mes = resObj.error.message.value;
				if (mes) {
					errorMessage = mes;
				} else {
					errorMessage = xhr.statusText;
				}
			} else {
				errorMessage = xhr.statusText;
			}
			if (errorFunction) {
				errorFunction();
			}
		}
	} else if (xhr.readyState == 0) {
		errorMessage = "Internet not available or connection refused.";
	} else {
		errorMessage = "Unknown errors. Please contact administration team.";
	}
	sap.m.MessageBox.show(errorMessage, {
		icon : sap.m.MessageBox.Icon.ERROR,
		title : "Error",
		actions : [ sap.m.MessageBox.Action.OK ],
	});
}

function number(nStr, shortForm) {

	var result;
	if (isNaN(nStr) || nStr == null) {
		return "";
	} else {
		nStr += '';
		x = nStr.split('.');
		x1 = x[0];
		x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		result = x1 + x2.substring(0, 3);
	}

	x = result.split('.');
	if (shortForm && x[0].length > 3) {
		result = x[0].slice(0, x[0].length - 4) + 'k';
		result = result.remove(',');
	}

	return result;
}

function convertJSDateToODataDate(jsDate) {

	var oDataDate;
	if (jsDate != null) {
		oDataDate = jsDate.toString("yyyy-MM-ddTHH:mm");
		return oDataDate;
	} else {
		return '';
	}
}

function convertODataDateToJSDate(oDataDate) {

	if (oDataDate != null) {
		var utcTime = parseInt(oDataDate.substr(6));

		var date = new Date(utcTime);
		var minutesOffset = date.getTimezoneOffset();

		var jsDate = date.addMinutes(minutesOffset);
		return jsDate;

	} else {
		return '';
	}
}

function convertODateTimeToTime(oDataTime) {

	if (oDataTime) {

		var hh = oDataTime.substr(2, 2);
		var mm = oDataTime.substr(5, 2);
		return hh + ':' + mm;

	}
}

function logoff() {

}

function saveUsernameToStorage(username) {

	if (sharedStorage != null) {
		sharedStorage.setItem(USER_KEY, username);
	}
}

function getUsernameFromStorage() {

	var username = '';
	if (sharedStorage != null) {
		username = sharedStorage.getItem(USER_KEY);
	}
	return username;
}

function clearCurrentShipmentSelection() {

	var shipmentList = shipmentListController.getView().byId('shipmentList');
	var selectedItem = shipmentList.getSelectedItem();
	if (selectedItem) {
		shipmentList.setSelectedItem(selectedItem, false);
	}
}

function clearCurrentDeliverySelection() {

	var deliveryList = shipmentController.getView().byId('deliveryList');
	var selectedItem = deliveryList.getSelectedItem();
	if (selectedItem) {
		deliveryList.setSelectedItem(selectedItem, false);
	}
}