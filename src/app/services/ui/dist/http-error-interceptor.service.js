"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Error = exports.HttpErrorInterceptor = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var HttpErrorInterceptor = /** @class */ (function () {
    function HttpErrorInterceptor(toasterService, spinnerService) {
        this.toasterService = toasterService;
        this.spinnerService = spinnerService;
    }
    HttpErrorInterceptor.prototype.intercept = function (request, next) {
        var _this = this;
        if (request.url.includes('get-customer-list-2')) {
            return next.handle(request);
        }
        this.spinnerService.show();
        return next.handle(request).pipe(operators_1.catchError(function (error) {
            var er = new Error();
            er.statusCode = error.error.StatusCode;
            er.message = error.error.Message;
            er.title = error.error.Title;
            er.innerException = error.error.InnerException;
            if (er.statusCode >= 400 && er.statusCode <= 500 || er.statusCode === 0) {
                //this.toasterService.warn(` ${er.title + "-" + er.message}`);
                console.error(" " + (er.title + "-" + er.message));
            }
            else if (error.status >= 500) {
                //  this.toasterService.warn(`Sunucu Hatası: ${error.message}`);
                console.error("Sunucu Hatas\u0131: " + error.message);
            }
            // this.toasterService.warn(`Sunucu Hatası: ${error.message}`);
            return rxjs_1.throwError(error);
        }), operators_1.finalize(function () {
            _this.spinnerService.hide(); // İstek tamamlandığında spinner'ı gizle
        }));
    };
    HttpErrorInterceptor = __decorate([
        core_1.Injectable()
    ], HttpErrorInterceptor);
    return HttpErrorInterceptor;
}());
exports.HttpErrorInterceptor = HttpErrorInterceptor;
var Error = /** @class */ (function () {
    function Error() {
    }
    return Error;
}());
exports.Error = Error;
