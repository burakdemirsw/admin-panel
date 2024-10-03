export class TransferRequestListModel {
  itemCode?: string;
  shelfNo?: string;
  quantity?: number;
  targetShelf?: string;
  transferQuantity?: number;
  barcode?: string;
  drawerCount: number
}
export class FastTransfer_VM {
  barcode: string;
  itemCode: string;
  shelfNo: string;
  quantity: number;
  speed: number;
  inventory: number;
  brand: string;
  photoUrl: string;
  price: string;
  description;

}
export interface BasketProduct_VM {
  photoUrl?: string;
  itemCode?: string;
  description?: string;
  barcode?: string;
  price?: number;
  priceVI?: number;
  brand?: string;
  colorCode?: string;
  colorDescription?: string;
  itemDim1Code?: string;
  inventory?: number;
}
