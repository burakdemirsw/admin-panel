

export class CollectedInvoiceProduct {
  id: string;
  shelfNo: string;
  barcode: string;
  quantity?: number;
  // requestedShipmentQuantity?: number;
  // confirmedShipmentQuantity?: number;

  batchCode?: string;
  itemCode: string;
  processId: string;
  photoUrl: string;
  price: number;
  priceVI: number;
  // totalPrice: number;
  // totalTaxedPrice: number;
  taxRate: number;
  discountRate1: number;
  discountRate2: number;
  createdDate?: Date;
  updatedDate?: Date;
}
