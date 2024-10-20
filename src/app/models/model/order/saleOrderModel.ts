import { OrderStatus } from './orderStatus';
export class SaleOrderModel {
  orderDate: Date;
  orderNumber: string;
  invoiceNumber: string;
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
  eInvoiceStatusCode: boolean
  isShipped: boolean;
  warehouseCode: string;
  warehouseDescription: string;
}
export class OrderStatusModels {
  warehousePerson: string;
  orderStatus: string
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
  warehouseCode: string;
}
