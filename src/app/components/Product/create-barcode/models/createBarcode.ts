import { GeneralService } from "src/app/services/admin/general.service";

export class CreateBarcodeModel {
  id: string;
  operationNo: string;
  barcode: string;
  batchCode: string;
  quantity: number;
  createdDate: Date;


}
