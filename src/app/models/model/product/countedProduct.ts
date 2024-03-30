export class CountedProduct {
  id: string;
  barcode!: string;
  shelfNo!: string;
  batchCode!: string;
  quantity !: number
  photoUrl !: string
  itemCode !: string

}
export class CountedProductControl {
  itemCode: string;
  state: boolean
}
