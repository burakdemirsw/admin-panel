"use strict";
exports.__esModule = true;
exports.ClientCustomer = exports.AddCustomerAddress_CM = exports.CreateCustomer_ResponseModel = exports.Address = exports.CreateCustomer_CM = void 0;
var CreateCustomer_CM = /** @class */ (function () {
    function CreateCustomer_CM() {
        this.address = new Address();
        this.mersisNum = "1111111111";
        this.taxNumber = "1111111111";
        this.taxOfficeCode = "";
    }
    return CreateCustomer_CM;
}());
exports.CreateCustomer_CM = CreateCustomer_CM;
var Address = /** @class */ (function () {
    function Address() {
    }
    return Address;
}());
exports.Address = Address;
var CreateCustomer_ResponseModel = /** @class */ (function () {
    function CreateCustomer_ResponseModel() {
    }
    return CreateCustomer_ResponseModel;
}());
exports.CreateCustomer_ResponseModel = CreateCustomer_ResponseModel;
var AddCustomerAddress_CM = /** @class */ (function () {
    function AddCustomerAddress_CM(currAccCode, postalAddress) {
        this.postalAddresses = [];
        this.modelType = 2;
        this.currAccCode = currAccCode;
        this.postalAddresses.push(postalAddress);
    }
    return AddCustomerAddress_CM;
}());
exports.AddCustomerAddress_CM = AddCustomerAddress_CM;
var ClientCustomer = /** @class */ (function () {
    function ClientCustomer() {
        this.createdDate = new Date();
        this.updatedDate = new Date();
    }
    return ClientCustomer;
}());
exports.ClientCustomer = ClientCustomer;
