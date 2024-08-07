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
        this.menuInfos = [];
        this.nebimInfos = [];
        this.marketPlaceInfos = [];
        this.cargoInfos = [];
        this.nebimUserInfos = [];
        this.paymentInfos = [];
    }
    PagesInfoComponent.prototype.ngOnInit = function () {
        this.createCompanyInfoForm();
        this.createNebimInfoForm();
        this.createMailInfoForm();
        this.createReportInfoForm();
        this.createDatabaseInfoForm();
        this.createMarketPlaceInfoForm();
        this.createPaymentInfoForm();
        this.createCargoInfoForm();
        this.createNebimUserInfoForm();
        this.createMenuInfoForm();
        this.loadMenuInfos();
        this.loadCompanyInfo();
        this.loadNebimInfos();
        this.loadMailInfo();
        this.loadDatabaseInfo();
        this.loadMarketPlaceInfos();
        this.loadPaymentInfos();
        this.loadCargoInfos();
        this.loadNebimUserInfos();
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
            nebimInnerIp: [null],
            nebimOuterIp: [null],
            isOrderBase: [null],
            isCreditSale: [null],
            warehouseCode: [null]
        });
    };
    PagesInfoComponent.prototype.createNebimInfoForm = function () {
        this.nebimInfoForm = this.fb.group({
            id: [0],
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
    PagesInfoComponent.prototype.createMarketPlaceInfoForm = function () {
        this.marketPlaceInfoForm = this.fb.group({
            id: [0],
            description: [null],
            clientId: [null],
            clientSecret: [null],
            redirectUri: [null],
            baseUrl: [null],
            sellerId: [null]
        });
    };
    PagesInfoComponent.prototype.createPaymentInfoForm = function () {
        this.paymentInfoForm = this.fb.group({
            id: [0],
            merchantId: [null, forms_1.Validators.required],
            description: [null, forms_1.Validators.required],
            apiKey: [null, forms_1.Validators.required],
            apiSecretKey: [null, forms_1.Validators.required],
            okUrl: [null, forms_1.Validators.required],
            failUrl: [null, forms_1.Validators.required]
        });
    };
    PagesInfoComponent.prototype.createCargoInfoForm = function () {
        this.cargoInfoForm = this.fb.group({
            id: [0],
            description: [null, forms_1.Validators.required],
            userName: [null, forms_1.Validators.required],
            password: [null, forms_1.Validators.required],
            customerCode: [null],
            apiKey: [null],
            apiSecret: [null]
        });
    };
    PagesInfoComponent.prototype.createNebimUserInfoForm = function () {
        this.nebimUserInfoForm = this.fb.group({
            id: [0],
            description: [null, forms_1.Validators.required],
            userGroupCode: [null],
            userName: [null, forms_1.Validators.required],
            password: [null, forms_1.Validators.required]
        });
    };
    PagesInfoComponent.prototype.createMenuInfoForm = function () {
        this.menuInfoForm = this.fb.group({
            id: [0],
            label: [null, forms_1.Validators.required],
            route: [null],
            action: [null],
            icon: [null],
            parentId: [null],
            isActive: [true]
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
                            this.companyInfoForm.patchValue(data);
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
    PagesInfoComponent.prototype.loadNebimInfos = function () {
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
                            this.mailInfoForm.patchValue(data);
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
                            this.databaseInfoForm.patchValue(data);
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
    PagesInfoComponent.prototype.loadMarketPlaceInfos = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.infoService.getMarketPlaceInfos()];
                    case 1:
                        data = _a.sent();
                        if (data) {
                            this.marketPlaceInfos = data;
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        this.toasterService.error('Pazar yeri bilgileri yüklenirken bir hata oluştu');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PagesInfoComponent.prototype.loadPaymentInfos = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.infoService.getPaymentInfos()];
                    case 1:
                        data = _a.sent();
                        if (data) {
                            this.paymentInfos = data;
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        this.toasterService.error('Payment infos could not be loaded');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PagesInfoComponent.prototype.loadCargoInfos = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.infoService.getCargoInfos()];
                    case 1:
                        data = _a.sent();
                        if (data) {
                            this.cargoInfos = data;
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_7 = _a.sent();
                        this.toasterService.error('Cargo infos could not be loaded');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PagesInfoComponent.prototype.loadNebimUserInfos = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.infoService.getNebimUserInfos()];
                    case 1:
                        data = _a.sent();
                        if (data) {
                            this.nebimUserInfos = data;
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_8 = _a.sent();
                        this.toasterService.error('Nebim user infos could not be loaded');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PagesInfoComponent.prototype.loadMenuInfos = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.infoService.getMenuInfos()];
                    case 1:
                        data = _a.sent();
                        this.menuInfos = data;
                        return [3 /*break*/, 3];
                    case 2:
                        error_9 = _a.sent();
                        this.toasterService.error('Menü bilgileri yüklenirken bir hata oluştu');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PagesInfoComponent.prototype.onSubmitCompanyInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_10;
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
                            // this.companyInfoForm.reset();
                        }
                        else {
                            this.toasterService.error('Şirket bilgileri kaydedilemedi');
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_10 = _a.sent();
                        this.toasterService.error('Şirket bilgileri kaydedilirken bir hata oluştu');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PagesInfoComponent.prototype.onEditNebimInfo = function (nebim) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.updatedNebimInfo = nebim;
                this.nebimInfoForm.patchValue(nebim);
                return [2 /*return*/];
            });
        });
    };
    PagesInfoComponent.prototype.onDeleteNebimInfo = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.infoService.deleteNebimInfo(id)];
                    case 1:
                        result = _a.sent();
                        if (!result) return [3 /*break*/, 3];
                        this.toasterService.success('Nebim bilgileri başarıyla silindi');
                        return [4 /*yield*/, this.loadNebimInfos()];
                    case 2:
                        _a.sent(); // Refresh the list after deletion
                        return [3 /*break*/, 4];
                    case 3:
                        this.toasterService.error('Nebim bilgileri silinemedi');
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_11 = _a.sent();
                        this.toasterService.error('Nebim bilgileri silinirken bir hata oluştu');
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    PagesInfoComponent.prototype.onSubmitNebimInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, result, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.nebimInfoForm.invalid) {
                            this.toasterService.error('Lütfen tüm gerekli alanları doldurun');
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 9, , 10]);
                        if (!this.updatedNebimInfo) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.infoService.updateNebimInfo(this.nebimInfoForm.value)];
                    case 2:
                        result = _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        this.nebimInfoForm.value.id = 0;
                        return [4 /*yield*/, this.infoService.addNebimInfo(this.nebimInfoForm.value)];
                    case 4:
                        result = _a.sent();
                        _a.label = 5;
                    case 5:
                        if (!result) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.loadNebimInfos()];
                    case 6:
                        _a.sent();
                        this.toasterService.success('Nebim bilgileri başarıyla kaydedildi');
                        this.updatedNebimInfo = null;
                        this.nebimInfoForm.reset();
                        return [3 /*break*/, 8];
                    case 7:
                        this.toasterService.error('Nebim bilgileri kaydedilemedi');
                        _a.label = 8;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        error_12 = _a.sent();
                        this.toasterService.error('Nebim bilgileri kaydedilirken bir hata oluştu');
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    //----------------------------------------------------------------------------------MAIL
    PagesInfoComponent.prototype.onSubmitMailInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_13;
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
                            // this.mailInfoForm.reset();
                        }
                        else {
                            this.toasterService.error('Mail bilgileri kaydedilemedi');
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_13 = _a.sent();
                        this.toasterService.error('Mail bilgileri kaydedilirken bir hata oluştu');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PagesInfoComponent.prototype.onSubmitReportInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_14;
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
                        error_14 = _a.sent();
                        this.toasterService.error('Rapor bilgileri kaydedilirken bir hata oluştu');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PagesInfoComponent.prototype.onSubmitDatabaseInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.databaseInfoForm.invalid) {
                            this.toasterService.error('Lütfen tüm gerekli alanları doldurun');
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, this.infoService.addDatabaseInfo(this.databaseInfoForm.value)];
                    case 2:
                        result = _a.sent();
                        if (!result) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.loadDatabaseInfo()];
                    case 3:
                        _a.sent();
                        this.toasterService.success('Veritabanı bilgileri başarıyla kaydedildi');
                        return [3 /*break*/, 5];
                    case 4:
                        this.toasterService.error('Veritabanı bilgileri kaydedilemedi');
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_15 = _a.sent();
                        this.toasterService.error('Veritabanı bilgileri kaydedilirken bir hata oluştu');
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    PagesInfoComponent.prototype.onSubmitMarketPlaceInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, result, error_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.marketPlaceInfoForm.invalid) {
                            this.toasterService.error('Lütfen tüm gerekli alanları doldurun');
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        if (!this.updatedMarketPlaceInfo) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.infoService.updateMarketPlaceInfo(this.marketPlaceInfoForm.value)];
                    case 2:
                        result = _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        this.marketPlaceInfoForm.value.id = 0;
                        return [4 /*yield*/, this.infoService.addMarketPlaceInfo(this.marketPlaceInfoForm.value)];
                    case 4:
                        result = _a.sent();
                        _a.label = 5;
                    case 5:
                        if (result) {
                            this.toasterService.success('Pazar yeri bilgileri başarıyla kaydedildi');
                            this.updatedMarketPlaceInfo = null;
                            this.marketPlaceInfoForm.reset();
                            this.loadMarketPlaceInfos();
                        }
                        else {
                            this.toasterService.error('Pazar yeri bilgileri kaydedilemedi');
                        }
                        return [3 /*break*/, 7];
                    case 6:
                        error_16 = _a.sent();
                        this.toasterService.error('Pazar yeri bilgileri kaydedilirken bir hata oluştu');
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    PagesInfoComponent.prototype.onEditMarketPlaceInfo = function (marketPlace) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.updatedMarketPlaceInfo = marketPlace;
                this.marketPlaceInfoForm.patchValue(marketPlace);
                return [2 /*return*/];
            });
        });
    };
    PagesInfoComponent.prototype.onDeleteMarketPlaceInfo = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.infoService.deleteMarketPlaceInfo(id)];
                    case 1:
                        result = _a.sent();
                        if (result) {
                            this.toasterService.success('Pazar yeri bilgileri başarıyla silindi');
                            this.loadMarketPlaceInfos();
                        }
                        else {
                            this.toasterService.error('Pazar yeri bilgileri silinemedi');
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_17 = _a.sent();
                        this.toasterService.error('Pazar yeri bilgileri silinirken bir hata oluştu');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PagesInfoComponent.prototype.onSubmitPaymentInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, result, error_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.paymentInfoForm.invalid) {
                            this.toasterService.error('Please fill all required fields');
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        if (!this.updatedPaymentInfo) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.infoService.updatePaymentInfo(this.paymentInfoForm.value)];
                    case 2:
                        result = _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        this.paymentInfoForm.value.id = 0;
                        return [4 /*yield*/, this.infoService.addPaymentInfo(this.paymentInfoForm.value)];
                    case 4:
                        result = _a.sent();
                        _a.label = 5;
                    case 5:
                        if (result) {
                            this.toasterService.success('Payment info successfully saved');
                            this.loadPaymentInfos();
                            this.updatedNebimInfo = null;
                            this.paymentInfoForm.reset();
                        }
                        else {
                            this.toasterService.error('Payment info could not be saved');
                        }
                        return [3 /*break*/, 7];
                    case 6:
                        error_18 = _a.sent();
                        this.toasterService.error('An error occurred while saving payment info');
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    PagesInfoComponent.prototype.onEditPaymentInfo = function (paymentInfo) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.updatedPaymentInfo = paymentInfo;
                this.paymentInfoForm.patchValue(paymentInfo);
                return [2 /*return*/];
            });
        });
    };
    PagesInfoComponent.prototype.onDeletePaymentInfo = function (merchantId) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.infoService.deletePaymentInfo(merchantId)];
                    case 1:
                        result = _a.sent();
                        if (result) {
                            this.toasterService.success('Payment info successfully deleted');
                            this.loadPaymentInfos();
                        }
                        else {
                            this.toasterService.error('Payment info could not be deleted');
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_19 = _a.sent();
                        this.toasterService.error('An error occurred while deleting payment info');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PagesInfoComponent.prototype.onSubmitCargoInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_20;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.cargoInfoForm.invalid) {
                            this.toasterService.error('Please fill all required fields');
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        result = void 0;
                        if (!this.updatedCargoInfo) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.infoService.updateCargoInfo(this.cargoInfoForm.value)];
                    case 2:
                        result = _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        this.cargoInfoForm.value.id = 0;
                        return [4 /*yield*/, this.infoService.addCargoInfo(this.cargoInfoForm.value)];
                    case 4:
                        result = _a.sent();
                        _a.label = 5;
                    case 5:
                        if (result) {
                            this.toasterService.success('Cargo info successfully saved');
                            this.loadCargoInfos();
                            this.updatedCargoInfo = null;
                            this.cargoInfoForm.reset();
                        }
                        else {
                            this.toasterService.error('Cargo info could not be saved');
                        }
                        return [3 /*break*/, 7];
                    case 6:
                        error_20 = _a.sent();
                        this.toasterService.error('An error occurred while saving cargo info');
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    PagesInfoComponent.prototype.onEditCargoInfo = function (cargoInfo) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.updatedCargoInfo = cargoInfo;
                this.cargoInfoForm.patchValue(cargoInfo);
                return [2 /*return*/];
            });
        });
    };
    PagesInfoComponent.prototype.onDeleteCargoInfo = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_21;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.infoService.deleteCargoInfo(id)];
                    case 1:
                        result = _a.sent();
                        if (result) {
                            this.toasterService.success('Cargo info successfully deleted');
                            this.loadCargoInfos();
                        }
                        else {
                            this.toasterService.error('Cargo info could not be deleted');
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_21 = _a.sent();
                        this.toasterService.error('An error occurred while deleting cargo info');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PagesInfoComponent.prototype.onSubmitNebimUserInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_22;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.nebimUserInfoForm.invalid) {
                            this.toasterService.error('Please fill all required fields');
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        result = void 0;
                        if (!this.updatedNebimUserInfo) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.infoService.updateNebimUserInfo(this.nebimUserInfoForm.value)];
                    case 2:
                        result = _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        this.nebimUserInfoForm.value.id = 0;
                        return [4 /*yield*/, this.infoService.addNebimUserInfo(this.nebimUserInfoForm.value)];
                    case 4:
                        result = _a.sent();
                        _a.label = 5;
                    case 5:
                        if (result) {
                            this.toasterService.success('Nebim user info successfully saved');
                            this.loadNebimUserInfos();
                            this.updatedNebimUserInfo = null;
                            this.nebimUserInfoForm.reset();
                        }
                        else {
                            this.toasterService.error('Nebim user info could not be saved');
                        }
                        return [3 /*break*/, 7];
                    case 6:
                        error_22 = _a.sent();
                        this.toasterService.error('An error occurred while saving Nebim user info');
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    PagesInfoComponent.prototype.onEditNebimUserInfo = function (nebimUserInfo) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.updatedNebimUserInfo = nebimUserInfo;
                this.nebimUserInfoForm.patchValue(nebimUserInfo);
                return [2 /*return*/];
            });
        });
    };
    PagesInfoComponent.prototype.onDeleteNebimUserInfo = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_23;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.infoService.deleteNebimUserInfo(id)];
                    case 1:
                        result = _a.sent();
                        if (result) {
                            this.toasterService.success('Nebim user info successfully deleted');
                            this.loadNebimUserInfos();
                        }
                        else {
                            this.toasterService.error('Nebim user info could not be deleted');
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_23 = _a.sent();
                        this.toasterService.error('An error occurred while deleting Nebim user info');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PagesInfoComponent.prototype.onSubmitMenuInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, result, error_24;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.menuInfoForm.invalid) {
                            this.toasterService.error('Lütfen tüm gerekli alanları doldurun');
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        if (!this.updatedMenuInfo) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.infoService.updateMenuInfo(this.menuInfoForm.value)];
                    case 2:
                        result = _a.sent();
                        if (result) {
                            this.toasterService.success('Menü bilgileri başarıyla güncellendi');
                            this.loadMenuInfos();
                            this.updatedMenuInfo = null;
                            this.menuInfoForm.reset();
                        }
                        else {
                            this.toasterService.error('Menü bilgileri güncellenemedi');
                        }
                        return [3 /*break*/, 5];
                    case 3:
                        this.menuInfoForm.value.id = 0;
                        return [4 /*yield*/, this.infoService.addMenuInfo(this.menuInfoForm.value)];
                    case 4:
                        result = _a.sent();
                        if (result) {
                            this.toasterService.success('Menü bilgileri başarıyla kaydedildi');
                            this.loadMenuInfos();
                            this.menuInfoForm.reset();
                        }
                        else {
                            this.toasterService.error('Menü bilgileri kaydedilemedi');
                        }
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_24 = _a.sent();
                        this.toasterService.error('Menü bilgileri kaydedilirken bir hata oluştu');
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    PagesInfoComponent.prototype.onEditMenuInfo = function (menuInfo) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.updatedMenuInfo = menuInfo;
                this.menuInfoForm.patchValue(menuInfo);
                return [2 /*return*/];
            });
        });
    };
    PagesInfoComponent.prototype.onDeleteMenuInfo = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_25;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.infoService.deleteMenuInfo(id)];
                    case 1:
                        result = _a.sent();
                        if (result) {
                            this.toasterService.success('Menü bilgileri başarıyla silindi');
                            this.loadMenuInfos();
                        }
                        else {
                            this.toasterService.error('Menü bilgileri silinemedi');
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_25 = _a.sent();
                        this.toasterService.error('Menü bilgileri silinirken bir hata oluştu');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PagesInfoComponent.prototype.onToggleActive = function (menuInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_26;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        menuInfo.isActive = !menuInfo.isActive;
                        return [4 /*yield*/, this.infoService.updateMenuInfo(menuInfo)];
                    case 1:
                        result = _a.sent();
                        if (result) {
                            this.toasterService.success('Menü durumu güncellendi');
                            this.loadMenuInfos();
                        }
                        else {
                            this.toasterService.error('Menü durumu güncellenemedi');
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_26 = _a.sent();
                        this.toasterService.error('Menü durumu güncellenirken bir hata oluştu');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
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
