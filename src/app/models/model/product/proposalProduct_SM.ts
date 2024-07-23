export class ProposalProduct_SM {
  photoUrl: string;
  itemCode: string;
  itemDescription: string;
  colorCode: string;
  colorDescription: string;
  itemDim1Code: string;
  barcode: string;
  price: number;
  price2: number;
  attribute1: string;
  attribute2: string;
  attribute3: string;
  attribute4: string;
  attribute5: string;
}
export class ZTMSG_ProposalProduct {
  id: number;
  operationId: string;
  lineId: string;
  barcode?: string;
  description?: string;
  warehouseCode?: string;
  photoUrl?: string;
  shelfNo?: string;
  itemCode?: string;
  batchCode?: string;
  price: number;
  discountedPrice: number;
  basePrice: number;
  quantity: number;
  quantity2: number;
  taxRate: number;
  createdDate?: Date;
  updatedDate?: Date;


}
export class ZTMSG_ProposalProduct_VM {

  operationId: string;
  lineId: string;
  barcode?: string;
  description?: string;
  warehouseCode?: string;
  photoUrl?: string;
  shelfNo?: string;
  itemCode?: string;
  batchCode?: string;
  price: number;
  discountedPrice: number;
  basePrice: number;
  quantity: number;
  quantity2: number;
  taxRate: number;


}
