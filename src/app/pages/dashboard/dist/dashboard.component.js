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
exports.DashboardComponent = void 0;
var core_1 = require("@angular/core");
var DashboardComponent = /** @class */ (function () {
    function DashboardComponent(headerService, elementRef, orderService) {
        this.headerService = headerService;
        this.elementRef = elementRef;
        this.orderService = orderService;
    }
    DashboardComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.headerService.updatePageTitle("Anasayfa");
                        this.userId = Number(localStorage.getItem('userId'));
                        if (!(this.userId === 5)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.saleCountRaport()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    DashboardComponent.prototype.saleCountRaport = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, days, data, _data, documentStyle, textColor, textColorSecondary, surfaceBorder;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.orderService.getRaports(0)];
                    case 1:
                        response = _a.sent();
                        this.raportData = response;
                        days = [];
                        data = [];
                        _data = [];
                        response.raport_2.forEach(function (raport) {
                            days.push(raport.day);
                            data.push(raport.orderCount);
                        });
                        documentStyle = getComputedStyle(document.documentElement);
                        textColor = documentStyle.getPropertyValue('--text-color');
                        textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
                        surfaceBorder = documentStyle.getPropertyValue('--surface-border');
                        this.data = {
                            labels: days,
                            datasets: [
                                {
                                    label: 'Satış Adedi',
                                    data: data,
                                    fill: true,
                                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                                    tension: 0.4
                                }
                                // {
                                //   label: 'Kazanç',
                                //   data: _data,
                                //   fill: true,
                                //   borderColor: documentStyle.getPropertyValue('--orange-500'),
                                //   tension: 0.4,
                                //   backgroundColor: 'rgba(255,167,38,0.2)'
                                // }
                            ]
                        };
                        this.options = {
                            maintainAspectRatio: false,
                            aspectRatio: 0.5,
                            plugins: {
                                legend: {
                                    labels: {
                                        color: textColor
                                    }
                                }
                            },
                            scales: {
                                x: {
                                    ticks: {
                                        color: textColorSecondary
                                    },
                                    grid: {
                                        color: surfaceBorder,
                                        drawBorder: false
                                    }
                                },
                                y: {
                                    ticks: {
                                        color: textColorSecondary
                                    },
                                    grid: {
                                        color: surfaceBorder,
                                        drawBorder: false
                                    }
                                }
                            }
                        };
                        return [2 /*return*/];
                }
            });
        });
    };
    DashboardComponent.prototype.saleRevenueRaport = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, days, data, documentStyle, textColor, textColorSecondary, surfaceBorder;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.orderService.getRaports(0)];
                    case 1:
                        response = _a.sent();
                        this.raportData = response;
                        days = [];
                        data = [];
                        // response.raport_2.forEach(raport => {
                        //   days.push(raport.day)
                        //   data.push(raport.orderCount * 30)
                        // });
                        response.raport_3.forEach(function (raport) {
                            days.push(raport.day);
                            data.push(raport.orderRevenue);
                        });
                        documentStyle = getComputedStyle(document.documentElement);
                        textColor = documentStyle.getPropertyValue('--text-color');
                        textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
                        surfaceBorder = documentStyle.getPropertyValue('--surface-border');
                        this.data = {
                            labels: days,
                            datasets: [
                                {
                                    label: 'Kazanç',
                                    data: data,
                                    fill: true,
                                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                                    tension: 0.4
                                }
                                // {
                                //   label: 'Kazanç',
                                //   data: _data,
                                //   fill: true,
                                //   borderColor: documentStyle.getPropertyValue('--orange-500'),
                                //   tension: 0.4,
                                //   backgroundColor: 'rgba(255,167,38,0.2)'
                                // }
                            ]
                        };
                        this.options = {
                            maintainAspectRatio: false,
                            aspectRatio: 0.5,
                            plugins: {
                                legend: {
                                    labels: {
                                        color: textColor
                                    }
                                }
                            },
                            scales: {
                                x: {
                                    ticks: {
                                        color: textColorSecondary
                                    },
                                    grid: {
                                        color: surfaceBorder,
                                        drawBorder: false
                                    }
                                },
                                y: {
                                    ticks: {
                                        color: textColorSecondary
                                    },
                                    grid: {
                                        color: surfaceBorder,
                                        drawBorder: false
                                    }
                                }
                            }
                        };
                        return [2 /*return*/];
                }
            });
        });
    };
    DashboardComponent = __decorate([
        core_1.Component({
            selector: 'app-dashboard',
            templateUrl: './dashboard.component.html',
            styleUrls: ['./dashboard.component.css']
        })
    ], DashboardComponent);
    return DashboardComponent;
}());
exports.DashboardComponent = DashboardComponent;
