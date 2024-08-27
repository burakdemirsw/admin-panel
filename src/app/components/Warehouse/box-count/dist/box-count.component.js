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
exports.BoxCountComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var ClientUrls_1 = require("src/app/models/const/ClientUrls");
var BoxCountComponent = /** @class */ (function () {
    function BoxCountComponent(formBuilder, toasterService, headerService, productService, generalService, warehouseService, title, sanitizer) {
        this.formBuilder = formBuilder;
        this.toasterService = toasterService;
        this.headerService = headerService;
        this.productService = productService;
        this.generalService = generalService;
        this.warehouseService = warehouseService;
        this.title = title;
        this.sanitizer = sanitizer;
        this.collectedProducts = [];
        this.process = false;
        this.activeTab = 1;
        this.qrCodeDownloadLink = this.sanitizer.bypassSecurityTrustResourceUrl('');
        this._tableHeaders = [
            'Resim',
            'Raf',
            'Ürün Kodu',
            'Miktar',
            'Parti',
            'Barkod',
            'İşlem',
        ];
        this.shelfNumbers = 'RAFLAR:';
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
        this.title.setTitle('Sayım');
    }
    BoxCountComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var guid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.headerService.updatePageTitle('Kutu Sayım');
                        this.formGenerator();
                        return [4 /*yield*/, this.generalService.generateGUID()];
                    case 1:
                        guid = _a.sent();
                        this.currentOrderNo = 'BXC-' + guid;
                        return [2 /*return*/];
                }
            });
        });
    };
    BoxCountComponent.prototype.openImageModal = function (imageUrl) {
        this.modalImageUrl = imageUrl;
        if (!this.formModal) {
            this.formModal = new window.bootstrap.Modal(document.getElementById('myModal'));
        }
        this.formModal.show();
    };
    BoxCountComponent.prototype.focusNextInput = function (nextInputId) {
        var nextInput = document.getElementById(nextInputId);
        if (nextInput) {
            nextInput.focus();
        }
    };
    BoxCountComponent.prototype.deleteRow = function (index) {
        this.itemBillingModels.splice(index, 1); // İlgili satırı listeden sil
    };
    BoxCountComponent.prototype.formGenerator = function () {
        this.checkForm = this.formBuilder.group({
            barcode: [null, forms_1.Validators.required],
            shelfNo: [' ', forms_1.Validators.required],
            quantity: [null],
            // office: [null, Validators.required],
            batchCode: [null],
            // warehouseCode: [null, Validators.required],
            isShelfBased: [null]
        });
    };
    BoxCountComponent.prototype.setFormValues = function (barcode, check) {
        return __awaiter(this, void 0, Promise, function () {
            var state, result, currentShelfNo, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.shelfNumbers = 'RAFLAR:';
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        state = this.generalService.isGuid(barcode);
                        if (!(barcode.includes('http') || state)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.productService.countProductByBarcode3(barcode)];
                    case 2:
                        result = _a.sent();
                        this.shelfNumbers += result[0];
                        if (check) {
                            currentShelfNo = this.checkForm.get('shelfNo').value;
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
                        error_1 = _a.sent();
                        this.toasterService.error(error_1.message);
                        return [2 /*return*/, null];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    BoxCountComponent.prototype.getQuantity = function (barcode) {
        return __awaiter(this, void 0, Promise, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.productService.countProductByBarcode(barcode)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result[1]];
                }
            });
        });
    };
    BoxCountComponent.prototype.check = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!((this.qrBarcodeUrl == null || this.qrBarcodeUrl == undefined) && (this.checkForm.value.barcode.includes('http') || this.generalService.isGuid(this.checkForm.value.barcode)))) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.control(this.checkForm.value)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                    case 2:
                        if ((this.qrBarcodeUrl == null || this.qrBarcodeUrl == undefined)) {
                            this.toasterService.error('Lütfen Bir Qr Kod Giriniz');
                            this.clearQrAndBatchCode();
                            ;
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.onSubmit(this.checkForm.value)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BoxCountComponent.prototype.control = function (countProductRequestModel) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var number;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (countProductRequestModel.barcode === 'http://www.dayve.com') {
                            return [2 /*return*/];
                        }
                        while (countProductRequestModel.barcode.includes('=')) {
                            countProductRequestModel.barcode =
                                countProductRequestModel.barcode.replace('=', '-');
                        }
                        if (!(countProductRequestModel.barcode.includes('http') ||
                            this.generalService.isGuid(countProductRequestModel.barcode))) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.setFormValues(countProductRequestModel.barcode, true)];
                    case 1:
                        number = _b.sent();
                        (_a = this.checkForm.get('quantity')) === null || _a === void 0 ? void 0 : _a.setValue(Number(number));
                        this.qrBarcodeUrl = countProductRequestModel.barcode;
                        if (countProductRequestModel.shelfNo != null) {
                            // this.onSubmit(this.checkForm.value);
                        }
                        return [2 /*return*/];
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    BoxCountComponent.prototype.onSubmit = function (countProductRequestModel) {
        var _a;
        return __awaiter(this, void 0, Promise, function () {
            var uuuid, number, url, newResponse, shelves, response, qrResponse, data, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.generalService.generateGUID()];
                    case 1:
                        uuuid = _b.sent();
                        if (!!this.checkForm.valid) return [3 /*break*/, 5];
                        if (!countProductRequestModel.barcode) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.setFormValues(countProductRequestModel.barcode, true)];
                    case 2:
                        number = _b.sent();
                        (_a = this.checkForm.get('quantity')) === null || _a === void 0 ? void 0 : _a.setValue(Number(number)); //quantity alanı dolduruldu
                        this.toasterService.success('Raflar Getirildi Ve Miktar Alanı Dolduruldu.');
                        return [3 /*break*/, 4];
                    case 3:
                        this.toasterService.warn('Barkod Alanı Boş.');
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                    case 5:
                        url = ClientUrls_1.ClientUrls.baseUrl + '/Order/CountProduct3';
                        _b.label = 6;
                    case 6:
                        _b.trys.push([6, 11, , 12]);
                        return [4 /*yield*/, this.productService.countProductByBarcode(countProductRequestModel.barcode)];
                    case 7:
                        newResponse = _b.sent();
                        shelves = newResponse[0]
                            .split(',')
                            .filter(function (raflar) { return raflar.trim() !== ''; })
                            .map(function (raflar) { return raflar.toLowerCase(); });
                        if (!this.state) return [3 /*break*/, 10];
                        this.state = false;
                        return [4 /*yield*/, this.warehouseService.countProductRequest(countProductRequestModel.barcode, countProductRequestModel.shelfNo, countProductRequestModel.quantity == null
                                ? Number(newResponse[1])
                                : countProductRequestModel.quantity, countProductRequestModel.office, countProductRequestModel.warehouseCode, countProductRequestModel.batchCode, 'Order/CountProduct3', this.currentOrderNo, '')];
                    case 8:
                        response = _b.sent();
                        return [4 /*yield*/, this.productService.qrOperationMethod(uuuid, this.currentOrderNo, this.qrBarcodeUrl, this.checkForm, countProductRequestModel, Number(newResponse[1]), false, 'CO')];
                    case 9:
                        qrResponse = _b.sent();
                        if (qrResponse != null && qrResponse.state === true) {
                            this.qrOperationModels.push(qrResponse.qrOperationModel);
                        }
                        else if (qrResponse === null) {
                            this.toasterService.error('QR Kod Okunamadı.');
                            this.clearQrAndBatchCode();
                        }
                        //↑↑↑↑↑↑↑↑↑ EĞER QRURl BOŞ DEĞİLSE KONTROL EDİLCEK ↑↑↑↑↑↑↑↑↑
                        if (response != undefined) {
                            data = response;
                            if (data.status == 'RAF') {
                                countProductRequestModel.shelfNo = response.description;
                            }
                            else {
                                countProductRequestModel.barcode = response.description;
                            }
                            this.generalService.beep();
                            this.clearQrAndBatchCode();
                            this.state = true;
                        }
                        _b.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        error_2 = _b.sent();
                        this.toasterService.error(error_2.message);
                        this.state = true;
                        return [3 /*break*/, 12];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    BoxCountComponent.prototype.clearShelfNumbers = function () {
        this.checkForm.get('shelfNo').setValue(null);
        this.checkForm.get('barcode').setValue(null);
        this.focusNextInput('shelfNo');
        this.shelfNumbers = 'RAFLAR:';
        this.qrBarcodeUrl = null;
        this.checkForm.get('quantity').setValue(null);
        this.checkForm.get('batchCode').setValue(null);
    };
    BoxCountComponent.prototype.clearQrAndBatchCode = function () {
        this.checkForm.get('barcode').setValue(null);
        this.checkForm.get('batchCode').setValue(null);
        this.checkForm.get('quantity').setValue(null);
        this.focusNextInput('countPageBarcode');
        this.shelfNumbers = 'RAFLAR:';
        this.qrBarcodeUrl = null;
    };
    BoxCountComponent.prototype.deleteOrderProduct = function (orderNo, product) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.productService.deleteOrderProduct(this.currentOrderNo, product.itemCode, product.lineId)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            this.list = this.list.filter(function (o) { return !(o.barcode == product.itemCode && o.shelfNo == product.shelfNo); });
                            this.toasterService.success('Silme İşlemi Başarılı.');
                        }
                        else {
                            this.toasterService.error('Silme İşlemi Başarısız.');
                        }
                        return [2 /*return*/, response];
                }
            });
        });
    };
    BoxCountComponent = __decorate([
        core_1.Component({
            selector: 'app-box-count',
            templateUrl: './box-count.component.html',
            styleUrls: ['./box-count.component.css']
        })
    ], BoxCountComponent);
    return BoxCountComponent;
}());
exports.BoxCountComponent = BoxCountComponent;
