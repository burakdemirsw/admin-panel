import { ProductList_VM } from "src/app/models/model/product/productList_VM";

export class CheckOrderModel {
  orderHeaderID: string; // TypeScript'te `Guid` yerine genelde `string` kullanılır
  internalDescription: string;
  customer: string;
}

export class CheckCustomerModel {
  phoneOrMail: string;
  customer: string;
  currAccCode: string;
}

export class NebimOrder {
  modelType: number;
  customerCode: string;
  internalDescription: string;
  orderDate: string;
  officeCode: string;
  warehouseCode: string;
  deliveryCompanyCode: string;
  shipmentMethodCode: number;
  taxTypeCode: number;
  posTerminalID: number;
  isCompleted: boolean;
  isSalesViaInternet: boolean;
  documentNumber: string;
  description: string;
  isCreditSale: boolean;
  // ordersViaInternetInfo: OrdersViaInternetInfo;
  lines: Line[];
  // discounts: Discount[];
  // payments: Payment[];

  constructor(customerDesc: string, currAccCode: string, orderNo: string, formValue: any, selectedProducts: any, salesPersonCode: string, taxTypeCode: number) {
    this.modelType = 5;
    this.posTerminalID = 1;
    this.shipmentMethodCode = 2;
    this.isCompleted = true;
    this.isSalesViaInternet = false;
    this.isCreditSale = true;
    this.taxTypeCode = taxTypeCode;
    this.deliveryCompanyCode = "";
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
    selectedProducts.forEach(p => {
      var line: Line = new Line();
      line.usedBarcode = p.barcode;
      line.salesPersonCode = salesPersonCode;
      line.priceVI = p.price;
      line.qty1 = p.quantity;
      line.itemCode = p.itemCode;
      this.lines.push(line);
    });
    // this.payments.push(payment)
  }
}

export class Discount {
  discountTypeCode: number;
  value: number;
  discountReasonCode: string;
  isPercentage: boolean;
}

export class Line {
  itemCode: string;
  qty1: number;
  priceVI: number;
  salesPersonCode: string;
  usedBarcode: string;
}

export class Payment {
  paymentType: string;
  code: string;
  creditCardTypeCode: string;
  installmentCount: number;
  currencyCode: string;
  amount: number;
  constructor() {
    this.installmentCount = 1;
  }
}

export class OrdersViaInternetInfo {
  salesURL: string;
  paymentTypeCode: number;
  paymentTypeDescription: string;
  paymentAgent: string;
  paymentDate: string;
  sendDate: string;
}

export class ClientOrder_DTO {
  clientOrder: ClientOrder;
  clientOrderBasketItems: ClientOrderBasketItem[];
}
export class ClientOrder {
  id: string;
  customerCode?: string;
  shippingPostalAddressId: string;
  orderNo?: string;
  paymentType: string
  paymentDescription: string;
  isCompleted: boolean
  orderNumber: string
  createdDate: Date;
  paymentDate: Date
  constructor() {
    this.createdDate = new Date();
    this.isCompleted = false;

  }
}
export class ClientOrderBasketItem {
  orderId: string;
  lineId!: string
  description!: string
  photoUrl !: string
  shelfNo !: string
  barcode !: string
  itemCode !: string
  batchCode !: string
  price: number
  quantity: number
  warehouseCode !: string
  brandDescription !: string
  uD_Stock!: string;
  mD_Stock !: string;
  createdDate: Date;
  updatedDate: Date;
  constructor() {
    this.createdDate = new Date();
  }
}
