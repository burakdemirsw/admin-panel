export class OrderBillingRequestModel {
  orderNo!: string;
  invoiceType!: boolean;
  invoiceModel!: number;
  salesPersonCode !: string
  currency !: string
  taxedOrTaxtFree!: number;
  eInvoiceNumber!: string
  invoiceDate !: Date
}
