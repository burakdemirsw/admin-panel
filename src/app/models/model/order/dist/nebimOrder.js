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
exports.ClientOrderBasketItem = exports.ClientOrder = exports.ClientOrder_DTO = exports.OrdersViaInternetInfo = exports.Payment = exports.ITAttribute = exports.Line_3 = exports.Line_2 = exports.Line = exports.Discount = exports.NebimInvoiceResponse = exports.NebimInvoice = exports.NebimOrder_2 = exports.NebimOrder = exports.CheckCustomerModel = exports.CheckOrderModel = void 0;
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
    function NebimOrder(orderNumber, exchangeRate, discountRate1, discountRate2, customerDesc, currAccCode, orderNo, formValue, selectedProducts, salesPersonCode, taxTypeCode, subCurrAccId) {
        var _this = this;
        this.discounts = [];
        this.orderNumber = orderNumber;
        this.modelType = 5;
        this.posTerminalID = 1;
        this.shipmentMethodCode = 2;
        this.isCompleted = true;
        this.isSalesViaInternet = false;
        this.isCreditSale = true;
        this.taxTypeCode = taxTypeCode;
        this.deliveryCompanyCode = "MNG";
        this.lines = [];
        this.exchangeRate = exchangeRate;
        this.customerCode = currAccCode;
        this.internalDescription = orderNo;
        this.description = customerDesc;
        this.orderDate = new Date().toUTCString();
        this.officeCode = "M";
        this.warehouseCode = "MD";
        this.subCurrAccID = subCurrAccId;
        this.documentNumber = orderNo;
        selectedProducts.forEach(function (p) {
            var line = new Line();
            line.usedBarcode = p.barcode;
            line.salesPersonCode = salesPersonCode;
            if (_this.taxTypeCode == 0) { //standart ise
                if (exchangeRate != 1) { //dövizli ise
                    line.priceVI = null;
                    line.price = parseFloat((p.totalPrice / exchangeRate).toFixed(2));
                }
                else { //dövizli değilse
                    line.priceVI = null;
                    line.price = parseFloat(p.discountedPrice.toFixed(2));
                }
            }
            else if (_this.taxTypeCode == 5) {
                if (exchangeRate != 1) { //dövizli ise
                    line.priceVI = parseFloat((p.totalPrice / exchangeRate).toFixed(2));
                    line.price = parseFloat((p.totalPrice / exchangeRate).toFixed(2));
                }
                else { //dövizli değilse
                    line.priceVI = parseFloat((p.totalPrice).toFixed(2));
                    line.price = parseFloat((p.totalPrice).toFixed(2));
                }
            }
            else { //vergisiz ise
                if (exchangeRate != 1) { //dövizli ise
                    line.priceVI = parseFloat((p.totalPrice / exchangeRate).toFixed(2));
                    line.price = parseFloat((p.totalPrice / exchangeRate).toFixed(2));
                }
                else { //dövizli değilse
                    line.priceVI = parseFloat((p.totalPrice).toFixed(2));
                    line.price = parseFloat((p.totalPrice).toFixed(2));
                }
            }
            line.qty1 = p.quantity;
            line.itemCode = p.itemCode;
            _this.lines.push(line);
        });
        if (salesPersonCode == 'MD') {
            var payment = new Payment();
            payment.paymentType = "NAKIT";
            payment.code = "TRD";
            payment.currencyCode = "TRY";
            payment.amount = this.lines.reduce(function (a, b) { return a + (b.price) * b.qty1; }, 0);
        }
        // this.payments = [];
        this.discounts.push(new Discount(discountRate1, 1, "1", true));
        this.discounts.push(new Discount(discountRate2, 2, "2", false));
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
        this.discounts.push(new Discount(discountPercentage, 1, "1", true));
        selectedProducts.forEach(function (p) {
            var line = new Line_2();
            line.usedBarcode = p.barcode;
            line.salesPersonCode = salesPersonCode;
            line.priceVI = p.totalPrice;
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
    function NebimInvoice(discountPercentage, discountPercentage2, exchangeRate, docCurrencyCode, customerDesc, currAccCode, orderNo, formValue, selectedProducts, salesPersonCode, taxTypeCode, addressId, subCurrAccID, invoiceNumber) {
        var _this = this;
        this.discounts = [];
        this.modelType = 7;
        this.invoiceNumber = invoiceNumber;
        this.eMailAddress = "";
        this.companyCode = 1;
        this.shippingPostalAddressID = addressId;
        this.billingPostalAddressID = addressId;
        this.docCurrencyCode = docCurrencyCode;
        this.posTerminalID = 1;
        this.shipmentMethodCode = 2;
        this.isCompleted = true;
        this.isCreditSale = true;
        this.isOrderBase = true;
        this.taxTypeCode = taxTypeCode;
        this.lines = [];
        this.customerCode = currAccCode;
        this.subCurrAccID = subCurrAccID;
        this.internalDescription = orderNo;
        this.description = customerDesc;
        this.invoiceDate = new Date().toUTCString();
        this.officeCode = "M";
        this.warehouseCode = "MD";
        this.discounts.push(new Discount(discountPercentage, 1, "1", true));
        this.discounts.push(new Discount(discountPercentage2, 2, "2", false));
        // this.documentNumber = orderNo;
        selectedProducts.forEach(function (p) {
            var line = new Line_3();
            if (exchangeRate != 1) {
                line.price = parseFloat((p.totalPrice / exchangeRate).toFixed(2));
            }
            else {
                line.price = parseFloat((p.totalPrice).toFixed(2));
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
var NebimInvoiceResponse = /** @class */ (function () {
    function NebimInvoiceResponse() {
    }
    return NebimInvoiceResponse;
}());
exports.NebimInvoiceResponse = NebimInvoiceResponse;
var Discount = /** @class */ (function () {
    function Discount(value, discountTypeCode, discountReasonCode, isPercemtage) {
        this.discountTypeCode = discountTypeCode;
        this.value = value;
        this.isPercentage = isPercemtage;
        this.discountReasonCode = discountReasonCode;
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
