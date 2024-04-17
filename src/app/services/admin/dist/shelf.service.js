"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ShelfService = void 0;
var core_1 = require("@angular/core");
var ShelfService = /** @class */ (function () {
    function ShelfService(toasterService, httpService) {
        this.toasterService = toasterService;
        this.httpService = httpService;
    }
    ShelfService.prototype.createShelf = function (model) {
        var _this = this;
        this.httpService.post({
            controller: 'Shelves/Add'
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
    ShelfService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], ShelfService);
    return ShelfService;
}());
exports.ShelfService = ShelfService;
