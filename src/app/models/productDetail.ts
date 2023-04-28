import { Category } from "./category";
import { Product } from "./product";

export class ProductDetail {
  id: number;
  brand: string;
  color: string;
  dimention: string;
  stockAmount: number;
  purchasePrice: number;
  sellingPrice: number;
  product: Product;
  productId: number;
  category: Category;
  categoryId: number;
}
