export class NebimCustomer {
  modelType: number;
  currAccCode: string;
  firstName: string;
  lastName: string;
  officeCode: string;
  retailSalePriceGroupCode: string;
  identityNum: string; // 11111111111
  creditLimit: number; // 0
  currencyCode: string; // TRY
  postalAddresses: PostalAddress[]; // spden gelcek
  communications: Communication[];

  constructor() {
    this.postalAddresses = [];
    this.communications = [];
  }
}

export class PostalAddress {
  addressTypeCode: string;
  countryCode: string;
  stateCode: string;
  cityCode: string;
  districtCode: string;
  address: string;
}

export class Communication {
  communicationTypeCode: number;
  commAddress: string;
}
