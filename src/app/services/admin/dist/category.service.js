"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CategoryService = void 0;
var core_1 = require("@angular/core");
var CategoryService = /** @class */ (function () {
    function CategoryService(toasterService, httpService) {
        this.toasterService = toasterService;
        this.httpService = httpService;
    }
    CategoryService.prototype.addCategory = function (model) {
        var _this = this;
        this.httpService.post({
            controller: 'Categories'
        }, model)
            .subscribe({
            next: function (result) {
                _this.toasterService.success('Success');
                window.location.reload();
            },
            error: function (err) {
                if (err.status === 400) {
                    _this.toasterService.warn(err.error);
                }
                else {
                    _this.toasterService.warn(err.message);
                }
            }
        });
        return true;
    };
    CategoryService.prototype.deleteCategory = function (id) {
        var _this = this;
        this.httpService["delete"]({
            controller: 'Categories'
        }, id)
            .subscribe({
            next: function (result) {
                _this.toasterService.success('Success');
                window.location.reload();
            },
            error: function (err) {
                if (err.status === 400) {
                    _this.toasterService.warn(err.error);
                }
                else {
                    _this.toasterService.warn(err.message);
                }
            }
        });
        return true;
    };
    CategoryService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], CategoryService);
    return CategoryService;
}());
exports.CategoryService = CategoryService;
