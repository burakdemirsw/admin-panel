import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { FailedTransaction } from 'src/app/models/model/order/failedTransaction';

@Injectable({
  providedIn: 'root'
})
export class DirectRequestService {
  constructor(private httpClientService: HttpClientService) { }

  async getRecentFailedTransactions(): Promise<FailedTransaction[]> {
    try {
      var response = await this.httpClientService.get<any>({ controller: "direct-request/get-recent-failed-transactions" }).toPromise();
      return response;
    } catch (error: any) {
      // console.log(error.message);
      return null;
    }
  }

  async updateShelfStock(): Promise<boolean> {
    try {
      var response = await this.httpClientService.get_new<any>({ controller: "direct-request/update-shelf-stock" }).toPromise();
      return response;
    } catch (error: any) {
      // console.log(error.message);
      return null;
    }
  }

}
