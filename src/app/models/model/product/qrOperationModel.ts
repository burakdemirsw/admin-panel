export class QrOperationModel {
    public qrBarcode: string;
    public shelfNo: string;
    public barcode: string;
    public batchCode: string;
    public qty: number;
    public processCode: string;
    public isReturn: boolean;
}
export class QrOperationModel2{
    public qrBarcode: string;
    public shelfNo: string;
    public barcode: string;
    public batchCode: string;
    public qty: number;
    public processCode: string;
    public isReturn: boolean;
    public toWarehouseCode :string;
}
export class QrOperationResponse {
    public status:boolean
}
