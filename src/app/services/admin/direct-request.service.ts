import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { FailedTransaction } from 'src/app/models/model/order/failedTransaction';
import { DirectRequest } from 'src/app/models/model/nebim/directRequest';

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
  async directRequest(request: DirectRequest): Promise<any> {
    try {
      var response = await this.httpClientService.post<DirectRequest>({ controller: "direct-request/send-nebim-request" }, request).toPromise();
      return response;
    } catch (error: any) {
      // console.log(error.message);
      return null;
    }
  }
}
