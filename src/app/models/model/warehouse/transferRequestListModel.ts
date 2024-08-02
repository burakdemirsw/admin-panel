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
  drawerCount: number;
  transferQuantity: number;
  targetShelf: string;
  quantity: number;
  productHierarchyLevel01: string;
  productHierarchyLevel02: string;
  productHierarchyLevel03: string;
  speed: number;
  inventory: number;
  brand: string;
  photoUrl: string;
  price: string;
  description;

}
