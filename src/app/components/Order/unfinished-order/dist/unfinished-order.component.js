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
exports.UnfinishedOrderComponent = void 0;
var core_1 = require("@angular/core");
var UnfinishedOrderComponent = /** @class */ (function () {
    function UnfinishedOrderComponent(headerService, toasterService, orderService, router) {
        this.headerService = headerService;
        this.toasterService = toasterService;
        this.orderService = orderService;
        this.router = router;
        this.currentPage = 1;
        this.orders = [];
        this.visible = false;
        this.currentOrderState = false;
    }
    UnfinishedOrderComponent.prototype.ngOnInit = function () {
        this.getOrders(this.currentOrderState);
    };
    UnfinishedOrderComponent.prototype.route = function (order) {
        if (order.orderNo.includes('MSG-P')) {
            this.router.navigate(["/create-order/retail-order/" + order.id]);
        }
        else {
            this.router.navigate(["/create-order/quick-order/" + order.id]);
        }
    };
    UnfinishedOrderComponent.prototype.getOrders = function (isCompleted) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.headerService.updatePageTitle("Panel Siparişleri");
                        this.currentOrderState = isCompleted;
                        _a = this;
                        return [4 /*yield*/, this.orderService.getClientOrders(isCompleted)];
                    case 1:
                        _a.orders = _b.sent();
                        this.filterOrdersByRole();
                        this.headerService.updatePageTitle((this.currentOrderState == true ? "Tamamlanmış" : "Tamamlanmamış") + " Siparişler");
                        return [2 /*return*/];
                }
            });
        });
    };
    UnfinishedOrderComponent.prototype.filterOrdersByRole = function () {
        if (localStorage.getItem('roleDescription') != 'Admin') {
            this.orders = this.orders.filter(function (x) { return x.customerCode == localStorage.getItem('salesPersonCode'); });
            this.toasterService.info('Sadece Kendi Siparişlerinizi Görebilirsiniz.');
        }
    };
    UnfinishedOrderComponent.prototype.deleteClientOrder = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.orderService.deleteClientOrder(id)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            this.toasterService.success("Sipariş Silindi");
                            this.getOrders(this.currentOrderState);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    UnfinishedOrderComponent.prototype.updateCargoStatus = function (order) {
        return __awaiter(this, void 0, void 0, function () {
            var order_response, update_response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.orderService.getClientOrder(order.id)];
                    case 1:
                        order_response = _a.sent();
                        if (!order_response) return [3 /*break*/, 3];
                        if (order_response.clientOrder.cargoStatus == "KARGO VAR") {
                            order_response.clientOrder.cargoStatus = "KARGO YOK";
                        }
                        else {
                            order_response.clientOrder.cargoStatus = "KARGO VAR";
                        }
                        return [4 /*yield*/, this.orderService.createClientOrder(order_response.clientOrder)];
                    case 2:
                        update_response = _a.sent();
                        if (update_response) {
                            this.toasterService.success("Kargo Durumu Güncellendi");
                            this.getOrders(this.currentOrderState);
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UnfinishedOrderComponent = __decorate([
        core_1.Component({
            selector: 'app-unfinished-order',
            templateUrl: './unfinished-order.component.html',
            styleUrls: ['./unfinished-order.component.css']
        })
    ], UnfinishedOrderComponent);
    return UnfinishedOrderComponent;
}());
exports.UnfinishedOrderComponent = UnfinishedOrderComponent;
