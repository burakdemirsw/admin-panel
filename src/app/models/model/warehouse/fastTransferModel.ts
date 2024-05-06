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
  warehouseCode: string;
  createdDate: Date;
}
export class FastTransferListModel {
  operationId: string;
  createdDate !: Date;
}
