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
exports.WarehouseOperationComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var ClientUrls_1 = require("src/app/models/const/ClientUrls");
var barcodeModel_1 = require("src/app/models/model/product/barcodeModel");
var qrOperationModel_1 = require("src/app/models/model/product/qrOperationModel");
var warehouseModel_1 = require("src/app/models/model/warehouse/warehouseModel");
var WarehouseOperationComponent = /** @class */ (function () {
    function WarehouseOperationComponent(httpClientService, formBuilder, toasterService, activatedRoute, router, generalService, productService, warehouseService, httpClient, orderService, headerService) {
        this.httpClientService = httpClientService;
        this.formBuilder = formBuilder;
        this.toasterService = toasterService;
        this.activatedRoute = activatedRoute;
        this.router = router;
        this.generalService = generalService;
        this.productService = productService;
        this.warehouseService = warehouseService;
        this.httpClient = httpClient;
        this.orderService = orderService;
        this.headerService = headerService;
        this.currentOrderNo = '';
        this.activeTab = 1;
        this.isDisabled = true;
        this.qrCode = null;
        this.currentBarcode = null;
        this.stockStatus = false;
        this.warehousePackageDetails = [];
        this.warehouseModels = [];
        this.warehouseModels2 = [];
        this.barcodeModel = new barcodeModel_1.BarcodeModel();
        this.shelfNo = null;
        this.colorCode = null;
        this.itemDim1Code = null;
        this.itemCode = null;
        this.officeModels = [];
        this.visible = false;
        this._barcode = null;
        this.quantity = null;
        this.pageStatus = '';
        this.offices = ['M', 'U'];
        this.warehouses = ['MD', 'UD'];
        this.inventoryItemColums = [
            'Id',
            'Fotoğraf',
            'Raf',
            'Ürün Kodu',
            'Transfer Miktarı',
            'UD Stok',
            'MD Stok',
            'Ürün',
            'Barkod',
        ];
        this._inventoryItemColums = [
            'Fotoğraf',
            'Raf',
            'Ürün Kodu',
            'Transfer Miktarı',
            'UD Stok',
            'MD Stok',
            'Ürün',
            'Barkod',
            'İşlemler',
        ];
        this._inventoryItems = [];
        this.inventoryItems = []; //transfer Edilecek ürünler
        this.warehouseTransferForms = []; //eklenen ürünler
        this.lastCollectedProduct = null;
        this.deletedProductList = [];
        this.wrongItemList = [];
        this.barcode = null;
        this.blockedCount = false;
        this.blockedCountReason = '';
        this.qrBarcodeUrl = null;
        this.qrOperationModels = [];
        this.warehosueModel = new warehouseModel_1.WarehouseModel();
        this.shelfNumbers = 'Raf No';
        //--------------------------------------------------------------------
        this.productShelvesDialog = false;
        this.productShelves = [];
    } // Add this line
    WarehouseOperationComponent.prototype.change = function (barcode, quantity) {
        this.visible = !this.visible;
        this._barcode = barcode;
        this.quantity = quantity;
    };
    WarehouseOperationComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (location.href.includes('REQ-')) {
                    this.activatedRoute.params.subscribe(function (params) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (params['type']) {
                                this.currentDataType = params['type'];
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    // }
                    if (this.currentDataType === '1') {
                        this.pageStatus = 'İstek - Standart';
                    }
                    else {
                        this.pageStatus = 'İstek - Raf Fulle';
                    }
                }
                else {
                    this.pageStatus = 'Transfer';
                    this.currentDataType = '-1';
                    this.toasterService.info('xxx');
                }
                this.formGenerator();
                //this.spinnerService.show();
                this.activatedRoute.params.subscribe(function (params) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                this.currentOrderNo = 'TP-' + params['number'];
                                if (!!this.currentOrderNo.includes('REQ-')) return [3 /*break*/, 2];
                                return [4 /*yield*/, this.getProductOfCount(this.currentOrderNo)];
                            case 1:
                                _a.sent();
                                return [3 /*break*/, 4];
                            case 2:
                                if (!this.currentOrderNo.includes('REQ-')) return [3 /*break*/, 4];
                                return [4 /*yield*/, this.getProductOfCount(this.currentOrderNo)];
                            case 3:
                                _a.sent();
                                _a.label = 4;
                            case 4:
                                this.warehouseForm.get('orderNo').setValue(this.currentOrderNo);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    WarehouseOperationComponent.prototype.goDown2 = function (barcode, shelfNo, itemCode, transferQty) {
        // packageNo'ya eşleşen ProductOfOrder'ı bulun
        var matchingProduct = this.inventoryItems.find(function (product) {
            return product.barcode === barcode &&
                product.shelfNo == shelfNo &&
                product.itemCode == itemCode &&
                product.transferQty == transferQty;
        });
        // Eğer eşleşen bir ürün bulunduysa
        if (matchingProduct) {
            // Ürünü diziden çıkarın
            var index = this.inventoryItems.indexOf(matchingProduct);
            if (index !== -1) {
                if (this.inventoryItems.length - 1 >= index + 1) {
                    this._inventoryItems = [];
                    this._inventoryItems.push(this.inventoryItems[index + 1]);
                    this.lastCollectedProduct = this.inventoryItems[index + 1];
                }
                else {
                    this._inventoryItems = [];
                    this._inventoryItems.push(this.inventoryItems[0]);
                }
            }
        }
    };
    WarehouseOperationComponent.prototype.addDeletedItemList = function (item) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.deletedProductList.push(item);
                        return [4 /*yield*/, this.getProductOfCount(this.currentOrderNo)];
                    case 1:
                        _a.sent();
                        this.toasterService.info('Ürün Transfer Edilecek Ürünlerden Silindi');
                        return [2 /*return*/];
                }
            });
        });
    };
    WarehouseOperationComponent.prototype.goPage = function (currentDataType) {
        location.href =
            location.origin +
                '/warehouse-operation/' +
                this.currentOrderNo.split('TP-')[1] +
                '/' +
                currentDataType;
    };
    WarehouseOperationComponent.prototype.onDataChange = function (currentDataType) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!location.href.includes('REQ')) return [3 /*break*/, 2];
                        localStorage.removeItem('currentDataType');
                        localStorage.setItem('currentDataType', this.currentDataType);
                        this.currentDataType = currentDataType;
                        if (currentDataType === '0') {
                            this.toasterService.success('Varsayılan Ürünler Getirildi');
                            this.pageStatus = 'İstek - Standart';
                        }
                        else if (currentDataType === '1') {
                            this.pageStatus = 'İstek -Raf Fulle';
                            this.toasterService.success('Raflar Fullendi');
                        }
                        this.inventoryItems = [];
                        _a = this;
                        return [4 /*yield*/, this.orderService.getInventoryItems(currentDataType)];
                    case 1:
                        _a.inventoryItems = _b.sent(); //transfer edilcek ürünler
                        _b.label = 2;
                    case 2:
                        this.headerService.updatePageTitle('Depolar Arası ' + this.pageStatus);
                        if (this.deletedProductList.length > 0) {
                            this.deletedProductList.forEach(function (deletedItem) {
                                _this.inventoryItems.forEach(function (inventoryItem, _index) {
                                    if (inventoryItem.barcode === deletedItem.barcode &&
                                        inventoryItem.shelfNo === deletedItem.shelfNo &&
                                        inventoryItem.itemCode === deletedItem.itemCode) {
                                        _this.inventoryItems.splice(_index, 1);
                                    }
                                });
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    WarehouseOperationComponent.prototype.pasteItemToForm = function (item) {
        this.warehouseForm.get('shelfNo').setValue(item.shelfNo);
        this.warehouseForm.get('quantity').setValue(item.quantity);
        this.warehouseForm.get('barcode').setValue(item.barcode);
    };
    WarehouseOperationComponent.prototype.updateInventoryAndTransfers = function () {
        //eğer silinmiş ürün listesinde ürün varsa onları kaldır
        // İşlem sonrası çıkarılacak öğelerin indekslerini tutacak dizi
        // let itemsToRemoveIndexes: number[] = [];
        var _this = this;
        // // inventoryItems üzerinde döngü
        // this.inventoryItems.forEach((inventoryItem, index) => {
        //   // Eşleşme arama ve güncelleme
        //   this.warehouseTransferForms.forEach((transferItem) => {
        //     // barcode, shelfNo ve itemCode değerlerine göre eşleşme kontrolü
        //     if (
        //       inventoryItem.barcode === transferItem.barcode &&
        //       inventoryItem.shelfNo === transferItem.shelfNo &&
        //       inventoryItem.itemCode === transferItem.itemCode
        //     ) {
        //       // Eşleşen üründen quantity değerini çıkart
        //       inventoryItem.transferQty -= transferItem.quantity;
        //       // Eğer transfer edilen miktar sonucunda quantity 0 veya daha az ise
        //       if (inventoryItem.transferQty <= 0) {
        //         // İlgili inventoryItem'ın çıkarılması için indeksini kaydet
        //         itemsToRemoveIndexes.push(index);
        //       }
        //     }
        //   });
        // });
        // // Çıkarılacak öğeler için ters döngü (çıkarırken sıralamayı bozmamak için)
        // for (let i = itemsToRemoveIndexes.length - 1; i >= 0; i--) {
        //   this.inventoryItems.splice(itemsToRemoveIndexes[i], 1);
        // }
        // itemsToRemoveIndexes = [];
        // //--------------------------------------------------------
        // // Çıkarılacak öğeler için ters döngü (çıkarırken sıralamayı bozmamak için)
        // //--------------------------------------------------------
        //üste ürün attığımız yer
        if (this.inventoryItems.length > 0) {
            if (this.lastCollectedProduct == null) {
                //üste atılcak ürün seçildi
                this._inventoryItems = [];
                this._inventoryItems.push(this.inventoryItems[0]);
                this.lastCollectedProduct = this.inventoryItems[0];
            }
            else {
                //eğer son sayılan ürün varsa
                var foundedProduct = this.inventoryItems.find(function (p) {
                    return p.barcode == _this.lastCollectedProduct.barcode &&
                        p.itemCode == _this.lastCollectedProduct.itemCode &&
                        p.shelfNo == _this.lastCollectedProduct.shelfNo;
                });
                if (foundedProduct) {
                    //eğer ürün bulunduysa
                    if (foundedProduct.quantity > 0) {
                        //miktar değeri 0 dan büyükse
                        this._inventoryItems = [];
                        this._inventoryItems.push(foundedProduct);
                        this.lastCollectedProduct = foundedProduct;
                    }
                    else {
                        //miktar değeri 0 dan küçükse
                        this._inventoryItems = [];
                        this._inventoryItems.push(this.inventoryItems[0]);
                        this.lastCollectedProduct = this.inventoryItems[0];
                    }
                }
                else {
                    //üürn bulunmdadıysa
                    this._inventoryItems = [];
                    this._inventoryItems.push(this.inventoryItems[0]);
                    this.lastCollectedProduct = this.inventoryItems[0];
                }
            }
        }
    };
    WarehouseOperationComponent.prototype.getProductOfCount = function (orderNo) {
        return __awaiter(this, void 0, Promise, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        //sayılanları çeker
                        _a = this;
                        return [4 /*yield*/, this.warehouseService.getProductOfTrasfer(orderNo)];
                    case 1:
                        //sayılanları çeker
                        _a.warehouseTransferForms =
                            _b.sent();
                        return [4 /*yield*/, this.onDataChange(this.currentDataType)];
                    case 2:
                        _b.sent();
                        this.updateInventoryAndTransfers();
                        this.calculateTotalQty();
                        return [2 /*return*/];
                }
            });
        });
    };
    WarehouseOperationComponent.prototype.openImageModal = function (imageUrl) {
        this.modalImageUrl = imageUrl;
        if (!this.formModal) {
            this.formModal = new window.bootstrap.Modal(document.getElementById('myModal'));
        }
        this.formModal.show();
    };
    WarehouseOperationComponent.prototype.formGenerator = function () {
        var _this = this;
        try {
            this.warehouseForm = this.formBuilder.group({
                id: [null],
                shelfNo: [this.shelfNo, forms_1.Validators.required],
                barcode: [this.currentBarcode, forms_1.Validators.required],
                quantity: [null, forms_1.Validators.required],
                batchCode: [this.batchCode],
                office: [null, forms_1.Validators.required],
                officeTo: [null, forms_1.Validators.required],
                warehouse: [null, forms_1.Validators.required],
                warehouseTo: [null, forms_1.Validators.required],
                orderNo: [null, forms_1.Validators.required]
            });
            this.warehouseForm.valueChanges.subscribe(function () {
                var office = _this.warehouseForm.get('office').value;
                var officeTo = _this.warehouseForm.get('officeTo').value;
                if (office === officeTo && office !== null) {
                    // this.toasterService.error("Ofisler Farklı Olmalıdır")
                    _this.warehouseForm.get('office').setValue(null);
                    _this.warehouseForm.get('officeTo').setValue(null);
                }
            });
            this.warehouseForm.get('office').valueChanges.subscribe(function (value) {
                if (value === 'M') {
                    _this.warehouseForm.get('warehouse').setValue('MD');
                }
            });
            this.warehouseForm.get('office').valueChanges.subscribe(function (value) {
                if (value === 'U') {
                    _this.warehouseForm.get('warehouse').setValue('UD');
                }
            });
            this.warehouseForm.get('officeTo').valueChanges.subscribe(function (value) {
                if (value === 'M') {
                    _this.warehouseForm.get('warehouseTo').setValue('MD');
                }
            });
            this.warehouseForm.get('officeTo').valueChanges.subscribe(function (value) {
                if (value === 'U') {
                    _this.warehouseForm.get('warehouseTo').setValue('UD');
                }
            });
        }
        catch (error) {
            console.error(error);
            // Handle the error as needed.
        }
    };
    WarehouseOperationComponent.prototype.getOfficeCodeList = function () {
        return __awaiter(this, void 0, Promise, function () {
            var response, error_1;
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
                        response = _a.sent();
                        this.officeModels = response;
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    WarehouseOperationComponent.prototype.onModelChanged = function (value) {
        this.getShelfByQrDetail(value);
    };
    WarehouseOperationComponent.prototype.controlItemStock = function () {
        var barcodeList = [];
        this.warehouseTransferForms.forEach(function (t) { });
        return true;
    };
    WarehouseOperationComponent.prototype.transferToNebim = function (currentOrderNo) {
        return __awaiter(this, void 0, void 0, function () {
            var userConfirmed, data, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(currentOrderNo != null && currentOrderNo !== '')) return [3 /*break*/, 7];
                        userConfirmed = window.confirm(this.currentOrderNo +
                            ' numaralı sipariş için İşlemi başlatmak istediğinize emin misiniz?');
                        if (!userConfirmed) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.httpClient
                                .get(ClientUrls_1.ClientUrls.baseUrl +
                                '/Warehouse/TransferProducts/' +
                                currentOrderNo)
                                .toPromise()];
                    case 2:
                        data = _a.sent();
                        if (data === true) {
                            this.generalService.waitAndNavigate('Transfer İşlemi Başarıyla Gerçekleşti.', 'warehouse-operation-list');
                        }
                        else {
                            this.toasterService.error('İşlem Başarısız');
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        this.toasterService.warn('İşlem iptal edildi.');
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        this.toasterService.warn('Sipariş No Boş Geliyor.');
                        _a.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    WarehouseOperationComponent.prototype.setShelfNo = function (barcode) {
        return __awaiter(this, void 0, Promise, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!barcode) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.productService.countProductByBarcode(barcode)];
                    case 1:
                        result = _a.sent();
                        this.shelfNumbers += result[0];
                        return [2 /*return*/, result[1]];
                    case 2:
                        this.toasterService.warn('Barkod Alanı Boş.');
                        return [2 /*return*/, null];
                }
            });
        });
    };
    WarehouseOperationComponent.prototype.setFormValues = function (product) {
        return __awaiter(this, void 0, Promise, function () {
            var result, updated_product, result, updated_product, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!(product.barcode.includes('http') || this.generalService.isGuid(product.barcode))) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.productService.countProductByBarcode3(product.barcode)];
                    case 1:
                        result = _a.sent();
                        this.shelfNumbers = result[0];
                        this.warehouseForm.get('barcode').setValue(result[3]);
                        this.warehouseForm.get('batchCode').setValue(result[2].toString());
                        this.warehouseForm.get('quantity').setValue(result[1]);
                        updated_product = product;
                        updated_product.quantity = Number(result[1]);
                        updated_product.batchCode = result[2];
                        updated_product.barcode = result[3];
                        return [2 /*return*/, updated_product];
                    case 2: return [4 /*yield*/, this.productService.countProductByBarcode(product.barcode)];
                    case 3:
                        result = _a.sent();
                        this.shelfNumbers = result[0];
                        this.warehouseForm.get('barcode').setValue(result[3]);
                        this.warehouseForm.get('batchCode').setValue(result[2].toString());
                        this.warehouseForm.get('quantity').setValue(result[1]);
                        if (result[4] == 'false') {
                            this.toasterService.error('Parti Hatası Alındı . Partiyi Yeniden Giriniz');
                            return [2 /*return*/, null];
                            if (!window.confirm('Parti Hatalı Devam Edilsin Mi?')) {
                                this.warehouseForm.get('batchCode').setValue(null);
                                this.focusNextInput('batchCode');
                                this.toasterService.error('Parti Giriniz');
                                return [2 /*return*/, null];
                            }
                        }
                        updated_product = product;
                        updated_product.quantity = Number(result[1]);
                        updated_product.batchCode = result[2];
                        updated_product.barcode = result[3];
                        return [2 /*return*/, updated_product];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_3 = _a.sent();
                        this.toasterService.error(error_3.message);
                        return [2 /*return*/, null];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    WarehouseOperationComponent.prototype.onSubmit = function (formValue) {
        var _a, _b;
        return __awaiter(this, void 0, Promise, function () {
            var uuuid, _i, _c, product, updated_product, shelves, response, qrResponse, data, raflar, number, response, qrResponse, data, number;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.generalService.generateGUID()
                        // = işareti varsa - yap
                    ];
                    case 1:
                        uuuid = _d.sent();
                        // = işareti varsa - yap
                        if (formValue.barcode.includes('=')) {
                            formValue.barcode = formValue.barcode.replace(/=/g, '-');
                        }
                        //BAŞARISIZ ÜRÜN KONTROLÜ YAPILDI
                        for (_i = 0, _c = this.warehouseTransferForms; _i < _c.length; _i++) {
                            product = _c[_i];
                            if (product.availableQty < product.quantity) {
                                this.blockedCount = true;
                                this.blockedCountReason =
                                    'STOK HATASI | Başarısız Ürün | \n Stok Kodu -' +
                                        product.itemCode +
                                        '\n Barkod- ' +
                                        product.barcode;
                                this.toasterService.error(this.blockedCountReason);
                                return [2 /*return*/];
                            }
                        }
                        if (formValue.barcode.includes('http') ||
                            this.generalService.isGuid(formValue.barcode)) {
                            this.qrBarcodeUrl = formValue.barcode;
                        }
                        if (!!this.warehouseForm.valid) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.setFormValues(formValue)];
                    case 2:
                        updated_product = _d.sent();
                        formValue = updated_product;
                        this.toasterService.success('Formu Verileri Dolduruldu.');
                        return [2 /*return*/];
                    case 3:
                        if (!this.warehouseForm.valid) return [3 /*break*/, 23];
                        shelves = this.shelfNumbers
                            .split(',')
                            .filter(function (raflar) { return raflar.trim() !== ''; })
                            .map(function (raflar) { return raflar.toLowerCase(); });
                        shelves.forEach(function (s) {
                            s = s.toLowerCase();
                        });
                        if (!shelves.includes(formValue.shelfNo.toLowerCase())) return [3 /*break*/, 14];
                        return [4 /*yield*/, this.productService.countTransferProduct(formValue)];
                    case 4:
                        response = _d.sent();
                        if (!(response != undefined)) return [3 /*break*/, 13];
                        return [4 /*yield*/, this.productService.qrOperationMethod(uuuid, this.currentOrderNo, this.qrBarcodeUrl, this.warehouseForm, formValue, formValue.quantity, false, 'WT')];
                    case 5:
                        qrResponse = _d.sent();
                        if (qrResponse != null && qrResponse.state === true) {
                            this.qrOperationModels.push(qrResponse.qrOperationModel);
                        }
                        else if (qrResponse === null) {
                            this.qrBarcodeUrl = null;
                        }
                        data = response;
                        if (data.status == 'RAF') {
                            formValue.shelfNo = response.description;
                        }
                        else {
                            formValue.barcode = response.description;
                        }
                        raflar = this.shelfNumbers
                            .split(',')
                            .filter(function (raflar) { return raflar.trim() !== ''; })
                            .map(function (raflar) { return raflar.toLowerCase(); });
                        if (!(raflar.length > 0)) return [3 /*break*/, 11];
                        if (!raflar.includes(formValue.shelfNo.toLowerCase())) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.getProductOfCount(this.currentOrderNo)];
                    case 6:
                        _d.sent(); //this.list.push(formValue);
                        this.generalService.beep();
                        this.clearQrAndBatchCode();
                        return [3 /*break*/, 10];
                    case 7:
                        if (!confirm('Raf Bulunamadı! Eklensin mi(1)?')) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.getProductOfCount(this.currentOrderNo)];
                    case 8:
                        _d.sent(); //this.list.push(formValue);
                        this.generalService.beep();
                        this.clearQrAndBatchCode();
                        return [3 /*break*/, 10];
                    case 9:
                        this.toasterService.warn('Ekleme Yapılmadı!');
                        _d.label = 10;
                    case 10: return [3 /*break*/, 13];
                    case 11:
                        this.generalService.beep();
                        return [4 /*yield*/, this.getProductOfCount(this.currentOrderNo)];
                    case 12:
                        _d.sent();
                        this.clearQrAndBatchCode();
                        _d.label = 13;
                    case 13: return [3 /*break*/, 22];
                    case 14:
                        if (!confirm('Raf Bulunamadı! Raf Barkod Doğrulaması Yapılmadan Eklensin mi(2)?')) return [3 /*break*/, 20];
                        return [4 /*yield*/, this.setShelfNo(formValue.barcode)];
                    case 15:
                        number = _d.sent();
                        (_a = this.warehouseForm.get('quantity')) === null || _a === void 0 ? void 0 : _a.setValue(Number(number));
                        return [4 /*yield*/, this.productService.countTransferProduct(formValue)];
                    case 16:
                        response = _d.sent();
                        if (!(response != undefined)) return [3 /*break*/, 19];
                        return [4 /*yield*/, this.productService.qrOperationMethod(uuuid, this.currentOrderNo, this.qrBarcodeUrl, this.warehouseForm, formValue, formValue.quantity, false, 'WT')];
                    case 17:
                        qrResponse = _d.sent();
                        if (qrResponse != null && qrResponse.state === true) {
                            this.qrOperationModels.push(qrResponse.qrOperationModel);
                        }
                        else if (qrResponse === null) {
                            this.qrBarcodeUrl = null;
                        }
                        data = response;
                        if (data.status == 'RAF') {
                            formValue.shelfNo = response.description;
                        }
                        else {
                            formValue.barcode = response.description;
                        }
                        return [4 /*yield*/, this.getProductOfCount(this.currentOrderNo)];
                    case 18:
                        _d.sent(); //this.list.push(formValue);
                        this.generalService.beep();
                        this.clearQrAndBatchCode();
                        _d.label = 19;
                    case 19: return [3 /*break*/, 22];
                    case 20: return [4 /*yield*/, this.setShelfNo(formValue.barcode)];
                    case 21:
                        number = _d.sent();
                        (_b = this.warehouseForm.get('quantity')) === null || _b === void 0 ? void 0 : _b.setValue(Number(number));
                        this.toasterService.success('Raflar Getirildi Ve Miktar Alanı Dolduruldu.');
                        _d.label = 22;
                    case 22: return [3 /*break*/, 24];
                    case 23:
                        this.toasterService.error('Form Geçersiz');
                        _d.label = 24;
                    case 24: return [2 /*return*/];
                }
            });
        });
    };
    WarehouseOperationComponent.prototype.calculateTotalQty = function () {
        var totalQty = 0;
        this.warehouseTransferForms.forEach(function (item) {
            totalQty += item.quantity;
        });
        this.totalCount = totalQty;
    };
    WarehouseOperationComponent.prototype.clearQrAndBatchCode = function () {
        this.warehouseForm.get('barcode').setValue(null);
        this.warehouseForm.get('batchCode').setValue(null);
        this.warehouseForm.get('quantity').setValue(null);
        this.warehouseForm.get('shelfNo').setValue(null);
        this.shelfNumbers = 'Raf No:';
        this.qrBarcodeUrl = null;
        this.focusNextInput('shelfNo');
        this.calculateTotalQty();
    };
    WarehouseOperationComponent.prototype.resetForm = function () {
        this.warehouseForm.patchValue({
            shelfNo: null,
            barcode: null,
            batchCode: null,
            itemCode: null
        });
        this.focusNextInput('shelfNo');
    };
    WarehouseOperationComponent.prototype.getShelfDetail = function (id) {
        //apiden gerekli fonksiyonlar kurulcak
        var _this = this;
        try {
            this.httpClientService
                .get({
                controller: 'Shelves/' + id
            })
                .subscribe(function (data) {
                ////// console.log(data);
                _this.warehoseModel = data;
                _this.warehosueModel = data[0];
                _this.formGenerator();
            });
        }
        catch (error) {
            // console.log(error.message);
        }
    };
    WarehouseOperationComponent.prototype.deleteRow = function (index) {
        this.warehouseTransferForms.splice(index, 1); // İlgili satırı listeden sil
    };
    WarehouseOperationComponent.prototype.clearAllList = function () {
        var _this = this;
        this.warehousePackageDetails.splice(0); // Tüm elemanları sil
        this.warehouseForm.reset();
        //this.spinnerService.show();
        setTimeout(function () {
            //this.spinnerService.hide();
            _this.toasterService.success('NEBIME BAŞARIYLA AKTARILDI!');
        }, 2000);
    };
    WarehouseOperationComponent.prototype.focusNextInput2 = function () {
        this.onSubmit(this.warehouseForm.value);
    };
    WarehouseOperationComponent.prototype.focusNextInput = function (nextInputId) {
        var nextInput = document.getElementById(nextInputId);
        if (nextInput) {
            nextInput.focus();
        }
    };
    WarehouseOperationComponent.prototype.getShelfByQrDetail = function (id) {
        //apiden gerekli fonksiyonlar kurulcak
        var _this = this;
        try {
            this.httpClientService
                .get({
                controller: 'Shelves/qr/' + id
            })
                .subscribe(function (data) {
                ////// console.log(data);
                _this.warehoseModel = data;
                _this.warehosueModel = data[0];
                _this.formGenerator();
            });
        }
        catch (error) {
            // console.log(error.message);
        }
    };
    WarehouseOperationComponent.prototype.clearShelfNumbers = function () {
        this.warehouseForm.get('shelfNo').setValue(null);
        this.warehouseForm.get('barcode').setValue(null);
        this.focusNextInput('shelfNo');
        this.shelfNumbers = 'Raf No';
        this.qrBarcodeUrl = null;
        this.warehouseForm.get('quantity').setValue(null);
    };
    WarehouseOperationComponent.prototype.deleteOrderProduct = function (orderNo, product) {
        return __awaiter(this, void 0, Promise, function () {
            var confirmDelete, response, model, qrOperationModel, matchingData, totalQuantity, totalQuantity_1, qrOperationResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        confirmDelete = window.confirm('Bu hareketi silmek istediğinizden emin misiniz?');
                        if (!confirmDelete) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.productService.deleteOrderProduct(this.currentOrderNo, product.itemCode, product.id)];
                    case 1:
                        response = _a.sent();
                        if (!response) return [3 /*break*/, 3];
                        this.warehouseTransferForms = this.warehouseTransferForms.filter(function (o) {
                            return !(o.barcode == product.itemCode && o.shelfNo == product.shelfNo);
                        });
                        this.calculateTotalQty();
                        return [4 /*yield*/, this.getProductOfCount(this.currentOrderNo)];
                    case 2:
                        _a.sent();
                        this.toasterService.success('Silme İşlemi Başarılı.');
                        return [3 /*break*/, 4];
                    case 3:
                        this.toasterService.error('Silme İşlemi Başarısız.');
                        _a.label = 4;
                    case 4:
                        model = new qrOperationModel_1.QrOperationModel();
                        qrOperationModel = new qrOperationModel_1.QrOperationModel();
                        qrOperationModel = this.qrOperationModels.find(function (p) {
                            return p.barcode == product.barcode &&
                                p.batchCode == product.batchCode &&
                                p.shelfNo == product.shelfNo;
                        });
                        matchingData = this.qrOperationModels.filter(function (p) {
                            return p.barcode == product.barcode &&
                                p.batchCode == product.batchCode &&
                                p.shelfNo == product.shelfNo;
                        });
                        totalQuantity = 0;
                        if (!qrOperationModel) return [3 /*break*/, 6];
                        if (matchingData) {
                            totalQuantity_1 = matchingData.reduce(function (acc, curr) { return acc + curr.qty; }, 0);
                            qrOperationModel.qty = totalQuantity_1;
                        }
                        //qrOperationModel nesnesini model'e kopyala
                        model = Object.assign({}, qrOperationModel);
                        if (qrOperationModel.isReturn) {
                            model.isReturn = false;
                        }
                        else {
                            model.isReturn = true;
                        }
                        return [4 /*yield*/, this.productService.qrOperation(model)];
                    case 5:
                        qrOperationResponse = _a.sent();
                        if (qrOperationResponse) {
                            // // console.log(this.qrOperationModels);
                            this.generalService.beep3();
                            this.toasterService.success('Qr Operasyonu Geri Alındı');
                        }
                        else {
                            this.toasterService.error('Qr Operasyonu Geri Alınamadı');
                        }
                        return [3 /*break*/, 7];
                    case 6:
                        this.toasterService.error('Qr Operasyonu Geri Alınamadı');
                        _a.label = 7;
                    case 7: return [2 /*return*/, response];
                    case 8: return [2 /*return*/, false];
                }
            });
        });
    };
    WarehouseOperationComponent.prototype.updateItemStock = function () {
        location.reload();
    };
    WarehouseOperationComponent.prototype.getShelves = function (barcode) {
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
    WarehouseOperationComponent.prototype.setShelveToForm = function (shelve) {
        this.warehouseForm.get('shelfNo').setValue(shelve);
        this.toasterService.success('Raf Yerleştirildi');
        this.productShelvesDialog = false;
    };
    WarehouseOperationComponent = __decorate([
        core_1.Component({
            selector: 'app-warehouse-operation',
            templateUrl: './warehouse-operation.component.html',
            styleUrls: ['./warehouse-operation.component.css']
        })
    ], WarehouseOperationComponent);
    return WarehouseOperationComponent;
}());
exports.WarehouseOperationComponent = WarehouseOperationComponent;
