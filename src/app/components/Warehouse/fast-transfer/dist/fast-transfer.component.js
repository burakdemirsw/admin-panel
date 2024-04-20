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
        this.shelfNumbers = 'RAFLAR:';
        this.url2 = ClientUrls_1.ClientUrls.baseUrl + '/Order/CountTransferProductPuschase';
        this.totalCount = 0;
        this.orderBillingList = [];
        this.itemBillingModels = [];
        this.warehouseModels = [];
        this.shelfNoList = [];
        this.barcodeValue = null; // Değişkeni tanımlayın
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
    FastTransferComponent.prototype.setFormValues = function (barcode, check) {
        return __awaiter(this, void 0, Promise, function () {
            var result, currentShelfNo, result, error_2;
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
                            currentShelfNo = this.checkForm.get('shelfNo').value;
                            // if(currentShelfNo==null ){
                            //   this.checkForm.get('shelfNo').setValue(result[0].split(',')[0]);
                            // }
                            this.checkForm.get('batchCode').setValue(result[2]);
                            this.checkForm.get('barcode').setValue(result[3]);
                        }
                        return [2 /*return*/, result[1]];
                    case 3: return [4 /*yield*/, this.productService.countProductByBarcode(barcode)];
                    case 4:
                        result = _a.sent();
                        this.shelfNumbers += result[0];
                        this.checkForm.get('barcode').setValue(result[3]);
                        this.checkForm.get('batchCode').setValue(result[2].toString());
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
    FastTransferComponent.prototype.onSubmit = function (transferModel) {
        var _a, _b, _c;
        return __awaiter(this, void 0, Promise, function () {
            var number, CONSTQTY, number, response2, qrmodelResponse, newResponse, shelves, response, qrResponse, response, number;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (transferModel.barcode.includes("=")) {
                            transferModel.barcode = transferModel.barcode.replace(/=/g, "-");
                        }
                        if (!(transferModel.barcode.includes('http') ||
                            this.generalService.isGuid(transferModel.barcode))) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.setFormValues(transferModel.barcode, true)];
                    case 1:
                        number = _d.sent();
                        this.qrBarcodeUrl = transferModel.barcode;
                        (_a = this.checkForm.get('quantity')) === null || _a === void 0 ? void 0 : _a.setValue(Number(number));
                        //this.onSubmit(this.checkForm.value);
                        return [2 /*return*/];
                    case 2:
                        transferModel.operationId = this.currentOrderNo;
                        return [4 /*yield*/, this.getQuantity(transferModel.barcode)];
                    case 3:
                        CONSTQTY = _d.sent();
                        if (!(transferModel.barcode && !transferModel.shelfNo || transferModel.barcode && !transferModel.batchCode)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.setFormValues(transferModel.barcode, true)];
                    case 4:
                        number = _d.sent();
                        (_b = this.checkForm.get('quantity')) === null || _b === void 0 ? void 0 : _b.setValue(Number(number)); //quantity alanı dolduruldu
                        this.toasterService.success('Raflar Getirildi Ve Miktar Alanı Dolduruldu.');
                        return [3 /*break*/, 18];
                    case 5:
                        if (!(transferModel.shelfNo != null)) return [3 /*break*/, 18];
                        if (!(this.checkForm.valid === true)) return [3 /*break*/, 16];
                        return [4 /*yield*/, this.warehouseService.countProductRequest(transferModel.barcode, transferModel.shelfNo, transferModel.quantity == null
                                ? Number(CONSTQTY)
                                : transferModel.quantity, null, null, transferModel.batchCode, 'Order/CountProductControl', this.orderNo, '')];
                    case 6:
                        response2 = _d.sent();
                        // barkod doğrulaması yapıldı CountProductControl
                        if (response2.status != 'Barcode') {
                            this.toasterService.error('Bu Qr Barkoduna Ait Barkod Bulunamadı');
                            return [2 /*return*/];
                        }
                        else {
                            transferModel.barcode = response2.description;
                        }
                        return [4 /*yield*/, this.productService.qrControl(transferModel.barcode)];
                    case 7:
                        qrmodelResponse = _d.sent();
                        if (qrmodelResponse.batchCode) {
                            if (transferModel.batchCode == null || transferModel.batchCode === '') {
                                transferModel.batchCode = qrmodelResponse.batchCode;
                            }
                            // transferModel.barcode = qrmodelResponse.barcode; //qr basılmadı
                        }
                        return [4 /*yield*/, this.productService.countProductByBarcode(transferModel.barcode)];
                    case 8:
                        newResponse = _d.sent();
                        shelves = newResponse[0]
                            .split(',')
                            .filter(function (raflar) { return raflar.trim() !== ''; })
                            .map(function (raflar) { return raflar.toLowerCase(); });
                        if (!shelves.includes(transferModel.shelfNo.toLowerCase())) return [3 /*break*/, 13];
                        transferModel.quantity =
                            transferModel.quantity != null
                                ? transferModel.quantity
                                : Number(CONSTQTY);
                        return [4 /*yield*/, this.addFastTransferModel(transferModel)];
                    case 9:
                        response = _d.sent();
                        if (!(response === true)) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.productService.qrOperationMethod(this.qrBarcodeUrl, this.checkForm, transferModel, Number(CONSTQTY), false, 'FT')];
                    case 10:
                        qrResponse = _d.sent();
                        if (qrResponse != null && qrResponse.state === true) {
                            this.qrOperationModels.push(qrResponse.qrOperationModel);
                        }
                        else if (qrResponse === null) {
                            this.qrBarcodeUrl = null;
                        }
                        //↑↑↑↑↑↑↑↑↑ EĞER QRURl BOŞ DEĞİLSE KONTROL EDİLCEK ↑↑↑↑↑↑↑↑↑
                        this.generalService.beep();
                        return [3 /*break*/, 12];
                    case 11:
                        this.toasterService.error('Ekleme Yapılmadı');
                        _d.label = 12;
                    case 12:
                        this.clearForm();
                        return [3 /*break*/, 15];
                    case 13:
                        if (!confirm('Raf Bulunamadı! Raf Barkod Doğrulaması Yapılmadan Eklensin mi(2)?')) return [3 /*break*/, 15];
                        if (!transferModel.quantity) {
                            transferModel.quantity = Number(CONSTQTY);
                        }
                        return [4 /*yield*/, this.addFastTransferModel(transferModel)];
                    case 14:
                        response = _d.sent();
                        //RAFLAR ARASI TRANSFER YAPILDI----------------------------------
                        if (response == true) {
                            this.generalService.beep();
                        }
                        else {
                            this.toasterService.error('Ekleme Yapılmadı');
                        }
                        this.clearForm();
                        _d.label = 15;
                    case 15: return [3 /*break*/, 18];
                    case 16: return [4 /*yield*/, this.setFormValues(transferModel.barcode, true)];
                    case 17:
                        number = _d.sent();
                        (_c = this.checkForm.get('quantity')) === null || _c === void 0 ? void 0 : _c.setValue(Number(number)); //quantity alanı dolduruldu
                        if (this.checkForm.value.targetShelfNo == null || this.checkForm.value.targetShelfNo == '') {
                            // this.generalService.whichRowIsInvalid(this.checkForm);
                            this.toasterService.info("Hedef Raf Numarası Boş Olamaz");
                            this.focusNextInput('targetShelfNo');
                        }
                        _d.label = 18;
                    case 18: return [2 /*return*/];
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
    FastTransferComponent.prototype.getQuantity = function (barcode) {
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
