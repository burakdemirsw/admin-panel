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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.ProductCatalogComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var transferRequestListModel_1 = require("src/app/models/model/warehouse/transferRequestListModel");
var product_service_1 = require("src/app/services/admin/product.service");
var ProductCatalogComponent = /** @class */ (function () {
    function ProductCatalogComponent(toasterService, productService, formBuilder, sanitizer, httpClientService, activatedRoute, headerService, generalService, catalogService, router) {
        this.toasterService = toasterService;
        this.productService = productService;
        this.formBuilder = formBuilder;
        this.sanitizer = sanitizer;
        this.httpClientService = httpClientService;
        this.activatedRoute = activatedRoute;
        this.headerService = headerService;
        this.generalService = generalService;
        this.catalogService = catalogService;
        this.router = router;
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
        this.descriptions = [];
        this.productHierarchyLevel01s = [];
        this.productHierarchyLevel02s = [];
        this.productHierarchyLevel03s = [];
        // Seçilen filtreleme değerleri
        this.selectedBrand = '';
        this.selectedItemCode = '';
        this.selectedShelfNo = '';
        this.selectedDescription = '';
        this.selectedHierarchy1 = '';
        this.selectedHierarchy2 = '';
        this.selectedHierarchy3 = '';
        this.allProducts = [];
        this.filteredProducts = [];
        this.basketProducts = [];
        this.itemsPerPage = 112; // İlk sayfa boyutu
        this.paginatedProducts = []; // Sayfalama için gösterilecek ürünler
    }
    ProductCatalogComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.headerService.updatePageTitle("Katalog Oluşturma");
                this.activatedRoute.params.subscribe(function (params) { return __awaiter(_this, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = this;
                                return [4 /*yield*/, this.productService.searchProduct5()];
                            case 1:
                                _a.allProducts = _b.sent();
                                this.currentId = params['id'];
                                if (!(this.currentId != null)) return [3 /*break*/, 5];
                                return [4 /*yield*/, this.getAllProducts()];
                            case 2:
                                _b.sent();
                                return [4 /*yield*/, this.getHeader()
                                    // this.toasterService.success(this.currentId)
                                ];
                            case 3:
                                _b.sent();
                                // this.toasterService.success(this.currentId)
                                return [4 /*yield*/, this.getProducts(this.currentId)];
                            case 4:
                                // this.toasterService.success(this.currentId)
                                _b.sent();
                                _b.label = 5;
                            case 5: return [2 /*return*/];
                        }
                    });
                }); });
                //this.spinnerService.show();
                this.formGenerator();
                return [2 /*return*/];
            });
        });
    };
    ProductCatalogComponent.prototype.getHeader = function () {
        return __awaiter(this, void 0, void 0, function () {
            var r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.catalogService.getCatalogHeaderById(this.currentId)];
                    case 1:
                        r = _a.sent();
                        this.catalogHeader = r;
                        return [2 /*return*/];
                }
            });
        });
    };
    ProductCatalogComponent.prototype.addHeader = function () {
        return __awaiter(this, void 0, void 0, function () {
            var request, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request = new transferRequestListModel_1.CatalogHeader();
                        request.createdDate = this.generalService.getCurrentDatetime_2();
                        request.updatedDate = this.generalService.getCurrentDatetime_2();
                        request.description = this.headerDesc;
                        request.id = this.currentId;
                        return [4 /*yield*/, this.catalogService.addCatalogHeader(request)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            this.catalogHeader = response;
                            this.toasterService.success("Başlık Eklendi");
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ProductCatalogComponent.prototype.udpateHeader = function () {
        var request = new transferRequestListModel_1.CatalogHeader();
        request.createdDate = this.generalService.getCurrentDatetime_2();
        request.updatedDate = this.generalService.getCurrentDatetime_2();
        request.description = this.headerDesc;
        request.id = this.catalogHeader.id;
    };
    ProductCatalogComponent.prototype.createJson = function (barcode, shelfNo) {
        var model = this.qrCodes.find(function (p) { return (p.barcode = barcode) && p.shelfNo == shelfNo; });
        var formDataJSON = JSON.stringify(model.barcode + "--" + model.batchCode + "--" + model.itemCode); // Form verilerini JSON'a dönüştür
        this.qrCodeValue = formDataJSON;
        // this.toasterService.success(this.qrCodeValue)
    };
    ProductCatalogComponent.prototype.openImageModal = function (imageUrl) {
    };
    ProductCatalogComponent.prototype.onChangeURL = function (url) {
        this.qrCodeDownloadLink = url;
        this.openImageModal(this.qrCodeDownloadLink);
        this.qrCodeValue = '';
    };
    ProductCatalogComponent.prototype.formGenerator = function () {
        try {
            this.qrForm = this.formBuilder.group({
                barcode: [null, forms_1.Validators.required]
            });
        }
        catch (error) {
            this.toasterService.error(error.message);
        }
    };
    ProductCatalogComponent.prototype.openShelvesModal = function (id) {
        this.visible = true;
    };
    ProductCatalogComponent.prototype.print = function (base64Code) {
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
    ProductCatalogComponent.prototype.getProducts = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.catalogService.getCatalogProducts(id)];
                    case 1:
                        _a.basketProducts = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProductCatalogComponent.prototype.groupProductsByWarehouse = function () {
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
    ProductCatalogComponent.prototype.calculateTotalStock = function (products) {
        return products.reduce(function (sum, product) { return sum + product.quantity; }, 0);
    };
    ProductCatalogComponent.prototype.calculateTotalShelfStock = function (products) {
        return products.reduce(function (sum, product) { return sum + product.shelfQuantity; }, 0);
    };
    ProductCatalogComponent.prototype.getProducts2 = function (barcode) {
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
    ProductCatalogComponent.prototype.clearBarcode = function () {
        this.qrForm.get('barcode').setValue(null);
        this.focusNextInput('barcode');
    };
    ProductCatalogComponent.prototype.focusNextInput = function (nextInputId) {
        var nextInput = document.getElementById(nextInputId);
        if (nextInput) {
            nextInput.focus();
        }
    };
    ProductCatalogComponent.prototype.onSubmit = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // await this.getProducts(value.barcode);
                    return [4 /*yield*/, this.getAllProducts()];
                    case 1:
                        // await this.getProducts(value.barcode);
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProductCatalogComponent.prototype.getAllProducts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.productService.searchProduct5()];
                    case 1:
                        _a.allProducts = _b.sent();
                        this.mapProducts(this.allProducts);
                        this.filterProducts(); // İlk başta tüm ürünleri göstermek için çağrılır
                        return [2 /*return*/];
                }
            });
        });
    };
    ProductCatalogComponent.prototype.mapProducts = function (data) {
        var uniqueMap = function (array, key) {
            var map = new Map();
            array.forEach(function (item) {
                if (!map.has(item[key])) {
                    map.set(item[key], item[key]);
                }
            });
            return Array.from(map.values()).sort(function (a, b) { return a.localeCompare(b); });
        };
        this.shelfNos = uniqueMap(data, 'shelfNo');
        this.brands = uniqueMap(data, 'brand');
        this.itemCodes = uniqueMap(data, 'itemCode');
        this.descriptions = uniqueMap(data, 'description');
        this.productHierarchyLevel01s = uniqueMap(data, 'productHierarchyLevel01');
        this.productHierarchyLevel02s = uniqueMap(data, 'productHierarchyLevel02');
        this.productHierarchyLevel03s = uniqueMap(data, 'productHierarchyLevel03');
        // Filtreleme işlemi için verileri ilk başta doldurur
        this.filteredProducts = __spreadArrays(data);
    };
    ProductCatalogComponent.prototype.filterProducts = function () {
        var _this = this;
        this.filteredProducts = this.allProducts.filter(function (product) {
            return ((_this.selectedBrand ? product.brand === _this.selectedBrand : true) &&
                (_this.selectedItemCode ? product.itemCode === _this.selectedItemCode : true) &&
                (_this.selectedShelfNo ? product.shelfNo === _this.selectedShelfNo : true) &&
                (_this.selectedDescription ? product.description === _this.selectedDescription : true) &&
                (_this.selectedHierarchy1 ? product.productHierarchyLevel01 === _this.selectedHierarchy1 : true) &&
                (_this.selectedHierarchy2 ? product.productHierarchyLevel02 === _this.selectedHierarchy2 : true) &&
                (_this.selectedHierarchy3 ? product.productHierarchyLevel03 === _this.selectedHierarchy3 : true));
        });
        this.paginatedProducts = this.filteredProducts.slice(0, this.itemsPerPage);
        this.mapProducts(this.filteredProducts);
    };
    ProductCatalogComponent.prototype.getPrice = function (price) {
        return Number(price).toFixed(2);
    };
    // Filtre seçimi değiştiğinde çağrılan fonksiyon
    ProductCatalogComponent.prototype.onFilterChange = function () {
        this.filterProducts();
    };
    ProductCatalogComponent.prototype.addToBasket = function (product) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.catalogHeader) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.addHeader()];
                    case 1:
                        _a.sent();
                        if (!!this.catalogHeader) return [3 /*break*/, 2];
                        return [2 /*return*/];
                    case 2: return [4 /*yield*/, this._addToBasket(product)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, this._addToBasket(product)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    ProductCatalogComponent.prototype._addToBasket = function (product) {
        return __awaiter(this, void 0, void 0, function () {
            var index, request, id, delete_response, request, add_response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        index = this.basketProducts.findIndex(function (basketProduct) { return basketProduct.itemCode === product.itemCode; });
                        if (!(index > -1)) return [3 /*break*/, 4];
                        request = this.convertToCatalogProduct(product);
                        id = this.basketProducts.find(function (p) { return p.itemCode == product.itemCode; }).id;
                        return [4 /*yield*/, this.catalogService.deleteCatalogProduct(id)];
                    case 1:
                        delete_response = _a.sent();
                        if (!delete_response) return [3 /*break*/, 3];
                        this.toasterService.info("Ürün çıkarıldı");
                        return [4 /*yield*/, this.getProducts(this.currentId)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [3 /*break*/, 7];
                    case 4:
                        request = this.convertToCatalogProduct(product);
                        return [4 /*yield*/, this.catalogService.addCatalogProduct(request)];
                    case 5:
                        add_response = _a.sent();
                        if (!add_response) return [3 /*break*/, 7];
                        this.toasterService.success("Eklendi");
                        return [4 /*yield*/, this.getProducts(this.currentId)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    ProductCatalogComponent.prototype.checkProduct = function (product) {
        return this.basketProducts.some(function (basketProduct) { return basketProduct.itemCode === product.itemCode; });
    };
    // Sayfalama değişikliklerini yönetmek için kullanılan fonksiyon
    ProductCatalogComponent.prototype.onPageChange = function (event) {
        this.itemsPerPage = event.rows;
        var start = event.first;
        var end = start + this.itemsPerPage;
        this.paginatedProducts = this.filteredProducts.slice(start, end);
    };
    ProductCatalogComponent.prototype.convertToCatalogProduct = function (product) {
        return {
            id: null,
            headerId: this.catalogHeader.id,
            barcode: product.barcode,
            itemCode: product.itemCode,
            shelfNo: product.shelfNo,
            drawerCount: product.drawerCount,
            transferQuantity: product.transferQuantity,
            targetShelf: product.targetShelf,
            quantity: product.quantity,
            productHierarchyLevel01: product.productHierarchyLevel01,
            productHierarchyLevel02: product.productHierarchyLevel02,
            productHierarchyLevel03: product.productHierarchyLevel03,
            speed: product.speed,
            inventory: product.inventory,
            brand: product.brand,
            photoUrl: product.photoUrl,
            price: product.price,
            description: product.description,
            attribute1: product.attribute1,
            attribute2: product.attribute2,
            currencyCode: product.currencyCode,
            batchCode: product.batchCode
        };
    };
    ProductCatalogComponent.prototype.createCatalogRaport = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.catalogService.createCatalogReport(id)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProductCatalogComponent.prototype.deleteBasketProducts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, p, delete_response;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, _a = this.basketProducts;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        p = _a[_i];
                        return [4 /*yield*/, this.catalogService.deleteCatalogProduct(p.id)];
                    case 2:
                        delete_response = _b.sent();
                        if (!delete_response) return [3 /*break*/, 4];
                        this.toasterService.info("Ürün çıkarıldı");
                        return [4 /*yield*/, this.getProducts(this.currentId)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ProductCatalogComponent.prototype.selectFilteredProducts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var requests, _i, _a, p, index, _request, add_response;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        requests = [];
                        for (_i = 0, _a = this.filteredProducts; _i < _a.length; _i++) {
                            p = _a[_i];
                            index = this.basketProducts.findIndex(function (basketProduct) { return basketProduct.itemCode === p.itemCode; });
                            if (index > -1) {
                                continue;
                            }
                            else {
                                _request = this.convertToCatalogProduct(p);
                                requests.push(_request);
                            }
                        }
                        if (!(requests.length > 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.catalogService.addCatalogProductBatch(requests)];
                    case 1:
                        add_response = _b.sent();
                        if (!add_response) return [3 /*break*/, 3];
                        this.toasterService.success("Eklendi");
                        return [4 /*yield*/, this.getProducts(this.currentId)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        this.toasterService.error('Daha Önce Eklendi');
                        _b.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ProductCatalogComponent = __decorate([
        core_1.Component({
            selector: 'app-product-catalog',
            templateUrl: './product-catalog.component.html',
            styleUrl: './product-catalog.component.css'
        })
    ], ProductCatalogComponent);
    return ProductCatalogComponent;
}());
exports.ProductCatalogComponent = ProductCatalogComponent;
