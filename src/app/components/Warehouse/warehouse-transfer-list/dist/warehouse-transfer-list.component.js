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
exports.WarehouseTransferListComponent = void 0;
var core_1 = require("@angular/core");
var warehouseTransferListFilterModel_1 = require("src/app/models/model/filter/warehouseTransferListFilterModel");
var createBarcode_1 = require("../../Product/create-barcode/models/createBarcode");
var WarehouseTransferListComponent = /** @class */ (function () {
    function WarehouseTransferListComponent(hs, httpClientService, toasterService, productService, router, warehosueService, formBuilder, generalService) {
        this.hs = hs;
        this.httpClientService = httpClientService;
        this.toasterService = toasterService;
        this.productService = productService;
        this.router = router;
        this.warehosueService = warehosueService;
        this.formBuilder = formBuilder;
        this.generalService = generalService;
        this.currentPage = 1;
        this.innerNumberList = [];
        this.visible = false;
    }
    WarehouseTransferListComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        //this.spinnerService.show();
                        this.formGenerator();
                        return [4 /*yield*/, this.getWarehouseOperations()];
                    case 1:
                        _a.sent();
                        this.hs.updatePageTitle("Depolar Arası Transfer");
                        return [2 /*return*/];
                }
            });
        });
    };
    WarehouseTransferListComponent.prototype.formGenerator = function () {
        this.filterForm = this.formBuilder.group({
            orderNumber: [null],
            warehouseCode: [null],
            toWarehouseCode: [null],
            operationStartDate: [null],
            operationEndDate: [null]
        });
    };
    WarehouseTransferListComponent.prototype.routeNewPage = function (orderNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(orderNumber != null)) return [3 /*break*/, 1];
                        this.router.navigate(["/warehouse-operation/" + orderNumber.split('TP-')[1] + "/" + "0"]);
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.generalService.generateGUID()];
                    case 2:
                        result = _a.sent();
                        this.router.navigate(["/warehouse-operation/" + result + "/" + "0"]);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    WarehouseTransferListComponent.prototype.onSubmit = function (model) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        //this.spinnerService.show()
                        _a = this;
                        return [4 /*yield*/, this.warehosueService.getWarehosueTransferListByFilter(model)];
                    case 1:
                        //this.spinnerService.show()
                        _a.warehouseTransferListModels = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    WarehouseTransferListComponent.prototype.deleteTransfer = function (orderNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var confirmDelete, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        confirmDelete = window.confirm("Bu transferi silmek istediğinizden emin misiniz?");
                        if (!confirmDelete) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.warehosueService.deleteTransferFromId(orderNumber)];
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
    WarehouseTransferListComponent.prototype.setCurrentWarehouseToLocalStorage = function (warehouse, innerNumber) {
        localStorage.setItem('currentWarehouse', warehouse);
        //this.router.navigate(["/warehouse-operation-confirm-detail/"+innerNumber]);
    };
    WarehouseTransferListComponent.prototype.addInnerNumberToList = function (innerNumber) {
        if (!this.innerNumberList.includes(innerNumber)) {
            this.innerNumberList.push(innerNumber);
        }
        else {
            var index = this.innerNumberList.indexOf(innerNumber);
            this.innerNumberList.splice(index, 1);
        }
    };
    WarehouseTransferListComponent.prototype.confirmOperation = function () {
        var _this = this;
        try {
            this.httpClientService
                .post({
                controller: 'Warehouse/ConfirmOperation'
            }, this.innerNumberList)
                .subscribe(function (data) {
                console.log(data);
                _this.router.navigate(['/warehouse-operation-confirm']);
            });
        }
        catch (error) {
            console.log(error.message);
        }
    };
    WarehouseTransferListComponent.prototype.getWarehouseOperations = function () {
        return __awaiter(this, void 0, Promise, function () {
            var filterModel, _a, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        filterModel = new warehouseTransferListFilterModel_1.WarehouseTransferListFilterModel();
                        _a = this;
                        return [4 /*yield*/, this.warehosueService.getWarehosueTransferListByFilter(filterModel)];
                    case 1:
                        _a.warehouseTransferListModels = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _b.sent();
                        console.log(error_1.message);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    WarehouseTransferListComponent.prototype.showModal = function (operationNo) {
        this.selectedOrderNo = operationNo;
        this.visible = !this.visible;
    };
    WarehouseTransferListComponent.prototype.sendBarcodesToNebim = function (isPackage) {
        return __awaiter(this, void 0, void 0, function () {
            var request, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request = new createBarcode_1.CreateBarcodeFromOrder_RM(isPackage);
                        request.operationNo = this.selectedOrderNo;
                        request.from = "warehouse-operation";
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
    WarehouseTransferListComponent.prototype.routeNewPage2 = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.generalService.generateGUID()];
                    case 1:
                        result = _a.sent();
                        this.router.navigate(["/warehouse-operation/" + "REQ-" + result + "/0"]);
                        return [2 /*return*/];
                }
            });
        });
    };
    WarehouseTransferListComponent = __decorate([
        core_1.Component({
            selector: 'app-warehouse-transfer-list',
            templateUrl: './warehouse-transfer-list.component.html',
            styleUrls: ['./warehouse-transfer-list.component.css']
        })
    ], WarehouseTransferListComponent);
    return WarehouseTransferListComponent;
}());
exports.WarehouseTransferListComponent = WarehouseTransferListComponent;
