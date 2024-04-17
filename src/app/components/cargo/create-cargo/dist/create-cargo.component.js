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
exports.CreateCargoComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var getCustomerList_CM_1 = require("src/app/models/model/order/getCustomerList_CM");
var models_1 = require("./models/models");
var nebimCustomer_1 = require("../../../models/nebim/customer/nebimCustomer");
var createCustomer_CM_1 = require("../../Order/create-order/models/createCustomer_CM");
var CreateCargoComponent = /** @class */ (function () {
    function CreateCargoComponent(router, cargoService, addressService, httpClient, toasterService, orderService, activatedRoute, generalService, formBuilder, spinnerService) {
        this.router = router;
        this.cargoService = cargoService;
        this.addressService = addressService;
        this.httpClient = httpClient;
        this.toasterService = toasterService;
        this.orderService = orderService;
        this.activatedRoute = activatedRoute;
        this.generalService = generalService;
        this.formBuilder = formBuilder;
        this.spinnerService = spinnerService;
        this.activeIndex = 0;
        this.selectedAddresses = [];
        //----------------------------------------------------ADDRESS
        this.addresses = [];
        this.packagingTypes = [{ name: 'DOSYA', code: '1' }, { name: 'PAKET', code: '3' }, { name: 'KOLİ', code: '4' }];
        this.shipmentServiceTypes = [{ name: 'GÖNDERİCİ ÖDEMELİ', code: '1' }, { name: 'ALICI ÖDEMELİ', code: '2' }];
        this.cargoFirms = [{ name: 'Mng', code: 1 }, { name: 'Aras', code: 2 }];
        this.desiErrorMessage = '';
        this.kgErrorMessage = '';
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
    }
    CreateCargoComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.createCustomerFormMethod();
        this.getAddresses();
        this.createCargoForm();
        this.activatedRoute.params.subscribe(function (p) {
            if (p["orderNumber"]) {
                _this.getOrderDetail(p["orderNumber"]);
            }
        });
    };
    CreateCargoComponent.prototype.getCustomerAddresses = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.orderService.getCustomerAddress(request)];
                    case 1:
                        _a.addresses = _b.sent();
                        this.toasterService.success("Adresler Getirildi");
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateCargoComponent.prototype.selectCurrentAddress = function (request) {
        this.selectedAddresses = [];
        this.selectedAddresses.push(request);
        this.toasterService.success("Adres Eklendi");
        this.orderDetail.address = request.address;
        this.orderDetail.city = request.cityDescription;
        this.orderDetail.district = request.districtDescription;
        this.activeIndex = 1;
        this.generalService.beep();
    };
    CreateCargoComponent.prototype.generateRandomNumber = function () {
        // 335 ile başlayan bir sayı üretir ve geri kalan 7 hanesini rastgele doldurur
        var prefix = 335; // Sabit başlangıç
        var min = Math.pow(10, 6); // Rastgele sayının minimum değeri (1 ile başlaması için)
        var max = Math.pow(10, 7) - 1; // Rastgele sayının maksimum değeri
        var randomNumber = Math.floor(Math.random() * (max - min + 1)) + min; // 7 haneli rastgele sayı
        return Number("" + prefix + randomNumber);
    };
    CreateCargoComponent.prototype.createCargoForm = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.cargoForm = this.formBuilder.group({
                    address_phoneNumber: [null],
                    packagingType: [null],
                    shipmentServiceType: [null],
                    isCOD: [false],
                    kg: [1],
                    desi: [1],
                    address_recepient_name: [null],
                    isActive: [false],
                    cargoFirm: [null],
                    address_package_count: [1, forms_1.Validators.min(1)]
                });
                this.cargoForm.get('cargoFirm').valueChanges.subscribe(function (value) {
                    if (value != null) {
                        _this.cargoForm.get('isActive').setValue(true);
                    }
                });
                this.cargoForm.get('isActive').valueChanges.subscribe(function (value) {
                    if (value === false) {
                        _this.cargoForm.get('packagingType').clearValidators();
                        _this.cargoForm.get('packagingType').updateValueAndValidity();
                        _this.cargoForm.get('shipmentServiceType').clearValidators();
                        _this.cargoForm.get('shipmentServiceType').updateValueAndValidity();
                        _this.cargoForm.get('address_recepient_name').clearValidators();
                        _this.cargoForm.get('address_recepient_name').updateValueAndValidity();
                        _this.cargoForm.get('isCOD').clearValidators();
                        _this.cargoForm.get('address_phoneNumber').clearValidators();
                        _this.cargoForm.get('cargoPrice').clearValidators();
                        _this.cargoForm.get('kg').clearValidators();
                        _this.cargoForm.get('desi').clearValidators();
                    }
                    else {
                        _this.cargoForm.get('packagingType').setValidators(forms_1.Validators.required);
                        _this.cargoForm.get('packagingType').updateValueAndValidity();
                        _this.cargoForm.get('shipmentServiceType').setValidators(forms_1.Validators.required);
                        _this.cargoForm.get('shipmentServiceType').updateValueAndValidity();
                        _this.cargoForm.get('address_recepient_name').setValidators(forms_1.Validators.required);
                        _this.cargoForm.get('address_recepient_name').updateValueAndValidity();
                        _this.cargoForm.get('isCOD').setValidators(forms_1.Validators.required);
                        _this.cargoForm.get('address_phoneNumber').setValidators(forms_1.Validators.required);
                        _this.cargoForm.get('cargoPrice').setValidators(forms_1.Validators.required);
                        _this.cargoForm.get('kg').setValidators(forms_1.Validators.required);
                        _this.cargoForm.get('desi').setValidators(forms_1.Validators.required);
                    }
                });
                this.cargoForm.get('packagingType').valueChanges.subscribe(function (value) {
                    if (value.code === '3') {
                        _this.cargoForm.get('kg').setValue(2);
                        _this.cargoForm.get('desi').setValue(2);
                        _this.cargoForm.get('kg').setValidators([forms_1.Validators.required, forms_1.Validators.min(2)]);
                        _this.cargoForm.get('desi').setValidators([forms_1.Validators.required, forms_1.Validators.min(2)]);
                    }
                    else if (value.code === '4') {
                        _this.cargoForm.get('kg').setValue(1);
                        _this.cargoForm.get('desi').setValue(1);
                        _this.cargoForm.get('kg').setValidators([forms_1.Validators.required, forms_1.Validators.min(1)]);
                        _this.cargoForm.get('desi').setValidators([forms_1.Validators.required, forms_1.Validators.min(1)]);
                    }
                    else {
                        _this.cargoForm.get('kg').setValue(0);
                        _this.cargoForm.get('desi').setValue(0);
                        _this.cargoForm.get('kg').setValidators([forms_1.Validators.required, forms_1.Validators.min(0)]);
                        _this.cargoForm.get('desi').setValidators([forms_1.Validators.required, forms_1.Validators.min(0)]);
                    }
                    _this.cargoForm.get('kg').updateValueAndValidity();
                    _this.cargoForm.get('desi').updateValueAndValidity();
                });
                this.cargoForm.get('kg').valueChanges.subscribe(function (value) {
                    if (_this.cargoForm.get('packagingType').value.code === '3') { //paket
                        if (value < 2) {
                            _this.kgErrorMessage = 'Paket gönderimlerinde KG değeri 2 den büyük olmalıdır';
                        }
                        else {
                            _this.kgErrorMessage = '';
                        }
                    }
                    else if (_this.cargoForm.get('packagingType').value.code === '4') { //koli
                        if (value < 1) {
                            _this.kgErrorMessage = 'Koli gönderimlerinde KG değeri 1 den büyük olmalıdır';
                        }
                        else {
                            _this.kgErrorMessage = '';
                        }
                    }
                });
                this.cargoForm.get('desi').valueChanges.subscribe(function (value) {
                    if (_this.cargoForm.get('packagingType').value.code === '3') {
                        if (value < 2) {
                            _this.desiErrorMessage = 'Paket gönderimlerinde DESİ değeri 2 den büyük olmalıdır';
                        }
                        else {
                            _this.desiErrorMessage = '';
                        }
                    }
                    else if (_this.cargoForm.get('packagingType').value.code === '4') {
                        if (value < 1) {
                            _this.desiErrorMessage = 'Koli gönderimlerinde DESİ değeri 1 den büyük olmalıdır';
                        }
                        else {
                            _this.desiErrorMessage = '';
                        }
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    CreateCargoComponent.prototype.submitCargo = function (formValue) {
        return __awaiter(this, void 0, void 0, function () {
            var cargoFirmId, recepient_name, content, cargoSetting, referenceId, orderRequest, barcodeRequest, totalProductQuantity, content, orderPieces, index, orderPiece, _orderPiece, request, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cargoFirmId = this.cargoForm.get('cargoFirm').value.code;
                        recepient_name = formValue.address_recepient_name;
                        if (recepient_name != null && recepient_name != '') {
                            this.orderDetail.customer = recepient_name;
                            this.toasterService.info('Alıcı Adı Değişikliği Algılandı');
                        }
                        if (this.selectedAddresses.length > 0) {
                            this.orderDetail.address = this.selectedAddresses[0].address;
                            this.orderDetail.city = this.selectedAddresses[0].cityDescription;
                            this.orderDetail.district = this.selectedAddresses[0].districtDescription;
                        }
                        content = this.orderDetail.products.length.toString() + "Adet Ürün";
                        cargoSetting = new models_1.CargoSetting(formValue.isCOD === false ? 0 : 1, Number(formValue.packagingType.code), Number(formValue.shipmentServiceType.code), content, this.orderDetail);
                        referenceId = this.generateRandomNumber();
                        orderRequest = new models_1.CreatePackage_MNG_Request(referenceId.toString(), this.orderDetail, cargoSetting);
                        barcodeRequest = new models_1.CreateBarcode_MNG_Request();
                        barcodeRequest.referenceId = orderRequest.order.referenceId;
                        barcodeRequest.billOfLandingId = orderRequest.order.billOfLandingId;
                        barcodeRequest.isCOD = orderRequest.order.isCod;
                        barcodeRequest.codAmount = orderRequest.order.codAmount;
                        barcodeRequest.packagingType = orderRequest.order.packagingType;
                        barcodeRequest.response = this.cargoResponse;
                        totalProductQuantity = this.orderDetail.products.reduce(function (total, product) { return total + product.quantity; }, 0);
                        content = totalProductQuantity.toString() + " Adet Ürün";
                        orderPieces = [];
                        if (formValue.address_package_count > 1) {
                            for (index = 1; index <= formValue.address_package_count; index++) {
                                orderPiece = new models_1.OrderPieceListMNG();
                                orderPiece.barcode = orderRequest.order.barcode + "0" + index.toString();
                                orderPiece.content = (totalProductQuantity / formValue.address_package_count).toString() + " Adet Ürün";
                                orderPiece.desi = orderRequest.order.packagingType === 1 ? 1 : orderRequest.order.packagingType === 3 ? 2 : this.cargoForm.get('desi').value;
                                orderPiece.kg = orderRequest.order.packagingType === 1 ? 1 : orderRequest.order.packagingType === 3 ? 2 : this.cargoForm.get('kg').value;
                                orderPieces.push(orderPiece);
                            }
                            barcodeRequest.orderPieceList = orderPieces;
                        }
                        else if (formValue.address_package_count === 1) {
                            _orderPiece = new models_1.OrderPieceListMNG();
                            _orderPiece.barcode = orderRequest.order.barcode;
                            _orderPiece.content = content;
                            _orderPiece.desi = orderRequest.order.packagingType === 1 ? 1 : orderRequest.order.packagingType === 3 ? 2 : this.cargoForm.get('desi').value;
                            _orderPiece.kg = orderRequest.order.packagingType === 1 ? 1 : orderRequest.order.packagingType === 3 ? 2 : this.cargoForm.get('kg').value;
                            orderPieces.push(_orderPiece);
                            barcodeRequest.orderPieceList = orderPieces;
                        }
                        else {
                            this.toasterService.error("Paket Adedi 1 den küçük olamaz");
                            return [2 /*return*/];
                        }
                        request = new models_1.CreatePackage_MNG_RM();
                        request.orderRequest = orderRequest;
                        request.barcodeRequest = barcodeRequest;
                        if (cargoFirmId === 2) {
                            request.cargoFirmId = 2;
                        }
                        else {
                            request.barcodeBase64 = null;
                            request.cargoFirmId = 1;
                        }
                        return [4 /*yield*/, this.cargoService.createCargo(request, request.cargoFirmId)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            this.cargoResponse = response;
                            this.router.navigate(['/cargo-list']);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateCargoComponent.prototype.printBarcode = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.cargoService.createBarcode(this.cargoResponse.request.order.referenceId)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            this.toasterService.success("BARKOD YAZDIRILDI");
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateCargoComponent.prototype.getOrderDetail = function (orderNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, request;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.orderService.getOrderDetail(orderNumber)];
                    case 1:
                        _a.orderDetail = _b.sent();
                        this.cargoForm.get('address_recepient_name').setValue(this.orderDetail.customer);
                        if (this.orderDetail) {
                            request = new getCustomerList_CM_1.GetCustomerAddress_CM();
                            request.currAccCode = this.orderDetail.currAccCode;
                            this.getCustomerAddresses(request);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateCargoComponent.prototype.changeCurrentAddress = function (address) {
        this.orderDetail.address = address.address;
        this.orderDetail.city = address.cityDescription;
        this.orderDetail.district = address.districtDescription;
        this.generalService.beep();
        this.toasterService.success("Adres Değiştirildi");
        this.activeIndex = 1;
    };
    CreateCargoComponent.prototype.getAddresses = function () {
        return __awaiter(this, void 0, void 0, function () {
            var countries, regions;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.addressService.getAddress(1)];
                    case 1:
                        countries = _a.sent();
                        this.countries = countries;
                        this.countries.forEach(function (b) {
                            var country = { name: b.description, code: b.code };
                            _this._countries.push(country);
                        });
                        return [4 /*yield*/, this.addressService.getAddress(2, "TR")];
                    case 2:
                        regions = _a.sent();
                        this.regions = regions;
                        this.regions.forEach(function (b) {
                            var region = { name: b.description, code: b.code };
                            _this._regions.push(region);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateCargoComponent.prototype.createCustomerFormMethod = function () {
        var _this = this;
        this.createCustomerForm = this.formBuilder.group({
            address_country: [null],
            address_province: [null],
            address_district: [null],
            address_region: [null],
            address_description: [null]
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
        //----------------------------------------------------
    };
    CreateCargoComponent.prototype.submitAddressForm = function (values) {
        return __awaiter(this, void 0, void 0, function () {
            var postalAddress, request, response, _request;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        postalAddress = new nebimCustomer_1.PostalAddress();
                        postalAddress.countryCode = values.address_country.code;
                        postalAddress.stateCode = values.address_region.code;
                        postalAddress.cityCode = values.address_province.code;
                        postalAddress.districtCode = values.address_district.code;
                        postalAddress.address = values.address_description;
                        postalAddress.addressTypeCode = "1";
                        request = new createCustomer_CM_1.AddCustomerAddress_CM(this.orderDetail.currAccCode, postalAddress);
                        return [4 /*yield*/, this.orderService.addCustomerAddress(request)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            _request = new getCustomerList_CM_1.GetCustomerAddress_CM();
                            _request.currAccCode = this.orderDetail.currAccCode;
                            this.getCustomerAddresses(_request);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateCargoComponent = __decorate([
        core_1.Component({
            selector: 'app-create-cargo',
            templateUrl: './create-cargo.component.html',
            styleUrls: ['./create-cargo.component.css']
        })
    ], CreateCargoComponent);
    return CreateCargoComponent;
}());
exports.CreateCargoComponent = CreateCargoComponent;
