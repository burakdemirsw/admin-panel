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
exports.GeneralService = void 0;
var core_1 = require("@angular/core");
var GeneralService = /** @class */ (function () {
    function GeneralService(spinnerService, router, toasterService, datePipe) {
        this.spinnerService = spinnerService;
        this.router = router;
        this.toasterService = toasterService;
        this.datePipe = datePipe;
    }
    GeneralService.prototype.focusNextInput = function (nextInputId) {
        var nextInput = document.getElementById(nextInputId);
        if (nextInput) {
            nextInput.focus();
        }
    };
    GeneralService.prototype.isNullOrEmpty = function (value) {
        return value === null || value === undefined || value.trim() === '';
    };
    GeneralService.prototype.beep = function () {
        var audio = new Audio('assets/music/qrSound.mp3');
        audio.play();
    };
    GeneralService.prototype.beep2 = function () {
        var audio = new Audio('assets/music/qrSound.mp3');
        audio.play();
    };
    GeneralService.prototype.beep3 = function () {
        var audio = new Audio('assets/music/delete.mp3');
        audio.play();
    };
    GeneralService.prototype.beep4 = function () {
        var audio = new Audio('assets/music/congra.mp3');
        audio.play();
    };
    GeneralService.prototype.waitAndNavigate = function (message, url) {
        var _this = this;
        this.beep();
        this.spinnerService.show();
        setTimeout(function () {
            _this.spinnerService.hide();
            _this.router.navigate(['/' + url]);
            _this.toasterService.success(message);
        }, 1000);
    };
    GeneralService.prototype.generateGUID = function () {
        return __awaiter(this, void 0, Promise, function () {
            var dt, uuid;
            return __generator(this, function (_a) {
                dt = new Date().getTime();
                uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = (dt + Math.random() * 16) % 16 | 0;
                    dt = Math.floor(dt / 16);
                    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
                });
                return [2 /*return*/, uuid.toUpperCase()];
            });
        });
    };
    GeneralService.prototype.isGuid = function (text) {
        // Bir GUID'nin genellikle belirli bir deseni vardır
        var guidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        // Metni belirtilen desenle karşılaştırarak kontrol et
        return guidPattern.test(text);
    };
    GeneralService.prototype.whichRowIsInvalid = function (form) {
        var invalidFields = '';
        Object.keys(form.controls).forEach(function (controlName) {
            var control = form.get(controlName);
            if (control && control.invalid) {
                invalidFields += controlName + "\n";
            }
        });
        if (invalidFields) {
            this.toasterService.error("Form Alan\u0131 Ge\u00E7ersiz:\n" + invalidFields);
        }
    };
    GeneralService.prototype.getCurrentDatetime = function () {
        var datetime = this.datePipe.transform(new Date().getHours() + 3, 'yyyy-MM-dd HH:mm:ss');
        return datetime;
    };
    GeneralService.prototype.getCurrentDatetime_2 = function () {
        // Şu anki zamanı al
        var currentDate = new Date();
        // 3 saat ekle asdsasdsa
        currentDate.setHours(currentDate.getHours() + 3);
        // İstenilen formata çevir
        var datetimeString = this.datePipe.transform(currentDate, 'yyyy-MM-dd HH:mm:ss');
        // Yeni bir Date nesnesi olarak döndür
        return new Date(datetimeString);
    };
    GeneralService.prototype.formatPhoneNumber = function (value) {
        // Sadece sayıları bırak, mevcut formatlama karakterlerini temizle
        var newVal = value.replace(/\D/g, ''); // Boşluk, parantez, tire vb. karakterleri kaldır
        // Eğer boşsa hemen boş döndür
        if (newVal.length === 0) {
            return ''; // Boş değer durumu
        }
        // Maksimum 10 hane (sadece rakamlar) sınırı
        if (newVal.length > 10) {
            newVal = newVal.substring(0, 10); // Sadece ilk 10 rakamı al
        }
        // Eğer ilk hane 0 ise, 0'ı sil
        if (newVal.startsWith('0')) {
            newVal = newVal.substring(1); // İlk haneyi sil
            this.toasterService.info('Lütfen 5XX XXX XX XX formatında numarayı giriniz');
        }
        // Telefon numarasını 3 3 2 2 formatında boşluklarla ayır
        if (newVal.length <= 3) {
            newVal = newVal.replace(/^(\d{0,3})/, '$1'); // İlk 3 hane
        }
        else if (newVal.length <= 6) {
            newVal = newVal.replace(/^(\d{0,3})(\d{0,3})/, '$1 $2'); // 3+3 formatı
        }
        else if (newVal.length <= 8) {
            newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,2})/, '$1 $2 $3'); // 3+3+2 formatı
        }
        else if (newVal.length <= 10) {
            newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/, '$1 $2 $3 $4'); // 3+3+2+2 formatı
        }
        return newVal;
    };
    GeneralService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], GeneralService);
    return GeneralService;
}());
exports.GeneralService = GeneralService;
