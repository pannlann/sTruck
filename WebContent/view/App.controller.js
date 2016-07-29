sap.ui.controller("SpicersTruck.view.App", {

	onInit: function() {
		appController = this;
	},

	onAfterRendering: function() {
		// remove splash screen
		$("#appLoadingIndicator").remove();
	},


});