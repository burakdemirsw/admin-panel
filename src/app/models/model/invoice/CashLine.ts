

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
