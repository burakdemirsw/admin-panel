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
  address?: string;
}
