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
exports.PagesInfoComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var PagesInfoComponent = /** @class */ (function () {
    function PagesInfoComponent(fb, infoService, toasterService) {
        this.fb = fb;
        this.infoService = infoService;
        this.toasterService = toasterService;
        this.nebimInfos = [];
    }
    PagesInfoComponent.prototype.ngOnInit = function () {
        this.createCompanyInfoForm();
        this.createNebimInfoForm();
        this.createMailInfoForm();
        this.createReportInfoForm();
        this.createDatabaseInfoForm();
        this.loadCompanyInfo();
        this.loadNebimInfo();
        this.loadMailInfo();
        this.loadDatabaseInfo();
    };
    PagesInfoComponent.prototype.createCompanyInfoForm = function () {
        this.companyInfoForm = this.fb.group({
            companyName: [null, forms_1.Validators.required],
            logoUrl: [null],
            serviceSector: [null],
            authorizedPerson: [null],
            phone: [null],
            fax: [null],
            taxOffice: [null],
            taxNumber: [null],
            tradeRegistryNo: [null],
            mersisNo: [null],
            email: [null, [forms_1.Validators.required, forms_1.Validators.email]],
            address: [null],
            postalCode: [null],
            companyCountry: [null],
            companyCity: [null],
            companyDistrict: [null],
            passwordResetUrl: [null],
            webSiteUrl: [null],
            printerName1: [null],
            printerName2: [null],
            documentsFolderPath: [null],
            invoiceFolderPath: [null],
            nebimUrl: [null]
        });
    };
    PagesInfoComponent.prototype.createNebimInfoForm = function () {
        this.nebimInfoForm = this.fb.group({
            type: [null],
            officeCode: [null],
            storeCode: [null],
            posTerminalID: [null],
            shipmentMethodCode: [null],
            deliveryCompanyCode: [null]
        });
    };
    PagesInfoComponent.prototype.createMailInfoForm = function () {
        this.mailInfoForm = this.fb.group({
            isFirst: [false],
            userName: [null],
            password: [null],
            applicationPassword: [null]
        });
    };
    PagesInfoComponent.prototype.createReportInfoForm = function () {
        this.reportInfoForm = this.fb.group({
            description: [null],
            filePath: [null]
        });
    };
    PagesInfoComponent.prototype.createDatabaseInfoForm = function () {
        this.databaseInfoForm = this.fb.group({
            dataSource: [null],
            initialCatalog: [null],
            userID: [null],
            password: [null],
            trustServerCertificate: [false]
        });
    };
    PagesInfoComponent.prototype.loadCompanyInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.infoService.getCompanyInfos()];
                    case 1:
                        data = _a.sent();
                        if (data) {
                            this.companyInfoForm.patchValue(data[0]);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        this.toasterService.error('Şirket bilgileri yüklenirken bir hata oluştu');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PagesInfoComponent.prototype.loadNebimInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.infoService.getNebimInfos()];
                    case 1:
                        data = _a.sent();
                        if (data) {
                            this.nebimInfos = data;
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        this.toasterService.error('Nebim bilgileri yüklenirken bir hata oluştu');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PagesInfoComponent.prototype.loadMailInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.infoService.getMailInfos()];
                    case 1:
                        data = _a.sent();
                        if (data) {
                            this.mailInfoForm.patchValue(data[0]);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        this.toasterService.error('Mail bilgileri yüklenirken bir hata oluştu');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PagesInfoComponent.prototype.loadDatabaseInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.infoService.getDatabaseInfos()];
                    case 1:
                        data = _a.sent();
                        if (data) {
                            this.databaseInfoForm.patchValue(data[0]);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        this.toasterService.error('Veritabanı bilgileri yüklenirken bir hata oluştu');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PagesInfoComponent.prototype.onSubmitCompanyInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.companyInfoForm.invalid) {
                            this.toasterService.error('Lütfen tüm gerekli alanları doldurun');
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.infoService.addCompanyInfo(this.companyInfoForm.value)];
                    case 2:
                        result = _a.sent();
                        if (result) {
                            this.toasterService.success('Şirket bilgileri başarıyla kaydedildi');
                            this.companyInfoForm.reset();
                        }
                        else {
                            this.toasterService.error('Şirket bilgileri kaydedilemedi');
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_5 = _a.sent();
                        this.toasterService.error('Şirket bilgileri kaydedilirken bir hata oluştu');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PagesInfoComponent.prototype.onSubmitNebimInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.nebimInfoForm.invalid) {
                            this.toasterService.error('Lütfen tüm gerekli alanları doldurun');
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, this.infoService.addNebimInfo(this.nebimInfoForm.value)];
                    case 2:
                        result = _a.sent();
                        if (!result) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.loadNebimInfo()];
                    case 3:
                        _a.sent();
                        this.toasterService.success('Nebim bilgileri başarıyla kaydedildi');
                        this.nebimInfoForm.reset();
                        return [3 /*break*/, 5];
                    case 4:
                        this.toasterService.error('Nebim bilgileri kaydedilemedi');
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_6 = _a.sent();
                        this.toasterService.error('Nebim bilgileri kaydedilirken bir hata oluştu');
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    PagesInfoComponent.prototype.onSubmitMailInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.mailInfoForm.invalid) {
                            this.toasterService.error('Lütfen tüm gerekli alanları doldurun');
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.infoService.addMailInfo(this.mailInfoForm.value)];
                    case 2:
                        result = _a.sent();
                        if (result) {
                            this.toasterService.success('Mail bilgileri başarıyla kaydedildi');
                            this.mailInfoForm.reset();
                        }
                        else {
                            this.toasterService.error('Mail bilgileri kaydedilemedi');
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_7 = _a.sent();
                        this.toasterService.error('Mail bilgileri kaydedilirken bir hata oluştu');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PagesInfoComponent.prototype.onSubmitReportInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.reportInfoForm.invalid) {
                            this.toasterService.error('Lütfen tüm gerekli alanları doldurun');
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.infoService.addReportInfo(this.reportInfoForm.value)];
                    case 2:
                        result = _a.sent();
                        if (result) {
                            this.toasterService.success('Rapor bilgileri başarıyla kaydedildi');
                            this.reportInfoForm.reset();
                        }
                        else {
                            this.toasterService.error('Rapor bilgileri kaydedilemedi');
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_8 = _a.sent();
                        this.toasterService.error('Rapor bilgileri kaydedilirken bir hata oluştu');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PagesInfoComponent.prototype.onSubmitDatabaseInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.databaseInfoForm.invalid) {
                            this.toasterService.error('Lütfen tüm gerekli alanları doldurun');
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.infoService.addDatabaseInfo(this.databaseInfoForm.value)];
                    case 2:
                        result = _a.sent();
                        if (result) {
                            this.toasterService.success('Veritabanı bilgileri başarıyla kaydedildi');
                            this.databaseInfoForm.reset();
                        }
                        else {
                            this.toasterService.error('Veritabanı bilgileri kaydedilemedi');
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_9 = _a.sent();
                        this.toasterService.error('Veritabanı bilgileri kaydedilirken bir hata oluştu');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PagesInfoComponent = __decorate([
        core_1.Component({
            selector: 'app-pages-info',
            templateUrl: './pages-info.component.html',
            styleUrls: ['./pages-info.component.css']
        })
    ], PagesInfoComponent);
    return PagesInfoComponent;
}());
exports.PagesInfoComponent = PagesInfoComponent;
