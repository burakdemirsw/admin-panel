export class FastTransferModel {

  //   photoUrl !:string
  // itemCode !:string
  //  description :string
  //toWarehouseCode !:string
  barcode!: string
  quantity!: number;
  batchCode!: string
  operationId!: string
  shelfNo!: string
  targetShelfNo!: string
  warehouseCode !: string
}
export class FastTransferModel2 {
  id: string;
  photoUrl: string;
  itemCode: string;
  description: string;
  barcode: string;
  quantity: number;
  batchCode: string;
  operationId: string;
  shelfNo: string;
  targetShelfNo: string;
  warehouseCode: any;
  createdDate: Date;
}

export class WarehouseTransferModel {
  id: string;
  photoUrl: string;
  itemCode: string;
  description: string;
  barcode: string;
  quantity: number;
  out_Quantity: number;
  batchCode: string;
  operationId: string;
  shelfNo: string;
  warehouseCode: any;
  createdDate: Date;
  toWarehouseCode: any
}
export class FastTransferListModel {
  operationId: string;
  createdDate !: Date;
}
