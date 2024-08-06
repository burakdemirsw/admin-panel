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
exports.OrderManagamentComponent = void 0;
var core_1 = require("@angular/core");
var printerInvoiceRequestModel_1 = require("src/app/models/model/order/printerInvoiceRequestModel");
var createBarcode_1 = require("../../Product/create-barcode/models/createBarcode");
var OrderManagamentComponent = /** @class */ (function () {
    function OrderManagamentComponent(headerService, httpClientService, toasterService, exportCsvService, router, orderService, formBuilder, activatedRoute, productService) {
        var _this = this;
        this.headerService = headerService;
        this.httpClientService = httpClientService;
        this.toasterService = toasterService;
        this.exportCsvService = exportCsvService;
        this.router = router;
        this.orderService = orderService;
        this.formBuilder = formBuilder;
        this.activatedRoute = activatedRoute;
        this.productService = productService;
        this.numberOfList = [1, 10, 20, 50, 100];
        this.selectedOrders = [];
        this.currentPage = 1;
        this.pageDescription = false;
        this._pageDescription = false;
        this.pageDescriptionLine = "Alınan Siparişler";
        this.items = [
            {
                label: 'Excele Aktar',
                command: function () {
                    _this.exportCsv();
                }
            },
            {
                label: 'Excele Ürünleri Aktar Aktar',
                command: function () {
                    _this.exportCsv_Products();
                }
            },
            {
                label: 'Toplanabilir Siparişler',
                command: function () {
                    _this.getOrders(1, 2);
                }
            },
            {
                label: 'Toplanamaz Siparişler',
                command: function () {
                    _this.getOrders(0, 2);
                }
            },
            {
                label: 'Eksik Ürünlü Siparişler',
                command: function () {
                    _this.getMissingOrders();
                }
            },
            {
                label: 'Faturalandırılan Siparişler',
                command: function () {
                    _this.getOrders(1, 1);
                }
            },
            {
                label: 'Faturalandırılmayan Siparişler',
                command: function () {
                    _this.getOrders(1, 2);
                }
            },
            {
                label: 'Kısmi Faturalandırılan Siparişler',
                command: function () {
                    _this.getOrders(0, 3);
                }
            }
        ];
        this.status = 1;
        this.invoiceStatus = 2;
        this.visible = false;
        this.searchedOrder = "";
    }
    OrderManagamentComponent.prototype.exportCsv = function () {
        this.exportCsvService.exportToCsv(this.saleOrderModels, 'my-orders');
    };
    OrderManagamentComponent.prototype.exportCsv_Products = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, promises, productsArray;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = [];
                        promises = this.selectedOrders.map(function (order) { return __awaiter(_this, void 0, void 0, function () {
                            var response;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.orderService.getOrderDetail(order.orderNumber)];
                                    case 1:
                                        response = _a.sent();
                                        return [2 /*return*/, response.products];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        productsArray = _a.sent();
                        // Flatten the array if necessary
                        data = productsArray.flat();
                        // Export the data to CSV
                        this.exportCsvService.exportToCsv(data, 'my-products');
                        return [2 /*return*/];
                }
            });
        });
    };
    OrderManagamentComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        //this.spinnerService.show();
                        this.activatedRoute.queryParams.subscribe(function (params) {
                            if (params['status']) {
                                _this.status = params['status'];
                            }
                            if (params['invoiceStatus']) {
                                _this.invoiceStatus = params['invoiceStatus'];
                            }
                        });
                        if (location.href.includes("missing-list")) {
                            this.pageDescription = true;
                            this.pageDescriptionLine = "Eksik Siparişler";
                        }
                        this.formGenerator();
                        return [4 /*yield*/, this.getOrders(this.status, this.invoiceStatus)];
                    case 1:
                        _a.sent();
                        //this.spinnerService.hide();
                        this.setPageDescription();
                        return [2 /*return*/];
                }
            });
        });
    };
    OrderManagamentComponent.prototype.deleteNebimOrder = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.orderService.deleteNebimOrder(request)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            this.toasterService.success("İşlem Başarılı");
                            this.getOrders(this.status, this.invoiceStatus);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    OrderManagamentComponent.prototype.setPageDescription = function () {
        if (this.status == 1 && this.invoiceStatus == 2) {
            this.pageDescriptionLine = "Toplanabilir Faturalandırılmayan Siparişler";
        }
        if (this.status == 0 && this.invoiceStatus == 2) {
            this.pageDescriptionLine = "Toplanamaz Siparişler";
        }
        if (this.status == -1 && this.invoiceStatus == -1) {
            this.pageDescriptionLine = "Eksik Ürünlü Siparişler";
        }
        if (this.status == 1 && this.invoiceStatus == 1) {
            this.pageDescriptionLine = "Faturalandırılan Siparişler";
        }
        if (this.status == 1 && this.invoiceStatus == 2) {
            this.pageDescriptionLine = "Toplanabilir Siparişler";
        }
        if (this.status == 0 && this.invoiceStatus == 3) {
            this.pageDescriptionLine = "Kısmi Faturalaştırılan Siparişler";
        }
        this.headerService.updatePageTitle(this.pageDescriptionLine);
    };
    OrderManagamentComponent.prototype.formGenerator = function () {
        this.filterForm = this.formBuilder.group({
            orderNo: [null],
            currAccCode: [null],
            customerName: [null],
            sellerCode: [null],
            startDate: [null],
            endDate: [null]
        });
    };
    OrderManagamentComponent.prototype.onSubmit = function (model) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.orderService.getOrdersByFilter(model)];
                    case 1:
                        _a.saleOrderModels = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    //toplanan ürünler sayfasına akatarır fakat önce ilgili siparişin içeriğinden paketNo'değerini çeker.
    OrderManagamentComponent.prototype.routeToCPP = function () {
        return __awaiter(this, void 0, void 0, function () {
            var listNumber;
            var _this = this;
            return __generator(this, function (_a) {
                listNumber = document.getElementById('numberOfList').value;
                if (listNumber == null || listNumber == '') {
                    this.toasterService.warn('Lütfen Bir Müktar Seçiniz');
                }
                else {
                    try {
                        // Wait for the products to be fetched before navigating
                        //this.spinnerService.show()
                        setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                            var listNumber, data;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        listNumber = 123;
                                        return [4 /*yield*/, this.httpClientService.get({
                                                controller: 'Order/GetProductsOfOrders/' + listNumber.toString()
                                            }).toPromise()];
                                    case 1:
                                        data = _a.sent();
                                        this.productsToCollect = data;
                                        // Veriler çekildikten sonra productsToCollect dizisine erişebilirsiniz
                                        if (this.productsToCollect.length > 0) {
                                            this.router.navigate(['/collect-product-of-order/' + this.productsToCollect[0].packageNo]);
                                        }
                                        else {
                                            // Hiç ürün bulunamadığında nasıl bir işlem yapılacağını ele alın
                                            this.toasterService.warn('İşlem Yapıclacak Veri Gelmedi.');
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); }, 1000); // 1000 milisaniye (1 saniye) bekle
                    }
                    catch (error) {
                        console.log('Error fetching products:', error.message);
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    OrderManagamentComponent.prototype.getMissingOrders = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.status = -1;
                        this.invoiceStatus = -1;
                        _a = this;
                        return [4 /*yield*/, this.orderService.getMissingOrders()];
                    case 1:
                        response = _a.saleOrderModels = _b.sent();
                        this.filterOrdersByRole();
                        this.setPageDescription();
                        return [2 /*return*/];
                }
            });
        });
    };
    // 1, 2 toplanabilir
    // 1, 1 faturalandırılan
    OrderManagamentComponent.prototype.getOrders = function (status, invoiceStatus) {
        return __awaiter(this, void 0, Promise, function () {
            var response, _a, response, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.status = status;
                        this.invoiceStatus = invoiceStatus;
                        if (!location.href.includes("missing-list")) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this.orderService.getMissingOrders()];
                    case 1:
                        response = _a.saleOrderModels = _c.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        _b = this;
                        return [4 /*yield*/, this.orderService.getOrders(status, invoiceStatus)];
                    case 3:
                        response = _b.saleOrderModels = _c.sent();
                        _c.label = 4;
                    case 4:
                        this.filterOrdersByRole();
                        this.setPageDescription();
                        return [2 /*return*/];
                }
            });
        });
    };
    OrderManagamentComponent.prototype.filterOrdersByRole = function () {
        if (localStorage.getItem('roleDescription') != 'Admin') {
            this.saleOrderModels = this.saleOrderModels.filter(function (x) { return x.salespersonCode == localStorage.getItem('salesPersonCode'); });
            this.toasterService.info('Sadece Kendi Siparişlerinizi Görebilirsiniz.');
        }
    };
    OrderManagamentComponent.prototype.deleteInvoiceProducts = function (orderNumber) {
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
    OrderManagamentComponent.prototype.printPicture = function (url) {
        var model = new printerInvoiceRequestModel_1.PrinterInvoiceRequestModel();
        model.printerName = "EPSON-DEPO (L3150 Series)";
        model.url = url;
        try {
            this.httpClientService
                .post({
                controller: 'Order/TryPrintPicture'
            }, model)
                .subscribe(function (data) {
                console.log(data);
                // this.saleOrderModels = data;
            });
        }
        catch (error) {
            console.log(error.message);
        }
    };
    OrderManagamentComponent.prototype.routeNewPage3 = function (orderNumber) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.router.navigate(["/order-operation/" + "MIS-" + orderNumber]);
                return [2 /*return*/];
            });
        });
    };
    OrderManagamentComponent.prototype.showModal = function (operationNo) {
        this.selectedOrderNo = operationNo;
        this.visible = !this.visible;
    };
    OrderManagamentComponent.prototype.deleteOrder = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.orderService.deleteNebimOrder(this.selectedOrderNo)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OrderManagamentComponent.prototype.sendBarcodesToNebim = function (isPackage) {
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
    OrderManagamentComponent.prototype.sendInvoiceToPrinter = function (orderNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.orderService.sendInvoiceToPrinter(orderNumber)];
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
    OrderManagamentComponent.prototype.createPdf = function (orderNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.orderService.createPdf(orderNumber)];
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
    OrderManagamentComponent.prototype.goToPage = function () {
        if (this.searchedOrder.includes("http")) {
            location.href = this.searchedOrder;
        }
        else {
            location.href = location.origin + "/order-operation/" + this.searchedOrder + "/false/MD";
        }
    };
    OrderManagamentComponent = __decorate([
        core_1.Component({
            selector: 'app-order-managament',
            templateUrl: './order-managament.component.html',
            styleUrls: ['./order-managament.component.css']
        })
    ], OrderManagamentComponent);
    return OrderManagamentComponent;
}());
exports.OrderManagamentComponent = OrderManagamentComponent;
