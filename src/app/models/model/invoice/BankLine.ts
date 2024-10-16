

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
