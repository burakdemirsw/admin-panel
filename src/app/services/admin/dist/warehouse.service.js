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
exports.WarehouseService = void 0;
var core_1 = require("@angular/core");
var countProductRequestModel2_1 = require("src/app/models/model/order/countProductRequestModel2");
var WarehouseService = /** @class */ (function () {
    function WarehouseService(httpClientService) {
        this.httpClientService = httpClientService;
    }
    WarehouseService.prototype.deleteCount = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService.get({
                            controller: "Warehouse/delete-count/" + request.id.toString()
                        }).toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    WarehouseService.prototype.addCount = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (request.barcode.includes('/')) {
                            request.barcode = request.barcode.replace(/\//g, '-');
                        }
                        return [4 /*yield*/, this.httpClientService.post({
                                controller: "Warehouse/add-count"
                            }, request)
                                .toPromise()];
                    case 1:
                        response = _a.sent();
                        if (response == true) {
                            return [2 /*return*/, response];
                        }
                        else {
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    WarehouseService.prototype.getCountsOfOperation = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService.get({
                            controller: "Warehouse/get-counts-of-operation/" + request
                        })
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    //ürün sayım 1
    WarehouseService.prototype.countProductRequest = function (barcode, shelfNo, qty, office, warehouseCode, batchCode, url, orderNo, currAccCode) {
        return __awaiter(this, void 0, Promise, function () {
            var requestModel, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (barcode.includes('/')) {
                            barcode = barcode.replace(/\//g, '-');
                        }
                        requestModel = new countProductRequestModel2_1.CountProductRequestModel2();
                        requestModel.barcode = barcode;
                        requestModel.shelfNo = shelfNo;
                        requestModel.batchCode = batchCode;
                        requestModel.office = office;
                        requestModel.warehouseCode = warehouseCode;
                        requestModel.quantity = qty.toString() == '' ? 1 : qty;
                        requestModel.currAccCode = currAccCode;
                        requestModel.isReturn = false;
                        requestModel.salesPersonCode = '';
                        requestModel.taxTypeCode = '';
                        requestModel.orderNo = orderNo;
                        return [4 /*yield*/, this.httpClientService
                                .post({
                                controller: url
                            }, requestModel)
                                .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    WarehouseService.prototype.countProductRequest2 = function (barcode, shelfNo, qty, office, warehouseCode, batchCode, url, orderNo, currAccCode, lineId) {
        return __awaiter(this, void 0, Promise, function () {
            var requestModel, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (barcode.includes('/')) {
                            barcode = barcode.replace(/\//g, '-');
                        }
                        requestModel = new countProductRequestModel2_1.CountProductRequestModel3();
                        requestModel.barcode = barcode;
                        requestModel.shelfNo = shelfNo;
                        requestModel.batchCode = batchCode;
                        requestModel.office = office;
                        requestModel.warehouseCode = warehouseCode;
                        requestModel.quantity = qty.toString() == '' ? 1 : qty;
                        requestModel.currAccCode = currAccCode;
                        requestModel.isReturn = false;
                        requestModel.salesPersonCode = '';
                        requestModel.taxTypeCode = '';
                        requestModel.orderNo = orderNo;
                        requestModel.lineId = lineId;
                        return [4 /*yield*/, this.httpClientService
                                .post({
                                controller: url
                            }, requestModel)
                                .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    //ofisleri çeker
    WarehouseService.prototype.getOfficeCodeList = function () {
        return __awaiter(this, void 0, Promise, function () {
            var data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.httpClientService
                                .get({
                                controller: 'Warehouse/GetOfficeModel'
                            })
                                .toPromise()];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 2:
                        error_1 = _a.sent();
                        console.log(error_1.message);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //depo listesini çeker
    WarehouseService.prototype.getWarehouseList = function (value) {
        return __awaiter(this, void 0, Promise, function () {
            var selectElement, data, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        selectElement = document.getElementById('officeCode');
                        value = selectElement.value == '' ? 'M' : selectElement.value;
                        return [4 /*yield*/, this.httpClientService
                                .get({
                                controller: 'Warehouse/GetWarehouseModel/' + value
                            })
                                .toPromise()];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 2:
                        error_2 = _a.sent();
                        console.log(error_2.message);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //müşteri listesini çeker
    WarehouseService.prototype.getCustomerList = function (customerType) {
        return __awaiter(this, void 0, Promise, function () {
            var data, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.httpClientService
                                .get({
                                controller: 'Order/CustomerList/' + customerType
                            })
                                .toPromise()];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 2:
                        error_3 = _a.sent();
                        console.log(error_3.message);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //sayım listesini çeker
    WarehouseService.prototype.getCountList = function () {
        return __awaiter(this, void 0, Promise, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .get({ controller: 'Order/GetCountList' })
                            .toPromise()];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                }
            });
        });
    };
    //sayım ürünklerini çeker 100 adet
    WarehouseService.prototype.getProductOfCount = function (orderNo) {
        return __awaiter(this, void 0, Promise, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .get({ controller: 'Order/GetProductOfCount/' + orderNo })
                            .toPromise()];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                }
            });
        });
    };
    //sayım ürünklerini kontrol eder
    WarehouseService.prototype.getProductOfCountControl = function (orderNo) {
        return __awaiter(this, void 0, Promise, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .get({ controller: 'Order/get-product-of-count-control/' + orderNo })
                            .toPromise()];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                }
            });
        });
    };
    //depolar arası transferin taplann ürünlerini çeker
    WarehouseService.prototype.getProductOfTrasfer = function (orderNo) {
        return __awaiter(this, void 0, Promise, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .get({
                            controller: 'Order/GetProductOfTrasfer/' + orderNo
                        })
                            .toPromise()];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                }
            });
        });
    };
    //sayım ürünklerini filtreli Çeker
    WarehouseService.prototype.GetCountListByFilter = function (model) {
        return __awaiter(this, void 0, Promise, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .post({ controller: 'Order/GetCountListByFilter/' }, model)
                            .toPromise()];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                }
            });
        });
    };
    //hızlı transfer ekleme
    WarehouseService.prototype.fastTransfer = function (model) {
        return __awaiter(this, void 0, Promise, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .post({ controller: 'Order/FastTransfer' }, model) //Usp_PostZtMSRAFSTOKTransfer
                            .toPromise()];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                }
            });
        });
    };
    //hızlı transferin ürünlerini çeker
    WarehouseService.prototype.getGetAllFastTransferModelById = function (operationId) {
        return __awaiter(this, void 0, Promise, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .get({
                            controller: 'Order/GetFastTransferModel/' + operationId
                        })
                            .toPromise()];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                }
            });
        });
    };
    //transfer işlemlerini çeker
    WarehouseService.prototype.getWarehouseOperations = function (status) {
        return __awaiter(this, void 0, Promise, function () {
            var data;
            return __generator(this, function (_a) {
                data = this.httpClientService
                    .get({
                    controller: 'Warehouse/GetWarehosueOperationList'
                }, status)
                    .toPromise();
                return [2 /*return*/, data];
            });
        });
    };
    WarehouseService.prototype.getWarehosueOperationListByInnerNumber = function (innerNumber) {
        return __awaiter(this, void 0, Promise, function () {
            var data;
            return __generator(this, function (_a) {
                data = this.httpClientService
                    .get({
                    controller: 'Warehouse/getWarehosueOperationListByInnerNumber'
                }, innerNumber)
                    .toPromise();
                return [2 /*return*/, data];
            });
        });
    };
    //transfer operasyonlarını nebimden filtreleyerek çeker
    WarehouseService.prototype.getWarehosueOperationListByFilter = function (model) {
        return __awaiter(this, void 0, Promise, function () {
            var data;
            return __generator(this, function (_a) {
                data = this.httpClientService
                    .post({
                    controller: 'Warehouse/GetWarehosueOperationListByFilter'
                }, model)
                    .toPromise();
                return [2 /*return*/, data];
            });
        });
    };
    //transfer işlemlerini filtreleyerek çeker
    WarehouseService.prototype.getWarehosueTransferListByFilter = function (model) {
        return __awaiter(this, void 0, Promise, function () {
            var data;
            return __generator(this, function (_a) {
                data = this.httpClientService
                    .post({
                    controller: 'Warehouse/GetWarehosueTransferList'
                }, model)
                    .toPromise();
                return [2 /*return*/, data];
            });
        });
    };
    //transfer işlemi
    WarehouseService.prototype.transfer = function (model) {
        return __awaiter(this, void 0, Promise, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .post({
                            controller: 'Warehouse/Transfer'
                        }, model)
                            .toPromise()];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    //deleteCountById
    WarehouseService.prototype.deleteTransferFromId = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .get({
                            controller: 'Warehouse/DeleteWarehouseTransferById/' + id
                        })
                            .toPromise()];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    WarehouseService.prototype.deleteCountFromId = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.httpClientService
                                .get({
                                controller: 'Warehouse/DeleteCountById/' + id
                            })
                                .toPromise()];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 2:
                        error_4 = _a.sent();
                        console.log(error_4.message);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    WarehouseService.prototype.getTransferRequestListModel = function (type) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .get({
                            controller: 'Warehouse/TransferRequestList'
                        }, type)
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    //sayılabilecek rafları çeker
    // Get_MSRAFWillBeCounted
    WarehouseService.prototype.getAvailableShelves = function () {
        return __awaiter(this, void 0, Promise, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .get({ controller: 'Order/GetAvailableShelves' })
                            .toPromise()];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                }
            });
        });
    };
    //raflar arası transfer ----------------------------------------------------
    WarehouseService.prototype.addFastTransferModel = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .post({ controller: 'Warehouse/add-fast-transfer-model' }, request)
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    WarehouseService.prototype.deleteFastTransferModel = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .get({ controller: 'Warehouse/delete-fast-transfer-model' }, request)
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    WarehouseService.prototype.getFastTransferModels = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .get({ controller: 'Warehouse/get-fast-transfer-models' }, request)
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    // Get fast transfer list models
    WarehouseService.prototype.getFastTransferListModels = function (type) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .get({
                            controller: 'Warehouse/get-fast-transfer-list/' + type.toString()
                        })
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    //---------------------------------------------------------------------------
    // ZTMSG_ProductOnShelf -----------------------------------------------------------
    WarehouseService.prototype.addProductOnShelf = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .post({ controller: 'Warehouse/add-product-on-shelf' }, request)
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    WarehouseService.prototype.getProductOnShelf = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .get({ controller: 'Warehouse/get-products-on-shelves' }, request)
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    WarehouseService.prototype.deleteProductOnShelf = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .get({ controller: 'Warehouse/delete-product-on-shelf' }, request)
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    //---------------------------------------------------------------------------
    WarehouseService.prototype.completeCountOperation = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .post({ controller: 'Warehouse/complete-count-operation' }, request)
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    WarehouseService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], WarehouseService);
    return WarehouseService;
}());
exports.WarehouseService = WarehouseService;
