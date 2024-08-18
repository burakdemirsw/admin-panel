export class CreatePurchaseInvoice {
  id: string;
  officeCode !: string
  warehouseCode !: string
  barcode !: string
  shelfNo !: string
  quantity !: number
  orderNumber !: string
  currAccCode !: string
  salesPersonCode !: string //satıştan gelliyor
  currency !: string //satıştan gelliyor
  photoUrl !: string
  batchCode !: string
  itemCode!: string
  qty !: number
}
export class InvoiceProcess {
  id: string; // Guid in TypeScript is represented as a string
  processCode: string;
  currAccCode: string;
  vendorCode: string;
  salesPersonCode: string;
  isReturn?: boolean;
  invoiceNumber?: string;
  taxTypeCode?: string;
  isCompleted: boolean;
  officeCode: string;
  warehouseCode: string;
  discountRate1: number;
  discountRate2: number;
  createdDate?: Date;
  updatedDate?: Date;

}
export class CollectedInvoiceProduct {
  id: string;
  shelfNo: string;
  barcode: string;
  quantity?: number;
  batchCode?: string;
  itemCode: string;
  processId: string;
  photoUrl: string;
  price: number;
  priceVI: number;
  // totalPrice: number;
  // totalTaxedPrice: number;
  taxRate: number;
  discountRate1: number;
  discountRate2: number;
  createdDate?: Date;
  updatedDate?: Date;
}
export class ProductDetail_VM {
  photoUrl: string;
  itemCode: string;
  barcode: string;
  quantity: number;
  description: string;
  price: number;
  priceVI: number;

  taxRate: number;
}
