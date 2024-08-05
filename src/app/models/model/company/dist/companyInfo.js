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
exports.MailInfo = exports.ReportInfo = exports.MarketPlaceInfo = exports.NebimInfo = exports.DatabaseInfo = exports.CargoInfo = exports.CompanyInfo = void 0;
var baseEntity_1 = require("../../entity/baseEntity");
var CompanyInfo = /** @class */ (function (_super) {
    __extends(CompanyInfo, _super);
    function CompanyInfo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CompanyInfo;
}(baseEntity_1.BaseEntity));
exports.CompanyInfo = CompanyInfo;
var CargoInfo = /** @class */ (function (_super) {
    __extends(CargoInfo, _super);
    function CargoInfo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CargoInfo;
}(baseEntity_1.BaseEntity));
exports.CargoInfo = CargoInfo;
var DatabaseInfo = /** @class */ (function (_super) {
    __extends(DatabaseInfo, _super);
    function DatabaseInfo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DatabaseInfo;
}(baseEntity_1.BaseEntity));
exports.DatabaseInfo = DatabaseInfo;
var NebimInfo = /** @class */ (function (_super) {
    __extends(NebimInfo, _super);
    function NebimInfo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return NebimInfo;
}(baseEntity_1.BaseEntity));
exports.NebimInfo = NebimInfo;
var MarketPlaceInfo = /** @class */ (function (_super) {
    __extends(MarketPlaceInfo, _super);
    function MarketPlaceInfo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MarketPlaceInfo;
}(baseEntity_1.BaseEntity));
exports.MarketPlaceInfo = MarketPlaceInfo;
var ReportInfo = /** @class */ (function (_super) {
    __extends(ReportInfo, _super);
    function ReportInfo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ReportInfo;
}(baseEntity_1.BaseEntity));
exports.ReportInfo = ReportInfo;
var MailInfo = /** @class */ (function (_super) {
    __extends(MailInfo, _super);
    function MailInfo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MailInfo;
}(baseEntity_1.BaseEntity));
exports.MailInfo = MailInfo;
