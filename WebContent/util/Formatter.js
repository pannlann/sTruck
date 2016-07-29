jQuery.sap.declare("SpicersTruck.util.Formatter");
jQuery.sap.require("sap.ui.core.format.DateFormat");

SpicersTruck.util.Formatter = {
	shipment : function(shipmentNo, totalUnit) {

		return 'Shipment#' + shipmentNo + '/ Package(s): ' + SpicersTruck.util.Formatter.removeLeadZero(totalUnit);
	},
	
	carrier : function(carrierText, vehicle){
		return carrierText + ' - ' + vehicle;
	},
	
	contact : function(firstName, lastName, email) {

		return firstName + ' ' + lastName + ' (' + email + ')'
	},

	weightUom : function(weight, uomText) {

		return weight + ' ' + uomText;
	},
	deliveryHeading : function(delNo, delName) {

		var output = 'DN#' + delNo.toString() + ' - ' + delName;
		return output;
	},

	confDeliveryHeading : function(delNo) {

		var output = 'Confirm DN#' + delNo.toString();
		return output;
	},

	deliveryWeight : function(weight, weightUom) {

		var output = 'Weight: ' + weight + ' ' + weightUom;
		return output;
	},

	grossWeight : function(weight, weightUom) {

		var output = 'Gross Weight: ' + weight + ' ' + weightUom;
		return output;
	},

	deliveryPackages : function(packages) {

		packages = packages.replace(/^0+/, '');

		var output = 'Total: ' + packages + ' package(s)';
		return output;
	},

	flag : function(flag) {

		if (flag == '') {
			return false;
		} else {
			return true;
		}
	},

	deliveredIcon : function(deliveredFlag) {

		if (deliveredFlag) {
			return false;
		} else {
			if (deliveredFlag == 'X') {
				return true;
			} else {
				return false;
			}
		}
	},

	showInstruction : function(instruction) {

		if (instruction) {
			if (instruction.trim().length > 0) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	},

	removeLeadZero : function(input) {

		var number = input.replace(/^0+/, '');
		return number;
	},

	deliveryDateTime : function(delDate, delTime) {

		var delDisplayDate = convertODataDateToJSDate(delDate).toString("dd/MM/yyyy");
		var delDisplayTime = convertODateTimeToTime(delTime);
		return "Requested:" + delDisplayDate + " " + delDisplayTime;
	},

	despatchDateTime : function(delDate, delTime) {

		var delDisplayDate = convertODataDateToJSDate(delDate).toString("dd/MM/yyyy");
		var delDisplayTime = convertODateTimeToTime(delTime);
		return "Despatch Time:" + delDisplayDate + " " + delDisplayTime;
	},

	addressLink : function(address) {

		return "maps:q=" + address;
	},

	shipmentTitle : function(shipmentNo) {

		return "Shipment# " + shipmentNo;
	},

	materialItem : function(materialNo, materialDesc) {

		return "#" + materialNo + ": " + materialDesc;
	},

	materialQty : function(qty, uom) {

		return "Qty: " + qty + " " + uom;
	}
}
