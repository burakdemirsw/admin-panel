

export class DebitHeader_VM {
    applicationCode?: string; // ApplicationCode
    currAccTypeCode: number; // CurrAccTypeCode
    debitNumber: string;
    debitTypeCode: number; // DebitTypeCode
    id: string; // Guid
    currAccDescription?: string; // CurrAccDescription
    currAccCode?: string; // CurrAccCode
    officeCode?: string; // OfficeCode
    user?: string; // User
    totalCreditAmount: number; // TotalCreditAmount
    totalDebitAmount: number; // TotalDebitAmount
    createdDate: Date; // CreatedDate
    isCompleted: boolean;
}
