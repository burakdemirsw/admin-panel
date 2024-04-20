import { GeneralService } from "src/app/services/admin/general.service";

export class CreateBarcodeModel {
  id: string;
  operationNo: string;
  barcode: string;
  batchCode: string;
  quantity: number;
  createdDate: Date;


}
export class CreateBarcodeFromOrder_RM {
  operationNo: string;
  from: string
  products: CreateBarcodeModel[] = []
  packageDescription: string


  constructor(isPackage: boolean) {
    if (isPackage) {
      this.packageDescription = "Koli"
    } else {
      this.packageDescription = "Ürün"
    }
  }


}
