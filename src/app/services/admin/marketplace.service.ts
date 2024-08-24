import { Injectable } from '@angular/core';
import { HeaderService } from './header.service';
import { CargoService } from './cargo.service';
import { ToasterService } from '../ui/toaster.service';
import { HttpClientService } from '../http-client.service';
import { SaleOrderModel } from 'src/app/models/model/order/saleOrderModel';
import { TransferredOrder } from '../../models/model/marketplace/transferredOrder';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {

  constructor(private headerService: HeaderService, private toasterService: ToasterService, private cargoService: CargoService,
    private httpClientService: HttpClientService
  ) { }


  async updateIdeasoftOrderStatus(orders: SaleOrderModel[]) {

    //orderlar içinde ordernumber değeri R ile başlıyorsa retailOrderIds dizisine ekle
    var retailOrderIds: string[] = orders.filter(order => order.orderNumber.includes('R')).map(order => order.description);
    //orderlar içinde ordernumber değeri R ile başlamıyorsa wholesaleOrderIds dizisine ekle
    var wholesaleOrderIds: string[] = orders.filter(order => !order.orderNumber.includes('R')).map(order => order.description);

    if (retailOrderIds.length > 0) {
      const response = this.httpClientService
        .post<any>({
          controller: 'marketplaces/update-ideasoft-order-status-r',
        }, retailOrderIds)
        .toPromise();
      if (response) {
        this.toasterService.success("Toptan Sipariş durumları güncellendi.");
      }
    }

    if (wholesaleOrderIds.length > 0) {
      const response = this.httpClientService
        .post<any>({
          controller: 'marketplaces/update-ideasoft-order-status-w',
        }, wholesaleOrderIds)
        .toPromise();
      if (response) {
        this.toasterService.success("Perakende Sipariş durumları güncellendi.");
      }
    }
    return true;

  }

  async getTransferredOrders(): Promise<TransferredOrder[]> {
    return await this.httpClientService.get<TransferredOrder>({ controller: "Marketplaces/get-transferred-orders" }).toPromise();
  }
  async changeTransferredOrderStatus(id: string, status: boolean): Promise<boolean> {
    return await this.httpClientService.get_new<boolean>({ controller: "Marketplaces/change-transferred-order-status" + "/" + id + "/" + status }).toPromise();
  }
}
