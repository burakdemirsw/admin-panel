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
  id: string;
  innerNumber: string;
  officeCode: string;
  toOfficeCode: string;
  toWarehouseCode: string;
  warehouseCode: string;
  description?: string;
  applicationCode?: string;
  innerProcessType: number;
  isReturn: boolean;
  userId: number
  createdDate?: Date;
  isShelfBased?: boolean;
  updatedDate?: Date = new Date();
  innerProcessCode: string;
  isCompleted: boolean;
  completionDate: Date;
  completedUserId: number
  isApproved: boolean;
  approvedUserId: number
  approveDate: Date
}
