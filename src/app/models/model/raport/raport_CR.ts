export class Raport_CR {
  raport_1?: Raport_1;
  raport_2?: Raport_2[];
  raport_3?: Raport_3[];
  raport_4?: Raport_4[];
}

export class Raport_1 {
  wsOrderCount?: number;
  wsOrderRevenue?: number;
  customerCount?: number;
  sendedEArchiveInvoicesCount?: number;
  unSendedEArchiveInvoicesCount?: number;
  sendedEInvoicesCount?: number;
  unSendedEInvoicesCount?: number;
  collectableRetailOrdersCount?: number;
  collectableWhosaleOrdersCount?: number;
}

export class Raport_2 {
  day?: string;
  orderCount?: number;
}

export class Raport_3 {
  day?: string;
  orderRevenue?: number;
}

export class Raport_4 {
  photoUrl?: string;
  product?: string;
  price?: number;
  saleCount?: number;
  revenue?: number;
}
export class Raport_ProductInventory {
  photo: string;
  itemDescription: string;
  itemCode: string;
  warehouseCode: string;
  qty: number

}

export class Raport_BestSeller {
  productCode: string;

  productDescription: string;

  totalSalesQty1: number

  salesWithoutTax: number

  salesWithTax: number

  productPhotoPath: string;

  photo: string;

}

export class Raport_ProductExtract {
  productCode: string;

  productSerialNumber: string;

  operationDate: Date

  documentDate: Date

  processCode: string;

  processDescription: string;

  transTypeCode: number;

  transTypeDescription: string;

  isReturn: boolean

  refNumber: string;

  documentNumber: string;

  currAccTypeCode: number

  currAccTypeDescription: string;

  currAccCode: string;

  currAccDescription: string;

  colorCode: string;

  colorDescription: string;

  itemDim1Code: string;

  itemDim2Code: string;

  itemDim3Code: string;

  in_Qty1: number

  out_Qty1: number

  inventoryQty1: number

  companyCode: number;

  officeCode: string;

  storeCode: string;

  storeDescription: string;

  warehouseCode: string;

  warehouseDescription: string;

  fromOfficeCode: string;

  fromStoreCode: string;

  fromStoreDescription: string;

  fromWarehouseCode: string;

  fromWarehouseDescription: string;

  lineDescription: string;

  lastUpdatedUserName: string;

  lastUpdatedDate: Date;

  iTAtt01: string;

  iTAtt02: string;

  iTAtt03: string;

  iTAtt04: string;

  iTAtt05: string;

  iTAtt06: string;

  ıTAtt07: string;

  iTAtt08: string;

  iTAtt09: string;

  iTAtt10: string;

  month: string;

  ısTurnover: boolean

  applicationCode: string;

  applicationDescription: string;

  stockID: string

  linkedApplicationCode: string;

  linkedApplicationID: string

  paramColorDetail: number;

  paramItemDimensionDetail: number;

  productDescription: string;

  productTypeCode: number;

  productTypeDescription: string;

  itemDimTypeCode: number;

  itemDimTypeDescription: string;

  unitOfMeasureCode1: string;

  unitOfMeasureCode2: string;

  unitConvertRate: number;

  productHierarchyID: number;

  isBlocked: boolean;

  photo: string;

  seasonCode: string;

  seasonDescription: string;

  collectionCode: string;

  collectionDescription: string;

  storyBoardCode: string;

  storyBoardDescription: string;

}
