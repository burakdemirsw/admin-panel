export class SaleOrderModel {
  orderDate: Date;
  orderNumber: string;
  currAccCode: string;
  currAccDescription: string;
  salespersonCode: string;
  qty1: number;
  price: number;
  collectedQty: number
  remainingQty: number
  status: number
  description: string
  invoiceStatus: number
  isShipped: boolean;
}
