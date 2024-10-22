import { PostalAddress } from "../../nebim/customer/nebimCustomer";

export class CreateCustomer_CM {

  modelType: number;
  currAccDescription: string;
  taxNumber: string;
  identityNumber: string;
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
  currAccCode: string;
  isVIP: boolean;
  isBlocked: boolean;
  currencyCode: string;
  constructor() {
    this.address = new Address();
    this.mersisNum = "";
    this.taxNumber = "1111111111";
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
  postalAddressId: string;
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
  cargoAddressPhotoUrl: string;
  constructor() {
    this.createdDate = new Date();
    this.updatedDate = new Date();
  }

}

