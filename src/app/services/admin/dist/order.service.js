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
exports.OrderService = void 0;
var core_1 = require("@angular/core");
var ClientUrls_1 = require("src/app/models/const/ClientUrls");
var orderBillingRequestModel_1 = require("src/app/models/model/invoice/orderBillingRequestModel");
var OrderService = /** @class */ (function () {
    function OrderService(toasterService, httpClientService, router, httpClient) {
        this.toasterService = toasterService;
        this.httpClientService = httpClientService;
        this.router = router;
        this.httpClient = httpClient;
    }
    //satış siparişleri çekme //exec GET_MSRAFOrderList
    OrderService.prototype.getOrders = function (type, invoiceStatus) {
        return __awaiter(this, void 0, Promise, function () {
            var query, response;
            return __generator(this, function (_a) {
                query = type + "/" + invoiceStatus;
                response = this.httpClientService
                    .get({
                    controller: 'order/get-sale-orders'
                }, query)
                    .toPromise();
                return [2 /*return*/, response];
            });
        });
    };
    OrderService.prototype.getMissingOrders = function () {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                response = this.httpClientService
                    .get({
                    controller: 'order/get-orders-with-missing-items'
                })
                    .toPromise();
                return [2 /*return*/, response];
            });
        });
    };
    OrderService.prototype.getPurchaseOrdersByFilter = function (model) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                response = this.httpClientService
                    .post({
                    controller: 'Order/GetPurchaseOrdersByFilter'
                }, model)
                    .toPromise();
                return [2 /*return*/, response];
            });
        });
    };
    //fatura listesini çeker
    OrderService.prototype.getInvoiceList = function () {
        return __awaiter(this, void 0, Promise, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .get({ controller: 'Order/GetInvoiceList' }) //Get_InvoicesList
                            .toPromise()];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                }
            });
        });
    };
    //fatura listesini filtreye göre çeker
    OrderService.prototype.getInvoiceListByFilter = function (model) {
        return __awaiter(this, void 0, Promise, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .post({ controller: 'Order/GetInvoiceListByFilter' }, model)
                            .toPromise()];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                }
            });
        });
    };
    OrderService.prototype.getOrdersByFilter = function (model) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                response = this.httpClientService
                    .post({
                    controller: 'Order/GetOrdersByFilter'
                }, model)
                    .toPromise();
                return [2 /*return*/, response];
            });
        });
    };
    //alış siparişlerini çekme GET_MSRAFSalesOrderDetailBP
    OrderService.prototype.getPurchaseOrders = function () {
        var response = this.httpClientService
            .get({
            controller: 'Order/GetPurchaseOrders'
        })
            .toPromise();
        return response;
    };
    //sipariş ekleme
    OrderService.prototype.addProductToOrder = function (model) {
        var _this = this;
        this.httpClientService
            .post({
            controller: 'Order/Add'
        }, model)
            .subscribe({
            next: function (result) {
                _this.toasterService.success('Success');
                window.location.reload();
            },
            error: function (err) {
                if (err.status === 400) {
                    _this.toasterService.warn(err.error);
                }
                else {
                    _this.toasterService.warn(err.message);
                }
            }
        });
        return true;
    };
    //toplanacak ürünleri çeker
    OrderService.prototype.getCollectedProducts = function (orderNo, orderNoType) {
        var endpoint = '';
        if (orderNoType === 'BP') {
            endpoint = 'Order/GetPurchaseOrderSaleDetail/'; //GET_MSRAFSalesOrderDetailBP
        }
        else if (orderNoType === 'WT') {
            endpoint = 'Warehouse/GetWarehouseOperationDetail/'; //Usp_GETTransferOnayla
        }
        else if (orderNoType === 'WS') {
            endpoint = 'Order/GetOrderSaleDetail/'; //GET_MSRAFSalesOrderDetail
        }
        else if (orderNoType === 'MIS') {
            endpoint = 'Order/get-missing-products-of-order/'; //GET_MSRAFOrderListMissing
        }
        return this.httpClientService.get({
            controller: endpoint + orderNo
        });
    };
    //transferi onaylama
    OrderService.prototype.confirmTransfer = function (operationNumberList) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .post({
                            controller: 'Warehouse/ConfirmOperation'
                        }, operationNumberList)
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        if (response === true) {
                            return [2 /*return*/, true];
                        }
                        else {
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    //faturalaştırma ve yazdırma
    OrderService.prototype.collectAndPack = function (list, orderNo, taxedOrTaxtFree, invoiceOfCustomer) {
        return __awaiter(this, void 0, Promise, function () {
            var model, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        model = new orderBillingRequestModel_1.OrderBillingRequestModel();
                        model.orderNo = orderNo;
                        model.invoiceType = false;
                        model.taxedOrTaxtFree = taxedOrTaxtFree;
                        if (orderNo.includes('WS')) {
                            model.invoiceModel = 4; // satış sipariş faturası
                        }
                        else if (orderNo.includes('BP')) {
                            model.invoiceModel = 2; // alış sipariş faturası -- BP
                            model.eInvoiceNumber = invoiceOfCustomer.eInvoiceNumber;
                            model.invoiceDate = invoiceOfCustomer.invoiceDate;
                        }
                        else if (orderNo.includes('WT')) {
                            return [2 /*return*/, false];
                        }
                        else {
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, this.httpClientService
                                .post({
                                controller: 'Order/CollectAndPack/' + model
                            }, model)
                                .toPromise()];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            if (Boolean(response) == true) {
                                this.toasterService.success('İşlem Başarılı');
                                if (orderNo.includes('WS')) {
                                    return [2 /*return*/, true];
                                }
                                else if (orderNo.includes('BP')) {
                                    this.router.navigate(['/purchase-orders-managament']);
                                }
                                else if (orderNo.includes('WT')) {
                                    this.router.navigate(['/warehouse-operation-list']);
                                }
                                return [2 /*return*/, true];
                            }
                            else {
                                this.toasterService.error('İşlem Başarısız');
                                location.reload();
                                return [2 /*return*/, false];
                            }
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        // console.log(error.message);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/, false];
                }
            });
        });
    };
    OrderService.prototype.getSalesPersonModels = function () {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .get({
                            controller: 'Order/GetSalesPersonModels'
                        })
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    //sipariş numarasına göre transfer yapma
    OrderService.prototype.postModel = function (orderNo) {
        return __awaiter(this, void 0, Promise, function () {
            var innerNumber;
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    //alış fatura oluşturma
    OrderService.prototype.createPurchaseInvoice = function (array, orderNo, isReturn, invoiceType) {
        return __awaiter(this, void 0, Promise, function () {
            var model, data, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        model = new orderBillingRequestModel_1.OrderBillingRequestModel();
                        model.orderNo = orderNo;
                        model.invoiceType = isReturn;
                        model.invoiceModel = invoiceType;
                        return [4 /*yield*/, this.httpClientService
                                .post({
                                controller: 'Order/CollectAndPack/' + model
                            }, model)
                                .toPromise()];
                    case 1:
                        data = _a.sent();
                        if (data) {
                            this.router.navigate(['/orders-management']);
                            this.toasterService.success('Faturalaştırma İşlemi Başarılı');
                            return [2 /*return*/, data];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        this.toasterService.error('An error occurred:' + error_2.message);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrderService.prototype.createSaleInvoice = function (array, orderNo, isReturn, salesPersonCode, currency) {
        return __awaiter(this, void 0, Promise, function () {
            var model, data, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(array.length === 0)) return [3 /*break*/, 1];
                        this.toasterService.warn('Lütfen Ürün EKleyiniz.');
                        return [2 /*return*/];
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        model = new orderBillingRequestModel_1.OrderBillingRequestModel();
                        model.orderNo = orderNo;
                        model.invoiceType = isReturn;
                        model.invoiceModel = 3; //satış faturası
                        model.salesPersonCode = salesPersonCode;
                        model.currency = currency;
                        return [4 /*yield*/, this.httpClientService
                                .post({
                                controller: 'Order/CollectAndPack/' + model
                            }, model)
                                .toPromise()];
                    case 2:
                        data = _a.sent();
                        if (data) {
                            this.router.navigate(['orders-managament']);
                            return [2 /*return*/, data];
                        }
                        else {
                            this.toasterService.error("İşlem Başarısız");
                            return [2 /*return*/, null];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // alış fatura doğrulama
    OrderService.prototype.purchaseInvoiceProductCheck = function (model) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                try {
                    response = this.httpClient
                        .post(ClientUrls_1.ClientUrls.baseUrl +
                        '/Order/CountProductPurchase', model)
                        .toPromise();
                    if (response) {
                        // console.log(response);
                        if (Boolean(response) == true) {
                        }
                        else {
                            location.reload();
                        }
                    }
                    return [2 /*return*/, response];
                }
                catch (error) {
                    this.toasterService.error('An error occurred:' + error.message);
                    return [2 /*return*/, null];
                }
                return [2 /*return*/];
            });
        });
    };
    OrderService.prototype.deleteInvoiceProducts = function (orderNumber) {
        return __awaiter(this, void 0, Promise, function () {
            var result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.httpClientService
                                .get({
                                controller: 'Order/DeleteInvoiceProducts/' + orderNumber
                            })
                                .toPromise()];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 2:
                        error_4 = _a.sent();
                        // console.log(error.message);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrderService.prototype.createOrder = function (order) {
        return __awaiter(this, void 0, Promise, function () {
            var response, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.httpClientService.post({ controller: "order/create-order" }, order).toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2:
                        error_5 = _a.sent();
                        // console.log(error.message);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrderService.prototype.createOrder2 = function (order) {
        return __awaiter(this, void 0, Promise, function () {
            var response, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.httpClientService.post({ controller: "order/create-order-2" }, order).toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2:
                        error_6 = _a.sent();
                        // console.log(error.message);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrderService.prototype.createInvoice = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.httpClientService.post({ controller: "order/create-sale-invoice" }, request).toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2:
                        error_7 = _a.sent();
                        // console.log(error.message);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //onaylanacak ürünleri çekme
    OrderService.prototype.getInventoryItems = function (type) {
        try {
            var response = this.httpClientService
                .get({
                controller: 'Order/InventoryItems/' + type
            })
                .toPromise();
            return response;
        }
        catch (error) {
            // console.log(error.message);
            return null;
        }
    };
    OrderService.prototype.getInventoryFromOrderNumber = function (orderNo) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                try {
                    response = this.httpClientService
                        .get({
                        controller: 'Order/GetInventoryFromOrderNumber/' + orderNo
                    })
                        .toPromise();
                    return [2 /*return*/, response];
                }
                catch (error) {
                    // console.log(error.message);
                    return [2 /*return*/, null];
                }
                return [2 /*return*/];
            });
        });
    };
    OrderService.prototype.setInventoryByOrderNumber = function (orderNo) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                try {
                    response = this.httpClientService
                        .get({
                        controller: 'Order/SetInventoryByOrderNumber/' + orderNo
                    })
                        .toPromise();
                    return [2 /*return*/, response];
                }
                catch (error) {
                    // console.log(error.message);
                    return [2 /*return*/, null];
                }
                return [2 /*return*/];
            });
        });
    };
    OrderService.prototype.addMissingProduct = function (products) {
        return __awaiter(this, void 0, Promise, function () {
            var response, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.httpClientService.post({ controller: "order/add-missing-item" }, products).toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2:
                        error_8 = _a.sent();
                        // console.log(error.message);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrderService.prototype.deleteMissingProduct = function (orderNumber, barcode) {
        return __awaiter(this, void 0, Promise, function () {
            var response, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.httpClientService.get({ controller: "order/delete-missing-item" + "/" + orderNumber + "/" + barcode }).toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2:
                        error_9 = _a.sent();
                        // console.log(error.message);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrderService.prototype.getInvoicesOfCustomer = function (orderNumber) {
        return __awaiter(this, void 0, Promise, function () {
            var response, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.httpClientService.get({ controller: "order/get-invoices-of-customer" + "/" + orderNumber }).toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2:
                        error_10 = _a.sent();
                        // console.log(error.message);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrderService.prototype.getCustomerList_2 = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.httpClientService.post({ controller: "order/get-customer-list-2" }, request).toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2:
                        error_11 = _a.sent();
                        // console.log(error.message);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrderService.prototype.getCustomerAddress = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.httpClientService.post({ controller: "order/get-customer-address" }, request).toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2:
                        error_12 = _a.sent();
                        // console.log(error.message);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrderService.prototype.createCustomer = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.httpClientService.post({ controller: "order/create-customer" }, request).toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2:
                        error_13 = _a.sent();
                        // console.log(error.message);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrderService.prototype.getClientOrder = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var response, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.httpClientService.get({ controller: "order/get-client-order" + "/" + id }).toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2:
                        error_14 = _a.sent();
                        // console.log(error.message);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrderService.prototype.getClientOrders = function (isCompleted) {
        return __awaiter(this, void 0, Promise, function () {
            var response, error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.httpClientService.get({ controller: "order/get-client-orders" }, isCompleted.toString()).toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2:
                        error_15 = _a.sent();
                        // console.log(error.message);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrderService.prototype.createClientOrder = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.httpClientService.post({ controller: "order/create-client-order" }, request).toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2:
                        error_16 = _a.sent();
                        // console.log(error.message);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrderService.prototype.createClientOrderBasketItem = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.httpClientService.post({ controller: "order/create-client-order-basket-item" }, request).toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2:
                        error_17 = _a.sent();
                        // console.log(error.message);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrderService.prototype.updateClientOrderBasketItem = function (id, lineId, quantity, price, discountedPrice, basePrice) {
        return __awaiter(this, void 0, Promise, function () {
            var query, response, error_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = id + "/" + lineId + "/" + quantity + "/" + price + "/" + discountedPrice + "/" + basePrice;
                        return [4 /*yield*/, this.httpClientService.get({ controller: "order/update-client-order-basket-item" + "/" + query }).toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2:
                        error_18 = _a.sent();
                        // console.log(error.message);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrderService.prototype.updateClientOrderPayment = function (orderId, paymentDescription) {
        return __awaiter(this, void 0, Promise, function () {
            var query, response, error_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = orderId + "/" + paymentDescription;
                        return [4 /*yield*/, this.httpClientService.get({ controller: "order/update-client-order-payment" + "/" + query }).toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2:
                        error_19 = _a.sent();
                        // console.log(error.message);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrderService.prototype.editClientCustomer = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response, error_20;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.httpClientService.post({ controller: "order/edit-client-customer" }, request).toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2:
                        error_20 = _a.sent();
                        // console.log(error.message);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrderService.prototype.getClientCustomer = function (salesPersonCode) {
        return __awaiter(this, void 0, Promise, function () {
            var response, error_21;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.httpClientService.get({ controller: "order/get-client-customer" }, salesPersonCode).toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2:
                        error_21 = _a.sent();
                        // console.log(error.message);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrderService.prototype.getOrderDetail = function (orderNumber) {
        return __awaiter(this, void 0, Promise, function () {
            var response, error_22;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.httpClientService.get({ controller: "order/get-order-detail" + "/" + orderNumber }).toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2:
                        error_22 = _a.sent();
                        // console.log(error.message);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrderService.prototype.deleteClientOrder = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var response, error_23;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.httpClientService.get({ controller: "order/delete-client-order" + "/" + id }).toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2:
                        error_23 = _a.sent();
                        // console.log(error.message);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrderService.prototype.deleteClientOrderBasketItem = function (orderId, lineId) {
        return __awaiter(this, void 0, Promise, function () {
            var query, response, error_24;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = orderId + "/" + lineId;
                        return [4 /*yield*/, this.httpClientService.get({ controller: "order/delete-client-order-basket-item" }, query).toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2:
                        error_24 = _a.sent();
                        // console.log(error.message);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrderService.prototype.addCustomerAddress = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response, error_25;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.httpClientService.post({ controller: "order/add-customer-address" }, request).toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2:
                        error_25 = _a.sent();
                        // console.log(error.message);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrderService.prototype.getRaports = function (day) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                try {
                    response = this.httpClientService
                        .get({
                        controller: 'order/get-raports'
                    }, day.toString())
                        .toPromise();
                    return [2 /*return*/, response];
                }
                catch (error) {
                    // console.log(error.message);
                    return [2 /*return*/, null];
                }
                return [2 /*return*/];
            });
        });
    };
    OrderService.prototype.getExchangeRates = function () {
        return __awaiter(this, void 0, Promise, function () {
            var response, error_26;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.httpClientService
                                .get({
                                controller: 'order/get-exchange-rates'
                            })
                                .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response[0]];
                    case 2:
                        error_26 = _a.sent();
                        // console.log(error.message);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrderService.prototype.getNebimOrders = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                try {
                    response = this.httpClientService
                        .post({
                        controller: 'order/get-nebim-orders'
                    }, request)
                        .toPromise();
                    return [2 /*return*/, response];
                }
                catch (error) {
                    // console.log(error.message);
                    return [2 /*return*/, null];
                }
                return [2 /*return*/];
            });
        });
    };
    OrderService.prototype.addOrderStatus = function (orderStatus) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                response = this.httpClientService
                    .post({
                    controller: 'order/add-order-status'
                }, orderStatus)
                    .toPromise();
                return [2 /*return*/, response];
            });
        });
    };
    OrderService.prototype.getSaleOrdersWithStatus = function (type, invoiceStatus) {
        return __awaiter(this, void 0, Promise, function () {
            var query, response;
            return __generator(this, function (_a) {
                query = type + "/" + invoiceStatus;
                response = this.httpClientService
                    .get({
                    controller: 'order/get-orders-with-statuses'
                }, query)
                    .toPromise();
                return [2 /*return*/, response];
            });
        });
    };
    OrderService.prototype.deleteNebimOrder = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response, error_27;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!window.confirm("Siparişi silmek istediğinize emin misiniz?")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.httpClientService.get({ controller: "order/delete-nebim-order" + "/" + request }).toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        error_27 = _a.sent();
                        // console.log(error.message);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    OrderService.prototype.sendInvoiceToPrinter = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var userId, response, error_28;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!window.confirm("Faturayı yazdırmak istediğinize emin misiniz?")) return [3 /*break*/, 2];
                        userId = localStorage.getItem('userId');
                        return [4 /*yield*/, this.httpClientService.get({ controller: "order/send-invoice-to-printer" + "/" + request + "/" + userId }).toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        error_28 = _a.sent();
                        // console.log(error.message);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    OrderService.prototype.createPdf = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var userId;
            return __generator(this, function (_a) {
                try {
                    userId = localStorage.getItem('userId');
                    this.httpClient.get(ClientUrls_1.ClientUrls.baseUrl + '/order/get-recepie-pdf/' + request + "/" + userId, { responseType: 'arraybuffer' })
                        .subscribe(function (data) {
                        var file = new Blob([data], { type: 'application/pdf' });
                        var fileURL = URL.createObjectURL(file);
                        window.open(fileURL, '_blank');
                    });
                    return [2 /*return*/, true];
                }
                catch (error) {
                    // console.log(error.message);
                    return [2 /*return*/, null];
                }
                return [2 /*return*/];
            });
        });
    };
    OrderService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], OrderService);
    return OrderService;
}());
exports.OrderService = OrderService;
