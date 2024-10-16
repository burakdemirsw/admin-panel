export class CreatePurchaseInvoice {
    id: string;
    officeCode!: string;
    warehouseCode!: string;
    barcode!: string;
    shelfNo!: string;
    quantity!: number;
    orderNumber!: string;
    currAccCode!: string;
    salesPersonCode!: string; //satıştan gelliyor
    currency!: string; //satıştan gelliyor
    photoUrl!: string;
    batchCode!: string;
    itemCode!: string;
    qty!: number;
}
