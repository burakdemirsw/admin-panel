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
exports.CollectProductOfOrderComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var collectedProductsOfRetailOrder_1 = require("src/app/models-2/Count/collectedProductsOfRetailOrder");
var countProductRequestModel_1 = require("src/app/models/model/order/countProductRequestModel");
var CollectProductOfOrderComponent = /** @class */ (function () {
    function CollectProductOfOrderComponent(httpClientService, formBuilder, toasterService, orderService, activatedRoute, router) {
        this.httpClientService = httpClientService;
        this.formBuilder = formBuilder;
        this.toasterService = toasterService;
        this.orderService = orderService;
        this.activatedRoute = activatedRoute;
        this.router = router;
        this.productsToCollect = [];
        this.collectedProducts = [];
        this.process = false;
        this.activeTab = 1;
        this.orderBillingList = [];
        this.itemBillingModels = [];
        this.orderNo = '';
        this.currentQrCode = '';
    }
    CollectProductOfOrderComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.formGenerator();
                        this.activatedRoute.params.subscribe(function (params) {
                            _this.orderNo = params["number"];
                            _this.toasterService.success("Sipariş numarası: " + params["number"]);
                        });
                        return [4 /*yield*/, this.getAllProductsOfOrder(this.orderNo)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CollectProductOfOrderComponent.prototype.getItemsToBeCollected = function (orderNo) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.orderService.getItemsToBeCollected(orderNo)];
                    case 1:
                        response = _a.sent();
                        this.productsToCollect = response;
                        return [2 /*return*/];
                }
            });
        });
    };
    CollectProductOfOrderComponent.prototype.getCollectedProducts = function (orderNo) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.orderService.getCollectedProductsOfRetailOrder(orderNo)];
                    case 1:
                        response = _a.sent();
                        this.collectedProducts = response;
                        return [2 /*return*/];
                }
            });
        });
    };
    CollectProductOfOrderComponent.prototype.getAllProductsOfOrder = function (orderNo) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCollectedProducts(orderNo)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getItemsToBeCollected(orderNo)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CollectProductOfOrderComponent.prototype.deleteCollectProductOfOrder = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.orderService.deleteCollectedProductsOfRetailOrder(id)];
                    case 1:
                        response = _a.sent();
                        if (!response) return [3 /*break*/, 4];
                        this.toasterService.success("Ürün silme işlemi başarılı");
                        return [4 /*yield*/, this.getAllProductsOfOrder(this.orderNo)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.getAllProductsOfOrder(this.orderNo)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        this.toasterService.error("Ürün silme işlemi başarısız");
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    CollectProductOfOrderComponent.prototype.focusNextInput = function (nextInputId) {
        var nextInput = document.getElementById(nextInputId);
        if (nextInput) {
            nextInput.focus();
        }
    };
    CollectProductOfOrderComponent.prototype.deleteRow = function (index) {
        this.itemBillingModels.splice(index, 1); // İlgili satırı listeden sil
    };
    CollectProductOfOrderComponent.prototype.formGenerator = function () {
        this.checkForm = this.formBuilder.group({
            barcode: [null, forms_1.Validators.required],
            shelfNo: [null, forms_1.Validators.required],
            quantity: [null, forms_1.Validators.required]
        });
    };
    CollectProductOfOrderComponent.prototype.setStatusOfPackages = function (list) {
        //nebime yolla
        try {
            this.httpClientService
                .post({
                controller: 'Order/SetStatusOfPackages'
            }, list)
                .subscribe(function (data) {
                console.log("Etkilenen Satır Sayısı:" + data);
            });
        }
        catch (error) {
            console.log(error.message);
        }
    };
    CollectProductOfOrderComponent.prototype.onSubmit = function (productModel) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var requestModel, response, data, foundModel, foundProduct, request, response;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(this.checkForm.valid || productModel.shelfNo == "")) return [3 /*break*/, 6];
                        if (!(productModel.shelfNo == "" || productModel.shelfNo == undefined || productModel.shelfNo == null)) return [3 /*break*/, 2];
                        requestModel = new countProductRequestModel_1.CountProductRequestModel();
                        requestModel.barcode = productModel.barcode;
                        requestModel.shelfNo = "";
                        return [4 /*yield*/, this.orderService.countProductOfOrder(requestModel)];
                    case 1:
                        response = _c.sent();
                        if (response === undefined) {
                        }
                        else {
                            data = response;
                            if (data.status == "RAF") {
                                (_a = this.checkForm.get("shelfNo")) === null || _a === void 0 ? void 0 : _a.setValue(data.description);
                                productModel.shelfNo = response.description;
                            }
                        }
                        _c.label = 2;
                    case 2:
                        foundModel = this.productsToCollect.find(function (o) {
                            return o.barcode == productModel.barcode && o.shelfNo == productModel.shelfNo;
                        });
                        if (!foundModel) return [3 /*break*/, 6];
                        foundProduct = this.productsToCollect.find(function (o) {
                            return o.barcode == productModel.barcode &&
                                o.shelfNo == productModel.shelfNo;
                        });
                        if (!foundProduct) return [3 /*break*/, 6];
                        request = new collectedProductsOfRetailOrder_1.CollectedProductsOfRetailOrder();
                        request.barcode = foundProduct.barcode;
                        request.lineId = foundProduct.lineId;
                        request.orderNumber = this.orderNo;
                        request.packageNumber = foundProduct.packageNo;
                        request.quantity = foundProduct.quantity;
                        request.shelfNo = foundProduct.shelfNo;
                        if (request.quantity > foundProduct.quantity) {
                            this.toasterService.error("Toplanacak miktar mevcut miktarı aşamaz");
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.orderService.addCollectedProductsOfRetailOrder(request)];
                    case 3:
                        response = _c.sent();
                        if (!response) return [3 /*break*/, 5];
                        this.toasterService.success("Ürün toplama işlemi başarılı");
                        // this.collectedProducts.push(productModel);
                        this.productsToCollect = this.productsToCollect.filter(function (o) { return o.barcode != productModel.barcode; });
                        this.checkForm.reset();
                        return [4 /*yield*/, this.getAllProductsOfOrder(this.orderNo)];
                    case 4:
                        _c.sent();
                        //selam
                        this.focusNextInput("shelfNo");
                        return [3 /*break*/, 6];
                    case 5:
                        this.toasterService.error("Ürün toplama işlemi başarısız");
                        _c.label = 6;
                    case 6:
                        (_b = this.checkForm.get("barcode")) === null || _b === void 0 ? void 0 : _b.setValue("");
                        this.focusNextInput("barcode");
                        return [2 /*return*/];
                }
            });
        });
    };
    CollectProductOfOrderComponent = __decorate([
        core_1.Component({
            selector: 'app-collect-product-of-order',
            templateUrl: './collect-product-of-order.component.html',
            styleUrls: ['./collect-product-of-order.component.css']
        })
    ], CollectProductOfOrderComponent);
    return CollectProductOfOrderComponent;
}());
exports.CollectProductOfOrderComponent = CollectProductOfOrderComponent;
