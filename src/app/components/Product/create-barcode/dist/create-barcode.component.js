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
exports.CreateBarcodeComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var createBarcode_1 = require("./models/createBarcode");
var CreateBarcodeComponent = /** @class */ (function () {
    function CreateBarcodeComponent(formBuilder, generalService, toasterService, productService, activatedRoute, router) {
        this.formBuilder = formBuilder;
        this.generalService = generalService;
        this.toasterService = toasterService;
        this.productService = productService;
        this.activatedRoute = activatedRoute;
        this.router = router;
        this.countedProducts = [];
        this.activeTab = 1;
    }
    CreateBarcodeComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                //sşldfks
                this.activatedRoute.params.subscribe(function (params) { return __awaiter(_this, void 0, void 0, function () {
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                if (!params['operationNo']) return [3 /*break*/, 2];
                                this.operationNo = params['operationNo'];
                                _a = this;
                                return [4 /*yield*/, this.productService.getBarcodeModels(this.operationNo)];
                            case 1:
                                _a.countedProducts = _c.sent();
                                return [3 /*break*/, 4];
                            case 2:
                                _b = this;
                                return [4 /*yield*/, this.generalService.generateGUID()];
                            case 3:
                                _b.operationNo = _c.sent();
                                _c.label = 4;
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                this.formGenerator();
                return [2 /*return*/];
            });
        });
    };
    CreateBarcodeComponent.prototype.formGenerator = function () {
        this.checkForm = this.formBuilder.group({
            barcode: [null, forms_1.Validators.required],
            batchCode: [null, forms_1.Validators.required],
            quantity: [null, forms_1.Validators.required]
        });
    };
    CreateBarcodeComponent.prototype.onSubmit = function (formValue) {
        return __awaiter(this, void 0, void 0, function () {
            var number, number, request, _a, repsonse, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!!this.checkForm.valid) return [3 /*break*/, 6];
                        if (!(formValue.barcode.includes('http') ||
                            this.generalService.isGuid(formValue.barcode))) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.setFormValues(formValue.barcode)];
                    case 1:
                        number = _c.sent();
                        // this.onSubmit(this.checkForm.value);
                        return [2 /*return*/];
                    case 2:
                        if (!formValue.barcode) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.setFormValues(formValue.barcode)];
                    case 3:
                        number = _c.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        this.toasterService.warn('Barkod Alanı Boş.');
                        _c.label = 5;
                    case 5: return [2 /*return*/];
                    case 6:
                        if (!this.checkForm.valid) return [3 /*break*/, 11];
                        request = new createBarcode_1.CreateBarcodeModel();
                        request.barcode = formValue.barcode;
                        request.batchCode = formValue.batchCode;
                        request.quantity = formValue.quantity;
                        request.operationNo = this.operationNo;
                        _a = request;
                        return [4 /*yield*/, this.generalService.generateGUID()];
                    case 7:
                        _a.id = _c.sent();
                        request.createdDate = new Date();
                        return [4 /*yield*/, this.productService.addBarcodeModel(request)];
                    case 8:
                        repsonse = _c.sent();
                        if (!repsonse) return [3 /*break*/, 10];
                        _b = this;
                        return [4 /*yield*/, this.productService.getBarcodeModels(this.operationNo)];
                    case 9:
                        _b.countedProducts = _c.sent();
                        _c.label = 10;
                    case 10:
                        this.toasterService.success('Form Başarılı.');
                        this.clearShelfNumbers();
                        _c.label = 11;
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    CreateBarcodeComponent.prototype.setFormValues = function (barcode) {
        return __awaiter(this, void 0, Promise, function () {
            var result, result, error_1;
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
                        this.checkForm.get('batchCode').setValue(result[2]);
                        this.checkForm.get('barcode').setValue(result[3]);
                        return [2 /*return*/, result[1]];
                    case 3: return [4 /*yield*/, this.productService.countProductByBarcode(barcode)];
                    case 4:
                        result = _a.sent();
                        this.shelfNumbers += result[0];
                        this.checkForm.get('quantity').setValue(result[1]);
                        this.checkForm.get('batchCode').setValue(result[2]);
                        this.checkForm.get('barcode').setValue(result[3]);
                        return [2 /*return*/, null];
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
    CreateBarcodeComponent.prototype.clearShelfNumbers = function () {
        this.checkForm.reset();
        this.focusNextInput('barcode');
    };
    CreateBarcodeComponent.prototype.focusNextInput = function (nextInputId) {
        var nextInput = document.getElementById(nextInputId);
        if (nextInput) {
            nextInput.focus();
        }
    };
    CreateBarcodeComponent.prototype.completeOperation = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.productService.sendBarcodeModelsToNebim(this.operationNo)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            this.toasterService.success('İşlem Tamamlandı.');
                            this.router.navigate(['dashboard']);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateBarcodeComponent.prototype.deleteProduct = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            var response, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.productService.deleteBarcodeModel(value.id)];
                    case 1:
                        response = _b.sent();
                        if (!response) return [3 /*break*/, 3];
                        _a = this;
                        return [4 /*yield*/, this.productService.getBarcodeModels(this.operationNo)];
                    case 2:
                        _a.countedProducts = _b.sent();
                        this.toasterService.success('Ürün Silindi.');
                        _b.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CreateBarcodeComponent = __decorate([
        core_1.Component({
            selector: 'app-create-barcode',
            templateUrl: './create-barcode.component.html',
            styleUrls: ['./create-barcode.component.css']
        })
    ], CreateBarcodeComponent);
    return CreateBarcodeComponent;
}());
exports.CreateBarcodeComponent = CreateBarcodeComponent;
