export class cdShipmentMethodDesc {
  shipmentMethodCode: string;
  langCode: string;
  shipmentMethodDescription: string;
  createdUserName: string;
  createdDate: Date;
  lastUpdatedUserName: string;
  lastUpdatedDate: Date;
  rowGuid: string;  // GUID, TypeScript'te string olarak temsil edilir
}
export class cdColorDesc {
  colorCode: string;
  langCode: string;
  colorDescription: string;
  createdUserName: string;
  createdDate: Date;
  lastUpdatedUserName: string;
  lastUpdatedDate: Date;
  rowGuid: string;  // GUID, TypeScript'te string olarak temsil edilir
}

export class cdCreditCardTypeDesc {
  creditCardTypeCode: string;
  langCode: string;
  creditCardTypeDescription: string;
  createdUserName: string;
  createdDate: Date;
  lastUpdatedUserName: string;
  lastUpdatedDate: Date;
  rowGuid: string;  // GUID, TypeScript'te string olarak temsil edilir
}
export class cdDeliveryCompanyDesc {
  companyCode: number;  // decimal, TypeScript'te number olarak temsil edilir
  deliveryCompanyCode: string;
  langCode: string;
  deliveryCompanyDescription: string;
  createdUserName: string;
  createdDate: Date;
  lastUpdatedUserName: string;
  lastUpdatedDate: Date;
  rowGuid: string;  // GUID, TypeScript'te string olarak temsil edilir
}
export class cdItemDim1Desc {
  itemDim1Code: string;
  langCode: string;
  itemDim1Description: string;
  createdUserName: string;
  createdDate: Date;
  lastUpdatedUserName: string;
  lastUpdatedDate: Date;
  rowGuid: string;  // GUID, TypeScript'te string olarak temsil edilir
}
export class cdPOSTerminal {
  storeTypeCode: number;
  storeCode: string;
  posTerminalID: number;
  posModeCode: number;
  posExternalFilesPath: string;
  displayPort: string;
  tillOpenPort: string;
  seriesCode: string;
  taxFreeSeriesCode: string;
  expenseVoucherSeriesCode: string;
  creditCardSecurityService: string;
  creditCardSecurityPort: string;
  denyCreditCardPaymentWithoutConnection: boolean;
  listSuspendedTransactionsOnStartUp: boolean;
  cashCurrAccTypeCode: number;
  cashCurrAccCode: string;
  warehouseCode: string;
  defaultDocumentTypeCode: number;
  isOfflinePosTerminal: boolean;
  offlineTerminalNumber: number;
  isEnabledCustomerScreen: boolean;
  isBlocked: boolean;
  createdUserName: string;
  createdDate: Date;
  lastUpdatedUserName: string;
  lastUpdatedDate: Date;
  rowGuid: string; // GUID, TypeScript'te string olarak temsil edilir
}
export class cdCurrencyDesc {
  currencyCode: string;
  langCode: string;
  currencyDescription: string;
  createdUserName: string;
  createdDate: Date;
  lastUpdatedUserName: string;
  lastUpdatedDate: Date;
  rowGuid: string; // Use 'string' for TypeScript, as it doesn’t have a Guid type
}
export class CashAccount {
  cashAccountCode: string; // CashAccountCode
  cashAccountDescription: string; // CashAccountDescription
  currencyCode: string; // CurrencyCode
  currencyDescription: string; // CurrencyDescription
  companyCode: number; // CompanyCode
  officeCode: string; // OfficeCode
  officeDescription: string; // OfficeDescription
  storeCode: string; // StoreCode
  isBlocked: boolean; // IsBlocked
}
export class bsCurrAccTypeDesc {
  currAccTypeCode: number; // CurrAccTypeCode
  langCode: string; // LangCode
  currAccTypeDescription: string; // CurrAccTypeDescription
  rowGuid: string; // RowGuid (using string for GUID)
}
export class bsCashTransTypeDesc {
  cashTransTypeCode: number; // CashTransTypeCode
  langCode: string; // LangCode
  cashTransTypeDescription: string; // CashTransTypeDescription
  rowGuid: string; // RowGuid (using string for GUID)
}
export class bsBankTransTypeDesc {
  bankTransTypeCode: number; // BankTransTypeCode
  langCode: string; // LangCode
  bankTransTypeDescription: string; // BankTransTypeDescription
  rowGuid: string; // RowGuid (using string for GUID)


}
