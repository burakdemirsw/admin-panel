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
exports.CreateSaleOrderComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var createPurchaseInvoice_1 = require("src/app/models/model/invoice/createPurchaseInvoice");
var CreateSaleOrderComponent = /** @class */ (function () {
    function CreateSaleOrderComponent(formBuilder, toasterService, orderService, productService, warehouseService, generalService, activatedRoute, headerService) {
        this.formBuilder = formBuilder;
        this.toasterService = toasterService;
        this.orderService = orderService;
        this.productService = productService;
        this.warehouseService = warehouseService;
        this.generalService = generalService;
        this.activatedRoute = activatedRoute;
        this.headerService = headerService;
        this.visible2 = false;
        this.shelfNumbers = 'RAFLAR:';
        this.salesPersonModels = [];
        this.salesPersonModelList = [];
        this.customerList2 = [];
        this.customerList = [];
        this.officeModels = [];
        this.warehouseModels = [];
        this.visible = false;
        this.infoProducts = [];
        this.taxTypeCodeList = [{ name: 'Vergili', code: '0' }, { name: 'Vergisiz', code: '4' }]; //vergi tipi
        this.updateProductDialog = false;
        this.currentDiscountRate = 0;
        this.currentCashdiscountRate = 0;
        this.processCodes = ["WS", "BP", "R", "ws", "bp", "r"];
        this.invoiceProducts = [];
        this.activeIndex = 0;
        this.offices = [];
        this.warehouses = [];
    }
    CreateSaleOrderComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.activatedRoute.params.subscribe(function (params) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!this.processCodes.includes(params["processCode"])) return [3 /*break*/, 13];
                                this.processCode = params["processCode"].toUpperCase();
                                if (!(this.processCode == "R")) return [3 /*break*/, 6];
                                this.headerService.updatePageTitle('Satış Faturası (R)');
                                this.product_formGenerator();
                                this.ws_formGenerator();
                                return [4 /*yield*/, this.getWarehouseAndOffices()];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, this.getCustomerList('4')];
                            case 2:
                                _a.sent(); //Perakende Müşterileri Çeker
                                this.createDiscountForm();
                                this.createUpdateProductForm();
                                if (!params['processId']) return [3 /*break*/, 5];
                                this.newOrderNumber = params['processId'];
                                return [4 /*yield*/, this.getInvoiceProcess()];
                            case 3:
                                _a.sent();
                                if (!this.invoiceProcess) return [3 /*break*/, 5];
                                return [4 /*yield*/, this.getProductOfInvoice()];
                            case 4:
                                _a.sent();
                                _a.label = 5;
                            case 5:
                                this.activeIndex = Number(params['activeIndex']);
                                return [3 /*break*/, 12];
                            case 6:
                                if (!(this.processCode == "BP")) return [3 /*break*/, 12];
                                this.headerService.updatePageTitle('Alış Faturası (BP)');
                                this.product_formGenerator();
                                this.bp_formGenerator();
                                return [4 /*yield*/, this.getWarehouseAndOffices()];
                            case 7:
                                _a.sent();
                                return [4 /*yield*/, this.getCustomerList('1')];
                            case 8:
                                _a.sent(); //Tedarikçileri Çeker
                                this.createDiscountForm();
                                this.createUpdateProductForm();
                                if (!params['processId']) return [3 /*break*/, 11];
                                this.newOrderNumber = params['processId'];
                                return [4 /*yield*/, this.getInvoiceProcess()];
                            case 9:
                                _a.sent();
                                if (!this.invoiceProcess) return [3 /*break*/, 11];
                                return [4 /*yield*/, this.getProductOfInvoice()];
                            case 10:
                                _a.sent();
                                _a.label = 11;
                            case 11:
                                this.activeIndex = Number(params['activeIndex']);
                                _a.label = 12;
                            case 12: return [3 /*break*/, 14];
                            case 13:
                                location.href = "/dashboard";
                                _a.label = 14;
                            case 14: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    CreateSaleOrderComponent.prototype.getTotalQuantity = function () {
        return this.invoiceProducts.reduce(function (sum, product) { return sum + product.quantity; }, 0);
    };
    CreateSaleOrderComponent.prototype.getTotalPrice = function () {
        return this.invoiceProducts.reduce(function (sum, product) { return sum + (product.quantity * product.price); }, 0);
    };
    CreateSaleOrderComponent.prototype.getTotalTaxedPrice = function () {
        return this.invoiceProducts.reduce(function (sum, product) { return sum + (product.quantity * product.priceVI); }, 0);
    };
    CreateSaleOrderComponent.prototype.openUpdateDialog = function (product) {
        this.selectedProduct = product;
        this.updateProductForm.get('price').setValue(this.selectedProduct.price);
        this.updateProductForm.get('priceVI').setValue(this.selectedProduct.priceVI);
        this.updateProductForm.get('quantity').setValue(this.selectedProduct.quantity);
        // this.updateProductForm.get('discountRate1').setValue(this.selectedProduct.discountRate1)
        // this.updateProductForm.get('discountRate2').setValue(this.selectedProduct.discountRate2)
        this.updateProductDialog = true;
    };
    CreateSaleOrderComponent.prototype.createUpdateProductForm = function () {
        var _this = this;
        this.updateProductForm = this.formBuilder.group({
            price: [null, forms_1.Validators.required],
            priceVI: [null, forms_1.Validators.required],
            quantity: [null, forms_1.Validators.required],
            discountRate1: [null, forms_1.Validators.required],
            discountRate2: [null, forms_1.Validators.required]
        });
        // price değiştiğinde priceVI değerini güncelle
        this.updateProductForm.get('price').valueChanges.subscribe(function (value) {
            if (value !== null) {
                var taxRate = _this.selectedProduct.taxRate / 100;
                var priceVI = parseFloat((value * (1 + taxRate)).toFixed(2));
                _this.updateProductForm.get('priceVI').setValue(priceVI, { emitEvent: false });
            }
        });
        // priceVI değiştiğinde price değerini güncelle
        this.updateProductForm.get('priceVI').valueChanges.subscribe(function (value) {
            if (value !== null) {
                var taxRate = _this.selectedProduct.taxRate / 100;
                var price = parseFloat((value / (1 + taxRate)).toFixed(2));
                _this.updateProductForm.get('price').setValue(price, { emitEvent: false });
            }
        });
    };
    CreateSaleOrderComponent.prototype.createDiscountForm = function () {
        this.discountForm = this.formBuilder.group({
            cashDiscountRate: [null, forms_1.Validators.required],
            percentDiscountRate: [null, forms_1.Validators.required]
        });
    };
    CreateSaleOrderComponent.prototype.discount = function (discountAmount) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(discountAmount >= 0 && discountAmount <= 100)) return [3 /*break*/, 2];
                        this.invoiceProcess.discountRate1 = discountAmount;
                        return [4 /*yield*/, this.orderService.editInvoiceProcess(this.invoiceProcess)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            this.invoiceProcess = response;
                            this.getFinalTotalPrice2();
                            this.toasterService.success('Güncellendi');
                            this.generalService.beep();
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
    CreateSaleOrderComponent.prototype.cashDiscount = function (discountAmount) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.invoiceProcess.discountRate2 = discountAmount;
                        return [4 /*yield*/, this.orderService.editInvoiceProcess(this.invoiceProcess)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            this.invoiceProcess = response;
                            // await this.getProposalProducts();
                            this.getFinalTotalPrice2();
                            this.toasterService.success('Güncellendi');
                            this.generalService.beep();
                        }
                        else {
                            this.toasterService.error('Güncellenmedi');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateSaleOrderComponent.prototype.resetDiscount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.invoiceProcess.discountRate2 = 0;
                        this.invoiceProcess.discountRate1 = 0;
                        return [4 /*yield*/, this.orderService.editInvoiceProcess(this.invoiceProcess)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            this.invoiceProcess = response;
                            this.getFinalTotalPrice2();
                            this.toasterService.success('Güncellendi');
                            this.generalService.beep();
                        }
                        else {
                            this.toasterService.error('Güncellenmedi');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateSaleOrderComponent.prototype.getFinalTotalPrice = function () {
        var _a;
        var number = (_a = this.invoiceProducts) === null || _a === void 0 ? void 0 : _a.reduce(function (acc, product) { return acc + product.quantity * (product.price); }, 0);
        if (number.toString().includes('.')) {
            return Number(number.toString().split('.')[0]);
        }
        else {
            return number;
        }
    };
    //dip iskonto uygulandıktan sonraki fiyatı çeker
    CreateSaleOrderComponent.prototype.getFinalTotalPrice2 = function () {
        var _a, _b, _c;
        var p = (_a = this.invoiceProducts) === null || _a === void 0 ? void 0 : _a.reduce(function (acc, product) { return acc + product.quantity * (product.priceVI); }, 0);
        p = (p * ((100 - ((_b = this.invoiceProcess) === null || _b === void 0 ? void 0 : _b.discountRate1)) / 100)) - ((_c = this.invoiceProcess) === null || _c === void 0 ? void 0 : _c.discountRate2);
        return p;
    };
    CreateSaleOrderComponent.prototype.getTotalTax = function () {
        var _a;
        return (_a = this.invoiceProducts) === null || _a === void 0 ? void 0 : _a.reduce(function (acc, product) {
            var productTotalWithoutTax = product.quantity * product.priceVI / (1 + (product.taxRate / 100));
            var productTax = (product.quantity * product.priceVI) - productTotalWithoutTax;
            return acc + productTax;
        }, 0);
    };
    CreateSaleOrderComponent.prototype.getTotal = function () {
        var _a;
        return (_a = this.invoiceProducts) === null || _a === void 0 ? void 0 : _a.reduce(function (acc, product) { return acc + (product.quantity * product.price); }, 0);
    };
    CreateSaleOrderComponent.prototype.logger = function (e) {
        console.log(e);
        this.activeIndex = e.index;
    };
    CreateSaleOrderComponent.prototype.getInvoiceProcess = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.orderService.getInvoiceProcessList(this.newOrderNumber)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            this.invoiceProcess = response[0];
                            this.setFormValueFromProcess(this.invoiceProcess);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateSaleOrderComponent.prototype.getWarehouseAndOffices = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, officeSet, warehouseSet;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.warehouseService.getWarehouseAndOffices()];
                    case 1:
                        response = _a.sent();
                        this.warehouseModels = response;
                        officeSet = new Set();
                        warehouseSet = new Set();
                        this.warehouseModels.forEach(function (model) {
                            officeSet.add(model.officeCode);
                            warehouseSet.add(model.warehouseCode);
                        });
                        this.offices = Array.from(officeSet);
                        this.warehouses = Array.from(warehouseSet).map(function (code) {
                            var model = _this.warehouseModels.find(function (warehouse) { return warehouse.warehouseCode === code; });
                            return {
                                code: model.warehouseCode,
                                name: model.warehouseDescription
                            };
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateSaleOrderComponent.prototype.updateProduct = function (product) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(product);
                        product.price = this.updateProductForm.get('price').value;
                        product.price = ((product.price * ((100 - product.discountRate1) / 100)) - product.discountRate2);
                        product.priceVI = this.updateProductForm.get('priceVI').value;
                        product.priceVI = ((product.priceVI * ((100 - product.discountRate1) / 100)) - product.discountRate2);
                        product.quantity = this.updateProductForm.get('quantity').value;
                        product.discountRate1 = this.updateProductForm.get('discountRate1').value; //yüzde
                        product.discountRate2 = this.updateProductForm.get('discountRate2').value;
                        return [4 /*yield*/, this.orderService.updateCollectedInvoiceProduct(product)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            // this.getTotalPrice2();
                            // await this.getProposalProducts();
                            this.toasterService.success('Güncellendi');
                            this.generalService.beep();
                            this.updateProductDialog = false;
                        }
                        else {
                            this.toasterService.error('Güncellenmedi');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateSaleOrderComponent.prototype.updateInvocieProcess = function (formValue) {
        return __awaiter(this, void 0, void 0, function () {
            var request, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.invoiceProcess) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.addInvocieProcess(formValue)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        request = new createPurchaseInvoice_1.InvoiceProcess();
                        request.id = this.invoiceProcess.id;
                        request.processCode = this.processCode;
                        request.salesPersonCode = null;
                        request.isReturn = formValue.isReturn;
                        request.invoiceNumber = this.invoiceNumber;
                        request.currAccCode = this.processCode == 'R' ? formValue.currAccCode.code : null;
                        request.vendorCode = this.processCode == 'BP' ? formValue.vendorCode.code : null;
                        request.officeCode = formValue.officeCode;
                        request.warehouseCode = formValue.warehouseCode.code;
                        request.taxTypeCode = formValue.taxTypeCode.code;
                        request.isCompleted = false;
                        return [4 /*yield*/, this.orderService.editInvoiceProcess(request)];
                    case 3:
                        response = _a.sent();
                        if (response) {
                            this.responseHandler(true, "Güncellendi");
                            this.setFormValueFromProcess(response);
                            return [2 /*return*/];
                        }
                        else {
                            this.responseHandler(false, "Güncellenmedi");
                            return [2 /*return*/];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateSaleOrderComponent.prototype.addInvocieProcess = function (formValue) {
        return __awaiter(this, void 0, void 0, function () {
            var request, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request = new createPurchaseInvoice_1.InvoiceProcess();
                        request.processCode = this.processCode;
                        request.salesPersonCode = null;
                        request.isReturn = formValue.isReturn;
                        request.invoiceNumber = this.invoiceNumber;
                        request.officeCode = formValue.officeCode;
                        request.currAccCode = this.processCode == 'R' ? formValue.currAccCode.code : null;
                        request.vendorCode = this.processCode == 'BP' ? formValue.vendorCode.code : null;
                        request.warehouseCode = formValue.warehouseCode.code;
                        request.taxTypeCode = formValue.taxTypeCode.code;
                        request.isCompleted = false;
                        return [4 /*yield*/, this.orderService.editInvoiceProcess(request)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            this.responseHandler(true, "Eklendi");
                            this.setFormValueFromProcess(response);
                            return [2 /*return*/];
                        }
                        else {
                            this.responseHandler(false, "Eklenmedi");
                            return [2 /*return*/];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateSaleOrderComponent.prototype.setFormValueFromProcess = function (v) {
        // İlk olarak gerekli değerleri değişkenlere atıyoruz
        var officeCode = v.officeCode;
        var warehouseCode = this.warehouses.find(function (o) { return o.code == v.warehouseCode; });
        var salesPersonCode = this.salesPersonModelList.find(function (o) { return o.code == v.salesPersonCode; });
        var currAccCode = this.customerList2.find(function (o) { return o.code == v.currAccCode; });
        var vendorCode = this.customerList2.find(function (o) { return o.code == v.vendorCode; });
        var taxTypeCode = this.taxTypeCodeList.find(function (o) { return o.code == v.taxTypeCode; });
        var isReturn = v.isReturn;
        // Sonra bu değerleri forma atıyoruz
        this.invoiceForm.get('officeCode').setValue(officeCode);
        this.invoiceForm.get('warehouseCode').setValue(warehouseCode);
        this.invoiceForm.get('salesPersonCode').setValue(salesPersonCode);
        this.selectedCustomer = currAccCode;
        if (this.processCode == 'R') {
            this.invoiceForm.get('currAccCode').setValue(currAccCode);
        }
        else {
            this.invoiceForm.get('vendorCode').setValue(vendorCode);
        }
        this.invoiceForm.get('taxTypeCode').setValue(taxTypeCode);
        this.invoiceForm.get('isReturn').setValue(isReturn);
        this.discountForm.get('percentDiscountRate').setValue(v.discountRate1);
        this.discountForm.get('cashDiscountRate').setValue(v.discountRate2);
        // Diğer değerleri set ediyoruz
        this.newOrderNumber = v.id;
        this.invoiceNumber = v.invoiceNumber;
    };
    CreateSaleOrderComponent.prototype.getProductOfInvoice = function () {
        return __awaiter(this, void 0, Promise, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.orderService.getCollectedInvoiceProducts(this.newOrderNumber)];
                    case 1:
                        response = _a.sent();
                        this.invoiceProducts = response;
                        this.infoProducts = [];
                        this.calculateTotalQty();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        this.toasterService.warn(error_1.message);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CreateSaleOrderComponent.prototype.getCustomerList = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var _a, updatedCustomerList;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.warehouseService.getCustomerList(request)];
                    case 1:
                        _a.customerList = _b.sent();
                        updatedCustomerList = new Set(this.customerList.map(function (c) { return ({
                            name: c.currAccDescription,
                            code: c.currAccCode
                        }); }));
                        // updatedCustomerList'i array'e çevirerek customerList2'ye atıyoruz
                        this.customerList2 = Array.from(updatedCustomerList);
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateSaleOrderComponent.prototype.getSalesPersonModels = function () {
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
                        return [4 /*yield*/, this.orderService.getSalesPersonModels()];
                    case 2:
                        _a.salesPersonModels = _b.sent();
                        this.salesPersonModels.forEach(function (c) {
                            var color = { name: c.firstLastName, code: c.salespersonCode };
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
    //-----------------------------------------------------
    CreateSaleOrderComponent.prototype.clearShelfNumbers = function () {
        this.productForm.get('shelfNo').setValue(null);
        this.productForm.get('barcode').setValue(null);
        this.productForm.get('quantity').setValue(null);
        this.productForm.get('batchCode').setValue(null);
        if (this.productForm.get('isReturn').value === false) {
            this.focusNextInput('shelfNo');
        }
        else {
            this.focusNextInput('barcode');
        }
        this.shelfNumbers = 'RAFLAR:';
    };
    CreateSaleOrderComponent.prototype.focusNextInput = function (nextInputId) {
        var nextInput = document.getElementById(nextInputId);
        if (nextInput) {
            nextInput.focus();
        }
    };
    CreateSaleOrderComponent.prototype.product_formGenerator = function () {
        this.productForm = this.formBuilder.group({
            shelfNo: [null, [forms_1.Validators.required, forms_1.Validators.maxLength(10)]],
            barcode: [null, [forms_1.Validators.required, forms_1.Validators.minLength(5)]],
            quantity: [null, forms_1.Validators.required],
            batchCode: [null]
        });
    };
    CreateSaleOrderComponent.prototype.ws_formGenerator = function () {
        this.invoiceForm = this.formBuilder.group({
            officeCode: [null],
            warehouseCode: [null],
            currAccCode: [null],
            salesPersonCode: [null],
            isReturn: [false],
            taxTypeCode: [null]
        });
    };
    CreateSaleOrderComponent.prototype.bp_formGenerator = function () {
        this.invoiceForm = this.formBuilder.group({
            officeCode: [null],
            warehouseCode: [null],
            vendorCode: [null],
            salesPersonCode: [null],
            isReturn: [false],
            taxTypeCode: [null]
        });
    };
    CreateSaleOrderComponent.prototype.whichRowIsInvalid = function () {
        this.generalService.whichRowIsInvalid(this.productForm);
    };
    CreateSaleOrderComponent.prototype.clearFormFields = function () {
        // Alanları temizleme
        this.productForm.patchValue({
            barcode: null,
            quantity: null
        });
        this.focusNextInput('barcode');
        this.shelfNumbers = 'RAFLAR:';
    };
    CreateSaleOrderComponent.prototype.deleteOrderProduct = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var confirmDelete, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        confirmDelete = window.confirm('Bu hareketi silmek istediğinizden emin misiniz?');
                        if (!confirmDelete) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.orderService.deleteCollectedInvoiceProduct(id)];
                    case 1:
                        response = _a.sent();
                        if (!response) return [3 /*break*/, 3];
                        this.calculateTotalQty();
                        return [4 /*yield*/, this.getProductOfInvoice()];
                    case 2:
                        _a.sent();
                        this.toasterService.success('Silme İşlemi Başarılı.');
                        return [3 /*break*/, 4];
                    case 3:
                        this.toasterService.error('Silme İşlemi Başarısız.');
                        _a.label = 4;
                    case 4: return [2 /*return*/, response];
                    case 5: return [2 /*return*/, false];
                }
            });
        });
    };
    CreateSaleOrderComponent.prototype.showModal2 = function () {
        if (this.visible2) {
            this.visible2 = false;
        }
        else {
            this.visible2 = true;
        }
    };
    CreateSaleOrderComponent.prototype.createSaleInvoice = function () {
        return __awaiter(this, void 0, Promise, function () {
            var confirmation, data, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        confirmation = window.confirm('İşlem Nebime Aktarılacaktır.Devam Etmek istiyor musunuz?');
                        if (!confirmation) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.orderService.createSaleInvoice(this.invoiceProducts, this.newOrderNumber, this.productForm.get('isReturn').value, this.productForm.get('salesPersonCode').value.code, this.productForm.get('currency').value.code)];
                    case 2:
                        data = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CreateSaleOrderComponent.prototype.setFormValues = function (model) {
        return __awaiter(this, void 0, Promise, function () {
            var result, updated_product, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.productService.getShelvesOfProduct(model.barcode)];
                    case 1:
                        result = _a.sent();
                        this.shelfNumbers = result[0];
                        this.productForm.get('batchCode').setValue(result[2]);
                        this.productForm.get('barcode').setValue(result[3]);
                        this.productForm.get('quantity').setValue(result[1]);
                        updated_product = model;
                        updated_product.quantity = Number(result[1]);
                        updated_product.batchCode = result[2];
                        updated_product.barcode = result[3];
                        return [2 /*return*/, updated_product];
                    case 2:
                        error_5 = _a.sent();
                        this.toasterService.error(error_5.message);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CreateSaleOrderComponent.prototype.onSubmit = function (model) {
        return __awaiter(this, void 0, Promise, function () {
            var updated_product, shelves, product_detail, request, response, product_detail, request, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.invoiceProcess) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.addInvocieProcess(this.productForm.value)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                    case 2:
                        if (!!this.productForm.valid) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.setFormValues(model)];
                    case 3:
                        updated_product = _a.sent();
                        model = updated_product;
                        this.toasterService.error('Form Verileri Güncellendi.');
                        return [2 /*return*/];
                    case 4:
                        if (!this.productForm.valid) return [3 /*break*/, 11];
                        shelves = this.shelfNumbers
                            .split(',')
                            .filter(function (raflar) { return raflar.trim() !== ''; });
                        if (!shelves.find(function (s) { return s.toLowerCase() == model.shelfNo.toLowerCase(); })) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.orderService.getProductDetailByPriceCode(this.processCode, model.barcode)];
                    case 5:
                        product_detail = _a.sent();
                        request = new createPurchaseInvoice_1.CollectedInvoiceProduct();
                        request.barcode = model.barcode;
                        request.quantity = model.quantity;
                        request.shelfNo = model.shelfNo;
                        request.batchCode = model.batchCode;
                        request.processId = this.newOrderNumber;
                        request.itemCode = product_detail.itemCode;
                        request.photoUrl = product_detail.photoUrl;
                        request.price = product_detail.price;
                        request.priceVI = product_detail.priceVI;
                        request.discountRate1 = 0;
                        request.discountRate2 = 0;
                        request.taxRate = product_detail.taxRate;
                        return [4 /*yield*/, this.orderService.addCollectedInvoiceProduct(request)];
                    case 6:
                        response = _a.sent();
                        if (response) {
                            this.responseHandler(true, "Eklendi");
                            this.getProductOfInvoice();
                            return [2 /*return*/];
                        }
                        else {
                            this.responseHandler(false, "Eklenmedi");
                            return [2 /*return*/];
                        }
                        return [3 /*break*/, 11];
                    case 7:
                        if (!confirm('Raf Bulunamadı! Raf Barkod Doğrulaması Yapılmadan Eklensin Mi?')) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.orderService.getProductDetailByPriceCode(this.processCode, model.barcode)];
                    case 8:
                        product_detail = _a.sent();
                        request = new createPurchaseInvoice_1.CollectedInvoiceProduct();
                        request.barcode = model.barcode;
                        request.quantity = model.quantity;
                        request.shelfNo = model.shelfNo;
                        request.batchCode = model.batchCode;
                        request.processId = this.newOrderNumber;
                        request.itemCode = product_detail.itemCode;
                        request.photoUrl = product_detail.photoUrl;
                        request.price = product_detail.price;
                        request.priceVI = product_detail.priceVI;
                        request.discountRate1 = 0;
                        request.discountRate2 = 0;
                        request.taxRate = product_detail.taxRate;
                        return [4 /*yield*/, this.orderService.addCollectedInvoiceProduct(request)];
                    case 9:
                        response = _a.sent();
                        if (response) {
                            this.responseHandler(true, "Eklendi");
                            this.getProductOfInvoice();
                            return [2 /*return*/];
                        }
                        else {
                            this.responseHandler(false, "Eklenmedi");
                            return [2 /*return*/];
                        }
                        return [2 /*return*/];
                    case 10:
                        this.toasterService.error("Form Geçersiz");
                        _a.label = 11;
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    CreateSaleOrderComponent.prototype.responseHandler = function (response, message) {
        if (response == true) {
            this.toasterService.success(message);
            this.generalService.beep();
        }
        else {
            this.toasterService.error(message);
            this.generalService.beep2();
        }
    };
    CreateSaleOrderComponent.prototype.calculateTotalQty = function () {
        //toplanan ürünler yazısı için
        var totalQty = 0;
        this.invoiceProducts.forEach(function (item) {
            totalQty += item.quantity;
        });
        this.totalCount = totalQty;
    };
    CreateSaleOrderComponent = __decorate([
        core_1.Component({
            selector: 'app-create-sale-order',
            templateUrl: './create-sale-order.component.html',
            styleUrls: ['./create-sale-order.component.css']
        })
    ], CreateSaleOrderComponent);
    return CreateSaleOrderComponent;
}());
exports.CreateSaleOrderComponent = CreateSaleOrderComponent;
