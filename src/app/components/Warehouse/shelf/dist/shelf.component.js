"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.ShelfComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var ShelfComponent = /** @class */ (function () {
    function ShelfComponent(formBuilder, toasterService, orderService, router, activatedRoute, productService, warehouseService, generalService, title, headerService) {
        this.formBuilder = formBuilder;
        this.toasterService = toasterService;
        this.orderService = orderService;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.productService = productService;
        this.warehouseService = warehouseService;
        this.generalService = generalService;
        this.title = title;
        this.headerService = headerService;
        this.shelves = [];
        this.selectedShelf = null;
        this.displayUpdateDialog = false;
    }
    ShelfComponent.prototype.ngOnInit = function () {
        this.loadShelves();
        this.shelfForm = this.formBuilder.group({
            id: [null],
            warehouse: [null],
            shelfNo: [null, forms_1.Validators.required],
            rowNumber: [null],
            konum: [null],
            createdDate: [Date.now],
            updatedDate: [Date.now]
        });
        this.updateShelfForm = this.formBuilder.group({
            id: [null],
            warehouse: ['', forms_1.Validators.required],
            shelfNo: ['', forms_1.Validators.required],
            rowNumber: ['', forms_1.Validators.required],
            konum: ['', forms_1.Validators.required],
            createdDate: [Date.now],
            updatedDate: [Date.now]
        });
    };
    ShelfComponent.prototype.loadShelves = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = this;
                        return [4 /*yield*/, this.warehouseService.getShelves()];
                    case 1:
                        _a.shelves = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _b.sent();
                        console.error('Error loading shelves:', error_1);
                        this.toasterService.error('Raflar yüklenirken bir hata oluştu.');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ShelfComponent.prototype.openUpdateDialog = function (shelf) {
        this.selectedShelf = shelf;
        this.updateShelfForm.patchValue(shelf);
        this.displayUpdateDialog = true;
    };
    ShelfComponent.prototype.addShelf = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, success;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.shelfForm.valid) return [3 /*break*/, 3];
                        _a = request;
                        return [4 /*yield*/, this.generalService.generateGUID()];
                    case 1:
                        _a.id = _b.sent();
                        return [4 /*yield*/, this.warehouseService.addShelf(request)];
                    case 2:
                        success = _b.sent();
                        if (success) {
                            this.loadShelves();
                            this.toasterService.success("Eklendi");
                            this.shelfForm.reset();
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        this.toasterService.error("Form Hatalı");
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ShelfComponent.prototype.updateShelf = function () {
        return __awaiter(this, void 0, void 0, function () {
            var updatedShelf, success;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.updateShelfForm.valid && this.selectedShelf)) return [3 /*break*/, 2];
                        updatedShelf = __assign(__assign({}, this.selectedShelf), this.updateShelfForm.value);
                        return [4 /*yield*/, this.warehouseService.updateShelf(updatedShelf)];
                    case 1:
                        success = _a.sent();
                        if (success) {
                            this.loadShelves();
                            this.displayUpdateDialog = false;
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    ShelfComponent.prototype.deleteShelf = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var success;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.warehouseService.removeShelf(id)];
                    case 1:
                        success = _a.sent();
                        if (success) {
                            this.loadShelves();
                            this.toasterService.success("Silindi");
                            this.shelfForm.reset();
                        }
                        else {
                            this.toasterService.error("Silinemedi");
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ShelfComponent = __decorate([
        core_1.Component({
            selector: 'app-shelf',
            templateUrl: './shelf.component.html',
            styleUrls: ['./shelf.component.css']
        })
    ], ShelfComponent);
    return ShelfComponent;
}());
exports.ShelfComponent = ShelfComponent;
