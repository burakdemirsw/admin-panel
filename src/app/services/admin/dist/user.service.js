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
exports.UserService = void 0;
var core_1 = require("@angular/core");
var userRegister_VM_1 = require("src/app/models/model/user/userRegister_VM");
var UserService = /** @class */ (function () {
    function UserService(router, client, toasterService) {
        this.router = router;
        this.client = client;
        this.toasterService = toasterService;
    }
    UserService.prototype.register = function (model) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client
                            .post({ controller: "users/Register" }, model)
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            // console.log(response);
                            return [2 /*return*/, true];
                        }
                        else {
                            // console.log("Kayıt Başarısız");
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.update = function (model) {
        return __awaiter(this, void 0, Promise, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client
                            .post({ controller: "users/update" }, model)
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            // console.log(response);
                            return [2 /*return*/, true];
                        }
                        else {
                            // console.log("Güncelleme Başarısız");
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    //token ve rfToken Alır
    UserService.prototype.login = function (model) {
        return __awaiter(this, void 0, Promise, function () {
            var response, userClientInfoResponse, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client
                                .post({ controller: "users/login" }, model)
                                .toPromise()];
                    case 1:
                        response = _a.sent();
                        if (response) {
                            // console.log(response);
                        }
                        else {
                            // console.log("response alınamadı")
                        }
                        userClientInfoResponse = response;
                        // console.log("Çevirilen Model: " + userClientInfoResponse)
                        localStorage.setItem("accessToken", userClientInfoResponse.token.accessToken == null ? "" : userClientInfoResponse.token.accessToken);
                        localStorage.setItem("refreshToken", userClientInfoResponse.token.refreshToken == null ? "" : userClientInfoResponse.token.refreshToken);
                        localStorage.setItem("salesPersonCode", userClientInfoResponse.salesPersonCode == null ? "" : userClientInfoResponse.salesPersonCode);
                        localStorage.setItem("roleDescription", userClientInfoResponse.roleDescription == null ? "" : userClientInfoResponse.roleDescription);
                        localStorage.setItem("userId", userClientInfoResponse.userId.toString() == null ? "" : userClientInfoResponse.userId.toString());
                        localStorage.setItem("mail", userClientInfoResponse.mail.toString() == null ? "" : userClientInfoResponse.mail.toString());
                        localStorage.setItem("phoneNumber", userClientInfoResponse.phoneNumber.toString() == null ? "" : userClientInfoResponse.phoneNumber.toString());
                        localStorage.setItem("name", userClientInfoResponse.name.toString() == null ? "" : userClientInfoResponse.name.toString());
                        localStorage.setItem("surname", userClientInfoResponse.surname.toString() == null ? "" : userClientInfoResponse.surname.toString());
                        localStorage.setItem("currAccCode", userClientInfoResponse.surname.toString() == null ? "" : userClientInfoResponse.currAccCode.toString());
                        if (response) {
                            // console.log(response);
                            return [2 /*return*/, true];
                        }
                        else {
                            // console.log("Giriş Başarısız");
                            return [2 /*return*/, false];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        // console.log("Login:" + error)
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //rf token yeniler
    UserService.prototype.refreshToken = function (model) {
        return __awaiter(this, void 0, Promise, function () {
            var response, userClientInfoResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client
                            .post({ controller: 'Users/refresh-token' }, model)
                            .toPromise()];
                    case 1:
                        response = _a.sent();
                        userClientInfoResponse = response;
                        localStorage.setItem("accessToken", userClientInfoResponse.refreshTokenCommandResponse.token.accessToken);
                        localStorage.setItem("roleDescription", userClientInfoResponse.roleDescription.toString());
                        localStorage.setItem("refreshToken", userClientInfoResponse.refreshTokenCommandResponse.token.refreshToken);
                        localStorage.setItem("userId", userClientInfoResponse.userId.toString());
                        localStorage.setItem("mail", userClientInfoResponse.mail.toString());
                        localStorage.setItem("salesPersonCode", userClientInfoResponse.salesPersonCode.toString());
                        localStorage.setItem("phoneNumber", userClientInfoResponse.phoneNumber.toString());
                        localStorage.setItem("name", userClientInfoResponse.name.toString());
                        localStorage.setItem("surname", userClientInfoResponse.surname.toString());
                        localStorage.setItem("currAccCode", userClientInfoResponse.currAccCode.toString());
                        if (response) {
                            // console.log(response);
                            return [2 /*return*/, true];
                        }
                        else {
                            // console.log('Refresh Token Alınamadı');
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.getUsers = function (model) {
        return __awaiter(this, void 0, Promise, function () {
            var response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client
                                .post({ controller: "users/get-users" }, model)
                                .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2:
                        error_2 = _a.sent();
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.deleteUser = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var response, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client["delete"]({ controller: "users/delete-user" }, id)
                                .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2:
                        error_3 = _a.sent();
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.getUserClientInfoResponse = function () {
        try {
            var token = localStorage.getItem("accessToken");
            if (token) {
                var model = new userRegister_VM_1.UserClientInfoResponse();
                model.token = new userRegister_VM_1.Token();
                model.token.accessToken = token;
                model.token.refreshToken = localStorage.getItem("refreshToken");
                model.userId = Number(localStorage.getItem("userId"));
                model.mail = localStorage.getItem("mail");
                model.salesPersonCode = localStorage.getItem("salesPersonCode");
                model.mail = localStorage.getItem("phoneNumber");
                model.mail = localStorage.getItem("name");
                model.mail = localStorage.getItem("surname");
                model.mail = localStorage.getItem("currAccCode");
                model.roleDescription = localStorage.getItem("roleDescription");
                return model;
            }
            else {
                return null;
            }
        }
        catch (error) {
            return null;
        }
    };
    UserService.prototype.confirmPasswordToken = function (token) {
        return __awaiter(this, void 0, Promise, function () {
            var response, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client
                                .get({ controller: "users/confirm-password-token" }, token.toString())
                                .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2:
                        error_4 = _a.sent();
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.sendPasswordResetEmail = function (mail) {
        return __awaiter(this, void 0, Promise, function () {
            var response, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client
                                .get({ controller: "users/send-password-reset-email" }, mail)
                                .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2:
                        error_5 = _a.sent();
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.passwordReset = function (model) {
        return __awaiter(this, void 0, Promise, function () {
            var response, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client
                                .post({ controller: "users/password-reset" }, model)
                                .toPromise()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2:
                        error_6 = _a.sent();
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.logOut = function () {
        localStorage.clear();
        this.router.navigate(["/pages-loginv2"]);
    };
    UserService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
