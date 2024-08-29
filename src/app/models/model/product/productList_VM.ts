export class ProductList_VM {
  lineId!: string
  description!: string
  photoUrl !: string
  shelfNo !: string
  barcode !: string
  itemCode !: string
  batchCode !: string
  priceWs !: string //new
  quantity: number
  quantity2: number
  warehouseCode !: string
  brandDescription !: string
  uD_Stock!: string;
  mD_Stock !: string;
  price: number
  basePrice: number;
  discountedPrice: number;
  taxRate: number;
  discountRate1: number;
  discountRate2: number;
  totalPrice: number
  totalTaxedPrice: number

}
export class ProductList_VM_2 {
  lineId!: string
  description!: string
  photoUrl !: string
  shelfNo !: string
  barcode !: string
  itemCode !: string
  batchCode !: string
  quantity: number
  quantity2: number
  warehouseCode !: string
  brandDescription !: string
  uD_Stock!: string;
  mD_Stock !: string;
  price: string
  basePrice: string;
  discountedPrice: number;
  taxRate: number;
  shelfQuantity: number;

}
