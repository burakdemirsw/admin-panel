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
exports.ProposalListComponent = void 0;
var core_1 = require("@angular/core");
var ProposalListComponent = /** @class */ (function () {
    function ProposalListComponent(generalService, toasterService, router, productService, orderService) {
        this.generalService = generalService;
        this.toasterService = toasterService;
        this.router = router;
        this.productService = productService;
        this.orderService = orderService;
        this.currentPage = 1;
        this.proposals = [];
        this.completeDialog = false;
        this.raportType = 1;
    }
    ProposalListComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getProposals()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProposalListComponent.prototype.getProposals = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.productService.getProposals()];
                    case 1:
                        _a.proposals = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProposalListComponent.prototype.deleteProposal = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var confirmed, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        confirmed = window.confirm('Bu teklifi silmek istediğinizden emin misiniz?');
                        if (!confirmed) return [3 /*break*/, 7];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, this.productService.deleteProposal(id)];
                    case 2:
                        response = _a.sent();
                        if (!response) return [3 /*break*/, 4];
                        this.toasterService.success('Silindi');
                        return [4 /*yield*/, this.getProposals()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        this.toasterService.error('Silinemedi');
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_1 = _a.sent();
                        console.error('Error deleting proposal', error_1);
                        this.toasterService.error('Silinemedi');
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    ProposalListComponent.prototype.createProposalReport = function (selectedProposal) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.completeDialog = true;
                this.selectedProposal = selectedProposal;
                return [2 /*return*/];
            });
        });
    };
    ProposalListComponent.prototype._createProposalReport = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            var data, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!window.confirm("Mail Gönderilsin mi?")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.orderService.createProposalReport(this.selectedProposal.id, true, type)];
                    case 1:
                        data = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.orderService.createProposalReport(this.selectedProposal.id, false, type)];
                    case 3:
                        data = _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ProposalListComponent.prototype.routeNewPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var uuid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.generalService.generateGUID()];
                    case 1:
                        uuid = _a.sent();
                        this.router.navigate(["/create-proposal"]);
                        this.toasterService.info("Ürün Aratınız");
                        return [2 /*return*/];
                }
            });
        });
    };
    ProposalListComponent = __decorate([
        core_1.Component({
            selector: 'app-proposal-list',
            templateUrl: './proposal-list.component.html',
            styleUrl: './proposal-list.component.css'
        })
    ], ProposalListComponent);
    return ProposalListComponent;
}());
exports.ProposalListComponent = ProposalListComponent;
