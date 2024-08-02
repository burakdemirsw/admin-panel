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
exports.WarehouseOperationListComponent = void 0;
var core_1 = require("@angular/core");
var createBarcode_1 = require("src/app/components/Product/create-barcode/models/createBarcode");
var completeCount_CM_1 = require("src/app/models/model/warehouse/completeCount_CM");
var WarehouseOperationListComponent = /** @class */ (function () {
    function WarehouseOperationListComponent(httpClientService, productService, spinnerService, router, warehosueService, formBuilder, orderService, headerService, toasterService, exportCsvService) {
        var _this = this;
        this.httpClientService = httpClientService;
        this.productService = productService;
        this.spinnerService = spinnerService;
        this.router = router;
        this.warehosueService = warehosueService;
        this.formBuilder = formBuilder;
        this.orderService = orderService;
        this.headerService = headerService;
        this.toasterService = toasterService;
        this.exportCsvService = exportCsvService;
        this.currentPage = 1;
        this.warehouseOperationListModels = [];
        this.selectedOperations = [];
        this.items = [
            {
                label: 'Excele Aktar',
                command: function () {
                    _this.exportCsv();
                }
            }
        ];
        //--------------------------------------------------------------------------------------------- ITEMS TO BRING
        this.itemsToCollectDialog = false;
        this.itemsToCollect = [];
        this.innerNumberList = [];
        this.selectedButton = 0;
        this.visible = false;
    }
    WarehouseOperationListComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.spinnerService.show();
                        this.formGenerator();
                        return [4 /*yield*/, this.getWarehouseOperations('0')];
                    case 1:
                        _a.sent();
                        this.spinnerService.hide();
                        this.headerService.updatePageTitle("Havuzda Kalan Transfer Paneli");
                        return [2 /*return*/];
                }
            });
        });
    };
    WarehouseOperationListComponent.prototype.exportCsv = function () {
        this.exportCsvService.exportToCsv(this.warehouseOperationListModels, 'my-orders');
    };
    WarehouseOperationListComponent.prototype.bringItemsToCollect = function (orderNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var orderNumberType, orderNumberType;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.itemsToCollect = [];
                        this.itemsToCollectDialog = true;
                        if (orderNumber.startsWith("W-")) {
                            orderNumberType = "WT";
                        }
                        else {
                            orderNumberType = orderNumber.split('-')[1];
                        }
                        if (!(orderNumberType === 'WT' || orderNumber.startsWith("W-"))) return [3 /*break*/, 4];
                        if (!orderNumber.startsWith("W-")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getAllProducts(orderNumber.split('W-')[1], 'WT')];
                    case 1:
                        _a.sent(); //toplanan ve toplanacak ürünleri çeker
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.getAllProducts(orderNumber, 'WT')];
                    case 3:
                        _a.sent(); //toplanan ve toplanacak ürünleri çeker
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    WarehouseOperationListComponent.prototype.getAllProducts = function (orderNo, orderNoType) {
        return __awaiter(this, void 0, Promise, function () {
            var productData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (orderNo.startsWith("W-")) {
                            orderNo = orderNo.split("W-")[1];
                        }
                        return [4 /*yield*/, this.orderService //toplanacak ürünler çekildi
                                .getCollectedProducts(orderNo, orderNoType).toPromise()];
                    case 1:
                        productData = _a.sent();
                        if (productData.length > 0) {
                            this.itemsToCollect = productData;
                        }
                        else {
                            this.itemsToCollectDialog = false;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    //---------------------------------------------------------------------------------------------
    WarehouseOperationListComponent.prototype.formGenerator = function () {
        this.filterForm = this.formBuilder.group({
            innerNumber: [null],
            startDate: [null],
            endDate: [null]
        });
    };
    WarehouseOperationListComponent.prototype.onSubmit = function (model) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.warehosueService.getWarehosueOperationListByFilter(model)];
                    case 1:
                        _a.warehouseOperationListModels = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    WarehouseOperationListComponent.prototype.setCurrentWarehouseToLocalStorage = function (warehouse, innerNumber) {
        localStorage.setItem('currentWarehouse', warehouse);
        //this.router.navigate(["/warehouse-operation-confirm-detail/"+innerNumber]);
    };
    WarehouseOperationListComponent.prototype.addInnerNumberToList = function (innerNumber) {
        if (!this.innerNumberList.includes(innerNumber)) {
            this.innerNumberList.push(innerNumber);
        }
        else {
            var index = this.innerNumberList.indexOf(innerNumber);
            this.innerNumberList.splice(index, 1);
        }
    };
    WarehouseOperationListComponent.prototype.confirmOperation = function () {
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
    WarehouseOperationListComponent.prototype.getWarehouseOperations = function (status) {
        return __awaiter(this, void 0, Promise, function () {
            var _a, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        this.selectedButton = Number(status);
                        _a = this;
                        return [4 /*yield*/, this.warehosueService.getWarehouseOperations(status)];
                    case 1:
                        _a.warehouseOperationListModels = _b.sent();
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
    WarehouseOperationListComponent.prototype.showModal = function (operationNo) {
        this.selectedOrderNo = operationNo;
        this.visible = !this.visible;
    };
    WarehouseOperationListComponent.prototype.sendBarcodesToNebim = function (isPackage) {
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
    WarehouseOperationListComponent.prototype.createTransferReport = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var _request, data, file, fileURL, downloadLink, _file, _fileURL, iframe_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _request = new completeCount_CM_1.TransferQr_Report();
                        _request.count = request.count;
                        _request.count2 = request.count_2;
                        _request.innerNumber = request.innerNumber;
                        _request.operationDate = request.operationDate;
                        _request.source = request.source;
                        _request.url = 'https://www.davyebkm.com/order-operation/' + request.innerNumber + '/false/' + request.toWarehouseCode;
                        _request.warehouseCode = request.warehouseCode;
                        if (!window.confirm("Barkodları yazdırmak istediğinize emin misiniz?")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.warehosueService.createTransferReport(_request)];
                    case 1:
                        data = _a.sent();
                        if (data) {
                            file = new Blob([data], { type: 'application/pdf' });
                            fileURL = URL.createObjectURL(file);
                            downloadLink = document.createElement('a');
                            downloadLink.href = fileURL;
                            downloadLink.download = "marketplace-order-cargo-barcode.pdf"; // Set the filename for the download
                            document.body.appendChild(downloadLink); // Append to body
                            downloadLink.click(); // Trigger the download
                            document.body.removeChild(downloadLink); // Remove the link after triggering the download
                            URL.revokeObjectURL(fileURL); // Clean up the URL object
                            _file = new Blob([data], { type: 'application/pdf' });
                            _fileURL = URL.createObjectURL(_file);
                            iframe_1 = document.createElement('iframe');
                            iframe_1.style.display = 'none'; // Hide the iframe
                            iframe_1.src = _fileURL;
                            // Append the iframe to the body
                            document.body.appendChild(iframe_1);
                            // Wait until the iframe is loaded, then call print
                            iframe_1.onload = function () {
                                var _a;
                                (_a = iframe_1.contentWindow) === null || _a === void 0 ? void 0 : _a.print();
                            };
                            this.toasterService.success("BARKOD YAZDIRILDI");
                        }
                        else {
                            this.toasterService.error("BARKOD YAZDIRILAMADI");
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    WarehouseOperationListComponent = __decorate([
        core_1.Component({
            selector: 'app-warehouse-operation-list',
            templateUrl: './warehouse-operation-list.component.html',
            styleUrls: ['./warehouse-operation-list.component.css']
        })
    ], WarehouseOperationListComponent);
    return WarehouseOperationListComponent;
}());
exports.WarehouseOperationListComponent = WarehouseOperationListComponent;
