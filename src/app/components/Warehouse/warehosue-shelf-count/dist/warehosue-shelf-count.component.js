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
exports.WarehosueShelfCountComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var library_1 = require("@zxing/library");
var ClientUrls_1 = require("src/app/models/const/ClientUrls");
var countProductRequestModel2_1 = require("src/app/models/model/order/countProductRequestModel2");
var orderStatus_1 = require("src/app/models/model/order/orderStatus");
var completeCount_CM_1 = require("src/app/models/model/warehouse/completeCount_CM");
var ztmsg_CountedProduct_1 = require("src/app/models/model/warehouse/ztmsg_CountedProduct");
var ztmsg_CountedProduct_2 = require("../../../models/model/warehouse/ztmsg_CountedProduct");
var WarehosueShelfCountComponent = /** @class */ (function () {
    function WarehosueShelfCountComponent(formBuilder, toasterService, httpClient, productService, generalService, warehouseService, activatedRoute, title, sanitizer, orderService, router, headerService) {
        this.formBuilder = formBuilder;
        this.toasterService = toasterService;
        this.httpClient = httpClient;
        this.productService = productService;
        this.generalService = generalService;
        this.warehouseService = warehouseService;
        this.activatedRoute = activatedRoute;
        this.title = title;
        this.sanitizer = sanitizer;
        this.orderService = orderService;
        this.router = router;
        this.headerService = headerService;
        this.infoProducts = [];
        this.isChild = false;
        this.visible = false;
        this._visible = false;
        this.barcode = null;
        this.quantity = null;
        this.batchCode = null;
        this.shelfNumbers = 'RAFLAR:';
        this.location = location.href;
        this.photoUrl = ClientUrls_1.ClientUrls.photoUrl;
        this.collectedProducts = [];
        this.process = false;
        this.activeTab = 1;
        this.qrCodeDownloadLink = this.sanitizer.bypassSecurityTrustResourceUrl('');
        this.offices = ["M", "U"];
        this.warehouses = ["MD", "UD"];
        this.shelves = [];
        this.shelves2 = [];
        this.orderBillingList = [];
        this.itemBillingModels = [];
        this.orderNo = '';
        this.warehouseModels = [];
        this.warehouseModels2 = [];
        this.currentQrCode = '';
        this.list = [];
        this.totalCount = 0;
        this.currentPage = 1;
        this.state = true;
        this.qrBarcodeUrl = null;
        this.qrOperationModels = [];
        this.isFirstBarcode = false;
        this.barcodeList = [];
        this.countedProductControl = [];
        this.controlMessage = "";
        this.tableHeaders = [
            'Fotoğraf',
            'Raf',
            'Ürün Kodu',
            'Miktar',
            'Parti',
            'Barkod',
            'Müşteri Kodu',
            'Depo',
            'Ofis',
        ];
        this._tableHeaders = [
            'Resim',
            'Raf',
            'Ürün Kodu',
            'Miktar',
            'Parti',
            'Barkod',
            'İşlem',
        ];
        this._tableHeaders2 = [
            'Ürün Kodu',
            'Durum',
        ];
        this._tableHeaders3 = [
            'Resim',
            'Raf',
            'Ürün Kodu',
            'Eklenen Miktar',
            'Çıkarılan Miktar',
            'Parti',
            'Barkod',
            'İşlem',
        ];
        this.isCompleted = false;
        this.lastCollectedProducts = [];
        this.lastCollectedProducts2 = [];
    }
    WarehosueShelfCountComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.formGenerator();
                this.activatedRoute.params.subscribe(function (params) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                this.countType = params['type'];
                                this.currentOrderNo = params['orderNo'];
                                return [4 /*yield*/, this.addOperationStatus()];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, this.getProductOfCount(this.currentOrderNo)];
                            case 2:
                                _a.sent();
                                // if (this.countType == "count") {
                                // } else if (this.countType == "add-product-to-shelf") {
                                // }
                                // else if (this.countType == "remove-product-to-shelf") {
                                // }
                                if (!this.isChild) {
                                    this.setTitle();
                                }
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    WarehosueShelfCountComponent.prototype.setTitle = function () {
        if (this.countType == "count") {
            this.headerService.updatePageTitle('Sayım');
            this.upPageDescription = "Sayım";
        }
        else if (this.countType == "add-product-to-shelf") {
            this.headerService.updatePageTitle('Rafa Ürün Ekle');
            this.upPageDescription = "Rafa Ürün Ekle";
        }
        else if (this.countType == "remove-product-to-shelf") {
            this.headerService.updatePageTitle('Rafdan Ürün Çıkar');
            this.upPageDescription = "Rafdan Ürün Çıkar";
        }
    };
    WarehosueShelfCountComponent.prototype.change = function (barcode, quantity, batchCode) {
        this.visible = !this.visible;
        this.barcode = barcode;
        this.quantity = quantity;
        this.batchCode = batchCode;
    };
    WarehosueShelfCountComponent.prototype.ngOnDestroy = function () {
        if (this.isCompleted == false) {
            if (this.location.includes("warehouse-shelf-count")) {
                if (!window.confirm("Sayfadan Ayrılıyorsunuz. Emin Misiniz?")) {
                    this.toasterService.error(this.location + " İşlemi İptal Edildi");
                    location.href = this.location;
                    return;
                }
                else {
                    return; // İşlemi iptal et
                }
            }
        }
    };
    WarehosueShelfCountComponent.prototype.getProductPhoto = function (itemCode) {
        return ClientUrls_1.ClientUrls.photoUrl + itemCode + ".jpg";
    };
    WarehosueShelfCountComponent.prototype.addOperationStatus = function () {
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
                        request.status = 'Toplanıyor';
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
    WarehosueShelfCountComponent.prototype.createJson = function (barcode, shelfNo, batchCode) {
        var model = this.lastCollectedProducts.find(function (p) {
            return (p.barcode = barcode) &&
                p.shelfNo == shelfNo &&
                p.batchCode == batchCode;
        });
        var formDataJSON = JSON.stringify(model); // Form verilerini JSON'a dönüştür
        this.qrCodeValue = formDataJSON;
        // this.toasterService.success(this.qrCodeValue)
    };
    WarehosueShelfCountComponent.prototype.getAvailableShelves = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.warehouseService.getAvailableShelves()];
                    case 1:
                        _a.shelves = _b.sent();
                        this.shelves2.push(this.shelves[0]);
                        return [2 /*return*/];
                }
            });
        });
    };
    WarehosueShelfCountComponent.prototype.goDown2 = function (desc) {
        // packageNo'ya eşleşen ProductOfOrder'ı bulun
        var matchinShelf = this.shelves.find(function (shelve) { return shelve.description === desc; });
        if (matchinShelf) {
            // Ürünü diziden çıkarın
            var index = this.shelves.indexOf(matchinShelf);
            if (index !== -1) {
                this.shelves2 = [];
                if (this.shelves.length - 1 >= index + 1) {
                    this.shelves2.push(this.shelves[index + 1]);
                }
                else {
                    this.shelves2.push(this.shelves[0]);
                }
            }
        }
    };
    WarehosueShelfCountComponent.prototype.onChangeURL = function (url) {
        this.qrCodeDownloadLink = url;
        this.openImageModal(this.qrCodeDownloadLink);
        this.qrCodeValue = '';
    };
    WarehosueShelfCountComponent.prototype.openImageModal = function (imageUrl) {
        this.modalImageUrl = imageUrl;
        if (!this.formModal) {
            this.formModal = new window.bootstrap.Modal(document.getElementById('myModal'));
        }
        this.formModal.show();
    };
    WarehosueShelfCountComponent.prototype.focusNextInput = function (nextInputId) {
        var nextInput = document.getElementById(nextInputId);
        if (nextInput) {
            nextInput.focus();
        }
    };
    WarehosueShelfCountComponent.prototype.deleteRow = function (index) {
        this.itemBillingModels.splice(index, 1); // İlgili satırı listeden sil
    };
    WarehosueShelfCountComponent.prototype.formGenerator = function () {
        var _this = this;
        this.checkForm = this.formBuilder.group({
            barcode: [null, forms_1.Validators.required],
            shelfNo: [null, forms_1.Validators.required],
            quantity: [null, forms_1.Validators.required],
            office: [null, forms_1.Validators.required],
            batchCode: [null, forms_1.Validators.required],
            warehouseCode: [null, forms_1.Validators.required],
            isShelfBased: [false],
            isShelfBased2: [true],
            automaticCount: [false],
            shelfControl: [false]
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
        this.checkForm.get('isShelfBased').valueChanges.subscribe(function (value) {
            _this.checkForm.get('isShelfBased2').setValue(!value);
        });
        this.checkForm.get('isShelfBased2').valueChanges.subscribe(function (value) {
            _this.checkForm.get('isShelfBased').setValue(!value);
        });
    };
    WarehosueShelfCountComponent.prototype.calculateTotalQty = function () {
        //toplanan ürünler yazısı için
        var totalQty = 0;
        this.lastCollectedProducts.forEach(function (item) {
            totalQty += item.quantity;
        });
        this.totalCount = totalQty;
    };
    WarehosueShelfCountComponent.prototype.getProductOfCount = function (orderNo) {
        return __awaiter(this, void 0, Promise, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(this.countType === "count")) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this.warehouseService.getCountsOfOperation(orderNo)];
                    case 1:
                        _a.lastCollectedProducts = _c.sent();
                        if (this.lastCollectedProducts.length > 0) {
                            this.setOfficeAndWarehouse(this.lastCollectedProducts[0].warehouseCode);
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        _b = this;
                        return [4 /*yield*/, this.warehouseService.getProductOnShelf(orderNo)];
                    case 3:
                        _b.lastCollectedProducts2 = _c.sent();
                        _c.label = 4;
                    case 4:
                        this.calculateTotalQty();
                        return [2 /*return*/];
                }
            });
        });
    };
    WarehosueShelfCountComponent.prototype.setOfficeAndWarehouse = function (warehouseCode) {
        if (warehouseCode == 'MD') {
            this.checkForm.get('office').setValue('M');
            this.checkForm.get('warehouseCode').setValue('MD');
        }
        else {
            this.checkForm.get('office').setValue('U');
            this.checkForm.get('warehouseCode').setValue('UD');
        }
    };
    WarehosueShelfCountComponent.prototype.countProductRequest = function (barcode, shelfNo, quantity, office, warehouseCode, batchCode, url) {
        return __awaiter(this, void 0, Promise, function () {
            var requestModel, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestModel = new countProductRequestModel2_1.CountProductRequestModel2();
                        requestModel.barcode = barcode;
                        requestModel.shelfNo = shelfNo;
                        requestModel.quantity = quantity == null ? 1 : quantity;
                        requestModel.office = office;
                        requestModel.warehouseCode = warehouseCode;
                        requestModel.batchCode = batchCode;
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
    WarehosueShelfCountComponent.prototype.setFormValues = function (product) {
        var _a, _b;
        return __awaiter(this, void 0, Promise, function () {
            var state, result, updated_product, result, updated_product, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 5, , 6]);
                        state = this.generalService.isGuid(product.barcode);
                        if (!(product.barcode.includes('http') || state)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.productService.countProductByBarcode3(product.barcode)];
                    case 1:
                        result = _c.sent();
                        if (result) {
                            this.shelfNumbers = result[0];
                            this.checkForm.get('batchCode').setValue(result[2]);
                            this.checkForm.get('barcode').setValue(result[3]);
                            if (this.generalService.isNullOrEmpty((_a = product.quantity) === null || _a === void 0 ? void 0 : _a.toString())) {
                                this.checkForm.get('quantity').setValue(Number(result[1]));
                            }
                            updated_product = product;
                            updated_product.quantity = this.checkForm.get('quantity').value;
                            updated_product.batchCode = result[2];
                            updated_product.barcode = result[3];
                            return [2 /*return*/, updated_product];
                        }
                        else {
                            throw new library_1.Exception('setFormValues error');
                        }
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.productService.countProductByBarcode(product.barcode)];
                    case 3:
                        result = _c.sent();
                        this.shelfNumbers = result[0];
                        this.checkForm.get('batchCode').setValue(result[2]);
                        this.checkForm.get('barcode').setValue(result[3]);
                        if (this.generalService.isNullOrEmpty((_b = product.quantity) === null || _b === void 0 ? void 0 : _b.toString())) {
                            this.checkForm.get('quantity').setValue(Number(result[1]));
                        }
                        updated_product = product;
                        updated_product.quantity = this.checkForm.get('quantity').value;
                        updated_product.batchCode = result[2];
                        updated_product.barcode = result[3];
                        return [2 /*return*/, updated_product];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_1 = _c.sent();
                        this.toasterService.error(error_1.message);
                        return [2 /*return*/, null];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    WarehosueShelfCountComponent.prototype.getQuantity = function (barcode) {
        return __awaiter(this, void 0, Promise, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.productService.countProductByBarcode(//
                        barcode)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result[1]];
                }
            });
        });
    };
    WarehosueShelfCountComponent.prototype.manageOnSubmit = function (countProductRequestModel) {
        if (this.countType == "count") {
            this.onSubmit(countProductRequestModel);
        }
        else {
            if (this.countType == "add-product-to-shelf") {
                this.onSubmit2(countProductRequestModel, true);
            }
            else if (this.countType == "remove-product-to-shelf") {
                this.onSubmit2(countProductRequestModel, false);
            }
        }
    };
    WarehosueShelfCountComponent.prototype.onSubmit = function (countProductRequestModel) {
        return __awaiter(this, void 0, Promise, function () {
            var uuuid, _isUUID, updated_product, url, result, shelves, control, request, _response, qrResponse, request, _response, qrResponse, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.generalService.generateGUID()];
                    case 1:
                        uuuid = _a.sent();
                        _isUUID = this.generalService.isGuid(countProductRequestModel.barcode);
                        // EĞER BARKODTA = VARSA - İLE DEĞİŞTİR
                        if (countProductRequestModel.barcode.includes('=')) {
                            countProductRequestModel.barcode = countProductRequestModel.barcode.replace(/=/g, '-');
                        }
                        // http ile başlıyorsa veya guid ise qr işlemi yap
                        if (countProductRequestModel.barcode.includes('http') ||
                            this.generalService.isGuid(countProductRequestModel.barcode)) {
                            countProductRequestModel.barcode = countProductRequestModel.barcode.replace("Http", "http");
                            this.qrBarcodeUrl = countProductRequestModel.barcode;
                        }
                        if (!!this.checkForm.valid) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.setFormValues(countProductRequestModel)];
                    case 2:
                        updated_product = _a.sent();
                        countProductRequestModel = updated_product;
                        if (this.checkForm.valid && !_isUUID) {
                            if (this.checkForm.value.automaticCount) {
                                this.onSubmit(countProductRequestModel);
                            }
                            else {
                                return [2 /*return*/];
                            }
                        }
                        this.toasterService.success("Form Verileri Güncellendi");
                        return [2 /*return*/];
                    case 3:
                        if (!this.checkForm.valid) return [3 /*break*/, 19];
                        url = ClientUrls_1.ClientUrls.baseUrl + '/Order/CountProduct3';
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 18, , 19]);
                        console.log("RAF NUMARALARI --> : " + this.shelfNumbers);
                        if (!(this.generalService.isNullOrEmpty(this.shelfNumbers) || this.shelfNumbers == undefined)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.productService.countProductByBarcode(countProductRequestModel.barcode)];
                    case 5:
                        result = _a.sent();
                        this.shelfNumbers = result[0];
                        _a.label = 6;
                    case 6:
                        shelves = this.shelfNumbers
                            .split(',')
                            .filter(function (raflar) { return raflar.trim() !== ''; })
                            .map(function (raflar) { return raflar.toLowerCase(); });
                        if (!this.state) return [3 /*break*/, 17];
                        this.state = false;
                        control = this.checkForm.value.shelfControl == true ? true : shelves.includes(countProductRequestModel.shelfNo.toLowerCase());
                        if (!control) return [3 /*break*/, 11];
                        request = new ztmsg_CountedProduct_1.ZTMSG_CountedProduct();
                        request.barcode = countProductRequestModel.barcode;
                        request.shelfNo = countProductRequestModel.shelfNo;
                        request.quantity = countProductRequestModel.quantity;
                        request.officeCode = countProductRequestModel.office;
                        request.warehouseCode = countProductRequestModel.warehouseCode;
                        request.batchCode = countProductRequestModel.batchCode;
                        request.operationNumber = this.currentOrderNo;
                        request.isCompleted = false;
                        request.operationType = this.checkForm.get("isShelfBased").value == true ? this.checkForm.get("isShelfBased").value : this.checkForm.get("isShelfBased2").value;
                        return [4 /*yield*/, this.warehouseService.addCount(request)];
                    case 7:
                        _response = _a.sent();
                        if (!(_response != undefined)) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.productService.qrOperationMethod(uuuid, this.currentOrderNo, this.qrBarcodeUrl, this.checkForm, countProductRequestModel, countProductRequestModel.quantity, false, 'CO')];
                    case 8:
                        qrResponse = _a.sent();
                        if (qrResponse != null && qrResponse.state === true) {
                            this.qrOperationModels.push(qrResponse.qrOperationModel);
                        }
                        else if (qrResponse === null) {
                            this.qrBarcodeUrl = null;
                        }
                        // QR İŞLEMLERİ YAPILDI -------------------------------------------
                        this.generalService.beep();
                        return [4 /*yield*/, this.getProductOfCount(this.currentOrderNo)];
                    case 9:
                        _a.sent(); //this.list.push(countProductRequestModel);
                        this.clearQrAndBatchCode();
                        this.state = true;
                        _a.label = 10;
                    case 10: return [3 /*break*/, 17];
                    case 11:
                        if (!confirm('Raf Bulunamadı! Raf Barkod Doğrulaması Yapılmadan Eklensin mi(2)?')) return [3 /*break*/, 16];
                        request = new ztmsg_CountedProduct_1.ZTMSG_CountedProduct();
                        request.barcode = countProductRequestModel.barcode;
                        request.shelfNo = countProductRequestModel.shelfNo;
                        request.quantity = countProductRequestModel.quantity;
                        request.officeCode = countProductRequestModel.office;
                        request.warehouseCode = countProductRequestModel.warehouseCode;
                        request.batchCode = countProductRequestModel.batchCode;
                        request.operationNumber = this.currentOrderNo;
                        request.isCompleted = false;
                        request.operationType = this.checkForm.get("isShelfBased").value == true ? this.checkForm.get("isShelfBased").value : this.checkForm.get("isShelfBased2").value;
                        return [4 /*yield*/, this.warehouseService.addCount(request)];
                    case 12:
                        _response = _a.sent();
                        if (!(_response != undefined)) return [3 /*break*/, 15];
                        return [4 /*yield*/, this.productService.qrOperationMethod(uuuid, this.currentOrderNo, this.qrBarcodeUrl, this.checkForm, countProductRequestModel, countProductRequestModel.quantity, false, 'CO')];
                    case 13:
                        qrResponse = _a.sent();
                        if (qrResponse != null && qrResponse.state === true) {
                            this.qrOperationModels.push(qrResponse.qrOperationModel);
                        }
                        else if (qrResponse === null) {
                            this.qrBarcodeUrl = null;
                        }
                        // QR İŞLEMLERİ YAPILDI -------------------------------------------
                        this.generalService.beep();
                        return [4 /*yield*/, this.getProductOfCount(this.currentOrderNo)];
                    case 14:
                        _a.sent(); //this.list.push(countProductRequestModel);
                        this.clearQrAndBatchCode();
                        this.state = true;
                        _a.label = 15;
                    case 15: return [3 /*break*/, 17];
                    case 16:
                        this.toasterService.success('Raflar Getirildi Ve Miktar Alanı Dolduruldu.');
                        this.state = true;
                        _a.label = 17;
                    case 17: return [3 /*break*/, 19];
                    case 18:
                        error_2 = _a.sent();
                        this.toasterService.error(error_2.message);
                        this.state = true;
                        return [3 /*break*/, 19];
                    case 19: return [2 /*return*/];
                }
            });
        });
    };
    WarehosueShelfCountComponent.prototype.onSubmit2 = function (countProductRequestModel, isInQty) {
        return __awaiter(this, void 0, Promise, function () {
            var uuuid, updated_product, result, shelves, request, _response, qrResponse, request, _response, qrResponse, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.generalService.generateGUID()
                        // EĞER BARKODTA = VARSA - İLE DEĞİŞTİR
                    ];
                    case 1:
                        uuuid = _a.sent();
                        // EĞER BARKODTA = VARSA - İLE DEĞİŞTİR
                        if (countProductRequestModel.barcode.includes('=')) {
                            countProductRequestModel.barcode = countProductRequestModel.barcode.replace(/=/g, '-');
                        }
                        // http ile başlıyorsa veya guid ise qr işlemi yap
                        if (countProductRequestModel.barcode.includes('http') ||
                            this.generalService.isGuid(countProductRequestModel.barcode)) {
                            countProductRequestModel.barcode = countProductRequestModel.barcode.replace("Http", "http");
                            this.qrBarcodeUrl = countProductRequestModel.barcode;
                        }
                        if (!!this.checkForm.valid) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.setFormValues(countProductRequestModel)];
                    case 2:
                        updated_product = _a.sent();
                        countProductRequestModel = updated_product;
                        if (this.checkForm.valid) {
                            this.onSubmit2(countProductRequestModel, isInQty);
                        }
                        this.toasterService.success("Form Verileri Güncellendi");
                        return [2 /*return*/];
                    case 3:
                        if (!this.checkForm.valid) return [3 /*break*/, 19];
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 18, , 19]);
                        if (!this.generalService.isNullOrEmpty(this.shelfNumbers)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.productService.countProductByBarcode(countProductRequestModel.barcode)];
                    case 5:
                        result = _a.sent();
                        this.shelfNumbers = result[0];
                        _a.label = 6;
                    case 6:
                        shelves = this.shelfNumbers
                            .split(',')
                            .filter(function (raflar) { return raflar.trim() !== ''; })
                            .map(function (raflar) { return raflar.toLowerCase(); });
                        if (!this.state) return [3 /*break*/, 17];
                        this.state = false;
                        if (!shelves.includes(countProductRequestModel.shelfNo.toLowerCase())) return [3 /*break*/, 11];
                        request = new ztmsg_CountedProduct_2.ZTMSG_ProductOnShelf();
                        request.barcode = countProductRequestModel.barcode;
                        request.shelfNo = countProductRequestModel.shelfNo;
                        request.in_Quantity = isInQty == true ? countProductRequestModel.quantity : 0;
                        request.out_Quantity = isInQty == false ? countProductRequestModel.quantity : 0;
                        request.warehouseCode = countProductRequestModel.warehouseCode;
                        request.batchCode = countProductRequestModel.batchCode;
                        request.operationNumber = this.currentOrderNo;
                        return [4 /*yield*/, this.warehouseService.addProductOnShelf(request)];
                    case 7:
                        _response = _a.sent();
                        if (!(_response != undefined)) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.productService.qrOperationMethod(uuuid, this.currentOrderNo, this.qrBarcodeUrl, this.checkForm, countProductRequestModel, countProductRequestModel.quantity, false, 'CO')];
                    case 8:
                        qrResponse = _a.sent();
                        if (qrResponse != null && qrResponse.state === true) {
                            this.qrOperationModels.push(qrResponse.qrOperationModel);
                        }
                        else if (qrResponse === null) {
                            this.qrBarcodeUrl = null;
                        }
                        // QR İŞLEMLERİ YAPILDI -------------------------------------------
                        this.generalService.beep();
                        return [4 /*yield*/, this.getProductOfCount(this.currentOrderNo)];
                    case 9:
                        _a.sent(); //this.list.push(countProductRequestModel);
                        this.clearQrAndBatchCode();
                        this.state = true;
                        _a.label = 10;
                    case 10: return [3 /*break*/, 17];
                    case 11:
                        if (!confirm('Raf Bulunamadı! Raf Barkod Doğrulaması Yapılmadan Eklensin mi(2)?')) return [3 /*break*/, 16];
                        request = new ztmsg_CountedProduct_2.ZTMSG_ProductOnShelf();
                        request.barcode = countProductRequestModel.barcode;
                        request.shelfNo = countProductRequestModel.shelfNo;
                        request.in_Quantity = isInQty == true ? countProductRequestModel.quantity : 0;
                        request.out_Quantity = isInQty == false ? countProductRequestModel.quantity : 0;
                        request.warehouseCode = countProductRequestModel.warehouseCode;
                        request.batchCode = countProductRequestModel.batchCode;
                        request.operationNumber = this.currentOrderNo;
                        return [4 /*yield*/, this.warehouseService.addProductOnShelf(request)];
                    case 12:
                        _response = _a.sent();
                        if (!(_response != undefined)) return [3 /*break*/, 15];
                        return [4 /*yield*/, this.productService.qrOperationMethod(uuuid, this.currentOrderNo, this.qrBarcodeUrl, this.checkForm, countProductRequestModel, countProductRequestModel.quantity, false, 'CO')];
                    case 13:
                        qrResponse = _a.sent();
                        if (qrResponse != null && qrResponse.state === true) {
                            this.qrOperationModels.push(qrResponse.qrOperationModel);
                        }
                        else if (qrResponse === null) {
                            this.qrBarcodeUrl = null;
                        }
                        // QR İŞLEMLERİ YAPILDI -------------------------------------------
                        this.generalService.beep();
                        return [4 /*yield*/, this.getProductOfCount(this.currentOrderNo)];
                    case 14:
                        _a.sent(); //this.list.push(countProductRequestModel);
                        this.clearQrAndBatchCode();
                        this.state = true;
                        _a.label = 15;
                    case 15: return [3 /*break*/, 17];
                    case 16:
                        this.toasterService.success('Raflar Getirildi Ve Miktar Alanı Dolduruldu.');
                        this.state = true;
                        _a.label = 17;
                    case 17: return [3 /*break*/, 19];
                    case 18:
                        error_3 = _a.sent();
                        this.toasterService.error(error_3.message);
                        this.state = true;
                        return [3 /*break*/, 19];
                    case 19: return [2 /*return*/];
                }
            });
        });
    };
    WarehosueShelfCountComponent.prototype.clearShelfNumbers = function () {
        this.checkForm.get('shelfNo').setValue(null);
        this.checkForm.get('barcode').setValue(null);
        this.focusNextInput('shelfNo');
        this.shelfNumbers = 'Raf No';
        this.qrBarcodeUrl = null;
        this.checkForm.get('quantity').setValue(null);
        this.checkForm.get('batchCode').setValue(null);
    };
    WarehosueShelfCountComponent.prototype.clearQrAndBatchCode = function () {
        this.checkForm.get('barcode').setValue(null);
        this.checkForm.get('batchCode').setValue(null);
        this.checkForm.get('quantity').setValue(null);
        this.focusNextInput('countPageBarcode');
        this.shelfNumbers = null;
        this.qrBarcodeUrl = null;
        this.calculateTotalQty();
    };
    WarehosueShelfCountComponent.prototype.completeCountFromService = function (orderNo) {
        return __awaiter(this, void 0, Promise, function () {
            var isShelfBased, isShelfBased2, request, response, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.countType == "count")) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        isShelfBased = this.checkForm.get("isShelfBased");
                        isShelfBased2 = this.checkForm.get("isShelfBased2");
                        if (isShelfBased.value === false && isShelfBased2.value === false) {
                            this.toasterService.error("Lütfen bir sayım tipi seçiniz");
                            return [2 /*return*/, false];
                        }
                        if (isShelfBased.value === true && isShelfBased2.value === true) {
                            isShelfBased.setValue(false);
                            isShelfBased2.setValue(false);
                            this.toasterService.error("Sadece bir sayım tipi seçilmelidir");
                            return [2 /*return*/, false];
                        }
                        request = new completeCount_CM_1.CompleteCountOperation_CM();
                        request.countType = isShelfBased.value === true ? 0 : 1; //0-> raf bazında dayım | 1-> ürün bazında ürün sayım
                        request.operationNo = this.currentOrderNo;
                        return [4 /*yield*/, this.warehouseService.completeCountOperation(request)];
                    case 2:
                        response = _a.sent();
                        if (response === true) {
                            this.isCompleted = true;
                            this.toasterService.success('İşlem Başarılı');
                            this.router.navigate(['/warehouse-shelf-count-list']);
                            return [2 /*return*/, true];
                        }
                        else {
                            this.toasterService.error('İşlem Başarısız');
                            return [2 /*return*/, false];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        this.toasterService.error('İşlem Başarısız');
                        return [2 /*return*/, false];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        this.toasterService.success('İşlem Başarılı');
                        this.router.navigate(['/warehouse-shelf-count-list']);
                        return [2 /*return*/, true];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    WarehosueShelfCountComponent.prototype.getControlledProducts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.warehouseService.getProductOfCountControl(this.currentOrderNo)];
                    case 1:
                        _a.countedProductControl = _b.sent();
                        if (this.collectedProducts.length > 0) {
                            this.controlMessage = "Aşağıdaki Ürünlerin Sayımı BAŞARISIZDIR.Lütfen Ürünlerin Parti /  Barkodunu Kontrol Ediniz.";
                        }
                        else {
                            this.controlMessage = "Sayım Başarılıdır";
                        }
                        this._visible = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    WarehosueShelfCountComponent.prototype.deleteOrderProduct = function (orderNo, product) {
        return __awaiter(this, void 0, Promise, function () {
            var confirmDelete, response, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        confirmDelete = window.confirm('Bu hareketi silmek istediğinizden emin misiniz?');
                        if (!confirmDelete) return [3 /*break*/, 11];
                        if (!(this.countType == "count")) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.warehouseService.deleteCount(product)];
                    case 1:
                        response = _a.sent();
                        if (!response) return [3 /*break*/, 3];
                        this.calculateTotalQty();
                        return [4 /*yield*/, this.getProductOfCount(this.currentOrderNo)];
                    case 2:
                        _a.sent();
                        this.toasterService.success('Silme İşlemi Başarılı.');
                        return [3 /*break*/, 4];
                    case 3:
                        this.toasterService.error('Silme İşlemi Başarısız.');
                        _a.label = 4;
                    case 4: return [2 /*return*/, response];
                    case 5: return [4 /*yield*/, this.warehouseService.deleteProductOnShelf(product.id)];
                    case 6:
                        response = _a.sent();
                        if (!response) return [3 /*break*/, 8];
                        this.calculateTotalQty();
                        return [4 /*yield*/, this.getProductOfCount(this.currentOrderNo)];
                    case 7:
                        _a.sent();
                        this.toasterService.success('Silme İşlemi Başarılı.');
                        return [3 /*break*/, 9];
                    case 8:
                        this.toasterService.error('Silme İşlemi Başarısız.');
                        _a.label = 9;
                    case 9: return [2 /*return*/, response];
                    case 10: return [3 /*break*/, 12];
                    case 11: return [2 /*return*/, false];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        core_1.Input()
    ], WarehosueShelfCountComponent.prototype, "infoProducts");
    __decorate([
        core_1.Input()
    ], WarehosueShelfCountComponent.prototype, "isChild");
    WarehosueShelfCountComponent = __decorate([
        core_1.Component({
            selector: 'app-warehosue-shelf-count',
            templateUrl: './warehosue-shelf-count.component.html',
            styleUrls: ['./warehosue-shelf-count.component.css']
        })
    ], WarehosueShelfCountComponent);
    return WarehosueShelfCountComponent;
}());
exports.WarehosueShelfCountComponent = WarehosueShelfCountComponent;
