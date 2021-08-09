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
            this.EmployeeId = context.getProperty("EmployeeId");
            var detailEmployee = this.byId("detailEmployee");
            //Concatenamos el id de empleado con el mail de usuario
            detailEmployee.bindElement("employeeModel>/Users(EmployeeId='" + this.EmployeeId + "',SapId='" + this.getOwnerComponent().SapId + "')");

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

            var oList = this.getView().byId("EmployeeList");
            var oBinding = oList.getBinding("items");
            oBinding.filter(filters);
        };

        function onGetFireEmployee() {
            sap.m.MessageBox.confirm(this.getView().getModel("i18n").getResourceBundle().getText("showEmployeeConfirmDelete"), {
                onClose: function (oAction) {
                    if (oAction === "OK") {
                        var employeePath = "/Users(EmployeeId='" + this.EmployeeId + "',SapId='" + this.getOwnerComponent().SapId + "')".
                            this.getView().getModel("employeeModel").remove(employeePath, {
                                success: function (data) {
                                    sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("showEmployeeDeleted"));
                                    this.byId("SplitEmployee").to(this.createId("detailEmployee"));
                                }.bind(this),
                                error: function () {
                                    sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("showEmployeeErrorDeleted"));
                                }.bind(this)
                            });
                    }
                }.bind(this)
            });
        };

        function onPromoteEmployee() {
            var i18nText = this.getView().getModel("i18n").getResourceBundle().getText("promoteEmployeeTitle");
            var oPage = new sap.m.Page({
                title: i18nText,
            });

            i18nText = this.getView().getModel("i18n").getResourceBundle().getText("promoteEmployeeOK");
            var oButtonOk = new sap.m.Button("Save", {
                text: i18nText,
                tap: [this.Save, this]
            });
            i18nText = this.getView().getModel("i18n").getResourceBundle().getText("promoteEmployeeOK");
            var oButtonCancel = new sap.m.Button("Cancel", {
                text: "i18nText",
                tap: [this.Cancel, this]
            });
            i18nText = this.getView().getModel("i18n").getResourceBundle().getText("promoteEmployeeOK");
            var i18nTextSalary = this.getView().getModel("i18n").getResourceBundle().getText("promoteEmployeeSalary");
            var i18nTextDate = this.getView().getModel("i18n").getResourceBundle().getText("promoteEmployeeDate");
            var i18nTextComments = this.getView().getModel("i18n").getResourceBundle().getText("promoteEmployeeComments");

            var oDialog = new sap.m.Dialog("Dialog1", {
                title: "promoteEmployeeTitle",
                modal: true,
                contentWidth: "1em",
                buttons: [oButtonOk, oButtonCancel],
                content: [
                    new sap.m.Label({ text: i18nTextSalary }),
                    new sap.m.Input({
                        maxLength: 20,
                        id: "EmployeePromoteSalary"
                    }),
                    new sap.m.Label({ text: i18nTextDate }),
                    new sap.m.Input({
                        maxLength: 20,
                        id: "EmployeePromoteDate"
                    }),
                    new sap.m.Label({ text: i18nTextComments }),
                    new sap.m.Input({
                        maxLength: 3,
                        id: "EmployeePromoteComments"
                    }),
                ]
            });

            sap.ui.getCore().byId("Dialog1").open();

        };

        function Cancel() {

            sap.ui.getCore().byId("Dialog1").close();

        }

        function Save() {
            i18nTextSalary = this.getView().getModel("i18n").getResourceBundle().getText("promoteEmployeeSalary");
            i18nTextDate = this.getView().getModel("i18n").getResourceBundle().getText("promoteEmployeeDate");
            i18nTextComments = this.getView().getModel("i18n").getResourceBundle().getText("promoteEmployeeComments");

            sap.ui.getCore().byId("Dialog1").close();

            var employeePromoteSalary = sap.ui.getCore().byId(promoteEmployeeSalary).getValue();

            var employeePromoteDate = sap.ui.getCore().byId().getValue(promoteEmployeeDate);

            var employeePromoteComments = sap.ui.getCore().byId(promoteEmployeeComments).getValue();

            this.riseDialog.setModel(new sap.ui.model.json.JSONModel({}), "newRise");

            if (!this.promotedEmployee) {
                this.promotedEmployee.setModel(new sap.ui.model.json.JSONModel({
                    Ammount: employeePromoteSalary,
                    CreationDate: employeePromoteDate,
                    Comments: employeePromoteComments,
                }), "newPromoteEmployee");
                var newRise = this.riseDialog.getModel("newRise");
                var odata = newRise.getData();
                var body = {
                    Ammount: odata.Ammount,
                    CreationDate: odata.CreationDate,
                    Comments: odata.Comments,
                    SapId: this.getOwnerComponent().SapId,
                    EmployeeId: this.employeeId
                };
                this.getView().getModel("employeeModel").create("/Salaries", body, {
                    success: function () {
                        sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("promoteEmployeeSavedOk"));
                    }.bind(this),
                    error: function () {
                        sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("promoteEmployeeSavedKO"));
                    }.bind(this)
                });
            }

        }

        var Main = Base.extend("EmployeeManager.employeemanager.controller.ShowEmployees", {});

        Main.prototype.onInit = onInit;
        Main.prototype.onSelectEmployee = onSelectEmployee;
        Main.prototype.onSearchEmployee = onSearchEmployee;
        Main.prototype.onGetFireEmployee = onGetFireEmployee;
        Main.prototype.onPromoteEmployee = onPromoteEmployee;
        Main.prototype._onObjectMached = _onObjectMached;

        return Main;
    });
