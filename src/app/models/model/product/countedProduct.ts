export class CountedProduct {
  id: string;
  barcode!: string;
  shelfNo!: string;
  batchCode!: string;
  quantity !: number;
  photoUrl !: string;
  itemCode !: string;
  warehouseCode !: string; //yeni eklendi

}
export class CountedProductControl {
  itemCode: string;
  state: boolean
}
