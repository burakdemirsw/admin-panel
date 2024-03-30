"use strict";
exports.__esModule = true;
exports.NebimOrder_RM = exports.CargoBarcode_VM = exports.GetPackageStatus_MNG_Response = exports.CargoSetting = exports.CreateBarcode_MNG_Request = exports.CreatePackage_MNG_RR = exports.CreatePackage_MNG_Response = exports.Recipient_MNG = exports.OrderPieceListMNG = exports.Order_MNG = exports.CreatePackage_MNG_Request = exports.CreatePackage_MNG_RM = exports.BasketProductSummary = exports.OrderDetail = void 0;
var OrderDetail = /** @class */ (function () {
    function OrderDetail() {
    }
    return OrderDetail;
}());
exports.OrderDetail = OrderDetail;
var BasketProductSummary = /** @class */ (function () {
    function BasketProductSummary() {
    }
    return BasketProductSummary;
}());
exports.BasketProductSummary = BasketProductSummary;
var CreatePackage_MNG_RM = /** @class */ (function () {
    function CreatePackage_MNG_RM() {
    }
    return CreatePackage_MNG_RM;
}());
exports.CreatePackage_MNG_RM = CreatePackage_MNG_RM;
var CreatePackage_MNG_Request = /** @class */ (function () {
    function CreatePackage_MNG_Request(ri, od, ct) {
        var _this = this;
        this.orderPieceList = [];
        this.order = new Order_MNG();
        this.order.referenceId = ri;
        this.order.barcode = od.orderNumber;
        this.order.billOfLandingId = od.orderNumber;
        this.order.isCod = ct.isCOD;
        this.order.codAmount = ct.codAmount;
        this.order.packagingType = ct.packagingType;
        this.order.content = ct.content;
        this.order.paymentType = ct.shipmentServiceType;
        this.order.shipmentServiceType = 1;
        this.order.smsPreference1 = 0;
        this.order.smsPreference2 = 0;
        this.order.smsPreference3 = 0;
        this.order.deliveryType = 1;
        this.order.description = "BOĞAZİCİ DİŞ DEPOSU";
        this.order.marketPlaceShortCode = "";
        this.order.marketPlaceSaleCode = "";
        if (ct.packagingType === 4) {
            od.products.forEach(function (p) {
                var product = new OrderPieceListMNG();
                product.barcode = p.barcode == null ? "BARCODE" : p.itemCode;
                product.content = p.itemCode;
                product.desi = 1;
                product.kg = 1;
                _this.orderPieceList.push(product);
            });
        }
        else if (ct.packagingType === 3) {
            od.products.forEach(function (p) {
                var product = new OrderPieceListMNG();
                product.barcode = p.barcode == null ? "BARCODE" : p.itemCode;
                product.content = p.itemCode;
                product.desi = 2;
                product.kg = 2;
                _this.orderPieceList.push(product);
            });
        }
        else {
            od.products.forEach(function (p) {
                var product = new OrderPieceListMNG();
                product.barcode = p.barcode == null ? "BARCODE" : p.itemCode;
                product.content = p.itemCode;
                product.desi = 0;
                product.kg = 0;
                _this.orderPieceList.push(product);
            });
        }
        this.recipient = new Recipient_MNG();
        this.recipient.customerId = "";
        this.recipient.refCustomerId = "";
        this.recipient.cityCode = 0;
        this.recipient.districtCode = 0;
        this.recipient.businessPhoneNumber = "";
        this.recipient.taxOffice = "";
        this.recipient.taxNumber = "";
        this.recipient.homePhoneNumber = "";
        this.recipient.cityName = od.city;
        this.recipient.districtName = od.district;
        this.recipient.email = od.mail;
        this.recipient.address = od.address;
        this.recipient.fullName = od.customer;
        this.recipient.mobilePhoneNumber = od.phone;
    }
    return CreatePackage_MNG_Request;
}());
exports.CreatePackage_MNG_Request = CreatePackage_MNG_Request;
var Order_MNG = /** @class */ (function () {
    function Order_MNG() {
    }
    return Order_MNG;
}());
exports.Order_MNG = Order_MNG;
var OrderPieceListMNG = /** @class */ (function () {
    function OrderPieceListMNG() {
    }
    return OrderPieceListMNG;
}());
exports.OrderPieceListMNG = OrderPieceListMNG;
var Recipient_MNG = /** @class */ (function () {
    function Recipient_MNG() {
    }
    return Recipient_MNG;
}());
exports.Recipient_MNG = Recipient_MNG;
var CreatePackage_MNG_Response = /** @class */ (function () {
    function CreatePackage_MNG_Response() {
    }
    return CreatePackage_MNG_Response;
}());
exports.CreatePackage_MNG_Response = CreatePackage_MNG_Response;
var CreatePackage_MNG_RR = /** @class */ (function () {
    function CreatePackage_MNG_RR() {
    }
    return CreatePackage_MNG_RR;
}());
exports.CreatePackage_MNG_RR = CreatePackage_MNG_RR;
var CreateBarcode_MNG_Request = /** @class */ (function () {
    function CreateBarcode_MNG_Request() {
    }
    return CreateBarcode_MNG_Request;
}());
exports.CreateBarcode_MNG_Request = CreateBarcode_MNG_Request;
var CargoSetting = /** @class */ (function () {
    function CargoSetting(isCOD, packagingType, shipmentServiceType, content, orderDetail) {
        if (isCOD === 1) {
            this.isCOD = isCOD;
            this.codAmount = orderDetail.totalPrice;
            this.packagingType = packagingType;
            this.shipmentServiceType = shipmentServiceType;
            this.content = content;
        }
        else {
            this.isCOD = isCOD;
            this.codAmount = 0;
            this.packagingType = packagingType;
            this.shipmentServiceType = shipmentServiceType;
            this.content = content;
        }
    }
    return CargoSetting;
}());
exports.CargoSetting = CargoSetting;
var GetPackageStatus_MNG_Response = /** @class */ (function () {
    function GetPackageStatus_MNG_Response() {
    }
    return GetPackageStatus_MNG_Response;
}());
exports.GetPackageStatus_MNG_Response = GetPackageStatus_MNG_Response;
var CargoBarcode_VM = /** @class */ (function () {
    function CargoBarcode_VM() {
    }
    return CargoBarcode_VM;
}());
exports.CargoBarcode_VM = CargoBarcode_VM;
var NebimOrder_RM = /** @class */ (function () {
    function NebimOrder_RM() {
    }
    return NebimOrder_RM;
}());
exports.NebimOrder_RM = NebimOrder_RM;
