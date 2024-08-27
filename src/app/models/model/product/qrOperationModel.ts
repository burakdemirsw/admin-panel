export class QrOperationModel {
  qrBarcode: string;
  shelfNo: string;
  barcode: string;
  batchCode: string;
  qty: number;
  processCode: string;
  isReturn: boolean;
  lineId: string;
  operationId: string;


}
export class QrOperationModel2 {
  qrBarcode: string;
  shelfNo: string;
  barcode: string;
  batchCode: string;
  qty: number;
  processCode: string;
  lineId: string;
  operationId: string;
  isReturn: boolean;
  toWarehouseCode: string;
}
export class QrOperationResponse {
  status: boolean
}
