import { Injectable } from '@angular/core';
import { HeaderService } from './header.service';
import { CargoService } from './cargo.service';
import { ToasterService } from '../ui/toaster.service';
import { HttpClientService } from '../http-client.service';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {

  constructor(private headerService: HeaderService, private toasterService: ToasterService, private cargoService: CargoService,
    private httpClientService: HttpClientService
  ) { }


  async updateIdeasoftOrderStatus(idList: string[]) {

    idList.forEach(element => {
      if (element.includes('R')) {
        const response = this.httpClientService
          .post<any>({
            controller: 'marketplaces/update-ideasoft-order-status-r',
          }, idList)
          .toPromise();
        return response;
      } else {
        const response = this.httpClientService
          .post<any>({
            controller: 'marketplaces/update-ideasoft-order-status-r',
          }, idList)
          .toPromise();
        return response;
      }

    });

  }

}
