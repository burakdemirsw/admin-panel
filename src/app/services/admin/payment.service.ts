import { Injectable } from '@angular/core';
import { Payment_CM, Payment_CR } from 'src/app/models/model/payment/payment_CR';
import { HttpClientService } from '../http-client.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private client: HttpClientService) { }

  async getPaymentPage(request: Payment_CM): Promise<any> {

    var response = await this.client.post<Payment_CM>({ controller: "payments/paytr-payment" }, request).toPromise();

    return response;


  }
  async sendPaymentPage(request: Payment_CM): Promise<any> {

    var response = await this.client.post<Payment_CM>({ controller: "payments/paytr-sms" }, request).toPromise();

    return response;


  }
}
