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
exports.AppComponent = void 0;
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var rxjs_1 = require("rxjs");
var AppComponent = /** @class */ (function () {
    function AppComponent(document, elementRef, _router) {
        var _this = this;
        this.document = document;
        this.elementRef = elementRef;
        this._router = _router;
        this.title = 'admindashboard';
        var bodyClassList = this.document.body.classList;
        var isMobile = window.innerWidth <= 768;
        this._router.events.pipe(rxjs_1.filter(function (event) { return event instanceof router_1.NavigationEnd; })).subscribe(function (event) {
            if (!bodyClassList.contains('toggle-sidebar')) {
                _this.sidebarToggle();
            }
            if (isMobile) {
                if (bodyClassList.contains('toggle-sidebar')) {
                    _this.sidebarToggle();
                }
            }
            // Burada istediğiniz işlemi yapabilirsiniz
        });
    }
    AppComponent.prototype.sidebarToggle = function () {
        //toggle sidebar function
        this.document.body.classList.toggle('toggle-sidebar');
    };
    AppComponent.prototype.ngOnInit = function () {
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "../assets/js/main.js";
        console.clear();
    };
    AppComponent.prototype.onClick = function (event) {
        var sidebar = document.getElementById('sidebar');
        var header = document.getElementById('header');
        var bodyClassList = this.document.body.classList;
        var isMobile = window.innerWidth <= 768;
        if ((sidebar && !sidebar.contains(event.target)) && (header && !header.contains(event.target))) {
            //   console.log('algılandı(3)');
            if (bodyClassList.contains('toggle-sidebar')) {
                bodyClassList.remove('toggle-sidebar');
            }
            if (!isMobile) {
                if (!bodyClassList.contains('toggle-sidebar')) {
                    // console.log('Pc de Farklı Yere Tıklandığı için Sidebar Kapandı');
                    bodyClassList.add('toggle-sidebar');
                }
            }
        }
    };
    __decorate([
        core_1.HostListener('document:click', ['$event'])
    ], AppComponent.prototype, "onClick");
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app-root',
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.css']
        }),
        __param(0, core_1.Inject(common_1.DOCUMENT))
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
