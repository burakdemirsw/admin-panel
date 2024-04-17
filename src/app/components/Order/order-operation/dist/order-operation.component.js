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
exports.OrderOperationComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var countProductRequestModel_1 = require("src/app/models/model/order/countProductRequestModel");
var productOfOrders_1 = require("src/app/models/model/order/productOfOrders");
var library_1 = require("@zxing/library");
var createPurchaseInvoice_1 = require("src/app/models/model/invoice/createPurchaseInvoice");
var qrOperationModel_1 = require("src/app/models/model/product/qrOperationModel");
var warehouseOperationProductModel_1 = require("src/app/models/model/warehouse/warehouseOperationProductModel");
var OrderOperationComponent = /** @class */ (function () {
    function OrderOperationComponent(toasterService, formBuilder, orderService, activatedRoute, router, httpClient, productService, warehouseService, generalService, title, sanitizer) {
        this.toasterService = toasterService;
        this.formBuilder = formBuilder;
        this.orderService = orderService;
        this.activatedRoute = activatedRoute;
        this.router = router;
        this.httpClient = httpClient;
        this.productService = productService;
        this.warehouseService = warehouseService;
        this.generalService = generalService;
        this.title = title;
        this.sanitizer = sanitizer;
        this.infoProducts = [];
        this.lastCollectedProducts = [];
        this.productsToCollect = [];
        this._productsToCollect = [];
        this.collectedProducts = [];
        this.process = false;
        this.activeTab = 1;
        this.warehouseModels = [];
        this.pageDescription = null;
        this.shelfNumbers = 'RAFLAR:';
        this.operation = '';
        this.currentPage = 1;
        this.currentPage2 = 1;
        this.invoiceTypes = [
            { name: 'Standart', key: 0 },
            { name: 'Vergisiz', key: 4 },
        ];
        this._pageDescription = false;
        this.isBPTransferForm = false;
        this.isInvoice = false;
        this.visible = false;
        this.totalCount = 0;
        this.visible2 = false;
        //-----------------------------------------------------FATURA SEÇME İŞLEMLERİ
        this.invoicesOfCustomer = [];
        //-----------------------------------------------------
        this.qrCodeValue = '';
        this.qrCodeDownloadLink = this.sanitizer.bypassSecurityTrustResourceUrl('');
        this.addedProductCount = '';
        this.lastCollectedProduct = null;
        this.orderBillingList = [];
        this.itemBillingModels = [];
        this.qrBarcodeUrl = null;
        this.qrOperationModels = [];
        this.confirmedProductPackageNoList = [];
        this.urr = "https://lh3.googleusercontent.com/d/1H2pjyH0zqSbZMgw5pn1zU0DlbrgDlL5K";
        this.shelfNoList = [];
        this.barcodeValue = null; // Değişkeni tanımlayın
        this.productShelvesDialog = false;
        this.productShelves = [];
        //--------------
        this.barcodeDialog = false;
        this.barcode = null;
        this.quantity = null;
        this.codeReader = new library_1.BrowserMultiFormatReader();
    }
    OrderOperationComponent.prototype.showDialog = function () {
        this._visible = true;
    };
    OrderOperationComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    //this.spinnerService.show();
                    return [4 /*yield*/, this.activatedRoute.params.subscribe(function (params) { return __awaiter(_this, void 0, void 0, function () {
                            var orderNumber, orderNumberType, orderNumberType, response;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        this.formGenerator();
                                        orderNumber = params['orderNumber'];
                                        if (params['isInvoice']) {
                                            this.isInvoice = params['isInvoice'] === "true" ? true : false;
                                            // this.toasterService.success(this.isInvoice.toString())
                                        }
                                        if (params['warehouseCode']) {
                                            this.warehouseCode = (params['warehouseCode']);
                                            // this.toasterService.success(this.warehouseCode)
                                        }
                                        // if (orderNumber.includes('MIS')) {
                                        //   orderNumber = orderNumber.split('MIS-')[0]
                                        // }
                                        if (orderNumber.startsWith("W-")) {
                                            orderNumberType = "WT";
                                            this.isBPTransferForm = true;
                                            this.orderNo = orderNumber.split('W-')[1];
                                        }
                                        else {
                                            orderNumberType = orderNumber.split('-')[1];
                                            this.currentOrderNo = params['orderNumber'];
                                            this.orderNo = orderNumber;
                                        }
                                        if (!(orderNumberType === 'BP')) return [3 /*break*/, 2];
                                        return [4 /*yield*/, this.getAllProducts(params['orderNumber'], 'BP')];
                                    case 1:
                                        _a.sent(); //toplanan ve toplanacak ürünleri çeker
                                        return [3 /*break*/, 12];
                                    case 2:
                                        if (!(orderNumberType === 'WS')) return [3 /*break*/, 5];
                                        return [4 /*yield*/, this.orderService.getOrderDetail(params['orderNumber'])];
                                    case 3:
                                        response = _a.sent();
                                        this.customerName = response.description;
                                        return [4 /*yield*/, this.getAllProducts(params['orderNumber'], 'WS')];
                                    case 4:
                                        _a.sent(); //toplanan ve toplanacak ürünleri çeker
                                        return [3 /*break*/, 12];
                                    case 5:
                                        if (!(orderNumberType === 'WT' || orderNumber.startsWith("W-"))) return [3 /*break*/, 10];
                                        if (!orderNumber.startsWith("W-")) return [3 /*break*/, 7];
                                        this.currentOrderNo = params['orderNumber'].split('W-')[1];
                                        return [4 /*yield*/, this.getAllProducts(params['orderNumber'].split('W-')[1], 'WT')];
                                    case 6:
                                        _a.sent(); //toplanan ve toplanacak ürünleri çeker
                                        return [3 /*break*/, 9];
                                    case 7: return [4 /*yield*/, this.getAllProducts(params['orderNumber'], 'WT')];
                                    case 8:
                                        _a.sent(); //toplanan ve toplanacak ürünleri çeker
                                        _a.label = 9;
                                    case 9: return [3 /*break*/, 12];
                                    case 10:
                                        if (!orderNumber.includes("MIS")) return [3 /*break*/, 12];
                                        orderNumberType = "MIS";
                                        return [4 /*yield*/, this.getAllProducts(params['orderNumber'], 'MIS')];
                                    case 11:
                                        _a.sent(); //toplanan ve toplanacak ürünleri çeker
                                        _a.label = 12;
                                    case 12:
                                        if (location.href.includes("MIS")) {
                                            this._pageDescription = true;
                                        }
                                        //this.spinnerService.hide();
                                        this.setPageDescription(orderNumberType);
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        //this.spinnerService.show();
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    //-----------------------------------------------------EKSIK URUNLER İŞLEMLERİ
    OrderOperationComponent.prototype.addMissingProduct = function (products) {
        return __awaiter(this, void 0, void 0, function () {
            var missingProducts, response;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        missingProducts = [];
                        products.forEach(function (product) {
                            var _product = new productOfOrders_1.ProductOfOrder();
                            _product = Object.assign({}, product);
                            _product.shelfNo = "MIS-" + _this.currentOrderNo;
                            missingProducts.push(_product);
                        });
                        return [4 /*yield*/, this.orderService.addMissingProduct(missingProducts)];
                    case 1:
                        response = _a.sent();
                        if (!response) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getAllProducts(this.currentOrderNo, 'WS')];
                    case 2:
                        _a.sent();
                        this.toasterService.success("Ürünler Eksik Ürünlere Eklendi");
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrderOperationComponent.prototype.deleteMissingProduct = function (orderNumber, barcode) {
        return __awaiter(this, void 0, void 0, function () {
            var confirmDelete, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        confirmDelete = window.confirm('Eksik Ürüne Aktarım Yapmak İstiyor Musunuz?');
                        if (!confirmDelete) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.orderService.deleteMissingProduct(this.currentOrderNo, barcode)];
                    case 1:
                        response = _a.sent();
                        if (!response) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getAllProducts(this.currentOrderNo, 'MIS')];
                    case 2:
                        _a.sent();
                        this.toasterService.success("Ürün,Eksik Ürünlerden Silindi");
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //-----------------------------------------------------
    OrderOperationComponent.prototype.getCollectedOrderProducts = function (orderNo) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.productService.getCollectedOrderProducts(orderNo)];
                    case 1:
                        response = _a.sent();
                        this.lastCollectedProducts = response;
                        this.calculateTotalQty();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    OrderOperationComponent.prototype.calculateTotalQty = function () {
        //toplanan ürünler yazısı için
        var totalQty = 0;
        this.lastCollectedProducts.forEach(function (item) {
            totalQty += item.quantity;
        });
        this.totalCount = totalQty;
    };
    OrderOperationComponent.prototype.showCountPage = function () {
        if (this.visible) {
            this.visible = false;
        }
        else {
            this.visible = true;
        }
    };
    OrderOperationComponent.prototype.showModal2 = function () {
        if (this.visible2) {
            this.visible2 = false;
        }
        else {
            this.visible2 = true;
        }
    };
    OrderOperationComponent.prototype.showDialog2 = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._visible2 = true;
                        this.invoicesOfCustomer = [];
                        return [4 /*yield*/, this.orderService.getInvoicesOfCustomer(this.currentOrderNo)];
                    case 1:
                        response = _a.sent();
                        this.invoicesOfCustomer = response;
                        return [2 /*return*/];
                }
            });
        });
    };
    OrderOperationComponent.prototype.selectInvoice = function (invoice) {
        this.selectedInvoice = invoice;
        this.toasterService.success("Fatura Seçildi");
        this._visible2 = false;
    };
    OrderOperationComponent.prototype.createJson = function (barcode, shelfNo, itemCode) {
        var model = this.lastCollectedProducts.find(function (p) {
            return (p.barcode = barcode) && p.shelfNo == shelfNo && p.itemCode == itemCode;
        });
        var formDataJSON = JSON.stringify(model); // Form verilerini JSON'a dönüştür
        this.qrCodeValue = formDataJSON;
        // this.toasterService.success(this.qrCodeValue)
    };
    OrderOperationComponent.prototype.onChangeURL = function (url) {
        this.qrCodeDownloadLink = url;
        this.openImageModal(this.qrCodeDownloadLink);
        this.qrCodeValue = '';
    };
    // url2: string = ClientUrls.baseUrl + '/Order/CountTransferProductPuschase';
    OrderOperationComponent.prototype.setPageDescription = function (orderNumberType) {
        if (orderNumberType === 'BP') {
            this.title.setTitle('Alınan Sipariş Faturalaştır');
            this.operation = 'Toplananları Faturalaştır';
            this.pageDescription = 'Ürün Toplama Paneli';
        }
        else if (orderNumberType === 'WS' || orderNumberType === 'MIS') {
            this.title.setTitle('Verilen Sipariş Faturalaştır');
            this.operation = 'Toplananları Faturalaştır';
            this.pageDescription = 'Ürün Toplama Paneli';
        }
        else if (orderNumberType === 'WT') {
            this.title.setTitle('Transfer Detay');
            this.operation = 'Transferi Onayla';
            this.pageDescription = 'Transfer Onaylama Detay ' + this.currentOrderNo;
        }
    };
    OrderOperationComponent.prototype.getAllProducts = function (orderNo, orderNoType) {
        return __awaiter(this, void 0, Promise, function () {
            var productData, foundedProduct, response, warehouseOperationListModel;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (orderNo.startsWith("W-")) {
                            orderNo = orderNo.split("W-")[1];
                        }
                        if (this.currentOrderNo.includes('MIS-')) {
                            orderNoType = 'MIS';
                        }
                        return [4 /*yield*/, this.orderService //toplanacak ürünler çekildi
                                .getCollectedProducts(orderNo, orderNoType)
                                .toPromise()];
                    case 1:
                        productData = _a.sent();
                        if (productData.length === 0) {
                            this._productsToCollect = [];
                            // this.toasterService.success("SAYIM TAMAMLANDI");
                        }
                        this.productsToCollect = productData; //toplanacak ürünler çekildi
                        if (this.productsToCollect.length > 0) {
                            if (this.lastCollectedProduct == null) {
                                //üste atılcak ürün seçildi
                                this._productsToCollect = [];
                                this._productsToCollect.push(productData[0]);
                                this.lastCollectedProduct = productData[0];
                            }
                            else {
                                foundedProduct = this.productsToCollect.find(function (p) {
                                    return p.barcode == _this.lastCollectedProduct.barcode &&
                                        p.itemCode == _this.lastCollectedProduct.itemCode &&
                                        p.shelfNo == _this.lastCollectedProduct.shelfNo;
                                });
                                if (foundedProduct) {
                                    //eğer ürün bulunduysa
                                    if (foundedProduct.quantity > 0) {
                                        //miktar değeri 0 dan büyükse üste at
                                        this._productsToCollect = [];
                                        this._productsToCollect.push(foundedProduct);
                                        this.lastCollectedProduct = foundedProduct;
                                    }
                                    else {
                                        //miktar değeri 0 dan küçükse
                                        this._productsToCollect = [];
                                        this._productsToCollect.push(productData[0]);
                                        this.lastCollectedProduct = productData[0];
                                    }
                                }
                                else {
                                    //üürn bulunmdadıysa
                                    this._productsToCollect = [];
                                    this._productsToCollect.push(productData[0]);
                                    this.lastCollectedProduct = productData[0];
                                }
                            }
                        }
                        if (this._productsToCollect.length > 0) {
                            this.checkForm.get('shelfNo').setValue(this._productsToCollect[0].shelfNo);
                        }
                        if (orderNoType == 'WS') {
                            //sayım yapılabilcek ürünler listesine atıldı
                            this.productsToCollect.forEach(function (e) {
                                if (e.quantity > e.currentQty) {
                                    var model = new createPurchaseInvoice_1.CreatePurchaseInvoice();
                                    model.barcode = e.barcode;
                                    model.quantity = e.quantity;
                                    model.shelfNo = e.shelfNo;
                                    model.photoUrl = e.photoUrl;
                                    _this.infoProducts.push(model);
                                }
                            });
                            this.addedProductCount = 'Sayım Paneli(' + this.infoProducts.length + ')';
                        }
                        if (!(orderNoType == 'WT')) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.warehouseService.getWarehosueOperationListByInnerNumber(this.currentOrderNo)];
                    case 2:
                        response = _a.sent();
                        if (response) {
                            warehouseOperationListModel = response;
                            this.toWarehouseCode = warehouseOperationListModel.toWarehouseCode;
                            // this.toasterService.success(this.toWarehouseCode);
                        }
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.getCollectedOrderProducts(this.orderNo)];
                    case 4:
                        _a.sent(); //toplanan ürünler çekildi
                        return [2 /*return*/];
                }
            });
        });
    };
    OrderOperationComponent.prototype.focusNextInput = function (nextInputId) {
        var nextInput = document.getElementById(nextInputId);
        if (nextInput) {
            nextInput.focus();
        }
    }; //general service
    OrderOperationComponent.prototype.deleteRow = function (index) {
        this.itemBillingModels.splice(index, 1); // İlgili satırı listeden sil
    };
    OrderOperationComponent.prototype.formGenerator = function () {
        this.checkForm = this.formBuilder.group({
            barcode: [null, forms_1.Validators.required],
            shelfNo: [null, forms_1.Validators.required],
            quantity: [null, forms_1.Validators.required],
            batchCode: [null, forms_1.Validators.required],
            invoiceType: [null, forms_1.Validators.required]
        });
    };
    OrderOperationComponent.prototype.confirmTransfer = function (operationNumberList) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.orderService.confirmTransfer(operationNumberList)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            this.toasterService.success('Transfer işlemi Başarılı');
                            this.router.navigate(['/warehouse-operation-list']);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    OrderOperationComponent.prototype.collectAndPack_WS = function (products) {
        return __awaiter(this, void 0, void 0, function () {
            var response, response2, _response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.selectedInvoiceType) {
                            this.toasterService.error("Vergi Tipi Seçiniz");
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.orderService.getInventoryFromOrderNumber(this.currentOrderNo)];
                    case 1:
                        response = _a.sent();
                        if (!(response.length > 0)) return [3 /*break*/, 4];
                        this.toasterService.success('Otomatik Sayım Yapılabilir');
                        return [4 /*yield*/, this.orderService.setInventoryByOrderNumber(this.currentOrderNo)];
                    case 2:
                        response2 = _a.sent();
                        if (!response2) return [3 /*break*/, 4];
                        this.toasterService.success('Otomatik Sayım yapıldı');
                        return [4 /*yield*/, this.orderService.collectAndPack(products, this.currentOrderNo, this.selectedInvoiceType.key)];
                    case 3:
                        _response = _a.sent();
                        if (_response) {
                            ////console.log(this.productsToCollect)
                            if (this.productsToCollect.length > 0) {
                                this.addMissingProduct(this.productsToCollect);
                            }
                            this.router.navigate(['/orders-managament']);
                        }
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    OrderOperationComponent.prototype.collectAndPack = function (products) {
        return __awaiter(this, void 0, void 0, function () {
            var orderType, confirmation, totalCountOfProducts, list, confirmation, list;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        orderType = "";
                        if (this.currentOrderNo.includes("MIS")) {
                            orderType = "MIS";
                        }
                        else if (location.href.includes("W-")) {
                            orderType = "WT";
                        }
                        else {
                            orderType = this.currentOrderNo.split('-')[1];
                        }
                        if (!(orderType === 'BP' || orderType === 'WS' || orderType === 'MIS')) return [3 /*break*/, 1];
                        confirmation = window.confirm('İşlem Nebime Aktarılacaktır.Devam Etmek istiyor musunuz?');
                        if (confirmation) {
                            //this.spinnerService.show();
                            if (orderType === 'WS' || orderType === 'MIS') {
                                this.showDialog();
                                //this.spinnerService.hide();
                                return [2 /*return*/];
                            }
                            else {
                                this.orderService.collectAndPack(products, this.currentOrderNo, null, this.selectedInvoice);
                            }
                        }
                        return [3 /*break*/, 5];
                    case 1:
                        totalCountOfProducts = 0;
                        this.productsToCollect.forEach(function (p) {
                            totalCountOfProducts += p.quantity;
                        });
                        if (!(totalCountOfProducts === 0)) return [3 /*break*/, 3];
                        list = [this.currentOrderNo];
                        return [4 /*yield*/, this.confirmTransfer(list)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        confirmation = window.confirm('Tüm Ürünler Toplanmadı. Devam etmek istiyor musunuz?');
                        if (!confirmation) return [3 /*break*/, 5];
                        list = [this.currentOrderNo];
                        return [4 /*yield*/, this.confirmTransfer(list)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    OrderOperationComponent.prototype.countProductRequest = function (barcode, shelfNo, qty, orderNo, url) {
        return __awaiter(this, void 0, Promise, function () {
            var requestModel, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestModel = new countProductRequestModel_1.CountProductRequestModel();
                        requestModel.barcode = barcode;
                        requestModel.shelfNo = shelfNo;
                        requestModel.qty = qty.toString() == null ? 1 : qty;
                        requestModel.orderNumber = orderNo;
                        return [4 /*yield*/, this.httpClient
                                .post(url, requestModel)
                                .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    OrderOperationComponent.prototype.openImageModal = function (imageUrl) {
        this.modalImageUrl = imageUrl;
        if (!this.formModal) {
            this.formModal = new window.bootstrap.Modal(document.getElementById('myModal'));
        }
        this.formModal.show();
    };
    OrderOperationComponent.prototype.setFirstItem = function () {
        if (this.currentProductModel != null) {
            var barcodeToFind_1 = this.currentProductModel.barcode;
            var shelfNoToFind_1 = this.currentProductModel.shelfNo;
            // Find the index of the item in lastCollectedProducts
            var index = this.productsToCollect.findIndex(function (item) {
                return item.barcode === barcodeToFind_1 && item.shelfNo === shelfNoToFind_1;
            });
            // If the item is found, move it to the beginning of the array
            if (index !== -1) {
                var foundItem = this.productsToCollect.splice(index, 1)[0];
                this.productsToCollect.unshift(foundItem);
            }
        }
    };
    OrderOperationComponent.prototype.setFormValues = function (barcode, check) {
        return __awaiter(this, void 0, Promise, function () {
            var result, currentShelfNo, result, error_1;
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
                        if (check) {
                            currentShelfNo = this.checkForm.get('shelfNo').value;
                            this.checkForm.get('batchCode').setValue(result[2]);
                            this.checkForm.get('barcode').setValue(result[3]);
                        }
                        return [2 /*return*/, result[1]];
                    case 3: return [4 /*yield*/, this.productService.countProductByBarcode4(barcode, this.warehouseCode)];
                    case 4:
                        result = _a.sent();
                        this.shelfNumbers += result[0];
                        this.checkForm.get('barcode').setValue(result[3]);
                        this.checkForm.get('batchCode').setValue(result[2].toString());
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
    OrderOperationComponent.prototype.onSubmit = function (productModel) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, Promise, function () {
            var CONSTQTY, result, number, number, response, data, foundModel, newResponse, shelves, foundProduct, lineId, response, qrResponse, confirmDelete, lineId, response, number, response, data, foundModel, foundProduct, model, response_1, lineId, response2, qrResponse, number, response, data, foundModel2, foundProduct, lineId, response, qrResponse;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (productModel.barcode.includes("=")) {
                            productModel.barcode = productModel.barcode.replace(/=/g, "-");
                        }
                        CONSTQTY = '0';
                        if (!(productModel.barcode.includes('http') ||
                            this.generalService.isGuid(productModel.barcode))) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.productService.countProductByBarcode3(productModel.barcode)];
                    case 1:
                        result = _e.sent();
                        this.qrBarcodeUrl = productModel.barcode;
                        return [4 /*yield*/, this.getQuantity(result[3])];
                    case 2:
                        // this.onSubmit(this.checkForm.value);
                        CONSTQTY = _e.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.getQuantity(productModel.barcode)];
                    case 4:
                        CONSTQTY = _e.sent();
                        _e.label = 5;
                    case 5:
                        if (!(this.currentOrderNo.split('-')[1] === 'WS' || this.currentOrderNo.includes('MIS-'))) return [3 /*break*/, 30];
                        if (!(productModel.shelfNo == null || productModel.shelfNo == '')) return [3 /*break*/, 9];
                        if (!(productModel.barcode != null)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.setFormValues(productModel.barcode, true)];
                    case 6:
                        number = _e.sent();
                        productModel.barcode = this.checkForm.get('barcode').value;
                        (_a = this.checkForm.get('quantity')) === null || _a === void 0 ? void 0 : _a.setValue(Number(number)); //quantity alanı dolduruldu
                        return [3 /*break*/, 8];
                    case 7:
                        this.toasterService.warn('Formu Doldurunuz.');
                        return [2 /*return*/];
                    case 8: return [3 /*break*/, 11];
                    case 9:
                        if (!(productModel.shelfNo && productModel.barcode && productModel.quantity == null)) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.setFormValues(productModel.barcode, true)];
                    case 10:
                        number = _e.sent();
                        productModel.barcode = this.checkForm.get('barcode').value;
                        (_b = this.checkForm.get('quantity')) === null || _b === void 0 ? void 0 : _b.setValue(Number(number)); //quantity alanı dolduruldu
                        _e.label = 11;
                    case 11:
                        if (!(productModel.shelfNo && productModel.barcode && this.checkForm.get("quantity") != null)) return [3 /*break*/, 29];
                        return [4 /*yield*/, this.warehouseService.countProductRequest(productModel.barcode, productModel.shelfNo, productModel.quantity == null
                                ? Number(CONSTQTY)
                                : productModel.quantity, null, null, productModel.batchCode, 'Order/CountProductControl', this.orderNo, productModel.currAccCode)];
                    case 12:
                        response = _e.sent();
                        //↑↑↑↑↑↑↑↑↑ BARKOD KONTROL EDİLDİ ↑↑↑↑↑↑↑↑↑
                        if (response != undefined) {
                            data = response;
                            if (data.status == 'RAF') {
                                productModel.shelfNo = response.description;
                            }
                            else {
                                productModel.barcode = response.description;
                            }
                        }
                        if (productModel.barcode && productModel.barcode.charAt(0) === '0') {
                            productModel.barcode = productModel.barcode.substring(1);
                        }
                        foundModel = this.productsToCollect.find(function (o) { return o.barcode == productModel.barcode; });
                        if (!true) return [3 /*break*/, 28];
                        return [4 /*yield*/, this.productService.countProductByBarcode4(productModel.barcode, this.warehouseCode)];
                    case 13:
                        newResponse = _e.sent();
                        shelves = newResponse[0]
                            .split(',')
                            .filter(function (raflar) { return raflar.trim() !== ''; })
                            .map(function (raflar) { return raflar.toLowerCase(); });
                        foundProduct = this.productsToCollect.find(function (o) { return o.barcode == productModel.barcode; }
                        // &&
                        // o.shelfNo == productModel.shelfNo  //kaldırıldı
                        );
                        if (!(shelves.find(function (s) { return s.toLowerCase() == productModel.shelfNo.toLowerCase(); }) &&
                            (foundProduct != null || foundProduct != undefined))) return [3 /*break*/, 21];
                        productModel.quantity =
                            productModel.quantity == null
                                ? Number(CONSTQTY)
                                : productModel.quantity;
                        if (!(foundProduct.quantity - productModel.quantity >= 0)) return [3 /*break*/, 19];
                        lineId = this.productsToCollect.find(function (p) { return p.barcode == productModel.barcode; }).lineId;
                        if (!lineId) {
                            this.toasterService.error("lineId bulunamadı");
                        }
                        return [4 /*yield*/, this.warehouseService.countProductRequest2(this.checkForm.get('barcode').value, productModel.shelfNo, productModel.quantity == null
                                ? Number(CONSTQTY)
                                : productModel.quantity, null, null, productModel.batchCode, 'Order/CountProduct4', this.orderNo, productModel.currAccCode, lineId)];
                    case 14:
                        response = _e.sent();
                        if (!(response && response != null && response != undefined)) return [3 /*break*/, 16];
                        return [4 /*yield*/, this.productService.qrOperationMethod(this.qrBarcodeUrl, this.checkForm, productModel, Number(CONSTQTY), false, 'WS')];
                    case 15:
                        qrResponse = _e.sent();
                        if (qrResponse != null && qrResponse.state === true) {
                            this.qrOperationModels.push(qrResponse.qrOperationModel);
                        }
                        else if (qrResponse === null) {
                            this.qrBarcodeUrl = null;
                        }
                        return [3 /*break*/, 17];
                    case 16:
                        this.toasterService.error("Sayım Sırasında Hata Alındı");
                        return [2 /*return*/];
                    case 17: return [4 /*yield*/, this.getAllProducts(this.orderNo, 'WS')];
                    case 18:
                        _e.sent();
                        //↑↑↑↑↑↑↑↑↑ TOPLANAN ÜRÜNLER ÇEKİLDİ ↑↑↑↑↑↑↑↑↑
                        this.toasterService.success('Ürün Toplama İşlemi Tamamlandı!');
                        this.clearBarcodeAndQuantity();
                        this.generalService.beep();
                        return [3 /*break*/, 20];
                    case 19:
                        this.toasterService.warn('Stok Hatası.');
                        _e.label = 20;
                    case 20: return [3 /*break*/, 27];
                    case 21:
                        confirmDelete = window.confirm('Raf Numarası Eşleşmedi Yine De Eklemek İstiyor Musunuz?');
                        if (!confirmDelete) return [3 /*break*/, 26];
                        //↑↑↑↑↑↑↑↑↑ EĞER QRURl BOŞ DEĞİLSE KONTROL EDİLCEK ↑↑↑↑↑↑↑↑↑
                        productModel.quantity =
                            productModel.quantity == null
                                ? Number(CONSTQTY)
                                : productModel.quantity;
                        if (!(foundProduct.quantity - productModel.quantity >= 0)) return [3 /*break*/, 24];
                        lineId = this.productsToCollect.find(function (p) { return p.barcode == productModel.barcode; }).lineId;
                        if (!lineId) {
                            this.toasterService.error("lineId bulunamadı");
                        }
                        return [4 /*yield*/, this.warehouseService.countProductRequest2(this.checkForm.get('barcode').value, productModel.shelfNo, productModel.quantity == null
                                ? Number(CONSTQTY)
                                : productModel.quantity, null, null, productModel.batchCode, 'Order/CountProduct4', this.orderNo, productModel.currAccCode, lineId)];
                    case 22:
                        response = _e.sent();
                        //↑↑↑↑↑↑↑↑↑ SAYIM YAPILDI ↑↑↑↑↑↑↑↑↑
                        return [4 /*yield*/, this.getAllProducts(this.orderNo, 'WS')];
                    case 23:
                        //↑↑↑↑↑↑↑↑↑ SAYIM YAPILDI ↑↑↑↑↑↑↑↑↑
                        _e.sent();
                        //↑↑↑↑↑↑↑↑↑ TOPLANAN ÜRÜNLER ÇEKİLDİ ↑↑↑↑↑↑↑↑↑
                        this.toasterService.success('Ürün Toplama İşlemi Tamamlandı!');
                        this.clearBarcodeAndQuantity();
                        this.generalService.beep();
                        return [3 /*break*/, 25];
                    case 24:
                        this.toasterService.warn('Stok Hatası.');
                        _e.label = 25;
                    case 25: return [3 /*break*/, 27];
                    case 26:
                        this.toasterService.error("Eklenmedi");
                        _e.label = 27;
                    case 27: return [3 /*break*/, 29];
                    case 28:
                        this.toasterService.warn('Eşleşen Ürün Bulunamadı');
                        _e.label = 29;
                    case 29: return [3 /*break*/, 62];
                    case 30:
                        if (!(this.currentOrderNo.split('-')[1] === 'WT' || this.isBPTransferForm === true)) return [3 /*break*/, 47];
                        if (!(productModel.shelfNo == null)) return [3 /*break*/, 34];
                        if (!(productModel.barcode != null)) return [3 /*break*/, 32];
                        return [4 /*yield*/, this.setFormValues(productModel.barcode, true)];
                    case 31:
                        number = _e.sent();
                        (_c = this.checkForm.get('quantity')) === null || _c === void 0 ? void 0 : _c.setValue(Number(number)); //quantity alanı dolduruldu
                        return [3 /*break*/, 33];
                    case 32:
                        this.toasterService.warn('Formu Doldurunuz.');
                        return [2 /*return*/];
                    case 33: return [3 /*break*/, 46];
                    case 34:
                        if (!(productModel.shelfNo && productModel.barcode)) return [3 /*break*/, 46];
                        return [4 /*yield*/, this.warehouseService.countProductRequest(productModel.barcode, productModel.shelfNo, productModel.quantity == null
                                ? Number(CONSTQTY)
                                : productModel.quantity, null, null, productModel.batchCode, 'Order/CountProductControl', this.orderNo, productModel.currAccCode)];
                    case 35:
                        response = _e.sent();
                        //↑↑↑↑↑↑↑↑↑ BARKOD KONTROL EDİLDİ ↑↑↑↑↑↑↑↑↑ ++
                        if (response != undefined) {
                            data = response;
                            if (data.status === 'RAF') {
                                productModel.shelfNo = response.description;
                            }
                            else {
                                productModel.barcode = response.description;
                            }
                        }
                        if (productModel.barcode && productModel.barcode.charAt(0) === '0') {
                            productModel.barcode = productModel.barcode.substring(1);
                        }
                        foundModel = this.productsToCollect.find(function (o) { return o.barcode == productModel.barcode; });
                        if (!foundModel) return [3 /*break*/, 45];
                        foundProduct = foundModel;
                        productModel.quantity =
                            productModel.quantity == null
                                ? Number(CONSTQTY)
                                : productModel.quantity;
                        if (!(foundProduct.quantity - productModel.quantity >= 0)) return [3 /*break*/, 43];
                        model = new warehouseOperationProductModel_1.WarehouseOperationProductModel();
                        model.barcode = productModel.barcode;
                        model.batchCode = productModel.batchCode;
                        model.innerNumber = this.currentOrderNo;
                        model.quantity = productModel.quantity;
                        model.shelfNumber = productModel.shelfNo;
                        model.warehouse = foundModel.itemDim1Code;
                        return [4 /*yield*/, this.warehouseService.transfer(model)];
                    case 36:
                        response_1 = _e.sent();
                        if (!(response_1 > 0)) return [3 /*break*/, 42];
                        lineId = this.productsToCollect.find(function (p) { return p.barcode == productModel.barcode; }).lineId;
                        if (!lineId) {
                            this.toasterService.error("lineId bulunamadı");
                        }
                        return [4 /*yield*/, this.warehouseService.countProductRequest2(productModel.barcode, productModel.shelfNo, productModel.quantity == null
                                ? Number(CONSTQTY)
                                : productModel.quantity, null, null, productModel.batchCode == null ? "" : productModel.batchCode, 'Order/CountProduct4', this.orderNo, productModel.currAccCode, lineId)];
                    case 37:
                        response2 = _e.sent();
                        if (!(response2 && response2 != null && response2 != undefined)) return [3 /*break*/, 39];
                        return [4 /*yield*/, this.productService.qrOperationMethod(this.qrBarcodeUrl, this.checkForm, productModel, Number(CONSTQTY), false, 'WT')];
                    case 38:
                        qrResponse = _e.sent();
                        if (qrResponse != null && qrResponse.state === true) {
                            this.qrOperationModels.push(qrResponse.qrOperationModel);
                        }
                        else if (qrResponse === null) {
                            this.qrBarcodeUrl = null;
                        }
                        return [3 /*break*/, 40];
                    case 39:
                        this.toasterService.error("Sayım Sırasında Hata Alındı");
                        return [2 /*return*/];
                    case 40: return [4 /*yield*/, this.getAllProducts(this.orderNo, 'WT')];
                    case 41:
                        _e.sent();
                        //↑↑↑↑↑↑↑↑↑ TOPLANAN ÜRÜNLER ÇEKİLDİ ↑↑↑↑↑↑↑↑↑
                        this.toasterService.success('Ürün Toplama İşlemi Tamamlandı!');
                        this.clearBarcodeAndQuantity();
                        _e.label = 42;
                    case 42: return [3 /*break*/, 44];
                    case 43:
                        this.toasterService.warn('Stok Hatası.');
                        _e.label = 44;
                    case 44: return [3 /*break*/, 46];
                    case 45:
                        this.toasterService.warn('Eşleşen Ürün Bulunamadı');
                        _e.label = 46;
                    case 46: return [3 /*break*/, 62];
                    case 47:
                        if (!(productModel.shelfNo == null)) return [3 /*break*/, 51];
                        if (!(productModel.barcode != null)) return [3 /*break*/, 49];
                        return [4 /*yield*/, this.setFormValues(productModel.barcode, true)];
                    case 48:
                        number = _e.sent();
                        (_d = this.checkForm.get('quantity')) === null || _d === void 0 ? void 0 : _d.setValue(Number(number)); //quantity alanı dolduruldu
                        return [3 /*break*/, 50];
                    case 49:
                        this.toasterService.warn('Formu Doldurunuz.');
                        return [2 /*return*/];
                    case 50: return [3 /*break*/, 62];
                    case 51:
                        if (!(productModel.shelfNo && productModel.barcode)) return [3 /*break*/, 61];
                        return [4 /*yield*/, this.warehouseService.countProductRequest(productModel.barcode, productModel.shelfNo, productModel.quantity == null
                                ? Number(CONSTQTY)
                                : productModel.quantity, null, null, productModel.batchCode, 'Order/CountProductControl', this.orderNo, productModel.currAccCode)];
                    case 52:
                        response = _e.sent();
                        //↑↑↑↑↑↑↑↑↑ BARKOD KONTROL EDİLDİ ↑↑↑↑↑↑↑↑↑
                        if (response != undefined) {
                            data = response;
                            if (data.status == 'RAF') {
                                productModel.shelfNo = response.description;
                            }
                            else {
                                productModel.barcode = response.description;
                            }
                        }
                        if (productModel.barcode && productModel.barcode.charAt(0) === '0') {
                            productModel.barcode = productModel.barcode.substring(1);
                        }
                        foundModel2 = this.productsToCollect.find(function (o) { return (o === null || o === void 0 ? void 0 : o.barcode) === productModel.barcode; });
                        if (!(foundModel2 != null && foundModel2 != undefined)) return [3 /*break*/, 59];
                        foundProduct = this.productsToCollect.find(function (o) { return o.barcode == productModel.barcode; });
                        productModel.quantity =
                            productModel.quantity == null
                                ? Number(CONSTQTY)
                                : productModel.quantity;
                        if (!(foundProduct.quantity - productModel.quantity >= 0)) return [3 /*break*/, 58];
                        lineId = this.productsToCollect.find(function (p) { return p.barcode == productModel.barcode && p.shelfNo == productModel.shelfNo; }).lineId;
                        if (!lineId) {
                            this.toasterService.error("lineId bulunamadı");
                        }
                        return [4 /*yield*/, this.warehouseService.countProductRequest2(productModel.barcode, productModel.shelfNo, productModel.quantity == null
                                ? Number(CONSTQTY)
                                : productModel.quantity, null, null, productModel.batchCode, 'Order/CountProduct4', this.orderNo, productModel.currAccCode, lineId)];
                    case 53:
                        response = _e.sent();
                        if (!(response && response != null && response != undefined)) return [3 /*break*/, 55];
                        return [4 /*yield*/, this.productService.qrOperationMethod(this.qrBarcodeUrl, this.checkForm, productModel, Number(CONSTQTY), false, 'BP')];
                    case 54:
                        qrResponse = _e.sent();
                        if (qrResponse != null && qrResponse.state === true) {
                            this.qrOperationModels.push(qrResponse.qrOperationModel);
                        }
                        else if (qrResponse === null) {
                            this.qrBarcodeUrl = null;
                        }
                        return [3 /*break*/, 56];
                    case 55:
                        this.toasterService.error("Sayım Sırasında Hata Alındı");
                        return [2 /*return*/];
                    case 56: return [4 /*yield*/, this.getAllProducts(this.orderNo, 'BP')];
                    case 57:
                        _e.sent();
                        //↑↑↑↑↑↑↑↑↑ TOPLANAN ÜRÜNLER ÇEKİLDİ ↑↑↑↑↑↑↑↑↑
                        this.toasterService.success('Ürün Toplama İşlemi Tamamlandı!');
                        this.clearBarcodeAndQuantity();
                        _e.label = 58;
                    case 58: return [3 /*break*/, 60];
                    case 59:
                        this.toasterService.warn('Eşleşen Ürün Bulunamadı');
                        _e.label = 60;
                    case 60: return [3 /*break*/, 62];
                    case 61:
                        this.toasterService.warn('Formu Doldurunuz');
                        _e.label = 62;
                    case 62: return [2 /*return*/];
                }
            });
        });
    };
    OrderOperationComponent.prototype.addProductToList = function (packageNo) {
        var isChecked = document.getElementById('pi' + packageNo).checked;
        if (isChecked) {
            this.confirmedProductPackageNoList.push(packageNo);
            // this.toasterService.success('true');
        }
        else {
            // Checkbox işaretini kaldırdığınızda, bu ürünün indexini listeden kaldırın.
            var indexToRemove = this.confirmedProductPackageNoList.findIndex(function (p) { return p.toString() == packageNo; });
            if (indexToRemove !== -1) {
                this.confirmedProductPackageNoList.splice(indexToRemove, 1);
                // this.toasterService.error('false');
            }
        }
    };
    OrderOperationComponent.prototype.addAllSelectedProductsToList = function () {
        return __awaiter(this, void 0, Promise, function () {
            var _loop_1, this_1, _i, _a, element;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.confirmedProductPackageNoList.length === 0)) return [3 /*break*/, 1];
                        this.toasterService.warn('Seçilen Ürün Bulunamadı.');
                        return [2 /*return*/];
                    case 1:
                        _loop_1 = function (element) {
                            var index;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        index = this_1.productsToCollect.findIndex(function (o) { return o.packageNo == element; });
                                        if (!true) return [3 /*break*/, 2];
                                        return [4 /*yield*/, this_1.warehouseService.countProductRequest(this_1.productsToCollect[index].barcode, this_1.productsToCollect[index].shelfNo, this_1.productsToCollect[index].quantity <= 0
                                                ? 0
                                                : this_1.productsToCollect[index].quantity, null, null, '', 'Order/CountProduct4', this_1.currentOrderNo, '')];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, _a = this.confirmedProductPackageNoList;
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        element = _a[_i];
                        return [5 /*yield**/, _loop_1(element)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [4 /*yield*/, this.getAllProducts(this.currentOrderNo, this.currentOrderNo.split('-')[1])];
                    case 6:
                        _b.sent();
                        this.toasterService.success('Seçilen Ürünler Başarıyla Eklendi');
                        this.confirmedProductPackageNoList = [];
                        return [2 /*return*/];
                }
            });
        });
    };
    OrderOperationComponent.prototype.getShelves = function (barcode) {
        return __awaiter(this, void 0, void 0, function () {
            var newResponse, shelves;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.productService.countProductByBarcode4(barcode, this.warehouseCode)];
                    case 1:
                        newResponse = _a.sent();
                        shelves = newResponse[0]
                            .split(',')
                            .filter(function (raflar) { return raflar.trim() !== ''; });
                        this.productShelves = shelves;
                        this.productShelvesDialog = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    OrderOperationComponent.prototype.setShelveToForm = function (shelve) {
        this.checkForm.get('shelfNo').setValue(shelve);
        this.toasterService.success("Raf Yerleştirildi");
        this.productShelvesDialog = false;
    };
    OrderOperationComponent.prototype.setShelfNo = function (barcode) {
        return __awaiter(this, void 0, Promise, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.shelfNumbers = 'RAFLAR:';
                        return [4 /*yield*/, this.productService.countProductByBarcode4(barcode, this.warehouseCode)];
                    case 1:
                        result = _a.sent();
                        this.shelfNumbers += result[0];
                        return [2 /*return*/, result[1]];
                }
            });
        });
    };
    OrderOperationComponent.prototype.getQuantity = function (barcode) {
        return __awaiter(this, void 0, Promise, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.shelfNumbers = 'RAFLAR:';
                        return [4 /*yield*/, this.productService.countProductByBarcode4(barcode, this.warehouseCode)];
                    case 1:
                        result = _a.sent();
                        // this.shelfNumbers += result[0];
                        if (result === null) {
                            return [2 /*return*/, "0"];
                        }
                        else {
                            return [2 /*return*/, result[1]];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    OrderOperationComponent.prototype.clearShelfNumbers = function () {
        // this.checkForm.get('shelfNo').setValue(null);
        this.checkForm.get('shelfNo').setValue(null);
        this.checkForm.get('barcode').setValue(null);
        this.checkForm.get('batchCode').setValue(null);
        this.shelfNumbers = 'RAFLAR:';
        this.qrBarcodeUrl = null;
        this.checkForm.get('quantity').setValue(null);
        if (this.currentOrderNo.split('-')[1] === 'WS') {
            this.focusNextInput('shelfNo');
        }
        else {
            this.focusNextInput('barcode');
        }
    };
    OrderOperationComponent.prototype.clearBarcodeAndQuantity = function () {
        if (this.currentOrderNo.includes('WS') || this.currentOrderNo.includes('WT')) {
            if (this.lastCollectedProduct) {
                this.checkForm.get('shelfNo').setValue(this.lastCollectedProduct.shelfNo);
            }
            this.checkForm.get('batchCode').setValue(null);
        }
        if (this.currentOrderNo.includes('WT')) {
            this.focusNextInput('shelfNo');
        }
        else {
            this.focusNextInput('barcode');
        }
        this.checkForm.get('barcode').setValue(null);
        this.shelfNumbers = 'RAFLAR:';
        this.qrBarcodeUrl = null;
        this.checkForm.get('batchCode').setValue(null);
        this.checkForm.get('quantity').setValue(null);
        this.generalService.beep();
    };
    OrderOperationComponent.prototype.scanCompleteHandler = function (result) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (result != undefined) {
                    try {
                        this.toasterService.success(result);
                    }
                    catch (error) {
                        this.toasterService.error(error.message);
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    OrderOperationComponent.prototype.deleteOrderProduct = function (orderNo, product) {
        return __awaiter(this, void 0, Promise, function () {
            var confirmDelete, response, _a, model, qrOperationModel, matchingData, totalQuantity, totalQuantity_1, qrOperationResponse;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.currentOrderNo.includes("MIS")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.deleteMissingProduct("MIS-" + orderNo, product.barcode)];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, true];
                    case 2:
                        confirmDelete = window.confirm('Bu hareketi silmek istediğinizden emin misiniz?');
                        if (!confirmDelete) return [3 /*break*/, 18];
                        return [4 /*yield*/, this.productService.deleteOrderProduct(orderNo, product.itemCode, product.id)];
                    case 3:
                        response = _b.sent();
                        if (!response) return [3 /*break*/, 14];
                        this.toasterService.success('Silme İşlemi Başarılı');
                        this.generalService.beep3();
                        _a = this;
                        return [4 /*yield*/, this.productService.getCollectedOrderProducts(this.orderNo)];
                    case 4:
                        _a.lastCollectedProducts =
                            _b.sent();
                        if (!orderNo.includes("MIS")) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.getAllProducts(orderNo, 'MIS')];
                    case 5:
                        _b.sent(); //toplanan ve toplanacak ürünleri çeker
                        _b.label = 6;
                    case 6:
                        if (!this.isBPTransferForm) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.getAllProducts(orderNo, 'WT')];
                    case 7:
                        _b.sent();
                        return [3 /*break*/, 14];
                    case 8:
                        if (!(orderNo.split('-')[1] === 'BP')) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.getAllProducts(orderNo, 'BP')];
                    case 9:
                        _b.sent();
                        return [3 /*break*/, 14];
                    case 10:
                        if (!(orderNo.split('-')[1] === 'WS')) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.getAllProducts(orderNo, 'WS')];
                    case 11:
                        _b.sent();
                        return [3 /*break*/, 14];
                    case 12:
                        if (!(orderNo.split('-')[1] === 'WT')) return [3 /*break*/, 14];
                        return [4 /*yield*/, this.getAllProducts(orderNo, 'WT')];
                    case 13:
                        _b.sent();
                        _b.label = 14;
                    case 14:
                        model = new qrOperationModel_1.QrOperationModel();
                        qrOperationModel = new qrOperationModel_1.QrOperationModel();
                        ////console.log(this.qrOperationModels);
                        qrOperationModel = this.qrOperationModels.find(function (p) {
                            return p.barcode == product.barcode &&
                                p.batchCode == product.batchCode &&
                                p.shelfNo == product.shelfNo;
                        });
                        matchingData = this.qrOperationModels.filter(function (p) {
                            return p.barcode == product.barcode &&
                                p.batchCode == product.batchCode &&
                                p.shelfNo == product.shelfNo;
                        });
                        totalQuantity = 0;
                        if (!qrOperationModel) return [3 /*break*/, 16];
                        if (matchingData) {
                            totalQuantity_1 = matchingData.reduce(function (acc, curr) { return acc + curr.qty; }, 0);
                            qrOperationModel.qty = totalQuantity_1;
                        }
                        // qrOperationModel nesnesini model'e kopyala
                        model = Object.assign({}, qrOperationModel);
                        if (qrOperationModel.isReturn) {
                            model.isReturn = false;
                        }
                        else {
                            model.isReturn = true;
                        }
                        return [4 /*yield*/, this.productService.qrOperation(model)];
                    case 15:
                        qrOperationResponse = _b.sent();
                        if (qrOperationResponse) {
                            ////console.log(this.qrOperationModels);
                            this.generalService.beep3();
                            this.toasterService.success('Qr Operasyonu Geri Alındı');
                        }
                        else {
                            this.toasterService.error('Qr Operaasyonu Geri Alınamadı');
                        }
                        return [3 /*break*/, 17];
                    case 16:
                        this.toasterService.error('Qr Operaasyonu Geri Alınamadı');
                        _b.label = 17;
                    case 17: return [2 /*return*/, response];
                    case 18: return [2 /*return*/, false];
                }
            });
        });
    };
    OrderOperationComponent.prototype.goDown = function (packageNo) {
        // packageNo'ya eşleşen ProductOfOrder'ı bulun
        var matchingProduct = this.productsToCollect.find(function (product) { return product.packageNo === packageNo; });
        // Eğer eşleşen bir ürün bulunduysa
        if (matchingProduct) {
            // Ürünü diziden çıkarın
            var index = this.productsToCollect.indexOf(matchingProduct);
            if (index !== -1) {
                this.productsToCollect.splice(index, 1);
                // Ürünü dizinin sonuna ekleyin
                this.productsToCollect.push(matchingProduct);
            }
        }
    };
    OrderOperationComponent.prototype.goDown2 = function (barcode, shelfNo, itemCode) {
        // packageNo'ya eşleşen ProductOfOrder'ı bulun
        var matchingProduct = this.productsToCollect.find(function (product) {
            return product.barcode === barcode &&
                product.shelfNo == shelfNo &&
                product.itemCode == itemCode;
        });
        // Eğer eşleşen bir ürün bulunduysa
        if (matchingProduct) {
            // Ürünü diziden çıkarın
            var index = this.productsToCollect.indexOf(matchingProduct);
            if (index !== -1) {
                if (this.productsToCollect.length - 1 >= index + 1) {
                    this._productsToCollect = [];
                    this._productsToCollect.push(this.productsToCollect[index + 1]);
                    this.lastCollectedProduct = this.productsToCollect[index + 1];
                }
                else {
                    this._productsToCollect = [];
                    this._productsToCollect.push(this.productsToCollect[0]);
                }
                // this.productsToCollect.splice(index, 1);
                // // Ürünü dizinin sonuna ekleyin
                // this.productsToCollect.push(matchingProduct);
            }
        }
    };
    OrderOperationComponent.prototype.change = function (barcode, quantity) {
        this.barcodeDialog = !this.barcodeDialog;
        this.barcode = barcode;
        this.quantity = quantity;
    };
    OrderOperationComponent = __decorate([
        core_1.Component({
            selector: 'app-order-operation',
            templateUrl: './order-operation.component.html',
            styleUrls: ['./order-operation.component.css']
        })
    ], OrderOperationComponent);
    return OrderOperationComponent;
}());
exports.OrderOperationComponent = OrderOperationComponent;
