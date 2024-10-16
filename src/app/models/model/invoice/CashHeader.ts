

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
