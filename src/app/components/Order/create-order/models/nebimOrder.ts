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
  orderDate: Date;
  officeCode: string;
  storeCode: string;
  warehouseCode: string;
  deliveryCompanyCode: string;
  shipmentMethodCode: number;
  posTerminalID: number;
  isCompleted: boolean;
  isSalesViaInternet: boolean;
  documentNumber: string;
  description: string;
  ordersViaInternetInfo: OrdersViaInternetInfo;
  lines: Line[];
  discounts: Discount[];
  payments: Payment[];

  constructor() {
    this.modelType = 3;
    this.lines = [];
    this.discounts = [];
    this.payments = [];
    this.ordersViaInternetInfo = new OrdersViaInternetInfo();
  }
}

export class Discount {
  discountTypeCode: number;
  value: number;
  discountReasonCode: string;
  isPercentage: boolean;
}

export class Line {
  colorCode: string;
  itemCode: string;
  itemDim1Code: string;
  qty1: number;
  lDisRate1: number;
  priceVI: number;
  salesPersonCode: string;
  barcode: string;
}

export class Payment {
  paymentType: string;
  code: string;
  creditCardTypeCode: string;
  installmentCount: number;
  currencyCode: string;
  amount: number;
}

export class OrdersViaInternetInfo {
  salesURL: string;
  paymentTypeCode: number;
  paymentTypeDescription: string;
  paymentAgent: string;
  paymentDate: string;
  sendDate: string;
}
