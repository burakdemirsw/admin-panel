"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.HeaderService = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var HeaderService = /** @class */ (function () {
    function HeaderService(titleService) {
        this.titleService = titleService;
        this.pageTitleSource = new rxjs_1.BehaviorSubject('');
        this.currentPageTitle = this.pageTitleSource.asObservable();
    }
    HeaderService.prototype.updatePageTitle = function (title) {
        this.titleService.setTitle(title); // SEO title'ını günceller
        if (title.length > 25) {
            title = title.substring(0, 25) + '.';
        }
        this.pageTitleSource.next(title);
    };
    HeaderService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], HeaderService);
    return HeaderService;
}());
exports.HeaderService = HeaderService;
