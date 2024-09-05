"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.AddCustomerComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var getCustomerList_CM_1 = require("src/app/models/model/order/getCustomerList_CM");
var createCustomer_CM_1 = require("../../../models/model/order/createCustomer_CM");
var customer_list_component_1 = require("../customer-list/customer-list.component");
var AddCustomerComponent = /** @class */ (function () {
    function AddCustomerComponent(router, cargoService, addressService, httpClient, toasterService, orderService, headerService, generalService, formBuilder, activatedRoute, spinnerService, googleDriveService) {
        this.router = router;
        this.cargoService = cargoService;
        this.addressService = addressService;
        this.httpClient = httpClient;
        this.toasterService = toasterService;
        this.orderService = orderService;
        this.headerService = headerService;
        this.generalService = generalService;
        this.formBuilder = formBuilder;
        this.activatedRoute = activatedRoute;
        this.spinnerService = spinnerService;
        this.googleDriveService = googleDriveService;
        this.countries = [];
        this.provinces = [];
        this.districts = [];
        this.regions = [];
        this.taxOffices = [];
        this.updated_districts = [];
        this._regions = [];
        this._taxOffices = [];
        this._countries = [];
        this._provinces = [];
        this._districts = [];
        this._neighborhoods = [];
        //------------------------------------------------------------------------- UPLOAD
        this.selectedFiles = [];
    }
    AddCustomerComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.activatedRoute.params.subscribe(function (params) { return __awaiter(_this, void 0, void 0, function () {
                    var r, address_response;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.createCustomerFormMethod()];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, this.getAddresses()];
                            case 2:
                                _a.sent();
                                if (!params['currAccCode']) return [3 /*break*/, 4];
                                this.pageType = true;
                                this.headerService.updatePageTitle("Müşteri Güncelle");
                                this.currAccCode = params['currAccCode'];
                                this.addressId = params['addressId'];
                                r = new getCustomerList_CM_1.GetCustomerList_CM();
                                r.currAccCode = this.currAccCode;
                                return [4 /*yield*/, this.orderService.getCustomerAddress(r)];
                            case 3:
                                address_response = _a.sent();
                                if (address_response.length > 0) {
                                    this.toasterService.info(address_response.length.toString());
                                    this.postalAddressId = address_response[0].postalAddressID;
                                    this.fillForm(address_response[0]);
                                }
                                return [3 /*break*/, 5];
                            case 4:
                                this.pageType = false;
                                this.headerService.updatePageTitle("Müşteri Oluştur");
                                _a.label = 5;
                            case 5: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    AddCustomerComponent.prototype.submitAddressForm = function (formValue) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return __awaiter(this, void 0, void 0, function () {
            var request, response, clientCustomer_request, clientCustomer_response, request, response, clientCustomer_request, clientCustomer_response;
            return __generator(this, function (_m) {
                switch (_m.label) {
                    case 0:
                        if (!!this.pageType) return [3 /*break*/, 6];
                        if (!this.createCustomerForm.valid) return [3 /*break*/, 4];
                        request = new createCustomer_CM_1.CreateCustomer_CM();
                        request.currAccDescription = formValue.currAccDescription; //++
                        request.mail = formValue.mail;
                        request.phoneNumber = formValue.phoneNumber;
                        request.firmDescription = formValue.firmDescription;
                        request.stampPhotoUrl = formValue.stampPhotoUrl;
                        request.bussinesCardPhotoUrl = formValue.bussinesCardPhotoUrl;
                        request.officeCode = 'M';
                        request.warehouseCode = 'MD';
                        request.taxNumber = formValue.tax_number;
                        request.identityNumber = formValue.identity_number;
                        if (!formValue.address_country) {
                            request.address = null;
                        }
                        else {
                            request.address.country = (_a = formValue.address_country) === null || _a === void 0 ? void 0 : _a.code;
                            request.address.province = (_b = formValue.address_province) === null || _b === void 0 ? void 0 : _b.code;
                            request.address.district = (_c = formValue.address_district) === null || _c === void 0 ? void 0 : _c.code;
                            request.address.region = (_d = formValue.address_region) === null || _d === void 0 ? void 0 : _d.code;
                            request.address.taxOffice = (_e = formValue.address_taxOffice) === null || _e === void 0 ? void 0 : _e.code;
                            request.address.description = formValue.address_description;
                            request.address.postalCode = formValue.address_postalCode;
                        }
                        if (!true) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.orderService.createCustomer(request)];
                    case 1:
                        response = _m.sent();
                        if (!response.currAccCode) return [3 /*break*/, 3];
                        clientCustomer_request = new customer_list_component_1.ClientCustomer();
                        clientCustomer_request.currAccCode = response.currAccCode;
                        clientCustomer_request.description = formValue.currAccDescription;
                        clientCustomer_request.stampPhotoUrl = formValue.stampPhotoUrl;
                        clientCustomer_request.bussinesCardPhotoUrl = formValue.bussinesCardPhotoUrl;
                        clientCustomer_request.addedSellerCode = localStorage.getItem('salesPersonCode');
                        return [4 /*yield*/, this.orderService.editClientCustomer(clientCustomer_request)];
                    case 2:
                        clientCustomer_response = _m.sent();
                        if (clientCustomer_response) {
                            this.toasterService.success("Kullanıcı Eklendi");
                            this.router.navigate(["/customer-list"]);
                        }
                        _m.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        this.generalService.whichRowIsInvalid(this.createCustomerForm);
                        _m.label = 5;
                    case 5: return [3 /*break*/, 11];
                    case 6:
                        if (!this.createCustomerForm.valid) return [3 /*break*/, 10];
                        request = new createCustomer_CM_1.CreateCustomer_CM();
                        request.currAccCode = this.currAccCode;
                        request.currAccDescription = formValue.currAccDescription; //++
                        request.mail = formValue.mail;
                        request.phoneNumber = formValue.phoneNumber;
                        request.firmDescription = formValue.firmDescription;
                        request.stampPhotoUrl = formValue.stampPhotoUrl;
                        request.bussinesCardPhotoUrl = formValue.bussinesCardPhotoUrl;
                        request.officeCode = 'M';
                        request.warehouseCode = 'MD';
                        request.taxNumber = formValue.tax_number;
                        request.taxOfficeCode = (_f = formValue.address_taxOffice) === null || _f === void 0 ? void 0 : _f.code;
                        request.identityNumber = formValue.identity_number;
                        if (!formValue.address_country) {
                            request.address = null;
                        }
                        else {
                            request.address.country = (_g = formValue.address_country) === null || _g === void 0 ? void 0 : _g.code;
                            request.address.province = (_h = formValue.address_province) === null || _h === void 0 ? void 0 : _h.code;
                            request.address.district = (_j = formValue.address_district) === null || _j === void 0 ? void 0 : _j.code;
                            request.address.region = (_k = formValue.address_region) === null || _k === void 0 ? void 0 : _k.code;
                            request.address.taxOffice = (_l = formValue.address_taxOffice) === null || _l === void 0 ? void 0 : _l.code;
                            request.address.description = formValue.address_description;
                            request.address.postalCode = formValue.address_postalCode;
                            request.address.postalAddressId = this.postalAddressId;
                        }
                        if (!true) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.orderService.updateCustomer(request)];
                    case 7:
                        response = _m.sent();
                        if (!response.currAccCode) return [3 /*break*/, 9];
                        clientCustomer_request = new customer_list_component_1.ClientCustomer();
                        clientCustomer_request.currAccCode = response.currAccCode;
                        clientCustomer_request.description = formValue.currAccDescription;
                        clientCustomer_request.stampPhotoUrl = formValue.stampPhotoUrl;
                        clientCustomer_request.bussinesCardPhotoUrl = formValue.bussinesCardPhotoUrl;
                        clientCustomer_request.addedSellerCode = localStorage.getItem('salesPersonCode');
                        return [4 /*yield*/, this.orderService.editClientCustomer(clientCustomer_request)];
                    case 8:
                        clientCustomer_response = _m.sent();
                        if (clientCustomer_response) {
                            this.toasterService.success("Kullanıcı Eklendi");
                            this.router.navigate(["/customer-list"]);
                        }
                        _m.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        this.generalService.whichRowIsInvalid(this.createCustomerForm);
                        _m.label = 11;
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    AddCustomerComponent.prototype.fillForm = function (v) {
        return __awaiter(this, void 0, void 0, function () {
            var region, response, province, response, response, district, taxOffice;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.createCustomerForm.get('currAccDescription').setValue(v.currAccDescription);
                        this.createCustomerForm.get('mail').setValue(v.mail);
                        this.createCustomerForm.get('phoneNumber').setValue(v.phoneNumber);
                        this.createCustomerForm.get('identity_number').setValue(v.identityNumber);
                        this.createCustomerForm.get('tax_number').setValue(v.taxNumber);
                        this.createCustomerForm.get('address_description').setValue(v.address);
                        console.log(this._countries);
                        this.createCustomerForm.get('address_country').setValue(this._countries[0]);
                        region = this._regions.find(function (r) { return r.code == v.stateCode; });
                        this.createCustomerForm.get('address_region').setValue(region);
                        return [4 /*yield*/, this.addressService.getAddress(3, region.code)];
                    case 1:
                        response = _a.sent();
                        this.provinces = response;
                        this._provinces = [];
                        this._provinces = this.provinces.map(function (b) {
                            return { name: b.description, code: b.code };
                        });
                        province = this._provinces.find(function (r) { return r.code == v.cityCode; });
                        this.createCustomerForm.get('address_province').setValue(province);
                        return [4 /*yield*/, this.addressService.getAddress(4, province.code)];
                    case 2:
                        response = _a.sent();
                        this.districts = response;
                        this._districts = [];
                        this._districts = this.districts.map(function (b) {
                            return { name: b.description, code: b.code };
                        });
                        return [4 /*yield*/, this.addressService.getAddress(5, province.code)];
                    case 3:
                        response = _a.sent();
                        this.taxOffices = response;
                        this._taxOffices = [];
                        this._taxOffices = this.taxOffices.map(function (b) {
                            return { name: b.description, code: b.code };
                        });
                        district = this._districts.find(function (r) { return r.code == v.districtCode; });
                        this.createCustomerForm.get('address_district').setValue(district);
                        taxOffice = this._taxOffices.find(function (r) { return r.code == v.taxOfficeCode; });
                        this.createCustomerForm.get('address_taxOffice').setValue(taxOffice);
                        return [2 /*return*/];
                }
            });
        });
    };
    AddCustomerComponent.prototype.createCustomerFormMethod = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.createCustomerForm = this.formBuilder.group({
                    office: [null],
                    warehouse: [null],
                    salesPersonCode: [null],
                    currAccDescription: [null, forms_1.Validators.required],
                    mail: [null, forms_1.Validators.required],
                    phoneNumber: [null, forms_1.Validators.required],
                    stampPhotoUrl: [null],
                    bussinesCardPhotoUrl: [null],
                    identity_number: [null],
                    tax_number: [null],
                    address_country: [null],
                    address_region: [null],
                    address_province: [null],
                    address_taxOffice: [null],
                    address_district: [null],
                    address_description: [null],
                    address_postalCode: [null]
                });
                this.createCustomerForm.get('address_region').valueChanges.subscribe(function (value) { return __awaiter(_this, void 0, void 0, function () {
                    var _value, response;
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _value = this.createCustomerForm.get('address_region').value;
                                return [4 /*yield*/, this.addressService.getAddress(3, _value.code)];
                            case 1:
                                response = _a.sent();
                                this.provinces = response;
                                this._provinces = [];
                                this.provinces.forEach(function (b) {
                                    var provinces = { name: b.description, code: b.code };
                                    _this._provinces.push(provinces);
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                this.createCustomerForm.get('address_province').valueChanges.subscribe(function (value) { return __awaiter(_this, void 0, void 0, function () {
                    var _value, response, _value, response;
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _value = this.createCustomerForm.get('address_province').value;
                                return [4 /*yield*/, this.addressService.getAddress(4, _value.code)];
                            case 1:
                                response = _a.sent();
                                this.districts = response;
                                this._districts = [];
                                this.districts.forEach(function (b) {
                                    var district = { name: b.description, code: b.code };
                                    _this._districts.push(district);
                                });
                                _value = this.createCustomerForm.get('address_province').value;
                                return [4 /*yield*/, this.addressService.getAddress(5, _value.code)];
                            case 2:
                                response = _a.sent();
                                this.taxOffices = response;
                                this._taxOffices = [];
                                this.taxOffices.forEach(function (b) {
                                    var taxOffice = { name: b.description, code: b.code };
                                    _this._taxOffices.push(taxOffice);
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    AddCustomerComponent.prototype.onUpload = function (event, to) {
        return __awaiter(this, void 0, void 0, function () {
            var files, i, selectedFile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.selectedFiles = []; // Her seferinde diziyi sıfırla
                        files = event.target.files;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < files.length)) return [3 /*break*/, 4];
                        selectedFile = files[i];
                        this.selectedFiles.push(selectedFile);
                        this.toasterService.success("İşlem Başarılı");
                        return [4 /*yield*/, this.addPicture(selectedFile, to)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        event.target.value = ""; // Dosyaları sıfırlamak için value değerini sıfırla
                        return [2 /*return*/];
                }
            });
        });
    };
    AddCustomerComponent.prototype.addPicture = function (file, to) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.googleDriveService.addPicture(file)];
                    case 1:
                        response = _a.sent();
                        if (to === "bussinesCardPhotoUrl") {
                            this.createCustomerForm.get("bussinesCardPhotoUrl").setValue(response.url);
                        }
                        if (to === "stampPhotoUrl") {
                            this.createCustomerForm.get("stampPhotoUrl").setValue(response.url);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    //-------------------------------------------------------------------------
    //-------------------------------
    AddCustomerComponent.prototype.getAddresses = function () {
        return __awaiter(this, void 0, void 0, function () {
            var countries, regions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.addressService.getAddress(1)];
                    case 1:
                        countries = _a.sent();
                        this._countries = countries.map(function (b) {
                            return { name: b.description, code: b.code };
                        });
                        console.log("this._countries");
                        console.log(this._countries);
                        return [4 /*yield*/, this.addressService.getAddress(2, "TR")];
                    case 2:
                        regions = _a.sent();
                        this._regions = regions.map(function (b) {
                            return { name: b.description, code: b.code };
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    AddCustomerComponent = __decorate([
        core_1.Component({
            selector: 'app-add-customer',
            templateUrl: './add-customer.component.html',
            styleUrls: ['./add-customer.component.css']
        })
    ], AddCustomerComponent);
    return AddCustomerComponent;
}());
exports.AddCustomerComponent = AddCustomerComponent;
