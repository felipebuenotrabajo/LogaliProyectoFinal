sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
    function (Controller) {
        "use strict";

        return Controller.extend("EmployeeManager.employeemanager.controller.Base", {
            onInit: function () {

            },

            navToNewEmployee: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteNewEmployee", { });
            },

            navToViewEmployee: function () {

            }
        });
    });
