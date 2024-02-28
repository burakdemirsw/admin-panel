export class AddUserShippingAddressCommandModel {
  id: number
  userId: number;
  addressTitle?: string;
  addressPhoneNumber: string
  addressDescription?: string;
  countryId: number;
  provinceId: number;
  districtId: number;
  neighborhoodId: number;
  postalCode?: string;
  createdDate?: Date;
  updatedDate?: Date;
  isIndividual: boolean;
  isCorporate: boolean;
  corparateDescription: string;
  taxAuthorityDescription: string;
  taxNo: string
  nameSurname: string
  constructor() {
    // Initialize default values if needed
    this.id = 0;
    this.userId = 0;
    this.countryId = 0;
    this.provinceId = 0;
    this.districtId = 0;
    this.neighborhoodId = 0;
  }
}


export class AddUserAddressFormModel {
  address_title: string;
  address_nameSurname: string;
  address_phoneNumber: string;
  address_country: any; // Use a more specific type if available
  address_province: any; // Use a more specific type if available
  address_district: any; // Use a more specific type if available
  address_neighborhood: any; // Use a more specific type if available
  address_description: string;
  address_postalCode: string;
  address_isIndividualOrIsCorporate: boolean;
  address_corporateDescription: string;
  address_taxAuthorityDescription: string;
  address_taxNo: string;

}

export class UpdateUserAddressFormModel {
  update_address_title: string;
  update_address_nameSurname: string;
  update_address_phoneNumber: string;
  update_address_country: any; // Use a more specific type if available
  update_address_province: any; // Use a more specific type if available
  update_address_district: any; // Use a more specific type if available
  update_address_neighborhood: any; // Use a more specific type if available
  update_address_description: string;
  update_address_postalCode: string;
  update_address_isIndividualOrIsCorporate: boolean;
  update_address_corporateDescription: string;
  update_address_taxAuthorityDescription: string;
  update_address_taxNo: string;

}
