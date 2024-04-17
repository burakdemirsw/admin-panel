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
exports.Development_Raport = exports.DevelopmentTask_VM = exports.DevelopmentTask = exports.Development_RM = exports.Development = void 0;
var baseEntity_1 = require("../../entity/baseEntity");
var Development = /** @class */ (function (_super) {
    __extends(Development, _super);
    function Development(zone) {
        var _this = _super.call(this, 0, new Date(), new Date()) || this;
        _this.zone = zone;
        return _this;
    }
    return Development;
}(baseEntity_1.BaseEntity));
exports.Development = Development;
var Development_RM = /** @class */ (function () {
    function Development_RM() {
    }
    return Development_RM;
}());
exports.Development_RM = Development_RM;
var DevelopmentTask = /** @class */ (function (_super) {
    __extends(DevelopmentTask, _super);
    function DevelopmentTask(description, isCompleted, finishedDate, id, createdDate, updatedDate, header, developmentId) {
        var _this = _super.call(this, id, createdDate, updatedDate) || this;
        _this.developmentId = developmentId;
        _this.description = description;
        _this.isCompleted = isCompleted;
        _this.finishedDate = finishedDate;
        _this.header = header;
        return _this;
    }
    return DevelopmentTask;
}(baseEntity_1.BaseEntity));
exports.DevelopmentTask = DevelopmentTask;
var DevelopmentTask_VM = /** @class */ (function () {
    function DevelopmentTask_VM() {
    }
    return DevelopmentTask_VM;
}());
exports.DevelopmentTask_VM = DevelopmentTask_VM;
var Development_Raport = /** @class */ (function () {
    function Development_Raport() {
    }
    return Development_Raport;
}());
exports.Development_Raport = Development_Raport;
