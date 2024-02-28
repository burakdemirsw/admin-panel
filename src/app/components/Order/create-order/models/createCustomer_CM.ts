export class CreateCustomer_CM {
  name: string;
  surname: string;
  mail: string;
  phoneNumber: string;
  taxNumber: string;
  firmDescription: string;
  stampPhotoUrl: string;
  bussinesCardPhotoUrl: string;
  officeCode: string;
  warehouseCode: string;
  address: Address;
  constructor() {
    this.address = new Address();
  }
}
export class Address {
  country: string;
  province: string;
  district: string;
  region: string;
  taxOffice: string;
  description: string;
  postalCode: string;
}

export class CreateCustomer_ResponseModel {
  currAccCode: string
}
