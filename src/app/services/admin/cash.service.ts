import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CashHeader } from 'src/app/models/model/invoice/CashHeader';
import { NebimResponse, CashLine } from 'src/app/models/model/invoice/CashLine';
import { HttpClientService } from '../http-client.service';
import { ToasterService } from '../ui/toaster.service';
import { CashHeader_VM } from 'src/app/models/model/invoice/CashHeader_VM';

@Injectable({
  providedIn: 'root'
})
export class CashService {

  constructor(
    private toasterService: ToasterService,
    private httpClientService: HttpClientService,
    private router: Router,
    private httpClient: HttpClient
  ) { }

  // Cash Header listesini almak için
  async getCashHeaders(): Promise<CashHeader_VM[]> {
    const response = await this.httpClientService
      .get<CashHeader_VM>({
        controller: 'Cashes/get-cash-header-list'
      })
      .toPromise();

    return response;
  }
  async completeCashPayment(request: string): Promise<NebimResponse> {
    const response = await this.httpClientService
      .get_new<NebimResponse>(
        { controller: 'Cashes/complete-cash-payment' },
        request
      )
      .toPromise();

    return response;
  }



  async getCashHeadersById(id: string): Promise<CashHeader> {
    const response = await this.httpClientService
      .get_new<CashHeader>(
        { controller: 'Cashes/get-cash-header-by-id' }, id
      )
      .toPromise();

    return response;
  }

  async editCashHeader(request: CashHeader): Promise<CashHeader> {
    const response = await this.httpClientService
      .post<CashHeader>(
        { controller: 'Cashes/edit-cash-header' },
        request
      )
      .toPromise();

    return response;
  }

  async deleteCashHeader(id: string): Promise<boolean> {
    const response = await this.httpClientService
      .get_new<boolean>(
        { controller: 'Cashes/delete-cash-header' },
        id
      )
      .toPromise();

    return response;
  }

  async addCashLine(request: CashLine): Promise<boolean> {
    const response = await this.httpClientService
      .post<boolean>(
        { controller: 'Cashes/add-cash-line' },
        request
      )
      .toPromise();

    return response;
  }

  async updateCashLine(request: CashLine): Promise<boolean> {
    const response = await this.httpClientService
      .post<boolean>(
        { controller: 'Cashes/update-cash-line' },
        request
      )
      .toPromise();

    return response;
  }

  async deleteCashLine(id: string): Promise<boolean> {
    const response = await this.httpClientService
      .get_new<boolean>(
        { controller: 'Cashes/delete-cash-line' },
        id
      )
      .toPromise();

    return response;
  }

  async getCashLinesByHeaderId(cashHeaderId: string): Promise<CashLine[]> {
    const response = await this.httpClientService
      .get<CashLine>(
        { controller: 'Cashes/get-cash-lines' },
        cashHeaderId
      )
      .toPromise();

    return response;
  }
}
