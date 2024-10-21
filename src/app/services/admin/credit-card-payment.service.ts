import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NebimResponse } from 'src/app/models/model/invoice/CashLine';
import { HttpClientService } from '../http-client.service';
import { ToasterService } from '../ui/toaster.service';
import { CreditCardPaymentHeader, CreditCardPaymentLine } from 'src/app/models/model/invoice/CreditCardPaymentHeader';
import { CreditCardPaymentHeader_VM } from 'src/app/models/model/invoice/CreditCardPaymentHeader_VM';

@Injectable({
  providedIn: 'root'
})
export class CreditCardPaymentService {

  constructor(
    private toasterService: ToasterService,
    private httpClientService: HttpClientService,
    private router: Router,
    private httpClient: HttpClient
  ) { }

  // Credit Card Payment Header listesini almak için
  async getCreditCardPaymentHeaders(): Promise<CreditCardPaymentHeader_VM[]> {
    const response = await this.httpClientService
      .get<CreditCardPaymentHeader_VM>({
        controller: 'CreditCardPayments/get-credit-card-payment-header-list'
      })
      .toPromise();
    return response;
  }

  // Credit Card Payment işlemi tamamlamak için
  async completeCreditCardPayment(id: string): Promise<NebimResponse> {
    const response = await this.httpClientService
      .get_new<NebimResponse>(
        { controller: 'CreditCardPayments/complete-credit-card-payment' },
        id
      )
      .toPromise();

    return response;
  }

  // ID'ye göre Credit Card Payment Header almak için
  async getCreditCardPaymentHeaderById(id: string): Promise<CreditCardPaymentHeader> {
    const response = await this.httpClientService
      .get_new<CreditCardPaymentHeader>(
        { controller: 'CreditCardPayments/get-credit-card-payment-header-by-id' },
        id
      )
      .toPromise();

    return response;
  }

  // Credit Card Payment Header düzenlemek için
  async editCreditCardPaymentHeader(request: CreditCardPaymentHeader): Promise<CreditCardPaymentHeader> {
    const response = await this.httpClientService
      .post<CreditCardPaymentHeader>(
        { controller: 'CreditCardPayments/edit-credit-card-payment-header' },
        request
      )
      .toPromise();

    return response;
  }

  // Credit Card Payment Header silmek için
  async deleteCreditCardPaymentHeader(id: string): Promise<boolean> {
    const response = await this.httpClientService
      .get_new<boolean>(
        { controller: 'CreditCardPayments/delete-credit-card-payment-header' },
        id
      )
      .toPromise();

    return response;
  }

  // Credit Card Payment Line eklemek için
  async addCreditCardPaymentLine(request: CreditCardPaymentLine): Promise<boolean> {
    const response = await this.httpClientService
      .post<boolean>(
        { controller: 'CreditCardPayments/add-credit-card-payment-line' },
        request
      )
      .toPromise();

    return response;
  }

  // Credit Card Payment Line güncellemek için
  async updateCreditCardPaymentLine(request: CreditCardPaymentLine): Promise<boolean> {
    const response = await this.httpClientService
      .post<boolean>(
        { controller: 'CreditCardPayments/update-credit-card-payment-line' },
        request
      )
      .toPromise();

    return response;
  }

  // Credit Card Payment Line silmek için
  async deleteCreditCardPaymentLine(id: string): Promise<boolean> {
    const response = await this.httpClientService
      .get_new<boolean>(
        { controller: 'CreditCardPayments/delete-credit-card-payment-line' },
        id
      )
      .toPromise();

    return response;
  }

  // Header ID'ye göre Credit Card Payment Line listesi almak için
  async getCreditCardPaymentLinesByHeaderId(headerId: string): Promise<CreditCardPaymentLine[]> {
    const response = await this.httpClientService
      .get<CreditCardPaymentLine>(
        { controller: 'CreditCardPayments/get-credit-card-payment-lines' },
        headerId
      )
      .toPromise();

    return response;
  }
}
