
export class CheckOrderModel {
  orderHeaderID: string;
  internalDescription: string;
  customer: string;
}

export class CheckCustomerModel {
  phoneOrMail: string;
  customer: string;
  currAccCode: string;
}

export class NebimOrder {
  orderNumber: string
  modelType: number;
  customerCode: string;
  subCurrAccID: string;
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
  DeliveryCompanyCode: string;
  exchangeRate: number
  lines: Line[];
  discounts: Discount[] = [];
  // discounts: Discount[];
  // payments: Payment[];

  constructor(orderNumber: string, exchangeRate: number, discountRate1: number, discountRate2: number, customerDesc: string,
    currAccCode: string, orderNo: string, formValue: any, selectedProducts: any,
    salesPersonCode: string, taxTypeCode: number, subCurrAccId: string) {
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
    selectedProducts.forEach(p => {
      var line: Line = new Line();
      line.usedBarcode = p.barcode;
      line.salesPersonCode = salesPersonCode;

      var price = p.totalPrice / p.quantity
      if (this.taxTypeCode == 0) { //standart ise

        if (exchangeRate != 1) { //dövizli ise
          line.priceVI = null;
          line.price = parseFloat((price / exchangeRate).toFixed(2));
        } else { //dövizli değilse
          line.priceVI = null;
          line.price = parseFloat(p.discountedPrice.toFixed(2));
        }
      } else if (this.taxTypeCode == 5) {

        if (exchangeRate != 1) { //dövizli ise
          line.priceVI = parseFloat((price / exchangeRate).toFixed(2));
          line.price = parseFloat((price / exchangeRate).toFixed(2));
        } else { //dövizli değilse
          line.priceVI = parseFloat((price).toFixed(2));
          line.price = parseFloat((price).toFixed(2));
        }
      }
      else { //vergisiz ise

        if (exchangeRate != 1) { //dövizli ise
          line.priceVI = parseFloat((price / exchangeRate).toFixed(2));
          line.price = parseFloat((price / exchangeRate).toFixed(2));
        } else { //dövizli değilse
          line.priceVI = parseFloat((price).toFixed(2));
          line.price = parseFloat((price).toFixed(2));
        }
      }

      line.qty1 = p.quantity;
      line.itemCode = p.itemCode;
      this.lines.push(line);
    });
    if (salesPersonCode == 'MD') {
      var payment: Payment = new Payment()
      payment.paymentType = "NAKIT";
      payment.code = "TRD";
      payment.currencyCode = "TRY";
      payment.amount = this.lines.reduce((a, b) => a + (b.price) * b.qty1, 0);

    }
    // this.payments = [];
    if (exchangeRate != 1) {
      this.discounts.push(new Discount(discountRate1 / exchangeRate, 1, "1", true));
      this.discounts.push(new Discount(discountRate2 / exchangeRate, 2, "2", false));
    } else {
      this.discounts.push(new Discount(discountRate1, 1, "1", true));
      this.discounts.push(new Discount(discountRate2, 2, "2", false));
    }

  }
}
export class NebimOrder_2 {
  modelType: number;
  customerCode: string;
  internalDescription: string;
  orderDate: string;
  officeCode: string;
  discounts: Discount[] = [];

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
  DeliveryCompanyCode: string;
  // ordersViaInternetInfo: OrdersViaInternetInfo;
  lines: Line_2[];
  // discounts: Discount[];
  // payments: Payment[];

  constructor(discountPercentage: number, customerDesc: string, currAccCode: string, orderNo: string, formValue: any, selectedProducts: any, salesPersonCode: string, taxTypeCode: number) {
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
    selectedProducts.forEach(p => {
      var price = p.totalPrice / p.quantity


      var line: Line_2 = new Line_2();
      line.usedBarcode = p.barcode;
      line.salesPersonCode = salesPersonCode;
      line.priceVI = price;
      line.qty1 = p.quantity;
      line.itemCode = p.itemCode;
      line.batchCode = p.batchCode;
      var attribute = new ITAttribute();
      attribute.attributeCode = p.shelfNo
      line.iTattributes.push(attribute);
      this.lines.push(line);
    });
    // this.payments.push(payment)
  }
}
export class NebimInvoice {
  modelType: number;
  customerCode: string;
  subCurrAccID: string;
  internalDescription: string;
  invoiceDate: string;
  officeCode: string;
  docCurrencyCode: string;
  warehouseCode: string;
  isOrderBase: boolean;
  isCreditSale: boolean;
  eMailAddress: string
  shipmentMethodCode: number;
  taxTypeCode: number;
  posTerminalID: number;
  isCompleted: boolean;
  // isSalesViaInternet: boolean;
  companyCode: number
  billingPostalAddressID: string
  shippingPostalAddressID: string
  description: string;
  invoiceNumber: string;
  // ordersViaInternetInfo: OrdersViaInternetInfo;
  lines: Line_3[];
  discounts: Discount[] = [];
  // payments: Payment[];

