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
  bankCurrAccTypeCode?: number; // BankCurrAccTypeCode, nullable
  bankCurrAccCode?: string; // BankCurrAccCode, nullable
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
export class DebitHeader {
  id: string; // UNIQUEIDENTIFIER
  debitTypeCode: number; // DebitTypeCode
  debitNumber?: string; // Kasa Fiş Referans Numarası, nullable
  description?: string; // Açıklama, nullable
  currAccTypeCode?: number; // Cari Hesap Tipi Kodu, nullable
  currAccCode?: string; // Cari Hesap Kodu, nullable
  officeCode: string; // Ofis Kodu
  storeTypeCode: number; // Mağaza Tipi Kodu
  storeCode?: string; // Mağaza Kodu, nullable
  applicationCode: string; // Uygulama Kodu
  raportUrl?: string; // Rapor URL'si, nullable
  userId: number; // Kullanıcı ID
  isCompleted: boolean; // Tamamlanma Durumu
  createdDate?: Date; // Oluşturulma Tarihi, nullable
  updatedDate?: Date; // Güncellenme Tarihi, nullable
}
export class DebitLine {
  id: string; // UNIQUEIDENTIFIER
  debitHeaderId: string; // DebitHeader ile ilişkilendirilmiş ID
  lineDescription?: string; // Satır Açıklaması, nullable
  docCurrencyCode?: string; // Doküman Para Birimi Kodu, nullable
  currAccCurrencyCode?: string; // Cari Hesap Para Birimi Kodu, nullable
  creditAmount: number; // Kredi Tutarı
  debitAmount: number; // Borç Tutarı
  dueDate: Date;
  debitReasonCode: string
  createdDate?: Date; // Oluşturulma Tarihi, nullable
  updatedDate?: Date; // Güncellenme Tarihi, nullable
}
export class CashHeader_VM {
  applicationCode?: string; // ApplicationCode
  id: string; // Guid
  currAccDescription?: string; // CurrAccDescription
  cashCurrAccTypeCode: number; // CashCurrAccTypeCode
  cashCurrAccCode?: string; // CashCurrAccCode
  officeCode?: string; // OfficeCode
  user?: string; // User
  total: number; // Total
  createdDate: Date; // CreatedDate
}

export class DebitHeader_VM {
  applicationCode?: string; // ApplicationCode
  currAccTypeCode: number; // CurrAccTypeCode
  debitTypeCode: number; // DebitTypeCode
  id: string; // Guid
  currAccDescription?: string; // CurrAccDescription
  currAccCode?: string; // CurrAccCode
  officeCode?: string; // OfficeCode
  user?: string; // User
  totalCreditAmount: number; // TotalCreditAmount
  totalDebitAmount: number; // TotalDebitAmount
  createdDate: Date; // CreatedDate
}

export class BankHeader_VM {
  applicationCode?: string; // ApplicationCode
  bankTransTypeCode: number; // BankTransTypeCode
  id: string; // Guid
  currAccDescription?: string; // CurrAccDescription
  bankCurrAccCode?: string; // BankCurrAccCode
  officeCode?: string; // OfficeCode
  user?: string; // User
  total: number; // Total
  createdDate: Date; // CreatedDate
}
