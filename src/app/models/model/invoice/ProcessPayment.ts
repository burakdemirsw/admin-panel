export class ProcessPayment {
  public id: string; // Guid tipine karşılık gelen string
  public processId: string; // Guid tipine karşılık gelen string
  public paymentType?: number; // ? ile optional
  public paymentTypeCode?: number; // ? ile optional
  public creditCardTypeCode?: string; // ? ile optional
  public bankCode?: string; // ? ile optional
  public bankAccountCode?: string; // ? ile optional
  public cashAccountCode?: string; // ? ile optional
  public installmentCount?: number; // ? ile optional
  public payment: number; // Zorunlu alan
  public lineDescription?: string; // ? ile optional
  public dueDate?: Date; // ? ile optional
  public docCurrencyCode?: string; // ? ile optional

}
