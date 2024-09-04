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
exports.CreateOrderComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var subCustomerList_VM_1 = require("src/app/models/model/customer/subCustomerList_VM");
var getCustomerList_CM_1 = require("src/app/models/model/order/getCustomerList_CM");
var payment_CR_1 = require("src/app/models/model/payment/payment_CR");
var productList_VM_1 = require("src/app/models/model/product/productList_VM");
var nebimCustomer_1 = require("src/app/models/nebim/customer/nebimCustomer");
var product_service_1 = require("src/app/services/admin/product.service");
var createCustomer_CM_1 = require("../../../../models/model/order/createCustomer_CM");
var getCustomerList_CM_2 = require("../../../../models/model/order/getCustomerList_CM");
var nebimOrder_1 = require("../../../../models/model/order/nebimOrder");
var CreateOrderComponent = /** @class */ (function () {
    function CreateOrderComponent(headerService, warehouseService, paymentService, toasterService, activatedRoute, router, httpClientService, generalService, addressService, googleDriveService, productService, formBuilder, orderService) {
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
        this.selectedCustomers = [];
        this.selectedProducts = [];
        this.selectedAddresses = [];
        this.selectedOfficeAndWarehosue = [];
        this.selectedSubCustomers = [];
        this.payment = new nebimOrder_1.Payment();
        this.activeIndex = 0;
        this["true"] = true;
        this.isCollapsed = false;
        this.isCollapsed_2 = false;
        //--------------------------------------------------------------------------- CLIENT ORDER
        this.stateOptions = [{ label: 'Standart', value: '0' }, { label: 'Vergisiz', value: '4' }, { label: 'Standart Kdv Düş', value: '5' }];
        this.isCompleted = false;
        this.isCancelled = false;
        this.orderNumber = "";
        this.orderDescription = "burak demir";
        this.discountRate1 = 0;
        this.discountRate2 = 0;
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
        this.createCustomerDialog = false;
        this.updateProductDialog = false;
        this.suggestedProductsDialog = false;
        this.getCustomerDialog = false;
        this.findProductDialog = false;
        this.selectAddressDialog = false;
        this.subCustomerDialog = false;
        this.addSubCustomerDialog = false;
        this.quantityListDialog = false;
        this.customers = [];
        this._activeIndex = 0;
        this.selectableCustomers = [];
        this._selectableCustomers = [];
        this.selectableSubCustomers = [];
        this.subCustomers = [];
        this.customFilter = function (options, filter) {
            var filterValue = filter.toLowerCase();
            return options.filter(function (option) { return option.name.toLowerCase().includes(filterValue); });
        };
        //----------------------------------------------------ADDRESS
        this.addresses = [];
        this.allProducts = [];
        this.brands = [];
        this.itemCodes = [];
        this.shelfNos = [];
        // targetShelfs: any[] = []
        this.descriptions = [];
        this.productHierarchyLevel01s = [];
        this.productHierarchyLevel02s = [];
        this.productHierarchyLevel03s = [];
        this.selectedSize = '';
        this.products = [];
        this.currentDiscountRate = 0;
        this.currentCashdiscountRate = 0;
        this.shelfNumbers = 'RAFLAR:';
        this.qrBarcodeUrl = null;
        this.qrOperationModels = [];
        this.suggestedProducts = [];
        this.clonedProducts = {};
        this.quantityList = [];
        //----------------------------------------------------
        //---------------------------------------------------- KARGO
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
        this.showCargo2 = false;
        //----------------------------------------------------
        //---------------------------------------------------- SİPARİŞ
        this.sidebarVisible4 = true;
        //----------------------------------------------------
        //---------------------------------------------------- PAYMENTS
        this.paymentMethods = [
            { id: 1, name: 'PayTr IFRAME' },
            { id: 6, name: 'PayTr SMS/MAIL' },
            { id: 5, name: 'POS İle Öde' },
            { id: 3, name: 'Havale İle Öde' },
            { id: 2, name: 'Nakit İle Öde' },
            { id: 4, name: 'Cari Ödeme' }
        ];
        //----------------------------------------------------
        this.visibleDialogs = {}; // ri'ye göre dialog görünürlük durumu
        this.overlayOptions = {
            appendTo: 'body',
            autoZIndex: true,
            baseZIndex: 1000,
            style: { 'min-width': '400px' },
            styleClass: 'custom-overlay-class' // Custom CSS class
        };
    }
    CreateOrderComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var spc, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.createGetCustomerForm();
                        this.createGetProductForm();
                        this.createUpdateProductForm();
                        this.createsubCustomerForm();
                        this.createCargoForm_2();
                        this.createPaymentForm();
                        this.createCustomerFormMethod();
                        this.createDiscountForm();
                        this._createCustomerFormMethod();
                        this.activatedRoute.params.subscribe(function (params) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!params['id']) return [3 /*break*/, 2];
                                        if (params['orderType'] === 'quick-order') {
                                            this.orderType = true;
                                            this.pageTitle = "Sipariş Ver";
                                        }
                                        else {
                                            this.pageTitle = "Perakende Satış";
                                            this.orderType = false;
                                        }
                                        this.id = params['id'];
                                        return [4 /*yield*/, this.getClientOrder(0)];
                                    case 1:
                                        _a.sent();
                                        this.headerService.updatePageTitle(this.pageTitle);
                                        _a.label = 2;
                                    case 2: return [4 /*yield*/, this.setCustomer()];
                                    case 3:
                                        _a.sent();
                                        return [4 /*yield*/, this.getAllCustomers()];
                                    case 4:
                                        _a.sent();
                                        return [4 /*yield*/, this.getAddresses()];
                                    case 5:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        spc = localStorage.getItem('salesPersonCode');
                        if (!spc) {
                            this.router.navigate(["/pages-loginv2"]);
                        }
                        else {
                            this.salesPersonCode = spc;
                        }
                        _a = this;
                        return [4 /*yield*/, this.orderService.getExchangeRates()];
                    case 1:
                        _a.exchangeRate = _b.sent();
                        this.generatedCargoNumber = this._generateRandomNumber();
                        this.paymentForm.get('paymentType').setValue(this.paymentMethods[5]);
                        this.paymentForm.get('taxTypeCode').setValue(this.stateOptions[1]);
                        this.console();
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateOrderComponent.prototype.console = function () {
        // console.clear();
        // console.log('payment:', this.payment);
        // console.log('selectedCustomers:', this.selectedCustomers);
        // console.log('selectedProducts:', this.selectedProducts);
        // console.log('selectedAddresses:', this.selectedAddresses);
        // console.log('selectedOfficeAndWarehosue:', this.selectedOfficeAndWarehosue);
        // console.log('selectedSubCustomers:', this.selectedSubCustomers);
    };
    //--------------------------------------------------------------------------- KAMERA
    CreateOrderComponent.prototype.printValue = function (ev) {
        this.toasterService.info("Okutma Başarılı :" + ev);
        //this.generalService.beep()2();
        this.getProductsForm.get('barcode').setValue(ev);
        this.getProducts(this.getProductsForm.value, this.orderType);
    };
    //---------------------------------------------------------------------------
    //---------------------------------------------------- TOTAL FUNCS
    CreateOrderComponent.prototype.findVatRate = function (vatRate) {
        return this.selectedProducts.some(function (p) { return p.taxRate == vatRate; });
    };
    CreateOrderComponent.prototype.calculateVatAmount = function (vatRate) {
        var _this = this;
        // First, calculate the total discount rate to apply to each product
        var totalDiscountRate = this.discountRate1 || 0; // percentage discount
        var cashDiscount = this.discountRate2 || 0; // cash discount
        return Number(this.selectedProducts
            .filter(function (p) { return p.taxRate === vatRate; }) // Filter products with the specified VAT rate
            .reduce(function (total, product) {
            // Apply percentage discount
            var discountedPrice = product.totalPrice * (1 - totalDiscountRate / 100);
            // Apply cash discount proportionally based on product price
            discountedPrice -= cashDiscount * (product.totalPrice / _this.getUntaxedTotal());
            // Calculate VAT based on the final discounted price
            return total + (discountedPrice * product.taxRate / 100);
        }, 0).toFixed(2)); // Sum the VAT amounts and round to 2 decimal places sadas
    };
    //vergisiz tutarların iskontodan sonraki hali
    CreateOrderComponent.prototype.getUnTaxedTotalAfterDiscount = function () {
        var number = this.selectedProducts.reduce(function (acc, product) { return acc + product.totalPrice; }, 0);
        number = ((number * ((100 - this.discountRate1) / 100)) - this.discountRate2);
        if (number.toString().includes('.')) {
            return Number(number);
        }
        else {
            return number;
        }
    };
    //vergisiz tutarların toplamı
    CreateOrderComponent.prototype.getUntaxedTotal = function () {
        var number = this.selectedProducts.reduce(function (acc, product) { return acc + product.totalPrice; }, 0);
        if (number.toString().includes('.')) {
            return Number(number);
        }
        else {
            return number;
        }
    };
    //dip iskonto uygulandıktan sonraki fiyatı çeker
    CreateOrderComponent.prototype.getTaxedTotalAfterDiscount = function () {
        return this.selectedProducts.reduce(function (acc, product) { return acc + product.totalTaxedPrice; }, 0) * ((100 - this.discountRate1) / 100) - this.discountRate2;
    };
    CreateOrderComponent.prototype.getTotalQuantity = function () {
        return this.selectedProducts.reduce(function (acc, product) { return acc + product.quantity; }, 0);
    };
    CreateOrderComponent.prototype.calculateNetTaxedPrice = function (product, proposal) {
        var lineDiscountedPrice = (product.price || 0) * (1 - product.discountRate1 / 100) - product.discountRate2;
        var generalDiscountedPrice = lineDiscountedPrice * (1 - (proposal.discountRate1 || 0) / 100) - (proposal.discountRate2 || 0);
        var totalPrice = generalDiscountedPrice * product.quantity;
        var totalTaxedPrice = totalPrice * (1 + product.taxRate / 100);
        return parseFloat(totalTaxedPrice.toFixed(2));
    };
    CreateOrderComponent.prototype.getTotalTax_2 = function () {
        return this.selectedProducts.reduce(function (acc, product) { return acc + ((product.totalPrice * (product.taxRate / 100))); }, 0);
    };
    CreateOrderComponent.prototype.getTotalTax = function () {
        return this.getTaxedTotalAfterDiscount() - this.getUnTaxedTotalAfterDiscount();
        return this.selectedProducts.reduce(function (acc, product) { return acc + (product.totalPrice * (product.taxRate / 100)); }, 0);
    };
    CreateOrderComponent.prototype.getTotal = function () {
        return this.selectedProducts.reduce(function (acc, product) { return acc + product.totalPrice; }, 0);
    };
    //dip iskonto uygulanmadan önceki fiyatı çeker
    CreateOrderComponent.prototype.getTotalTaxedPrice = function () {
        var total = this.selectedProducts.reduce(function (acc, product) { return acc + product.totalTaxedPrice; }, 0);
        return parseFloat(total.toFixed(2));
    };
    CreateOrderComponent.prototype.getUntaxedTotalWithTax = function () {
        var number = this.selectedProducts.reduce(function (acc, product) { return acc + (product.quantity * product.discountedPrice * (product.taxRate / 100)); }, 0);
        if (number.toString().includes('.')) {
            return Number(number.toString().split('.')[0]);
        }
        else {
            return number;
        }
    };
    CreateOrderComponent.prototype.getClientOrder = function (state) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var response, order, customer_request, customerResponse, findedCustomer, request_address, response, findedAddress, finded_payment, scRequest, scResponse, order, error_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.orderService.getClientOrder(this.id)];
                    case 1:
                        response = _b.sent();
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 12, , 13]);
                        if (!(state === 0)) return [3 /*break*/, 10];
                        if (!response.clientOrder) return [3 /*break*/, 8];
                        order = response;
                        this.createdDate = order.clientOrder.createdDate;
                        this.discountRate1 = order.clientOrder.discountRate1;
                        this.discountRate2 = order.clientOrder.discountRate2;
                        this.updateProductForm.get('discountRate1').setValue(order.clientOrder.discountRate1);
                        this.updateProductForm.get('discountRate2').setValue(order.clientOrder.discountRate2);
                        this.orderNo = order.clientOrder.orderNo;
                        this.isCompleted = order.clientOrder.isCompleted != null ? order.clientOrder.isCompleted : false;
                        this.isCancelled = order.clientOrder.isCancelled != null ? order.clientOrder.isCancelled : false;
                        this.currAccCode = order.clientOrder.customerCode;
                        this.orderNumber = order.clientOrder.orderNumber;
                        customer_request = new getCustomerList_CM_2.GetCustomerList_CM();
                        customer_request.currAccCode = this.currAccCode;
                        if (!(customer_request.currAccCode != null)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.orderService.getCustomerList_2(customer_request)];
                    case 3:
                        customerResponse = _b.sent();
                        if (customerResponse) {
                            findedCustomer = customerResponse.find(function (c) { return c.currAccCode == _this.currAccCode; });
                            this.selectedCustomers.push(findedCustomer);
                            console.log("Müşteri Eklendi");
                        }
                        return [3 /*break*/, 4];
                    case 4:
                        request_address = new getCustomerList_CM_1.GetCustomerAddress_CM();
                        request_address.currAccCode = this.currAccCode;
                        return [4 /*yield*/, this.orderService.getCustomerAddress(request_address)];
                    case 5:
                        response = _b.sent();
                        if (response) {
                            findedAddress = response.find(function (x) { return x.postalAddressID === order.clientOrder.shippingPostalAddressId; });
                            if (findedAddress) {
                                this.selectedAddresses.push(findedAddress);
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
                            finded_payment = this.paymentMethods.find(function (p) { return p.name.includes(order.clientOrder.paymentDescription); });
                            this.paymentForm.get('paymentType').setValue(finded_payment);
                            console.log("Ödeme Eklendi");
                        }
                        //ALT MÜŞTERİ EKLENDİ
                        this.createCustomerForm.value.sc_Mode = true;
                        if (!!this.generalService.isNullOrEmpty(order.clientOrder.subCurrAccId)) return [3 /*break*/, 7];
                        scRequest = new subCustomerList_VM_1.SubCustomerList_VM();
                        scRequest.subCurrAccId = order.clientOrder.subCurrAccId;
                        return [4 /*yield*/, this.orderService.getSubCustomerList(scRequest)];
                    case 6:
                        scResponse = _b.sent();
                        if (scResponse) {
                            this.createCustomerForm.value.sc_Description = (_a = scResponse[0]) === null || _a === void 0 ? void 0 : _a.companyName;
                            this.selectedSubCustomers.push(scResponse[0]);
                            console.log("Alt Müşteri Eklendi");
                        }
                        return [3 /*break*/, 7];
                    case 7:
                        this.payment.amount = this.selectedProducts.reduce(function (total, product) { return total + product.price; }, 0);
                        // this.selectedAddresses = []; burası
                        this.orderNo = order.clientOrder.orderNo;
                        this.cargoForm_2.get('address_recepient_name').setValue(order.clientOrder.recepientName);
                        this.cargoForm_2.get('address_phoneNumber').setValue(order.clientOrder.recepientPhone);
                        this.orderDescription = order.clientOrder.description;
                        if (order.clientOrderBasketItems.length > 0) {
                            this.selectedProducts = [];
                            order.clientOrderBasketItems.reverse();
                            order.clientOrderBasketItems.forEach(function (basketItem) {
                                // var object = this.convertLineToObject(basketItem);
                                _this.selectedProducts.push(basketItem);
                            });
                        }
                        return [3 /*break*/, 9];
                    case 8:
                        this.orderNo = this.generateRandomNumber();
                        this.toasterService.success("Yeni Sipariş : " + this.orderNo);
                        _b.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        this.createdDate = response.clientOrder.createdDate;
                        if (response.clientOrder) {
                            order = response;
                            this.selectedProducts = [];
                            if (order.clientOrderBasketItems.length > 0) {
                                this.selectedProducts = order.clientOrderBasketItems;
                                // order.clientOrderBasketItems.forEach((basketItem: ClientOrderBasketItem) => {
                                //   var object = this.convertLineToObject(basketItem);
                                //  .push(object);
                                // });
                                console.log("Ürünler Eklendi");
                            }
                        }
                        else {
                            this.toasterService.error("Yanıt Yok");
                        }
                        _b.label = 11;
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        error_1 = _b.sent();
                        this.toasterService.error(error_1.message);
                        return [3 /*break*/, 13];
                    case 13: return [2 /*return*/];
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
                        if (!response) return [3 /*break*/, 4];
                        this.toasterService.success("Sipariş Silindi");
                        if (!this.orderNumber) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.orderService.deleteNebimOrder(this.orderNumber)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        this.createNewOrder();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
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
        object.taxRate = line.taxRate;
        object.priceWs = line.priceWs;
        object.discountRate1 = line.discountRate1;
        object.discountRate2 = line.discountRate2;
        object.totalPrice = line.totalPrice;
        object.totalTaxedPrice = line.totalTaxedPrice;
        return object;
    };
    CreateOrderComponent.prototype.createClientOrder_RM = function () {
        var _a, _b, _c, _d;
        try {
            var request = new nebimOrder_1.ClientOrder();
            var currentTime = new Date();
            // 3 saat çıkararak yeni bir Date nesnesi oluşturun
            var threeHoursAgo = new Date(currentTime.getTime() + 3 * 60 * 60 * 1000);
            request.createdDate = this.createdDate == undefined ? threeHoursAgo : this.createdDate;
            request.customerCode = this.currAccCode;
            request.id = this.id;
            request.orderNo = this.orderNo;
            request.orderNumber = this.orderNumber;
            request.customerDescription = ((_a = this.selectedCustomers[0]) === null || _a === void 0 ? void 0 : _a.currAccDescription) || null;
            request.shippingPostalAddressId = (_b = this.selectedAddresses[0]) === null || _b === void 0 ? void 0 : _b.postalAddressID;
            request.recepientName = this.cargoForm_2.value.address_recepient_name;
            request.recepientPhone = this.cargoForm_2.value.address_phoneNumber;
            request.orderDescription = this.orderDescription;
            request.cargoStatus = "KARGO YOK";
            request.orderDescription = this.paymentForm.get('orderDescription').value;
            request.paymentDescription = this.payment.creditCardTypeCode;
            request.subCurrAccId = (_c = this.selectedSubCustomers[0]) === null || _c === void 0 ? void 0 : _c.subCurrAccId;
            request.subCustomerDescription = (_d = this.selectedSubCustomers[0]) === null || _d === void 0 ? void 0 : _d.companyName;
            request.isCancelled = false;
            request.discountRate1 = this.discountRate1;
            request.discountRate2 = this.discountRate2;
            if (this.payment) {
                request.paymentType = this.payment.creditCardTypeCode;
            }
            else {
                request.paymentType = null;
            }
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
            request.quantity = newLine.quantity2;
            request.warehouseCode = newLine.warehouseCode;
            request.brandDescription = newLine.brandDescription;
            request.uD_Stock = newLine.uD_Stock;
            request.mD_Stock = newLine.mD_Stock;
            request.basePrice = newLine.basePrice;
            request.discountedPrice = newLine.discountedPrice;
            request.priceWs = newLine.priceWs;
            request.discountRate1 = 0;
            request.discountRate2 = 0;
            request.taxRate = newLine.taxRate;
            request.totalPrice = newLine.quantity * newLine.discountedPrice;
            request.totalTaxedPrice = (newLine.quantity * newLine.discountedPrice) * (1 + (newLine.taxRate / 100));
            return request;
        }
        catch (error) {
            this.toasterService.error(error.message);
            return null;
        }
    };
    CreateOrderComponent.prototype.sendInvoiceToPrinter = function (orderNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.orderService.sendInvoiceToPrinter(orderNumber)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            this.toasterService.success("Yazıcıya Gönderildi");
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateOrderComponent.prototype.selectSalesPerson = function () {
        this.activeIndex = 1;
        //this.generalService.beep()();
        this.toasterService.success("Satış Elemanı Seçildi");
    };
    CreateOrderComponent.prototype.getSalesPersonModels = function () {
        return __awaiter(this, void 0, Promise, function () {
            var _a, error_2, error_3;
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
                        error_2 = _b.sent();
                        this.toasterService.error(error_2.message);
                        return [2 /*return*/, null];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_3 = _b.sent();
                        this.toasterService.error(error_3.message);
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
            address_description: [null],
            address_taxOffice: [null],
            address_postalCode: [' ']
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
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.addressService.getAddress(1)];
                    case 1:
                        countries = _a.sent();
                        // Ülkeleri döngüye alarak dönüştür ve _countries dizisine ekle
                        this._countries = countries.map(function (b) {
                            return { name: b.description, code: b.code };
                        });
                        return [4 /*yield*/, this.addressService.getAddress(2, "TR")];
                    case 2:
                        regions = _a.sent();
                        // Region'ları döngüye alarak dönüştür ve _regions dizisine ekle
                        this._regions = regions.map(function (b) {
                            return { name: b.description, code: b.code };
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
                        this.selectedFiles = [];
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
                        event.target.value = "";
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
                            this.addSubCustomerForm.get("bussinesCardPhotoUrl").setValue(response.url);
                            this.createCustomerForm.get("bussinesCardPhotoUrl").setValue(response.url);
                        }
                        if (to === "stampPhotoUrl") {
                            this.addSubCustomerForm.get("stampPhotoUrl").setValue(response.url);
                            this.createCustomerForm.get("stampPhotoUrl").setValue(response.url);
                        }
                        if (to === "cargoAddressPhotoUrl") {
                            this.addSubCustomerForm.get("cargoAddressPhotoUrl").setValue(response.url);
                            this.createCustomerForm.get("stampPhotoUrl").setValue(response.url);
                        }
                        return [2 /*return*/];
                }
            });
        });
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
    CreateOrderComponent.prototype.showPanel = function (type) {
        if (this.selectedCustomers.length == 0) {
            if (type == 1) {
                if (this.dropdown) {
                    this.dropdown.show();
                }
            }
            else if (type == 2) {
                if (this.dropdown_2) {
                    this.dropdown_2.show();
                }
            }
        }
        else if (type == 3) {
            if (this.dropdown_3) {
                this.dropdown_3.show();
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
        if (dialogName === "addSubCustomerDialog") {
            this.addSubCustomerDialog = !this.addSubCustomerDialog;
        }
        if (dialogName === "quantityListDialog") {
            this.quantityListDialog = !this.quantityListDialog;
        }
        if (dialogName === "suggestedProductsDialog") {
            this.suggestedProductsDialog = !this.suggestedProductsDialog;
        }
        if (dialogName === "updateProductDialog") {
            this.updateProductDialog = !this.updateProductDialog;
        }
        if (dialogName === "createCustomerDialog") {
            this.createCustomerDialog = !this.createCustomerDialog;
        }
    };
    CreateOrderComponent.prototype.goToPage = function (index) {
        this.activeIndex = index;
        // this.toasterService.info(this.activeIndex.toString())
    };
    CreateOrderComponent.prototype.changeInvoiceType = function (type) {
        //bireysel ise
        if (this.invoiceType) {
            this.invoiceType = type;
        }
        //doktora kesilcek ise
        else {
            this.invoiceType = type;
        }
    };
    CreateOrderComponent.prototype.setCustomer = function () {
        return __awaiter(this, void 0, void 0, function () {
            var salesPersonCode, request, response, findedCustomer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.selectedCustomers.length == 0)) return [3 /*break*/, 3];
                        salesPersonCode = localStorage.getItem('currAccCode');
                        request = new getCustomerList_CM_2.GetCustomerList_CM();
                        request.currAccCode = salesPersonCode;
                        return [4 /*yield*/, this.orderService.getCustomerList_2(request)];
                    case 1:
                        response = _a.sent();
                        if (!response) return [3 /*break*/, 3];
                        findedCustomer = response.find(function (c) { return c.currAccCode == salesPersonCode; });
                        this.selectableCustomers.push({ name: findedCustomer.currAccDescription, value: findedCustomer.phone, currAccCode: findedCustomer.currAccCode });
                        this.createCustomerForm.get('currAccDescription').setValue(findedCustomer.currAccDescription);
                        return [4 /*yield*/, this.selectCurrentCustomer(findedCustomer)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CreateOrderComponent.prototype.getCustomersAutomaticaly = function (field) {
        return __awaiter(this, void 0, void 0, function () {
            var request, response;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(field.length > 3)) return [3 /*break*/, 2];
                        request = new getCustomerList_CM_2.GetCustomerList_CM();
                        request.currAccCode = field;
                        request.mail = null;
                        request.phone = null;
                        return [4 /*yield*/, this.orderService.getCustomerList_2(request)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            this.selectableCustomers = [];
                            response.forEach(function (c) {
                                _this.selectableCustomers.push({ name: c.currAccDescription, value: c.phone, currAccCode: c.currAccCode });
                            });
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    CreateOrderComponent.prototype.submitAddressForm = function (formValue) {
        return __awaiter(this, void 0, void 0, function () {
            var check_request, check_response, _findedCustomer, request, response, clientCustomer_request, clientCustomer_response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        check_request = new getCustomerList_CM_1.GetCustomerAddress_CM();
                        check_request.currAccCode = formValue.currAccDescription.currAccCode;
                        return [4 /*yield*/, this.orderService.getCustomerList_2(check_request)];
                    case 1:
                        check_response = _a.sent();
                        if (!(check_response.length > 0 && check_request.currAccCode != undefined)) return [3 /*break*/, 4];
                        _findedCustomer = check_response.find(function (c) { return c.currAccCode == formValue.currAccDescription.currAccCode; });
                        if (!_findedCustomer) return [3 /*break*/, 3];
                        this.getCustomerForm.get("currAccCode").setValue(check_response[0].currAccCode);
                        return [4 /*yield*/, this.selectCurrentCustomer(_findedCustomer)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                    case 4:
                        if (!this.createCustomerForm.valid) return [3 /*break*/, 11];
                        request = new createCustomer_CM_1.CreateCustomer_CM();
                        request.currAccDescription = formValue.currAccDescription; //++
                        request.mail = formValue.mail;
                        request.phoneNumber = formValue.phoneNumber;
                        request.firmDescription = formValue.currAccDescription;
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
                        if (!true) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.orderService.createCustomer(request)];
                    case 5:
                        response = _a.sent();
                        if (!response.currAccCode) return [3 /*break*/, 10];
                        clientCustomer_request = new createCustomer_CM_1.ClientCustomer();
                        clientCustomer_request.cargoAddressPhotoUrl = formValue.cargoAddressPhotoUrl;
                        clientCustomer_request.currAccCode = response.currAccCode;
                        clientCustomer_request.description = formValue.currAccDescription.value;
                        clientCustomer_request.stampPhotoUrl = formValue.stampPhotoUrl;
                        clientCustomer_request.bussinesCardPhotoUrl = formValue.bussinesCardPhotoUrl;
                        clientCustomer_request.addedSellerCode = localStorage.getItem('salesPersonCode');
                        return [4 /*yield*/, this.orderService.editClientCustomer(clientCustomer_request)];
                    case 6:
                        clientCustomer_response = _a.sent();
                        if (!clientCustomer_response) return [3 /*break*/, 10];
                        this.toasterService.success(this.currAccCode);
                        this.currAccCode = response.currAccCode;
                        this.getCustomerDialog = true;
                        this.getCustomerForm.get("currAccCode").setValue(this.currAccCode);
                        return [4 /*yield*/, this.getCustomers(this.getCustomerForm.value)];
                    case 7:
                        _a.sent();
                        if (!(this.customers.length > 0)) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.selectCurrentCustomer(this.customers[0])];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, this.getCustomerAddresses(this.customers[0])];
                    case 9:
                        _a.sent();
                        _a.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        this.generalService.whichRowIsInvalid(this.createCustomerForm);
                        _a.label = 12;
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    CreateOrderComponent.prototype.createsubCustomerForm = function () {
        var _this = this;
        this.addSubCustomerForm = this.formBuilder.group({
            currAccCode: [null],
            subCurrAccDesc: [null],
            mail: [null],
            phone: [null],
            country: [null],
            region: [null],
            province: [null],
            taxOffice: [null],
            district: [null],
            address: [null],
            stampPhotoUrl: [null],
            bussinesCardPhotoUrl: [null],
            cargoAddressPhotoUrl: [null]
        });
        this.addSubCustomerForm.get('region').valueChanges.subscribe(function (value) { return __awaiter(_this, void 0, void 0, function () {
            var _value, response;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _value = this.addSubCustomerForm.get('region').value.code;
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
        this.addSubCustomerForm.get('province').valueChanges.subscribe(function (value) { return __awaiter(_this, void 0, void 0, function () {
            var _value, response, _value, response;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _value = this.addSubCustomerForm.get('province').value.code;
                        return [4 /*yield*/, this.addressService.getAddress(4, _value)];
                    case 1:
                        response = _a.sent();
                        this.districts = response;
                        this._districts = [];
                        this.districts.forEach(function (b) {
                            var district = { name: b.description, code: b.code };
                            _this._districts.push(district);
                        });
                        _value = this.addSubCustomerForm.get('province').value.code;
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
    CreateOrderComponent.prototype.onDropdownChange = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            var request, response, findedCustomer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request = new getCustomerList_CM_2.GetCustomerList_CM();
                        request.currAccCode = value.currAccCode;
                        return [4 /*yield*/, this.orderService.getCustomerList_2(request)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            findedCustomer = response.find(function (c) { return c.currAccCode == request.currAccCode; });
                            this.createCustomerForm.get('currAccDescription').setValue(findedCustomer.currAccDescription);
                            this.selectCurrentCustomer(findedCustomer);
                        }
                        return [2 /*return*/];
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
            phoneNumber: ['05', [forms_1.Validators.required]],
            stampPhotoUrl: [null],
            bussinesCardPhotoUrl: [null],
            cargoAddressPhotoUrl: [null],
            address_country: [null],
            address_province: [null],
            address_district: [null],
            address_region: [null],
            taxNumber: [null],
            address_description: [null],
            address_postalCode: [' '],
            address_taxOffice: [null],
            sc_Description: [null],
            sc_mode: [false]
        });
        this.createCustomerForm.get('sc_Description').valueChanges.subscribe(function (value) { return __awaiter(_this, void 0, void 0, function () {
            var subCustomer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.generalService.isNullOrEmpty(value === null || value === void 0 ? void 0 : value.name)) return [3 /*break*/, 2];
                        subCustomer = new subCustomerList_VM_1.SubCustomerList_VM();
                        subCustomer = this.subCustomers.find(function (p) { return p.subCurrAccId == value.value; });
                        if (!subCustomer) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.selectCurrentSubCustomer(subCustomer)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); });
        // this.createCustomerForm.get('phoneNumber').valueChanges.subscribe(async (value) => { //illeri getir
        //   if (this.generalService.isNullOrEmpty(value)) {
        //     this.createCustomerForm.get('phoneNumber').setValue('05')
        //   }
        // });
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
    CreateOrderComponent.prototype.getAllCustomers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _request, _response, error_4;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        _request = new getCustomerList_CM_2.GetCustomerList_CM();
                        _request.currAccCode = null;
                        _request.mail = null;
                        _request.phone = null;
                        return [4 /*yield*/, this.orderService.getCustomerList_2(_request)];
                    case 1:
                        _response = _a.sent();
                        _response.forEach(function (c) {
                            _this._selectableCustomers.push({ name: c.currAccDescription, value: c.phone, currAccCode: c.currAccCode });
                        });
                        ;
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        this.toasterService.error(error_4.message);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CreateOrderComponent.prototype.createGetCustomerForm = function () {
        this.getCustomerForm = this.formBuilder.group({
            mail: [null],
            phone: [null],
            currAccCode: [null]
        });
        this.getCustomerForm.get('currAccCode').valueChanges.subscribe(function (value) {
            if (value != null && value != "") {
            }
        });
    };
    CreateOrderComponent.prototype.createCustomerForm_Submit = function (value) {
        if (this.selectCurrentAddress.length > 0) {
        }
        else {
            this.toasterService.error("Adres Bulunamadı");
        }
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
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateOrderComponent.prototype.selectCurrentCustomer = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var _request;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.selectedCustomers = [];
                        this.selectedCustomers.push(request);
                        this.currAccCode = request.currAccCode;
                        this.openDialog("getCustomerDialog");
                        _request = new getCustomerList_CM_1.GetCustomerAddress_CM();
                        _request.currAccCode = request.currAccCode;
                        return [4 /*yield*/, this.getCustomerAddresses(_request)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateOrderComponent.prototype.deleteCurrentCustomer = function () {
        this.selectedCustomers = [];
        this.toasterService.success("Müşteri Silindi");
        this.deleteCurrentAddress();
    };
    CreateOrderComponent.prototype.getSubCustomers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var request, response, request, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.createCustomerForm.value.sc_Description != null ||
                            (typeof this.createCustomerForm.value.sc_Description === 'object' &&
                                this.generalService.isNullOrEmpty(this.createCustomerForm.value.sc_Description.name)))) return [3 /*break*/, 5];
                        if (!(typeof this.createCustomerForm.value.sc_Description === 'object')) return [3 /*break*/, 2];
                        request = new subCustomerList_VM_1.SubCustomerList_VM();
                        request.currAccCode = this.createCustomerForm.value.sc_Description.name;
                        return [4 /*yield*/, this.orderService.getSubCustomerList(request)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            this.subCustomers = [];
                            this.subCustomers = response;
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        request = new subCustomerList_VM_1.SubCustomerList_VM();
                        request.currAccCode = this.createCustomerForm.value.sc_Description;
                        return [4 /*yield*/, this.orderService.getSubCustomerList(request)];
                    case 3:
                        response = _a.sent();
                        if (response) {
                            this.subCustomers = [];
                            this.subCustomers = response;
                        }
                        _a.label = 4;
                    case 4: return [3 /*break*/, 5];
                    case 5:
                        this.subCustomerDialog = !this.subCustomerDialog;
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateOrderComponent.prototype.selectCurrentSubCustomer = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var order_request, order_response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.selectedSubCustomers = [];
                        this.selectedSubCustomers.push(request);
                        order_request = this.createClientOrder_RM();
                        return [4 /*yield*/, this.orderService.createClientOrder(order_request)];
                    case 1:
                        order_response = _a.sent();
                        if (order_response) {
                            this.toasterService.success("Alt Müşteri Seçildi");
                            //this.generalService.beep()()
                            this.subCustomerDialog = false;
                            this.activeIndex = 2;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateOrderComponent.prototype.log = function (style) {
        console.log(style);
    };
    CreateOrderComponent.prototype.addSubCustomer = function () {
        var _a, _b, _c, _d, _e, _f, _g;
        return __awaiter(this, void 0, void 0, function () {
            var request, response;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        console.log(this.addSubCustomerForm.value);
                        if (!(this.selectedCustomers.length === 0)) return [3 /*break*/, 1];
                        this.toasterService.error("Müşteri Seçiniz");
                        return [2 /*return*/];
                    case 1:
                        request = new subCustomerList_VM_1.SubCustomerList_VM();
                        request.currAccCode = this.selectedCustomers[0].currAccCode;
                        request.companyName = ((_a = this.addSubCustomerForm.value.subCurrAccDesc) === null || _a === void 0 ? void 0 : _a.name) ? (_b = this.addSubCustomerForm.value.subCurrAccDesc) === null || _b === void 0 ? void 0 : _b.name : (_c = this.addSubCustomerForm.value) === null || _c === void 0 ? void 0 : _c.subCurrAccDesc;
                        request.mail = this.addSubCustomerForm.value.mail;
                        request.phone = this.addSubCustomerForm.value.phone;
                        request.city = this.generalService.isNullOrEmpty((_d = this.addSubCustomerForm.value.province) === null || _d === void 0 ? void 0 : _d.name) ? 'İSTANBUL' : (_e = this.addSubCustomerForm.value.province) === null || _e === void 0 ? void 0 : _e.name;
                        request.district = this.generalService.isNullOrEmpty((_f = this.addSubCustomerForm.value.district) === null || _f === void 0 ? void 0 : _f.name) ? 'FATİH' : (_g = this.addSubCustomerForm.value.district) === null || _g === void 0 ? void 0 : _g.name;
                        request.address = this.addSubCustomerForm.value.address;
                        request.stampPhotoUrl = this.addSubCustomerForm.value.stampPhotoUrl;
                        request.bussinesCardPhotoUrl = this.addSubCustomerForm.value.bussinesCardPhotoUrl;
                        request.cargoAddressPhotoUrl = this.addSubCustomerForm.value.cargoAddressPhotoUrl;
                        if (this.selectableSubCustomers.some(function (c) { return c.name == request.companyName; })) {
                            this.toasterService.info("Bu Şirkete Ait Kayıt Zaten Açılmıştır");
                            this.addSubCustomerDialog = false;
                            this.createCustomerForm.get('sc_Description').setValue(this.selectableSubCustomers.find(function (c) { return c.name == request.companyName; }));
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.orderService.addSubCustomer(request)];
                    case 2:
                        response = _h.sent();
                        if (response) {
                            this.toasterService.success("Alt Müşteri Eklendi");
                            this.selectableSubCustomers.push({ name: response[0].companyName, value: response[0].subCurrAccId });
                            this.createCustomerForm.get('sc_Description').setValue(response[0].companyName);
                            this.selectCurrentSubCustomer(response[0]);
                            this.openDialog("addSubCustomerDialog");
                        }
                        else {
                            this.toasterService.error("Alt Müşteri Eklenemedi");
                        }
                        _h.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CreateOrderComponent.prototype.getCustomerAddresses = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, subCustomer_request, subCustomer_response;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.orderService.getCustomerAddress(request)];
                    case 1:
                        _a.addresses = _b.sent();
                        if (!(this.addresses.length > 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.selectCurrentAddress(this.addresses[0])];
                    case 2:
                        _b.sent();
                        this.selectAddressDialog = false;
                        subCustomer_request = new subCustomerList_VM_1.SubCustomerList_VM();
                        subCustomer_request.currAccCode = this.selectedCustomers[0].currAccCode;
                        return [4 /*yield*/, this.orderService.getSubCustomerList(subCustomer_request)];
                    case 3:
                        subCustomer_response = _b.sent();
                        this.subCustomers = [];
                        this.subCustomers = subCustomer_response;
                        if (subCustomer_response) {
                            subCustomer_response.forEach(function (c) {
                                _this.selectableSubCustomers.push({ name: c.companyName, value: c.subCurrAccId });
                            });
                        }
                        _b.label = 4;
                    case 4:
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
                            // this.toasterService.success("Adres Eklendi")
                            // this.activeIndex = 2;
                            //this.getCustomerForm.reset();
                            this.customers = [];
                            //this.generalService.beep()()
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
    CreateOrderComponent.prototype.logFilteredData = function (event) {
        try {
            if (event.filteredValue) {
                console.log('Filtered data:', event.filteredValue);
                var list = event.filteredValue;
                this.mapProducts(list);
                this.toasterService.info("Dinamik Search Güncellendi");
            }
        }
        catch (error) {
            this.toasterService.error(error.message);
        }
    };
    CreateOrderComponent.prototype.addProduct = function (product) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.getProductsForm.get('barcode').setValue(product.barcode);
                        this.getProductsForm.get('shelfNo').setValue(null);
                        this.findProductDialog = false;
                        return [4 /*yield*/, this.getProducts(this.getProductsForm.value, this.orderType)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateOrderComponent.prototype.getAllProducts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.allProducts.length == 0)) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this.productService.searchProduct5()];
                    case 1:
                        _a.allProducts = _b.sent();
                        _b.label = 2;
                    case 2:
                        this.toasterService.success('Tüm Ürünler Getirildi');
                        this.mapProducts(this.allProducts);
                        this.openDialog('findProductDialog');
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateOrderComponent.prototype.mapProducts = function (data) {
        var uniqueMap = function (array, key) {
            var map = new Map();
            array.forEach(function (item) {
                if (!map.has(item[key])) {
                    map.set(item[key], { label: item[key], value: item[key] });
                }
            });
            return Array.from(map.values()).sort(function (a, b) { return a.label.localeCompare(b.label); });
        };
        this.shelfNos = uniqueMap(data, 'shelfNo');
        this.brands = uniqueMap(data, 'brand');
        this.itemCodes = uniqueMap(data, 'itemCode');
        // this.targetShelfs = uniqueMap(this.__transferProducts, 'targetShelf');
        this.descriptions = uniqueMap(data, 'description');
        this.productHierarchyLevel01s = uniqueMap(data, 'productHierarchyLevel01');
        this.productHierarchyLevel02s = uniqueMap(data, 'productHierarchyLevel02');
        this.productHierarchyLevel03s = uniqueMap(data, 'productHierarchyLevel03');
    };
    CreateOrderComponent.prototype.createUpdateProductForm = function () {
        this.updateProductForm = this.formBuilder.group({
            discountedPrice: [null, forms_1.Validators.required],
            quantity: [null, forms_1.Validators.required],
            discountRate1: [null, forms_1.Validators.required],
            discountRate2: [null, forms_1.Validators.required]
        });
    };
    CreateOrderComponent.prototype.openUpdateDialog = function (product, index) {
        this.selectedProduct = product;
        this.selectedIndex = index;
        this.updateProductForm.get('discountedPrice').setValue(this.selectedProduct.discountedPrice);
        this.updateProductForm.get('quantity').setValue(this.selectedProduct.quantity);
        this.updateProductForm.get('discountRate1').setValue(this.selectedProduct.discountRate1);
        this.updateProductForm.get('discountRate2').setValue(this.selectedProduct.discountRate2);
        this.openDialog('updateProductDialog');
    };
    CreateOrderComponent.prototype.resetProductForm = function () {
        this.getProductsForm.reset();
        this.toasterService.success("Form Sıfırlandı");
    };
    CreateOrderComponent.prototype.createDiscountForm = function () {
        this.discountForm = this.formBuilder.group({
            cashDiscountRate: [null, forms_1.Validators.required],
            percentDiscountRate: [null, forms_1.Validators.required]
        });
    };
    CreateOrderComponent.prototype.getTotalPrice = function () {
        var number = this.selectedProducts.reduce(function (acc, product) { return acc + (product.quantity * product.discountedPrice); }, 0);
        if (number.toString().includes('.')) {
            return Number(number.toString().split('.')[0]);
        }
        else {
            return number;
        }
    };
    CreateOrderComponent.prototype.getTotalPriceWithTax = function () {
        var number = this.selectedProducts.reduce(function (acc, product) { return acc + (product.quantity * product.discountedPrice * (product.taxRate / 100)); }, 0);
        if (number.toString().includes('.')) {
            return Number(number.toString().split('.')[0]);
        }
        else {
            return number;
        }
    };
    CreateOrderComponent.prototype.discount = function (discountAmount) {
        return __awaiter(this, void 0, void 0, function () {
            var r, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(discountAmount >= 0 && discountAmount <= 100)) return [3 /*break*/, 2];
                        this.discountRate1 = discountAmount;
                        r = this.createClientOrder_RM();
                        return [4 /*yield*/, this.orderService.createClientOrder(r)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            this.getClientOrder(0);
                            this.toasterService.success('Güncellendi');
                        }
                        else {
                            this.toasterService.error('Güncellenmedi');
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        this.toasterService.error('1 ile 100 arasında bir değer giriniz.');
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CreateOrderComponent.prototype.cashDiscount = function (discountAmount) {
        return __awaiter(this, void 0, void 0, function () {
            var r, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.discountRate2 = discountAmount;
                        r = this.createClientOrder_RM();
                        return [4 /*yield*/, this.orderService.createClientOrder(r)];
                    case 1:
                        response = _a.sent();
                        if (!response) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getClientOrder(0)];
                    case 2:
                        _a.sent();
                        this.getTaxedTotalAfterDiscount();
                        this.toasterService.success('Güncellendi');
                        return [3 /*break*/, 4];
                    case 3:
                        this.toasterService.error('Güncellenmedi');
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CreateOrderComponent.prototype.resetDiscount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var r, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.discountRate1 = 0;
                        this.discountRate2 = 0;
                        r = this.createClientOrder_RM();
                        return [4 /*yield*/, this.orderService.createClientOrder(r)];
                    case 1:
                        response = _a.sent();
                        if (!response) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getClientOrder(0)];
                    case 2:
                        _a.sent();
                        this.getTaxedTotalAfterDiscount();
                        this.toasterService.success('Güncellendi');
                        return [3 /*break*/, 4];
                    case 3:
                        this.toasterService.error('Güncellenmedi');
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
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
            var result, _request, response, totalQuantity, _i, _a, _product, error_5, result, result, result, check_response, data, response, totalQuantity, _b, _c, _product;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!pageType) return [3 /*break*/, 18];
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 16, , 17]);
                        if (!(request.barcode.includes('http') || this.generalService.isGuid(request.barcode))) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.productService.countProductByBarcode3(request.barcode)];
                    case 2:
                        result = _d.sent();
                        if (result == null) {
                            this.toasterService.error("Qr Sorgusu Hatalı");
                            return [2 /*return*/];
                        }
                        this.getProductsForm.get('barcode').setValue(result[3]);
                        request.barcode = result[3];
                        this.getProducts(request, this.orderType);
                        this.toasterService.success("Form Verileri Güncellendi");
                        return [2 /*return*/];
                    case 3:
                        _request = new product_service_1.BarcodeSearch_RM(request.barcode);
                        return [4 /*yield*/, this.productService.searchProduct(_request)];
                    case 4:
                        response = _d.sent();
                        if (!(response.length == 0)) return [3 /*break*/, 6];
                        this.toasterService.error("Ürün Sorgusundan Yanıt Alınamadı");
                        return [4 /*yield*/, this.getsuggestedProducts(_request.barcode, true)];
                    case 5:
                        _d.sent();
                        this.getProductsForm.get('barcode').setValue(null);
                        return [2 /*return*/];
                    case 6:
                        this.products = response;
                        if (!(this.products.length > 0)) return [3 /*break*/, 14];
                        this.products.forEach(function (p) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!(p.quantity <= 0)) return [3 /*break*/, 2];
                                        this.toasterService.error("STOK HATASI");
                                        this.products = [];
                                        this.getProductsForm.get('barcode').setValue(null);
                                        return [4 /*yield*/, this.getsuggestedProducts(_request.barcode, true)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                    case 2: return [2 /*return*/];
                                }
                            });
                        }); });
                        totalQuantity = 0;
                        this.selectedProducts.forEach(function (product) {
                            if (product.barcode === _this.products[0].barcode) {
                                totalQuantity += product.quantity;
                            }
                        });
                        if (!(totalQuantity >= this.products[0].quantity)) return [3 /*break*/, 8];
                        this.toasterService.error("STOK HATASI");
                        this.products = [];
                        this.getProductsForm.get('barcode').setValue(null);
                        return [4 /*yield*/, this.getsuggestedProducts(_request.barcode, true)];
                    case 7:
                        _d.sent();
                        return [2 /*return*/];
                    case 8:
                        this.toasterService.success(this.products.length + " Adet Ürün Bulundu");
                        _i = 0, _a = this.products;
                        _d.label = 9;
                    case 9:
                        if (!(_i < _a.length)) return [3 /*break*/, 12];
                        _product = _a[_i];
                        // if (this.products.length > 1) {
                        //   _product.description += ` (SK: ${request.barcode})`;
                        // }
                        return [4 /*yield*/, this.addCurrentProducts(_product)];
                    case 10:
                        // if (this.products.length > 1) {
                        //   _product.description += ` (SK: ${request.barcode})`;
                        // }
                        _d.sent();
                        _d.label = 11;
                    case 11:
                        _i++;
                        return [3 /*break*/, 9];
                    case 12:
                        this.getProductsForm.get('barcode').setValue(null);
                        this.products = [];
                        _d.label = 13;
                    case 13: return [3 /*break*/, 15];
                    case 14:
                        this.toasterService.error("Ürün Bulunamadı");
                        _d.label = 15;
                    case 15:
                        this.getProductsForm.get('barcode').setValue(null);
                        return [2 /*return*/, response];
                    case 16:
                        error_5 = _d.sent();
                        return [2 /*return*/, null];
                    case 17: return [3 /*break*/, 36];
                    case 18:
                        if (!!request.shelfNo) return [3 /*break*/, 22];
                        if (!(request.barcode.includes('http') || this.generalService.isGuid(request.barcode))) return [3 /*break*/, 20];
                        return [4 /*yield*/, this.productService.countProductByBarcode3(request.barcode)];
                    case 19:
                        result = _d.sent();
                        if (result == null) {
                            this.toasterService.error("Qr Sorgusu Hatalı");
                            this.getProductsForm.get('barcode').setValue(null);
                            return [2 /*return*/];
                        }
                        this.getProductsForm.get('barcode').setValue(result[3]);
                        request.barcode = result[3];
                        this.toasterService.success("Form Verileri Güncellendi");
                        _d.label = 20;
                    case 20: return [4 /*yield*/, this.productService.countProductByBarcode(request.barcode)];
                    case 21:
                        result = _d.sent();
                        this.shelfNumbers += result[0];
                        this.generalService.focusNextInput('shelfNo');
                        this.toasterService.info("Raf Numarası Giriniz");
                        return [2 /*return*/];
                    case 22:
                        if (!(request.barcode.includes('http') || this.generalService.isGuid(request.barcode))) return [3 /*break*/, 24];
                        return [4 /*yield*/, this.productService.countProductByBarcode3(request.barcode)];
                    case 23:
                        result = _d.sent();
                        if (result == null) {
                            this.toasterService.error("Qr Sorgusu Hatalı");
                            return [2 /*return*/];
                        }
                        this.getProductsForm.get('barcode').setValue(result[3]);
                        this.getProductsForm.get('barcode').setValue(null);
                        return [2 /*return*/];
                    case 24: return [4 /*yield*/, this.warehouseService.countProductRequest(request.barcode, request.shelfNo, 1, '', '', '', 'Order/CountProductControl', this.orderNo, '')];
                    case 25:
                        check_response = _d.sent();
                        if (!(check_response != undefined)) return [3 /*break*/, 36];
                        data = check_response;
                        if (data.status != 'RAF') {
                            this.getProductsForm.get('barcode').setValue(check_response.description);
                        }
                        return [4 /*yield*/, this.productService.searchProduct3(check_response.description, check_response.batchCode, this.getProductsForm.value.shelfNo)];
                    case 26:
                        response = _d.sent();
                        if (!(response.length == 0)) return [3 /*break*/, 28];
                        this.toasterService.error("Ürün Sorgusundan Yanıt Alınamadı");
                        return [4 /*yield*/, this.getsuggestedProducts(_request.barcode, true)];
                    case 27:
                        _d.sent();
                        this.getProductsForm.get('barcode').setValue(null);
                        return [2 /*return*/];
                    case 28:
                        this.products = response;
                        if (!(this.products.length > 0)) return [3 /*break*/, 35];
                        this.products.forEach(function (p) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!(p.quantity <= 0)) return [3 /*break*/, 2];
                                        this.toasterService.error("STOK HATASI");
                                        this.products = [];
                                        this.getProductsForm.get('barcode').setValue(null);
                                        return [4 /*yield*/, this.getsuggestedProducts(_request.barcode, true)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                    case 2: return [2 /*return*/];
                                }
                            });
                        }); });
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
                        if (!(totalQuantity >= this.products[0].quantity)) return [3 /*break*/, 30];
                        this.toasterService.error("STOK HATASI");
                        this.products = [];
                        this.getProductsForm.get('barcode').setValue(null);
                        return [4 /*yield*/, this.getsuggestedProducts(_request.barcode, true)];
                    case 29:
                        _d.sent();
                        return [2 /*return*/];
                    case 30:
                        this.getProductsForm.get('barcode').setValue(null);
                        this.getProductsForm.get('shelfNo').setValue(null);
                        _b = 0, _c = this.products;
                        _d.label = 31;
                    case 31:
                        if (!(_b < _c.length)) return [3 /*break*/, 34];
                        _product = _c[_b];
                        // if (this.products.length > 1) {
                        //   _product.description += ` (SK: ${request.barcode})`;
                        // }
                        return [4 /*yield*/, this.addCurrentProducts(_product)];
                    case 32:
                        // if (this.products.length > 1) {
                        //   _product.description += ` (SK: ${request.barcode})`;
                        // }
                        _d.sent();
                        _d.label = 33;
                    case 33:
                        _b++;
                        return [3 /*break*/, 31];
                    case 34:
                        this.focusNextInput('barcode_product');
                        this.getProductsForm.get('barcode').setValue(null);
                        this.products = [];
                        this.shelfNumbers = 'RAFLAR:';
                        _d.label = 35;
                    case 35: return [2 /*return*/, response];
                    case 36: return [2 /*return*/];
                }
            });
        });
    };
    CreateOrderComponent.prototype.routeGetProduct = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.getProductsForm.get('barcode').setValue(request);
                        return [4 /*yield*/, this.getProducts(this.getProductsForm.value, this.orderType)
                            // this.suggestedProductsDialog = false;
                        ];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateOrderComponent.prototype.getsuggestedProducts = function (itemCode, openDialog) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.generalService.isNullOrEmpty(itemCode)) return [3 /*break*/, 2];
                        this.suggestedProducts = [];
                        return [4 /*yield*/, this.orderService.getSuggestedProducts(itemCode)];
                    case 1:
                        response = _a.sent();
                        this.suggestedProducts = response;
                        if (openDialog) {
                            this.openDialog("suggestedProductsDialog");
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        this.toasterService.error("Barkod Giriniz");
                        _a.label = 3;
                    case 3: return [2 /*return*/];
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
                        //this.generalService.beep()()
                        return [4 /*yield*/, this.getClientOrder(1)];
                    case 3:
                        //this.generalService.beep()()
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
    CreateOrderComponent.prototype.deleteAllPRoduct = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (confirm("Tüm Ürünleri Silmek İstediğinize Emin Misiniz?")) {
                    this.selectedProducts.forEach(function (p) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.deleteProduct(p)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                }
                return [2 /*return*/];
            });
        });
    };
    CreateOrderComponent.prototype.deleteProduct = function (product) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.orderService.deleteClientOrderBasketItem(this.id, product.lineId)];
                    case 1:
                        response = _a.sent();
                        if (!response) return [3 /*break*/, 3];
                        this.toasterService.success("Ürün Silindi");
                        return [4 /*yield*/, this.getClientOrder(1)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CreateOrderComponent.prototype.onRowEditInit = function (product) {
        // this.clonedProducts[product.lineId as string] = { ...product };
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
                        return [4 /*yield*/, this.orderService.updateClientOrderBasketItem(product)];
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
    CreateOrderComponent.prototype.selectQuantity = function (product, index, quantity) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // this.toasterService.success(product.quantity.toString());
                        product.quantity = quantity;
                        return [4 /*yield*/, this.orderService.updateClientOrderBasketItem(product)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            this.toasterService.success("Ürün Güncellendi");
                            this.focusNextInput('barcode_product');
                            this.resetDiscount();
                            this.getClientOrder(1);
                        }
                        this.closeDialog(index);
                        this.updateProductDialog = false;
                        delete this.clonedProducts[product.lineId];
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateOrderComponent.prototype.onRowEditSave = function (product, index) {
        return __awaiter(this, void 0, void 0, function () {
            var findedProduct, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        product.discountedPrice = this.updateProductForm.get('discountedPrice').value;
                        product.quantity = this.updateProductForm.get('quantity').value;
                        product.discountRate1 = this.updateProductForm.get('discountRate1').value; //yüzde
                        product.discountRate2 = this.updateProductForm.get('discountRate2').value;
                        product.totalPrice =
                            product.quantity *
                                ((product.discountedPrice * ((100 - product.discountRate1) / 100)) - product.discountRate2);
                        product.totalTaxedPrice =
                            product.quantity *
                                (((product.discountedPrice * (1 + (product.taxRate / 100))) * ((100 - product.discountRate1) / 100)) - product.discountRate2);
                        this.quantityList = [];
                        if (!(product.price > 0)) return [3 /*break*/, 4];
                        findedProduct = this.selectedProducts
                            .find(function (p) { return p.itemCode == product.itemCode; });
                        this.quantityList.push((Number(product.uD_Stock) + Number(product.mD_Stock)));
                        this.quantityList.push(product.quantity);
                        if (!(Number(findedProduct.quantity) > (Number(product.uD_Stock) + Number(product.mD_Stock)))) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getsuggestedProducts(product.itemCode, false)];
                    case 1:
                        _a.sent();
                        this.visibleDialogs[index] = true;
                        // Sadece ilgili ri için dialog'u açar
                        // this.openDialog('quantityListDialog');
                        return [2 /*return*/];
                    case 2: return [4 /*yield*/, this.orderService.updateClientOrderBasketItem(product)];
                    case 3:
                        response = _a.sent();
                        if (response) {
                            this.toasterService.success("Ürün Güncellendi");
                            this.focusNextInput('barcode_product');
                            this.getClientOrder(1);
                        }
                        delete this.clonedProducts[product.lineId];
                        _a.label = 4;
                    case 4:
                        this.updateProductDialog = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateOrderComponent.prototype.onRowEditCancel = function (product, index) {
        this.products[index] = this.clonedProducts[product.lineId];
        delete this.clonedProducts[product.lineId];
    };
    CreateOrderComponent.prototype.focusNextInput = function (nextInputId) {
        var nextInput = document.getElementById(nextInputId);
        if (nextInput) {
            nextInput.focus();
        }
    }; //general service
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
    CreateOrderComponent.prototype.createPaymentForm = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.paymentForm = this.formBuilder.group({
                    taxTypeCode: [null, forms_1.Validators.required],
                    paymentType: [null, forms_1.Validators.required],
                    orderDescription: [null]
                });
                this.paymentForm.get('taxTypeCode').valueChanges.subscribe(function (value) {
                    if (value != null) {
                        // this.toasterService.success(value.label)
                    }
                });
                this.paymentForm.get('paymentType').valueChanges.subscribe(function (value) {
                    if (value != null) {
                        _this.createPayment(value.id);
                        // this.toasterService.success(value.name)
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    CreateOrderComponent.prototype.createCargoForm_2 = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.cargoForm_2 = this.formBuilder.group({
                    address_recepient_name: [null],
                    address_phoneNumber: [null]
                });
                return [2 /*return*/];
            });
        });
    };
    CreateOrderComponent.prototype.goBack = function () {
        this.showCargo2 = false;
    };
    CreateOrderComponent.prototype.showCargoForm = function (state) {
        if (state === false) {
            this.activeIndex = 3;
            this.toasterService.success("Kargo Bilgileri Güncellendi");
        }
        else {
            this.showCargo2 = true;
        }
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
    CreateOrderComponent.prototype.updateClientOrderCancelStatus = function (id, status) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        status = status == null ? false : status;
                        return [4 /*yield*/, this.orderService.updateClientOrderCancelStatus(id, status)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            this.toasterService.success("Sipariş İptal Edildi");
                            this.getClientOrder(0);
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
        if (this.orderType == true) {
            return "MSG-" + result;
        }
        else {
            return "MSG-P-" + result;
        }
    };
    CreateOrderComponent.prototype.createPayment = function (state) {
        return __awaiter(this, void 0, Promise, function () {
            var payment, response, response, response, response, response, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.activeIndex = 6;
                        payment = new nebimOrder_1.Payment();
                        if (!(state === 1)) return [3 /*break*/, 5];
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
                        return [2 /*return*/, true];
                    case 3: return [2 /*return*/, false];
                    case 4: return [3 /*break*/, 17];
                    case 5:
                        if (!(state === 2)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.orderService.updateClientOrderPayment(this.id, "NAKİT")];
                    case 6:
                        response = _a.sent();
                        if (response) {
                            payment.currencyCode = "TRY";
                            payment.code = "";
                            payment.installmentCount = 0;
                            payment.paymentType = "2";
                            payment.creditCardTypeCode = "NAKİT";
                            payment.amount = this.selectedProducts.reduce(function (total, product) { return total + product.price; }, 0);
                            this.payment = payment;
                            return [2 /*return*/, this["true"]];
                        }
                        else {
                            return [2 /*return*/, false];
                        }
                        return [3 /*break*/, 17];
                    case 7:
                        if (!(state === 3)) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.orderService.updateClientOrderPayment(this.id, "HAVALE")];
                    case 8:
                        response = _a.sent();
                        if (response) {
                            payment.currencyCode = "TRY";
                            payment.code = "";
                            payment.installmentCount = 0;
                            payment.paymentType = "2";
                            payment.creditCardTypeCode = "HAVALE";
                            payment.amount = this.selectedProducts.reduce(function (total, product) { return total + product.price; }, 0);
                            this.payment = payment;
                            return [2 /*return*/, this["true"]];
                        }
                        else {
                            return [2 /*return*/, false];
                        }
                        return [3 /*break*/, 17];
                    case 9:
                        if (!(state === 4)) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.orderService.updateClientOrderPayment(this.id, "VADE")];
                    case 10:
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
                        else {
                            return [2 /*return*/, false];
                        }
                        return [3 /*break*/, 17];
                    case 11:
                        if (!(state === 5)) return [3 /*break*/, 13];
                        return [4 /*yield*/, this.orderService.updateClientOrderPayment(this.id, "POS")];
                    case 12:
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
                        else {
                            return [2 /*return*/, false];
                        }
                        return [3 /*break*/, 17];
                    case 13:
                        if (!(state === 6)) return [3 /*break*/, 17];
                        return [4 /*yield*/, this.orderService.updateClientOrderPayment(this.id, "PAYTRSMS")];
                    case 14:
                        response = _a.sent();
                        if (!response) return [3 /*break*/, 16];
                        return [4 /*yield*/, this.sendPaymentPage()];
                    case 15:
                        _a.sent();
                        payment.currencyCode = "TRY";
                        payment.code = "";
                        payment.installmentCount = 0;
                        payment.paymentType = "2";
                        payment.creditCardTypeCode = "PAYTRSMS";
                        payment.amount = this.selectedProducts.reduce(function (total, product) { return total + product.price; }, 0);
                        this.payment = payment;
                        return [3 /*break*/, 17];
                    case 16: return [2 /*return*/, false];
                    case 17:
                        this.payment = payment;
                        //this.generalService.beep()();
                        // this.toasterService.success("Ödeme Onaylandı")
                        return [2 /*return*/, true];
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
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function () {
            var payment_response, formValue, exchangeRate, order_request, order_response, addedOrderNumber, batchSize, totalProducts, batchStart, batchEnd, productBatch, _request, response, addedOrder, batchSize, totalProducts, batchStart, batchEnd, productBatch, _request, response, _batchSize, _totalProducts, _batchStart, invoiceNumber, _batchEnd, _productBatch, __request, __response, addedOrder;
            var _this = this;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!!this.payment.creditCardTypeCode) return [3 /*break*/, 2];
                        if (!this.paymentForm.get("paymentType").value) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.createPayment(this.paymentForm.get("paymentType").value.id)];
                    case 1:
                        payment_response = _e.sent();
                        if (!payment_response) {
                            this.toasterService.error("Ödeme Tipi Seçiniz");
                            return [2 /*return*/];
                        }
                        _e.label = 2;
                    case 2:
                        if (!((_a = this.paymentForm.value.taxTypeCode) === null || _a === void 0 ? void 0 : _a.value)) {
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
                        order_request = this.createClientOrder_RM();
                        return [4 /*yield*/, this.orderService.createClientOrder(order_request)
                            // var discountPercent: number = this.calculateDiscountPercent(this.selectedProducts);
                        ]; //son sipariş güncellendi
                    case 3:
                        order_response = _e.sent() //son sipariş güncellendi
                        ;
                        addedOrderNumber = null;
                        if (!this.orderType) return [3 /*break*/, 9];
                        batchSize = 50;
                        totalProducts = this.selectedProducts.length;
                        batchStart = 0;
                        _e.label = 4;
                    case 4:
                        if (!(batchStart < totalProducts)) return [3 /*break*/, 6];
                        batchEnd = Math.min(batchStart + batchSize, totalProducts);
                        productBatch = this.selectedProducts.slice(batchStart, batchEnd);
                        _request = new nebimOrder_1.NebimOrder((addedOrderNumber != undefined || addedOrderNumber != null) ? addedOrderNumber : null, exchangeRate, this.discountRate1, this.discountRate2, this.paymentForm.get('orderDescription').value, this.currAccCode, this.orderNo, formValue, // Ensure this variable supports being split if necessary
                        productBatch, this.salesPersonCode, this.paymentForm.value.taxTypeCode.value, (_b = this.selectedSubCustomers[0]) === null || _b === void 0 ? void 0 : _b.subCurrAccId);
                        return [4 /*yield*/, this.orderService.createOrder(_request)];
                    case 5:
                        response = _e.sent();
                        this.orderNumber = response.orderNumber;
                        addedOrderNumber = response.orderNumber;
                        // Update the start index for the next batch
                        batchStart += batchSize;
                        return [3 /*break*/, 4];
                    case 6:
                        if (!(response && response.status === true)) return [3 /*break*/, 8];
                        addedOrderNumber = response.orderNumber;
                        return [4 /*yield*/, this.orderService.getOrderDetail(this.orderNumber)];
                    case 7:
                        addedOrder = _e.sent();
                        if (addedOrder.orderNumber) {
                            this.sendInvoiceToPrinter(addedOrder.orderNumber);
                        }
                        this.generalService.waitAndNavigate("Sipariş Oluşturuldu", "unfinished-orders");
                        _e.label = 8;
                    case 8: return [3 /*break*/, 17];
                    case 9:
                        batchSize = 50;
                        totalProducts = this.selectedProducts.length;
                        batchStart = 0;
                        _e.label = 10;
                    case 10:
                        if (!(batchStart < totalProducts)) return [3 /*break*/, 12];
                        batchEnd = Math.min(batchStart + batchSize, totalProducts);
                        productBatch = this.selectedProducts.slice(batchStart, batchEnd);
                        _request = new nebimOrder_1.NebimOrder((addedOrderNumber != undefined || addedOrderNumber != null) ? addedOrderNumber : null, exchangeRate, this.discountRate1, this.discountRate2, this.cargoForm_2.get("address_recepient_name").value, this.currAccCode, this.orderNo, formValue, // Ensure this variable supports being split if necessary
                        productBatch, this.salesPersonCode, this.paymentForm.value.taxTypeCode.value, (_c = this.selectedSubCustomers[0]) === null || _c === void 0 ? void 0 : _c.subCurrAccId);
                        return [4 /*yield*/, this.orderService.createOrder(_request)];
                    case 11:
                        response = _e.sent();
                        addedOrderNumber = response.orderNumber;
                        this.orderNumber = response.orderNumber;
                        // Update the start index for the next batch
                        batchStart += batchSize;
                        return [3 /*break*/, 10];
                    case 12:
                        if (response && response.status === true) {
                            addedOrderNumber = response.orderNumber;
                        }
                        _batchSize = 50;
                        _totalProducts = this.selectedProducts.length;
                        _batchStart = 0;
                        invoiceNumber = "";
                        _e.label = 13;
                    case 13:
                        if (!(_batchStart < _totalProducts)) return [3 /*break*/, 15];
                        _batchEnd = Math.min(_batchStart + _batchSize, totalProducts);
                        _productBatch = this.selectedProducts.slice(_batchStart, _batchEnd);
                        __request = new nebimOrder_1.NebimInvoice(this.discountRate1, this.discountRate2, exchangeRate, this.selectedCustomers[0].docCurrencyCode, this.cargoForm_2.get("address_recepient_name").value, this.currAccCode, this.orderNo, formValue, _productBatch, this.salesPersonCode, this.paymentForm.value.taxTypeCode.value, this.selectedAddresses[0].postalAddressID, (_d = this.selectedSubCustomers[0]) === null || _d === void 0 ? void 0 : _d.subCurrAccId, invoiceNumber);
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
                    case 14:
                        __response = _e.sent();
                        if (__response.status) {
                            invoiceNumber = __response.invoiceNumber;
                        }
                        else {
                            this.toasterService.error("Faturalaştırma Sırasında Hata Alındı");
                            return [3 /*break*/, 15];
                        }
                        _batchStart += _batchSize;
                        return [3 /*break*/, 13];
                    case 15:
                        if (!__response) return [3 /*break*/, 17];
                        return [4 /*yield*/, this.orderService.getOrderDetail(this.orderNumber)];
                    case 16:
                        addedOrder = _e.sent();
                        if (addedOrder.orderNumber) {
                            this.sendInvoiceToPrinter(addedOrder.orderNumber);
                        }
                        this.generalService.waitAndNavigate("Sipariş Oluşturuldu & Faturalaştırıdı", "orders-managament/1/1");
                        _e.label = 17;
                    case 17: return [2 /*return*/];
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
    CreateOrderComponent.prototype.closeDialog = function (ri) {
        this.visibleDialogs[ri] = false; // Dialog'u kapatır
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
        core_1.ViewChild('subCurrAccDescription_dropdown')
    ], CreateOrderComponent.prototype, "dropdown_3");
    __decorate([
        core_1.ViewChild('currAccDescription_dropdown')
    ], CreateOrderComponent.prototype, "dropdown");
    __decorate([
        core_1.ViewChild('phoneNumber_dropdown')
    ], CreateOrderComponent.prototype, "dropdown_2");
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
