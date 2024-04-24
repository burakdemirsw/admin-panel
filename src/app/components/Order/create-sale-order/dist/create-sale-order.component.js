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
exports.CreateSaleOrderComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var ClientUrls_1 = require("src/app/models/const/ClientUrls");
var qrOperationModel_1 = require("src/app/models/model/product/qrOperationModel");
var CreateSaleOrderComponent = /** @class */ (function () {
    function CreateSaleOrderComponent(httpClientService, formBuilder, toasterService, orderService, productService, warehouseService, generalService, activatedRoute, title, sanitizer) {
        this.httpClientService = httpClientService;
        this.formBuilder = formBuilder;
        this.toasterService = toasterService;
        this.orderService = orderService;
        this.productService = productService;
        this.warehouseService = warehouseService;
        this.generalService = generalService;
        this.activatedRoute = activatedRoute;
        this.title = title;
        this.sanitizer = sanitizer;
        this.infoProducts = [];
        this.offices = ["M", "U"];
        this.warehouses = ["MD", "UD"];
        this.currencyList = ['Standart', 'Vergisiz']; //vergi tipi
        this.addedProductCount = 'Sayım Paneli';
        this.newOrderNumber = '';
        this.customerList = [];
        this.officeModels = [];
        this.invoiceProducts = [];
        this.invoiceProducts2 = [];
        this.activeTab = 1;
        this.warehouseModels = [];
        this.visible = false;
        this.qrCodeDownloadLink = this.sanitizer.bypassSecurityTrustResourceUrl('');
        this.customerList2 = [];
        this.salesPersonModels = [];
        this.salesPersonModelList = [];
        this.visible2 = false;
        this.url = ClientUrls_1.ClientUrls.baseUrl + '/Order/CountProductPuschase';
        this.shelfNumbers = 'RAFLAR:';
        this.qrBarcodeUrl = null;
        this.qrOperationModels = [];
    }
    CreateSaleOrderComponent.prototype.addToList = function (model) {
        this.toasterService.success(model.itemCode + ' Eklendi');
        this.infoProducts.push(model);
        this.addedProductCount = 'Sayım Paneli(' + this.infoProducts.length + ')';
    };
    CreateSaleOrderComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                try {
                    this.title.setTitle('Satış Faturası Oluştur');
                    this.isReturnInvoice = false;
                    this.formGenerator();
                    this.activatedRoute.params.subscribe(function (params) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    this.newOrderNumber = 'WSI-' + params['orderNo'];
                                    return [4 /*yield*/, this.getProductOfInvoice(this.newOrderNumber)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, this.getCustomerList()];
                                case 2:
                                    _a.sent(); //müşteriler kodu
                                    return [4 /*yield*/, this.getSalesPersonModels()];
                                case 3:
                                    _a.sent(); //personeller kodu
                                    this.setInput();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    //this.spinnerService.hide();
                }
                catch (error) {
                    console.log(error.message);
                }
                return [2 /*return*/];
            });
        });
    };
    CreateSaleOrderComponent.prototype.deleteFromList = function (model) {
        var index = this.infoProducts.indexOf(model); // Modelin dizideki indeksini bulun
        if (index !== -1) {
            this.infoProducts.splice(index, 1); // Modeli diziden silin
        }
    };
    CreateSaleOrderComponent.prototype.checkIsReturnInvoice = function () {
        this.isReturnInvoice = !this.productForm.get('isReturn').value;
        if (this.isReturnInvoice) {
            this.toasterService.warn('İade Faturasına Geçildiği İçin Sayım Paneli');
        }
    };
    CreateSaleOrderComponent.prototype.setInput = function () {
        if (this.invoiceProducts2.length > 0) {
            if (this.invoiceProducts2[0].officeCode == 'M') {
                this.productForm.get('officeCode').setValue('M');
            }
            else {
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
    CreateSaleOrderComponent.prototype.createJson = function (barcode, shelfNo) {
        var model = this.invoiceProducts2.find(function (p) { return (p.barcode = barcode) && p.shelfNo == shelfNo; });
        var formDataJSON = JSON.stringify(model); // Form verilerini JSON'a dönüştür
        this.qrCodeValue = formDataJSON;
        // this.toasterService.success(this.qrCodeValue)
    };
    CreateSaleOrderComponent.prototype.onChangeURL = function (url) {
        this.qrCodeDownloadLink = url;
        this.openImageModal(this.qrCodeDownloadLink);
        this.qrCodeValue = '';
    };
    CreateSaleOrderComponent.prototype.getProductOfInvoice = function (orderNo) {
        return __awaiter(this, void 0, Promise, function () {
            var response, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.productService.getProductOfInvoice(this.newOrderNumber)];
                    case 1:
                        response = _a.sent();
                        this.invoiceProducts2 = response;
                        this.infoProducts = [];
                        this.invoiceProducts2.forEach(function (e) {
                            if (e.quantity > e.qty) {
                                _this.infoProducts.push(e);
                            }
                        });
                        this.addedProductCount = 'Sayım Paneli(' + this.infoProducts.length + ')';
                        this.calculateTotalQty();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        this.toasterService.warn(error_1.message);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CreateSaleOrderComponent.prototype.getOfficeCodeList = function () {
        var _a;
        return __awaiter(this, void 0, Promise, function () {
            var _b, error_2;
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
                        error_2 = _c.sent();
                        this.toasterService.warn(error_2.message);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CreateSaleOrderComponent.prototype.getWarehouseList = function (value) {
        return __awaiter(this, void 0, Promise, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.warehouseService.getWarehouseList(value)];
                    case 1:
                        _a.warehouseModels = _b.sent();
                        console.log(this.warehouseModels);
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateSaleOrderComponent.prototype.getCustomerList = function () {
        return __awaiter(this, void 0, Promise, function () {
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.warehouseService.getCustomerList('3')];
                    case 1:
                        _a.customerList = _b.sent();
                        this.customerList.forEach(function (c) {
                            var color = { name: c.currAccDescription, code: c.currAccCode };
                            _this.customerList2.push(color);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateSaleOrderComponent.prototype.getSalesPersonModels = function () {
        return __awaiter(this, void 0, Promise, function () {
            var _a, error_3, error_4;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        _a = this;
                        return [4 /*yield*/, this.orderService.getSalesPersonModels()];
                    case 2:
                        _a.salesPersonModels = _b.sent();
                        this.salesPersonModels.forEach(function (c) {
                            var color = { name: c.firstLastName, code: c.salespersonCode };
                            _this.salesPersonModelList.push(color);
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _b.sent();
                        this.toasterService.error(error_3.message);
                        return [2 /*return*/, null];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_4 = _b.sent();
                        this.toasterService.error(error_4.message);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    CreateSaleOrderComponent.prototype.getSelectedOffice = function () {
        var _a;
        return __awaiter(this, void 0, Promise, function () {
            var office;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        office = document.getElementById('officeCode')
                            .value;
                        return [4 /*yield*/, this.getWarehouseList(office)];
                    case 1:
                        _b.sent();
                        (_a = this.productForm
                            .get('warehouseCode')) === null || _a === void 0 ? void 0 : _a.setValue(this.warehouseModels[0].warehouseCode);
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateSaleOrderComponent.prototype.clearShelfNumbers = function () {
        this.productForm.get('shelfNo').setValue(null);
        this.productForm.get('barcode').setValue(null);
        this.productForm.get('quantity').setValue(null);
        this.productForm.get('batchCode').setValue(null);
        if (this.productForm.get('isReturn').value === false) {
            this.focusNextInput('shelfNo');
        }
        else {
            this.focusNextInput('barcode');
        }
        this.shelfNumbers = 'RAFLAR:';
        this.qrBarcodeUrl = null;
    };
    CreateSaleOrderComponent.prototype.focusNextInput = function (nextInputId) {
        var nextInput = document.getElementById(nextInputId);
        if (nextInput) {
            nextInput.focus();
        }
    };
    CreateSaleOrderComponent.prototype.formGenerator = function () {
        var _this = this;
        try {
            this.productForm = this.formBuilder.group({
                officeCode: [null, forms_1.Validators.required],
                warehouseCode: [null, forms_1.Validators.required],
                currAccCode: [null],
                currAccCode2: [null],
                salesPersonCode: [null, forms_1.Validators.required],
                shelfNo: [null, [forms_1.Validators.required, forms_1.Validators.maxLength(10)]],
                barcode: [null, [forms_1.Validators.required, forms_1.Validators.minLength(5)]],
                quantity: [null],
                isReturn: { value: true, disabled: true },
                currency: [null, forms_1.Validators.required],
                batchCode: [null]
            });
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
        }
        catch (error) {
            this.toasterService.error(error.message);
        }
    };
    CreateSaleOrderComponent.prototype.whichRowIsInvalid = function () {
        this.generalService.whichRowIsInvalid(this.productForm);
    };
    CreateSaleOrderComponent.prototype.clearFormFields = function () {
        // Alanları temizleme
        this.productForm.patchValue({
            barcode: null,
            quantity: null
        });
        this.focusNextInput('barcode');
        this.shelfNumbers = 'RAFLAR:';
        this.qrBarcodeUrl = null;
    };
    CreateSaleOrderComponent.prototype.openImageModal = function (imageUrl) {
        this.modalImageUrl = imageUrl;
        if (!this.formModal) {
            this.formModal = new window.bootstrap.Modal(document.getElementById('myModal'));
        }
        this.formModal.show();
    };
    CreateSaleOrderComponent.prototype.deleteOrderProduct = function (orderNo, product) {
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
                        console.log(this.qrOperationModels);
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
                            console.log(this.qrOperationModels);
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
    CreateSaleOrderComponent.prototype.showCountPage = function () {
        if (this.visible) {
            this.visible = false;
        }
        else {
            this.visible = true;
        }
    };
    CreateSaleOrderComponent.prototype.showModal2 = function () {
        if (this.visible2) {
            this.visible2 = false;
        }
        else {
            this.visible2 = true;
        }
    };
    CreateSaleOrderComponent.prototype.createSaleInvoice = function () {
        return __awaiter(this, void 0, Promise, function () {
            var confirmation, data, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        confirmation = window.confirm('İşlem Nebime Aktarılacaktır.Devam Etmek istiyor musunuz?');
                        if (!confirmation) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        if (this.productForm.get('salesPersonCode').value === '' ||
                            this.productForm.get('salesPersonCode').value == null) {
                            this.toasterService.error('Satış Sorumlusu Alanı Boş');
                            return [2 /*return*/];
                        }
                        if (this.productForm.get('currency').value === '' ||
                            this.productForm.get('currency').value == null) {
                            this.toasterService.error('Vergi Tipi Alanı Boş');
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.orderService.createSaleInvoice(this.invoiceProducts2, this.newOrderNumber, this.productForm.get('isReturn').value, this.productForm.get('salesPersonCode').value.code, this.productForm.get('currency').value)];
                    case 2:
                        data = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_5 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CreateSaleOrderComponent.prototype.setCurrentCustomerCode = function () {
        var currAccCode = document.getElementById('currAccCode').value.toString();
        document.getElementById('currAccCode2').value =
            currAccCode;
    };
    CreateSaleOrderComponent.prototype.setFormValues = function (barcode, check) {
        return __awaiter(this, void 0, Promise, function () {
            var result, currentShelfNo, result, error_6;
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
                            currentShelfNo = this.productForm.get('shelfNo').value;
                            // if(currentShelfNo==null ){
                            //   this.productForm.get('shelfNo').setValue(result[0].split(',')[0]);
                            // }
                            this.productForm.get('batchCode').setValue(result[2]);
                            this.productForm.get('barcode').setValue(result[3]);
                        }
                        return [2 /*return*/, result[1]];
                    case 3: return [4 /*yield*/, this.productService.countProductByBarcode(barcode)];
                    case 4:
                        result = _a.sent();
                        this.productForm.get('batchCode').setValue(result[2]);
                        this.productForm.get('barcode').setValue(result[3]);
                        this.shelfNumbers += result[0];
                        return [2 /*return*/, result[1]];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_6 = _a.sent();
                        this.toasterService.error(error_6.message);
                        return [2 /*return*/, null];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    CreateSaleOrderComponent.prototype.onSubmit = function (model) {
        var _a, _b;
        return __awaiter(this, void 0, Promise, function () {
            var number, number, value, currAccCodeValue, result, shelves, response, data, qrResponse, response, data, qrResponse, formValuesJSON;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (model.barcode.includes("=")) {
                            model.barcode = model.barcode.replace(/=/g, "-");
                        }
                        if (!(model.barcode.includes('http') ||
                            this.generalService.isGuid(model.barcode))) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.setFormValues(model.barcode, true)];
                    case 1:
                        number = _c.sent();
                        (_a = this.productForm.get('quantity')) === null || _a === void 0 ? void 0 : _a.setValue(Number(number));
                        this.qrBarcodeUrl = model.barcode;
                        // this.onSubmit(this.productForm.value);
                        return [2 /*return*/];
                    case 2:
                        if (!(model.barcode && !model.shelfNo)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.setFormValues(model.barcode, true)];
                    case 3:
                        number = _c.sent();
                        (_b = this.productForm.get('quantity')) === null || _b === void 0 ? void 0 : _b.setValue(Number(number)); //quantity alanı dolduruldu
                        this.focusNextInput('shelfNo');
                        return [2 /*return*/];
                    case 4:
                        if (!this.productForm.valid) return [3 /*break*/, 14];
                        if (model.currAccCode) {
                            model.currAccCode = this.productForm.get('currAccCode').value.code;
                        }
                        if (model.salesPersonCode) {
                            model.salesPersonCode =
                                this.productForm.get('salesPersonCode').value.code;
                        }
                        console.log(this.productForm.value);
                        value = this.productForm.get('currAccCode').value;
                        if (value === null) {
                            try {
                                currAccCodeValue = document.getElementById('currAccCode2').value.toString();
                                model.currAccCode = currAccCodeValue;
                                this.productForm.get('currAccCode').setValue(currAccCodeValue);
                            }
                            catch (error) {
                                this.toasterService.error('Müşteri Kodu Hatası.');
                                return [2 /*return*/];
                            }
                        }
                        return [4 /*yield*/, this.productService.countProductByBarcode(model.barcode)];
                    case 5:
                        result = _c.sent();
                        if (this.shelfNumbers === 'RAFLAR:') {
                            //raflar kontorl için yeniden çekildi
                            this.shelfNumbers += result[0];
                        }
                        if (this.productForm.get('quantity').value === null) {
                            //miktar alanı dolduruldu
                            this.productForm.get('quantity').setValue(result[1]);
                        }
                        shelves = result[0]
                            .split(',')
                            .filter(function (raflar) { return raflar.trim() !== ''; });
                        if (!shelves.find(function (s) { return s.toLowerCase() == model.shelfNo.toLowerCase(); })) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.warehouseService.countProductRequest(
                            //sayım
                            model.barcode, model.shelfNo, model.quantity === null ? Number(result[1]) : model.quantity, model.officeCode, model.warehouseCode, model.batchCode, 'Order/CountProduct3', this.newOrderNumber, model.currAccCode)];
                    case 6:
                        response = _c.sent();
                        if (!(response != undefined)) return [3 /*break*/, 8];
                        data = response;
                        if (data.status == 'RAF') {
                            model.shelfNo = response.description;
                        }
                        else {
                            model.barcode = response.description;
                        }
                        return [4 /*yield*/, this.productService.qrOperationMethod(this.qrBarcodeUrl, this.productForm, model, Number(result[1]), this.productForm.get('isReturn').value, 'WSI')];
                    case 7:
                        qrResponse = _c.sent();
                        if (qrResponse != null && qrResponse.state === true) {
                            this.qrOperationModels.push(qrResponse.qrOperationModel);
                        }
                        else {
                            this.qrBarcodeUrl = null;
                        }
                        //↑↑↑↑↑↑↑↑↑ EĞER QRURl BOŞ DEĞİLSE KONTROL EDİLCEK ↑↑↑↑↑↑↑↑↑
                        this.generalService.beep();
                        model.quantity = Number(Number(result[1]));
                        _c.label = 8;
                    case 8: return [3 /*break*/, 14];
                    case 9:
                        if (!confirm('Raf Bulunamadı! Raf Barkod Doğrulaması Yapılmadan Eklensin mi(2)?')) return [3 /*break*/, 13];
                        return [4 /*yield*/, this.warehouseService.countProductRequest(
                            //sayım
                            model.barcode, model.shelfNo, model.quantity === null ? Number(result[1]) : model.quantity, model.officeCode, model.warehouseCode, model.batchCode, 'Order/CountProduct3', this.newOrderNumber, model.currAccCode)];
                    case 10:
                        response = _c.sent();
                        if (!(response != undefined)) return [3 /*break*/, 12];
                        data = response;
                        if (data.status == 'RAF') {
                            model.shelfNo = response.description;
                        }
                        else {
                            model.barcode = response.description;
                        }
                        return [4 /*yield*/, this.productService.qrOperationMethod(this.qrBarcodeUrl, this.productForm, model, Number(result[1]), this.productForm.get('isReturn').value, 'WSI')];
                    case 11:
                        qrResponse = _c.sent();
                        if (qrResponse != null && qrResponse.state === true) {
                            this.qrOperationModels.push(qrResponse.qrOperationModel);
                        }
                        else {
                            this.qrBarcodeUrl = null;
                        }
                        //↑↑↑↑↑↑↑↑↑ EĞER QRURl BOŞ DEĞİLSE KONTROL EDİLCEK ↑↑↑↑↑↑↑↑↑
                        this.generalService.beep();
                        model.quantity = Number(Number(result[1]));
                        _c.label = 12;
                    case 12: return [3 /*break*/, 14];
                    case 13: return [2 /*return*/];
                    case 14:
                        if (this.productForm.valid == true) {
                            (model.quantity =
                                model.quantity == null ? Number(result[1]) : model.quantity),
                                //this.invoiceProducts.push(model);
                                this.getProductOfInvoice(this.newOrderNumber);
                            this.clearFormFields();
                            this.generalService.beep();
                            this.toasterService.success('Ürün Başarılı Şekilde Eklendi.');
                        }
                        else {
                            this.whichRowIsInvalid();
                            formValuesJSON = JSON.stringify(this.productForm.value, null, 2);
                            console.log("Form Ge\u00E7erli De\u011Fil:\n" + formValuesJSON); // console.log()
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateSaleOrderComponent.prototype.calculateTotalQty = function () {
        //toplanan ürünler yazısı için
        var totalQty = 0;
        this.invoiceProducts2.forEach(function (item) {
            totalQty += item.quantity;
        });
        this.totalCount = totalQty;
    };
    CreateSaleOrderComponent.prototype.deleteRow = function (index) {
        this.invoiceProducts.splice(index, 1);
    };
    CreateSaleOrderComponent = __decorate([
        core_1.Component({
            selector: 'app-create-sale-order',
            templateUrl: './create-sale-order.component.html',
            styleUrls: ['./create-sale-order.component.css']
        })
    ], CreateSaleOrderComponent);
    return CreateSaleOrderComponent;
}());
exports.CreateSaleOrderComponent = CreateSaleOrderComponent;
