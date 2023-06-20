import { Time } from "@angular/common"

export class ProductCreateModel{

  productName ?: string
  stockAmount ?: number
  barcode ?: string
  stockCode ?: string
  dimention ? : string
  purchasePrice ?: number
  sellingPrice ?: number
  url ?: string
  createdDay  ?: Date
  updatedDay ?: Date

  blocked ?: boolean
  new?: boolean
  subCategoryId ?: number
  brandId ?: number
  colorId ?: number
}
