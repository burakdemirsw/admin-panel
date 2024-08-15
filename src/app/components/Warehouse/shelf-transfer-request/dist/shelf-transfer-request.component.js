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
exports.ShelfTransferRequestComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var ClientUrls_1 = require("src/app/models/const/ClientUrls");
var countProductRequestModel_1 = require("src/app/models/model/order/countProductRequestModel");
var orderStatus_1 = require("src/app/models/model/order/orderStatus");
var qrOperationModel_1 = require("src/app/models/model/product/qrOperationModel");
var ShelfTransferRequestComponent = /** @class */ (function () {
    function ShelfTransferRequestComponent(formBuilder, toasterService, orderService, router, httpClient, activatedRoute, productService, warehouseService, generalService, title, headerService) {
        this.formBuilder = formBuilder;
        this.toasterService = toasterService;
        this.orderService = orderService;
        this.router = router;
        this.httpClient = httpClient;
        this.activatedRoute = activatedRoute;
        this.productService = productService;
        this.warehouseService = warehouseService;
        this.generalService = generalService;
        this.title = title;
        this.headerService = headerService;
        this.lastCollectedProducts = [];
        this.collectedProducts = [];
        this.process = false;
        this.activeTab = 1;
        this.pageDescription = null;
        this.shelfNumbers = 'RAFLAR:';
        this.selectedFilter = '';
        this.searchText = '';
        this.url2 = ClientUrls_1.ClientUrls.baseUrl + '/Order/CountTransferProductPuschase';
        this.totalCount = 0;
        this.orderBillingList = [];
        this.itemBillingModels = [];
        this.warehouseModels = [];
        this.shelfNo = null;
        this.shelfNoList = [];
        this.barcodeValue = null; // Değişkeni tanımlayın
        this.currentPage = 1;
        this.lastCollectedProduct = null;
        this.transferProducts = [];
        this._transferProducts = [];
        this.__transferProducts = [];
        this.transferProductsColums = [
            'Id',
            'Stok Kodu',
            'Raf',
            'Transfer Miktarı',
            'Hedef Raf',
            'Miktar',
            'Barkod',
            'Çekmece Adedi',
            'İşlemler',
        ];
        this._transferProductsColums = [
            'Id',
            'Stok Kodu',
            'Raf',
            'Transfer Miktarı',
            'Hedef Raf',
            'Miktar',
            'Barkod',
            'Çekmece Adedi',
            'İşlem',
        ];
        this.__transferProductsColumns = [
            'Barkod',
            'Stok Kodu',
            'Raf No',
            'Çekmece Adedi',
            'Transfer Miktarı',
            'Hedef Raf',
            'Miktar',
            'Ürün Hiyerarşisi Düzey 01',
            'Ürün Hiyerarşisi Düzey 02',
            'Ürün Hiyerarşisi Düzey 03',
            'Hız',
            'Envanter' // Inventory
        ];
        this.offices = ['M', 'U'];
        this.warehouses = ['MD', 'UD'];
        this.collectedFastTransferModels = [];
        this.productShelvesDialog = false;
        this.productShelves = [];
        this.deletedProductList = [];
        this.selectedButton = 0;
        this.brands = [];
        this.itemCodes = [];
        this.shelfNos = [];
        // targetShelfs: any[] = []
        this.descriptions = [];
        this.productHierarchyLevel01s = [];
        this.productHierarchyLevel02s = [];
        this.productHierarchyLevel03s = [];
        this.baglist = ['2', '4', '5', '6', '7', '8', '0'];
        this.qrBarcodeUrl = null;
        this.qrOperationModels = [];
    }
    ShelfTransferRequestComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.title.setTitle('Raf Aktarma İsteği');
                this.headerService.updatePageTitle('Raf Aktarma İsteği');
                //this.spinnerService.show();
                this.formGenerator();
                // this.currentOrderNo = (await this.generalService.generateGUID()).toString();
                this.activatedRoute.params.subscribe(function (params) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (params['shelfNo']) {
                                    this.toasterService.success(params['shelfNo']);
                                    this.shelfNo = params['shelfNo'];
                                }
                                if (!params['operationNo']) return [3 /*break*/, 2];
                                this.currentOrderNo = 'REQ-' + params['operationNo'];
                                this.currentPageType = params['type'];
                                return [4 /*yield*/, this.getFastTransferModels()];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2:
                                if (!params['type']) return [3 /*break*/, 4];
                                return [4 /*yield*/, this.getTransferRequestListModel(params['type'])];
                            case 3:
                                _a.sent();
                                _a.label = 4;
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                this.addOperationStatus();
                this.collectedProducts = [];
                return [2 /*return*/];
            });
        });
    };
    ShelfTransferRequestComponent.prototype.addOperationStatus = function () {
        return __awaiter(this, void 0, void 0, function () {
            var request, _a, response;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        request = new orderStatus_1.OrderStatus();
                        _a = request;
                        return [4 /*yield*/, this.generalService.generateGUID()];
                    case 1:
                        _a.id = _b.sent();
                        request.orderNo = this.currentOrderNo;
                        request.status = 'Raf Transfer İsteği';
                        request.warehousePerson = localStorage.getItem('name') + ' ' + localStorage.getItem('surname');
                        request.createdDate = new Date();
                        return [4 /*yield*/, this.orderService.addOrderStatus(request)];
                    case 2:
                        response = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ShelfTransferRequestComponent.prototype.goPage = function (pageType) {
        location.href =
            location.origin +
                '/shelf-transfer-request/' +
                this.currentOrderNo.split('REQ-')[1] +
                '/' +
                pageType;
    };
    ShelfTransferRequestComponent.prototype.getFastTransferModels = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.warehouseService.getFastTransferModels(this.currentOrderNo)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            this.collectedFastTransferModels = response;
                            this.calculateTotalQty();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ShelfTransferRequestComponent.prototype.deleteFastTransferModel = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.warehouseService.deleteFastTransferModel(request)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            this.toasterService.success('Başarılı');
                            this.getFastTransferModels();
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
    ShelfTransferRequestComponent.prototype.addFastTransferModel = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.warehouseService.addFastTransferModel(request)];
                    case 1:
                        response = _a.sent();
                        if (!response) return [3 /*break*/, 3];
                        this.toasterService.success('Başarılı');
                        return [4 /*yield*/, this.getFastTransferModels()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 3:
                        this.toasterService.error('Başarısız');
                        return [2 /*return*/, false];
                }
            });
        });
    };
    //-------------------
    ShelfTransferRequestComponent.prototype.getShelves = function (barcode) {
        return __awaiter(this, void 0, void 0, function () {
            var newResponse, shelves;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.productService.countProductByBarcode(barcode)];
                    case 1:
                        newResponse = _a.sent();
                        shelves = newResponse[0]
                            .split(',')
                            .filter(function (raflar) { return raflar.trim() !== ''; });
                        this.productShelves = shelves;
                        this.productShelvesDialog = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    ShelfTransferRequestComponent.prototype.setShelveToForm = function (shelve) {
        this.checkForm.get('shelfNo').setValue(shelve);
        this.toasterService.success('Raf Yerleştirildi');
        this.productShelvesDialog = false;
    };
    //-------------------
    ShelfTransferRequestComponent.prototype.goDown2 = function (barcode, shelfNo, itemCode, transferQuantity) {
        if (this.currentPageType != '4') {
            // packageNo'ya eşleşen ProductOfOrder'ı bulun
            var matchingProduct = this.transferProducts.find(function (product) {
                return product.barcode === barcode &&
                    product.shelfNo == shelfNo &&
                    product.itemCode == itemCode &&
                    product.transferQuantity == transferQuantity;
            });
            if (matchingProduct) {
                // Ürünü diziden çıkarın
                var index = this.transferProducts.indexOf(matchingProduct);
                if (index !== -1) {
                    if (this.transferProducts.length - 1 >= index + 1) {
                        this._transferProducts = [];
                        this._transferProducts.push(this.transferProducts[index + 1]);
                        this.lastCollectedProduct = this.transferProducts[index + 1];
                    }
                    else {
                        this._transferProducts = [];
                        this._transferProducts.push(this.transferProducts[0]);
                    }
                }
            }
        }
        else {
            // packageNo'ya eşleşen ProductOfOrder'ı bulun
            var matchingProduct = this.__transferProducts.find(function (product) {
                return product.barcode === barcode &&
                    product.shelfNo == shelfNo &&
                    product.itemCode == itemCode &&
                    product.transferQuantity == transferQuantity;
            });
            if (matchingProduct) {
                // Ürünü diziden çıkarın
                var index = this.__transferProducts.indexOf(matchingProduct);
                if (index !== -1) {
                    if (this.__transferProducts.length - 1 >= index + 1) {
                        this._transferProducts = [];
                        this._transferProducts.push(this.__transferProducts[index + 1]);
                        this.lastCollectedProduct = this.__transferProducts[index + 1];
                    }
                    else {
                        this._transferProducts = [];
                        this._transferProducts.push(this.__transferProducts[0]);
                    }
                }
            }
        }
    };
    ShelfTransferRequestComponent.prototype.onDataChange = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.transferProducts = [];
                        return [4 /*yield*/, this.getTransferRequestListModel(type)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ShelfTransferRequestComponent.prototype.addDeletedItemList = function (item) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.deletedProductList.push(item);
                        return [4 /*yield*/, this.getTransferRequestListModel(this.selectedButton.toString())];
                    case 1:
                        _a.sent();
                        this.toasterService.info('Ürün Transfer Edilecek Ürünlerden Silindi');
                        this.focusNextInput('barcode');
                        return [2 /*return*/];
                }
            });
        });
    };
    ShelfTransferRequestComponent.prototype.getTransferRequestListModel2 = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            var response, itemsToRemoveIndexes, i, foundedProduct;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.warehouseService.getTransferRequestListModel(type, this.shelfNo)];
                    case 1:
                        response = _a.sent();
                        this.selectedButton = Number(type);
                        //toplanacak ürünler getirildi
                        this.toasterService.success(this.shelfNo + ' Rafına Yapılacak Transferler Getirildi');
                        //toplanacak ürünler atandı
                        this.__transferProducts = response;
                        if (this.deletedProductList.length > 0) {
                            this.deletedProductList.forEach(function (deletedItem) {
                                _this.__transferProducts.forEach(function (inventoryItem, _index) {
                                    if (inventoryItem.barcode === deletedItem.barcode &&
                                        inventoryItem.shelfNo === deletedItem.shelfNo &&
                                        inventoryItem.itemCode === deletedItem.itemCode) {
                                        _this.__transferProducts.splice(_index, 1);
                                    }
                                });
                            });
                        }
                        itemsToRemoveIndexes = [];
                        // inventoryItems üzerinde döngü
                        this.__transferProducts.forEach(function (inventoryItem, index) {
                            //transfer edilcek ürünler
                            // Eşleşme arama ve güncelleme
                            _this.collectedProducts.forEach(function (transferItem) {
                                //toplanan ürünler
                                // barcode, shelfNo ve itemCode değerlerine göre eşleşme kontrolü
                                if (inventoryItem.barcode === transferItem.barcode &&
                                    inventoryItem.targetShelf === transferItem.targetShelfNo &&
                                    inventoryItem.shelfNo === transferItem.shelfNo) {
                                    // Eşleşen üründen quantity değerini çıkart
                                    inventoryItem.transferQuantity -= transferItem.quantity;
                                    // Eğer transfer edilen miktar sonucunda quantity 0 veya daha az ise
                                    if (inventoryItem.transferQuantity <= 0) {
                                        // İlgili inventoryItem'ın çıkarılması için indeksini kaydet
                                        itemsToRemoveIndexes.push(index);
                                    }
                                }
                            });
                        });
                        // Çıkarılacak öğeler için ters döngü (çıkarırken sıralamayı bozmamak için)
                        for (i = itemsToRemoveIndexes.length - 1; i >= 0; i--) {
                            this.collectedProducts.splice(itemsToRemoveIndexes[i], 1);
                        }
                        itemsToRemoveIndexes = [];
                        //--------------------------------------------------------
                        if (this.__transferProducts.length > 0) {
                            if (this.lastCollectedProduct == null) {
                                //üste atılcak ürün seçildi
                                this._transferProducts = [];
                                this._transferProducts.push(this.__transferProducts[0]);
                                this.lastCollectedProduct = this.__transferProducts[0];
                            }
                            else {
                                foundedProduct = this.__transferProducts.find(function (p) {
                                    return p.barcode == _this.lastCollectedProduct.barcode &&
                                        p.itemCode == _this.lastCollectedProduct.itemCode &&
                                        p.shelfNo == _this.lastCollectedProduct.shelfNo;
                                });
                                if (foundedProduct) {
                                    //eğer ürün bulunduysa
                                    if (foundedProduct.quantity > 0) {
                                        //miktar değeri 0 dan büyükse
                                        this._transferProducts = [];
                                        this._transferProducts.push(foundedProduct);
                                        this.lastCollectedProduct = foundedProduct;
                                    }
                                    else {
                                        //miktar değeri 0 dan küçükse
                                        this._transferProducts = [];
                                        this._transferProducts.push(this.__transferProducts[0]);
                                        this.lastCollectedProduct = this.__transferProducts[0];
                                    }
                                }
                                else {
                                    //üürn bulunmdadıysa
                                    this._transferProducts = [];
                                    this._transferProducts.push(this.__transferProducts[0]);
                                    this.lastCollectedProduct = this.__transferProducts[0];
                                }
                            }
                        }
                        this.mapProducts(this.__transferProducts);
                        this.fillShelfNo(2);
                        return [2 /*return*/];
                }
            });
        });
    };
    ShelfTransferRequestComponent.prototype.mapProducts = function (data) {
        var uniqueMap = function (array, key) {
            var map = new Map();
            array.forEach(function (item) {
                if (!map.has(item[key])) {
                    map.set(item[key], { label: item[key], value: item[key] });
                }
            });
            return Array.from(map.values()).sort(function (a, b) { return a.label.localeCompare(b.label); });
        };
        this.shelfNos = uniqueMap(this.__transferProducts, 'shelfNo');
        this.brands = uniqueMap(this.__transferProducts, 'brand');
        this.itemCodes = uniqueMap(this.__transferProducts, 'itemCode');
        // this.targetShelfs = uniqueMap(this.__transferProducts, 'targetShelf');
        this.descriptions = uniqueMap(this.__transferProducts, 'description');
        this.productHierarchyLevel01s = uniqueMap(this.__transferProducts, 'productHierarchyLevel01');
        this.productHierarchyLevel02s = uniqueMap(this.__transferProducts, 'productHierarchyLevel02');
        this.productHierarchyLevel03s = uniqueMap(this.__transferProducts, 'productHierarchyLevel03');
    };
    //tablo filtrelendiğinde en üstte kalanı üste atar
    ShelfTransferRequestComponent.prototype.logFilteredData = function (event) {
        try {
            if (event.filteredValue) {
                console.log('Filtered data:', event.filteredValue);
                var list = event.filteredValue;
                this.lastCollectedProduct = null;
                this._transferProducts = [list[0]];
                this.lastCollectedProduct = list[0];
                this.mapProducts(list);
            }
            else {
                var list = [event];
                this.lastCollectedProduct = null;
                this._transferProducts = [list[0]];
                this.lastCollectedProduct = list[0];
                this.mapProducts(list);
            }
            this.toasterService.info("Hedef Ürün Güncellendi");
        }
        catch (error) {
            this.toasterService.error(error.message);
        }
    };
    ShelfTransferRequestComponent.prototype.getTransferRequestListModel = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            var response, itemsToRemoveIndexes, i, foundedProduct;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(type == '4')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getTransferRequestListModel2(type)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                    case 2: return [4 /*yield*/, this.warehouseService.getTransferRequestListModel(type, this.shelfNo)];
                    case 3:
                        response = _a.sent();
                        this.selectedButton = Number(type);
                        //toplanacak ürünler getirildi
                        if (type === '0') {
                            this.toasterService.success('Varsayılan Ürünler Getirildi');
                        }
                        else if (type === '1') {
                            this.toasterService.success('Raflar Fullendi');
                        }
                        else if (type === '2') {
                            this.toasterService.success('Çanta Ürünleri Getirildi');
                        }
                        else if (type === '3') {
                            this.toasterService.success('Çanta Dan Rafa Ürünleri Getirildi');
                        }
                        //toplanacak ürünler atandı
                        this.transferProducts = response;
                        if (this.deletedProductList.length > 0) {
                            this.deletedProductList.forEach(function (deletedItem) {
                                _this.transferProducts.forEach(function (inventoryItem, _index) {
                                    if (inventoryItem.barcode === deletedItem.barcode &&
                                        inventoryItem.shelfNo === deletedItem.shelfNo &&
                                        inventoryItem.itemCode === deletedItem.itemCode) {
                                        _this.transferProducts.splice(_index, 1);
                                    }
                                });
                            });
                        }
                        itemsToRemoveIndexes = [];
                        // inventoryItems üzerinde döngü
                        this.transferProducts.forEach(function (inventoryItem, index) {
                            //transfer edilcek ürünler
                            // Eşleşme arama ve güncelleme
                            _this.collectedProducts.forEach(function (transferItem) {
                                //toplanan ürünler
                                // barcode, shelfNo ve itemCode değerlerine göre eşleşme kontrolü
                                if (inventoryItem.barcode === transferItem.barcode &&
                                    inventoryItem.targetShelf === transferItem.targetShelfNo &&
                                    inventoryItem.shelfNo === transferItem.shelfNo) {
                                    // Eşleşen üründen quantity değerini çıkart
                                    inventoryItem.transferQuantity -= transferItem.quantity;
                                    // Eğer transfer edilen miktar sonucunda quantity 0 veya daha az ise
                                    if (inventoryItem.transferQuantity <= 0) {
                                        // İlgili inventoryItem'ın çıkarılması için indeksini kaydet
                                        itemsToRemoveIndexes.push(index);
                                    }
                                }
                            });
                        });
                        // Çıkarılacak öğeler için ters döngü (çıkarırken sıralamayı bozmamak için)
                        for (i = itemsToRemoveIndexes.length - 1; i >= 0; i--) {
                            this.collectedProducts.splice(itemsToRemoveIndexes[i], 1);
                        }
                        itemsToRemoveIndexes = [];
                        //--------------------------------------------------------
                        if (this.transferProducts.length > 0) {
                            if (this.lastCollectedProduct == null) {
                                //üste atılcak ürün seçildi
                                this._transferProducts = [];
                                this._transferProducts.push(this.transferProducts[0]);
                                this.lastCollectedProduct = this.transferProducts[0];
                            }
                            else {
                                foundedProduct = this.transferProducts.find(function (p) {
                                    return p.barcode == _this.lastCollectedProduct.barcode &&
                                        p.itemCode == _this.lastCollectedProduct.itemCode &&
                                        p.shelfNo == _this.lastCollectedProduct.shelfNo;
                                });
                                if (foundedProduct) {
                                    //eğer ürün bulunduysa
                                    if (foundedProduct.quantity > 0) {
                                        //miktar değeri 0 dan büyükse
                                        this._transferProducts = [];
                                        this._transferProducts.push(foundedProduct);
                                        this.lastCollectedProduct = foundedProduct;
                                    }
                                    else {
                                        //miktar değeri 0 dan küçükse
                                        this._transferProducts = [];
                                        this._transferProducts.push(this.transferProducts[0]);
                                        this.lastCollectedProduct = this.transferProducts[0];
                                    }
                                }
                                else {
                                    //üürn bulunmdadıysa
                                    this._transferProducts = [];
                                    this._transferProducts.push(this.transferProducts[0]);
                                    this.lastCollectedProduct = this.transferProducts[0];
                                }
                            }
                        }
                        this.fillShelfNo(1);
                        return [2 /*return*/];
                }
            });
        });
    };
    ShelfTransferRequestComponent.prototype.fillShelfNo = function (type) {
        if (type == 1) {
            this.checkForm.get('shelfNo').setValue(this.transferProducts[0].shelfNo);
        }
        else if (type == 2) {
            this.checkForm.get('shelfNo').setValue(this.__transferProducts[0].shelfNo);
        }
    };
    ShelfTransferRequestComponent.prototype.calculateTotalQty = function () {
        //toplanan ürünler yazısı için
        var totalQty = 0;
        this.collectedFastTransferModels.forEach(function (item) {
            totalQty += item.quantity;
        });
        this.totalCount = totalQty;
    };
    ShelfTransferRequestComponent.prototype.focusNextInput = function (nextInputId) {
        var nextInput = document.getElementById(nextInputId);
        if (nextInput) {
            nextInput.focus();
        }
    };
    ShelfTransferRequestComponent.prototype.formGenerator = function () {
        var _this = this;
        this.checkForm = this.formBuilder.group({
            barcode: [null, forms_1.Validators.required],
            office: [null, forms_1.Validators.required],
            warehouseCode: [null, forms_1.Validators.required],
            shelfNo: [null, forms_1.Validators.required],
            quantity: [null, forms_1.Validators.required],
            batchCode: [null],
            targetShelfNo: [null, forms_1.Validators.required]
        });
        this.checkForm.get('office').valueChanges.subscribe(function (value) {
            if (value === 'M') {
                _this.checkForm.get('warehouseCode').setValue('MD');
            }
        });
        this.checkForm.get('office').valueChanges.subscribe(function (value) {
            if (value === 'U') {
                _this.checkForm.get('warehouseCode').setValue('UD');
            }
        });
    };
    ShelfTransferRequestComponent.prototype.confirmTransfer = function (operationNumberList) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.orderService.confirmTransfer(operationNumberList)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            this.router.navigate(['/warehouse-operation-confirm']);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ShelfTransferRequestComponent.prototype.collectAndPack = function (list) {
        this.orderService.collectAndPack(list, this.currentOrderNo);
        return null;
    };
    ShelfTransferRequestComponent.prototype.countProductRequest = function (barcode, shelfNo, qty, orderNo, url) {
        return __awaiter(this, void 0, Promise, function () {
            var requestModel, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestModel = new countProductRequestModel_1.CountProductRequestModel();
                        requestModel.barcode = barcode;
                        requestModel.shelfNo = shelfNo;
                        requestModel.qty = qty.toString() == null ? 1 : qty;
                        requestModel.orderNumber = orderNo;
                        return [4 /*yield*/, this.httpClient
                                .post(url, requestModel)
                                .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    ShelfTransferRequestComponent.prototype.openImageModal = function (imageUrl) {
        this.modalImageUrl = imageUrl;
        if (!this.formModal) {
            this.formModal = new window.bootstrap.Modal(document.getElementById('myModal'));
        }
        this.formModal.show();
    };
    ShelfTransferRequestComponent.prototype.finishTransfer = function (model) {
        this.generalService.waitAndNavigate('Hızlı Transfer İşlemi Başarılı', 'dashboard');
    };
    ShelfTransferRequestComponent.prototype.setCheckBarcode = function (product) {
        return __awaiter(this, void 0, Promise, function () {
            var result, updated_product, result, updated_product, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!(product.barcode.includes('http') || this.generalService.isGuid(product.barcode))) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.productService.countProductByBarcode3(product.barcode)];
                    case 1:
                        result = _a.sent();
                        updated_product = product;
                        updated_product.barcode = result[3];
                        this.checkForm.get('barcode').setValue(result[3]);
                        return [2 /*return*/, updated_product];
                    case 2: return [4 /*yield*/, this.productService.countProductByBarcode(product.barcode)];
                    case 3:
                        result = _a.sent();
                        updated_product = product;
                        updated_product.barcode = result[3];
                        this.checkForm.get('barcode').setValue(result[3]);
                        return [2 /*return*/, updated_product];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        this.toasterService.error(error_1.message);
                        return [2 /*return*/, null];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ShelfTransferRequestComponent.prototype.addProduct = function (product) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.checkForm.get('barcode').setValue(product.itemCode.toUpperCase());
                        this.checkForm.get('shelfNo').setValue(product.shelfNo.toUpperCase());
                        this.checkForm.get('targetShelfNo').setValue(product.targetShelf.toUpperCase());
                        this.checkForm.get('quantity').setValue(product.transferQuantity);
                        if (!this.checkForm.valid) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.onSubmit(this.checkForm.value)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        this.toasterService.error("Form Geçerli Değil");
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ShelfTransferRequestComponent.prototype.setFormValues = function (product) {
        return __awaiter(this, void 0, Promise, function () {
            var result, items, finded_product, updatedProduct, result, updatedProduct, finded_product, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!(product.barcode.includes('http') ||
                            this.generalService.isGuid(product.barcode))) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.productService.countProductByBarcode3(product.barcode)];
                    case 1:
                        result = _a.sent();
                        if (result[0].includes('CANTA')) {
                            items = result[0].split(',');
                            items = items.filter(function (item) { return !item.startsWith('CANTA'); });
                            // Daha sonra, result[0]'ı güncelliyoruz
                            result[0] = items.join(',');
                        }
                        this.shelfNumbers = result[0];
                        this.checkForm.get('batchCode').setValue(result[2]);
                        this.checkForm.get('barcode').setValue(result[3]);
                        this.checkForm.get('quantity').setValue(Number(result[1]));
                        if (this.baglist.includes(this.currentPageType)) { //SADECE CANTADA HEDEF RAF DOLUMU ISTENDI 06.05
                            finded_product = this.transferProducts.find(function (p) { return p.barcode == result[3]; });
                            if (finded_product) {
                                this.checkForm.get('targetShelfNo').setValue(finded_product.targetShelf);
                                this.checkForm.get('shelfNo').setValue(finded_product.shelfNo);
                                updatedProduct.shelfNo = finded_product.shelfNo;
                                updatedProduct.targetShelfNo = finded_product.targetShelf;
                            }
                        }
                        updatedProduct = product;
                        updatedProduct.barcode = result[3];
                        updatedProduct.batchCode = result[2];
                        updatedProduct.quantity = Number(result[1]);
                        return [2 /*return*/, updatedProduct];
                    case 2: return [4 /*yield*/, this.productService.countProductByBarcode(product.barcode)];
                    case 3:
                        result = _a.sent();
                        updatedProduct = product;
                        this.shelfNumbers = result[0];
                        this.checkForm.get('batchCode').setValue(result[2]);
                        this.checkForm.get('barcode').setValue(result[3]);
                        this.checkForm.get('quantity').setValue(Number(result[1]));
                        if (this.baglist.includes(this.currentPageType)) { //SADECE CANTADA HEDEF RAF DOLUMU ISTENDI 06.05
                            finded_product = this.transferProducts.find(function (p) { return p.barcode == result[3]; });
                            if (finded_product) {
                                this.checkForm.get('targetShelfNo').setValue(finded_product.targetShelf);
                                this.checkForm.get('shelfNo').setValue(finded_product.shelfNo);
                                updatedProduct.shelfNo = finded_product.shelfNo;
                                updatedProduct.targetShelfNo = finded_product.targetShelf;
                            }
                        }
                        updatedProduct.barcode = result[3];
                        updatedProduct.batchCode = result[2];
                        updatedProduct.quantity = Number(result[1]);
                        return [2 /*return*/, updatedProduct];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_2 = _a.sent();
                        this.toasterService.error(error_2.message);
                        return [2 /*return*/, null];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ShelfTransferRequestComponent.prototype.onSubmit = function (transferModel) {
        return __awaiter(this, void 0, Promise, function () {
            var updated_product, result, shelves, response, qrResponse, response, qrResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (transferModel.barcode.includes('=')) {
                            transferModel.barcode = transferModel.barcode.replace(/=/g, '-');
                        }
                        if (transferModel.barcode.includes('http') ||
                            this.generalService.isGuid(transferModel.barcode)) {
                            this.qrBarcodeUrl = transferModel.barcode;
                        }
                        if (!!this.checkForm.valid) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.setFormValues(transferModel)];
                    case 1:
                        updated_product = _a.sent();
                        transferModel = updated_product;
                        if (!this.checkForm.valid) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.onSubmit(transferModel)];
                    case 2:
                        _a.sent(); //OTOMATIK OLARAK FORMU GÖNDER
                        return [3 /*break*/, 4];
                    case 3:
                        this.generalService.whichRowIsInvalid(this.checkForm);
                        _a.label = 4;
                    case 4:
                        this.toasterService.success('Form Değerleri Güncellendi');
                        return [2 /*return*/];
                    case 5:
                        if (!(this.checkForm.valid === true)) return [3 /*break*/, 22];
                        return [4 /*yield*/, this.setCheckBarcode(transferModel)];
                    case 6:
                        transferModel = _a.sent();
                        transferModel.operationId = this.currentOrderNo;
                        console.log(this.shelfNumbers);
                        if (!(this.shelfNumbers == undefined || this.shelfNumbers == null || this.shelfNumbers == "RAFLAR:")) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.productService.countProductByBarcode(transferModel.barcode)];
                    case 7:
                        result = _a.sent();
                        this.shelfNumbers = result[0];
                        _a.label = 8;
                    case 8:
                        shelves = this.shelfNumbers
                            .split(',')
                            .filter(function (raflar) { return raflar.trim() !== ''; })
                            .map(function (raflar) { return raflar.toLowerCase(); });
                        if (!shelves.includes(transferModel.shelfNo.toLowerCase())) return [3 /*break*/, 15];
                        transferModel.quantity = transferModel.quantity;
                        return [4 /*yield*/, this.addFastTransferModel(transferModel)];
                    case 9:
                        response = _a.sent();
                        if (!(response == true)) return [3 /*break*/, 13];
                        return [4 /*yield*/, this.productService.qrOperationMethod(this.qrBarcodeUrl, this.checkForm, transferModel, transferModel.quantity, false, 'FT')];
                    case 10:
                        qrResponse = _a.sent();
                        if (qrResponse != null && qrResponse.state === true) {
                            this.qrOperationModels.push(qrResponse.qrOperationModel);
                        }
                        else if (qrResponse === null) {
                            this.qrBarcodeUrl = null;
                        }
                        //↑↑↑↑↑↑↑↑↑ EĞER QRURl BOŞ DEĞİLSE KONTROL EDİLCEK ↑↑↑↑↑↑↑↑↑
                        this.collectedProducts.push(transferModel);
                        this.collectedProducts.reverse();
                        if (!(this.selectedButton != 4)) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.getTransferRequestListModel(this.selectedButton.toString())];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12:
                        this.toasterService.success('Okutma Başarılı');
                        return [3 /*break*/, 14];
                    case 13:
                        this.toasterService.error('Ekleme Yapılmadı');
                        _a.label = 14;
                    case 14:
                        this.generalService.beep();
                        this.clearForm();
                        if (this.baglist.includes(this.currentPageType)) {
                            this.checkForm
                                .get('targetShelfNo')
                                .setValue(transferModel.targetShelfNo);
                        }
                        return [3 /*break*/, 22];
                    case 15:
                        if (!confirm('Raf Bulunamadı! Raf Barkod Doğrulaması Yapılmadan Eklensin mi(2)?')) return [3 /*break*/, 22];
                        return [4 /*yield*/, this.addFastTransferModel(transferModel)];
                    case 16:
                        response = _a.sent();
                        if (!(response == true)) return [3 /*break*/, 20];
                        return [4 /*yield*/, this.productService.qrOperationMethod(this.qrBarcodeUrl, this.checkForm, transferModel, transferModel.quantity, false, 'FT')];
                    case 17:
                        qrResponse = _a.sent();
                        if (qrResponse != null && qrResponse.state === true) {
                            this.qrOperationModels.push(qrResponse.qrOperationModel);
                        }
                        else if (qrResponse === null) {
                            this.clearForm();
                            if (this.baglist.includes(this.currentPageType)) {
                                this.checkForm
                                    .get('targetShelfNo')
                                    .setValue(transferModel.targetShelfNo);
                            }
                        }
                        this.collectedProducts.push(transferModel);
                        this.collectedProducts.reverse();
                        if (!(this.selectedButton != 4)) return [3 /*break*/, 19];
                        return [4 /*yield*/, this.getTransferRequestListModel(this.selectedButton.toString())];
                    case 18:
                        _a.sent();
                        _a.label = 19;
                    case 19:
                        this.toasterService.success('Okutma Başarılı');
                        this.generalService.beep();
                        return [3 /*break*/, 21];
                    case 20:
                        this.toasterService.error('Ekleme Yapılmadı');
                        _a.label = 21;
                    case 21:
                        this.clearForm();
                        if (this.baglist.includes(this.currentPageType)) {
                            this.checkForm
                                .get('targetShelfNo')
                                .setValue(transferModel.targetShelfNo);
                        }
                        _a.label = 22;
                    case 22: return [2 /*return*/];
                }
            });
        });
    };
    ShelfTransferRequestComponent.prototype.deleteFastTransfer = function (qrModel) {
        return __awaiter(this, void 0, void 0, function () {
            var confirmDelete, response, model, qrOperationModel, qrOperationResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        confirmDelete = window.confirm('Bu hareketi silmek istediğinizden emin misiniz?');
                        if (!confirmDelete) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.deleteFastTransferModel(qrModel.id)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            this.deleteFromList(qrModel);
                        }
                        model = new qrOperationModel_1.QrOperationModel();
                        qrOperationModel = new qrOperationModel_1.QrOperationModel();
                        qrOperationModel = this.qrOperationModels.find(function (p) {
                            return p.barcode == qrModel.barcode &&
                                p.batchCode == qrModel.batchCode &&
                                p.shelfNo == qrModel.shelfNo;
                        });
                        if (!qrOperationModel) return [3 /*break*/, 3];
                        // qrOperationModel nesnesini model'e kopyala
                        model = Object.assign({}, qrOperationModel);
                        if (qrOperationModel.isReturn) {
                            model.isReturn = false;
                        }
                        else {
                            model.isReturn = true;
                        }
                        return [4 /*yield*/, this.productService.qrOperation(model)];
                    case 2:
                        qrOperationResponse = _a.sent();
                        if (qrOperationResponse) {
                            // //console.log(this.qrOperationModels);
                            //this.generalService.beep3();
                            //this.toasterService.success('Qr Operasyonu Geri Alındı');
                        }
                        else {
                            // this.toasterService.error('Qr Operasyonu Geri Alınamadı');
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ShelfTransferRequestComponent.prototype.deleteFromList = function (model) {
        // collectedProducrts dizisinde model'i bul
        var index = this.collectedProducts.findIndex(function (p) {
            return p.barcode == model.barcode &&
                p.batchCode == model.batchCode &&
                p.quantity == model.quantity &&
                p.shelfNo == model.shelfNo &&
                p.targetShelfNo == model.targetShelfNo;
        });
        // Eğer bulunduysa, diziden kaldır
        if (index !== -1) {
            this.collectedProducts.splice(index, 1);
            this.calculateTotalQty();
            this.toasterService.success('Ürün Silindi');
        }
    };
    ShelfTransferRequestComponent.prototype.setShelfNo = function (barcode) {
        return __awaiter(this, void 0, Promise, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.shelfNumbers = 'RAFLAR:';
                        if (!(barcode.length > 20)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.productService.countProductByBarcode(barcode)];
                    case 1:
                        result = _a.sent();
                        this.shelfNumbers += result[0];
                        return [2 /*return*/, result[1]];
                    case 2:
                        this.checkForm.get('barcode').setValue(null);
                        this.focusNextInput('shelfNo');
                        return [2 /*return*/, null];
                }
            });
        });
    };
    ShelfTransferRequestComponent.prototype.getQuantity = function (barcode) {
        return __awaiter(this, void 0, Promise, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.shelfNumbers = 'RAFLAR:';
                        return [4 /*yield*/, this.productService.countProductByBarcode(barcode)];
                    case 1:
                        result = _a.sent();
                        // this.shelfNumbers += result[0];
                        return [2 /*return*/, result[1]];
                }
            });
        });
    };
    ShelfTransferRequestComponent.prototype.clearShelfNumbers = function () {
        this.checkForm.get('shelfNo').setValue(null);
        this.checkForm.get('barcode').setValue(null);
        this.checkForm.get('batchCode').setValue(null);
        this.focusNextInput('shelfNo');
        this.shelfNumbers = 'RAFLAR:';
        this.qrBarcodeUrl = null;
        this.checkForm.get('quantity').setValue(null);
    };
    ShelfTransferRequestComponent.prototype.clearTargetShelfNumber = function () {
        this.clearShelfNumbers();
        this.checkForm.get('targetShelfNo').setValue(null);
    };
    ShelfTransferRequestComponent.prototype.clearForm = function () {
        this.checkForm.get('barcode').setValue(null);
        this.checkForm.get('quantity').setValue(null);
        this.checkForm.get('shelfNo').setValue(null);
        this.checkForm.get('batchCode').setValue(null);
        this.checkForm.get('targetShelfNo').setValue(null);
        if (this.currentPageType == "2") { //sadece çanta için
            this.checkForm.get('shelfNo').setValue(this.lastCollectedProduct.shelfNo);
            this.focusNextInput('barcode');
        }
        else {
            this.focusNextInput('shelfNo');
        }
        this.qrBarcodeUrl = null;
        this.shelfNumbers = 'RAFLAR:';
        this.calculateTotalQty();
    };
    ShelfTransferRequestComponent = __decorate([
        core_1.Component({
            selector: 'app-shelf-transfer-request',
            templateUrl: './shelf-transfer-request.component.html',
            styleUrls: ['./shelf-transfer-request.component.css']
        })
    ], ShelfTransferRequestComponent);
    return ShelfTransferRequestComponent;
}());
exports.ShelfTransferRequestComponent = ShelfTransferRequestComponent;
