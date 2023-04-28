import { Product } from "./product";
import { Subcategory } from "./subCategory";

export interface Category {
  id: number;
  name: string;
  description: string;
  products: Product[];
  subCategories: Subcategory[];
  }
