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
var library_1 = require("@zxing/library");
var ClientUrls_1 = require("src/app/models/const/ClientUrls");
var countProductRequestModel_1 = require("src/app/models/model/order/countProductRequestModel");
var qrOperationModel_1 = require("src/app/models/model/product/qrOperationModel");
var ShelfTransferRequestComponent = /** @class */ (function () {
    function ShelfTransferRequestComponent(formBuilder, toasterService, orderService, router, httpClient, spinnerService, productService, warehouseService, generalService, httpClientService, title) {
        this.formBuilder = formBuilder;
        this.toasterService = toasterService;
        this.orderService = orderService;
        this.router = router;
        this.httpClient = httpClient;
        this.spinnerService = spinnerService;
        this.productService = productService;
        this.warehouseService = warehouseService;
        this.generalService = generalService;
        this.httpClientService = httpClientService;
        this.title = title;
        this.lastCollectedProducts = [];
        this.collectedProducts = [];
        this.process = false;
        this.activeTab = 1;
        // warehouseModels: WarehouseOperationDetailModel[] = [];
        this.pageDescription = null;
        this.shelfNumbers = 'RAFLAR:';
        this.url2 = ClientUrls_1.ClientUrls.baseUrl + '/Order/CountTransferProductPuschase';
        this.totalCount = 0;
        this.orderBillingList = [];
        this.itemBillingModels = [];
        this.warehouseModels = [];
        this.shelfNoList = [];
        this.barcodeValue = null; // Değişkeni tanımlayın
        this.currentPage = 1;
        this.transferProducts = [];
        this._transferProducts = [];
        this.lastCollectedProduct = null;
        this.transferProductsColums = [
            'Id',
            'Stok Kodu',
            'Raf',
            'Transfer Miktarı',
            'Hedef Raf',
            'Miktar',
            'Barkod',
            'Çekmece Adedi',
            'İşlemler'
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
            'İşlem'
        ];
        this.productShelvesDialog = false;
        this.productShelves = [];
        this.selectedButton = 0;
        this.qrBarcodeUrl = null;
        this.qrOperationModels = [];
        this.codeReader = new library_1.BrowserMultiFormatReader();
    }
    ShelfTransferRequestComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.title.setTitle('Raflar Arası Transfer');
                        //this.spinnerService.show();
                        this.formGenerator();
                        _a = this;
                        return [4 /*yield*/, this.generalService.generateGUID()];
                    case 1:
                        _a.currentOrderNo = (_b.sent()).toString();
                        return [4 /*yield*/, this.getTransferRequestListModel("0")];
                    case 2:
                        _b.sent();
                        this.collectedProducts = [];
                        return [2 /*return*/];
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
        this.toasterService.success("Raf Yerleştirildi");
        this.productShelvesDialog = false;
    };
    //-------------------
    ShelfTransferRequestComponent.prototype.goDown2 = function (barcode, shelfNo, itemCode, transferQuantity) {
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
    ShelfTransferRequestComponent.prototype.getTransferRequestListModel = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            var response, itemsToRemoveIndexes, i, foundedProduct;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.warehouseService.getTransferRequestListModel(type)];
                    case 1:
                        response = _a.sent();
                        this.selectedButton = Number(type);
                        if (type === '0') {
                            this.toasterService.success("Varsayılan Ürünler Getirildi");
                        }
                        else if (type === '1') {
                            this.toasterService.success("Raflar Fullendi");
                        }
                        else if (type === '2') {
                            this.toasterService.success("Çanta Ürünleri Getirildi");
                        }
                        this.transferProducts = response;
                        itemsToRemoveIndexes = [];
                        console.log(this.collectedProducts);
                        console.log(this.transferProducts);
                        // inventoryItems üzerinde döngü
                        this.transferProducts.forEach(function (inventoryItem, index) {
                            // Eşleşme arama ve güncelleme
                            _this.collectedProducts.forEach(function (transferItem) {
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
                        this.collectedProducts;
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
                        return [2 /*return*/];
                }
            });
        });
    };
    ShelfTransferRequestComponent.prototype.calculateTotalQty = function () {
        //toplanan ürünler yazısı için
        var totalQty = 0;
        this.collectedProducts.forEach(function (item) {
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
        this.checkForm = this.formBuilder.group({
            barcode: [null, forms_1.Validators.required],
            office: [null, forms_1.Validators.required],
            warehouseCode: [null, forms_1.Validators.required],
            shelfNo: [null, forms_1.Validators.required],
            quantity: [null],
            batchCode: [null],
            targetShelfNo: [null, forms_1.Validators.required]
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
    ShelfTransferRequestComponent.prototype.getSelectedOffice = function (from) {
        var _a;
        this.getWarehouseList((_a = this.checkForm.get('office')) === null || _a === void 0 ? void 0 : _a.value, 1);
    };
    ShelfTransferRequestComponent.prototype.finishTransfer = function (model) {
        this.generalService.waitAndNavigate('Hızlı Transfer İşlemi Başarılı', 'dashboard');
    };
    ShelfTransferRequestComponent.prototype.getWarehouseList = function (value, from) {
        return __awaiter(this, void 0, Promise, function () {
            var selectElement, response, selectedValue2, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!(from === 1)) return [3 /*break*/, 2];
                        selectElement = document.getElementById('office');
                        value = selectElement.value == '' ? 'M' : selectElement.value;
                        return [4 /*yield*/, this.httpClientService
                                .get({
                                controller: 'Warehouse/GetWarehouseModel/' + value
                            })
                                .toPromise()];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            this.warehouseModels.push(response[0]);
                            this.checkForm
                                .get('warehouseCode')
                                .setValue(response[0].warehouseCode);
                            selectedValue2 = this.checkForm.get('warehouseCode').value;
                            // this.toasterService.success('Form Değeri \n' + selectedValue2); //null geliyor
                            return [2 /*return*/, true];
                        }
                        else {
                            this.toasterService.error('Depo Çekilemedi');
                            return [2 /*return*/, false];
                        }
                        _a.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ShelfTransferRequestComponent.prototype.setFormValues = function (barcode, check) {
        return __awaiter(this, void 0, Promise, function () {
            var result, result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.shelfNumbers = 'RAFLAR:';
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        if (!(barcode.includes('http') || this.generalService.isGuid(barcode))) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.productService.countProductByBarcode3(barcode)];
                    case 2:
                        result = _a.sent();
                        this.shelfNumbers += result[0];
                        if (check) {
                            this.checkForm.get('shelfNo').setValue(result[0].split(',')[0]);
                            this.checkForm.get('batchCode').setValue(result[2]);
                            this.checkForm.get('barcode').setValue(result[3]);
                        }
                        return [2 /*return*/, result[1]];
                    case 3: return [4 /*yield*/, this.productService.countProductByBarcode(barcode)];
                    case 4:
                        result = _a.sent();
                        this.shelfNumbers += result[0];
                        return [2 /*return*/, result[1]];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_2 = _a.sent();
                        this.toasterService.error(error_2.message);
                        return [2 /*return*/, null];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    ShelfTransferRequestComponent.prototype.onSubmit = function (transferModel) {
        var _a, _b;
        return __awaiter(this, void 0, Promise, function () {
            var number, CONSTQTY, number, response2, qrmodelResponse, newResponse, shelves, response, qrResponse, response, qrResponse;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (transferModel.barcode.includes("=")) {
                            transferModel.barcode = transferModel.barcode.replace(/=/g, "-");
                        }
                        if (!(transferModel.barcode.includes('http') || transferModel.barcode.includes('Http') ||
                            this.generalService.isGuid(transferModel.barcode))) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.setFormValues(transferModel.barcode, true)];
                    case 1:
                        number = _c.sent();
                        this.qrBarcodeUrl = transferModel.barcode;
                        (_a = this.checkForm.get('quantity')) === null || _a === void 0 ? void 0 : _a.setValue(Number(number));
                        // this.onSubmit(this.checkForm.value);
                        return [2 /*return*/];
                    case 2:
                        transferModel.operationId = this.currentOrderNo;
                        return [4 /*yield*/, this.getQuantity(transferModel.barcode)];
                    case 3:
                        CONSTQTY = _c.sent();
                        if (!(transferModel.shelfNo == null || transferModel.shelfNo.trim() == '')) return [3 /*break*/, 7];
                        if (!(transferModel.barcode != null ||
                            transferModel.barcode.trim() == '')) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.setFormValues(transferModel.barcode, true)];
                    case 4:
                        number = _c.sent();
                        (_b = this.checkForm.get('quantity')) === null || _b === void 0 ? void 0 : _b.setValue(Number(number)); //quantity alanı dolduruldu
                        this.toasterService.success('Raflar Getirildi Ve Miktar Alanı Dolduruldu.');
                        return [3 /*break*/, 6];
                    case 5:
                        this.toasterService.warn('Barkod Alanı Boş.');
                        return [2 /*return*/];
                    case 6: return [3 /*break*/, 24];
                    case 7:
                        if (!(transferModel.shelfNo != null)) return [3 /*break*/, 24];
                        if (!(this.checkForm.valid === true)) return [3 /*break*/, 23];
                        return [4 /*yield*/, this.warehouseService.countProductRequest(transferModel.barcode, transferModel.shelfNo, transferModel.quantity == null
                                ? Number(CONSTQTY)
                                : transferModel.quantity, null, null, transferModel.batchCode, 'Order/CountProductControl', this.orderNo, '')];
                    case 8:
                        response2 = _c.sent();
                        //sayım yapıldı ve barkod doğrulaması yapıldı CountProductControl
                        if (response2.status != 'Barcode') {
                            this.toasterService.error('Bu Qr Barkoduna Ait Barkod Bulunamadı');
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.productService.qrControl(transferModel.barcode)];
                    case 9:
                        qrmodelResponse = _c.sent();
                        if (qrmodelResponse.batchCode) {
                            if (transferModel.batchCode == null || transferModel.batchCode === '') {
                                transferModel.batchCode = qrmodelResponse.batchCode;
                            }
                            // transferModel.barcode = qrmodelResponse.barcode; //qr basılmadı
                        }
                        return [4 /*yield*/, this.productService.countProductByBarcode(transferModel.barcode)];
                    case 10:
                        newResponse = _c.sent();
                        shelves = newResponse[0]
                            .split(',')
                            .filter(function (raflar) { return raflar.trim() !== ''; })
                            .map(function (raflar) { return raflar.toLowerCase(); });
                        if (!shelves.includes(transferModel.shelfNo.toLowerCase())) return [3 /*break*/, 16];
                        transferModel.quantity =
                            transferModel.quantity != null
                                ? transferModel.quantity
                                : Number(CONSTQTY);
                        return [4 /*yield*/, this.warehouseService.fastTransfer(transferModel)];
                    case 11:
                        response = _c.sent();
                        if (!(response > 0)) return [3 /*break*/, 14];
                        return [4 /*yield*/, this.productService.qrOperationMethod(this.qrBarcodeUrl, this.checkForm, transferModel, Number(CONSTQTY), false, 'FT')];
                    case 12:
                        qrResponse = _c.sent();
                        if (qrResponse != null && qrResponse.state === true) {
                            this.qrOperationModels.push(qrResponse.qrOperationModel);
                        }
                        else if (qrResponse === null) {
                            this.qrBarcodeUrl = null;
                        }
                        //↑↑↑↑↑↑↑↑↑ EĞER QRURl BOŞ DEĞİLSE KONTROL EDİLCEK ↑↑↑↑↑↑↑↑↑
                        this.collectedProducts.push(transferModel);
                        this.collectedProducts.reverse();
                        return [4 /*yield*/, this.getTransferRequestListModel("0")];
                    case 13:
                        _c.sent();
                        this.toasterService.success("Okutma Başarılı");
                        return [3 /*break*/, 15];
                    case 14:
                        this.toasterService.error('Ekleme Yapılmadı');
                        _c.label = 15;
                    case 15:
                        this.generalService.beep();
                        this.clearForm();
                        return [3 /*break*/, 22];
                    case 16:
                        if (!confirm('Raf Bulunamadı! Raf Barkod Doğrulaması Yapılmadan Eklensin mi(2)?')) return [3 /*break*/, 22];
                        if (!transferModel.quantity) {
                            transferModel.quantity = Number(CONSTQTY);
                        }
                        return [4 /*yield*/, this.warehouseService.fastTransfer(transferModel)];
                    case 17:
                        response = _c.sent();
                        if (!(response > 0)) return [3 /*break*/, 20];
                        return [4 /*yield*/, this.productService.qrOperationMethod(this.qrBarcodeUrl, this.checkForm, transferModel, Number(CONSTQTY), false, 'FT')];
                    case 18:
                        qrResponse = _c.sent();
                        if (qrResponse != null && qrResponse.state === true) {
                            this.qrOperationModels.push(qrResponse.qrOperationModel);
                        }
                        else if (qrResponse === null) {
                            this.clearForm();
                        }
                        //↑↑↑↑↑↑↑↑↑ EĞER QRURl BOŞ DEĞİLSE KONTROL EDİLCEK ↑↑↑↑↑↑↑↑↑
                        this.collectedProducts.push(transferModel);
                        this.collectedProducts.reverse();
                        return [4 /*yield*/, this.getTransferRequestListModel("0")];
                    case 19:
                        _c.sent();
                        this.toasterService.success("Okutma Başarılı  ");
                        this.generalService.beep();
                        return [3 /*break*/, 21];
                    case 20:
                        this.toasterService.error('Ekleme Yapılmadı');
                        _c.label = 21;
                    case 21:
                        this.clearForm();
                        _c.label = 22;
                    case 22: return [3 /*break*/, 24];
                    case 23:
                        this.generalService.whichRowIsInvalid(this.checkForm);
                        _c.label = 24;
                    case 24: return [2 /*return*/];
                }
            });
        });
    };
    ShelfTransferRequestComponent.prototype.deleteFastTransfer = function (qrModel) {
        return __awaiter(this, void 0, void 0, function () {
            var confirmDelete, shelfNo, response, model, qrOperationModel, qrOperationResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        confirmDelete = window.confirm('Bu hareketi silmek istediğinizden emin misiniz?');
                        if (!confirmDelete) return [3 /*break*/, 4];
                        shelfNo = qrModel.shelfNo;
                        qrModel.shelfNo = qrModel.targetShelfNo;
                        qrModel.targetShelfNo = shelfNo;
                        return [4 /*yield*/, this.warehouseService.fastTransfer(qrModel)];
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
                                p.shelfNo == qrModel.targetShelfNo;
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
                            // console.log(this.qrOperationModels);
                            this.generalService.beep3();
                            this.toasterService.success('Qr Operasyonu Geri Alındı');
                        }
                        else {
                            this.toasterService.error('Qr Operasyonu Geri Alınamadı');
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        this.toasterService.error('Qr Operasyonu Geri Alınamadı');
                        _a.label = 4;
                    case 4: return [2 /*return*/];
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
        this.focusNextInput('targetShelfNo');
        this.qrBarcodeUrl = null;
        this.shelfNumbers = 'RAFLAR:';
        this.calculateTotalQty();
    };
    ShelfTransferRequestComponent.prototype.deleteCountProduct = function (orderNo, itemCode) {
        return __awaiter(this, void 0, Promise, function () {
            var result, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.productService.deleteProductFromFastTransfer(this.currentOrderNo, itemCode)];
                    case 1:
                        result = _b.sent();
                        _a = this;
                        return [4 /*yield*/, this.warehouseService.getGetAllFastTransferModelById(this.currentOrderNo)];
                    case 2:
                        _a.collectedProducts =
                            _b.sent();
                        return [2 /*return*/, false];
                }
            });
        });
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
