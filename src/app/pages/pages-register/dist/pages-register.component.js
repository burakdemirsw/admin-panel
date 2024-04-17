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
exports.PagesRegisterComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var userRegister_VM_1 = require("src/app/models/model/user/userRegister_VM");
var PagesRegisterComponent = /** @class */ (function () {
    function PagesRegisterComponent(generalService, formBuilder, userService, router, alertifyService, httpClientService, activatedRoute) {
        this.generalService = generalService;
        this.formBuilder = formBuilder;
        this.userService = userService;
        this.router = router;
        this.alertifyService = alertifyService;
        this.httpClientService = httpClientService;
        this.activatedRoute = activatedRoute;
        this.isUpdate = false;
        this.userList = [];
        this.salesPersonModels = [];
        this.salesPersonModelList = [];
        this.roleDescriptions = [{ role: "Admin" }, { role: "Salesman" }, { role: "Test User" }];
    }
    PagesRegisterComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.formGenerator();
                        return [4 /*yield*/, this.getSalesPersonModels()];
                    case 1:
                        _a.sent();
                        this.activatedRoute.params.subscribe(function (params) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!params['userId']) return [3 /*break*/, 2];
                                        this.isUpdate = true;
                                        return [4 /*yield*/, this.findUser(Number(params['userId']))];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        }); });
                        return [2 /*return*/];
                }
            });
        });
    };
    PagesRegisterComponent.prototype.findUser = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.userService.getUsers(new userRegister_VM_1.GetUserFilter(userId))];
                    case 1:
                        _a.userList = _b.sent();
                        if (this.userList.length > 0) {
                            this.updateUserModal(this.userList[0]);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    PagesRegisterComponent.prototype.updateUserModal = function (registerModel) {
        if (registerModel) {
            this.registerForm.get("firstName").setValue(registerModel.firstName);
            this.registerForm.get("lastName").setValue(registerModel.lastName);
            this.registerForm.get("email").setValue(registerModel.email);
            // this.registerForm.get("password").setValue(registerModel.password);
            // this.registerForm.get("confirmPassword").setValue(registerModel.password);
            this.registerForm.get("phoneNumber").setValue(registerModel.phoneNumber);
            this.registerForm.get("salesPersonCode").setValue(registerModel.salesPersonCode);
            var salesPerson = this.salesPersonModels.find(function (sp) { return sp.salespersonCode === registerModel.salesPersonCode; });
            this.selectedPerson = { name: salesPerson.firstLastName, code: registerModel.salesPersonCode };
            this.salesPersonModelList.push(this.selectedPerson);
        }
        else {
            this.registerForm.reset();
        }
    };
    PagesRegisterComponent.prototype.getSalesPersonModels = function () {
        return __awaiter(this, void 0, Promise, function () {
            var _a, error_1, error_2;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        _a = this;
                        return [4 /*yield*/, this.httpClientService
                                .get({
                                controller: 'Order/GetSalesPersonModels'
                            })
                                .toPromise()];
                    case 2:
                        _a.salesPersonModels = _b.sent();
                        this.salesPersonModels.forEach(function (c) {
                            var color = { name: c.firstLastName + " " + ("" + c.salespersonCode), code: c.salespersonCode };
                            _this.salesPersonModelList.push(color);
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        this.alertifyService.error(error_1.message);
                        return [2 /*return*/, null];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_2 = _b.sent();
                        this.alertifyService.error(error_2.message);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    PagesRegisterComponent.prototype.formGenerator = function () {
        this.registerForm = this.formBuilder.group({
            firstName: [null, forms_1.Validators.required],
            lastName: [null, forms_1.Validators.required],
            email: [{ value: null, disabled: false }, [forms_1.Validators.required, forms_1.Validators.email]],
            phoneNumber: [null, forms_1.Validators.required],
            salesPersonCode: [null, forms_1.Validators.required],
            password: [null],
            confirmPassword: [null],
            gender: ["Erkek"],
            roleDescription: [null]
        });
    };
    PagesRegisterComponent.prototype.submitForm = function () {
        return __awaiter(this, void 0, void 0, function () {
            var model, response, model, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.isUpdate) return [3 /*break*/, 6];
                        if (!this.registerForm.valid) return [3 /*break*/, 4];
                        if (!(this.registerForm.value.password ===
                            this.registerForm.value.confirmPassword)) return [3 /*break*/, 2];
                        model = {
                            id: 0,
                            firstName: this.registerForm.value.firstName,
                            lastName: this.registerForm.value.lastName,
                            password: this.registerForm.value.password,
                            salesPersonCode: this.registerForm.value.salesPersonCode.code,
                            email: this.registerForm.value.email,
                            phoneNumber: this.registerForm.value.phoneNumber,
                            gender: this.registerForm.value.gender,
                            roleDescription: this.registerForm.value.roleDescription.role
                        };
                        return [4 /*yield*/, this.userService.register(model)];
                    case 1:
                        response = _a.sent();
                        if (response == true) {
                            this.generalService.waitAndNavigate("İşlem Başaılı: " + "Kullanıcı Sisteme Eklendi", "user-list");
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        this.alertifyService.error("Şifreler Uyuşmuyor");
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        this.generalService.whichRowIsInvalid(this.registerForm);
                        _a.label = 5;
                    case 5: return [3 /*break*/, 10];
                    case 6:
                        if (!this.registerForm.valid) return [3 /*break*/, 10];
                        if (!(this.registerForm.value.password ===
                            this.registerForm.value.confirmPassword)) return [3 /*break*/, 8];
                        model = {
                            id: this.userList[0].id,
                            firstName: this.registerForm.value.firstName,
                            lastName: this.registerForm.value.lastName,
                            password: this.registerForm.value.password,
                            salesPersonCode: this.registerForm.value.salesPersonCode.code,
                            email: this.registerForm.value.email,
                            phoneNumber: this.registerForm.value.phoneNumber,
                            gender: this.registerForm.value.gender,
                            roleDescription: this.registerForm.value.roleDescription.role
                        };
                        return [4 /*yield*/, this.userService.update(model)];
                    case 7:
                        response = _a.sent();
                        if (response == true) {
                            // this.router.navigate(['/login']);
                            this.generalService.waitAndNavigate("İşlem Başaılı: " + "Kullanıcı Güncellendi", "user-list");
                        }
                        return [3 /*break*/, 9];
                    case 8:
                        this.alertifyService.error("Şifreler Uyuşmuyor");
                        _a.label = 9;
                    case 9: return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    PagesRegisterComponent = __decorate([
        core_1.Component({
            selector: 'app-pages-register',
            templateUrl: './pages-register.component.html',
            styleUrls: ['./pages-register.component.css']
        })
    ], PagesRegisterComponent);
    return PagesRegisterComponent;
}());
exports.PagesRegisterComponent = PagesRegisterComponent;
