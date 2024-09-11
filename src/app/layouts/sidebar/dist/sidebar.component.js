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
exports.SidebarComponent = void 0;
var core_1 = require("@angular/core");
var SidebarComponent = /** @class */ (function () {
    function SidebarComponent(router, generalService, infoService) {
        this.router = router;
        this.generalService = generalService;
        this.infoService = infoService;
        this.menuItems = [];
    }
    SidebarComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.roleDescription = localStorage.getItem("roleDescription");
                        this.userId = localStorage.getItem("userId");
                        return [4 /*yield*/, this.loadMenu()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SidebarComponent.prototype.loadMenu = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var data, otherItems, ayarlarItem, userRole, _i, data_1, item, filteredSubItems, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.infoService.getStructuredMenu()];
                    case 1:
                        data = _b.sent();
                        otherItems = [];
                        ayarlarItem = null;
                        userRole = localStorage.getItem("roleDescription");
                        // Separate "Ayarlar" item from the rest based on role
                        for (_i = 0, data_1 = data; _i < data_1.length; _i++) {
                            item = data_1[_i];
                            if (userRole === 'Salesman') {
                                // If the role is Salesman, include specific items
                                if (item.label === 'Toptan Satış') {
                                    filteredSubItems = ((_a = item.children) === null || _a === void 0 ? void 0 : _a.filter(function (subItem) { return subItem.label === 'Siparişlerim' || subItem.label === 'Sipariş Ver' || subItem.label === 'Perakende Satış'; })) || [];
                                    if (filteredSubItems.length > 0) {
                                        item.children = filteredSubItems; // Set only the "Siparişlerim" submenu
                                        otherItems.push(item); // Add the modified "Toptan Satış" menu
                                    }
                                }
                                else if (['Satış & Pazarlama', 'Ürünler'].includes(item.label)) {
                                    otherItems.push(item); // Add these menu items unchanged
                                }
                            }
                            else {
                                // For non-admin roles, include items except "Anasayfa"
                                if (item.label === 'Ayarlar') {
                                    ayarlarItem = item;
                                }
                                else if (item.label === 'Anasayfa') {
                                    continue;
                                }
                                else {
                                    otherItems.push(item);
                                }
                            }
                        }
                        // Add "Ayarlar" item to the end if it exists
                        if (ayarlarItem) {
                            otherItems.push(ayarlarItem);
                        }
                        // Update menuItems with reordered list
                        this.menuItems = otherItems;
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _b.sent();
                        console.error('Error loading menu', error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SidebarComponent.prototype.onAction = function (action, param) {
        switch (action) {
            case 'routeNewPage':
                this.routeNewPage();
                break;
            case 'routeNewPage2':
                this.routeNewPage2();
                break;
            case 'routeNewPage3(true)':
                this.routeNewPage3(true);
                break;
            case 'routeNewPage3(false)':
                this.routeNewPage3(false);
                break;
            case 'routeNewPage4':
                this.routeNewPage4();
                break;
            case 'routeNewPage5':
                this.routeNewPage5();
                break;
            case 'routeNewPage6':
                this.routeNewPage6();
                break;
            case 'routeNewPage7':
                this.routeNewPage7();
                break;
            default:
                console.error("Action \"" + action + "\" not found");
        }
    };
    SidebarComponent.prototype.routeNewPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.generalService.generateGUID()];
                    case 1:
                        result = _a.sent();
                        this.router.navigate(["/warehouse-operation/" + result]);
                        return [2 /*return*/];
                }
            });
        });
    };
    SidebarComponent.prototype.routeNewPage2 = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.generalService.generateGUID()];
                    case 1:
                        result = _a.sent();
                        this.router.navigate(["/warehouse-operation/" + "REQ-" + result + "/0"]);
                        return [2 /*return*/];
                }
            });
        });
    };
    SidebarComponent.prototype.routeNewPage3 = function (pageDesc) {
        return __awaiter(this, void 0, void 0, function () {
            var result, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!pageDesc) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.generalService.generateGUID()];
                    case 1:
                        result = _a.sent();
                        location.href = location.origin + "/create-order/quick-order/" + result;
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.generalService.generateGUID()];
                    case 3:
                        result = _a.sent();
                        location.href = location.origin + "/create-order/retail-order/" + result;
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SidebarComponent.prototype.routeNewPage4 = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.generalService.generateGUID()];
                    case 1:
                        result = _a.sent();
                        this.router.navigate(["/create-barcode/" + result]);
                        return [2 /*return*/];
                }
            });
        });
    };
    SidebarComponent.prototype.routeNewPage5 = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.generalService.generateGUID()];
                    case 1:
                        result = _a.sent();
                        this.router.navigate(["/shelf-transfer-request/" + result +
                                "/0"
                        ]);
                        return [2 /*return*/];
                }
            });
        });
    };
    SidebarComponent.prototype.routeNewPage6 = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.generalService.generateGUID()];
                    case 1:
                        result = _a.sent();
                        this.router.navigate(["/fast-transfer/" + result
                        ]);
                        return [2 /*return*/];
                }
            });
        });
    };
    SidebarComponent.prototype.routeNewPage7 = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.generalService.generateGUID()];
                    case 1:
                        result = _a.sent();
                        this.router.navigate(["/create-product-barcode/" + result
                        ]);
                        return [2 /*return*/];
                }
            });
        });
    };
    SidebarComponent = __decorate([
        core_1.Component({
            selector: 'app-sidebar',
            templateUrl: './sidebar.component.html',
            styleUrls: ['./sidebar.component.css']
        })
    ], SidebarComponent);
    return SidebarComponent;
}());
exports.SidebarComponent = SidebarComponent;
