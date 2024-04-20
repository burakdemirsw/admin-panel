"use strict";
exports.__esModule = true;
exports.CreateBarcodeFromOrder_RM = exports.CreateBarcodeModel = void 0;
var CreateBarcodeModel = /** @class */ (function () {
    function CreateBarcodeModel() {
    }
    return CreateBarcodeModel;
}());
exports.CreateBarcodeModel = CreateBarcodeModel;
var CreateBarcodeFromOrder_RM = /** @class */ (function () {
    function CreateBarcodeFromOrder_RM(isPackage) {
        this.products = [];
        if (isPackage) {
            this.packageDescription = "Koli";
        }
        else {
            this.packageDescription = "Ürün";
        }
    }
    return CreateBarcodeFromOrder_RM;
}());
exports.CreateBarcodeFromOrder_RM = CreateBarcodeFromOrder_RM;
