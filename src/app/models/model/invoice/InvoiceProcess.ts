export class InvoiceProcess {
    id: string; // Guid in TypeScript is represented as a string
    processType: string;
    userId: number;
    processCode: string;
    currAccCode: string;
    vendorCode: string;
    salesPersonCode: string;
    applicationCode: string;
    isReturn?: boolean;
    invoiceNumber?: string;
    taxTypeCode?: string;
    isCompleted: boolean;
    officeCode: string;
    eInvoiceNumber: string;
    warehouseCode: string;
    discountRate1: number;
    discountRate2: number;
    description: string;
    internalDescription: string;
    eInvoiceUrl: string;
    shippingPostalAddressId: string;
    billingPostalAddressId: string;
    subCurrAccId: string;
    createdDate?: Date;
    updatedDate?: Date;

}
