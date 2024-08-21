export class CountListModel {
  lastUpdateDate?: Date;
  totalProduct?: number;
  orderNo?: string;
  isReturn?: boolean;
  salesPersonCode?: string;
  taxTypeCode?: string;
}
export class Invoice_VM {
  id: number;
  processCode: string;
  vendorCode: string;
  officeCode: string;
  warehouseCode: string;
  lastUpdateDate: Date;
  totalProduct: number;
  eInvoiceNumber: string;
  isReturn: boolean;
  taxTypeCode: string;
  currAccDescription: string;
  amount: number;
}
