jQuery.sap.declare("SpicersTruck.util.InputWithClear" );
jQuery.sap.require("sap.m.Input");
sap.m.Input.extend("SpicersTruck.util.InputWithClear", {
  init: function() {
    this.setShowValueHelp(true);
  },
  
  renderer: {},
  
  onAfterRendering: function() {
    if (sap.m.Input.prototype.onAfterRendering) {
      sap.m.Input.prototype.onAfterRendering.apply(this, arguments);
    }
    
    var icon = this._getValueHelpIcon();
    icon.setSrc("sap-icon://sys-cancel");
    icon.setSize('2rem');
    icon.setHeight('230%');
  },
  
  fireValueHelpRequest: function(){
    this.setValue("");
  }
});