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
exports.CreateQrComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var html2canvas_1 = require("html2canvas");
var ClientUrls_1 = require("src/app/models/const/ClientUrls");
var qrCode_1 = require("src/app/models/model/product/qrCode");
var product_service_1 = require("src/app/services/admin/product.service");
var CreateQrComponent = /** @class */ (function () {
    function CreateQrComponent(formBuilder, toasterService, sanitizer, generalService, productService, httpClientService, datePipe, warehouseService, headerService) {
        this.formBuilder = formBuilder;
        this.toasterService = toasterService;
        this.sanitizer = sanitizer;
        this.generalService = generalService;
        this.productService = productService;
        this.httpClientService = httpClientService;
        this.datePipe = datePipe;
        this.warehouseService = warehouseService;
        this.headerService = headerService;
        this.upPageDescription = null;
        this.barcode = null;
        this.quantity = null;
        this.batchCode = null;
        this.activeTab = 1;
        this.qrCodeValue = '';
        this.qrCodeDownloadLink = this.sanitizer.bypassSecurityTrustResourceUrl('');
        this.products = [];
        this.brand = null;
        this.address = null;
        this.date = null;
    }
    CreateQrComponent.prototype.ngOnChanges = function (changes) {
        if (changes["barcode"] && !changes["barcode"].isFirstChange()) {
            this.checkForm.get('barcode').setValue(changes["barcode"].currentValue);
        }
        if (changes["batchCode"] && !changes["batchCode"].isFirstChange()) {
            this.checkForm.get('batchCode').setValue(changes["batchCode"].currentValue);
        }
        if (changes["quantity"] && !changes["quantity"].isFirstChange()) {
            this.checkForm.get('quantity').setValue(changes["quantity"].currentValue);
        }
        this.onSubmit(this.checkForm.value);
    };
    CreateQrComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.headerService.updatePageTitle(this.upPageDescription != undefined ? this.upPageDescription : "Kutu Etiketi Oluştur");
                        this.formGenerator();
                        this.focusNextInput('barcode');
                        // Subscribe to the valueChanges observable to detect changes
                        this.checkForm.valueChanges.subscribe(function (newValue) {
                            _this.qrCodeValue = '';
                        });
                        return [4 /*yield*/, this.startPage()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateQrComponent.prototype.startPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.generalService.generateGUID()];
                    case 1:
                        _a.boxId = _b.sent();
                        if (this.boxId) {
                            this.checkForm.get('boxId').setValue(this.boxId);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateQrComponent.prototype.newBox = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.checkForm.reset();
                        this.formGenerator();
                        this.qrCodeValue = '';
                        _a = this;
                        return [4 /*yield*/, this.generalService.generateGUID()];
                    case 1:
                        _a.boxId = _b.sent();
                        if (this.boxId) {
                            this.checkForm.get('boxId').setValue(this.boxId);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateQrComponent.prototype.formGenerator = function () {
        this.checkForm = this.formBuilder.group({
            barcode: [null, forms_1.Validators.required],
            itemCode: [null, forms_1.Validators.required],
            shelfNo: [null],
            batchCode: [null],
            boxId: [null],
            boxNo: [null],
            quantity: [null, forms_1.Validators.required],
            printCount: [1, forms_1.Validators.required],
            brand: [null, forms_1.Validators.required],
            countMultiple: [false],
            doubleVerification: [false],
            itemDesc: [null, forms_1.Validators.required],
            dateArea: [new Date(), forms_1.Validators.required]
        });
    };
    CreateQrComponent.prototype.captureDirect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var element;
            var _this = this;
            return __generator(this, function (_a) {
                element = this.captureElement.nativeElement;
                html2canvas_1["default"](element).then(function (canvas) { return __awaiter(_this, void 0, void 0, function () {
                    var imgData, link, code, m, qr, formValue, response, confirmDelete2, requestModel, response, isMultipleCountPage;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                imgData = canvas.toDataURL('image/png');
                                link = document.createElement('a');
                                link.href = imgData;
                                code = imgData.split('base64,')[1];
                                if (!code) return [3 /*break*/, 3];
                                m = this.checkForm.value;
                                qr = new qrCode_1.QrCode();
                                formValue = this.checkForm.value;
                                qr.id = 0;
                                qr.uniqueId = this.boxId;
                                qr.createdDate = new Date();
                                qr.barcodeBase64 = code;
                                qr.barcode = m.barcode;
                                qr.description = formValue.itemDesc;
                                qr.warehouseCode = this.products[0].warehouseCode;
                                qr.photoUrl = "http://212.156.46.206:7676/photo/" + formValue.itemCode + "/" + formValue.itemCode + ".jpg";
                                qr.shelfNo = formValue.shelfNo;
                                qr.itemCode = formValue.itemCode;
                                qr.batchCode = formValue.batchCode;
                                qr.price = formValue.price;
                                qr.quantity = m.quantity;
                                qr.brandDescription = formValue.brand;
                                qr.boxNo = formValue.boxNo;
                                return [4 /*yield*/, this.productService.addQr(qr)];
                            case 1:
                                response = _a.sent();
                                if (response) {
                                    this.toasterService.success('Kayıt Edildi');
                                    if (isMultipleCountPage === false) {
                                        location.reload();
                                    }
                                    this.generalService.beep();
                                }
                                else {
                                    this.toasterService.error('Kayıt Edilmedi');
                                }
                                confirmDelete2 = window.confirm('Yazıcıdan Yazdırılacaktır. Emin misiniz?');
                                if (!confirmDelete2) return [3 /*break*/, 3];
                                requestModel = {
                                    imageCode: code,
                                    printCount: this.checkForm.get('printCount').value
                                };
                                return [4 /*yield*/, this.httpClientService
                                        .post({ controller: 'Order/Qr' }, requestModel)
                                        .toPromise()];
                            case 2:
                                response = _a.sent();
                                // Base64 veriyi konsola bas
                                if (response) {
                                    isMultipleCountPage = this.checkForm.get('countMultiple').value;
                                    if (!isMultipleCountPage) {
                                        location.reload();
                                    }
                                    this.toasterService.success('Yazdırıldı');
                                }
                                _a.label = 3;
                            case 3: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    CreateQrComponent.prototype.captureVerification = function () {
        return __awaiter(this, void 0, void 0, function () {
            var element;
            var _this = this;
            return __generator(this, function (_a) {
                element = this.captureElement.nativeElement;
                html2canvas_1["default"](element).then(function (canvas) { return __awaiter(_this, void 0, void 0, function () {
                    var imgData, link, code, confirmDelete, m, qr, formValue, response, confirmDelete2, requestModel, response, isMultipleCountPage;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                imgData = canvas.toDataURL('image/png');
                                link = document.createElement('a');
                                link.href = imgData;
                                code = imgData.split('base64,')[1];
                                if (!code) return [3 /*break*/, 3];
                                confirmDelete = window.confirm("Qr Kod Sisteme Kaydedilecektir. Emin misiniz?");
                                if (!confirmDelete) return [3 /*break*/, 3];
                                m = this.checkForm.value;
                                qr = new qrCode_1.QrCode();
                                formValue = this.checkForm.value;
                                qr.id = 0;
                                qr.uniqueId = this.boxId;
                                qr.createdDate = new Date();
                                qr.barcodeBase64 = code;
                                qr.barcode = m.barcode;
                                qr.description = formValue.itemDesc;
                                qr.warehouseCode = this.products[0].warehouseCode;
                                qr.photoUrl = "http://212.156.46.206:7676/photo/" + formValue.itemCode + "/" + formValue.itemCode + ".jpg";
                                qr.shelfNo = formValue.shelfNo;
                                qr.itemCode = formValue.itemCode;
                                qr.batchCode = formValue.batchCode;
                                qr.price = formValue.price;
                                qr.quantity = m.quantity;
                                qr.brandDescription = formValue.brand;
                                qr.boxNo = formValue.boxNo;
                                return [4 /*yield*/, this.productService.addQr(qr)];
                            case 1:
                                response = _a.sent();
                                if (response) {
                                    this.toasterService.success('Kayıt Edildi');
                                    // this.newId = await this.generalService.generateGUID(); // her barkod sisteme kayıt edildikten sonra yeni bir id değeri atandı;
                                    this.generalService.beep();
                                }
                                else {
                                    this.toasterService.error('Kayıt Edilmedi');
                                }
                                confirmDelete2 = window.confirm('Yazıcıdan Yazdırılacaktır. Emin misiniz?');
                                if (!confirmDelete2) return [3 /*break*/, 3];
                                requestModel = {
                                    imageCode: code,
                                    printCount: this.checkForm.get('printCount').value
                                };
                                return [4 /*yield*/, this.httpClientService
                                        .post({ controller: 'Order/Qr' }, requestModel)
                                        .toPromise()];
                            case 2:
                                response = _a.sent();
                                // Base64 veriyi konsola bas
                                if (response) {
                                    isMultipleCountPage = this.checkForm.get('countMultiple').value;
                                    if (!isMultipleCountPage) {
                                        location.reload();
                                    }
                                    this.toasterService.success('Yazdırıldı');
                                }
                                _a.label = 3;
                            case 3: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    CreateQrComponent.prototype.onChangeURL = function (url) {
        this.qrCodeDownloadLink = url;
    };
    CreateQrComponent.prototype.getCurrentDateTime = function () {
        var currentDate = new Date();
        var formattedDate = this.datePipe.transform(currentDate, 'yyyy-dd-MM HH.mm');
        this.date = formattedDate;
    };
    CreateQrComponent.prototype.onSubmit = function (m) {
        return __awaiter(this, void 0, void 0, function () {
            var model, result, result, _a, response, p, guid, formData, response2, data2, json;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!m.barcode) return [3 /*break*/, 9];
                        model = new product_service_1.BarcodeSearch_RM();
                        model.barcode = m.barcode;
                        if (!(m.barcode.includes('http') || this.generalService.isGuid(m.barcode))) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.productService.countProductByBarcode3(m.barcode)];
                    case 1:
                        result = _b.sent();
                        if (result && result[3] != '' && result[3] != undefined) {
                            this.checkForm.get('barcode').setValue(result[3]);
                            this.checkForm.get('quantity').setValue(result[1]);
                            this.checkForm.get('batchCode').setValue(result[2].toString());
                            this.onSubmit(this.checkForm.value);
                            return [2 /*return*/];
                        }
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.productService.countProductByBarcode(m.barcode)];
                    case 3:
                        result = _b.sent();
                        if (result && result[3] != '' && result[3] != undefined) {
                            this.checkForm.get('barcode').setValue(result[3]);
                            if (!m.quantity) {
                                this.checkForm.get('quantity').setValue(result[1]);
                            }
                            this.checkForm.get('batchCode').setValue(result[2].toString());
                        }
                        _b.label = 4;
                    case 4:
                        _a = this;
                        return [4 /*yield*/, this.productService.searchProduct(model)];
                    case 5:
                        _a.products = _b.sent();
                        if (!this.products) return [3 /*break*/, 8];
                        this.address = m.address;
                        this.getCurrentDateTime();
                        response = this.setFormValues(this.products[0], m);
                        this.brand = this.products[0].brandDescription;
                        if (!true) return [3 /*break*/, 8];
                        p = this.products[0];
                        return [4 /*yield*/, this.generalService.generateGUID()];
                    case 6:
                        guid = _b.sent();
                        this.currentQr = guid;
                        m.id = this.currentQr;
                        formData = this.checkForm.value;
                        return [4 /*yield*/, this.warehouseService.countProductRequest(formData.barcode, '', 0, '', '', '', 'Order/CountProductControl', '', '')];
                    case 7:
                        response2 = _b.sent();
                        if (response != undefined) {
                            data2 = response2;
                            formData.barcode = response2.description;
                        }
                        if (this.checkForm.valid) {
                            json = ClientUrls_1.ClientUrls.baseUrl2 + this.boxId;
                            this.qrCodeValue = json;
                        }
                        else {
                            this.generalService.whichRowIsInvalid(this.checkForm);
                        }
                        _b.label = 8;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        this.generalService.whichRowIsInvalid(this.checkForm);
                        _b.label = 10;
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    CreateQrComponent.prototype.setFormValues = function (model, formValue) {
        try {
            this.checkForm.patchValue({
                itemCode: model.itemCode,
                // batchCode: model.batchCode,
                itemDesc: model.description,
                brand: model.brandDescription
            });
            if (formValue.itemCode) {
                this.checkForm.get('itemCode').setValue(formValue.itemCode);
            }
            if (formValue.batchCode) {
                this.checkForm.get('batchCode').setValue(formValue.batchCode);
            }
            if (formValue.itemDesc) {
                this.checkForm.get('itemDesc').setValue(formValue.itemDesc);
            }
            return true;
        }
        catch (error) {
            return false;
        }
    };
    CreateQrComponent.prototype.saveQr = function (m) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                result = this.checkForm.get('doubleVerification').value;
                if (result) {
                    this.captureVerification();
                }
                else {
                    this.captureDirect();
                }
                return [2 /*return*/];
            });
        });
    };
    CreateQrComponent.prototype.clearShelfNumbers = function () {
        var shelfNo = this.checkForm.get('shelfNo').value;
        this.focusNextInput('barcode');
        this.checkForm.reset();
        //new Date()
        this.checkForm.get('shelfNo').setValue(shelfNo);
        this.checkForm.get('dateArea').setValue(new Date());
        this.checkForm.get('printCount').setValue(1);
    };
    CreateQrComponent.prototype.focusNextInput = function (nextInputId) {
        var nextInput = document.getElementById(nextInputId);
        if (nextInput) {
            nextInput.focus();
        }
    };
    __decorate([
        core_1.Input()
    ], CreateQrComponent.prototype, "upPageDescription");
    __decorate([
        core_1.Input()
    ], CreateQrComponent.prototype, "barcode");
    __decorate([
        core_1.Input()
    ], CreateQrComponent.prototype, "quantity");
    __decorate([
        core_1.Input()
    ], CreateQrComponent.prototype, "batchCode");
    __decorate([
        core_1.ViewChild('qrCode')
    ], CreateQrComponent.prototype, "qrCode");
    __decorate([
        core_1.ViewChild('captureElement')
    ], CreateQrComponent.prototype, "captureElement");
    CreateQrComponent = __decorate([
        core_1.Component({
            selector: 'app-create-qr',
            templateUrl: './create-qr.component.html',
            styleUrls: ['./create-qr.component.css']
        })
    ], CreateQrComponent);
    return CreateQrComponent;
}());
exports.CreateQrComponent = CreateQrComponent;
