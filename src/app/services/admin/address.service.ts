import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { ToasterService } from '../ui/toaster.service';
import { AddUserShippingAddressCommandModel } from 'src/app/models/model/order/ViewModel/addUserShippingAddressCommandModel';
import { query } from '@angular/animations';
import { Address_VM } from 'src/app/models/model/order/ViewModel/provinceVM';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private client: HttpClientService) { }

  async getAddress(id: number, upperCode?: string): Promise<Address_VM[]> {
    var query;

    if (id == 1) {
      query = "addresses/get-countries";

    } else if (id == 2) {
      query = "addresses/get-regions";
    }
    else if (id == 3) {
      query = "addresses/get-cities";
    }
    else if (id == 4) {
      query = "addresses/get-districts";
    }
    else if (id == 5) {
      query = "addresses/get-tax-offices";
    }
    if (upperCode) {
      const response = await this.client
        .get<Address_VM>({ controller: query }, upperCode)
        .toPromise();
      return response;
    } else {
      const response = await this.client
        .get<Address_VM>({ controller: query })
        .toPromise();
      return response;
    }

  }

}
