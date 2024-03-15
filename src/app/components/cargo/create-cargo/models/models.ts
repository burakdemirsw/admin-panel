export class OrderDetail {
  totalPrice: number;
  orderDate: Date;
  salespersonCode: string;
  orderNumber: string;
  description: string;
  currAccCode: string;
  phone: string;
  mail: string;
  customer: string;
  city: string;
  district: string;
  address: string;
  products: BasketProductSummary[];


}

export class BasketProductSummary {
  itemCode: string;
  barcode: string;
  quantity: number;
  price: number;


}
export class CreatePackage_MNG_Request {
  order: Order_MNG;
  orderPieceList: OrderPieceListMNG[] = [];
  recipient: Recipient_MNG;

  constructor(ri: string, od: OrderDetail, ct: CargoSetting) {
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


    od.products.forEach(p => {
      var product: OrderPieceListMNG = new OrderPieceListMNG()
      product.barcode = p.barcode == null ? "BARCODE" : p.itemCode;
      product.content = p.itemCode;
      product.desi = 1;
      product.kg = 1;
      this.orderPieceList.push(product);
    });

    this.recipient = new Recipient_MNG();
    this.recipient.customerId = "";
    this.recipient.refCustomerId = "";
    this.recipient.cityCode = 0;
    this.recipient.districtCode = 0;
    this.recipient.cityName = od.city;
    this.recipient.districtName = od.district;
    this.recipient.address = od.address;
    this.recipient.businessPhoneNumber = "";
    this.recipient.email = od.mail;
    this.recipient.taxOffice = "";
    this.recipient.taxNumber = "";
    this.recipient.fullName = od.customer;
    this.recipient.homePhoneNumber = "";
    this.recipient.mobilePhoneNumber = od.phone;


  }
}

export class Order_MNG {
  referenceId: string;
  barcode: string;
  billOfLandingId: string;
  isCod: number;
  codAmount: number;
  shipmentServiceType: number;
  packagingType: number;
  content: string;
  smsPreference1: number;
  smsPreference2: number;
  smsPreference3: number;
  paymentType: number;
  deliveryType: number;
  description: string;
  marketPlaceShortCode: string;
  marketPlaceSaleCode: string;
}

export class OrderPieceListMNG {
  barcode: string;
  desi: number;
  kg: number;
  content: string;
}

export class Recipient_MNG {
  customerId: string;
  refCustomerId: string;
  cityCode: number;
  districtCode: number;
  cityName: string;
  districtName: string;
  address: string;
  businessPhoneNumber: string;
  email: string;
  taxOffice: string;
  taxNumber: string;
  fullName: string;
  homePhoneNumber: string;
  mobilePhoneNumber: string;
}

export class CreatePackage_MNG_Response {
  orderInvoiceId: string;
  orderInvoiceDetailId: string;
  shipperBranchCode: string;
}
export class CreatePackage_MNG_RR {
  response: CreatePackage_MNG_Response;
  request: CreatePackage_MNG_Request
}

export class CreateBarcode_MNG_Request {
  referenceId: string;
  billOfLandingId: string;
  isCOD: number;
  codAmount: number;
  packagingType: number;
  orderPieceList: OrderPieceListMNG[];
  response: CreatePackage_MNG_RR
}

export class CargoSetting {
  isCOD: number;
  codAmount: number;
  packagingType: number;
  shipmentServiceType: number;
  content: string;
  constructor(isCOD: number, packagingType: number, shipmentServiceType: number, content: string, orderDetail?: OrderDetail) {
    if (isCOD === 1) {
      this.isCOD = isCOD;
      this.codAmount = orderDetail.totalPrice;
      this.packagingType = packagingType;
      this.shipmentServiceType = shipmentServiceType;
      this.content = content;
    } else {
      this.isCOD = isCOD;
      this.codAmount = 0;
      this.packagingType = packagingType;
      this.shipmentServiceType = shipmentServiceType;
      this.content = content;
    }
  }


}

export class GetPackageStatus_MNG_Response {
  orderId?: string;
  referenceId?: string;
  shipmentId?: string;
  shipmentSerialandNumber?: string;
  shipmentDateTime?: string;
  shipmentStatus?: string; // Daha spesifik bir tip belirtmek mümkünse, any yerine o tipi kullanın
  shipmentStatusCode?: number | null;
  shipmentStatusExplanation?: string; // Daha spesifik bir tip belirtmek mümkünse, any yerine o tipi kullanın
  statusDateTime?: string; // Bu alan için de daha spesifik bir tip kullanılabilir (örn. Date veya string)
  trackingUrl?: string;
  isDelivered?: number | null;
  deliveryDateTime?: string;
  deliveryTo?: string;
  retrieveShipmentId?: string; // Daha spesifik bir tip belirtmek mümkünse, any yerine o tipi kullanın


}

export class CargoBarcode_VM {
  orderNo?: string;
  referenceId?: string;
  barcodeZplCode?: string
  shipmentId?: string;
  createdDate?: Date;

}