  constructor(discountPercentage: number, discountPercentage2: number,
    exchangeRate: number, docCurrencyCode: string, customerDesc: string,
    currAccCode: string, orderNo: string, formValue: any, selectedProducts: any,
    salesPersonCode: string, taxTypeCode: number, addressId: string, subCurrAccID: string, invoiceNumber: string) {
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
    selectedProducts.forEach(p => {

      var price = p.totalPrice / p.quantity


      var line: Line_3 = new Line_3();
      if (exchangeRate != 1) {

        line.price = parseFloat((price / exchangeRate).toFixed(2));
      } else {
        line.price = parseFloat((price).toFixed(2));
      }
      line.usedBarcode = p.barcode;
      line.salesPersonCode = salesPersonCode;
      line.priceVI = null;
      line.qty1 = p.quantity;
      line.itemCode = p.itemCode;
      line.batchCode = p.batchCode;
      var attribute = new ITAttribute();
      attribute.attributeCode = p.shelfNo
      line.iTattributes.push(attribute);
      this.lines.push(line);
    });
    // this.payments.push(payment)
  }
}
export class NebimInvoiceResponse {
  status: boolean
  invoiceNumber: string;
}
export class Discount {
  discountTypeCode: number;
  value: number;
  discountReasonCode: string;
  isPercentage: boolean;
  constructor(
    value: number,
    discountTypeCode: number,
    discountReasonCode: string,
    isPercemtage: boolean

  ) {
    this.discountTypeCode = discountTypeCode;
    this.value = value;
    this.isPercentage = isPercemtage;
    this.discountReasonCode = discountReasonCode;
  }

}

export class Line {
  itemCode: string;
  qty1: number;
  priceVI: number;
  price: number;
  salesPersonCode: string;
  usedBarcode: string;
}

export class Line_2 extends Line {

  batchCode: string;
  iTattributes: ITAttribute[] = []
}
export class Line_3 extends Line_2 {

  currencyCode: string;
  orderLineId: string
}
export class ITAttribute {
  attributeCode: string
  attributeTypeCode: number
  constructor() {
    this.attributeTypeCode = 1;
  }
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
  salesPersonCode?: string;
  salesPersonDescription?: string;
  customerDescription?: string;
  shippingPostalAddressId: string;
  orderNo?: string;
  paymentType: string
  paymentDescription: string;
  orderNumber: string
  createdDate: Date;
  paymentDate: Date
  cargoStatus: string
  recepientName: string;
  recepientPhone: string;
  orderDescription: string;
  subCurrAccId: string;
  isCompleted: boolean
  isCancelled: boolean;
  subCustomerDescription?: string;
  discountRate1: number
  discountRate2: number
  sellerDescription: string;
  userId: number;
  constructor() {
    this.createdDate = new Date();
    this.isCompleted = false;

  }
}

export class ClientOrderFilter {
  customerCode?: string;
  salesPersonCode?: string;
  salesPersonDescription?: string;
  paymentDescription?: string;
  orderNo?: string;
  orderNumber?: string;
  createdDate?: Date;
  updatedDate?: Date;
  customerDescription?: string;
  isCancelled?: boolean;
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
  priceWs: string
  quantity: number
  warehouseCode !: string
  brandDescription !: string
  uD_Stock!: string;
  mD_Stock !: string;
  createdDate: Date;
  updatedDate: Date;
  discountedPrice: number;
  basePrice: number;
  discountRate1: number
  discountRate2: number
  taxRate: number;
  totalPrice: number
  totalTaxedPrice: number

  constructor() {
    this.createdDate = new Date();
  }
}
