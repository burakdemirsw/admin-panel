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
exports.ProductManagementComponent = void 0;
var core_1 = require("@angular/core");
var product_service_1 = require("src/app/services/admin/product.service");
var forms_1 = require("@angular/forms");
var ProductManagementComponent = /** @class */ (function () {
    function ProductManagementComponent(httpClientService, toasterService, spinnerService, productService, formBuilder, sanitizer, generalService) {
        this.httpClientService = httpClientService;
        this.toasterService = toasterService;
        this.spinnerService = spinnerService;
        this.productService = productService;
        this.formBuilder = formBuilder;
        this.sanitizer = sanitizer;
        this.generalService = generalService;
        this.products = [];
        this.showImage = false; // add this property
        this.view = true;
        this.invoiceProducts2 = [];
        this.availableCameras = [];
        this.enableScanner = false;
        this.qrCodeDownloadLink = this.sanitizer.bypassSecurityTrustResourceUrl('');
        this.selectedProductList = [];
        this.visible = false;
    }
    ProductManagementComponent.prototype.ngOnInit = function () {
        this.formGenerator();
    };
    ProductManagementComponent.prototype.camerasFoundHandler = function (cameras) {
        this.availableCameras = cameras;
        if (cameras.length > 0) {
            this.selectedDevice = cameras[0]; // Varsayılan olarak ilk kamerayı seç
        }
    };
    ProductManagementComponent.prototype.onCameraSelected = function (event) {
        var selectElement = event.target;
        var deviceId = selectElement.value;
        this.selectedDevice = this.availableCameras.find(function (c) { return c.deviceId === deviceId; });
    };
    ProductManagementComponent.prototype.scanSuccessHandler = function (event) {
        console.log('QR Code Data: ', event);
    };
    ProductManagementComponent.prototype.createJson = function (barcode, shelfNo) {
        var model = this.products.find(function (p) { return (p.barcode = barcode) && p.shelfNo == shelfNo; });
        var formDataJSON = JSON.stringify(model.barcode + "--" + model.batchCode + "--" + model.itemCode); // Form verilerini JSON'a dönüştür
        this.qrCodeValue = formDataJSON;
        // this.toasterService.success(this.qrCodeValue)
    };
    ProductManagementComponent.prototype.openImageModal = function (imageUrl) {
        this.modalImageUrl = imageUrl;
        if (!this.formModal) {
            this.formModal = new window.bootstrap.Modal(document.getElementById('myModal'));
        }
        this.formModal.show();
    };
    ProductManagementComponent.prototype.onChangeURL = function (url) {
        this.qrCodeDownloadLink = url;
        this.openImageModal(this.qrCodeDownloadLink);
        this.qrCodeValue = '';
    };
    ProductManagementComponent.prototype.formGenerator = function () {
        try {
            this.productForm = this.formBuilder.group({
                barcode: [null, forms_1.Validators.required]
            });
        }
        catch (error) {
            this.toasterService.error(error.message);
        }
    };
    ProductManagementComponent.prototype.openShelvesModal = function (id) {
        this.visible = true;
    };
    ProductManagementComponent.prototype.getProducts = function (barcode) {
        return __awaiter(this, void 0, void 0, function () {
            var model, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (barcode.includes("=")) {
                            barcode = barcode.replace(/=/g, "-");
                        }
                        model = new product_service_1.BarcodeSearch_RM();
                        model.barcode = barcode;
                        return [4 /*yield*/, this.productService._searchProduct(model)];
                    case 1:
                        response = _a.sent();
                        this.products = response;
                        return [2 /*return*/, response];
                    case 2:
                        error_1 = _a.sent();
                        console.log(error_1.message);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProductManagementComponent.prototype.clearBarcode = function () {
        this.productForm.get('barcode').setValue(null);
        this.focusNextInput('barcode');
    };
    ProductManagementComponent.prototype.focusNextInput = function (nextInputId) {
        var nextInput = document.getElementById(nextInputId);
        if (nextInput) {
            nextInput.focus();
        }
    };
    ProductManagementComponent.prototype.onSubmit = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getProducts(value.barcode)];
                    case 1:
                        _a.sent();
                        this.toasterService.success(value.barcode);
                        return [2 /*return*/];
                }
            });
        });
    };
    ProductManagementComponent = __decorate([
        core_1.Component({
            selector: 'app-product-management',
            templateUrl: './product-management.component.html',
            styleUrls: ['./product-management.component.css']
        })
    ], ProductManagementComponent);
    return ProductManagementComponent;
}());
exports.ProductManagementComponent = ProductManagementComponent;
