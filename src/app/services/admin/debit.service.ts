import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NebimResponse } from 'src/app/models/model/invoice/CashLine';
import { DebitHeader } from 'src/app/models/model/invoice/DebitHeader';
import { DebitLine } from 'src/app/models/model/invoice/DebitLine';
import { HttpClientService } from '../http-client.service';
import { ToasterService } from '../ui/toaster.service';
import { DebitHeader_VM } from 'src/app/models/model/invoice/DebitHeader_VM';

@Injectable({
  providedIn: 'root'
})
export class DebitService {

  constructor(
    private toasterService: ToasterService,
    private httpClientService: HttpClientService,
    private router: Router,
    private httpClient: HttpClient
  ) { }


  // Debit Header'ı almak için
  async getDebitHeaders(): Promise<DebitHeader_VM[]> {
    const response = await this.httpClientService
      .get<DebitHeader_VM>({
        controller: 'Debits/get-debit-header-list'
      })
      .toPromise();

    return response;
  }

  async completeDebitPayment(request: string): Promise<NebimResponse> {
    const response = await this.httpClientService
      .get_new<NebimResponse>(
        { controller: 'Debits/complete-debit-payment' }, // Endpoint URL
        request
      )
      .toPromise();

    return response;
  }

  async getDebitHeaderById(id: string): Promise<DebitHeader> {
    const response = await this.httpClientService
      .get_new<DebitHeader>(
        { controller: 'Debits/get-debit-header-by-id' },
        id
      )
      .toPromise();

    return response;
  }

  async editDebitHeader(request: DebitHeader): Promise<DebitHeader> {
    const response = await this.httpClientService
      .post<DebitHeader>(
        { controller: 'Debits/edit-debit-header' },
        request
      )
      .toPromise();

    return response;
  }

  async deleteDebitHeader(id: string): Promise<boolean> {
    const response = await this.httpClientService
      .get_new<boolean>(
        { controller: 'Debits/delete-debit-header' },
        id
      )
      .toPromise();

    return response;
  }

  async addDebitLine(request: DebitLine): Promise<boolean> {
    const response = await this.httpClientService
      .post<boolean>(
        { controller: 'Debits/add-debit-line' },
        request
      )
      .toPromise();

    return response;
  }

  async updateDebitLine(request: DebitLine): Promise<boolean> {
    const response = await this.httpClientService
      .post<boolean>(
        { controller: 'Debits/update-debit-line' },
        request
      )
      .toPromise();

    return response;
  }

  async deleteDebitLine(id: string): Promise<boolean> {
    const response = await this.httpClientService
      .get_new<boolean>(
        { controller: 'Debits/delete-debit-line' },
        id
      )
      .toPromise();

    return response;
  }

  async getDebitLinesByHeaderId(debitHeaderId: string): Promise<DebitLine[]> {
    const response = await this.httpClientService
      .get<DebitLine>(
        { controller: 'Debits/get-debit-lines' },
        debitHeaderId
      )
      .toPromise();

    return response;
  }

}
