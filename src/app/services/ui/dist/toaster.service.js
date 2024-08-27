"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ToasterService = void 0;
var core_1 = require("@angular/core");
var ToasterService = /** @class */ (function () {
    function ToasterService(messageService) {
        this.messageService = messageService;
    }
    ToasterService.prototype.success = function (message) {
        this.messageService.add({ severity: 'success', summary: 'İşlem Başarılı', detail: message, life: 1250, key: 'bc' });
    };
    ToasterService.prototype.error = function (message) {
        this.messageService.add({ severity: 'error', summary: 'İşlem Başarısız', detail: message, life: 1250, key: 'bc' });
    };
    ToasterService.prototype.warn = function (message) {
        this.messageService.add({ severity: 'error', summary: 'Kontrol Ediniz', detail: message, life: 1250, key: 'bc' });
    };
    ToasterService.prototype.info = function (message) {
        this.messageService.add({ severity: 'info', summary: 'Bilgilendirme', detail: message, life: 1250, key: 'bc' });
    };
    ToasterService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], ToasterService);
    return ToasterService;
}());
exports.ToasterService = ToasterService;
