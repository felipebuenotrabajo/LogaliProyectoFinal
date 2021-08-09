sap.ui.define([
    "EmployeeManager/employeemanager/controller/Base.controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
	/**
	 * @param {typeof EmployeeManager.employeemanager.controller} Base
	 * @param {typeof sap.ui.model.Filter} Filter
	 * @param {typeof sap.ui.model.FilterOperator} FilterOperator
	 */
    function (Base, Filter, FilterOperator) {
        "use strict";

        function _onObjectMached(oEvent) {
            var oContext = oEvent.getParameter("listItem").getBindingContext("employeeModel").getObject();
            var employeeID = oContext.EmployeeId;

            this.byId("UploadCollection").bindAggregation("items", {
                path: "employeeModel>/Attachments",
                filters: [
                    new Filter("SapId", FilterOperator.EQ, this.getOwnerComponent().SapId),
                    new Filter("EmployeeId", FilterOperator.EQ, employeeID),
                ],
                template: new sap.m.UploadCollectionItem({
                    documentId: "{employeeModel>AttId}",
                    visibleEdit: false,
                    fileName: "{employeeModel>DocName}"
                }).attachPress(this.onEmployeeFileDownload)

            });
        };


        function onInit() {
        };

        function onSelectEmployee(oEvent) {
            this.byId("SplitEmployee").to(this.createId("detailEmployee"));

            var context = oEvent.getParameter("listItem").getBindingContext("employeeModel");
            this.newEmployeeId = context.getProperty("EmployeeId");
            var detailEmployee = this.byId("detailEmployee");
            //Concatenamos el id de empleado con el mail de usuario
            detailEmployee.bindElement("employeeModel>/Users(EmployeeId='" + this.newEmployeeId + "',SapId='" + this.getOwnerComponent().SapId + "')");
            
            this._onObjectMached(oEvent);
            // var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            // oRouter.getRoute("RouteShowEmployees").attachPatternMatched(_onObjectMached, this);

        };

        function onSearchEmployee(oEvent) {
            var sQuery = oEvent.getSource().getValue();
            var filters = [];
            if (sQuery && sQuery.length > 0) {
				var filter = new Filter("FirstName", FilterOperator.Contains, sQuery);
				filters.push(filter);
            }
           if (sQuery && sQuery.length > 0) {
				var filter = new Filter("LastName", FilterOperator.Contains, sQuery);
				filters.push(filter);
			}   
           if (sQuery && sQuery.length > 0) {
				var filter = new Filter("EmployeeId", FilterOperator.Contains, sQuery);
				filters.push(filter);
			}           
            
            var oList = this.getView().byId("qwqw");
            var oBinding = oList.getBinding("items");
            oBinding.filter(filters);
        };

        function onGetFireEmployee() {

        };
        function onPromoteEmployee() {

        };

        var Main = Base.extend("EmployeeManager.employeemanager.controller.ShowEmployees", {});

        Main.prototype.onInit = onInit;
        Main.prototype.onSelectEmployee = onSelectEmployee;
        Main.prototype.onSearchEmployee = onSearchEmployee;
        Main.prototype.onGetFireEmployee = onGetFireEmployee;
        Main.prototype.onPromoteEmployee = onPromoteEmployee;
        Main.prototype._onObjectMached = _onObjectMached;
        
        return Main;
    });
