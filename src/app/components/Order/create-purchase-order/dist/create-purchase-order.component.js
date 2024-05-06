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
exports.CreatePurchaseOrderComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var qrOperationModel_1 = require("src/app/models/model/product/qrOperationModel");
var CreatePurchaseOrderComponent = /** @class */ (function () {
    function CreatePurchaseOrderComponent(formBuilder, toasterService, orderService, productService, warehouseService, generalService, activatedRoute, title, sanitizer, headerService) {
        this.formBuilder = formBuilder;
        this.toasterService = toasterService;
        this.orderService = orderService;
        this.productService = productService;
        this.warehouseService = warehouseService;
        this.generalService = generalService;
        this.activatedRoute = activatedRoute;
        this.title = title;
        this.sanitizer = sanitizer;
        this.headerService = headerService;
        this.customerList = [];
        this.officeModels = [];
        this.invoiceProducts = [];
        this.invoiceProducts2 = [];
        this.activeTab = 1;
        this.warehouseModels = [];
        this.currentPage = 1;
        this.offices = ["M", "U"];
        this.warehouses = ["MD", "UD"];
        this.qrCodeDownloadLink = this.sanitizer.bypassSecurityTrustResourceUrl('');
        // url: string = ClientUrls.baseUrl + '/Order/CountProductPuschase';
        this.shelfNumbers = 'RAFLAR:';
        this.qrBarcodeUrl = null;
        this.qrOperationModels = [];
        //--------------
        this.visible = false;
        this.barcode = null;
        this.quantity = null;
    }
    CreatePurchaseOrderComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        this.title.setTitle('Alış Faturası Oluştur');
                        this.headerService.updatePageTitle('Alış Faturası Oluştur');
                        //this.spinnerService.show();
                        this.activatedRoute.params.subscribe(function (params) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        this.newOrderNumber = 'BPI-' + params['orderNo'];
                                        return [4 /*yield*/, this.getProductOfInvoice(this.newOrderNumber)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        this.formGenerator();
                        return [4 /*yield*/, this.getOfficeCodeList()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getCustomerList()];
                    case 2:
                        _a.sent();
                        this.setInput();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        this.toasterService.error(error_1.message);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CreatePurchaseOrderComponent.prototype.setInput = function () {
        if (this.invoiceProducts2.length > 0) {
            if (this.invoiceProducts2[0].officeCode == 'M') {
                document.getElementById('officeCode').value =
                    'M';
                this.productForm.get('officeCode').setValue('M');
            }
            else {
                document.getElementById('officeCode').value =
                    'U';
                this.productForm.get('officeCode').setValue('U');
            }
            this.productForm
                .get('warehouseCode')
                .setValue(this.invoiceProducts2[0].warehouseCode);
            this.productForm
                .get('currAccCode')
                .setValue(this.invoiceProducts2[0].currAccCode);
            // this.toasterService.success(this.productForm.get("officeCode").value+"\n"+   this.productForm.get("warehouseCode").value+"\n"+ this.productForm.get("currAccCode")
            // )
        }
    };
    CreatePurchaseOrderComponent.prototype.onChangeURL = function (url) {
        this.qrCodeDownloadLink = url;
        this.openImageModal(this.qrCodeDownloadLink);
        this.qrCodeValue = '';
    };
    CreatePurchaseOrderComponent.prototype.calculateTotalQty = function () {
        return __awaiter(this, void 0, void 0, function () {
            var totalQty;
            return __generator(this, function (_a) {
                totalQty = 0;
                this.invoiceProducts2.forEach(function (item) {
                    totalQty += item.quantity;
                });
                this.totalCount = totalQty;
                return [2 /*return*/];
            });
        });
    };
    CreatePurchaseOrderComponent.prototype.getProductOfInvoice = function (orderNo) {
        return __awaiter(this, void 0, Promise, function () {
            var response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.productService.getProductOfInvoice(this.newOrderNumber)];
                    case 1:
                        response = _a.sent();
                        this.invoiceProducts2 = response;
                        return [4 /*yield*/, this.calculateTotalQty()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        this.toasterService.warn(error_2.message);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CreatePurchaseOrderComponent.prototype.getOfficeCodeList = function () {
        var _a;
        return __awaiter(this, void 0, Promise, function () {
            var _b, error_3;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        _b = this;
                        return [4 /*yield*/, this.warehouseService.getOfficeCodeList()];
                    case 1:
                        _b.officeModels = _c.sent();
                        // Eğer veri geldiyse ve dizi boş değilse ilk ofisi seçin
                        if (this.officeModels && this.officeModels.length > 0) {
                            (_a = this.productForm.get('officeCode')) === null || _a === void 0 ? void 0 : _a.setValue(this.officeModels[0]);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _c.sent();
                        this.toasterService.warn(error_3.message);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CreatePurchaseOrderComponent.prototype.getCustomerList = function () {
        return __awaiter(this, void 0, Promise, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.warehouseService.getCustomerList('1')];
                    case 1:
                        _a.customerList = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CreatePurchaseOrderComponent.prototype.focusNextInput = function (nextInputId) {
        var nextInput = document.getElementById(nextInputId);
        if (nextInput) {
            nextInput.focus();
        }
    };
    CreatePurchaseOrderComponent.prototype.generateGUID = function () {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.generalService.generateGUID()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CreatePurchaseOrderComponent.prototype.formGenerator = function () {
        var _this = this;
        try {
            this.productForm = this.formBuilder.group({
                officeCode: [null, forms_1.Validators.required],
                warehouseCode: [null, forms_1.Validators.required],
                currAccCode: [null, forms_1.Validators.required],
                shelfNo: [null, [forms_1.Validators.required, forms_1.Validators.maxLength(10)]],
                barcode: [null, [forms_1.Validators.required, forms_1.Validators.min(5)]],
                quantity: [null],
                isReturn: [false, [forms_1.Validators.required]],
                batchCode: [null, forms_1.Validators.required]
            });
        }
        catch (error) {
            this.toasterService.error(error.message);
        }
        this.productForm.get('officeCode').valueChanges.subscribe(function (value) {
            if (value === 'M') {
                _this.productForm.get('warehouseCode').setValue('MD');
            }
        });
        this.productForm.get('officeCode').valueChanges.subscribe(function (value) {
            if (value === 'U') {
                _this.productForm.get('warehouseCode').setValue('UD');
            }
        });
    };
    CreatePurchaseOrderComponent.prototype.clearFormFields = function () {
        // Alanları temizleme
        this.productForm.patchValue({
            barcode: null,
            quantity: null
        });
        this.focusNextInput('barcode');
        this.shelfNumbers = 'RAFLAR:';
        this.qrBarcodeUrl = null;
    };
    CreatePurchaseOrderComponent.prototype.createPurchaseInvoice = function () {
        return __awaiter(this, void 0, void 0, function () {
            var confirmation, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        confirmation = window.confirm('İşlem Nebime Aktarılacaktır.Devam Etmek istiyor musunuz?');
                        if (!confirmation) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.orderService.createPurchaseInvoice(this.invoiceProducts, this.newOrderNumber, this.productForm.get('isReturn').value, 1 // BP2
                            )];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CreatePurchaseOrderComponent.prototype.setShelfNo = function (barcode) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.shelfNumbers = 'RAFLAR:';
                        if (!(barcode.length > 20)) return [3 /*break*/, 2];
                        _a = this;
                        _b = _a.shelfNumbers;
                        return [4 /*yield*/, this.productService.countProductByBarcode(barcode)];
                    case 1:
                        _a.shelfNumbers = _b + _c.sent();
                        _c.label = 2;
                    case 2:
                        // this.productForm.get('barcode').setValue('');
                        this.focusNextInput('shelfNo');
                        return [2 /*return*/];
                }
            });
        });
    };
    CreatePurchaseOrderComponent.prototype.clearShelfNumbers = function () {
        this.productForm.get('shelfNo').setValue(null);
        this.productForm.get('barcode').setValue(null);
        this.productForm.get('quantity').setValue(null);
        this.productForm.get('batchCode').setValue(null);
        if (this.productForm.get('isReturn').value === true) {
            this.focusNextInput('shelfNo');
        }
        else {
            this.focusNextInput('barcode');
        }
        this.shelfNumbers = 'RAFLAR:';
        this.qrBarcodeUrl = null;
    };
    CreatePurchaseOrderComponent.prototype.openImageModal = function (imageUrl) {
        this.modalImageUrl = imageUrl;
        if (!this.formModal) {
            this.formModal = new window.bootstrap.Modal(document.getElementById('myModal'));
        }
        this.formModal.show();
    };
    CreatePurchaseOrderComponent.prototype.setFormValues = function (product) {
        return __awaiter(this, void 0, Promise, function () {
            var result, updated_product, result, updated_product, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!(product.barcode.includes('http') || this.generalService.isGuid(product.barcode))) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.productService.countProductByBarcode3(product.barcode)];
                    case 1:
                        result = _a.sent();
                        this.shelfNumbers = result[0];
                        this.productForm.get('quantity').setValue(result[1]);
                        this.productForm.get('batchCode').setValue(result[2]);
                        this.productForm.get('barcode').setValue(result[3]);
                        updated_product = product;
                        updated_product.barcode = result[3];
                        updated_product.quantity = Number(result[1]);
                        updated_product.batchCode = result[2];
                        return [2 /*return*/, updated_product];
                    case 2: return [4 /*yield*/, this.productService.countProductByBarcode(product.barcode)];
                    case 3:
                        result = _a.sent();
                        this.shelfNumbers = result[0];
                        this.productForm.get('quantity').setValue(result[1]);
                        this.productForm.get('batchCode').setValue(result[2]);
                        this.productForm.get('barcode').setValue(result[3]);
                        updated_product = product;
                        updated_product.barcode = result[3];
                        updated_product.quantity = Number(result[1]);
                        updated_product.batchCode = result[2];
                        return [2 /*return*/, updated_product];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_5 = _a.sent();
                        this.toasterService.error(error_5.message);
                        return [2 /*return*/, null];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    CreatePurchaseOrderComponent.prototype.onSubmit = function (model) {
        return __awaiter(this, void 0, Promise, function () {
            var updated_product, shelves, response, qrResponse, requestModel2, qrResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (model.barcode.includes('=')) {
                            model.barcode = model.barcode.replace(/=/g, '-');
                        }
                        if (model.barcode.includes('http') ||
                            this.generalService.isGuid(model.barcode)) {
                            this.qrBarcodeUrl = model.barcode;
                        }
                        if (!!this.productForm.valid) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.setFormValues(model)];
                    case 1:
                        updated_product = _a.sent();
                        model = updated_product;
                        this.toasterService.success('Form Verileri Güncellendi.');
                        return [2 /*return*/];
                    case 2:
                        if (!this.productForm.valid) return [3 /*break*/, 11];
                        shelves = this.shelfNumbers
                            .split(',')
                            .filter(function (raflar) { return raflar.trim() !== null; });
                        if (!shelves.find(function (S) { return S.toLowerCase() == model.shelfNo.toLowerCase(); })) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.warehouseService.countProductRequest(
                            //sayım
                            model.barcode, model.shelfNo, model.quantity, model.officeCode, model.warehouseCode, model.batchCode, 'Order/CountProduct3', this.newOrderNumber, model.currAccCode)];
                    case 3:
                        response = _a.sent();
                        if (!(response != undefined)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.productService.qrOperationMethod(this.qrBarcodeUrl, this.productForm, model, model.quantity, this.productForm.get('isReturn').value, 'BPI')];
                    case 4:
                        qrResponse = _a.sent();
                        if (qrResponse != null && qrResponse.state === true) {
                            this.qrOperationModels.push(qrResponse.qrOperationModel);
                        }
                        else {
                            this.qrBarcodeUrl = null;
                        }
                        _a.label = 5;
                    case 5: return [3 /*break*/, 11];
                    case 6:
                        if (!confirm('Raf Bulunamadı! Raf Barkod Doğrulaması Yapılmadan Eklensin mi(2)?')) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.warehouseService.countProductRequest(
                            //sayım
                            model.barcode, model.shelfNo, model.quantity, model.officeCode, model.warehouseCode, model.batchCode, 'Order/CountProduct3', this.newOrderNumber, model.currAccCode)];
                    case 7:
                        requestModel2 = _a.sent();
                        if (!(requestModel2 != undefined)) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.productService.qrOperationMethod(this.qrBarcodeUrl, this.productForm, model, model.quantity, this.productForm.get('isReturn').value, 'BPI')];
                    case 8:
                        qrResponse = _a.sent();
                        if (qrResponse != null && qrResponse.state === true) {
                            this.qrOperationModels.push(qrResponse.qrOperationModel);
                        }
                        else {
                            this.qrBarcodeUrl = null;
                        }
                        _a.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        this.toasterService.warn('Ekleme İşlemi Yapılmadı!');
                        return [2 /*return*/];
                    case 11:
                        if (this.productForm.valid == true) {
                            this.getProductOfInvoice(this.newOrderNumber);
                            this.clearFormFields();
                            this.generalService.beep();
                            this.toasterService.success('Ürün Başarılı Şekilde Eklendi.');
                        }
                        else {
                            this.toasterService.error('Form Geçerli Değil.');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CreatePurchaseOrderComponent.prototype.deleteRow = function (index) {
        this.invoiceProducts.splice(index, 1);
    };
    CreatePurchaseOrderComponent.prototype.deleteOrderProduct = function (orderNo, product) {
        return __awaiter(this, void 0, Promise, function () {
            var confirmDelete, response, model, qrOperationModel, matchingData, totalQuantity, totalQuantity_1, qrOperationResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        confirmDelete = window.confirm('Bu hareketi silmek istediğinizden emin misiniz?');
                        if (!confirmDelete) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.productService.deleteOrderProduct(this.newOrderNumber, product.itemCode, product.id)];
                    case 1:
                        response = _a.sent();
                        if (!response) return [3 /*break*/, 3];
                        this.invoiceProducts2 = this.invoiceProducts2.filter(function (o) {
                            return !(o.barcode == product.itemCode && o.shelfNo == product.shelfNo);
                        });
                        this.calculateTotalQty();
                        return [4 /*yield*/, this.getProductOfInvoice(this.newOrderNumber)];
                    case 2:
                        _a.sent();
                        this.toasterService.success('Silme İşlemi Başarılı.');
                        return [3 /*break*/, 4];
                    case 3:
                        this.toasterService.error('Silme İşlemi Başarısız.');
                        _a.label = 4;
                    case 4:
                        model = new qrOperationModel_1.QrOperationModel();
                        qrOperationModel = new qrOperationModel_1.QrOperationModel();
                        // console.log(this.qrOperationModels);
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
                        if (!qrOperationModel) return [3 /*break*/, 6];
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
                    case 5:
                        qrOperationResponse = _a.sent();
                        if (qrOperationResponse) {
                            // console.log(this.qrOperationModels);
                            this.generalService.beep3();
                            this.toasterService.success('Qr Operasyonu Geri Alındı');
                        }
                        else {
                            this.toasterService.error('Qr Operaasyonu Geri Alınamadı');
                        }
                        return [3 /*break*/, 7];
                    case 6:
                        this.toasterService.error('Qr Operaasyonu Geri Alınamadı');
                        _a.label = 7;
                    case 7: return [2 /*return*/, response];
                    case 8: return [2 /*return*/, false];
                }
            });
        });
    };
    CreatePurchaseOrderComponent.prototype.deleteInvoiceProducts = function (orderNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var confirmDelete, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        confirmDelete = window.confirm('Bu hareketi silmek istediğinizden emin misiniz?');
                        if (!confirmDelete) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.orderService.deleteInvoiceProducts(orderNumber)];
                    case 1:
                        response = _a.sent();
                        if (response === true) {
                            location.reload();
                            this.toasterService.success('İşlem Başarılı');
                        }
                        else {
                            this.toasterService.error('İşlem Başarısız');
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    CreatePurchaseOrderComponent.prototype.checkBarcodeAndShelf = function (response, model) {
        var _a, _b, _c, _d;
        if (response != undefined) {
            var data = response;
            if (data.status == 'RAF') {
                (_a = this.productForm.get('shelfNo')) === null || _a === void 0 ? void 0 : _a.setValue(data.description);
                (_b = this.productForm.get('barcode')) === null || _b === void 0 ? void 0 : _b.setValue(null);
                var shelfAndBarcode = [];
                shelfAndBarcode.push(response.description);
                shelfAndBarcode.push('');
                return shelfAndBarcode;
            }
            else {
                var responseData = JSON.parse(response.description);
                var description = responseData[0].Description;
                var rafNo = responseData[0].Rafno;
                if (this.productForm.get('shelfNo').value === null) {
                    //eğer zaten girdiği bir değer varsa onu yerleştir yoksa gelen cevabı yerleştir
                    (_c = this.productForm.get('shelfNo')) === null || _c === void 0 ? void 0 : _c.setValue(rafNo);
                }
                (_d = this.productForm.get('barcode')) === null || _d === void 0 ? void 0 : _d.setValue(description);
                var shelfAndBarcode = [];
                shelfAndBarcode.push(description);
                shelfAndBarcode.push(this.productForm.get('shelfNo').value === null ? rafNo : model.shelfNo);
                return shelfAndBarcode;
            }
        }
        else {
            this.toasterService.warn('Doğrulama Yapılamadı!');
            return null;
        }
    };
    CreatePurchaseOrderComponent.prototype.change = function (barcode, quantity) {
        this.visible = !this.visible;
        this.barcode = barcode;
        this.quantity = quantity;
    };
    CreatePurchaseOrderComponent = __decorate([
        core_1.Component({
            selector: 'app-create-purchase-order',
            templateUrl: './create-purchase-order.component.html',
            styleUrls: ['./create-purchase-order.component.css']
        })
    ], CreatePurchaseOrderComponent);
    return CreatePurchaseOrderComponent;
}());
exports.CreatePurchaseOrderComponent = CreatePurchaseOrderComponent;
