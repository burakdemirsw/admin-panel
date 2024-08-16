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
  salesPersonCode: string;
  isReturn?: boolean;
  invoiceNumber?: string;
  taxTypeCode?: string;
  isCompleted: boolean;
  officeCode: string;
  warehouseCode: string;
  createdDate?: Date;
  updatedDate?: Date;

}
export class CollectedInvoiceProduct {
  id: string; // Guid in TypeScript is represented as a string
  shelfNo: string;
  barcode: string;
  quantity?: number;
  batchCode?: string;
  itemCode: string;
  processId: string;
  // isCompleted: boolean;
  createdDate?: Date;
  updatedDate?: Date;


}
