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
exports.PagesLoginv2Component = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var PagesLoginv2Component = /** @class */ (function () {
    function PagesLoginv2Component(userService, router, formBuilder, alertifyService) {
        this.userService = userService;
        this.router = router;
        this.formBuilder = formBuilder;
        this.alertifyService = alertifyService;
    }
    PagesLoginv2Component.prototype.ngOnInit = function () {
        this.emailFormCreator();
        this.formGenerator();
    };
    PagesLoginv2Component.prototype.formGenerator = function () {
        this.loginForm = this.formBuilder.group({
            password: [null, forms_1.Validators.required],
            phoneNumberOrEmail: [null, forms_1.Validators.required]
        });
    };
    PagesLoginv2Component.prototype.onSubmit = function (loginFormValue) {
        return __awaiter(this, void 0, void 0, function () {
            var model, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!this.loginForm.valid) return [3 /*break*/, 2];
                        model = {
                            password: loginFormValue.password,
                            phoneNumberOrEmail: loginFormValue.phoneNumberOrEmail
                        };
                        return [4 /*yield*/, this.userService.login(model)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            location.href = location.origin + "/dashboard";
                            // this.router.navigate(["/dashboard"])
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        console.log('Form Geçerli Değil');
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        this.alertifyService.warning("Hata Alındı: " + error_1.message);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    PagesLoginv2Component.prototype.openDialog = function () {
        this.visible = !this.visible;
    };
    PagesLoginv2Component.prototype.emailFormCreator = function () {
        this.emailForm = this.formBuilder.group({
            userEmail: [null]
        });
    };
    PagesLoginv2Component.prototype.submitEmailForm = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.emailForm.valid) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.userService.sendPasswordResetEmail(value.userEmail)];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            this.alertifyService.success("Mail Gönderildi: " + "Mail Kutunuzu Kontrol Ediniz...");
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    PagesLoginv2Component = __decorate([
        core_1.Component({
            selector: 'app-pages-loginv2',
            templateUrl: './pages-loginv2.component.html',
            styleUrls: ['./pages-loginv2.component.css']
        })
    ], PagesLoginv2Component);
    return PagesLoginv2Component;
}());
exports.PagesLoginv2Component = PagesLoginv2Component;
