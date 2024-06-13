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
export class ZTMSG_ProductOnShelf {
  id: string;
  createdDate?: Date;
  updatedDate: Date = new Date();
  shelfNo?: string;
  barcode?: string;
  in_Quantity?: number;
  out_Quantity?: number;
  batchCode?: string;
  operationNumber?: string;
  price?: number;
  warehouseCode?: string;
  itemCode?: string;


}
