"use strict";
exports.__esModule = true;
exports.SuggestedProduct = void 0;
var SuggestedProduct = /** @class */ (function () {
    function SuggestedProduct(itemCode, suggestedItemCode, suggestedItemInventory, priority) {
        this.itemCode = itemCode;
        this.suggestedItemCode = suggestedItemCode;
        this.suggestedItemInventory = suggestedItemInventory;
        this.priority = priority;
    }
    return SuggestedProduct;
}());
exports.SuggestedProduct = SuggestedProduct;
