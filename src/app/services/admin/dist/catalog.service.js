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
exports.CatalogService = void 0;
var core_1 = require("@angular/core");
var CatalogService = /** @class */ (function () {
    function CatalogService(toasterService, httpClientService, generalService, httpClient) {
        this.toasterService = toasterService;
        this.httpClientService = httpClientService;
        this.generalService = generalService;
        this.httpClient = httpClient;
    }
    // Get Catalog Products
    CatalogService.prototype.getCatalogProducts = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .get_new({ controller: 'Products/get-catalog-products' }, request)
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    // Delete Catalog Product
    CatalogService.prototype.deleteCatalogProduct = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .get_new({ controller: 'Products/delete-catalog-product' }, request)
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    // Add Catalog Product
    CatalogService.prototype.addCatalogProduct = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var _request, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _request = [request];
                        return [4 /*yield*/, this.httpClientService
                                .post({ controller: 'Products/add-catalog-product' }, _request)
                                .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    CatalogService.prototype.addCatalogProductBatch = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .post({ controller: 'Products/add-catalog-product' }, request)
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    // Update Catalog Product
    CatalogService.prototype.updateCatalogProduct = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .post({ controller: 'Products/update-catalog-product' }, request)
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    CatalogService.prototype.createCatalogReport = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.httpClientService.get({
                                controller: "Products/create-catalog-raport", responseType: 'arraybuffer'
                            }, request.toString()).toPromise()];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            this.openPdf(response);
                        }
                        else {
                            this.toasterService.error("Hata Alındı ");
                        }
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
    // Get Catalog Product List
    CatalogService.prototype.getCatalogProductList = function (type) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .get_new({ controller: 'Products/get-catalog-product-list' }, type.toString())
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    CatalogService.prototype.openPdf = function (response) {
        return __awaiter(this, void 0, void 0, function () {
            var file, fileURL, downloadLink, _file, _fileURL, iframe;
            return __generator(this, function (_a) {
                file = new Blob([response], { type: 'application/pdf' });
                fileURL = URL.createObjectURL(file);
                downloadLink = document.createElement('a');
                downloadLink.href = fileURL;
                downloadLink.download = "Raport-" + Date.now.toString(); // Set the filename for the download
                document.body.appendChild(downloadLink); // Append to body
                downloadLink.click(); // Trigger the download
                document.body.removeChild(downloadLink); // Remove the link after triggering the download
                URL.revokeObjectURL(fileURL); // Clean up the URL object
                _file = new Blob([response], { type: 'application/pdf' });
                _fileURL = URL.createObjectURL(_file);
                iframe = document.createElement('iframe');
                iframe.style.display = 'none'; // Hide the iframe
                iframe.src = _fileURL;
                // Append the iframe to the body
                document.body.appendChild(iframe);
                // Wait until the iframe is loaded, then call print
                iframe.onload = function () {
                    var _a;
                    (_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.print();
                };
                return [2 /*return*/];
            });
        });
    };
    CatalogService.prototype.createCollectedProductsOfOrderRaport = function (request, warehouseCode) {
        return __awaiter(this, void 0, Promise, function () {
            var response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.httpClientService.get({
                                controller: "raports/create-collected-order-products-raports",
                                responseType: 'arraybuffer'
                            }, request + "/" + warehouseCode).toPromise()];
                    case 1:
                        response = _a.sent();
                        this.openPdf(response);
                        return [2 /*return*/, response];
                    case 2:
                        error_2 = _a.sent();
                        console.log(error_2.message);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 1. Get All CatalogHeaders
    CatalogService.prototype.getAllCatalogHeaders = function () {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .get_new({ controller: 'Products/get-all-catalog-headers' })
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    // 2. Get CatalogHeader By ID
    CatalogService.prototype.getCatalogHeaderById = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .get_new({ controller: 'Products/get-catalog-header-by-id' }, id)
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    // 3. Add New CatalogHeader
    CatalogService.prototype.addCatalogHeader = function (header) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .post({ controller: 'Products/add-catalog-header' }, header)
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    // 4. Update CatalogHeader
    CatalogService.prototype.updateCatalogHeader = function (header) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .post({ controller: 'Products/update-catalog-header' }, header)
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    // 5. Delete CatalogHeader
    CatalogService.prototype.deleteCatalogHeader = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpClientService
                            .get_new({ controller: 'Products/delete-catalog-header' }, id)
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    CatalogService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], CatalogService);
    return CatalogService;
}());
exports.CatalogService = CatalogService;
