import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientService } from '../http-client.service';
import { ToasterService } from '../ui/toaster.service';
import { InvoiceOfCustomer_VM } from 'src/app/models/model/invoice/invoiceOfCustomer_VM';
import { CustomerModel } from 'src/app/models/model/customer/customerModel';
import { AddCustomerAddress_CM, CreateCustomer_CM } from 'src/app/models/model/order/createCustomer_CM';
import { GetCustomerList_CM, NebimCustomerDto, GetCustomerAddress_CM } from 'src/app/models/model/order/getCustomerList_CM';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(
    private toasterService: ToasterService,
    private httpClientService: HttpClientService,
    private router: Router,
    private httpClient: HttpClient
  ) { }




  async addCustomerAddress(request: AddCustomerAddress_CM): Promise<any> {
    try {
      var response = await this.httpClientService.post<any>({ controller: "Customers/add-customer-address" }, request).toPromise();

      return response;
    } catch (error: any) {
      // console.log(error.message);
      return null;
    }
  }
  async getCustomerList_2(request: GetCustomerList_CM): Promise<any> {
    try {
      var response = await this.httpClientService.post<GetCustomerList_CM>({ controller: "Customers/get-customer-list-2" }, request).toPromise();

      return response;
    } catch (error: any) {
      // console.log(error.message);
      return null;
    }
  }
  async deleteCustomerAddress(postalAddressID: string): Promise<any> {
    try {
      var response = await this.httpClientService.get_new<boolean>({ controller: "Customers/delete-customer-address" }, postalAddressID).toPromise();

      return response;
    } catch (error: any) {
      // console.log(error.message);
      return null;
    }
  }
  async deleteCustomerCommunication(communicationID: string): Promise<any> {
    try {
      var response = await this.httpClientService.get_new<boolean>({ controller: "Customers/delete-customer-communication" }, communicationID).toPromise();

      return response;
    } catch (error: any) {
      // console.log(error.message);
      return null;
    }
  }
  async getCustomerDetail(currAccCode: string): Promise<any> {
    try {
      var response = await this.httpClientService.get_new<NebimCustomerDto>({ controller: "Customers/get-customer-detail" }, currAccCode).toPromise();

      return response;
    } catch (error: any) {
      // console.log(error.message);
      return null;
    }
  }

  async getCustomerAddress(request: GetCustomerAddress_CM): Promise<any> {
    try {
      var response = await this.httpClientService.post<GetCustomerAddress_CM>({ controller: "Customers/get-customer-address" }, request).toPromise();

      return response;
    } catch (error: any) {
      // console.log(error.message);
      return null;
    }
  }

  async createCustomer(request: CreateCustomer_CM): Promise<any> {
    try {
      var response = await this.httpClientService.post<CreateCustomer_CM>({ controller: "Customers/create-customer" }, request).toPromise();

      return response;
    } catch (error: any) {
      // console.log(error.message);
      return null;
    }
  }


  async updateCustomer(request: CreateCustomer_CM): Promise<any> {
    try {
      var response = await this.httpClientService.post<CreateCustomer_CM>({ controller: "Customers/update-customer" }, request).toPromise();

      return response;
    } catch (error: any) {
      // console.log(error.message);
      return null;
    }
  }

  async getInvoicesOfCustomer(orderNumber: string): Promise<InvoiceOfCustomer_VM[]> {
    try {
      var response = await this.httpClientService.get<InvoiceOfCustomer_VM>({ controller: "Customers/get-invoices-of-customer" + "/" + orderNumber }).toPromise();

      return response;
    } catch (error: any) {
      // console.log(error.message);
      return null;
    }
  }
  //müşteri listesini çeker
  async getCustomerList(customerType: string): Promise<CustomerModel[]> {
    try {
      const data = await this.httpClientService
        .get<CustomerModel>({
          controller: 'Customers/CustomerList/' + customerType,
        })
        .toPromise();

      return data;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }




}
