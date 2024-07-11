export class ZTMSG_CreateCargoBarcode_CM {
  orderNumber: string;
  cargoFirmId: number;
  isCod: number = 0;
  paymentType: number = 1;
  packagingType: number = 2;

  constructor(isCod?: number, paymentType?: number, packagingType?: number) {
    if (isCod !== undefined) {
      this.isCod = isCod;
    }
    if (paymentType !== undefined) {
      this.paymentType = paymentType;
    }
    if (packagingType !== undefined) {
      this.packagingType = packagingType;
    }
  }
}


export class ZTMSG_CreateCargoBarcode_RM<T> extends ZTMSG_CreateCargoBarcode_CM {
  status?: boolean;
  response!: T;
}
