import { PostalAddress } from '../../../../models/nebim/customer/nebimCustomer';
export class CreateCustomer_CM {
  // name: string;
  // surname: string;

  currAccDescription: string;
  taxNumber: string;
  taxOfficeCode: string;
  mersisNum: string;

  mail: string;
  phoneNumber: string;
  firmDescription: string;
  stampPhotoUrl: string;
  bussinesCardPhotoUrl: string;
  officeCode: string;
  warehouseCode: string;
  address: Address;

  constructor() {
    this.address = new Address();
    this.mersisNum = "1111111111";
    this.taxNumber = "1234567891";
    this.taxOfficeCode = "";

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

export class AddCustomerAddress_CM {
  modelType: number;
  currAccCode: string;
  postalAddresses: PostalAddress[] = []

  constructor(currAccCode: string, postalAddress: PostalAddress) {
    this.modelType = 2;
    this.currAccCode = currAccCode;
    this.postalAddresses.push(postalAddress);
  }
}
export class ClientCustomer {
  description: string
  currAccCode: string
  stampPhotoUrl: string
  bussinesCardPhotoUrl: string
  createdDate: Date
  addedSellerCode: string
  updatedDate: Date
  constructor() {
    this.createdDate = new Date();
    this.updatedDate = new Date();
  }

}

