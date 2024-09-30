import { BaseEntity } from "../../entity/baseEntity";

export class ZTMSG_CountedProduct {
  id: number;
  createdDate: Date;
  updatedDate: Date;
  shelfNo?: string;
  barcode?: string;
  quantity?: number;
  batchCode?: string;
  operationNumber?: string;
  price?: number;
  warehouseCode?: string;
  toWareHouseCode?: string;
  currAccCode?: string;
  itemCode?: string;
  isReturn?: boolean;
  salesPersonCode?: string;
  taxTypeCode?: string;
  lineId?: string;
  invoiceNumber?: string;
  lineDescription?: string;
  operationType?: boolean;
  officeCode?: string
  isCompleted?: boolean

}
export class InnerLine {
  id: string;
  innerHeaderId: string;
  barcode?: string;
  shelfNo?: string;
  toShelfNo?: string;
  itemCode?: string;
  quantity: number;
  batchCode?: string;
  createdDate?: Date;
  updatedDate: Date = new Date();
}
export class InnerLine_VM {

  createdDate?: Date;
  updatedDate: Date;
  count: number;
  type: boolean;
  operationNumber: string;
  isCompleted?: boolean

}

export class InnerHeader {
  id: string;                // GUID türünde benzersiz kimlik
  innerNumber: string;
  officeCode: string;         // Office kodu
  toOfficeCode: string;
  toWarehouseCode: string;
  warehouseCode: string;      // Depo kodu
  description?: string;       // Açıklama (opsiyonel)
  applicationCode?: string;   // Uygulama kodu (opsiyonel)
  innerProcessType: number;   // İç işlem tipi, 2 ise ekler 3 ise çıkar
  isCompleted: boolean;
  isReturn: boolean;// Tamamlanma durumu
  userId: number
  createdDate?: Date;         // Oluşturulma tarihi (opsiyonel)
  isShelfBased?: boolean;
  updatedDate?: Date = new Date();  // Güncellenme tarihi (varsayılan olarak şu anki zaman)
  innerProcessCode: string;   // İç işlem tipi, 2 ise ekler 3 ise çıkar


}
