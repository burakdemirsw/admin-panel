

export class BankHeader_VM {
  applicationCode?: string; // ApplicationCode
  bankTransTypeCode: number; // BankTransTypeCode
  id: string; // Guid
  currAccDescription?: string; // CurrAccDescription
  bankCurrAccCode?: string; // BankCurrAccCode
  officeCode?: string; // OfficeCode
  user?: string; // User
  total: number; // Total
  description: string;
  createdDate: Date; // CreatedDate
  isCompleted: boolean;
  bankTransNumber: string;
}
