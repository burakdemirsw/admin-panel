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
var getCustomerList_CM_1 = require("../../../models/model/order/getCustomerList_CM");
var getCustomerList_CM_2 = require("src/app/models/model/order/getCustomerList_CM");
var product_service_1 = require("src/app/services/admin/product.service");
var productList_VM_1 = require("src/app/models/model/product/productList_VM");
var Tesseract = require("tesseract.js");
var createCustomer_CM_1 = require("./models/createCustomer_CM");
var nebimOrder_1 = require("./models/nebimOrder");
var payment_CR_1 = require("src/app/models/model/payment/payment_CR");
var nebimCustomer_1 = require("src/app/models/nebim/customer/nebimCustomer");
var models_1 = require("../../cargo/create-cargo/models/models");
var CreateOrderComponent = /** @class */ (function () {
    function CreateOrderComponent(warehouseService, paymentService, toasterService, activatedRoute, router, httpClientService, generalService, addressService, googleDriveService, productService, formBuilder, orderService, cargoService) {
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
        this.clonedProducts = {};
        this.packagingTypes = [{ name: 'DOSYA', code: '1' }, { name: 'PAKET', code: '3' }, { name: 'KOLİ', code: '4' }];
        this.shipmentServiceTypes = [{ name: 'GÖNDERİCİ ÖDEMELİ', code: '1' }, { name: 'ALICI ÖDEMELİ', code: '2' }];
        this.desiErrorMessage = '';
        this.kgErrorMessage = '';
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
        var _this = this;
        this.createGetCustomerForm();
        this.createCustomerFormMethod();
        this.createGetProductForm();
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
                        this.pageTitle = "Perakende Sipariş";
                        this.orderType = false;
                    }
                    //   this.toasterService.warn(this.orderType.toString())
                }
                return [2 /*return*/];
            });
        }); });
        var spc = localStorage.getItem('salesPersonCode');
        if (!spc) {
            this.router.navigate(["/pages-loginv2"]);
        }
        else {
            this.salesPersonCode = spc;
        }
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
                        if (!(state === 0)) return [3 /*break*/, 7];
                        if (!response.clientOrder) return [3 /*break*/, 5];
                        order = response;
                        this.isCompleted = order.clientOrder.isCompleted;
                        this.currAccCode = order.clientOrder.customerCode;
                        this.orderNumber = order.clientOrder.orderNumber;
                        customer_request = new getCustomerList_CM_1.GetCustomerList_CM();
                        customer_request.currAccCode = this.currAccCode;
                        return [4 /*yield*/, this.orderService.getCustomerList_2(customer_request)];
                    case 2: return [4 /*yield*/, _a.sent()];
                    case 3:
                        customerResponse = _a.sent();
                        if (customerResponse) {
                            this.selectedCustomers.push(customerResponse[0]);
                            // this.toasterService.success("Müşteri Eklendi")
                        }
                        request_address = new getCustomerList_CM_2.GetCustomerAddress_CM();
                        request_address.currAccCode = this.currAccCode;
                        return [4 /*yield*/, this.orderService.getCustomerAddress(request_address)];
                    case 4:
                        response = _a.sent();
                        if (response) {
                            findedAddress = response.find(function (x) { return x.postalAddressID === order.clientOrder.shippingPostalAddressId; });
                            if (findedAddress) {
                                this.selectedAddresses.push(findedAddress);
                                // this.toasterService.success("Adres Eklendi")
                            }
                            else {
                                this.toasterService.error("Eklenecek Adres Bulunamadı");
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
                        return [3 /*break*/, 6];
                    case 5:
                        this.orderNo = this.generateRandomNumber();
                        this.toasterService.success("Yeni Sipariş : " + this.orderNo);
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
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
                        _a.label = 8;
                    case 8: return [2 /*return*/];
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
            request.createdDate = new Date();
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
                            _request = new getCustomerList_CM_2.GetCustomerAddress_CM();
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
                        return [4 /*yield*/, this.selectCurrentCustomer(this.customers[0])];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        this.activeIndex = 3;
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
            stampPhotoUrl: [' ', forms_1.Validators.required],
            bussinesCardPhotoUrl: [' ', forms_1.Validators.required],
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
        this.getCustomerForm = this.formBuilder.group({
            mail: [null],
            phone: [null],
            currAccCode: [null]
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
                _request = new getCustomerList_CM_2.GetCustomerAddress_CM();
                _request.currAccCode = request.currAccCode;
                this.getCustomerAddresses(_request);
                this.selectAddressDialog = true;
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
                        return [4 /*yield*/, this.orderService.getCustomerAddress(request)];
                    case 1:
                        _a.addresses = _b.sent();
                        if (this.addresses.length === 1) {
                            this.selectCurrentAddress(this.addresses[0]);
                            this.selectAddressDialog = false;
                        }
                        console.log(this.customers);
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
                        order_request = this.createClientOrder_RM();
                        return [4 /*yield*/, this.orderService.createClientOrder(order_request)];
                    case 1:
                        order_response = _a.sent();
                        if (order_response) {
                            this.selectedAddresses = [];
                            this.selectedAddresses.push(request);
                            this.toasterService.success("Adres Eklendi");
                            this.activeIndex = 3;
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
    //----------------------------------------------------
    //---------------------------------------------------- PRODUCTS
    CreateOrderComponent.prototype.getTotalPrice = function () {
        return this.selectedProducts.reduce(function (acc, product) { return acc + (product.quantity * product.price); }, 0);
    };
    CreateOrderComponent.prototype.discount = function (discountRate) {
        if (discountRate > 0 && discountRate <= 100) {
            this.selectedProducts.forEach(function (p) {
                p.price = ((100 - discountRate) / 100) * (p.price);
            });
            this._discountRate = discountRate;
        }
    };
    CreateOrderComponent.prototype.cashDiscount = function (discountAmount) {
        var value = discountAmount / this.selectedProducts.length;
        this.selectedProducts.forEach(function (p) {
            p.price = p.price - (value / p.quantity);
        });
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
            var _request, response, error_3, check_response, data, response, totalQty;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!pageType) return [3 /*break*/, 7];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        _request = new product_service_1.BarcodeSearch_RM();
                        _request.barcode = request.barcode;
                        return [4 /*yield*/, this.productService.searchProduct(_request)];
                    case 2:
                        response = _a.sent();
                        this.products = response;
                        if (!(this.products.length > 0)) return [3 /*break*/, 4];
                        this.getProductsForm.get('barcode').setValue(null);
                        return [4 /*yield*/, this.addCurrentProducts(this.products[0])];
                    case 3:
                        _a.sent();
                        this.products = [];
                        _a.label = 4;
                    case 4: return [2 /*return*/, response];
                    case 5:
                        error_3 = _a.sent();
                        console.log(error_3.message);
                        return [2 /*return*/, null];
                    case 6: return [3 /*break*/, 12];
                    case 7:
                        if (!request.shelfNo) {
                            this.generalService.focusNextInput('shelfNo');
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.warehouseService.countProductRequest(request.barcode, '', 1, '', '', '', 'Order/CountProductControl', this.orderNo, '')];
                    case 8:
                        check_response = _a.sent();
                        if (!(check_response != undefined)) return [3 /*break*/, 12];
                        data = check_response;
                        if (data.status != 'RAF') {
                            this.getProductsForm.get('barcode').setValue(check_response.description);
                        }
                        return [4 /*yield*/, this.productService.searchProduct3(check_response.description, check_response.batchCode)];
                    case 9:
                        response = _a.sent();
                        this.products = response;
                        if (!(this.products.length > 0)) return [3 /*break*/, 11];
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
                        this.getProductsForm.get('barcode').setValue(null);
                        this.getProductsForm.get('shelfNo').setValue(null);
                        return [4 /*yield*/, this.addCurrentProducts(this.products[0])];
                    case 10:
                        _a.sent();
                        this.products = [];
                        _a.label = 11;
                    case 11: return [2 /*return*/, response];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    CreateOrderComponent.prototype.addCurrentProducts = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var order_request, order_response, line_request, line_response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(request.quantity > 0)) return [3 /*break*/, 4];
                        order_request = this.createClientOrder_RM();
                        return [4 /*yield*/, this.orderService.createClientOrder(order_request)];
                    case 1:
                        order_response = _a.sent();
                        if (!order_response) return [3 /*break*/, 3];
                        line_request = this.createClientOrderBasketItem_RM(request);
                        return [4 /*yield*/, this.orderService.createClientOrderBasketItem(line_request)];
                    case 2:
                        line_response = _a.sent();
                        if (line_response) {
                            this.toasterService.success("Ürün Eklendi");
                            this.generalService.beep();
                            this.getClientOrder(1);
                        }
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        this.toasterService.error('Stok Hatası');
                        _a.label = 5;
                    case 5: return [2 /*return*/];
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
                        product.quantity += qty;
                        return [4 /*yield*/, this.orderService.updateClientOrderBasketItem(this.id, product.lineId, product.quantity, product.price)];
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
    CreateOrderComponent.prototype.onRowEditSave = function (product) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(product.price > 0)) return [3 /*break*/, 2];
                        this.toasterService.success(product.quantity.toString());
                        return [4 /*yield*/, this.orderService.updateClientOrderBasketItem(this.id, product.lineId, product.quantity, product.price)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            this.toasterService.success("Ürün Güncellendi");
                            this.getClientOrder(1);
                        }
                        delete this.clonedProducts[product.lineId];
                        return [3 /*break*/, 2];
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    CreateOrderComponent.prototype.onRowEditCancel = function (product, index) {
        this.products[index] = this.clonedProducts[product.lineId];
        delete this.clonedProducts[product.lineId];
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
                            request = new getCustomerList_CM_2.GetCustomerAddress_CM();
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
        var _this = this;
        this.cargoForm = this.formBuilder.group({
            packagingType: [null, forms_1.Validators.required],
            shipmentServiceType: [null, forms_1.Validators.required],
            isCOD: [false, forms_1.Validators.required],
            kg: [1, forms_1.Validators.required],
            desi: [1, forms_1.Validators.required],
            address_recepient_name: [null, forms_1.Validators.required],
            isActive: [true, forms_1.Validators.required]
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
                _this.cargoForm.get('kg').setValidators(forms_1.Validators.required);
                _this.cargoForm.get('desi').setValidators(forms_1.Validators.required);
            }
            // if (this.cargoForm.valid) {
            //   this.toasterService.success("true")
            // } else {
            //   this.generalService.whichRowIsInvalid(this.cargoForm);
            // }
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
    };
    CreateOrderComponent.prototype.submitCargo = function (formValue) {
        return __awaiter(this, void 0, void 0, function () {
            var recepient_name, content, cargoSetting, referenceId, orderRequest, barcodeRequest, content, orderPieces, orderPiece, _request, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getOrderDetail()];
                    case 1:
                        _a.sent();
                        if (!this.orderDetail) return [3 /*break*/, 3];
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
                        content = this.selectedProducts.length.toString() + "Adet Ürün";
                        cargoSetting = new models_1.CargoSetting(formValue.isCOD === false ? 0 : 1, Number(formValue.packagingType.code), Number(formValue.shipmentServiceType.code), content, this.orderDetail);
                        referenceId = this._generateRandomNumber();
                        orderRequest = new models_1.CreatePackage_MNG_Request(referenceId.toString(), this.orderDetail, cargoSetting);
                        barcodeRequest = new models_1.CreateBarcode_MNG_Request();
                        barcodeRequest.referenceId = orderRequest.order.referenceId;
                        barcodeRequest.billOfLandingId = orderRequest.order.billOfLandingId;
                        barcodeRequest.isCOD = orderRequest.order.isCod;
                        barcodeRequest.codAmount = orderRequest.order.codAmount;
                        barcodeRequest.packagingType = orderRequest.order.packagingType;
                        content = orderRequest.orderPieceList.length.toString() + " Adet Ürün";
                        orderPieces = [];
                        orderPiece = new models_1.OrderPieceListMNG();
                        orderPiece.barcode = orderRequest.order.barcode;
                        orderPiece.content = content;
                        orderPiece.desi = orderRequest.order.packagingType === 1 ? 0 : orderRequest.order.packagingType === 3 ? 2 : this.cargoForm.get('desi').value;
                        orderPiece.kg = orderRequest.order.packagingType === 1 ? 0 : orderRequest.order.packagingType === 3 ? 2 : this.cargoForm.get('kg').value;
                        orderPieces.push(orderPiece);
                        barcodeRequest.orderPieceList = orderPieces;
                        _request = new models_1.CreatePackage_MNG_RM();
                        _request.orderRequest = orderRequest;
                        _request.barcodeRequest = barcodeRequest;
                        return [4 /*yield*/, this.cargoService.createCargo(_request)];
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
    CreateOrderComponent.prototype.createNewOrder = function () {
        return __awaiter(this, void 0, void 0, function () {
            var orderNo, Url, Url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.generalService.generateGUID()];
                    case 1:
                        orderNo = _a.sent();
                        if (this.orderType) {
                            Url = location.origin + "/create-order/quick-order/" + orderNo;
                            location.href = Url;
                        }
                        else {
                            Url = location.origin + "/create-order/retail-order" + orderNo;
                            location.href = Url;
                        }
                        return [2 /*return*/];
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
    CreateOrderComponent.prototype.createOrder = function () {
        return __awaiter(this, void 0, void 0, function () {
            var formValue, request, response, _request, response, __request, __response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.cargoForm.valid) {
                            this.toasterService.error("Kargo Formu Hatalı");
                            return [2 /*return*/];
                        }
                        console.log(this.payment);
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
                        // if (!this.payment) {
                        //   this.toasterService.error("Ödeme Seçilmedi Elemanı Seçiniz");
                        //   return;
                        // }
                        if (this.selectedProducts.length <= 0) {
                            this.toasterService.error("Ürün Ekleyiniz");
                            return [2 /*return*/];
                        }
                        if (!this.orderType) return [3 /*break*/, 6];
                        request = new nebimOrder_1.NebimOrder(this.selectedCustomers[0].currAccDescription, this.currAccCode, this.orderNo, formValue, this.selectedProducts, this.salesPersonCode, this.taxTypeCode);
                        return [4 /*yield*/, this.orderService.createOrder(request)];
                    case 1:
                        response = _a.sent();
                        if (!response) return [3 /*break*/, 5];
                        if (!(response.status === true)) return [3 /*break*/, 5];
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
                        this.generalService.waitAndNavigate("Sipariş Oluşturuldu", "orders-managament");
                        _a.label = 5;
                    case 5: return [3 /*break*/, 12];
                    case 6:
                        _request = new nebimOrder_1.NebimOrder_2(this.selectedCustomers[0].currAccDescription, this.currAccCode, this.orderNo, formValue, this.selectedProducts, this.salesPersonCode, this.taxTypeCode);
                        return [4 /*yield*/, this.orderService.createOrder(_request)];
                    case 7:
                        response = _a.sent();
                        if (!response) return [3 /*break*/, 10];
                        if (!(response.status === true)) return [3 /*break*/, 10];
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
                        __request = new nebimOrder_1.NebimInvoice(this.selectedCustomers[0].currAccDescription, this.currAccCode, this.orderNo, formValue, this.selectedProducts, this.salesPersonCode, this.taxTypeCode, this.selectedAddresses[0].postalAddressID);
                        __request.lines.forEach(function (l1) {
                            var fp = response.lines.find(function (p) { return p.itemCode === l1.itemCode && p.usedBarcode === l1.usedBarcode && p.qty1 === l1.qty1; });
                            if (fp) {
                                l1.orderLineId = fp.orderLineId;
                            }
                        });
                        return [4 /*yield*/, this.orderService.createInvoice(__request)];
                    case 11:
                        __response = _a.sent();
                        if (__response) {
                            this.generalService.waitAndNavigate("Sipariş Oluşturuldu & Faturalaştırıdı", "orders-managament");
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
