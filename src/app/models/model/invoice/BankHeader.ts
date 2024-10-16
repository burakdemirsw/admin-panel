

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
