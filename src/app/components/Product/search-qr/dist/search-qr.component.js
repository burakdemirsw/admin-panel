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
exports.SearchQrComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var library_1 = require("@zxing/library");
var product_service_1 = require("src/app/services/admin/product.service");
var SearchQrComponent = /** @class */ (function () {
    function SearchQrComponent(toasterService, productService, formBuilder, sanitizer, httpClientService, activatedRoute, headerService, generalService) {
        this.toasterService = toasterService;
        this.productService = productService;
        this.formBuilder = formBuilder;
        this.sanitizer = sanitizer;
        this.httpClientService = httpClientService;
        this.activatedRoute = activatedRoute;
        this.headerService = headerService;
        this.generalService = generalService;
        this.qrCodes = [];
        this.showImage = false; // add this property
        this.view = true;
        this.currentId = null;
        this.invoiceProducts2 = [];
        this.qrCodeDownloadLink = this.sanitizer.bypassSecurityTrustResourceUrl('');
        this.selectedProductList = [];
        this.visible = false;
        this._products = [];
        this.groupedProducts = [];
        //-------------------------------------------
        this.overlayOptions = {
            appendTo: 'body',
            autoZIndex: true,
            baseZIndex: 1000,
            styleClass: 'custom-overlay-class' // Custom CSS class
        };
        this.brands = [];
        this.itemCodes = [];
        this.shelfNos = [];
        // targetShelfs: any[] = []
        this.descriptions = [];
        this.productHierarchyLevel01s = [];
        this.productHierarchyLevel02s = [];
        this.productHierarchyLevel03s = [];
        this.allProducts = [];
    }
    SearchQrComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.headerService.updatePageTitle("Ürün & Qr Sorgulama");
                this.activatedRoute.params.subscribe(function (params) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                this.currentId = params['id'];
                                if (!(this.currentId != null)) return [3 /*break*/, 2];
                                return [4 /*yield*/, this.getProducts(this.currentId)];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2: return [2 /*return*/];
                        }
                    });
                }); });
                //this.spinnerService.show();
                this.formGenerator();
                return [2 /*return*/];
            });
        });
    };
    SearchQrComponent.prototype.createJson = function (barcode, shelfNo) {
        var model = this.qrCodes.find(function (p) { return (p.barcode = barcode) && p.shelfNo == shelfNo; });
        var formDataJSON = JSON.stringify(model.barcode + "--" + model.batchCode + "--" + model.itemCode); // Form verilerini JSON'a dönüştür
        this.qrCodeValue = formDataJSON;
        // this.toasterService.success(this.qrCodeValue)
    };
    SearchQrComponent.prototype.openImageModal = function (imageUrl) {
        this.modalImageUrl = imageUrl;
        if (!this.formModal) {
            this.formModal = new window.bootstrap.Modal(document.getElementById('myModal'));
        }
        this.formModal.show();
    };
    SearchQrComponent.prototype.onChangeURL = function (url) {
        this.qrCodeDownloadLink = url;
        this.openImageModal(this.qrCodeDownloadLink);
        this.qrCodeValue = '';
    };
    SearchQrComponent.prototype.formGenerator = function () {
        try {
            this.qrForm = this.formBuilder.group({
                barcode: [null, forms_1.Validators.required]
            });
        }
        catch (error) {
            this.toasterService.error(error.message);
        }
    };
    SearchQrComponent.prototype.openShelvesModal = function (id) {
        this.visible = true;
    };
    SearchQrComponent.prototype.print = function (base64Code) {
        return __awaiter(this, void 0, void 0, function () {
            var confirmDelete2, requestModel, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        confirmDelete2 = window.confirm("Yazıcıdan Yazdırılacaktır. Emin misiniz?");
                        if (!confirmDelete2) return [3 /*break*/, 2];
                        requestModel = { imageCode: base64Code, printCount: 1 };
                        return [4 /*yield*/, this.httpClientService.post({ controller: 'Order/Qr' }, requestModel).toPromise()];
                    case 1:
                        response = _a.sent();
                        // Base64 veriyi konsola bas
                        if (response) {
                            this.toasterService.success("Yazdırıldı");
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    SearchQrComponent.prototype.getProducts = function (barcode) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.generalService.isGuid(barcode) || barcode.includes('http'))) return [3 /*break*/, 4];
                        this._products = [];
                        if (!(this.currentId || barcode)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.productService.getQr(barcode)];
                    case 1:
                        response = _a.sent();
                        this.qrCodes = response;
                        return [2 /*return*/, response];
                    case 2: throw new library_1.Exception("id alanı boş");
                    case 3: return [3 /*break*/, 6];
                    case 4:
                        this.qrCodes = [];
                        return [4 /*yield*/, this.getProducts2(barcode)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    SearchQrComponent.prototype.groupProductsByWarehouse = function () {
        var grouped = this._products.reduce(function (acc, product) {
            var warehouseCode = product.warehouseCode;
            if (!acc[warehouseCode]) {
                acc[warehouseCode] = { warehouseCode: warehouseCode, products: [] };
            }
            acc[warehouseCode].products.push(product);
            return acc;
        }, {});
        this.groupedProducts = Object.values(grouped);
    };
    SearchQrComponent.prototype.calculateTotalStock = function (products) {
        return products.reduce(function (sum, product) { return sum + product.quantity; }, 0);
    };
    SearchQrComponent.prototype.calculateTotalShelfStock = function (products) {
        return products.reduce(function (sum, product) { return sum + product.shelfQuantity; }, 0);
    };
    SearchQrComponent.prototype.getProducts2 = function (barcode) {
        return __awaiter(this, void 0, void 0, function () {
            var model, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (barcode.includes("=")) {
                            barcode = barcode.replace(/=/g, "-");
                        }
                        model = new product_service_1.BarcodeSearch_RM(barcode);
                        this.focusNextInput('barcode');
                        this.qrForm.reset();
                        return [4 /*yield*/, this.productService._searchProduct(model)];
                    case 1:
                        response = _a.sent();
                        this._products = response;
                        this.groupProductsByWarehouse();
                        return [2 /*return*/, response];
                    case 2:
                        error_1 = _a.sent();
                        console.log(error_1.message);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SearchQrComponent.prototype.clearBarcode = function () {
        this.qrForm.get('barcode').setValue(null);
        this.focusNextInput('barcode');
    };
    SearchQrComponent.prototype.focusNextInput = function (nextInputId) {
        var nextInput = document.getElementById(nextInputId);
        if (nextInput) {
            nextInput.focus();
        }
    };
    SearchQrComponent.prototype.onSubmit = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // await this.getProducts(value.barcode);
                    return [4 /*yield*/, this.getAllProducts()];
                    case 1:
                        // await this.getProducts(value.barcode);
                        _a.sent();
                        this.toasterService.success(value.barcode);
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchQrComponent.prototype.getAllProducts = function () {
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
                        this.mapProducts(this.allProducts);
                        _b.label = 2;
                    case 2:
                        this.toasterService.success('Tüm Ürünler Getirildi');
                        return [2 /*return*/];
                }
            });
        });
    };
    SearchQrComponent.prototype.mapProducts = function (data) {
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
    SearchQrComponent.prototype.logFilteredData = function (event) {
        try {
            if (event.filteredValue) {
                var list = event.filteredValue;
                this.mapProducts(list);
                this.toasterService.info("Dinamik Search Güncellendi");
            }
        }
        catch (error) {
            this.toasterService.error(error.message);
        }
    };
    SearchQrComponent = __decorate([
        core_1.Component({
            selector: 'app-search-qr',
            templateUrl: './search-qr.component.html',
            styleUrls: ['./search-qr.component.css']
        })
    ], SearchQrComponent);
    return SearchQrComponent;
}());
exports.SearchQrComponent = SearchQrComponent;
