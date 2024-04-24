"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.CreateOrderComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var getCustomerList_CM_1 = require("src/app/models/model/order/getCustomerList_CM");
var payment_CR_1 = require("src/app/models/model/payment/payment_CR");
var productList_VM_1 = require("src/app/models/model/product/productList_VM");
var nebimCustomer_1 = require("src/app/models/nebim/customer/nebimCustomer");
var product_service_1 = require("src/app/services/admin/product.service");
var Tesseract = require("tesseract.js");
var createCustomer_CM_1 = require("../../../models/model/order/createCustomer_CM");
var getCustomerList_CM_2 = require("../../../models/model/order/getCustomerList_CM");
var nebimOrder_1 = require("../../../models/model/order/nebimOrder");
var models_1 = require("../../cargo/create-cargo/models/models");
var CreateOrderComponent = /** @class */ (function () {
    function CreateOrderComponent(headerService, warehouseService, paymentService, toasterService, activatedRoute, router, httpClientService, generalService, addressService, googleDriveService, productService, formBuilder, orderService, cargoService) {
        this.headerService = headerService;
        this.warehouseService = warehouseService;
        this.paymentService = paymentService;
        this.toasterService = toasterService;
        this.activatedRoute = activatedRoute;
        this.router = router;
        this.httpClientService = httpClientService;
        this.generalService = generalService;
        this.addressService = addressService;
        this.googleDriveService = googleDriveService;
        this.productService = productService;
        this.formBuilder = formBuilder;
        this.orderService = orderService;
        this.cargoService = cargoService;
        this.selectedCustomers = [];
        this.selectedProducts = [];
        this.selectedAddresses = [];
        this.selectedOfficeAndWarehosue = [];
        this.payment = new nebimOrder_1.Payment();
        this.activeIndex = 0;
        this["true"] = true;
        this.isCollapsed = false;
        //--------------------------------------------------------------------------- CLIENT ORDER
        this.stateOptions = [{ label: 'Standart', value: '0' }, { label: 'Vergisiz', value: '4' }];
        this.isCompleted = false;
        this.orderNumber = "";
        //---------------------------------------------------------------------------
        //--------------------------------------------------------------------------- SATIŞ ELEMANI
        this.salesPersonModels = [];
        this.salesPersonModelList = [];
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
        //-------------------------------------------------------------------------
        //------------------------------------------------------------------------- UPLOAD
        this.selectedFiles = [];
        this.offices = [
            { name: 'Ofis', code: '' },
            { name: 'M', code: 'M' },
            { name: 'U', code: 'U' }
        ];
        this.warehouses = [
            { name: 'Depo', code: '' },
            { name: 'Gerçek Depo', code: 'MD' },
            { name: 'Halkalı Depo', code: 'UD' }
        ];
        //----------------------------------------------------
        //---------------------------------------------------- TEXT OKUMA
        this.extractedText = null;
        this.imageData = null;
        //----------------------------------------------------
        //---------------------------------------------------- Dialog değişkenleri ve metodları
        this.getCustomerDialog = false;
        this.findProductDialog = false;
        this.selectAddressDialog = false;
        this.customers = [];
        this._activeIndex = 0;
        //----------------------------------------------------ADDRESS
        this.addresses = [];
        this.selectedSize = '';
        this.products = [];
        this.shelfNumbers = 'RAFLAR:';
        this.qrBarcodeUrl = null;
        this.qrOperationModels = [];
        this.clonedProducts = {};
        this.cargoPrices = [{ name: 'DOSYA (₺90)', code: 90 }, { name: 'PAKET (₺80) ', code: 80 }, { name: 'K.KOLİ (₺115)', code: 115 },
            { name: 'O.KOLİ (₺140)', code: 140 },
            { name: 'B.KOLİ (₺180)', code: 180 }];
        this.packagingTypes = [{ name: 'DOSYA', code: '1' }, { name: 'PAKET', code: '3' }, { name: 'KOLİ', code: '4' }];
        this.shipmentServiceTypes = [{ name: 'GÖNDERİCİ ÖDEMELİ', code: '1' }, { name: 'ALICI ÖDEMELİ', code: '2' }];
        this.cargoFirms = [{ name: 'Mng', code: 1 }, { name: 'Aras', code: 2 }];
        this.arasCargoBarcode = null;
        this.generatedCargoNumber = 0;
        this.desiErrorMessage = '';
        this.kgErrorMessage = '';
        this.showCargo = false;
        //----------------------------------------------------
        //---------------------------------------------------- SİPARİŞ
        this.sidebarVisible4 = true;
        //----------------------------------------------------
        //---------------------------------------------------- PAYMENTS
        this.paymentMethods = [
            { id: 1, name: 'PayTr IFRAME', icon: 'fas fa-globe' },
            { id: 6, name: 'PayTr SMS/MAIL', icon: 'fas fa-envelope' },
            { id: 5, name: 'POS İle Öde', icon: 'fas fa-credit-card' },
            { id: 3, name: 'Havale İle Öde', icon: 'fas fa-university' },
            { id: 2, name: 'Nakit İle Öde', icon: 'fas fa-wallet' },
            { id: 4, name: 'Cari Ödeme', icon: 'fas fa-file-invoice-dollar' }
        ];
    }
    CreateOrderComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, spc;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.createGetProductForm();
                        _a = this;
                        return [4 /*yield*/, this.orderService.getExchangeRates()];
                    case 1:
                        _a.exchangeRate = _b.sent();
                        this.generatedCargoNumber = this._generateRandomNumber();
                        this.createDiscountForm();
                        this.createGetCustomerForm();
                        this.createCustomerFormMethod();
                        this.createOfficeWarehouseForm();
                        this._createCustomerFormMethod();
                        this.getAddresses();
                        this.selectOfficeAndWarehosue();
                        this.createCargoForm();
                        this.activatedRoute.params.subscribe(function (params) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                if (params['id']) {
                                    this.id = params['id'];
                                    this.getClientOrder(0);
                                    if (params['orderType'] === 'quick-order') {
                                        this.orderType = true;
                                        this.pageTitle = "Sipariş Ver";
                                    }
                                    else {
                                        this.pageTitle = "Perakende Satış";
                                        this.orderType = false;
                                    }
                                    this.headerService.updatePageTitle(this.pageTitle);
                                }
                                return [2 /*return*/];
                            });
                        }); });
                        spc = localStorage.getItem('salesPersonCode');
                        if (!spc) {
                            this.router.navigate(["/pages-loginv2"]);
                        }
                        else {
                            this.salesPersonCode = spc;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateOrderComponent.prototype.getClientOrder = function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var response, order, customer_request, customerResponse, request_address, response, findedAddress, order;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.orderService.getClientOrder(this.id)];
                    case 1:
                        response = _a.sent();
                        if (!(state === 0)) return [3 /*break*/, 9];
                        if (!response.clientOrder) return [3 /*break*/, 7];
                        order = response;
                        this.isCompleted = order.clientOrder.isCompleted;
                        this.currAccCode = order.clientOrder.customerCode;
                        this.orderNumber = order.clientOrder.orderNumber;
                        customer_request = new getCustomerList_CM_2.GetCustomerList_CM();
                        customer_request.currAccCode = this.currAccCode;
                        if (!(customer_request.currAccCode != null)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.orderService.getCustomerList_2(customer_request)];
                    case 2: return [4 /*yield*/, _a.sent()];
                    case 3:
                        customerResponse = _a.sent();
                        if (customerResponse) {
                            this.selectedCustomers.push(customerResponse[0]);
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        this.toasterService.error("Eklenecek Müşteri Bulunamadı");
                        _a.label = 5;
                    case 5:
                        request_address = new getCustomerList_CM_1.GetCustomerAddress_CM();
                        request_address.currAccCode = this.currAccCode;
                        return [4 /*yield*/, this.orderService.getCustomerAddress(request_address)];
                    case 6:
                        response = _a.sent();
                        if (response) {
                            findedAddress = response.find(function (x) { return x.postalAddressID === order.clientOrder.shippingPostalAddressId; });
                            if (findedAddress) {
                                this.selectedAddresses.push(findedAddress);
                                // this.toasterService.success("Adres Eklendi")
                            }
                            else {
                                //this.toasterService.error("Eklenecek Adres Bulunamadı")
                            }
                        }
                        if (order.clientOrder.paymentDescription) {
                            this.payment = new nebimOrder_1.Payment();
                            this.payment.currencyCode = "TRY";
                            this.payment.code = "";
                            this.payment.installmentCount = 0;
                            this.payment.paymentType = "2";
                            this.payment.creditCardTypeCode = order.clientOrder.paymentDescription;
                            this.toasterService.success("Ödeme Eklendi");
                        }
                        this.payment.amount = this.selectedProducts.reduce(function (total, product) { return total + product.price; }, 0);
                        // this.selectedAddresses = []; burası
                        this.orderNo = order.clientOrder.orderNo;
                        if (order.clientOrderBasketItems.length > 0) {
                            this.selectedProducts = [];
                            order.clientOrderBasketItems.reverse();
                            order.clientOrderBasketItems.forEach(function (basketItem) {
                                var object = _this.convertLineToObject(basketItem);
                                _this.selectedProducts.push(object);
                            });
                        }
                        return [3 /*break*/, 8];
                    case 7:
                        this.orderNo = this.generateRandomNumber();
                        this.toasterService.success("Yeni Sipariş : " + this.orderNo);
                        _a.label = 8;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        if (response.clientOrder) {
                            order = response;
                            this.selectedProducts = [];
                            if (order.clientOrderBasketItems.length > 0) {
                                order.clientOrderBasketItems.forEach(function (basketItem) {
                                    var object = _this.convertLineToObject(basketItem);
                                    _this.selectedProducts.push(object);
                                });
                            }
                            //this.toasterService.success("Ürünler Çekildi")
                        }
                        else {
                            this.toasterService.error("Yanıt Yok");
                        }
                        _a.label = 10;
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    CreateOrderComponent.prototype.deleteClientOrder = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.orderService.deleteClientOrder(this.id)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            this.toasterService.success("Sipariş Silindi");
                            this.createNewOrder();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateOrderComponent.prototype.convertLineToObject = function (line) {
        var object = new productList_VM_1.ProductList_VM();
        object.lineId = line.lineId;
        object.description = line.description;
        object.photoUrl = line.photoUrl;
        object.shelfNo = line.shelfNo;
        object.barcode = line.barcode;
        object.itemCode = line.itemCode;
        object.batchCode = line.batchCode;
        object.price = line.price;
        object.quantity = line.quantity;
        object.warehouseCode = line.warehouseCode;
        object.brandDescription = line.brandDescription;
        object.uD_Stock = line.uD_Stock;
        object.mD_Stock = line.mD_Stock;
        object.basePrice = line.basePrice;
        object.discountedPrice = line.discountedPrice;
        return object;
    };
    CreateOrderComponent.prototype.createClientOrder_RM = function () {
        var _a, _b;
        try {
            var request = new nebimOrder_1.ClientOrder();
            request.customerCode = this.currAccCode;
            request.id = this.id;
            request.orderNo = this.orderNo;
            request.customerDescription = ((_a = this.selectedCustomers[0]) === null || _a === void 0 ? void 0 : _a.currAccDescription) || null;
            request.shippingPostalAddressId = (_b = this.selectedAddresses[0]) === null || _b === void 0 ? void 0 : _b.postalAddressID;
            if (this.payment) {
                request.paymentType = this.payment.creditCardTypeCode;
            }
            else {
                request.paymentType = null;
            }
            request.createdDate = new Date(3);
            return request;
        }
        catch (error) {
            this.toasterService.error(error.message);
            return null;
        }
    };
    CreateOrderComponent.prototype.createClientOrderBasketItem_RM = function (line) {
        try {
            var newLine = Object.assign({}, line);
            newLine.quantity = 1;
            var request = new nebimOrder_1.ClientOrderBasketItem();
            request.orderId = this.id;
            request.createdDate = new Date();
            request.lineId = newLine.lineId;
            request.description = newLine.description;
            request.photoUrl = newLine.photoUrl;
            request.shelfNo = newLine.shelfNo;
            request.barcode = newLine.barcode;
            request.itemCode = newLine.itemCode;
            request.batchCode = newLine.batchCode;
            request.price = newLine.price;
            request.quantity = newLine.quantity;
            request.warehouseCode = newLine.warehouseCode;
            request.brandDescription = newLine.brandDescription;
            request.uD_Stock = newLine.uD_Stock;
            request.mD_Stock = newLine.mD_Stock;
            request.basePrice = newLine.basePrice;
            request.discountedPrice = newLine.discountedPrice;
            return request;
        }
        catch (error) {
            this.toasterService.error(error.message);
            return null;
        }
    };
    CreateOrderComponent.prototype.selectSalesPerson = function () {
        this.activeIndex = 1;
        this.generalService.beep();
        this.toasterService.success("Satış Elemanı Seçildi");
    };
    CreateOrderComponent.prototype.getSalesPersonModels = function () {
        return __awaiter(this, void 0, Promise, function () {
            var _a, error_1, error_2;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        _a = this;
                        return [4 /*yield*/, this.httpClientService
                                .get({
                                controller: 'Order/GetSalesPersonModels'
                            })
                                .toPromise()];
                    case 2:
                        _a.salesPersonModels = _b.sent();
                        this.salesPersonModels.forEach(function (c) {
                            var color = { name: c.firstLastName + " " + ("" + c.salespersonCode), code: c.salespersonCode };
                            _this.salesPersonModelList.push(color);
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        this.toasterService.error(error_1.message);
                        return [2 /*return*/, null];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_2 = _b.sent();
                        this.toasterService.error(error_2.message);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    CreateOrderComponent.prototype._submitAddressForm = function (values) {
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
                        request = new createCustomer_CM_1.AddCustomerAddress_CM(this.selectedCustomers[0].currAccCode, postalAddress);
                        return [4 /*yield*/, this.orderService.addCustomerAddress(request)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            _request = new getCustomerList_CM_1.GetCustomerAddress_CM();
                            this.toasterService.success(response.currAccCode);
                            this.getCustomerAddresses(_request);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    //-------------------------------ADRES EKLEME
    CreateOrderComponent.prototype._createCustomerFormMethod = function () {
        var _this = this;
        this._createCustomerForm = this.formBuilder.group({
            address_country: [null],
            address_province: [null],
            address_district: [null],
            address_region: [null],
            address_description: [null]
        });
        this._createCustomerForm.get('address_region').valueChanges.subscribe(function (value) { return __awaiter(_this, void 0, void 0, function () {
            var _value, response;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _value = this._createCustomerForm.get('address_region').value;
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
        this._createCustomerForm.get('address_province').valueChanges.subscribe(function (value) { return __awaiter(_this, void 0, void 0, function () {
            var _value, response, _value, response;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _value = this._createCustomerForm.get('address_province').value;
                        return [4 /*yield*/, this.addressService.getAddress(4, _value.code)];
                    case 1:
                        response = _a.sent();
                        this.districts = response;
                        this._districts = [];
                        this.districts.forEach(function (b) {
                            var district = { name: b.description, code: b.code };
                            _this._districts.push(district);
                        });
                        _value = this._createCustomerForm.get('address_province').value;
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
    };
    //-------------------------------
    CreateOrderComponent.prototype.getAddresses = function () {
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
    CreateOrderComponent.prototype.onUpload = function (event, to) {
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
    CreateOrderComponent.prototype.addPicture = function (file, to) {
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
    CreateOrderComponent.prototype.createOfficeWarehouseForm = function () {
    };
    CreateOrderComponent.prototype.selectOfficeAndWarehosue = function () {
        this.selectedOfficeAndWarehosue = [
            { office: "M", warehouse: "MD" }
        ];
    };
    CreateOrderComponent.prototype.onFileSelected = function (event) {
        var _this = this;
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            var _a;
            _this.imageData = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
        };
        reader.readAsDataURL(file);
    };
    CreateOrderComponent.prototype.extractText = function () {
        var _this = this;
        if (this.imageData) {
            this.extractTextFromImage(this.imageData.toString())
                .then(function (text) {
                _this.extractedText = text;
            })["catch"](function (error) {
                console.error('Error extracting text:', error);
            });
        }
    };
    CreateOrderComponent.prototype.extractTextFromImage = function (imageData) {
        return Tesseract.recognize(imageData, 'eng', // English language
        { logger: function (m) { return console.log(m); } } // Optional logger
        ).then(function (_a) {
            var text = _a.data.text;
            return text;
        });
    };
    //----------------------------------------------------
    //----------------------------------------------------
    CreateOrderComponent.prototype.scrollToPreview = function (state) {
        if (state === 0) {
            if (this.findCustomer) {
                this.findCustomer.nativeElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
        else if (state === 1) {
            if (this.findAddress) {
                this.findAddress.nativeElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
        else if (state === 2) {
            if (this.findProducts) {
                this.findProducts.nativeElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
        else if (state === 3) {
            if (this.preview) {
                this.preview.nativeElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };
    CreateOrderComponent.prototype.openDialog = function (dialogName) {
        if (dialogName === "getCustomerDialog") {
            this.getCustomerDialog = !this.getCustomerDialog;
        }
        if (dialogName === "findProductDialog") {
            this.findProductDialog = !this.findProductDialog;
        }
    };
    CreateOrderComponent.prototype.goToPage = function (index) {
        this.activeIndex = index;
        // this.toasterService.info(this.activeIndex.toString())
    };
    CreateOrderComponent.prototype.submitAddressForm = function (formValue) {
        return __awaiter(this, void 0, void 0, function () {
            var request, response, clientCustomer_request, clientCustomer_response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.createCustomerForm.valid) return [3 /*break*/, 7];
                        request = new createCustomer_CM_1.CreateCustomer_CM();
                        request.currAccDescription = formValue.currAccDescription; //++
                        request.mail = formValue.mail;
                        request.phoneNumber = formValue.phoneNumber;
                        request.firmDescription = formValue.firmDescription;
                        request.stampPhotoUrl = formValue.stampPhotoUrl;
                        request.bussinesCardPhotoUrl = formValue.bussinesCardPhotoUrl;
                        request.officeCode = 'M';
                        request.warehouseCode = 'MD';
                        if (!formValue.address_country) {
                            request.address = null;
                        }
                        else {
                            request.address.country = formValue.address_country;
                            request.address.province = formValue.address_province;
                            request.address.district = formValue.address_district;
                            request.address.region = formValue.address_region;
                            request.address.taxOffice = formValue.address_taxOffice;
                            request.address.description = formValue.address_description;
                            request.address.postalCode = formValue.address_postalCode;
                        }
                        console.log(request);
                        if (!true) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.orderService.createCustomer(request)];
                    case 1:
                        response = _a.sent();
                        if (!response.currAccCode) return [3 /*break*/, 6];
                        clientCustomer_request = new createCustomer_CM_1.ClientCustomer();
                        clientCustomer_request.currAccCode = response.currAccCode;
                        clientCustomer_request.description = formValue.currAccDescription;
                        clientCustomer_request.stampPhotoUrl = formValue.stampPhotoUrl;
                        clientCustomer_request.bussinesCardPhotoUrl = formValue.bussinesCardPhotoUrl;
                        clientCustomer_request.addedSellerCode = localStorage.getItem('salesPersonCode');
                        return [4 /*yield*/, this.orderService.editClientCustomer(clientCustomer_request)];
                    case 2:
                        clientCustomer_response = _a.sent();
                        if (!clientCustomer_response) return [3 /*break*/, 6];
                        this.toasterService.success(this.currAccCode);
                        this.currAccCode = response.currAccCode;
                        this.getCustomerDialog = true;
                        this.getCustomerForm.get("currAccCode").setValue(this.currAccCode);
                        return [4 /*yield*/, this.getCustomers(this.getCustomerForm.value)];
                    case 3:
                        _a.sent();
                        if (!(this.customers.length > 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.selectCurrentCustomer(this.customers[0])
                            // await this.getCustomerAddresses(this.customers[0]);
                        ];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        this.activeIndex = 2;
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        this.generalService.whichRowIsInvalid(this.createCustomerForm);
                        _a.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    CreateOrderComponent.prototype.createCustomerFormMethod = function () {
        var _this = this;
        this.createCustomerForm = this.formBuilder.group({
            office: [null],
            warehouse: [null],
            salesPersonCode: [null],
            currAccDescription: [null, forms_1.Validators.required],
            mail: [' ', forms_1.Validators.required],
            phoneNumber: [null, forms_1.Validators.required],
            stampPhotoUrl: [null, forms_1.Validators.required],
            bussinesCardPhotoUrl: [null, forms_1.Validators.required],
            address_country: [null],
            address_province: [null],
            address_district: [null],
            address_region: [null],
            taxNumber: [null],
            address_description: [null],
            address_postalCode: [' '],
            address_taxOffice: [null]
        });
        this.createCustomerForm.get('address_region').valueChanges.subscribe(function (value) { return __awaiter(_this, void 0, void 0, function () {
            var _value, response;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _value = this.createCustomerForm.get('address_region').value;
                        return [4 /*yield*/, this.addressService.getAddress(3, _value)];
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
                        return [4 /*yield*/, this.addressService.getAddress(4, _value)];
                    case 1:
                        response = _a.sent();
                        this.districts = response;
                        this._districts = [];
                        this.districts.forEach(function (b) {
                            var district = { name: b.description, code: b.code };
                            _this._districts.push(district);
                        });
                        _value = this.createCustomerForm.get('address_province').value;
                        return [4 /*yield*/, this.addressService.getAddress(5, _value)];
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
    };
    CreateOrderComponent.prototype.createGetCustomerForm = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.getCustomerForm = this.formBuilder.group({
                    mail: [null],
                    phone: [null],
                    currAccCode: [null]
                });
                this.getCustomerForm.get('currAccCode').valueChanges.subscribe(function (value) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.getCustomers(this.getCustomerForm.value)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    CreateOrderComponent.prototype.createCustomerForm_Submit = function (value) {
        if (this.selectCurrentAddress.length > 0) {
        }
        else {
            this.toasterService.error("Adres Bulunamadı");
        }
        console.log(value);
    };
    CreateOrderComponent.prototype.getCustomers = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.orderService.getCustomerList_2(request)];
                    case 1:
                        _a.customers = _b.sent();
                        console.log(this.customers);
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateOrderComponent.prototype.selectCurrentCustomer = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var _request;
            return __generator(this, function (_a) {
                this.selectedCustomers = [];
                this.selectedCustomers.push(request);
                this.currAccCode = request.currAccCode;
                this.openDialog("getCustomerDialog");
                this.toasterService.success("Müşteri Seçildi");
                this.generalService.beep();
                _request = new getCustomerList_CM_1.GetCustomerAddress_CM();
                _request.currAccCode = request.currAccCode;
                this.getCustomerAddresses(_request);
                return [2 /*return*/];
            });
        });
    };
    CreateOrderComponent.prototype.deleteCurrentCustomer = function () {
        this.selectedCustomers = [];
        this.toasterService.success("Müşteri Silindi");
        this.deleteCurrentAddress();
    };
    CreateOrderComponent.prototype.getCustomerAddresses = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.orderService.getCustomerAddress(request)
                            // if (this.addresses.length === 1) {
                            //   this.selectCurrentAddress(this.addresses[0])
                            //   this.selectAddressDialog = false;
                            //   this.activeIndex = 2;
                            // } else {
                            //   this.selectAddressDialog = true;
                            // }
                        ];
                    case 1:
                        _a.addresses = _b.sent();
                        // if (this.addresses.length === 1) {
                        //   this.selectCurrentAddress(this.addresses[0])
                        //   this.selectAddressDialog = false;
                        //   this.activeIndex = 2;
                        // } else {
                        //   this.selectAddressDialog = true;
                        // }
                        if (this.addresses.length === 0) {
                            this._activeIndex = 1;
                            this.toasterService.error("Adres Bulunamadı Adres Ekleyiniz");
                        }
                        this.selectAddressDialog = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateOrderComponent.prototype.selectCurrentAddress = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var order_request, order_response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.selectedAddresses = [];
                        this.selectedAddresses.push(request);
                        order_request = this.createClientOrder_RM();
                        return [4 /*yield*/, this.orderService.createClientOrder(order_request)];
                    case 1:
                        order_response = _a.sent();
                        if (order_response) {
                            this.selectAddressDialog = false;
                            this.toasterService.success("Adres Eklendi");
                            this.activeIndex = 2;
                            this.getCustomerForm.reset();
                            this.customers = [];
                            this.generalService.beep();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateOrderComponent.prototype.deleteCurrentAddress = function () {
        this.selectedAddresses = [];
        this.toasterService.success("Adres Silindi");
    };
    CreateOrderComponent.prototype.createDiscountForm = function () {
        this.discountForm = this.formBuilder.group({
            cashDiscountRate: [null, forms_1.Validators.required],
            percentDiscountRate: [null, forms_1.Validators.required]
        });
    };
    CreateOrderComponent.prototype.getTotalPrice = function () {
        return this.selectedProducts.reduce(function (acc, product) { return acc + (product.quantity * product.discountedPrice); }, 0);
        // return this.selectedProducts.reduce((acc, product) => {
        //   // Ürünün normal fiyatı indirimli fiyatından küçükse, normal fiyatı kullan
        //   if (product.price < product.discountedPrice) {
        //     return acc + (product.quantity * product.price);
        //   }
        //   // Değilse, indirimli fiyatı kullan
        //   return acc + (product.quantity * product.discountedPrice);
        // }, 0);
    };
    CreateOrderComponent.prototype.discount = function (discountRate) {
        if (discountRate > 0 && discountRate <= 100) {
            this.selectedProducts.forEach(function (p) {
                p.discountedPrice = ((100 - discountRate) / 100) * (p.price);
            });
            this._discountRate = discountRate;
            this.toasterService.success("İndirim Uygulandı");
        }
    };
    CreateOrderComponent.prototype.resetDiscount = function () {
        this.selectedProducts.forEach(function (p) {
            p.discountedPrice = p.basePrice;
        });
        this.discountForm.reset();
        this.toasterService.success("İndirim Kaldırıldı");
    };
    CreateOrderComponent.prototype.cashDiscount = function (discountAmount) {
        var value = discountAmount / this.selectedProducts.length;
        this.selectedProducts.forEach(function (p) {
            p.discountedPrice = p.discountedPrice - (value / p.quantity);
        });
        this.toasterService.success("İndirim Uygulandı");
    };
    CreateOrderComponent.prototype.createGetProductForm = function () {
        this.getProductsForm = this.formBuilder.group({
            barcode: [null],
            shelfNo: [null]
            // stockCode: [null],
        });
    };
    CreateOrderComponent.prototype.getProducts = function (request, pageType) {
        return __awaiter(this, void 0, void 0, function () {
            var _request, response, totalQty, totalQuantity, error_3, result, result, check_response, data, response, totalQty, totalQuantity;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!pageType) return [3 /*break*/, 10];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, , 9]);
                        _request = new product_service_1.BarcodeSearch_RM();
                        _request.barcode = request.barcode;
                        return [4 /*yield*/, this.productService.searchProduct(_request)];
                    case 2:
                        response = _a.sent();
                        if (response.length == 0) {
                            this.toasterService.error("Ürün Sorgusundan Yanıt Alınamadı");
                            return [2 /*return*/];
                        }
                        this.products = response;
                        if (!(this.products.length > 0)) return [3 /*break*/, 6];
                        if (this.products.length > 0) {
                            totalQty = 0;
                            this.products.forEach(function (p) {
                                totalQty += p.quantity;
                            });
                            if (totalQty <= 0) {
                                this.toasterService.error("STOK HATASI");
                                return [2 /*return*/];
                            }
                        }
                        this.getProductsForm.get('barcode').setValue(null);
                        totalQuantity = 0;
                        this.selectedProducts.forEach(function (product) {
                            if (product.barcode === _this.products[0].barcode) {
                                totalQuantity += product.quantity;
                            }
                        });
                        if (!(totalQuantity >= this.products[0].quantity)) return [3 /*break*/, 3];
                        this.toasterService.error("STOK HATASI");
                        return [2 /*return*/];
                    case 3: return [4 /*yield*/, this.addCurrentProducts(this.products[0])];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        this.toasterService.error("Ürün Bulunamadı");
                        _a.label = 7;
                    case 7: return [2 /*return*/, response];
                    case 8:
                        error_3 = _a.sent();
                        console.log(error_3.message);
                        return [2 /*return*/, null];
                    case 9: return [3 /*break*/, 20];
                    case 10:
                        if (!!request.shelfNo) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.productService.countProductByBarcode(request.barcode)];
                    case 11:
                        result = _a.sent();
                        this.shelfNumbers += result[0];
                        this.generalService.focusNextInput('shelfNo');
                        this.toasterService.error("Raf Numarası Giriniz");
                        return [2 /*return*/];
                    case 12:
                        if (!(request.barcode.includes('http') || this.generalService.isGuid(request.barcode))) return [3 /*break*/, 14];
                        return [4 /*yield*/, this.productService.countProductByBarcode3(request.barcode)];
                    case 13:
                        result = _a.sent();
                        if (result == null) {
                            this.toasterService.error("Qr Sorgusu Hatalı");
                            return [2 /*return*/];
                        }
                        this.getProductsForm.get('barcode').setValue(result[3]);
                        // this.qrBarcodeUrl = request.barcode;
                        // const response = await this.productService.searchProduct3(result[3], result[2], request.shelfNo);
                        // if (response.length == 0) {
                        //   this.toasterService.error("Ürün Sorgusundan Yanıt Alınamadı");
                        //   return;
                        // }
                        // this.products = response;
                        // if (this.products.length > 0) {
                        //   var totalQty = 0;
                        //   this.products.forEach(p => {
                        //     totalQty += p.quantity
                        //   });
                        //   if (totalQty <= 0) {
                        //     this.toasterService.error("STOK HATASI")
                        //     return;
                        //   }
                        //   if (this.products[0].shelfNo != this.getProductsForm.get('shelfNo').value) {
                        //     this.products[0].shelfNo = this.getProductsForm.get('shelfNo').value
                        //     this.toasterService.info("RAF NUMARASI EŞLEŞTRİLDİ")
                        //   }
                        //   await this.addCurrentProducts(this.products[0]);
                        //   var checkForm: any = { shelfNo: this.getProductsForm.value.shelfNo, quantity: this.products[0].itemCode.startsWith('FG') ? 5 : 1, batchCode: this.products[0].batchCode }
                        //   var qrResponse: QrOperationResponseModel =
                        //     await this.productService.qrOperationMethod(
                        //       this.qrBarcodeUrl,
                        //       this.getProductsForm,
                        //       checkForm,
                        //       checkForm.quantity,
                        //       false,
                        //       'WS'
                        //     );
                        //   if (qrResponse != null && qrResponse.state === true) {
                        //     this.qrOperationModels.push(qrResponse.qrOperationModel);
                        //   } else if (qrResponse === null) {
                        //     this.qrBarcodeUrl = null
                        //   }
                        //   this.getProductsForm.get('barcode').setValue(null);
                        //   this.getProductsForm.get('shelfNo').setValue(null);
                        //   this.products = [];
                        // }
                        return [2 /*return*/];
                    case 14: return [4 /*yield*/, this.warehouseService.countProductRequest(request.barcode, request.shelfNo, 1, '', '', '', 'Order/CountProductControl', this.orderNo, '')];
                    case 15:
                        check_response = _a.sent();
                        if (!(check_response != undefined)) return [3 /*break*/, 20];
                        data = check_response;
                        if (data.status != 'RAF') {
                            this.getProductsForm.get('barcode').setValue(check_response.description);
                        }
                        return [4 /*yield*/, this.productService.searchProduct3(check_response.description, check_response.batchCode, this.getProductsForm.value.shelfNo)];
                    case 16:
                        response = _a.sent();
                        if (response.length == 0) {
                            this.toasterService.error("Ürün Sorgusundan Yanıt Alınamadı");
                            return [2 /*return*/];
                        }
                        this.products = response;
                        if (!(this.products.length > 0)) return [3 /*break*/, 19];
                        totalQty = 0;
                        this.products.forEach(function (p) {
                            totalQty += p.quantity;
                        });
                        if (totalQty <= 0) {
                            this.toasterService.error("STOK HATASI");
                            return [2 /*return*/];
                        }
                        if (this.products[0].shelfNo != this.getProductsForm.get('shelfNo').value) {
                            this.products[0].shelfNo = this.getProductsForm.get('shelfNo').value;
                            this.toasterService.info("RAF NUMARASI EŞLEŞTRİLDİ");
                        }
                        totalQuantity = 0;
                        this.selectedProducts.forEach(function (product) {
                            if (product.barcode === _this.products[0].barcode) {
                                totalQuantity += product.quantity;
                            }
                        });
                        if (!(totalQuantity >= this.products[0].quantity)) return [3 /*break*/, 17];
                        this.toasterService.error("STOK HATASI");
                        return [2 /*return*/];
                    case 17:
                        this.getProductsForm.get('barcode').setValue(null);
                        this.getProductsForm.get('shelfNo').setValue(null);
                        return [4 /*yield*/, this.addCurrentProducts(this.products[0])];
                    case 18:
                        _a.sent();
                        this.shelfNumbers = 'RAFLAR:';
                        this.products = [];
                        _a.label = 19;
                    case 19: return [2 /*return*/, response];
                    case 20: return [2 /*return*/];
                }
            });
        });
    };
    CreateOrderComponent.prototype.addCurrentProducts = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var order_request, order_response, line_request, line_response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(request.quantity > 0)) return [3 /*break*/, 8];
                        order_request = this.createClientOrder_RM();
                        return [4 /*yield*/, this.orderService.createClientOrder(order_request)]; //sipariş oluşturuldu varsa güncellendi
                    case 1:
                        order_response = _a.sent() //sipariş oluşturuldu varsa güncellendi
                        ;
                        if (!order_response) return [3 /*break*/, 6];
                        line_request = this.createClientOrderBasketItem_RM(request);
                        if (line_request.itemCode.startsWith('FG')) {
                            line_request.quantity = 5;
                        }
                        return [4 /*yield*/, this.orderService.createClientOrderBasketItem(line_request)];
                    case 2:
                        line_response = _a.sent();
                        if (!line_response) return [3 /*break*/, 4];
                        this.toasterService.success("Ürün Eklendi");
                        this.generalService.beep();
                        return [4 /*yield*/, this.getClientOrder(1)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 4: return [2 /*return*/, false];
                    case 5: return [3 /*break*/, 7];
                    case 6: return [2 /*return*/, false];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        this.toasterService.error('Stok Hatası');
                        return [2 /*return*/, false];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    CreateOrderComponent.prototype.deleteProduct = function (product) {
        return __awaiter(this, void 0, void 0, function () {
            var isConfirmed, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        isConfirmed = window.confirm("Ürünü silmek istediğinize emin misiniz?");
                        if (!isConfirmed) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.orderService.deleteClientOrderBasketItem(this.id, product.lineId)];
                    case 1:
                        response = _a.sent();
                        if (!response) return [3 /*break*/, 3];
                        this.toasterService.success("Ürün Silindi");
                        return [4 /*yield*/, this.getClientOrder(1)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        // Kullanıcı silmeyi iptal ettiğinde yapılacak işlemler buraya yazılabilir.
                        console.log("Ürün silme işlemi iptal edildi.");
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    CreateOrderComponent.prototype.onRowEditInit = function (product) {
        this.clonedProducts[product.lineId] = __assign({}, product);
    };
    CreateOrderComponent.prototype.updateQuantity = function (qty, product) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (product.itemCode.startsWith('FG')) {
                            qty = qty * 5;
                        }
                        product.quantity += qty;
                        return [4 /*yield*/, this.orderService.updateClientOrderBasketItem(this.id, product.lineId, product.quantity, product.price, product.discountedPrice, product.basePrice)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            this.toasterService.success("Ürün Güncellendi");
                            this.getClientOrder(1);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateOrderComponent.prototype.onRowEditSave = function (product, index) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(product.price > 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.orderService.updateClientOrderBasketItem(this.id, product.lineId, product.quantity, product.price, product.discountedPrice, product.basePrice)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            this.toasterService.success("Ürün Güncellendi");
                            this.getClientOrder(1);
                        }
                        delete this.clonedProducts[product.lineId];
                        return [3 /*break*/, 2];
                    case 2:
                        this.cancelRowEdit(product, 0);
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateOrderComponent.prototype.cancelRowEdit = function (product, index) {
        var _this = this;
        this.selectedProducts.forEach(function (product) {
            _this.myTable.cancelRowEdit(product);
        });
    };
    CreateOrderComponent.prototype.onRowEditCancel = function (product, index) {
        this.products[index] = this.clonedProducts[product.lineId];
        delete this.clonedProducts[product.lineId];
    };
    CreateOrderComponent.prototype.getBase64 = function (base64) {
        this.arasCargoBarcode = base64;
        this.toasterService.success("Barkod Oluşturuldu");
        this.goToPage(2);
    };
    CreateOrderComponent.prototype.getOrderDetail = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, request;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.orderService.getOrderDetail(this.orderNumber)];
                    case 1:
                        _a.orderDetail = _b.sent();
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
    CreateOrderComponent.prototype._generateRandomNumber = function () {
        // 335 ile başlayan bir sayı üretir ve geri kalan 7 hanesini rastgele doldurur
        var prefix = 335; // Sabit başlangıç
        var min = Math.pow(10, 6); // Rastgele sayının minimum değeri (1 ile başlaması için)
        var max = Math.pow(10, 7) - 1; // Rastgele sayının maksimum değeri
        var randomNumber = Math.floor(Math.random() * (max - min + 1)) + min; // 7 haneli rastgele sayı
        return Number("" + prefix + randomNumber);
    };
    CreateOrderComponent.prototype.createCargoForm = function () {
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
                    address_package_count: [1, forms_1.Validators.min(1)],
                    cargoPrice: [null]
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
                this.cargoForm.get('cargoPrice').valueChanges.subscribe(function (value) { return __awaiter(_this, void 0, void 0, function () {
                    var _product, __product;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (this.cargoForm.get('packagingType').value.code === '1') {
                                }
                                _product = this.selectedProducts.find(function (p) { return p.itemCode == 'KARGO'; });
                                if (!!_product) return [3 /*break*/, 6];
                                if (!this.orderType) return [3 /*break*/, 2];
                                this.getProductsForm.get('barcode').setValue('KARGO');
                                return [4 /*yield*/, this.getProducts(this.getProductsForm.value, this.orderType)];
                            case 1:
                                _a.sent();
                                return [3 /*break*/, 4];
                            case 2:
                                this.getProductsForm.get('barcode').setValue('KARGO');
                                this.getProductsForm.get('shelfNo').setValue('KARGO04');
                                return [4 /*yield*/, this.getProducts(this.getProductsForm.value, this.orderType)];
                            case 3:
                                _a.sent();
                                _a.label = 4;
                            case 4:
                                __product = this.selectedProducts.find(function (p) { return p.itemCode == 'KARGO'; });
                                __product.price = value.code;
                                __product.basePrice = value.code;
                                __product.discountedPrice = value.code;
                                return [4 /*yield*/, this.orderService.updateClientOrderBasketItem(this.id, __product.lineId, __product.quantity, __product.price, __product.discountedPrice, __product.discountedPrice)];
                            case 5:
                                _a.sent();
                                return [3 /*break*/, 8];
                            case 6:
                                _product.price = value.code;
                                _product.basePrice = value.code;
                                _product.discountedPrice = value.code;
                                return [4 /*yield*/, this.orderService.updateClientOrderBasketItem(this.id, _product.lineId, _product.quantity, _product.price, _product.discountedPrice, _product.basePrice)];
                            case 7:
                                _a.sent();
                                _a.label = 8;
                            case 8: return [2 /*return*/];
                        }
                    });
                }); });
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
    CreateOrderComponent.prototype.submitCargo = function (formValue) {
        return __awaiter(this, void 0, void 0, function () {
            var cargoFirmId, recepient_name, phoneNumber, content, cargoSetting, referenceId, orderRequest, barcodeRequest, totalProductQuantity, content, orderPieces, index, orderPiece, _orderPiece, _request, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getOrderDetail()];
                    case 1:
                        _a.sent();
                        cargoFirmId = this.cargoForm.get('cargoFirm').value.code;
                        if (!this.orderDetail) return [3 /*break*/, 3];
                        recepient_name = formValue.address_recepient_name;
                        phoneNumber = formValue.address_phoneNumber;
                        if (recepient_name != null && recepient_name != '') {
                            this.orderDetail.customer = recepient_name;
                            this.toasterService.info('Alıcı Adı Değişikliği Algılandı');
                        }
                        if (phoneNumber != null && phoneNumber != '') {
                            this.orderDetail.phone = phoneNumber;
                            this.toasterService.info('Telefon Değişikliği Algılandı');
                        }
                        if (this.selectedAddresses.length > 0) {
                            this.orderDetail.address = this.selectedAddresses[0].address;
                            this.orderDetail.city = this.selectedAddresses[0].cityDescription;
                            this.orderDetail.district = this.selectedAddresses[0].districtDescription;
                        }
                        content = this.selectedProducts.length.toString() + "Adet Ürün";
                        cargoSetting = new models_1.CargoSetting(formValue.isCOD === false ? 0 : 1, Number(formValue.packagingType.code), Number(formValue.shipmentServiceType.code), content, this.orderDetail);
                        referenceId = this.generatedCargoNumber;
                        orderRequest = new models_1.CreatePackage_MNG_Request(referenceId.toString(), this.orderDetail, cargoSetting);
                        barcodeRequest = new models_1.CreateBarcode_MNG_Request();
                        barcodeRequest.referenceId = orderRequest.order.referenceId;
                        barcodeRequest.billOfLandingId = orderRequest.order.billOfLandingId;
                        barcodeRequest.isCOD = orderRequest.order.isCod;
                        barcodeRequest.codAmount = orderRequest.order.codAmount;
                        barcodeRequest.packagingType = orderRequest.order.packagingType;
                        totalProductQuantity = this.selectedProducts.reduce(function (total, product) { return total + product.quantity; }, 0);
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
                        _request = new models_1.CreatePackage_MNG_RM();
                        _request.orderRequest = orderRequest;
                        _request.barcodeRequest = barcodeRequest;
                        if (cargoFirmId === 2) {
                            _request.barcodeBase64 = this.arasCargoBarcode;
                            _request.cargoFirmId = 2;
                        }
                        else {
                            _request.barcodeBase64 = null;
                            _request.cargoFirmId = 1;
                        }
                        return [4 /*yield*/, this.cargoService.createCargo(_request, cargoFirmId)];
                    case 2:
                        response = _a.sent();
                        if (response) {
                            this.cargoResponse = response;
                            this.toasterService.success("Kargo Siparişi Oluturuldu (BARKOD BASILABİLİR)");
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CreateOrderComponent.prototype.CreateBarcode_RM = function () {
        return __awaiter(this, void 0, Promise, function () {
            var request, content, orderPieces, orderPiece;
            return __generator(this, function (_a) {
                if (this.cargoResponse) {
                    request = new models_1.CreateBarcode_MNG_Request();
                    request.referenceId = this.cargoResponse.request.order.referenceId;
                    request.billOfLandingId = this.cargoResponse.request.order.billOfLandingId;
                    request.isCOD = this.cargoResponse.request.order.isCod;
                    request.codAmount = this.cargoResponse.request.order.codAmount;
                    request.packagingType = this.cargoResponse.request.order.packagingType;
                    request.response = this.cargoResponse;
                    content = this.cargoResponse.request.orderPieceList.length.toString() + " Adet Ürün";
                    orderPieces = [];
                    orderPiece = new models_1.OrderPieceListMNG();
                    orderPiece.barcode = this.cargoResponse.request.order.barcode;
                    orderPiece.content = content;
                    orderPiece.desi = this.cargoResponse.request.order.packagingType === 1 ? 0 : this.cargoForm.get('desi').value;
                    orderPiece.kg = this.cargoResponse.request.order.packagingType === 1 ? 0 : this.cargoForm.get('kg').value;
                    orderPieces.push(orderPiece);
                    request.orderPieceList = orderPieces;
                    return [2 /*return*/, request];
                }
                else {
                    return [2 /*return*/, null];
                }
                return [2 /*return*/];
            });
        });
    };
    CreateOrderComponent.prototype.showCargoForm = function (state) {
        if (state === false) {
            this.activeIndex = 3;
            this.toasterService.success("Kargo Bilgileri Güncellendi");
        }
        this.cargoForm.get('isActive').setValue(state);
    };
    CreateOrderComponent.prototype.createNewOrder = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, orderNo, Url, Url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = window.confirm("Yeni Sipariş Oluşturulacak. Devam Etmek İstiyor musunuz?");
                        if (!response) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.generalService.generateGUID()];
                    case 1:
                        orderNo = _a.sent();
                        if (this.orderType) {
                            Url = location.origin + "/create-order/quick-order/" + orderNo;
                            location.href = Url;
                        }
                        else {
                            Url = location.origin + "/create-order/retail-order/" + orderNo;
                            location.href = Url;
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    CreateOrderComponent.prototype.generateRandomNumber = function () {
        var result = '';
        var characters = '0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < 10; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return "MSG-" + result;
    };
    CreateOrderComponent.prototype.createPayment = function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var payment, response, response, response, response, response, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.activeIndex = 6;
                        payment = new nebimOrder_1.Payment();
                        if (!(state === 1)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.orderService.updateClientOrderPayment(this.id, "PAYTR IFRAME")];
                    case 1:
                        response = _a.sent();
                        if (!response) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getPaymentPage()];
                    case 2:
                        _a.sent();
                        payment.currencyCode = "TRY";
                        payment.code = "";
                        payment.installmentCount = 0;
                        payment.paymentType = "2";
                        payment.creditCardTypeCode = "PAYTR IFRAME";
                        payment.amount = this.selectedProducts.reduce(function (total, product) { return total + product.price; }, 0);
                        this.payment = payment;
                        this.toasterService.success("Ödeme Onaylandı");
                        _a.label = 3;
                    case 3: return [3 /*break*/, 16];
                    case 4:
                        if (!(state === 2)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.orderService.updateClientOrderPayment(this.id, "NAKİT")];
                    case 5:
                        response = _a.sent();
                        if (response) {
                            payment.currencyCode = "TRY";
                            payment.code = "";
                            payment.installmentCount = 0;
                            payment.paymentType = "2";
                            payment.creditCardTypeCode = "NAKİT";
                            payment.amount = this.selectedProducts.reduce(function (total, product) { return total + product.price; }, 0);
                            this.payment = payment;
                            this.toasterService.success("Ödeme Onaylandı");
                        }
                        return [2 /*return*/, null];
                    case 6:
                        if (!(state === 3)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.orderService.updateClientOrderPayment(this.id, "HAVALE")];
                    case 7:
                        response = _a.sent();
                        if (response) {
                            payment.currencyCode = "TRY";
                            payment.code = "";
                            payment.installmentCount = 0;
                            payment.paymentType = "2";
                            payment.creditCardTypeCode = "HAVALE";
                            payment.amount = this.selectedProducts.reduce(function (total, product) { return total + product.price; }, 0);
                            this.payment = payment;
                            this.toasterService.success("Ödeme Onaylandı");
                        }
                        return [2 /*return*/, null];
                    case 8:
                        if (!(state === 4)) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.orderService.updateClientOrderPayment(this.id, "VADE")];
                    case 9:
                        response = _a.sent();
                        if (response) {
                            payment.currencyCode = "TRY";
                            payment.code = "";
                            payment.installmentCount = 0;
                            payment.paymentType = "2";
                            payment.creditCardTypeCode = "VADE";
                            payment.amount = this.selectedProducts.reduce(function (total, product) { return total + product.price; }, 0);
                            this.payment = payment;
                            this.toasterService.success("Ödeme Onaylandı");
                        }
                        return [2 /*return*/, null];
                    case 10:
                        if (!(state === 5)) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.orderService.updateClientOrderPayment(this.id, "POS")];
                    case 11:
                        response = _a.sent();
                        if (response) {
                            payment.currencyCode = "TRY";
                            payment.code = "";
                            payment.installmentCount = 0;
                            payment.paymentType = "2";
                            payment.creditCardTypeCode = "POS";
                            payment.amount = this.selectedProducts.reduce(function (total, product) { return total + product.price; }, 0);
                            this.payment = payment;
                            this.toasterService.success("Ödeme Onaylandı");
                        }
                        return [2 /*return*/, null];
                    case 12:
                        if (!(state === 6)) return [3 /*break*/, 16];
                        return [4 /*yield*/, this.orderService.updateClientOrderPayment(this.id, "PAYTRSMS")];
                    case 13:
                        response = _a.sent();
                        if (!response) return [3 /*break*/, 15];
                        return [4 /*yield*/, this.sendPaymentPage()];
                    case 14:
                        _a.sent();
                        payment.currencyCode = "TRY";
                        payment.code = "";
                        payment.installmentCount = 0;
                        payment.paymentType = "2";
                        payment.creditCardTypeCode = "PAYTRSMS";
                        payment.amount = this.selectedProducts.reduce(function (total, product) { return total + product.price; }, 0);
                        this.payment = payment;
                        this.toasterService.success("Ödeme Onaylandı");
                        _a.label = 15;
                    case 15: return [2 /*return*/, null];
                    case 16:
                        this.payment = payment;
                        this.generalService.beep();
                        this.toasterService.success("Ödeme Onaylandı");
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateOrderComponent.prototype.calculateDiscountPercent = function (products) {
        var totalPrice = 0;
        var discountedTotalPrice = 0;
        products.forEach(function (p) {
            totalPrice += p.basePrice * p.quantity;
            discountedTotalPrice += p.discountedPrice * p.quantity;
        });
        var totalDiscount = ((totalPrice - discountedTotalPrice) / totalPrice) * 100;
        return parseFloat(totalDiscount.toFixed(2));
    };
    CreateOrderComponent.prototype.createOrder = function () {
        return __awaiter(this, void 0, void 0, function () {
            var formValue, exchangeRate, discountPercent, request, response, _request, response, __request, __response;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.cargoForm.valid) {
                            this.toasterService.error("Kargo Formu Hatalı");
                            return [2 /*return*/];
                        }
                        if (!this.payment.creditCardTypeCode) {
                            this.toasterService.error("Ödeme Tipi Seçiniz");
                            return [2 /*return*/];
                        }
                        if (!this.taxTypeCode) {
                            this.toasterService.error("Vergi Tipi Seçiniz");
                            return [2 /*return*/];
                        }
                        formValue = this.createCustomerForm.value;
                        if (!this.currAccCode) {
                            this.toasterService.error("Müşteri Seçiniz");
                            return [2 /*return*/];
                        }
                        if (!this.salesPersonCode) {
                            this.toasterService.error("Satış Elemanı Seçiniz");
                            return [2 /*return*/];
                        }
                        if (this.selectedProducts.length <= 0) {
                            this.toasterService.error("Ürün Ekleyiniz");
                            return [2 /*return*/];
                        }
                        exchangeRate = 0;
                        if (this.selectedCustomers[0].docCurrencyCode === 'TRY') {
                            exchangeRate = 1;
                        }
                        else if (this.selectedCustomers[0].docCurrencyCode === 'USD') {
                            exchangeRate = this.exchangeRate.usd;
                        }
                        else if (this.selectedCustomers[0].docCurrencyCode === 'EUR') {
                            exchangeRate = this.exchangeRate.eur;
                        }
                        if (exchangeRate === 0) {
                            this.toasterService.error("EXCHANGE RATE ERROR");
                            return [2 /*return*/];
                        }
                        discountPercent = this.calculateDiscountPercent(this.selectedProducts);
                        if (!this.orderType) return [3 /*break*/, 6];
                        request = new nebimOrder_1.NebimOrder(exchangeRate, discountPercent, this.cargoForm.get("address_recepient_name").value, this.currAccCode, this.orderNo, formValue, this.selectedProducts, this.salesPersonCode, this.taxTypeCode);
                        return [4 /*yield*/, this.orderService.createOrder(request)];
                    case 1:
                        response = _a.sent();
                        if (!(response && response.status === true)) return [3 /*break*/, 5];
                        this.orderNumber = response.orderNumber;
                        if (!(this.cargoForm.get('isActive').value === true)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.submitCargo(this.cargoForm.value)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        this.toasterService.info('KARGO OLUŞTURULMADI');
                        _a.label = 4;
                    case 4:
                        this.generalService.waitAndNavigate("Sipariş Oluşturuldu", "orders-managament/1/2");
                        _a.label = 5;
                    case 5: return [3 /*break*/, 12];
                    case 6:
                        _request = new nebimOrder_1.NebimOrder(exchangeRate, discountPercent, this.cargoForm.get("address_recepient_name").value, this.currAccCode, this.orderNo, formValue, this.selectedProducts, this.salesPersonCode, this.taxTypeCode);
                        return [4 /*yield*/, this.orderService.createOrder(_request)];
                    case 7:
                        response = _a.sent();
                        if (!(response && response.status === true)) return [3 /*break*/, 10];
                        this.orderNumber = response.orderNumber;
                        if (!(this.cargoForm.get('isActive').value === true)) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.submitCargo(this.cargoForm.value)];
                    case 8:
                        _a.sent();
                        return [3 /*break*/, 10];
                    case 9:
                        this.toasterService.info('KARGO OLUŞTURULMADI');
                        _a.label = 10;
                    case 10:
                        __request = new nebimOrder_1.NebimInvoice(discountPercent, exchangeRate, this.selectedCustomers[0].docCurrencyCode, this.cargoForm.get("address_recepient_name").value, this.currAccCode, this.orderNo, formValue, this.selectedProducts, this.salesPersonCode, this.taxTypeCode, this.selectedAddresses[0].postalAddressID);
                        __request.lines.forEach(function (l1) {
                            var fp = response.lines.find(function (p) {
                                return p.itemCode === l1.itemCode && p.usedBarcode === l1.usedBarcode && p.qty1 === l1.qty1;
                            });
                            if (fp) {
                                l1.currencyCode = _this.selectedCustomers[0].docCurrencyCode;
                                l1.orderLineId = fp.orderLineId;
                            }
                        });
                        return [4 /*yield*/, this.orderService.createInvoice(__request)];
                    case 11:
                        __response = _a.sent();
                        if (__response) {
                            this.generalService.waitAndNavigate("Sipariş Oluşturuldu & Faturalaştırıdı", "orders-managament/1/1");
                        }
                        _a.label = 12;
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    CreateOrderComponent.prototype.getPaymentCommandModel = function () {
        return __awaiter(this, void 0, Promise, function () {
            var model, totalPrice, _i, _a, product;
            return __generator(this, function (_b) {
                model = new payment_CR_1.Payment_CM();
                totalPrice = 0;
                for (_i = 0, _a = this.selectedProducts; _i < _a.length; _i++) {
                    product = _a[_i];
                    totalPrice += product.price * product.quantity;
                }
                if (this.orderNo) {
                    model.orderNo = this.orderNo;
                    model.basketItems = this.selectedProducts;
                    model.totalValue = totalPrice.toString();
                    model.user = this.selectedCustomers[0];
                    model.address = this.selectedAddresses[0];
                    return [2 /*return*/, model];
                }
                else {
                    return [2 /*return*/, null];
                }
                return [2 /*return*/];
            });
        });
    };
    CreateOrderComponent.prototype.getPaymentPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var request, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPaymentCommandModel()];
                    case 1:
                        request = _a.sent();
                        return [4 /*yield*/, this.paymentService.getPaymentPage(request)];
                    case 2:
                        response = _a.sent();
                        window.open(response.pageUrl);
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateOrderComponent.prototype.sendPaymentPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var request, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPaymentCommandModel()];
                    case 1:
                        request = _a.sent();
                        return [4 /*yield*/, this.paymentService.sendPaymentPage(request)];
                    case 2:
                        response = _a.sent();
                        window.open(response.pageUrl);
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        core_1.ViewChild('findCustomer', { static: false })
    ], CreateOrderComponent.prototype, "findCustomer");
    __decorate([
        core_1.ViewChild('findAddress', { static: false })
    ], CreateOrderComponent.prototype, "findAddress");
    __decorate([
        core_1.ViewChild('findProducts', { static: false })
    ], CreateOrderComponent.prototype, "findProducts");
    __decorate([
        core_1.ViewChild('preview', { static: false })
    ], CreateOrderComponent.prototype, "preview");
    __decorate([
        core_1.ViewChild('dt1')
    ], CreateOrderComponent.prototype, "myTable");
    CreateOrderComponent = __decorate([
        core_1.Component({
            selector: 'app-create-order',
            templateUrl: './create-order.component.html',
            styleUrls: ['./create-order.component.css']
        })
    ], CreateOrderComponent);
    return CreateOrderComponent;
}());
exports.CreateOrderComponent = CreateOrderComponent;
