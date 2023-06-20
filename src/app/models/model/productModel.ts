import { Time } from "@angular/common"

export class ProductModel{
  id ?: number
  productName ?: string
  stockAmount ?: number
  stockCode ?: string
  url ?: string
  createdDay  ?: Date
  updatedDay ?: Date
  categoryDescription ?: string
  brand ?: string

  blocked ?: boolean
  new?: boolean
  sellingPrice ?: number
  purchasePrice ?: number
}
