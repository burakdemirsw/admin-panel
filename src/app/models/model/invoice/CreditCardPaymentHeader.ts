export class CreditCardPaymentHeader {
  id: string;
  creditCardPaymentTypeCode: number;
  creditCardPaymentNumber: string;
  description: string;
  currAccTypeCode: number;
  currAccCode: string;
  officeCode: string;
  storeTypeCode: number;
  storeCode: string;
  posTerminalID: number;
  applicationCode: string;
  raportUrl: string;
  userId: number;
  isCompleted: boolean;
  createdDate: Date;
  updatedDate: Date;

}

export class CreditCardPaymentLine {
  id: string;
  creditCardPaymentHeaderId: string;
  lineDescription: string;
  docCurrencyCode: string;
  currAccCurrencyCode: string;
  acquirerBankCode: string;
  issuerBankCode: string;
  currAccAmount: number;
  creditCardTypeCode: string;
  createdDate: Date;
  updatedDate: Date;
}

