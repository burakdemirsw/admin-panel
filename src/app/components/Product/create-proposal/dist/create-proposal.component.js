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
exports.CreateProposalComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var proposalProduct_SM_1 = require("src/app/models/model/product/proposalProduct_SM");
var product_service_1 = require("src/app/services/admin/product.service");
var CreateProposalComponent = /** @class */ (function () {
    function CreateProposalComponent(generalService, toasterService, headerService, router, activatedRoute, productService, formBuilder, sanitizer, httpClientService, orderService) {
        this.generalService = generalService;
        this.toasterService = toasterService;
        this.headerService = headerService;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.productService = productService;
        this.formBuilder = formBuilder;
        this.sanitizer = sanitizer;
        this.httpClientService = httpClientService;
        this.orderService = orderService;
        this.currentPage = 1;
        this.searchedProductDialog = false;
        this._products = [];
        this.products = [];
        this.selectedProducts = [];
        this.selectedProductList = [];
        this.visible = false;
        this.suggestedProducts = [];
        this.suggestedProductsDialog = false;
    }
    CreateProposalComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.headerService.updatePageTitle("Teklif Oluştur");
                this.formGenerator();
                this.activatedRoute.params.subscribe(function (p) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!p["id"]) return [3 /*break*/, 2];
                                this.proposalId = p["id"];
                                return [4 /*yield*/, this.getProposalProducts(this.proposalId)];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    CreateProposalComponent.prototype.deleteProposalProduct = function (proposalId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.productService.deleteProposalProduct(proposalId)];
                    case 1:
                        response = _a.sent();
                        if (!response) return [3 /*break*/, 3];
                        this.toasterService.success("Silindi");
                        return [4 /*yield*/, this.getProposalProducts(this.proposalId)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CreateProposalComponent.prototype.getProposalProducts = function (proposalId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.productService.getProposalProducts(proposalId)];
                    case 1:
                        response = _a.sent();
                        this.selectedProducts = response;
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateProposalComponent.prototype.addProposalProduct = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var _request, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _request = new proposalProduct_SM_1.ZTMSG_ProposalProduct();
                        _request.operationId = request.operationId;
                        _request.lineId = request.lineId;
                        _request.barcode = request.barcode;
                        _request.description = request.description;
                        _request.warehouseCode = request.warehouseCode;
                        _request.photoUrl = request.photoUrl;
                        _request.shelfNo = request.shelfNo;
                        _request.itemCode = request.itemCode;
                        _request.batchCode = request.batchCode;
                        _request.price = request.price;
                        _request.discountedPrice = request.discountedPrice;
                        _request.basePrice = request.basePrice;
                        _request.quantity = request.quantity;
                        _request.quantity2 = request.quantity2;
                        _request.taxRate = request.taxRate;
                        _request.operationId = this.proposalId;
                        return [4 /*yield*/, this.productService.addProposalProduct(_request)];
                    case 1:
                        response = _a.sent();
                        if (!response) return [3 /*break*/, 3];
                        this.toasterService.success("Eklendi");
                        this.searchedProductDialog = false;
                        return [4 /*yield*/, this.getProposalProducts(this.proposalId)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CreateProposalComponent.prototype.searchProposalProducts = function (model) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.productService.searchProposalProducts(model)];
                    case 1:
                        response = _a.sent();
                        this._products = response;
                        if (!(this._products.length > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getProducts(this._products[0].barcode)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: 
                    // this.searchedProductDialog = true;
                    return [2 /*return*/, response];
                    case 4:
                        error_1 = _a.sent();
                        console.log(error_1.message);
                        return [2 /*return*/, null];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    CreateProposalComponent.prototype.formGenerator = function () {
        try {
            this.getProductsForm = this.formBuilder.group({
                // photoUrl: [null],
                itemCode: [null, forms_1.Validators.required]
            });
        }
        catch (error) {
            this.toasterService.error(error.message);
        }
    };
    CreateProposalComponent.prototype.openShelvesModal = function (id) {
        this.visible = true;
    };
    CreateProposalComponent.prototype.clearBarcode = function () {
        this.getProductsForm.get('barcode').setValue(null);
        this.focusNextInput('barcode');
    };
    CreateProposalComponent.prototype.focusNextInput = function (nextInputId) {
        var nextInput = document.getElementById(nextInputId);
        if (nextInput) {
            nextInput.focus();
        }
    };
    CreateProposalComponent.prototype.getProducts = function (barcode) {
        return __awaiter(this, void 0, void 0, function () {
            var result, _request, response, totalQuantity, _i, _a, _product, error_2;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 15, , 16]);
                        if (!(barcode.includes('http') || this.generalService.isGuid(barcode))) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.productService.countProductByBarcode3(barcode)];
                    case 1:
                        result = _b.sent();
                        if (result == null) {
                            this.toasterService.error("Qr Sorgusu Hatalı");
                            return [2 /*return*/];
                        }
                        this.getProductsForm.get('barcode').setValue(result[3]);
                        barcode = result[3];
                        this.getProducts(barcode);
                        this.toasterService.success("Form Verileri Güncellendi");
                        return [2 /*return*/];
                    case 2:
                        _request = new product_service_1.BarcodeSearch_RM();
                        _request.barcode = barcode;
                        return [4 /*yield*/, this.productService.searchProduct4(_request)];
                    case 3:
                        response = _b.sent();
                        if (!(response.length == 0)) return [3 /*break*/, 5];
                        this.toasterService.error("Ürün Sorgusundan Yanıt Alınamadı");
                        return [4 /*yield*/, this.getsuggestedProducts(_request.barcode, true)];
                    case 4:
                        _b.sent();
                        this.getProductsForm.get('barcode').setValue(null);
                        return [2 /*return*/];
                    case 5:
                        this.products = response;
                        if (!(this.products.length > 0)) return [3 /*break*/, 13];
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
                        if (!(totalQuantity >= this.products[0].quantity)) return [3 /*break*/, 7];
                        this.toasterService.error("STOK HATASI");
                        this.products = [];
                        this.getProductsForm.get('barcode').setValue(null);
                        return [4 /*yield*/, this.getsuggestedProducts(_request.barcode, true)];
                    case 6:
                        _b.sent();
                        return [2 /*return*/];
                    case 7:
                        this.toasterService.success(this.products.length + " Adet Ürün Bulundu");
                        _i = 0, _a = this.products;
                        _b.label = 8;
                    case 8:
                        if (!(_i < _a.length)) return [3 /*break*/, 11];
                        _product = _a[_i];
                        return [4 /*yield*/, this.addProposalProduct(_product)];
                    case 9:
                        _b.sent();
                        _b.label = 10;
                    case 10:
                        _i++;
                        return [3 /*break*/, 8];
                    case 11:
                        this.getProductsForm.get('barcode').setValue(null);
                        this.products = [];
                        _b.label = 12;
                    case 12: return [3 /*break*/, 14];
                    case 13:
                        this.toasterService.error("Ürün Bulunamadı");
                        _b.label = 14;
                    case 14:
                        this.getProductsForm.get('barcode').setValue(null);
                        return [2 /*return*/];
                    case 15:
                        error_2 = _b.sent();
                        return [2 /*return*/];
                    case 16: return [2 /*return*/];
                }
            });
        });
    };
    CreateProposalComponent.prototype.routeGetProduct = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.getProductsForm.get('barcode').setValue(request);
                        return [4 /*yield*/, this.getProducts(this.getProductsForm.value)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateProposalComponent.prototype.getsuggestedProducts = function (itemCode, openDialog) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.suggestedProducts = [];
                        return [4 /*yield*/, this.orderService.getSuggestedProducts(itemCode)];
                    case 1:
                        response = _a.sent();
                        this.suggestedProducts = response;
                        if (openDialog) {
                            this.openDialog("suggestedProductsDialog");
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateProposalComponent.prototype.openDialog = function (dialogName) {
        if (dialogName === "suggestedProductsDialog") {
            this.suggestedProductsDialog = !this.suggestedProductsDialog;
        }
    };
    CreateProposalComponent = __decorate([
        core_1.Component({
            selector: 'app-create-proposal',
            templateUrl: './create-proposal.component.html',
            styleUrl: './create-proposal.component.css'
        })
    ], CreateProposalComponent);
    return CreateProposalComponent;
}());
exports.CreateProposalComponent = CreateProposalComponent;
