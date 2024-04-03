"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.HeaderComponent = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var HeaderComponent = /** @class */ (function () {
    function HeaderComponent(userService, document, router, sessionService) {
        this.userService = userService;
        this.document = document;
        this.router = router;
        this.sessionService = sessionService;
    }
    HeaderComponent.prototype.ngOnInit = function () {
        var userName = localStorage.getItem('name') + " " + localStorage.getItem('surname');
        if (userName) {
            this.userName = userName;
        }
    };
    HeaderComponent.prototype.sidebarToggle = function () {
        //toggle sidebar function
        this.document.body.classList.toggle('toggle-sidebar');
    };
    HeaderComponent.prototype.logOut = function () {
        this.userService.logOut();
    };
    HeaderComponent = __decorate([
        core_1.Component({
            selector: 'app-header',
            templateUrl: './header.component.html',
            styleUrls: ['./header.component.css']
        }),
        __param(1, core_1.Inject(common_1.DOCUMENT))
    ], HeaderComponent);
    return HeaderComponent;
}());
exports.HeaderComponent = HeaderComponent;
