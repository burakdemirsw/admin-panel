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
exports.BarcodeSearch_RM = exports.ProductService = void 0;
var core_1 = require("@angular/core");
var ClientUrls_1 = require("src/app/models/const/ClientUrls");
var qrOperationResponseModel_1 = require("src/app/models/model/client/qrOperationResponseModel");
var qrControlModel_1 = require("src/app/models/model/product/qrControlModel");
var qrOperationModel_1 = require("src/app/models/model/product/qrOperationModel");
var ProductService = /** @class */ (function () {
    function ProductService(toasterService, httpClientService, generalService, httpClient) {
        this.toasterService = toasterService;
        this.httpClientService = httpClientService;
        this.generalService = generalService;
        this.httpClient = httpClient;
    }
    //ürün oluşturma
    ProductService.prototype.createProduct = function (model) {
        var _this = this;
        this.httpClientService
            .post({
            controller: 'Product'
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
    //create_order - fast_Trasfer - shelf_count
    ProductService.prototype.countProductByBarcode = function (barcode) {
        return __awaiter(this, void 0, Promise, function () {
            var model, shelfNumbers, results, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (barcode.includes('/')) {
                            barcode = barcode.replace(/\//g, '-');
                        }
                        return [4 /*yield*/, this.httpClientService
                                .get({
                                controller: 'Order/GetShelvesOfProduct/' + barcode
                            })
                                .toPromise()];
                    case 1:
                        model = _a.sent();
                        shelfNumbers = '';
                        model.forEach(function (element) {
                            shelfNumbers += element.description + ',';
                        });
                        results = [];
                        results.push(shelfNumbers);
                        results.push(model[0].status);
                        results.push(model[0].batchCode);
                        results.push(model[0].barcode);
                        // results.push(model[0].batchStatus.toString());
                        results.push(model[0].batchStatus.toString());
                        return [2 /*return*/, results];
                    case 2:
                        error_1 = _a.sent();
                        console.error(error_1.message);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //alış satış ve transfer işlemlerinde barkod ile ürün bilgisi getirme işlemi
    ProductService.prototype.countProductByBarcode4 = function (barcode, warehosueCode) {
        return __awaiter(this, void 0, Promise, function () {
            var model, shelfNumbers, results, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (barcode.includes('/')) {
                            barcode = barcode.replace(/\//g, '-');
                        }
                        if (warehosueCode == 'ONL') {
                            warehosueCode = "MD";
                        }
                        return [4 /*yield*/, this.httpClientService
                                .get({
                                controller: 'Order/GetShelvesOfProduct4/' + barcode + "/" + warehosueCode
                            })
                                .toPromise()];
                    case 1:
                        model = _a.sent();
                        shelfNumbers = '';
                        model.forEach(function (element) {
                            shelfNumbers += element.description + ',';
                        });
                        results = [];
                        results.push(shelfNumbers);
                        results.push(model[0].status);
                        results.push(model[0].batchCode);
                        results.push(model[0].barcode);
                        results.push(model[0].batchStatus.toString());
                        return [2 /*return*/, results];
                    case 2:
                        error_2 = _a.sent();
                        console.error(error_2.message);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //barkod ile ürün sayma işlemi | ürün kodu
    ProductService.prototype.countProductByBarcode2 = function (barcode) {
        return __awaiter(this, void 0, Promise, function () {
            var model, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (barcode.includes('/')) {
                            barcode = barcode.replace(/\//g, '-');
                        }
                        return [4 /*yield*/, this.httpClientService
                                .get({
                                controller: 'Order/CountProductByBarcode2/' + barcode
                            })
                                .toPromise()];
                    case 1:
                        model = _a.sent();
                        if (model.length > 0) {
                            return [2 /*return*/, model[0].itemCode];
                        }
                        else {
                            return [2 /*return*/, null];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.error(error_3.message);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //depolar arası transfer işlemlerinde barkod ile ürün sayma işlemi
    ProductService.prototype.countProductByBarcode3 = function (barcode) {
        return __awaiter(this, void 0, Promise, function () {
            var qrModel, model, countModel, shelfNumbers, results, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        qrModel = new qrControlModel_1.QrControlCommandModel();
                        qrModel.qr = barcode;
                        return [4 /*yield*/, this.httpClientService
                                .post({
                                controller: 'Order/GetShelvesOfProduct2'
                            }, qrModel)
                                .toPromise()];
                    case 1:
                        model = _a.sent();
                        if (model) {
                            countModel = model;
                            if (countModel) {
                                shelfNumbers = '';
                                model.forEach(function (element) {
                                    shelfNumbers += element.description + ',';
                                });
                                results = [];
                                results.push(shelfNumbers);
                                results.push(model[0].status);
                                results.push(model[0].batchCode);
                                results.push(model[0].barcode);
                                results.push(model[0].batchStatus.toString());
                                return [2 /*return*/, results];
                            }
                            else {
                                return [2 /*return*/, null];
                            }
                        }
                        else {
                            return [2 /*return*/, null];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.error(error_4.message);
                        throw new Error('Bir hata oluştu');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //order operation toplanan ürünleri getirme
    ProductService.prototype.getCollectedOrderProducts = function (orderNo) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .get({
                            controller: 'Order/GetCollectedOrderProducts/' + orderNo
                        })
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    //sayımı tamamlama
    ProductService.prototype.completeCount = function (orderNo) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .get({ controller: 'Order/CompleteCount/' + orderNo })
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    //sayım içindeki ürünü silme
    ProductService.prototype.deleteOrderProduct = function (orderNo, itemCode, lineId) {
        return __awaiter(this, void 0, Promise, function () {
            var requestModel, response, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        requestModel = {
                            orderNumber: orderNo,
                            itemCode: itemCode,
                            lineId: lineId
                        };
                        return [4 /*yield*/, this.httpClientService
                                .post({ controller: 'Order/DeleteProductOfCount' }, requestModel)
                                .toPromise()];
                    case 1:
                        response = _a.sent();
                        if (response > 0) {
                            return [2 /*return*/, true];
                        }
                        else {
                            return [2 /*return*/, false];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        console.error('Hata (90):', error_5);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //transfer ürünleriini sayma
    ProductService.prototype.countTransferProduct = function (model) {
        return __awaiter(this, void 0, Promise, function () {
            var response, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.httpClientService
                                .post({ controller: 'Order/CountTransferProduct' }, model)
                                .toPromise()];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            return [2 /*return*/, response];
                        }
                        else {
                            return [2 /*return*/, null];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        console.error(error_6);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProductService.prototype.deleteProductFromFastTransfer = function (orderNo, itemCode) {
        return __awaiter(this, void 0, Promise, function () {
            var requestModel, response, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        requestModel = {
                            orderNumber: orderNo,
                            itemCode: itemCode
                        };
                        return [4 /*yield*/, this.httpClientService
                                .post({ controller: 'Order/DeleteProductFromFastTransfer' }, requestModel)
                                .toPromise()];
                    case 1:
                        response = _a.sent();
                        if (response > 0) {
                            return [2 /*return*/, true];
                        }
                        else {
                            return [2 /*return*/, false];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_7 = _a.sent();
                        console.error('Hata (90):', error_7);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //faturanın ürünlerini getirme
    ProductService.prototype.getProductOfInvoice = function (orderNo) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .get({ controller: 'Order/GetProductOfInvoice' }, //Get_ProductOfInvoice
                        orderNo)
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    ProductService.prototype._searchProduct = function (model) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .post({ controller: 'Products/SearchProduct' }, model)
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    // async searchProposalProducts(model: ProposalProduct_SM): Promise<any> {
    //   const response: ProposalProduct_SM[] = await this.httpClientService
    //     .post<ProposalProduct_SM>({ controller: 'Products/search-proposal-products' }, model)
    //     .toPromise();
    //   return response;
    // }
    ProductService.prototype.getProposalProducts = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .get_new({ controller: 'Products/get-proposal-products' }, request)
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    ProductService.prototype.deleteProposalProduct = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .get_new({ controller: 'Products/delete-proposal-product' }, request.toString())
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    ProductService.prototype.addProposalProduct = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .post({ controller: 'Products/add-proposal-product' }, request)
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    ProductService.prototype.updateProposalProduct = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .post({ controller: 'Products/update-proposal-product' }, request)
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    // Proposal işlemleri
    ProductService.prototype.getProposals = function () {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .get({ controller: 'Products/get-proposals' })
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    ProductService.prototype.deleteProposal = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService["delete"]({ controller: 'Products/delete-proposal' }, request.toString())
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    ProductService.prototype.addProposal = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .post({ controller: 'Products/add-proposal' }, request)
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    ProductService.prototype.updateProposal = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .post({ controller: 'Products/update-proposal' }, request)
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    //
    ProductService.prototype.searchProduct = function (model) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .post({ controller: 'Products/SearchProduct2' }, model)
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    ProductService.prototype.searchProduct3 = function (barcode, batchCode, shelfNo) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (batchCode === '0') {
                            batchCode = null;
                        }
                        return [4 /*yield*/, this.httpClientService
                                .get({ controller: 'Products/SearchProduct3/' + barcode + "/" + batchCode }, shelfNo)
                                .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    ProductService.prototype.searchProduct4 = function (model) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .post({ controller: 'Products/search-product-4' }, model)
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    ProductService.prototype.searchProduct5 = function () {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .get({ controller: 'Products/search-product-5' })
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    ProductService.prototype.getQr = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .get({ controller: 'Products/get-qr' }, id)
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    ProductService.prototype.addQr = function (model) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .post({ controller: 'Products/AddQr' }, model)
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    ProductService.prototype.qrControl = function (qr) {
        return __awaiter(this, void 0, Promise, function () {
            var model, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        model = new qrControlModel_1.QrControlCommandModel();
                        model.qr = qr;
                        return [4 /*yield*/, this.httpClientService
                                .post({ controller: 'Products/QrControl' }, model)
                                .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    //QrOperationModel
    ProductService.prototype.getBarcodePage = function (model) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClient
                            .post(ClientUrls_1.ClientUrls.baseUrl + '/Products/GenerateBarcode_A', model)
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    ProductService.prototype.qrOperation = function (model) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClient
                            .post(ClientUrls_1.ClientUrls.baseUrl + '/Products/qr-operation', model)
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    ProductService.prototype.qrOperation2 = function (model) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClient
                            .post(ClientUrls_1.ClientUrls.baseUrl + '/Products/qr-operation2', model)
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    ProductService.prototype.qrOperationMethod = function (qrBarcodeUrl, form, formValue, numberParameter, isReturn, processCode) {
        return __awaiter(this, void 0, Promise, function () {
            var response, qrModel, qrOperationModel, qrOperationResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = new qrOperationResponseModel_1.QrOperationResponseModel();
                        if (!(qrBarcodeUrl != null)) return [3 /*break*/, 2];
                        qrModel = new qrControlModel_1.QrControlCommandModel();
                        qrModel.qr = qrBarcodeUrl;
                        qrOperationModel = new qrOperationModel_1.QrOperationModel();
                        qrOperationModel.barcode = form.get('barcode').value;
                        qrOperationModel.batchCode = formValue.batchCode;
                        qrOperationModel.isReturn = isReturn;
                        qrOperationModel.processCode = processCode;
                        qrOperationModel.qrBarcode = qrBarcodeUrl;
                        (qrOperationModel.qty =
                            formValue.quantity === null
                                ? numberParameter
                                : formValue.quantity),
                            (qrOperationModel.shelfNo = formValue.shelfNo);
                        return [4 /*yield*/, this.qrOperation(qrOperationModel)];
                    case 1:
                        qrOperationResponse = _a.sent();
                        if (qrOperationResponse) {
                            this.generalService.beep2();
                            this.toasterService.success('Qr Operasyonu Başarılı');
                            response.state = true;
                            response.qrOperationModel = qrOperationModel;
                            return [2 /*return*/, response];
                        }
                        else {
                            return [2 /*return*/, null];
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/, null];
                }
            });
        });
    };
    ProductService.prototype.getProductStock = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService.post({
                            controller: 'Products/get-product-stock'
                        }, request).toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    ProductService.prototype.getProductExtract = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService.post({
                            controller: 'Products/get-product-extract'
                        }, request).toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    ProductService.prototype.addBarcodeModel = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService.post({
                            controller: 'Products/add-barcode-model'
                        }, request).toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    ProductService.prototype.deleteBarcodeModel = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService.get({
                            controller: 'Products/delete-barcode-model'
                        }, request).toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    ProductService.prototype.getBarcodeModels = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService.get({
                            controller: 'Products/get-barcode-models'
                        }, request).toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    ProductService.prototype.sendBarcodeModelsToNebim = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService.get({
                            controller: 'Products/send-barcode-models-to-nebim'
                        }, request).toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    ProductService.prototype.sendBarcodesToNebim = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService.post({
                            controller: 'Products/send-barcode-models-to-nebim'
                        }, request).toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    ProductService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], ProductService);
    return ProductService;
}());
exports.ProductService = ProductService;
var BarcodeSearch_RM = /** @class */ (function () {
    function BarcodeSearch_RM(barcode) {
        this.barcode = barcode;
    }
    return BarcodeSearch_RM;
}());
exports.BarcodeSearch_RM = BarcodeSearch_RM;
