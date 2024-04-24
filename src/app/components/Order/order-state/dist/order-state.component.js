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
exports.OrderStateComponent = void 0;
var core_1 = require("@angular/core");
var OrderStateComponent = /** @class */ (function () {
    function OrderStateComponent(renderer, toasterService, orderService) {
        this.renderer = renderer;
        this.toasterService = toasterService;
        this.orderService = orderService;
        this.collectableOrders = [];
        this.collectedOrders = [];
        this.scrollDownIntervalId = null;
        this.scrollUpIntervalId = null;
    }
    OrderStateComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.orderService.getExchangeRates()];
                    case 1:
                        response = _b.sent();
                        this.exchangeRates = response;
                        _a = this;
                        return [4 /*yield*/, this.getOrders(1, 2)];
                    case 2:
                        _a.collectableOrders = _b.sent();
                        // setInterval başlat ve referansı intervalId'e ata
                        this.intervalId = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _a = this;
                                        return [4 /*yield*/, this.getOrders(1, 2)];
                                    case 1:
                                        _a.collectableOrders = _b.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }, 30000);
                        // Yavaş yavaş sayfanın altına kaydır
                        this.scrollDownSmoothly();
                        return [2 /*return*/];
                }
            });
        });
    };
    OrderStateComponent.prototype.showPanel = function () {
        this.panel.toggle(event);
    };
    OrderStateComponent.prototype.scrollDownSmoothly = function () {
        var _this = this;
        var scrollStep = 2; // Sabit kaydırma adımı
        var scrollPosition = 0; // Şu anki kaydırma konumu
        this.scrollDownIntervalId = setInterval(function () {
            if (scrollPosition < document.body.scrollHeight) {
                window.scrollBy(0, scrollStep); // Sayfayı aşağı kaydır
                scrollPosition += scrollStep;
            }
            else {
                clearInterval(_this.scrollDownIntervalId);
                _this.scrollUpSmoothly(); // Ve yukarı kaydırmaya başla
            }
        }, 100); // Her 100 milisaniyede bir adım at
    };
    OrderStateComponent.prototype.scrollUpSmoothly = function () {
        var _this = this;
        var scrollStep = 2; // Sabit kaydırma adımı
        var scrollPosition = document.body.scrollHeight; // Şu anki kaydırma konumu
        this.scrollUpIntervalId = setInterval(function () {
            if (scrollPosition > 0) {
                window.scrollBy(0, -scrollStep); // Sayfayı yukarı kaydır
                scrollPosition -= scrollStep;
            }
            else {
                clearInterval(_this.scrollUpIntervalId);
                _this.scrollDownSmoothly(); // Ve tekrar aşağı kaydırmaya başla
            }
        }, 100); // Her 100 milisaniyede bir adım at
    };
    OrderStateComponent.prototype.ngOnDestroy = function () {
        // Bileşen yok edildiğinde tüm setInterval'leri durdur
        if (this.scrollDownIntervalId) {
            clearInterval(this.scrollDownIntervalId);
        }
        if (this.scrollUpIntervalId) {
            clearInterval(this.scrollUpIntervalId);
        }
    };
    OrderStateComponent.prototype.getCollectableOrders = function () {
    };
    OrderStateComponent.prototype.getOrders = function (status, invoiceStatus) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.status = status;
                        this.invoiceStatus = invoiceStatus;
                        return [4 /*yield*/, this.orderService.getSaleOrdersWithStatus(status, invoiceStatus)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    __decorate([
        core_1.ViewChild('panel')
    ], OrderStateComponent.prototype, "panel");
    OrderStateComponent = __decorate([
        core_1.Component({
            selector: 'app-order-state',
            templateUrl: './order-state.component.html',
            styleUrls: ['./order-state.component.css']
        })
    ], OrderStateComponent);
    return OrderStateComponent;
}());
exports.OrderStateComponent = OrderStateComponent;
