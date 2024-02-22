import { ProductList_VM } from "./productList_VM";

export class QrCode extends ProductList_VM {
   id:number;
   uniqueId : string;
   createdDate : Date;
   barcodeBase64 : string;
   boxNo : string;
  
  }