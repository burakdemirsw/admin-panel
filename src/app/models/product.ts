import { Time } from "@angular/common";
import { Category } from "./category";
import { ProductDetail } from "./productDetail";

export class Product {

  id ?: number;
  stockCode?: string;
  barcode?: string;
  productName?: string;
  description?: string;
  subCategoryId ?: number;
  specialField?: string;
  createdDate ?: Date
  updatedDate ?: Date
  productDetail ?: ProductDetail
  productDetailId ?: number

  }
