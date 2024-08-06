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
exports.MenuItem = exports.MenuInfo = exports.Info = exports.NebimUserInfo = exports.PaymentInfo = exports.MailInfo = exports.ReportInfo = exports.MarketPlaceInfo = exports.NebimInfo = exports.DatabaseInfo = exports.CargoInfo = exports.CompanyInfo = void 0;
var baseEntity_1 = require("../../entity/baseEntity");
var CompanyInfo = /** @class */ (function (_super) {
    __extends(CompanyInfo, _super);
    function CompanyInfo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CompanyInfo;
}(baseEntity_1.BaseEntity));
exports.CompanyInfo = CompanyInfo;
var CargoInfo = /** @class */ (function () {
    function CargoInfo() {
    }
    return CargoInfo;
}());
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
var PaymentInfo = /** @class */ (function () {
    function PaymentInfo() {
    }
    return PaymentInfo;
}());
exports.PaymentInfo = PaymentInfo;
var NebimUserInfo = /** @class */ (function (_super) {
    __extends(NebimUserInfo, _super);
    function NebimUserInfo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return NebimUserInfo;
}(baseEntity_1.BaseEntity));
exports.NebimUserInfo = NebimUserInfo;
var Info = /** @class */ (function () {
    function Info() {
    }
    return Info;
}());
exports.Info = Info;
var MenuInfo = /** @class */ (function () {
    function MenuInfo() {
    }
    return MenuInfo;
}());
exports.MenuInfo = MenuInfo;
var MenuItem = /** @class */ (function () {
    function MenuItem() {
    }
    return MenuItem;
}());
exports.MenuItem = MenuItem;
