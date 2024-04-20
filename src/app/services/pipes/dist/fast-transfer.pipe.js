"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FastTransferPipe = void 0;
var core_1 = require("@angular/core");
var FastTransferPipe = /** @class */ (function () {
    function FastTransferPipe() {
    }
    FastTransferPipe.prototype.transform = function (items, searchText, fieldNames) {
        if (!items)
            return [];
        if (!searchText)
            return items;
        searchText = searchText.toLowerCase();
        return items.filter(function (item) {
            for (var _i = 0, fieldNames_1 = fieldNames; _i < fieldNames_1.length; _i++) {
                var fieldName = fieldNames_1[_i];
                if (item[fieldName] && item[fieldName].toString().toLowerCase().includes(searchText)) {
                    return true;
                }
            }
            return false;
        });
    };
    FastTransferPipe = __decorate([
        core_1.Pipe({
            name: 'fastTransfer'
        })
    ], FastTransferPipe);
    return FastTransferPipe;
}());
exports.FastTransferPipe = FastTransferPipe;
