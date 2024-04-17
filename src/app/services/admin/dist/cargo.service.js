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
exports.CargoService = void 0;
var core_1 = require("@angular/core");
var CargoService = /** @class */ (function () {
    function CargoService(toasterService, httpClientService, router, httpClient) {
        this.toasterService = toasterService;
        this.httpClientService = httpClientService;
        this.router = router;
        this.httpClient = httpClient;
    }
    CargoService.prototype.createCargo = function (request, firmId) {
        return __awaiter(this, void 0, Promise, function () {
            var response, error_1, response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(firmId === 1)) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.httpClientService.post({ controller: "cargos/create-cargo" }, request).toPromise()];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 3:
                        error_1 = _a.sent();
                        console.log(error_1.message);
                        return [2 /*return*/, null];
                    case 4: return [3 /*break*/, 8];
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, this.httpClientService.post({ controller: "cargos/create-aras-cargo" }, request).toPromise()];
                    case 6:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 7:
                        error_2 = _a.sent();
                        console.log(error_2.message);
                        return [2 /*return*/, null];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    CargoService.prototype.createBarcode = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var response, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.httpClientService.get({ controller: "cargos/create-barcode" }, request).toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2:
                        error_3 = _a.sent();
                        console.log(error_3.message);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CargoService.prototype.printSingleBarcode = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var _request, response, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        _request = { ZplBarcode: request };
                        return [4 /*yield*/, this.httpClientService.post({ controller: "cargos/print-single-barcode" }, _request).toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2:
                        error_4 = _a.sent();
                        console.log(error_4.message);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CargoService.prototype.getShippedCargos = function (isPrinted) {
        return __awaiter(this, void 0, Promise, function () {
            var response, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.httpClientService.get({ controller: "cargos/get-shipped-cargos" }, isPrinted.toString()).toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2:
                        error_5 = _a.sent();
                        console.log(error_5.message);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CargoService.prototype.getPackageStatus = function (shipmentId) {
        return __awaiter(this, void 0, Promise, function () {
            var response, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.httpClientService.get({ controller: "cargos/get-package-status" }, shipmentId).toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2:
                        error_6 = _a.sent();
                        console.log(error_6.message);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CargoService.prototype.deleteCargo = function (cargo, cargoFirmId) {
        return __awaiter(this, void 0, Promise, function () {
            var request, response, error_7, request, __response, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(cargoFirmId === 1)) return [3 /*break*/, 5];
                        request = {
                            ReferenceId: cargo.referenceId,
                            ShipmentId: cargo.shipmentId
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.httpClientService.post({ controller: "cargos/delete-shipped-cargo" }, request).toPromise()];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 3:
                        error_7 = _a.sent();
                        console.log(error_7.message);
                        return [2 /*return*/, null];
                    case 4: return [3 /*break*/, 9];
                    case 5:
                        request = {
                            ReferenceId: cargo.referenceId,
                            ShipmentId: cargo.shipmentId
                        };
                        _a.label = 6;
                    case 6:
                        _a.trys.push([6, 8, , 9]);
                        return [4 /*yield*/, this.httpClientService.get({ controller: "cargos/delete-aras-order" }, cargo.referenceId).toPromise()];
                    case 7:
                        __response = _a.sent();
                        return [2 /*return*/, __response];
                    case 8:
                        error_8 = _a.sent();
                        console.log(error_8.message);
                        return [2 /*return*/, null];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    CargoService.prototype.printBarcodeFromBase64 = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var _request, response, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        _request = { ZplBarcode: request };
                        return [4 /*yield*/, this.httpClientService.post({ controller: "cargos/print-single-barcode" }, _request).toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2:
                        error_9 = _a.sent();
                        console.log(error_9.message);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CargoService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], CargoService);
    return CargoService;
}());
exports.CargoService = CargoService;
