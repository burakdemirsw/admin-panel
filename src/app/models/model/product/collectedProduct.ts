import { ProductOfOrder } from "../order/productOfOrders";

export class CollectedProduct {
  photoUrl!: string;
  shelfNo!: string;
  barcode!: string;
  quantity!: number;
  itemCode!: string;
  batchCode!: string
  lineId !: string
  availableQty !: number
  id: string;
  setProducts: ProductOfOrder[];
  setProducts_JS: string;
}
