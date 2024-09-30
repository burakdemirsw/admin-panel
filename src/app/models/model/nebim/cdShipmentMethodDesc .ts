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
