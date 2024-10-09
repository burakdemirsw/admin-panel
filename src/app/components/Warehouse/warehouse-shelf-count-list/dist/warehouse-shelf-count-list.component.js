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
exports.WarehouseShelfCountListComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var createBarcode_1 = require("../../Product/create-barcode/models/createBarcode");
var WarehouseShelfCountListComponent = /** @class */ (function () {
    function WarehouseShelfCountListComponent(toasterService, productService, router, formBuilder, warehouseService, generalService, title, headerService) {
        this.toasterService = toasterService;
        this.productService = productService;
        this.router = router;
        this.formBuilder = formBuilder;
        this.warehouseService = warehouseService;
        this.generalService = generalService;
        this.title = title;
        this.headerService = headerService;
        this.currentPage = 1; // Başlangıçta ilk sayfayı göster
        this.innerNumberList = [];
        this.visible = false;
    }
    WarehouseShelfCountListComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.title.setTitle("Sayım");
                        //this.spinnerService.show();
                        this.formGenerator();
                        return [4 /*yield*/, this.getGetCountList()];
                    case 1:
                        _a.sent();
                        this.headerService.updatePageTitle("Sayımlar");
                        return [2 /*return*/];
                }
            });
        });
    };
    WarehouseShelfCountListComponent.prototype.addInnerNumberToList = function (innerNumber) {
        if (!this.innerNumberList.includes(innerNumber)) {
            this.innerNumberList.push(innerNumber);
        }
        else {
            var index = this.innerNumberList.indexOf(innerNumber);
            this.innerNumberList.splice(index, 1);
        }
    };
    WarehouseShelfCountListComponent.prototype.newCount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var orderNo, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.generalService.generateGUID()];
                    case 1:
                        orderNo = _a.sent();
                        this.router.navigate(['/warehouse-shelf-count/count/' + orderNo]);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.log(error_1.message);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    WarehouseShelfCountListComponent.prototype.newCount2 = function () {
        return __awaiter(this, void 0, void 0, function () {
            var orderNo, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.generalService.generateGUID()];
                    case 1:
                        orderNo = _a.sent();
                        this.router.navigate(['/warehouse-shelf-count/add-product-to-shelf/' + orderNo]);
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.log(error_2.message);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    WarehouseShelfCountListComponent.prototype.newCount3 = function () {
        return __awaiter(this, void 0, void 0, function () {
            var orderNo, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.generalService.generateGUID()];
                    case 1:
                        orderNo = _a.sent();
                        this.router.navigate(['/warehouse-shelf-count/remove-product-to-shelf/' + orderNo]);
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.log(error_3.message);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    WarehouseShelfCountListComponent.prototype.getGetCountList = function () {
        return __awaiter(this, void 0, Promise, function () {
            var _a, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = this;
                        return [4 /*yield*/, this.warehouseService.getCountList()];
                    case 1:
                        _a.countList = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _b.sent();
                        console.log(error_4.message);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    WarehouseShelfCountListComponent.prototype.formGenerator = function () {
        this.filterForm = this.formBuilder.group({
            orderNo: [null, forms_1.Validators.required],
            totalProduct: [null, forms_1.Validators.required],
            startDate: [null, forms_1.Validators.required],
            endDate: [null, forms_1.Validators.required]
        });
    };
    WarehouseShelfCountListComponent.prototype.deleteCountFromId = function (orderNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var confirmDelete, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        confirmDelete = window.confirm("Bu transferi silmek istediğinizden emin misiniz?");
                        if (!confirmDelete) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.warehouseService.deleteCountFromId(orderNumber)];
                    case 1:
                        response = _a.sent();
                        if (response === true) {
                            location.reload();
                            this.toasterService.success("İşlem Başarılı");
                        }
                        else {
                            this.toasterService.error("İşlem Başarısız");
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    WarehouseShelfCountListComponent.prototype.onSubmit = function (model) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.warehouseService.GetCountListByFilter(model)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            this.countList = response;
                            //this.spinnerService.hide()
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    WarehouseShelfCountListComponent.prototype.showModal = function (operation) {
        this.selectedOperation = operation;
        this.visible = !this.visible;
    };
    WarehouseShelfCountListComponent.prototype.goPage = function (count) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (count.process == 'C') {
                    this.router.navigate(["warehouse-shelf-count/count", count.orderNo]);
                }
                else if (count.process == 'CO') {
                    this.router.navigate(["warehouse-shelf-count/remove-product-to-shelf", count.orderNo]);
                }
                else if (count.process == 'CI') {
                    this.router.navigate(["warehouse-shelf-count/add-product-to-shelf", count.orderNo]);
                }
                return [2 /*return*/];
            });
        });
    };
    WarehouseShelfCountListComponent.prototype.sendBarcodesToNebim = function (isPackage) {
        return __awaiter(this, void 0, void 0, function () {
            var request, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request = new createBarcode_1.CreateBarcodeFromOrder_RM(isPackage);
                        if (this.selectedOperation.process == 'C') {
                            request.from = "warehouse-shelf-count";
                        }
                        else if (this.selectedOperation.process == 'CI') {
                            request.from = "add-product-to-shelf";
                        }
                        else if (this.selectedOperation.process == 'CO') {
                            request.from = "remove-product-to-shelf";
                        }
                        request.operationNo = this.selectedOperation.orderNo;
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
    WarehouseShelfCountListComponent = __decorate([
        core_1.Component({
            selector: 'app-warehouse-shelf-count-list',
            templateUrl: './warehouse-shelf-count-list.component.html',
            styleUrls: ['./warehouse-shelf-count-list.component.css']
        })
    ], WarehouseShelfCountListComponent);
    return WarehouseShelfCountListComponent;
}());
exports.WarehouseShelfCountListComponent = WarehouseShelfCountListComponent;
