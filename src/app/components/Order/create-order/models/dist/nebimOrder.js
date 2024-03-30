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
exports.ClientOrderBasketItem = exports.ClientOrder = exports.ClientOrder_DTO = exports.OrdersViaInternetInfo = exports.Payment = exports.ITAttribute = exports.Line_3 = exports.Line_2 = exports.Line = exports.Discount = exports.NebimInvoice = exports.NebimOrder_2 = exports.NebimOrder = exports.CheckCustomerModel = exports.CheckOrderModel = void 0;
var CheckOrderModel = /** @class */ (function () {
    function CheckOrderModel() {
    }
    return CheckOrderModel;
}());
exports.CheckOrderModel = CheckOrderModel;
var CheckCustomerModel = /** @class */ (function () {
    function CheckCustomerModel() {
    }
    return CheckCustomerModel;
}());
exports.CheckCustomerModel = CheckCustomerModel;
var NebimOrder = /** @class */ (function () {
    // discounts: Discount[];
    // payments: Payment[];
    function NebimOrder(discountPercentage, customerDesc, currAccCode, orderNo, formValue, selectedProducts, salesPersonCode, taxTypeCode) {
        var _this = this;
        this.discounts = [];
        this.modelType = 5;
        this.posTerminalID = 1;
        this.shipmentMethodCode = 2;
        this.isCompleted = true;
        this.isSalesViaInternet = false;
        this.isCreditSale = true;
        this.taxTypeCode = taxTypeCode;
        this.deliveryCompanyCode = "MNG";
        this.lines = [];
        // this.discounts = [];
        // this.payments = [];
        //ÖDEME KAPATILDI                        // this.ordersViaInternetInfo = new OrdersViaInternetInfo();
        //ÖDEME KAPATILDI                           // this.ordersViaInternetInfo.paymentDate = new Date().toUTCString();
        //ÖDEME KAPATILDI                           // this.ordersViaInternetInfo.sendDate = new Date().toUTCString();
        //ÖDEME KAPATILDI                           // this.ordersViaInternetInfo.salesURL = "www.davye.com";
        //ÖDEME KAPATILDI                          // this.ordersViaInternetInfo.paymentAgent = "";
        //ÖDEME KAPATILDI                          // this.ordersViaInternetInfo.paymentTypeCode = 2;
        //ÖDEME KAPATILDI                          // this.ordersViaInternetInfo.paymentTypeDescription = "Kredi Kartı"
        // if (payment.paymentType === "1") {
        //   this.ordersViaInternetInfo.paymentTypeDescription = "PAYTR"
        //   this.ordersViaInternetInfo.paymentTypeCode = 2
        // } else if (payment.paymentType === "2") {
        //   this.ordersViaInternetInfo.paymentTypeDescription = "NAKİT"
        //   this.ordersViaInternetInfo.paymentTypeCode = 1
        // } else if (payment.paymentType === "4") {
        //   this.ordersViaInternetInfo.paymentTypeDescription = "HAVALE"
        //   this.ordersViaInternetInfo.paymentTypeCode = 4
        // }
        this.customerCode = currAccCode;
        this.internalDescription = orderNo;
        this.orderDate = new Date().toUTCString();
        this.officeCode = "M";
        this.warehouseCode = "MD";
        this.documentNumber = orderNo;
        this.description = customerDesc;
        selectedProducts.forEach(function (p) {
            var line = new Line();
            line.usedBarcode = p.barcode;
            line.salesPersonCode = salesPersonCode;
            line.priceVI = p.price;
            line.qty1 = p.quantity;
            line.itemCode = p.itemCode;
            _this.lines.push(line);
        });
        this.discounts.push(new Discount(discountPercentage));
    }
    return NebimOrder;
}());
exports.NebimOrder = NebimOrder;
var NebimOrder_2 = /** @class */ (function () {
    // discounts: Discount[];
    // payments: Payment[];
    function NebimOrder_2(discountPercentage, customerDesc, currAccCode, orderNo, formValue, selectedProducts, salesPersonCode, taxTypeCode) {
        var _this = this;
        this.discounts = [];
        this.modelType = 5;
        this.posTerminalID = 1;
        this.shipmentMethodCode = 2;
        this.isCompleted = true;
        this.isSalesViaInternet = false;
        this.isCreditSale = true;
        this.taxTypeCode = taxTypeCode;
        this.deliveryCompanyCode = "MNG";
        this.lines = [];
        this.customerCode = currAccCode;
        this.internalDescription = orderNo;
        this.orderDate = new Date().toUTCString();
        this.officeCode = "M";
        this.warehouseCode = "MD";
        this.documentNumber = orderNo;
        this.description = customerDesc;
        this.discounts.push(new Discount(discountPercentage));
        selectedProducts.forEach(function (p) {
            var line = new Line_2();
            line.usedBarcode = p.barcode;
            line.salesPersonCode = salesPersonCode;
            line.priceVI = p.price;
            line.qty1 = p.quantity;
            line.itemCode = p.itemCode;
            line.batchCode = p.batchCode;
            var attribute = new ITAttribute();
            attribute.attributeCode = p.shelfNo;
            line.iTattributes.push(attribute);
            _this.lines.push(line);
        });
        // this.payments.push(payment)
    }
    return NebimOrder_2;
}());
exports.NebimOrder_2 = NebimOrder_2;
var NebimInvoice = /** @class */ (function () {
    // payments: Payment[];
    function NebimInvoice(discountPercentage, exchangeRate, docCurrencyCode, customerDesc, currAccCode, orderNo, formValue, selectedProducts, salesPersonCode, taxTypeCode, addressId) {
        var _this = this;
        this.discounts = [];
        this.modelType = 7;
        this.invoiceNumber = "";
        this.eMailAddress = "";
        this.companyCode = 1;
        this.shippingPostalAddressID = addressId;
        this.billingPostalAddressID = addressId;
        this.docCurrencyCode = docCurrencyCode;
        this.posTerminalID = 1;
        this.shipmentMethodCode = 2;
        this.isCompleted = true;
        // this.isSalesViaInternet = false;
        this.isCreditSale = true;
        this.isOrderBase = true;
        this.taxTypeCode = taxTypeCode;
        this.lines = [];
        this.customerCode = currAccCode;
        this.internalDescription = orderNo;
        this.invoiceDate = new Date().toUTCString();
        this.officeCode = "M";
        this.warehouseCode = "MD";
        this.discounts.push(new Discount(discountPercentage));
        // this.documentNumber = orderNo;
        this.description = customerDesc;
        selectedProducts.forEach(function (p) {
            var line = new Line_3();
            if (exchangeRate != 1) {
                line.price = p.price / exchangeRate;
            }
            else {
                line.price = p.price;
            }
            line.usedBarcode = p.barcode;
            line.salesPersonCode = salesPersonCode;
            line.priceVI = null;
            line.qty1 = p.quantity;
            line.itemCode = p.itemCode;
            line.batchCode = p.batchCode;
            var attribute = new ITAttribute();
            attribute.attributeCode = p.shelfNo;
            line.iTattributes.push(attribute);
            _this.lines.push(line);
        });
        // this.payments.push(payment)
    }
    return NebimInvoice;
}());
exports.NebimInvoice = NebimInvoice;
var Discount = /** @class */ (function () {
    function Discount(value) {
        this.discountTypeCode = 1;
        this.value = value;
        this.isPercentage = true;
        this.discountReasonCode = "1";
    }
    return Discount;
}());
exports.Discount = Discount;
var Line = /** @class */ (function () {
    function Line() {
    }
    return Line;
}());
exports.Line = Line;
var Line_2 = /** @class */ (function (_super) {
    __extends(Line_2, _super);
    function Line_2() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.iTattributes = [];
        return _this;
    }
    return Line_2;
}(Line));
exports.Line_2 = Line_2;
var Line_3 = /** @class */ (function (_super) {
    __extends(Line_3, _super);
    function Line_3() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Line_3;
}(Line_2));
exports.Line_3 = Line_3;
var ITAttribute = /** @class */ (function () {
    function ITAttribute() {
        this.attributeTypeCode = 1;
    }
    return ITAttribute;
}());
exports.ITAttribute = ITAttribute;
var Payment = /** @class */ (function () {
    function Payment() {
        this.installmentCount = 1;
    }
    return Payment;
}());
exports.Payment = Payment;
var OrdersViaInternetInfo = /** @class */ (function () {
    function OrdersViaInternetInfo() {
    }
    return OrdersViaInternetInfo;
}());
exports.OrdersViaInternetInfo = OrdersViaInternetInfo;
var ClientOrder_DTO = /** @class */ (function () {
    function ClientOrder_DTO() {
    }
    return ClientOrder_DTO;
}());
exports.ClientOrder_DTO = ClientOrder_DTO;
var ClientOrder = /** @class */ (function () {
    function ClientOrder() {
        this.createdDate = new Date();
        this.isCompleted = false;
    }
    return ClientOrder;
}());
exports.ClientOrder = ClientOrder;
var ClientOrderBasketItem = /** @class */ (function () {
    function ClientOrderBasketItem() {
        this.createdDate = new Date();
    }
    return ClientOrderBasketItem;
}());
exports.ClientOrderBasketItem = ClientOrderBasketItem;
