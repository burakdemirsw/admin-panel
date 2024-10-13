export class GetCustomerList_CM {
  mail?: string;
  phone?: string;
  currAccCode?: string
}

export class GetCustomerAddress_CM {
  currAccCode?: string;
  phone?: string;
}

export class CustomerList_VM {
  currAccCode?: string;
  currAccDescription?: string;
  mail?: string;
  phone?: string;
  docCurrencyCode?: string;
}

export class CustomerAddress_VM {
  currAccDescription?: string;
  postalAddressID: string;
  currAccCode?: string;
  countryCode?: string;
  countryDescription?: string;
  stateCode?: string;
  stateDescription?: string;
  cityCode?: string;
  cityDescription?: string;
  districtCode?: string;
  districtDescription?: string;
  phoneNumber?: string;
  taxOfficeCode?: string;
  taxOfficeDescription?: string;
  address?: string;
  taxNumber?: string;
  mail?: string;
  identityNumber?: string;
}


export class NebimCustomerDto {
  customer?: Customer;
  communications?: Communication[];
  addresses?: Address[];
}

export class Customer {
  firstName?: string;
  lastName?: string;
  currAccDescription?: string;
  currAccCode?: string;
  taxNumber?: string;
  currencyCode?: string;
  identityNumber?: string;
  isVIP: boolean = false;
  isBlocked: boolean = false;
}

export class Communication {
  communicationID: string = ''; // Using string instead of Guid
  communicationTypeCode: number = 0;
  commAddress?: string;
}

export class Address {  // Fixed class name from "Addres" to "Address"
  postalAddressID: string; // Using string instead of Guid
  countryCode?: string;
  countryDescription?: string;
  stateCode?: string;
  stateDescription?: string;
  cityCode?: string;
  cityDescription?: string;
  districtCode?: string;
  districtDescription?: string;
  taxOfficeCode?: string;
  taxOfficeDescription?: string;
  address?: string;
}

