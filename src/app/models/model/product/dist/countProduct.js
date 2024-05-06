"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.CountProduct3 = exports.CountProduct2 = exports.CountProduct = void 0;
var CountProduct = /** @class */ (function () {
    function CountProduct(barcode, shelfNo, batchCode, quantity) {
        this.barcode = barcode;
        this.shelfNo = shelfNo;
        this.batchCode = batchCode;
        this.quantity = quantity;
    }
    return CountProduct;
}());
exports.CountProduct = CountProduct;
var CountProduct2 = /** @class */ (function (_super) {
    __extends(CountProduct2, _super);
    function CountProduct2(id, shelfNo, barcode, quantity, batchCode, office, officeTo, warehouse, warehouseTo, orderNo) {
        var _this = _super.call(this, barcode, shelfNo, batchCode, quantity) || this;
        _this.id = id;
        _this.office = office;
        _this.officeTo = officeTo;
        _this.warehouse = warehouse;
        _this.warehouseTo = warehouseTo;
        _this.orderNo = orderNo;
        return _this;
    }
    return CountProduct2;
}(CountProduct));
exports.CountProduct2 = CountProduct2;
var CountProduct3 = /** @class */ (function (_super) {
    __extends(CountProduct3, _super);
    function CountProduct3(shelfNo, barcode, quantity, batchCode, office, warehouseCode, isShelfBased, isShelfBased2) {
        var _this = _super.call(this, barcode, shelfNo, batchCode, quantity) || this;
        _this.shelfNo = shelfNo;
        _this.barcode = barcode;
        _this.quantity = quantity;
        _this.batchCode = batchCode;
        _this.office = office;
        _this.warehouseCode = warehouseCode;
        _this.isShelfBased = isShelfBased;
        _this.isShelfBased2 = isShelfBased2;
        return _this;
    }
    return CountProduct3;
}(CountProduct));
exports.CountProduct3 = CountProduct3;
