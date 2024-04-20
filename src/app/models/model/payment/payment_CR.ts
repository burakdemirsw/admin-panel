import { CustomerAddress_VM, CustomerList_VM } from "../order/getCustomerList_CM";
import { ProductList_VM } from "../product/productList_VM";
import { Address } from '../order/createCustomer_CM';

export class Payment_CR {
  pageUrl: string
}
export class Payment_CM {
  orderNo: string;
  totalValue: string;
  user: CustomerList_VM;
  address: CustomerAddress_VM;
  basketItems: ProductList_VM[];
}
