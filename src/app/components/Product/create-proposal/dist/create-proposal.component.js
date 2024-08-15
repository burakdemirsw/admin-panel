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
exports.CreateProposalComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var getCustomerList_CM_1 = require("src/app/models/model/order/getCustomerList_CM");
var nebimOrder_1 = require("src/app/models/model/order/nebimOrder");
var proposalProduct_1 = require("src/app/models/model/product/proposalProduct");
var product_service_1 = require("src/app/services/admin/product.service");
var CreateProposalComponent = /** @class */ (function () {
    function CreateProposalComponent(headerService, warehouseService, paymentService, toasterService, activatedRoute, router, httpClientService, generalService, addressService, googleDriveService, productService, formBuilder, orderService, cargoService) {
        this.headerService = headerService;
        this.warehouseService = warehouseService;
        this.paymentService = paymentService;
        this.toasterService = toasterService;
        this.activatedRoute = activatedRoute;
        this.router = router;
        this.httpClientService = httpClientService;
        this.generalService = generalService;
        this.addressService = addressService;
        this.googleDriveService = googleDriveService;
        this.productService = productService;
        this.formBuilder = formBuilder;
        this.orderService = orderService;
        this.cargoService = cargoService;
        this.selectedCustomers = [];
        this.selectedProducts = [];
        this.selectedAddresses = [];
        this.selectedOfficeAndWarehosue = [];
        this.selectedSubCustomers = [];
        this._selectableCustomers = [];
        this.payment = new nebimOrder_1.Payment();
        this.activeIndex = 0;
        this["true"] = true;
        this.isCollapsed = false;
        this.isCollapsed_2 = false;
        this.updateProductDialog = false;
        this.getCustomerDialog = false;
        this.findProductDialog = false;
        this.selectAddressDialog = false;
        this.subCustomerDialog = false;
        this.addSubCustomerDialog = false;
        this.quantityListDialog = false;
        this.brands = [];
        this.itemCodes = [];
        this.shelfNos = [];
        // targetShelfs: any[] = []
        this.descriptions = [];
        this.productHierarchyLevel01s = [];
        this.productHierarchyLevel02s = [];
        this.productHierarchyLevel03s = [];
        this.allProducts = [];
        this.addedProducts = [];
        this.proposal = new proposalProduct_1.ZTMSG_Proposal();
        this.currentDiscountRate = 0;
        this.selectedSize = '';
        this.currentCashdiscountRate = 0;
        this.findCustomerDialog = false;
        this.customerNames = [];
        this.emails = [];
        this.phones = [];
        this._descriptions = [];
        this.docCurrencyCodes = [];
    }
    CreateProposalComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.createUpdateProductForm();
                        // this.createGetCustomerForm();
                        // this.createGetProductForm();
                        this.orderType = true;
                        this.pageTitle = "Teklif Oluştur";
                        return [4 /*yield*/, this.getProposalProducts()];
                    case 1:
                        _a.sent();
                        this.activatedRoute.params.subscribe(function (params) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!params['id']) return [3 /*break*/, 3];
                                        this.proposalId = params['id'];
                                        return [4 /*yield*/, this.addProposal()];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, this.getProposalProducts()];
                                    case 2:
                                        _a.sent();
                                        return [3 /*break*/, 5];
                                    case 3: return [4 /*yield*/, this.addProposal()];
                                    case 4:
                                        _a.sent();
                                        _a.label = 5;
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); });
                        this.headerService.updatePageTitle(this.pageTitle);
                        this.createDiscountForm();
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateProposalComponent.prototype.createUpdateProductForm = function () {
        this.updateProductForm = this.formBuilder.group({
            price: [null, forms_1.Validators.required],
            quantity: [null, forms_1.Validators.required],
            discountRate1: [null, forms_1.Validators.required],
            discountRate2: [null, forms_1.Validators.required]
        });
    };
    CreateProposalComponent.prototype.createDiscountForm = function () {
        this.discountForm = this.formBuilder.group({
            cashDiscountRate: [null, forms_1.Validators.required],
            percentDiscountRate: [null, forms_1.Validators.required]
        });
    };
    CreateProposalComponent.prototype.routeGetProduct = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    CreateProposalComponent.prototype.showPanel = function (type) {
        if (this.selectedCustomers.length == 0) {
            if (type == 1) {
                if (this.dropdown) {
                    this.dropdown.show();
                }
            }
            else if (type == 2) {
                if (this.dropdown_2) {
                    this.dropdown_2.show();
                }
            }
        }
        else if (type == 3) {
            if (this.dropdown_3) {
                this.dropdown_3.show();
            }
        }
    };
    CreateProposalComponent.prototype.openDialog = function (dialogName) {
        if (dialogName === "getCustomerDialog") {
            this.getCustomerDialog = !this.getCustomerDialog;
        }
        if (dialogName === "findProductDialog") {
            this.findProductDialog = !this.findProductDialog;
        }
        if (dialogName === "addSubCustomerDialog") {
            this.addSubCustomerDialog = !this.addSubCustomerDialog;
        }
        if (dialogName === "quantityListDialog") {
            this.quantityListDialog = !this.quantityListDialog;
        }
        if (dialogName === "updateProductDialog") {
            this.updateProductDialog = !this.updateProductDialog;
        }
    };
    CreateProposalComponent.prototype.goToPage = function (index) {
        this.activeIndex = index;
        // this.toasterService.info(this.activeIndex.toString())
    };
    CreateProposalComponent.prototype.logFilteredData = function (event) {
        try {
            if (event.filteredValue) {
                console.log('Filtered data:', event.filteredValue);
                var list = event.filteredValue;
                this.mapProducts(list);
                this.toasterService.info("Dinamik Search Güncellendi");
            }
        }
        catch (error) {
            this.toasterService.error(error.message);
        }
    };
    CreateProposalComponent.prototype.getAllProducts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.allProducts.length == 0)) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this.productService.searchProduct5()];
                    case 1:
                        _a.allProducts = _b.sent();
                        _b.label = 2;
                    case 2:
                        this.toasterService.success('Tüm Ürünler Getirildi');
                        this.mapProducts(this.allProducts);
                        this.openDialog('findProductDialog');
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateProposalComponent.prototype.mapProducts = function (data) {
        var uniqueMap = function (array, key) {
            var map = new Map();
            array.forEach(function (item) {
                if (!map.has(item[key])) {
                    map.set(item[key], { label: item[key], value: item[key] });
                }
            });
            return Array.from(map.values()).sort(function (a, b) { return a.label.localeCompare(b.label); });
        };
        this.shelfNos = uniqueMap(data, 'shelfNo');
        this.brands = uniqueMap(data, 'brand');
        this.itemCodes = uniqueMap(data, 'itemCode');
        // this.targetShelfs = uniqueMap(this.__transferProducts, 'targetShelf');
        this.descriptions = uniqueMap(data, 'description');
        this.productHierarchyLevel01s = uniqueMap(data, 'productHierarchyLevel01');
        this.productHierarchyLevel02s = uniqueMap(data, 'productHierarchyLevel02');
        this.productHierarchyLevel03s = uniqueMap(data, 'productHierarchyLevel03');
    };
    CreateProposalComponent.prototype.addProposal = function () {
        return __awaiter(this, void 0, void 0, function () {
            var request, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request = new proposalProduct_1.ZTMSG_Proposal();
                        request.id = this.proposalId;
                        request.discountRate1 = 0;
                        request.discountRate2 = 0;
                        request.userId = Number(localStorage.getItem('userId'));
                        return [4 /*yield*/, this.productService.addProposal(request)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            this.proposal = response;
                            this.proposalId = response.id;
                            // await this.getProposalProducts();
                            this.toasterService.success('Oluşturuldu');
                            this.generalService.beep();
                        }
                        else {
                            this.toasterService.error('Oluşturulamadı');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateProposalComponent.prototype.deleteProposal = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var confirmed, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        confirmed = window.confirm('Bu teklifi silmek istediğinizden emin misiniz?');
                        if (!confirmed) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.productService.deleteProposal(id)];
                    case 2:
                        response = _a.sent();
                        if (response) {
                            this.toasterService.success('Silindi');
                            this.router.navigate(['/proposal-list']);
                        }
                        else {
                            this.toasterService.error('Silinemedi');
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Error deleting proposal', error_1);
                        this.toasterService.error('Silinemedi');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CreateProposalComponent.prototype.updatePropoosal = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.productService.updateProposal(request)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            this.proposal = response;
                            this.proposalId = response.id;
                            // await this.getProposalProducts();
                            this.toasterService.success('Güncelleştirildi');
                            this.generalService.beep();
                        }
                        else {
                            this.toasterService.error('Güncelleştirilemedi');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateProposalComponent.prototype.addProduct = function (product) {
        return __awaiter(this, void 0, void 0, function () {
            var request, productDetail, proposalProduct, taxed_price, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request = new product_service_1.BarcodeSearch_RM(product.barcode);
                        return [4 /*yield*/, this.productService.searchProduct(request)];
                    case 1:
                        productDetail = _a.sent();
                        if (!productDetail) return [3 /*break*/, 3];
                        product.price = productDetail[0].basePrice;
                        proposalProduct = new proposalProduct_1.ZTMSG_ProposalProduct();
                        proposalProduct.id = 0; // Varsayılan bir değer, ya da uygun bir değer belirleyin
                        proposalProduct.proposalId = this.proposalId; // Uygun bir GUID değeri be  lirleyin
                        proposalProduct.photoUrl = product.photoUrl;
                        proposalProduct.barcode = product.barcode;
                        proposalProduct.itemCode = product.itemCode;
                        proposalProduct.quantity = 1;
                        proposalProduct.brand = product.brand;
                        proposalProduct.inventory = product.inventory;
                        proposalProduct.price = product.price ? parseFloat(product.price) : null;
                        proposalProduct.discountedPrice = product.price ? parseFloat(product.price) : null;
                        proposalProduct.description = product.description;
                        proposalProduct.discountRate1 = 0;
                        proposalProduct.discountRate2 = 0;
                        proposalProduct.taxRate = 10;
                        taxed_price = (proposalProduct.discountedPrice * (1 + (proposalProduct.taxRate / 100)));
                        proposalProduct.totalTaxedPrice = proposalProduct.quantity * taxed_price;
                        proposalProduct.totalPrice = proposalProduct.quantity *
                            ((proposalProduct.discountedPrice * ((100 - proposalProduct.discountRate1) / 100)) - proposalProduct.discountRate2);
                        proposalProduct.totalTaxedPrice = proposalProduct.quantity *
                            ((proposalProduct.totalTaxedPrice * ((100 - proposalProduct.discountRate1) / 100)) - proposalProduct.discountRate2);
                        return [4 /*yield*/, this.productService.addProposalProduct(proposalProduct)];
                    case 2:
                        response = _a.sent();
                        _a.label = 3;
                    case 3:
                        if (!response) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.getProposalProducts()];
                    case 4:
                        _a.sent();
                        this.toasterService.success('Eklendi');
                        this.generalService.beep();
                        return [3 /*break*/, 6];
                    case 5:
                        this.toasterService.error('Eklenmedi');
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    CreateProposalComponent.prototype.deleteProposalProduct = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.productService.deleteProposalProduct(id)];
                    case 1:
                        response = _a.sent();
                        if (!response) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getProposalProducts()];
                    case 2:
                        _a.sent();
                        this.toasterService.success('Silindi');
                        this.generalService.beep();
                        return [3 /*break*/, 4];
                    case 3:
                        this.toasterService.error('Silinemedi');
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CreateProposalComponent.prototype.updateProposalProduct = function (product) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        product.discountedPrice = this.updateProductForm.get('price').value;
                        product.quantity = this.updateProductForm.get('quantity').value;
                        product.discountRate1 = this.updateProductForm.get('discountRate1').value; //yüzde
                        product.discountRate2 = this.updateProductForm.get('discountRate2').value;
                        product.totalPrice =
                            product.quantity *
                                ((product.discountedPrice * ((100 - product.discountRate1) / 100)) - product.discountRate2);
                        product.totalTaxedPrice =
                            product.quantity *
                                (((product.discountedPrice * (1 + (product.taxRate / 100))) * ((100 - product.discountRate1) / 100)) - product.discountRate2);
                        return [4 /*yield*/, this.productService.updateProposalProduct(product)];
                    case 1:
                        response = _a.sent();
                        if (!response) return [3 /*break*/, 3];
                        this.getTotalPrice2();
                        return [4 /*yield*/, this.getProposalProducts()];
                    case 2:
                        _a.sent();
                        this.toasterService.success('Güncellendi');
                        this.generalService.beep();
                        this.updateProductDialog = false;
                        return [3 /*break*/, 4];
                    case 3:
                        this.toasterService.error('Güncellenmedi');
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CreateProposalComponent.prototype.refreshProposalProduct = function (product) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        product.discountedPrice = product.price;
                        product.quantity = product.quantity;
                        product.discountRate1 = 0;
                        product.discountRate2 = 0;
                        product.totalPrice = (product.quantity * ((product.discountedPrice * ((100 - product.discountRate1) / 100)) - product.discountRate2));
                        return [4 /*yield*/, this.productService.updateProposalProduct(product)];
                    case 1:
                        response = _a.sent();
                        if (!response) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getProposalProducts()];
                    case 2:
                        _a.sent();
                        this.toasterService.success('Güncellendi');
                        this.generalService.beep();
                        return [3 /*break*/, 4];
                    case 3:
                        this.toasterService.error('Güncellenmedi');
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CreateProposalComponent.prototype.getProposalProducts = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!this.proposal.id) return [3 /*break*/, 3];
                        _b = this;
                        return [4 /*yield*/, this.productService.getProposalProducts((_a = this.proposalId) === null || _a === void 0 ? void 0 : _a.toString())];
                    case 1:
                        _b.addedProducts = _c.sent();
                        if (!(this.addedProducts.length == 0)) return [3 /*break*/, 3];
                        this.proposal.discountRate1 = 0;
                        this.proposal.discountRate2 = 0;
                        return [4 /*yield*/, this.updatePropoosal(this.proposal)];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CreateProposalComponent.prototype.openUpdateDialog = function (product) {
        this.selectedProduct = product;
        this.updateProductForm.get('price').setValue(this.selectedProduct.discountedPrice);
        this.updateProductForm.get('quantity').setValue(this.selectedProduct.quantity);
        this.updateProductForm.get('discountRate1').setValue(this.selectedProduct.discountRate1);
        this.updateProductForm.get('discountRate2').setValue(this.selectedProduct.discountRate2);
        this.openDialog('updateProductDialog');
        this.getTotalPrice();
        this.getTotalPrice2();
    };
    CreateProposalComponent.prototype.discount = function (discountAmount) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(discountAmount >= 0 && discountAmount <= 100)) return [3 /*break*/, 2];
                        this.proposal.discountRate1 = discountAmount;
                        return [4 /*yield*/, this.productService.updateProposal(this.proposal)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            this.proposal = response;
                            // await this.getProposalProducts();
                            // await this.getProposalProducts();
                            this.toasterService.success('Güncellendi');
                            this.generalService.beep();
                        }
                        else {
                            this.toasterService.error('Güncellenmedi');
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        this.toasterService.error('1 ile 100 arasında bir değer giriniz.');
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CreateProposalComponent.prototype.cashDiscount = function (discountAmount) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.proposal.discountRate2 = discountAmount;
                        return [4 /*yield*/, this.productService.updateProposal(this.proposal)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            this.proposal = response;
                            // await this.getProposalProducts();
                            this.getTotalPrice2();
                            this.toasterService.success('Güncellendi');
                            this.generalService.beep();
                        }
                        else {
                            this.toasterService.error('Güncellenmedi');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateProposalComponent.prototype.resetDiscount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.proposal.discountRate2 = 0;
                        this.proposal.discountRate1 = 0;
                        return [4 /*yield*/, this.productService.updateProposal(this.proposal)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            this.proposal = response;
                            this.getTotalPrice2();
                            this.toasterService.success('Güncellendi');
                            this.generalService.beep();
                        }
                        else {
                            this.toasterService.error('Güncellenmedi');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateProposalComponent.prototype.createGetProductForm = function () {
        this.getProductsForm = this.formBuilder.group({
            barcode: [null],
            shelfNo: [null]
            // stockCode: [null],
        });
    };
    CreateProposalComponent.prototype.createProposalReport = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!window.confirm("Teklifi Oluşturmak İstediğinize Emin Misiniz?")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.warehouseService.createProposalReport(this.proposal.id)];
                    case 1:
                        data = _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    CreateProposalComponent.prototype.deleteAllPRoduct = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (confirm("Tüm Ürünleri Silmek İstediğinize Emin Misiniz?")) {
                    this.addedProducts.forEach(function (p) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.deleteProposalProduct(p.id)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                }
                this.getTotalPrice();
                this.getTotalPrice2();
                return [2 /*return*/];
            });
        });
    };
    CreateProposalComponent.prototype.mapCustomers = function (data) {
        var uniqueMap = function (array, key) {
            var map = new Map();
            array.forEach(function (item) {
                if (!map.has(item[key])) {
                    map.set(item[key], { label: item[key], value: item[key] });
                }
            });
            return Array.from(map.values()).sort(function (a, b) { return a.label.localeCompare(b.label); });
        };
        this.customerNames = uniqueMap(data, 'currAccCode');
        this._descriptions = uniqueMap(data, 'currAccDescription');
        this.emails = uniqueMap(data, 'mail');
        this.phones = uniqueMap(data, 'phone');
        this.docCurrencyCodes = uniqueMap(data, 'docCurrencyCode');
    };
    CreateProposalComponent.prototype.getAllCustomers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _request, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this._selectableCustomers.length > 0)) return [3 /*break*/, 1];
                        this.findCustomerDialog = true;
                        return [3 /*break*/, 3];
                    case 1:
                        _request = new getCustomerList_CM_1.GetCustomerList_CM();
                        _request.currAccCode = null;
                        _request.mail = null;
                        _request.phone = null;
                        _a = this;
                        return [4 /*yield*/, this.orderService.getCustomerList_2(_request)];
                    case 2:
                        _a._selectableCustomers = _b.sent();
                        this.mapCustomers(this._selectableCustomers);
                        this.findCustomerDialog = true;
                        _b.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CreateProposalComponent.prototype.addCustomer = function (customer) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.proposal.currAccDescription = customer.currAccDescription;
                        return [4 /*yield*/, this.updatePropoosal(this.proposal)];
                    case 1:
                        _a.sent();
                        this.findCustomerDialog = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateProposalComponent.prototype.logFilteredData2 = function (event) {
        // try {
        //   if (event.filteredValue) {
        //     var list: CustomerList_VM[] = event.filteredValue;
        //     this.mapCustomers(list)
        //     this.toasterService.info("Dinamik Search Güncellendi")
        //   }
        // } catch (error) {
        //   this.toasterService.error(error.message)
        // }
    };
    //---------------------------------------------------- TOTAL FUNCS
    CreateProposalComponent.prototype.getTotalPrice = function () {
        var number = this.addedProducts.reduce(function (acc, product) { return acc + product.totalPrice; }, 0);
        if (number.toString().includes('.')) {
            return Number(number.toString().split('.')[0]);
        }
        else {
            return number;
        }
    };
    //dip iskonto uygulandıktan sonraki fiyatı çeker
    CreateProposalComponent.prototype.getTotalPrice2 = function () {
        return this.addedProducts.reduce(function (acc, product) { return acc + product.totalTaxedPrice; }, 0) * ((100 - this.proposal.discountRate1) / 100) - this.proposal.discountRate2;
    };
    CreateProposalComponent.prototype.getTotalQuantity = function () {
        return this.addedProducts.reduce(function (acc, product) { return acc + product.quantity; }, 0);
    };
    CreateProposalComponent.prototype.getTotalTax = function () {
        return this.addedProducts.reduce(function (acc, product) { return acc + (product.totalPrice * (product.taxRate / 100)); }, 0);
    };
    CreateProposalComponent.prototype.getTotal = function () {
        return this.addedProducts.reduce(function (acc, product) { return acc + product.totalPrice; }, 0);
    };
    //dip iskonto uygulanmadan önceki fiyatı çeker
    CreateProposalComponent.prototype.getTotalTaxedPrice = function () {
        var total = this.addedProducts.reduce(function (acc, product) { return acc + product.totalTaxedPrice; }, 0);
        return parseFloat(total.toFixed(2));
    };
    CreateProposalComponent.prototype.getTotalPriceWithTax = function () {
        var number = this.selectedProducts.reduce(function (acc, product) { return acc + (product.quantity * product.discountedPrice * (product.taxRate / 100)); }, 0);
        if (number.toString().includes('.')) {
            return Number(number.toString().split('.')[0]);
        }
        else {
            return number;
        }
    };
    __decorate([
        core_1.ViewChild('findCustomer', { static: false })
    ], CreateProposalComponent.prototype, "findCustomer");
    __decorate([
        core_1.ViewChild('findAddress', { static: false })
    ], CreateProposalComponent.prototype, "findAddress");
    __decorate([
        core_1.ViewChild('findProducts', { static: false })
    ], CreateProposalComponent.prototype, "findProducts");
    __decorate([
        core_1.ViewChild('preview', { static: false })
    ], CreateProposalComponent.prototype, "preview");
    __decorate([
        core_1.ViewChild('subCurrAccDescription_dropdown')
    ], CreateProposalComponent.prototype, "dropdown_3");
    __decorate([
        core_1.ViewChild('currAccDescription_dropdown')
    ], CreateProposalComponent.prototype, "dropdown");
    __decorate([
        core_1.ViewChild('phoneNumber_dropdown')
    ], CreateProposalComponent.prototype, "dropdown_2");
    CreateProposalComponent = __decorate([
        core_1.Component({
            selector: 'app-create-proposal',
            templateUrl: './create-proposal.component.html',
            styleUrl: './create-proposal.component.css'
        })
    ], CreateProposalComponent);
    return CreateProposalComponent;
}());
exports.CreateProposalComponent = CreateProposalComponent;