
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
