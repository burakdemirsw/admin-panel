export class ProductCountModel {
  status !: string
  description !: string
  batchCode !: string
  barcode: string
  batchStatus: boolean
  setStatus: boolean
}

export class ProductCountModel3 {
  public status?: string;
  public description?: string;
  public shelfNo?: string;
  public barcode?: string;
  public quantity?: number;
  public batchStatus: boolean
  public setStatus: boolean
}
