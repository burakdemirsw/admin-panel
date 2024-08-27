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
exports.FastTransferComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var ClientUrls_1 = require("src/app/models/const/ClientUrls");
var countProductRequestModel_1 = require("src/app/models/model/order/countProductRequestModel");
var qrOperationModel_1 = require("src/app/models/model/product/qrOperationModel");
var orderStatus_1 = require("src/app/models/model/order/orderStatus");
var FastTransferComponent = /** @class */ (function () {
    function FastTransferComponent(formBuilder, toasterService, orderService, router, httpClient, productService, warehouseService, generalService, httpClientService, title, headerService, activatedRoute) {
        this.formBuilder = formBuilder;
        this.toasterService = toasterService;
        this.orderService = orderService;
        this.router = router;
        this.httpClient = httpClient;
        this.productService = productService;
        this.warehouseService = warehouseService;
        this.generalService = generalService;
        this.httpClientService = httpClientService;
        this.title = title;
        this.headerService = headerService;
        this.activatedRoute = activatedRoute;
        this.lastCollectedProducts = [];
        this.collectedProducts = [];
        this.process = false;
        this.activeTab = 1;
        this.pageDescription = null;
        this.url2 = ClientUrls_1.ClientUrls.baseUrl + '/Order/CountTransferProductPuschase';
        this.totalCount = 0;
        this.orderBillingList = [];
        this.itemBillingModels = [];
        this.warehouseModels = [];
        this.shelfNoList = [];
        this.barcodeValue = null;
        this.collectedFastTransferModels = [];
        this.offices = ["M", "U"];
        this.warehouses = ["MD", "UD"];
        this.qrBarcodeUrl = null;
        this.qrOperationModels = [];
    }
    FastTransferComponent.prototype.logger = function (event) {
        // Seçilen değeri alın
        var selectedValue = event.target.value;
        var selectedValue2 = this.checkForm.get('warehouseCode').value;
        // Değeri console'a yazdırın
        this.toasterService.success('Seçilen Değer:\n' +
            selectedValue +
            '\n\n Form Değeri \n:' +
            selectedValue2);
    };
    FastTransferComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.title.setTitle('Raflar Arası Transfer');
                this.headerService.updatePageTitle('Raflar Arası Transfer');
                this.formGenerator();
                // this.currentOrderNo = (await this.generalService.generateGUID()).toString();
                this.activatedRoute.params.subscribe(function (params) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!params['operationNo']) return [3 /*break*/, 2];
                                this.currentOrderNo = params['operationNo'];
                                // this.toasterService.info('İşlem Numarası: ' + this.currentOrderNo);
                                return [4 /*yield*/, this.getFastTransferModels()];
                            case 1:
                                // this.toasterService.info('İşlem Numarası: ' + this.currentOrderNo);
                                _a.sent();
                                this.addOperationStatus();
                                _a.label = 2;
                            case 2: return [2 /*return*/];
                        }
                    });
                }); });
                this.collectedProducts = [];
                return [2 /*return*/];
            });
        });
    };
    FastTransferComponent.prototype.addOperationStatus = function () {
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
                        if (response) {
                            this.toasterService.success('Durum Güncellendi');
                        }
                        else {
                            this.toasterService.error('Durum Güncellenemedi');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    FastTransferComponent.prototype.getFastTransferModels = function () {
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
    FastTransferComponent.prototype.deleteFastTransferModel = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.warehouseService.deleteFastTransferModel(request)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            this.toasterService.success("Başarılı");
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
    FastTransferComponent.prototype.addFastTransferModel = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.warehouseService.addFastTransferModel(request)];
                    case 1:
                        response = _a.sent();
                        if (!response) return [3 /*break*/, 3];
                        this.toasterService.success("Başarılı");
                        return [4 /*yield*/, this.getFastTransferModels()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 3:
                        this.toasterService.error("Başarısız");
                        return [2 /*return*/, false];
                }
            });
        });
    };
    FastTransferComponent.prototype.calculateTotalQty = function () {
        //toplanan ürünler yazısı için
        var totalQty = 0;
        this.collectedFastTransferModels.forEach(function (item) {
            totalQty += item.quantity;
        });
        this.totalCount = totalQty;
    };
    FastTransferComponent.prototype.focusNextInput = function (nextInputId) {
        var nextInput = document.getElementById(nextInputId);
        if (nextInput) {
            nextInput.focus();
        }
    };
    FastTransferComponent.prototype.formGenerator = function () {
        var _this = this;
        this.checkForm = this.formBuilder.group({
            barcode: [null, forms_1.Validators.required],
            office: [null, forms_1.Validators.required],
            warehouseCode: [null, forms_1.Validators.required],
            shelfNo: [null, forms_1.Validators.required],
            quantity: [null],
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
    FastTransferComponent.prototype.confirmTransfer = function (operationNumberList) {
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
    FastTransferComponent.prototype.collectAndPack = function (list) {
        this.orderService.collectAndPack(list, this.currentOrderNo);
        return null;
    };
    FastTransferComponent.prototype.countProductRequest = function (barcode, shelfNo, qty, orderNo, url) {
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
    FastTransferComponent.prototype.openImageModal = function (imageUrl) {
        this.modalImageUrl = imageUrl;
        if (!this.formModal) {
            this.formModal = new window.bootstrap.Modal(document.getElementById('myModal'));
        }
        this.formModal.show();
    };
    FastTransferComponent.prototype.getSelectedOffice = function (from) {
        var _a;
        this.getWarehouseList((_a = this.checkForm.get('office')) === null || _a === void 0 ? void 0 : _a.value, 1);
    };
    FastTransferComponent.prototype.finishTransfer = function (model) {
        this.generalService.waitAndNavigate('Hızlı Transfer İşlemi Başarılı', 'dashboard');
    };
    FastTransferComponent.prototype.getWarehouseList = function (value, from) {
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
    FastTransferComponent.prototype.setCheckBarcode = function (product) {
        return __awaiter(this, void 0, Promise, function () {
            var result, updated_product, result, updated_product, error_2;
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
                        error_2 = _a.sent();
                        this.toasterService.error(error_2.message);
                        return [2 /*return*/, null];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    FastTransferComponent.prototype.setFormValues = function (product) {
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
                        updated_product = product;
                        updated_product.barcode = result[3];
                        updated_product.batchCode = result[2];
                        updated_product.quantity = Number(result[1]);
                        this.checkForm.get('batchCode').setValue(result[2]);
                        this.checkForm.get('barcode').setValue(result[3]);
                        this.checkForm.get('quantity').setValue(Number(result[1]));
                        return [2 /*return*/, updated_product];
                    case 2: return [4 /*yield*/, this.productService.countProductByBarcode(product.barcode)];
                    case 3:
                        result = _a.sent();
                        this.shelfNumbers = result[0];
                        updated_product = product;
                        updated_product.barcode = result[3];
                        updated_product.batchCode = result[2];
                        updated_product.quantity = Number(result[1]);
                        this.checkForm.get('batchCode').setValue(result[2]);
                        this.checkForm.get('barcode').setValue(result[3]);
                        this.checkForm.get('quantity').setValue(Number(result[1]));
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
    FastTransferComponent.prototype.onSubmit = function (transferModel) {
        return __awaiter(this, void 0, Promise, function () {
            var uuuid, updated_product, qrmodelResponse, shelves, response, qrResponse, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.generalService.generateGUID()
                        // = işareti varsa - yap
                    ];
                    case 1:
                        uuuid = _a.sent();
                        // = işareti varsa - yap
                        if (transferModel.barcode.includes("=")) {
                            transferModel.barcode = transferModel.barcode.replace(/=/g, "-");
                        }
                        if (transferModel.barcode.includes('http') ||
                            this.generalService.isGuid(transferModel.barcode)) {
                            this.qrBarcodeUrl = transferModel.barcode;
                        }
                        if (!!this.checkForm.valid) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.setFormValues(transferModel)];
                    case 2:
                        updated_product = _a.sent();
                        transferModel.barcode = updated_product.barcode;
                        this.toasterService.success("Form Değerleri Güncellendi");
                        return [2 /*return*/];
                    case 3:
                        if (!this.checkForm.valid) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.setCheckBarcode(transferModel)];
                    case 4:
                        //yinede barkod doğrulaması yap
                        transferModel = _a.sent();
                        transferModel.operationId = this.currentOrderNo;
                        return [4 /*yield*/, this.productService.qrControl(transferModel.barcode)];
                    case 5:
                        qrmodelResponse = _a.sent();
                        if (qrmodelResponse.batchCode) {
                            if (transferModel.batchCode == null || transferModel.batchCode === '') {
                                transferModel.batchCode = qrmodelResponse.batchCode;
                            }
                        }
                        shelves = this.shelfNumbers
                            .split(',')
                            .filter(function (raflar) { return raflar.trim() !== ''; })
                            .map(function (raflar) { return raflar.toLowerCase(); });
                        if (!shelves.includes(transferModel.shelfNo.toLowerCase())) return [3 /*break*/, 10];
                        transferModel.quantity;
                        return [4 /*yield*/, this.addFastTransferModel(transferModel)];
                    case 6:
                        response = _a.sent();
                        if (!(response === true)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.productService.qrOperationMethod(uuuid, this.currentOrderNo, this.qrBarcodeUrl, this.checkForm, transferModel, transferModel.quantity, false, 'FT')];
                    case 7:
                        qrResponse = _a.sent();
                        if (qrResponse != null && qrResponse.state === true) {
                            this.qrOperationModels.push(qrResponse.qrOperationModel);
                        }
                        else if (qrResponse === null) {
                            this.qrBarcodeUrl = null;
                        }
                        //↑↑↑↑↑↑↑↑↑ EĞER QRURl BOŞ DEĞİLSE KONTROL EDİLCEK ↑↑↑↑↑↑↑↑↑
                        this.generalService.beep();
                        return [3 /*break*/, 9];
                    case 8:
                        this.toasterService.error('Ekleme Yapılmadı');
                        _a.label = 9;
                    case 9:
                        this.clearForm();
                        return [3 /*break*/, 12];
                    case 10:
                        if (!confirm('Raf Bulunamadı! Raf Barkod Doğrulaması Yapılmadan Eklensin mi(2)?')) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.addFastTransferModel(transferModel)];
                    case 11:
                        response = _a.sent();
                        //RAFLAR ARASI TRANSFER YAPILDI----------------------------------
                        if (response == true) {
                            this.generalService.beep();
                        }
                        else {
                            this.toasterService.error('Ekleme Yapılmadı');
                        }
                        this.clearForm();
                        _a.label = 12;
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    FastTransferComponent.prototype.deleteFastTransfer = function (qrModel) {
        return __awaiter(this, void 0, void 0, function () {
            var confirmDelete, response, model, qrOperationModel, qrOperationResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        confirmDelete = window.confirm('Bu hareketi silmek istediğinizden emin misiniz?');
                        if (!confirmDelete) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.deleteFastTransferModel(qrModel.id)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            this.generalService.beep3();
                        }
                        else {
                            return [2 /*return*/];
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
    FastTransferComponent.prototype.clearShelfNumbers = function () {
        this.checkForm.get('shelfNo').setValue(null);
        this.checkForm.get('barcode').setValue(null);
        this.focusNextInput('shelfNo');
        this.shelfNumbers = 'RAFLAR:';
        this.qrBarcodeUrl = null;
        this.checkForm.get('quantity').setValue(null);
    };
    FastTransferComponent.prototype.clearTargetShelfNumber = function () {
        this.checkForm.get('targetShelfNo').setValue(null);
    };
    FastTransferComponent.prototype.clearForm = function () {
        this.checkForm.get('barcode').setValue(null);
        this.checkForm.get('quantity').setValue(null);
        this.checkForm.get('shelfNo').setValue(null);
        this.checkForm.get('batchCode').setValue(null);
        this.focusNextInput('barcode');
        this.qrBarcodeUrl = null;
        this.shelfNumbers = 'RAFLAR:';
        this.calculateTotalQty();
    };
    FastTransferComponent = __decorate([
        core_1.Component({
            selector: 'app-fast-transfer',
            templateUrl: './fast-transfer.component.html',
            styleUrls: ['./fast-transfer.component.css']
        })
    ], FastTransferComponent);
    return FastTransferComponent;
}());
exports.FastTransferComponent = FastTransferComponent;
