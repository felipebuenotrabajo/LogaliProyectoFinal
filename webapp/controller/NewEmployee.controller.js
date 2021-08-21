sap.ui.define([
    "EmployeeManager/employeemanager/controller/Base.controller",
    "sap/m/MessageBox",
    "sap/m/UploadCollectionParameter"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Base} Controller
     * @param {typeof sap.m.MessageBox} MessageBox
     * @param {typeof sap.m.UploadCollectionParameter} UploadCollectionParameter
	 */
    function (Base, MessageBox, UploadCollectionParameter) {
        "use strict";

        function onInit() {
        };

        function onBeforeRendering() {

            var oView = this.getView();
            var oJSONModelEmpl = new sap.ui.model.json.JSONModel({});
            oView.setModel(oJSONModelEmpl);
            this._modelEmployee = oJSONModelEmpl;

            var wizard = this.byId("NewEmployeeWizard");
            var employeeTypeStep = wizard.getSteps()[0];
            wizard.discardProgress(employeeTypeStep);
            wizard.goToStep(employeeTypeStep);
            employeeTypeStep.setValidated(false);

        };

        function onCancelNewEmployee() {

            MessageBox.confirm(this.getView().getModel("i18n").getResourceBundle().getText("NewEmployeeConfirmCancel"), {
                onClose: function (oAction) {
                    if (oAction === "OK") {
                        var navContainer = this.byId("navContainer");
                        navContainer.to(navContainer.getPages()[0].getId());
                        // this.onPressBackMenu();
                        // var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                        // oRouter.navTo("RouteMenu", {}, true);
                        // var oHistory = History.getInstance();
                        // var sPreviousHash = oHistory.getPreviousHash();

                        // if (sPreviousHash !== undefined) {
                        //     window.history.go(-1);
                        // } else {

                        // }
                    }

                }.bind(this)
            });

        };

        function buttonEmployeeType(oEvent) {

            var btnEmployeeType = oEvent.getSource();
            
            var _objEmployeeData = {
                EmployeeType: btnEmployeeType.data("btnTypeEmployee"),
                EmployeeSalary: ""
            };

            var Type;

            switch (_objEmployeeData.EmployeeType) {
                case "internal":
                    Type = "0";
                    _objEmployeeData.EmployeeSalary = 24000;
                    break;
                case 'manager':
                    Type = "2";
                    _objEmployeeData.EmployeeSalary = 70000;
                    break;
                case 'external':
                    Type = "1";
                    _objEmployeeData.EmployeeSalary = 400;
                    break;
                default:
            }

            this._modelEmployee.setData({ _objEmployeeData, Type });

            //  Si estamos en el paso 1 y pulsamos un botón, pasamos al paso 2
            var wizard = this.byId("NewEmployeeWizard");
            var employeeTypeStep = this.byId("employeeTypeStep").getId();
            var employeeDataStep = this.byId("employeeDataStep").getId();
            var curr_Stem = wizard.getCurrentStep();
            if (wizard.getCurrentStep() === employeeTypeStep) {
                wizard.nextStep();
            } else {
                wizard.goToStep(employeeDataStep);
            }
        };

        function onCheckDNI(oEvent) {

            if (this._modelEmployee.getProperty("_objEmployeeData/EmployeeType") !== "extern") {
                var dni = oEvent.getParameter("value");
                var number;
                var letter;
                var letterList;
                var regularExp = /^\d{8}[a-zA-Z]$/;
                //Se comprueba que el formato es válido
                if (regularExp.test(dni) === true) {
                    //Número
                    number = dni.substr(0, dni.length - 1);
                    //Letra
                    letter = dni.substr(dni.length - 1, 1);
                    number = number % 23;
                    letterList = "TRWAGMYFPDXBNJZSQVHLCKET";
                    letterList = letterList.substring(number, number + 1);
                    if (letterList !== letter.toUpperCase()) {
                        //Error
                        this._modelEmployee.setProperty("_objEmployeeData.DniStatus", "Error");
                    } else {
                        //Correcto
                        this._modelEmployee.setProperty("_objEmployeeData.DniStatus", "None");
                        this.dataEmployeeCheck();
                    }
                } else {
                    //Error
                    this._modelEmployee.setProperty("_objEmployeeData.DniStatus", "Error");
                }
            }
        };

        function dataEmployeeCheck(oEvent, callback) {
            //  Comprobamos que los datos esten rellenos
            var employeeObject = this._modelEmployee.getData();
            var employeeDataStatusOK = true;
            if (employeeObject.FirstName) {
                employeeObject._objEmployeeData.FirstNameStatus = "None";
            } else {
                employeeObject._objEmployeeData.FirstNameStatus = "Error";
                employeeDataStatusOK = false;
            };
            if (employeeObject.LastName) {
                employeeObject._objEmployeeData.LastNameStatus = "None";
            } else {
                employeeObject._objEmployeeData.LastNameStatus = "Error";
                employeeDataStatusOK = false;
            };
            if (employeeObject.CreationDate) {
                employeeObject._objEmployeeData.CreationDatetatus = "None";
            } else {
                employeeObject._objEmployeeData.CreationDateStatus = "Error";
                employeeDataStatusOK = false;
            };
            if (employeeObject.Dni) {
                employeeObject._objEmployeeData.DniStatus = "None";
            } else {
                employeeObject._objEmployeeData.DniStatus = "Error";
                employeeDataStatusOK = false;
            };
            if (employeeObject.CreationDate) {
                employeeObject._objEmployeeData.CreationDateStatus = "None";
            } else {
                employeeObject._objEmployeeData.CreationDateStatus = "Error";
                employeeDataStatusOK = false;
            };

            //Incicamos en el Wizard que el paso 2 está completo
            var wizard = this.byId("NewEmployeeWizard");
            if (employeeDataStatusOK) {
                wizard.validateStep(this.byId("employeeDataStep"));
            } else {
                wizard.invalidateStep(this.byId("employeeDataStep"));
            }

            if (callback) {
                callback(employeeDataStatusOK);
            }
        };

        function EmployeeWizardCompletedHandler(oEvent) {
            //Se comprueba que no haya error
            this.dataEmployeeCheck(oEvent, function (employeeDataStatusOK) {
                if (employeeDataStatusOK) {
                    //Se navega a la página review
                    var navContainer = this.byId("navContainer");
                    navContainer.to(this.byId("EmployeeDataReview"));
                    //Se obtiene los archivos subidos
                    var uploadCollection = this.byId("UploadCollection");
                    var files = uploadCollection.getItems();
                    var nFiles = uploadCollection.getItems().length;
                    this._modelEmployee.setProperty("/_nFiles", nFiles);
                    if (nFiles > 0) {
                        var arrayFiles = [];
                        for (var i in files) {
                            arrayFiles.push({ DocName: files[i].getFileName(), MimeType: files[i].getMimeType() });
                        }
                        this._modelEmployee.setProperty("/_arrayFiles", arrayFiles);
                    } else {
                        this._modelEmployee.setProperty("/_arrayFiles", []);
                    }
                } else {
                    var wizard = this.byId("NewEmployeeWizard");
                    wizard.goToStep(this.byId("dataEmployeeStep"));
                }
            }.bind(this));
        };

        // function onEmployeeFileChange(oEvent) {
        //     let oUploadCollection = oEvent.getSource();

        //     //Header Token CSRF - Cross-site request forgery
        //     let oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
        //         name: "x-csrf-token",
        //         value: this.getView().getModel("employeeModel").getSecurityToken()
        //     });
        //     oUploadCollection.addHeaderParameter(oCustomerHeaderToken);

        // };

        // function onEmployeeFileBeforeUploadStart(oEvent) {
        //     let oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
        //         name: "slug",
        //         value: this.getOwnerComponent().SapId + ";" + this.newEmployeeId + ";" + oEvent.getParameter("fileName")
        //     });
        //     oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
        // };

        // function onEmployeeFileBeforeUploadCompleted(oEvent) {

        // };
        // function onEmployeeFileDeleted(oEvent) {

        // };

        function _editStep(step) {
            var navContainer = this.byId("navContainer");

            var fnAfterNavigate = function () {
                var wizard = this.byId("NewEmployeeWizard");
                wizard.goToStep(this.byId(step));
                navContainer.detachAfterNavigate(fnAfterNavigate);
            }.bind(this);

            navContainer.attachAfterNavigate(fnAfterNavigate);
            navContainer.back();
        };

        function onEditEmployeeTypeStep(oEvent) {
            _editStep.bind(this)("employeeTypeStep");
        };

        function onEditEmployeeDataStep(oEvent) {
            _editStep.bind(this)("employeeDataStep");
        };

        function onEditEmployeeAditionalDataStep(oEvent) {
            _editStep.bind(this)("employeeAditionalDataStep");
        };

        function onSaveNewEmployee(oEvent) {
            var oResourceModel = this.getView().getModel("i18n").getResourceBundle();
            var json = this.getView().getModel().getData();
            var body = {
                SapId: this.getOwnerComponent().SapId,
                Type: json.Type,
                FirstName: json.FirstName,
                LastName: json.LastName,
                Dni: json.Dni,
                CreationDate: json.CreationDate,
                Comments: json.Comments,
                UserToSalary: [{
                    Ammount: parseFloat(json._objEmployeeData.EmployeeSalary).toString(),
                    Comments: json.Comments,
                    Waers: "EUR"
                }]
            };
            this.getView().getModel("employeeModel").create("/Users", body, {
                success: function (data) {
                    this.newEmployeeId = data.EmployeeId;
                    sap.m.MessageBox.information(oResourceModel.getText("NewEmployeeSaved") + ": " + this.newEmployeeId, {
                        onClose: function () {
                            var navContainer = this.byId("navContainer");
                            navContainer.back();
                            this.onPressBackMenu();
                        }.bind(this)
                    });

                    this.byId("UploadCollection").upload();

                }.bind(this),
                error: function () {

                }.bind(this)
            });
        };



        var NewEmployee = Base.extend("EmployeeManager.employeemanager.controller.NewEmployee", {});

        NewEmployee.prototype.Init = onInit;
        NewEmployee.prototype.onCancelNewEmployee = onCancelNewEmployee;
        NewEmployee.prototype.buttonEmployeeType = buttonEmployeeType;
        NewEmployee.prototype.onBeforeRendering = onBeforeRendering;
        NewEmployee.prototype.onCheckDNI = onCheckDNI;
        NewEmployee.prototype.dataEmployeeCheck = dataEmployeeCheck;
        NewEmployee.prototype.EmployeeWizardCompletedHandler = EmployeeWizardCompletedHandler;
        NewEmployee.prototype.onEditEmployeeTypeStep = onEditEmployeeTypeStep;
        NewEmployee.prototype.onEditEmployeeDataStep = onEditEmployeeDataStep;
        NewEmployee.prototype.onEditEmployeeAditionalDataStep = onEditEmployeeAditionalDataStep;
        NewEmployee.prototype.onSaveNewEmployee = onSaveNewEmployee;

        return NewEmployee;

    });
