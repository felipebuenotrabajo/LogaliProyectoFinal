sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageBox"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.core.routing.History} History
     * @param {typeof sap.m.MessageBox} MessageBox
	 */
    function (Controller, History, MessageBox) {
        "use strict";

        function onInit() {

        };

        function onCancelNewEmployee() {

            MessageBox.confirm(this.getView().getModel("i18n").getResourceBundle().getText("confirmCancelNewEmployee"), {
                onClose: function (oAction) {
                    if (oAction === "OK") {
                        var oHistory = History.getInstance();
                        var sPreviousHash = oHistory.getPreviousHash();

                        if (sPreviousHash !== undefined) {
                            window.history.go(-1);
                        } else {
                            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                            oRouter.navTo("RouteMenu", true);
                        }
                    }

                }.bind(this)
            });


        };


        var NewEmployee = Controller.extend("EmployeeManager.employeemanager.controller.NewEmployee", {});

        NewEmployee.prototype.Init = onInit;
        NewEmployee.prototype.onCancelNewEmployee = onCancelNewEmployee;
        return NewEmployee;

    });
