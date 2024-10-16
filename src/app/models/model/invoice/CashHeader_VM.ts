

export class CashHeader_VM {
    applicationCode?: string; // ApplicationCode
    id: string; // Guid
    cashTransNumber: string;
    currAccDescription?: string; // CurrAccDescription
    cashCurrAccTypeCode: number; // CashCurrAccTypeCode
    cashCurrAccCode?: string; // CashCurrAccCode
    officeCode?: string; // OfficeCode
    user?: string; // User
    total: number; // Total
    createdDate: Date; // CreatedDate
    isCompleted: boolean;
}
