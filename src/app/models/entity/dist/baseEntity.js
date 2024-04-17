"use strict";
exports.__esModule = true;
exports.BaseEntity = void 0;
var BaseEntity = /** @class */ (function () {
    function BaseEntity(id, createdDate, updatedDate) {
        if (updatedDate === void 0) { updatedDate = new Date(); }
        this.id = id;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
    }
    return BaseEntity;
}());
exports.BaseEntity = BaseEntity;
