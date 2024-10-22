export class ProcessPayment {
  id: string; // Guid tipine karşılık gelen string
  processId: string; // Guid tipine karşılık gelen string
  paymentType?: number; // ? ile optional
  paymentTypeCode?: number; // ? ile optional
  creditCardTypeCode?: string; // ? ile optional
  bankCode?: string; // ? ile optional
  bankAccountCode?: string; // ? ile optional
  cashAccountCode?: string; // ? ile optional
  installmentCount?: number; // ? ile optional
  payment: number; // Zorunlu alan
  lineDescription?: string; // ? ile optional
  dueDate?: Date; // ? ile optional
  docCurrencyCode?: string; // ? ile optional
  userId: number;
  isCompleted: boolean;
  paymentNumber: string;

}
