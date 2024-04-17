export class GetProductStock {
  barcode: string;
  itemCode: string;
  colorDescription: string;
  itemDim1Code: string;
  quantity: number;
  imageUrl: string;
  itemDescription: string;
  warehouseCode: string;
}
export class GetProductStock_RM {
  barcode: string;
  itemCode: string;
}
export class GetProductExtract {
  operationDate: Date;
  movementType: string;
  documentRefNumber: string;
  productCode: string;
  colorDescription: string;
  accountCode: string;
  accountName: string;
  processDescription: string;
  inQuantity: number;
  outQuantity: number;
}

export class GetProductExtract_RM {
  startDate: Date;
  endDate: Date;
  cycleStatus: string;
  colorStatus: string;
  dimentionStatus: string;
  warehouseCode: string;
}
