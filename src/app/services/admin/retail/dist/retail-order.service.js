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
exports.RetailOrderService = void 0;
var core_1 = require("@angular/core");
var orderBillingRequestModel_1 = require("src/app/models/model/invoice/orderBillingRequestModel");
var RetailOrderService = /** @class */ (function () {
    function RetailOrderService(toasterService, httpClientService, router, httpClient) {
        this.toasterService = toasterService;
        this.httpClientService = httpClientService;
        this.router = router;
        this.httpClient = httpClient;
    }
    RetailOrderService.prototype.getInvoiceList = function () {
        return __awaiter(this, void 0, Promise, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .get({ controller: 'Order/Retail/get-invoice-list' }) //Get_InvoicesList
                            .toPromise()];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                }
            });
        });
    };
    RetailOrderService.prototype.collectAndPack = function (list, orderNo, taxedOrTaxtFree, invoiceOfCustomer) {
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
                                controller: 'Order/Retail/billing-order/' + model
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
    //faturanın ürünlerini getirme
    RetailOrderService.prototype.getProductOfInvoice = function (orderNo) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .get({ controller: 'Order/Retail/get-product-of-invoice' }, //Get_ProductOfInvoice
                        orderNo)
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    RetailOrderService.prototype.getSalesPersonModels = function () {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .get({
                            controller: 'Order/Retail/GetSalesPersonModels'
                        })
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    //
    RetailOrderService.prototype.countProductOfOrder = function (model) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .post({
                            controller: 'Order/Retail/count-product'
                        }, model)
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    RetailOrderService.prototype.getProductOfOrder = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .get({
                            controller: 'Order/Retail/get-products-of-orders/' + request
                        })
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    //satış siparişleri çekme //exec GET_MSRAFOrderList
    RetailOrderService.prototype.getOrders = function (type, invoiceStatus) {
        return __awaiter(this, void 0, Promise, function () {
            var query, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = type + "/" + invoiceStatus;
                        return [4 /*yield*/, this.httpClientService
                                .get({
                                controller: 'Order/Retail/get-sale-orders'
                            }, query)
                                .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    //toplanacak olan ürünleri çeker
    RetailOrderService.prototype.getItemsToBeCollected = function (orderNo) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .get({
                            controller: 'Order/Retail/get-order-detail-by-id/' + orderNo
                        }).toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    RetailOrderService.prototype.addCollectedProductsOfRetailOrder = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .post({
                            controller: 'Order/Retail/add-collected-products-of-retail-order'
                        }, request)
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    RetailOrderService.prototype.deleteCollectedProductsOfRetailOrder = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .get({
                            controller: 'Order/Retail/delete-collected-products-of-retail-order'
                        }, request)
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    RetailOrderService.prototype.deleteCollectedProductsOfRetailOrderList = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .get({
                            controller: 'Order/Retail/delete-collected-products-of-retail-order-list'
                        }, request)
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    RetailOrderService.prototype.getCollectedProductsOfRetailOrder = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .get({
                            controller: 'Order/Retail/get-collected-products-of-retail-order'
                        }, request)
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    RetailOrderService.prototype.getGetCollectedProductsPackages = function () {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .get({
                            controller: 'Order/Retail/get-collected-products-package'
                        })
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        // console.log(response);
                        return [2 /*return*/, response];
                }
            });
        });
    };
    RetailOrderService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], RetailOrderService);
    return RetailOrderService;
}());
exports.RetailOrderService = RetailOrderService;
