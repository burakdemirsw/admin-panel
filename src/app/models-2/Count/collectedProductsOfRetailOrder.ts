export class CollectedProductsOfRetailOrder {
  id: string;
  orderNumber?: string;
  packageNumber?: string;
  lineId?: string;
  quantity?: number;
  barcode?: string;
  createdDate?: Date;
  shelfNo?: string;

  constructor() {

    this.id = null;
    this.createdDate = new Date();
  }
}
