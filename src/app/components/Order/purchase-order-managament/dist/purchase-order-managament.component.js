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
exports.PurchaseOrderManagamentComponent = void 0;
var core_1 = require("@angular/core");
var createBarcode_1 = require("../../Product/create-barcode/models/createBarcode");
var PurchaseOrderManagamentComponent = /** @class */ (function () {
    function PurchaseOrderManagamentComponent(httpClientService, toasterService, router, orderService, formBuilder, productService, headerService, exportCsvService) {
        var _this = this;
        this.httpClientService = httpClientService;
        this.toasterService = toasterService;
        this.router = router;
        this.orderService = orderService;
        this.formBuilder = formBuilder;
        this.productService = productService;
        this.headerService = headerService;
        this.exportCsvService = exportCsvService;
        this.numberOfList = [1, 10, 20, 50, 100];
        this.saleOrderModels = [];
        this.selectedOrders = [];
        this.currentPage = 1;
        this.items = [
            {
                label: 'Excele Aktar',
                command: function () {
                    _this.exportCsv();
                }
            }
        ];
        this.visible = false;
    }
    PurchaseOrderManagamentComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.headerService.updatePageTitle("Verilen Siparişler");
                        this.formGenerator();
                        return [4 /*yield*/, this.getPurchaseOrders()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PurchaseOrderManagamentComponent.prototype.exportCsv = function () {
        this.exportCsvService.exportToCsv(this.saleOrderModels, 'my-orders');
    };
    PurchaseOrderManagamentComponent.prototype.formGenerator = function () {
        this.filterForm = this.formBuilder.group({
            orderNo: [null],
            currAccCode: [null],
            customerName: [null],
            sellerCode: [''],
            startDate: [null],
            endDate: [null]
        });
    };
    PurchaseOrderManagamentComponent.prototype.onSubmit = function (model) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.orderService.getPurchaseOrdersByFilter(model)];
                    case 1:
                        _a.saleOrderModels = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    //toplanan ürünler sayfasına akatarır fakat önce ilgili siparişin içeriğinden paketNo'değerini çeker.
    PurchaseOrderManagamentComponent.prototype.routeToCPP = function () {
        return __awaiter(this, void 0, void 0, function () {
            var listNumber, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        listNumber = document.getElementById('numberOfList').value;
                        if (!(listNumber == null || listNumber == '')) return [3 /*break*/, 1];
                        alert('Lütfen Bir Müktar Seçiniz');
                        return [3 /*break*/, 4];
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        // Wait for the products to be fetched before navigating
                        return [4 /*yield*/, this.httpClientService.get({
                                controller: 'Order/GetProductsOfOrders/' + listNumber.toString()
                            }).subscribe(function (data) {
                                _this.productsToCollect = data;
                                // After the data is fetched, you can access the first item in the productsToCollect array
                                if (_this.productsToCollect.length > 0) {
                                    _this.router.navigate(['/collect-product-of-order/' + _this.productsToCollect[0].packageNo]);
                                }
                                else {
                                    // Handle the case when no products are returned
                                    console.log('No products found for the given packageNo');
                                }
                            })];
                    case 2:
                        // Wait for the products to be fetched before navigating
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.log('Error fetching products:', error_1.message);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PurchaseOrderManagamentComponent.prototype.deleteInvoiceProducts = function (orderNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var confirmDelete, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        confirmDelete = window.confirm("Bu transferi silmek istediğinizden emin misiniz?");
                        if (!confirmDelete) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.orderService.deleteInvoiceProducts(orderNumber)];
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
    PurchaseOrderManagamentComponent.prototype.getPurchaseOrders = function () {
        return __awaiter(this, void 0, Promise, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.orderService.getPurchaseOrders()];
                    case 1:
                        _a.saleOrderModels = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PurchaseOrderManagamentComponent.prototype.showModal = function (operationNo) {
        this.selectedOrderNo = operationNo;
        this.visible = !this.visible;
    };
    PurchaseOrderManagamentComponent.prototype.sendBarcodesToNebim = function (isPackage) {
        return __awaiter(this, void 0, void 0, function () {
            var request, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request = new createBarcode_1.CreateBarcodeFromOrder_RM(isPackage);
                        request.operationNo = this.selectedOrderNo;
                        request.from = "order-operation";
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
    PurchaseOrderManagamentComponent = __decorate([
        core_1.Component({
            selector: 'app-purchase-order-managament',
            templateUrl: './purchase-order-managament.component.html',
            styleUrls: ['./purchase-order-managament.component.css']
        })
    ], PurchaseOrderManagamentComponent);
    return PurchaseOrderManagamentComponent;
}());
exports.PurchaseOrderManagamentComponent = PurchaseOrderManagamentComponent;
