export class CountProduct { //order-operation

  barcode!: string;
  shelfNo!: string;
  batchCode!: string;
  quantity !: number

  constructor(barcode: string, shelfNo: string, batchCode: string, quantity: number) {

    this.barcode = barcode;
    this.shelfNo = shelfNo;
    this.batchCode = batchCode;
    this.quantity = quantity;
  }
}
export class CountProduct2 extends CountProduct {  //warehouse-operation
  id: any;
  office: string;
  officeTo: string;
  warehouse: string;
  warehouseTo: string;
  orderNo: string;

  constructor(id: any, shelfNo: string, barcode: string, quantity: number, batchCode: string,
    office: string, officeTo: string, warehouse: string, warehouseTo: string, orderNo: string) {
    super(barcode, shelfNo, batchCode, quantity);

    this.id = id;
    this.office = office;
    this.officeTo = officeTo;
    this.warehouse = warehouse;
    this.warehouseTo = warehouseTo;
    this.orderNo = orderNo;
  }

  // İsteğe bağlı olarak, ek işlemler veya doğrulamalar için yöntemler ekleyebilirsiniz
}

export class CountProduct3 extends CountProduct {  //warehouse-shelf-count

  office: string;
  warehouseCode: string;
  isShelfBased: boolean;
  isShelfBased2: boolean;

  constructor(shelfNo: string, barcode: string, quantity: number, batchCode: string,
    office: string, warehouseCode: string, isShelfBased: boolean, isShelfBased2: boolean) {
    super(barcode, shelfNo, batchCode, quantity);

    this.shelfNo = shelfNo;
    this.barcode = barcode;
    this.quantity = quantity;
    this.batchCode = batchCode;
    this.office = office;
    this.warehouseCode = warehouseCode;
    this.isShelfBased = isShelfBased;
    this.isShelfBased2 = isShelfBased2;

  }


}
