jQuery.sap.declare("SpicersTruck.util.RoutingLogic");

var routingLogic = [ {
	name : "Main",
	pattern : "",
	view : "SpicersTruck.view.Main",
	viewType : sap.ui.core.mvc.ViewType.XML,
	subroutes : [ {
		name : "ShipmentList",
		pattern : "ShipmentList",
		view : "SpicersTruck.view.ShipmentList",
		viewType : sap.ui.core.mvc.ViewType.XML,
		subroutes : [ {
			name : "Shipment",
			pattern : "ShipmentList/Shipment",
			view : "SpicersTruck.view.Shipment",
			viewType : sap.ui.core.mvc.ViewType.XML,
			subroutes : [ {
				name : "Delivery",
				pattern : "ShipmentList/Shipment/Delivery",
				view : "SpicersTruck.view.Delivery",
				viewType : sap.ui.core.mvc.ViewType.XML,
				subroutes : [ {
					name : "ConfirmDelivery",
					pattern : "ShipmentList/Shipment/Delivery/ConfirmDelivery",
					view : "SpicersTruck.view.ConfirmDelivery",
					viewType : sap.ui.core.mvc.ViewType.XML,
				} ]
			} ]
		} ]
	} ]
}, ];