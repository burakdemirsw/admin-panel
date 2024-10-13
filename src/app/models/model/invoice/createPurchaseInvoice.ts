export class CreatePurchaseInvoice {
  id: string;
  officeCode !: string
  warehouseCode !: string
  barcode !: string
  shelfNo !: string
  quantity !: number
  orderNumber !: string
  currAccCode !: string
  salesPersonCode !: string //satıştan gelliyor
  currency !: string //satıştan gelliyor
  photoUrl !: string
  batchCode !: string
  itemCode!: string
  qty !: number
}
export class InvoiceProcess {
  id: string; // Guid in TypeScript is represented as a string
  processType: string;
  userId: number;
  processCode: string;
  currAccCode: string;
  vendorCode: string;
  salesPersonCode: string;
  applicationCode: string;
  isReturn?: boolean;
  invoiceNumber?: string;
  taxTypeCode?: string;
  isCompleted: boolean;
  officeCode: string;
  eInvoiceNumber: string;
  warehouseCode: string;
  discountRate1: number;
  discountRate2: number;
  description: string;
  internalDescription: string;
  eInvoiceUrl: string;
  shippingPostalAddressId: string;
  billingPostalAddressId: string;
  subCurrAccId: string;
  createdDate?: Date;
  updatedDate?: Date;

}
export class CollectedInvoiceProduct {
  id: string;
  shelfNo: string;
  barcode: string;
  quantity?: number;
  batchCode?: string;
  itemCode: string;
  processId: string;
  photoUrl: string;
  price: number;
  priceVI: number;
  // totalPrice: number;
  // totalTaxedPrice: number;
  taxRate: number;
  discountRate1: number;
  discountRate2: number;
  createdDate?: Date;
  updatedDate?: Date;
}
export class ProductDetail_VM {
  photoUrl: string;
  itemCode: string;
  barcode: string;
  quantity: number;
  description: string;
  price: number;
  priceVI: number;

  taxRate: number;
}


export class CashHeader {
  id: string;
  cashTransTypeCode: number;
  cashTransNumber?: string;
  description?: string;
  cashCurrAccTypeCode?: number;
  cashCurrAccCode?: string;
  officeCode?: string; // NVARCHAR(50), nullable
  storeTypeCode?: number; // INT, nullable
  storeCode?: string; // NVARCHAR(50), nullable
  posTerminalId?: number; // INT, nullable
  applicationCode: string; // NVARCHAR(50)
  raportUrl?: string; // NVARCHAR(50), nullable
  isCompleted: boolean; // BIT
  userId?: number; // INT, nullable
  createdDate?: Date; // DATETIME, nullable
  updatedDate?: Date; // DATETIME, nullable
}

export class CashLine {
  id: string;
  cashHeaderId: string;
  currAccTypeCode?: number;
  currAccCode?: string;
  lineDescription?: string;
  employeePayTypeCode?: number;
  currAccCurrencyCode: string;
  currAccExchangeRate: number;
  currAccAmount: number;
  createdDate?: Date;
  updatedDate?: Date;
}

export class NebimResponse {
  status: boolean;
  response: string;

}

export class BankAccount {
  bankAccountCode: string; // BankAccountCode
  bankAccountDescription: string; // BankAccountDescription
  bankAccTypeCode: number; // BankAccTypeCode
  bankAccTypeDescription: string; // BankAccTypeDescription
  companyCode: number; // CompanyCode
  bankCode: string; // BankCode
  bankDescription: string; // BankDescription
  bankBranchCode: string; // BankBranchCode
  bankBranchDescription: string; // BankBranchDescription
  currencyCode: string; // CurrencyCode
  bankAccNo: string; // BankAccNo
  iban: string; // IBAN
  useBankAccOnStore: boolean; // UseBankAccOnStore
  officeCode: string; // OfficeCode
  officeDescription: string; // OfficeDescription
  isBlocked: boolean; // IsBlocked
}
export class BankHeader {
  id: string;
  bankTransTypeCode: number; // BankTransTypeCode
  bankTransNumber?: string; // BankTransNumber, nullable
  description?: string; // Description, nullable
  cashCurrAccCode?: string; // CashCurrAccCode, nullable
  officeCode: string; // OfficeCode
  storeTypeCode: number; // StoreTypeCode
  storeCode?: string; // StoreCode, nullable
  posTerminalId?: number; // POSTerminalID, nullable
  applicationCode: string; // ApplicationCode
  raportUrl?: string; // RaportUrl, nullable
  userId: number; // UserId
  isCompleted: boolean; // IsCompleted
  createdDate?: Date;
  updatedDate?: Date;
}
export class BankLine {
  id: string;
  bankHeaderId: string; // BankHeaderId, GUID olarak string kullanılır
  bankCurrAccTypeCode?: number; // BankCurrAccTypeCode, nullable
  bankCurrAccCode?: string; // BankCurrAccCode, nullable
  currAccTypeCode?: number; // CurrAccTypeCode, nullable
  currAccCode?: string; // CurrAccCode, nullable
  lineDescription?: string; // LineDescription, nullable
  docCurrencyCode?: string; // DocCurrencyCode, nullable
  currAccCurrencyCode?: string; // CurrAccCurrencyCode, nullable
  currAccExchangeRate?: number; // CurrAccExchangeRate, nullable
  currAccAmount: number; // CurrAccAmount,
  createdDate?: Date;
  updatedDate?: Date;
}
