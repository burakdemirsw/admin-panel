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
exports.FastTransferListComponent = void 0;
var core_1 = require("@angular/core");
var createBarcode_1 = require("src/app/components/Product/create-barcode/models/createBarcode");
var FastTransferListComponent = /** @class */ (function () {
    function FastTransferListComponent(spinnerService, router, headerService, warehosueService, generalService, productService, toasterService, activatedRoute, userService, exportCsvService) {
        var _this = this;
        this.spinnerService = spinnerService;
        this.router = router;
        this.headerService = headerService;
        this.warehosueService = warehosueService;
        this.generalService = generalService;
        this.productService = productService;
        this.toasterService = toasterService;
        this.activatedRoute = activatedRoute;
        this.userService = userService;
        this.exportCsvService = exportCsvService;
        this.currentPage = 1;
        this.fastTransferListModels = [];
        this.selectedTransfers = [];
        this.items = [
            {
                label: 'Excele Aktar',
                command: function () {
                    _this.exportCsv();
                }
            }
        ];
        this.userShelves = [];
        this.visible = false;
    }
    FastTransferListComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.userService.getUserClientInfoResponse()];
                    case 1:
                        _a.user_info = _b.sent();
                        return [4 /*yield*/, this.getUserShelves()];
                    case 2:
                        _b.sent();
                        this.spinnerService.show();
                        this.activatedRoute.params.subscribe(function (params) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!params["type"]) return [3 /*break*/, 2];
                                        this.pageType = params["type"];
                                        if (params["type"] == 'true') {
                                            this.headerService.updatePageTitle("Hızlı Transfer İstekleri");
                                        }
                                        else {
                                            this.headerService.updatePageTitle("Hızlı Transferler");
                                        }
                                        return [4 /*yield*/, this.getFastTransferList(params["type"])];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        }); });
                        this.spinnerService.hide();
                        return [2 /*return*/];
                }
            });
        });
    };
    FastTransferListComponent.prototype.exportCsv = function () {
        this.exportCsvService.exportToCsv(this.fastTransferListModels, 'my-orders');
    };
    FastTransferListComponent.prototype.getUserShelves = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.getUserShelves(this.user_info.userId)];
                    case 1:
                        response = _a.sent();
                        this.userShelves = response;
                        return [2 /*return*/];
                }
            });
        });
    };
    FastTransferListComponent.prototype.goPage = function (pageType) {
        return __awaiter(this, void 0, void 0, function () {
            var uuid, uuid, shelfNo, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(pageType != '4')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.generalService.generateGUID()];
                    case 1:
                        uuid = _a.sent();
                        location.href =
                            location.origin +
                                '/shelf-transfer-request/' +
                                uuid +
                                '/' +
                                pageType;
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.generalService.generateGUID()];
                    case 3:
                        uuid = _a.sent();
                        shelfNo = this.shelf.shelfNo;
                        url = location.origin +
                            '/shelf-transfer-request/' +
                            uuid +
                            '/' +
                            pageType
                            + '/' +
                            shelfNo;
                        this.toasterService.info(shelfNo);
                        console.log(url);
                        location.href =
                            url;
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // formGenerator() {
    //   this.filterForm = this.formBuilder.group({
    //     messageHeader: [null],
    //     level: [null],
    //     createdDate: [null],
    //     endDate: [null],
    //   });
    // }
    // async onSubmit(model: LogFilterModel) {
    //   var filter: LogFilterModel = new LogFilterModel();
    //   filter = model;
    //   this.log_VMList = await this.logService.getLogs(filter)
    // }
    FastTransferListComponent.prototype.routeNewPage5 = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(!id || id == '')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.generalService.generateGUID()];
                    case 1:
                        result = _a.sent();
                        this.router.navigate(["/shelf-transfer-request/" + result +
                                "/0"
                        ]);
                        return [3 /*break*/, 3];
                    case 2:
                        this.router.navigate(["/shelf-transfer-request/" + id +
                                "/0"
                        ]);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FastTransferListComponent.prototype.routeNewPage6 = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(!id || id == '')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.generalService.generateGUID()];
                    case 1:
                        result = _a.sent();
                        this.router.navigate(["/fast-transfer/" + result
                        ]);
                        return [3 /*break*/, 3];
                    case 2:
                        this.router.navigate(["/fast-transfer/" + id
                        ]);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FastTransferListComponent.prototype.routeToCPP = function (operation) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (operation.operationId.includes("REQ-")) {
                    operation.operationId = operation.operationId.split("REQ-")[1];
                    // this.routeNewPage5(id.split("REQ-")[1])
                }
                if (operation.processType == 0) {
                    this.router.navigate(["shelf-transfer-request", operation.operationId, operation.processType]);
                }
                else if (operation.processType == 1) {
                    this.router.navigate(["shelf-transfer-request", operation.operationId, operation.processType]);
                }
                else if (operation.processType == 2) {
                    this.router.navigate(["shelf-transfer-request", operation.operationId, operation.processType]);
                }
                else if (operation.processType == 3) {
                    this.router.navigate(["shelf-transfer-request", operation.operationId, operation.processType]);
                }
                else if (operation.processType == 4) {
                    this.router.navigate(["shelf-transfer-request", operation.operationId, operation.processType, operation.lastTargetShelfNo]);
                }
                else {
                    this.router.navigate(["shelf-transfer-request", operation.operationId, operation.processType]);
                }
                return [2 /*return*/];
            });
        });
    };
    //toplanan ürünler sayfasına akatarır fakat önce ilgili siparişin içeriğinden paketNo'değerini çeker.
    FastTransferListComponent.prototype.getFastTransferList = function (type) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.warehosueService.getFastTransferListModels(type == 'true' ? true : false)];
                    case 1:
                        response = _a.sent();
                        this.fastTransferListModels = response;
                        return [2 /*return*/];
                }
            });
        });
    };
    FastTransferListComponent.prototype.showModal = function (operationNo) {
        this.selectedOrderNo = operationNo;
        this.visible = !this.visible;
    };
    FastTransferListComponent.prototype.sendBarcodesToNebim = function (isPackage) {
        return __awaiter(this, void 0, void 0, function () {
            var request, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request = new createBarcode_1.CreateBarcodeFromOrder_RM(isPackage);
                        request.operationNo = this.selectedOrderNo;
                        request.from = "fast-transfer";
                        request.products = null;
                        return [4 /*yield*/, this.productService.sendBarcodesToNebim(request)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            this.toasterService.success("İşlem Başarılı");
                        }
                        else {
                            this.toasterService.error("İşlem Başarısız");
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    FastTransferListComponent = __decorate([
        core_1.Component({
            selector: 'app-fast-transfer-list',
            templateUrl: './fast-transfer-list.component.html',
            styleUrls: ['./fast-transfer-list.component.css']
        })
    ], FastTransferListComponent);
    return FastTransferListComponent;
}());
exports.FastTransferListComponent = FastTransferListComponent;
