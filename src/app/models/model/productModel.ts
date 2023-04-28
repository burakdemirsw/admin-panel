import { Time } from "@angular/common"

export class ProductModel{
  id ?: number
  productName ?: string
  stockAmount ?: number
  barcode ?: string
  stockCode ?: string
  url ?: string
  createdDay  ?: Date
  updatedDay ?: Date
  categoryDescription ?: string
  colorDescription ?: string
  blocked ?: boolean
  new?: boolean
}
