import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BankHeader } from 'src/app/models/model/invoice/BankHeader';
import { BankLine } from 'src/app/models/model/invoice/BankLine';
import { NebimResponse } from 'src/app/models/model/invoice/CashLine';
import { HttpClientService } from '../http-client.service';
import { ToasterService } from '../ui/toaster.service';
import { BankHeader_VM } from 'src/app/models/model/invoice/BankHeader_VM';

@Injectable({
  providedIn: 'root'
})
export class BankService {

  constructor(
    private toasterService: ToasterService,
    private httpClientService: HttpClientService,
    private router: Router,
    private httpClient: HttpClient
  ) { }


  // Bank Header'ı almak için
  async getBankHeaders(): Promise<BankHeader_VM[]> {
    const response = await this.httpClientService
      .get<BankHeader_VM>({
        controller: 'Banks/get-bank-header-list'
      })
      .toPromise();

    return response;
  }


  async completeBankPayment(request: string): Promise<NebimResponse> {
    const response = await this.httpClientService
      .get_new<NebimResponse>(
        { controller: 'Banks/complete-bank-payment' },
        request
      )
      .toPromise();

    return response;
  }


  async getBankHeaderById(id: string): Promise<BankHeader> {
    const response = await this.httpClientService
      .get_new<BankHeader>(
        { controller: 'Banks/get-bank-header-by-id' },
        id
      )
      .toPromise();

    return response;
  }

  async editBankHeader(request: BankHeader): Promise<BankHeader> {
    const response = await this.httpClientService
      .post<BankHeader>(
        { controller: 'Banks/edit-bank-header' },
        request
      )
      .toPromise();

    return response;
  }

  async deleteBankHeader(id: string): Promise<boolean> {
    const response = await this.httpClientService
      .get_new<boolean>(
        { controller: 'Banks/delete-bank-header' },
        id
      )
      .toPromise();

    return response;
  }

  async addBankLine(request: BankLine): Promise<boolean> {
    const response = await this.httpClientService
      .post<boolean>(
        { controller: 'Banks/add-bank-line' },
        request
      )
      .toPromise();

    return response;
  }

  async updateBankLine(request: BankLine): Promise<boolean> {
    const response = await this.httpClientService
      .post<boolean>(
        { controller: 'Banks/update-bank-line' },
        request
      )
      .toPromise();

    return response;
  }

  async deleteBankLine(id: string): Promise<boolean> {
    const response = await this.httpClientService
      .get_new<boolean>(
        { controller: 'Banks/delete-bank-line' },
        id
      )
      .toPromise();

    return response;
  }

  async getBankLinesByHeaderId(bankHeaderId: string): Promise<BankLine[]> {
    const response = await this.httpClientService
      .get<BankLine>(
        { controller: 'Banks/get-bank-lines' },
        bankHeaderId
      )
      .toPromise();

    return response;
  }

}
