import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientService } from '../http-client.service';
import { ToasterService } from '../ui/toaster.service';
import { int } from '@zxing/library/esm/customTypings';
import { InvocieFilterModel } from 'src/app/models/model/filter/invoiceFilterModel';
import { InvoiceOfCustomer_VM } from 'src/app/models/model/invoice/invoiceOfCustomer_VM';
import { OrderBillingRequestModel } from 'src/app/models/model/invoice/orderBillingRequestModel';
import { Invoice_VM, CountListModel } from 'src/app/models/model/product/countListModel';
import { CollectedInvoiceProduct } from 'src/app/models/model/invoice/CollectedInvoiceProduct';
import { InvoiceProcess } from 'src/app/models/model/invoice/InvoiceProcess';
import { ProductDetail_VM } from 'src/app/models/model/invoice/ProductDetail_VM';
import { ProductOfOrder } from 'src/app/models/model/order/productOfOrders';
import { ProcessPayment } from 'src/app/models/model/invoice/ProcessPayment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(
    private toasterService: ToasterService,
    private httpClientService: HttpClientService,
    private router: Router,
    private httpClient: HttpClient
  ) { }

  async getInvoiceList(processType: string, processCode: string, userId: number): Promise<Invoice_VM[]> {
    const data = await this.httpClientService
      .get<Invoice_VM>({ controller: 'invoices/get-process-list' }, processType + '/' + processCode + '/' + userId,) //Get_InvoicesList
      .toPromise();
    return data;
  }
  async getInvoiceListByFilter(
    model: InvocieFilterModel
  ): Promise<CountListModel[]> {
    const data = await this.httpClientService
      .post<any>({ controller: 'invoices/GetInvoiceListByFilter' }, model)
      .toPromise();
    return data;
  }

  //faturalaştırma ve yazdırma
  async collectAndPack(
    userType: number,
    list: ProductOfOrder[],
    orderNo: string,
    taxedOrTaxtFree?: int,
    invoiceOfCustomer?: InvoiceOfCustomer_VM,

  ): Promise<boolean> {
    try {
      const model: OrderBillingRequestModel = new OrderBillingRequestModel();
      model.userType = userType;
      model.orderNo = orderNo;
      model.invoiceType = false;
      model.taxedOrTaxtFree = taxedOrTaxtFree;

      if (orderNo.includes('WS')) {
        model.invoiceModel = 4; // satış sipariş faturası
      } else if (orderNo.includes('BP')) {
        model.invoiceModel = 2; // alış sipariş faturası -- BP

        model.eInvoiceNumber = invoiceOfCustomer.eInvoiceNumber;
        model.invoiceDate = invoiceOfCustomer.invoiceDate

      } else if (orderNo.includes('WT')) {
        return false;
      } else if (orderNo.includes('R')) {
        model.invoiceModel = 5;
      }
      else {
        return false;
      }

      const response = await this.httpClientService
        .post<OrderBillingRequestModel>(
          {
            controller: 'invoices/CollectAndPack/' + model,
          },
          model
        )
        .toPromise();
      if (response) {

        if (Boolean(response) == true) {
          this.toasterService.success('İşlem Başarılı');

          if (orderNo.includes('WS') || orderNo.includes('R')) {
            return true;
          } else if (orderNo.includes('BP')) {
            this.router.navigate(['/purchase-orders-managament']);
          } else if (orderNo.includes('WT')) {
            this.router.navigate(['/warehouse-operation-list']);
          }

          return true;

        } else {
          this.toasterService.error('İşlem Başarısız');

          return false;
        }
      }
    } catch (error: any) {
      return false;
    }
    return false;
  }
  async createProposal_New(processCode: string, processId: string) {
    const response = await this.httpClientService
      .get_new<boolean>(
        { controller: 'invoices/create-proposal' },
        processCode + "/" + processId
      )
      .toPromise();

    return response;
  }
  async createInvoice_New(processCode: string, processId: string) {
    const response = await this.httpClientService
      .get_new<boolean>(
        { controller: 'invoices/create-invoice' },
        processCode + "/" + processId
      )
      .toPromise();

    return response;
  }
  async convertWSProposalToWSOrder(processType: string, processCode: string, id: string) {
    const response = await this.httpClientService
      .get_new<boolean>(
        { controller: 'invoices/convert-ws-proposal-to-ws-order' },
        processType + "/" + processCode + "/" + id
      )
      .toPromise();

    return response;
  }
  async convertConfirmedWSProposalToWSOrder(processType: string, processCode: string, id: string) {
    const response = await this.httpClientService
      .get_new<boolean>(
        { controller: 'invoices/convert-confirmed-ws-proposal-to-ws-order' },
        processType + "/" + processCode + "/" + id
      )
      .toPromise();

    return response;
  }

  async createOrder_New(processCode: string, processId: string) {
    const response = await this.httpClientService
      .get_new<boolean>(
        { controller: 'invoices/create-order' },
        processCode + "/" + processId
      )
      .toPromise();

    return response;
  }
  async getProductDetailByPriceCode(processCode: string, barcode: string): Promise<ProductDetail_VM> {
    const response = await this.httpClientService
      .get_new<ProductDetail_VM>(
        { controller: 'invoices/get-product-detail' }, //Get_ProductOfInvoice
        processCode + '/' + barcode
      )
      .toPromise();

    return response;
  }
  async updateCollectedInvoiceProduct(request: CollectedInvoiceProduct): Promise<boolean> {
    const response = await this.httpClientService
      .post<boolean>(
        { controller: 'invoices/update-collected-invoice-product' }, //Get_ProductOfInvoice
        request
      )
      .toPromise();

    return response;
  }
  async addCollectedInvoiceProduct(request: CollectedInvoiceProduct): Promise<boolean> {
    const response = await this.httpClientService
      .post<boolean>(
        { controller: 'invoices/add-collected-invoice-product' }, //Get_ProductOfInvoice
        request
      )
      .toPromise();

    return response;
  }

  async getCollectedInvoiceProducts(orderNo: string): Promise<CollectedInvoiceProduct[]> {
    const response = await this.httpClientService
      .get<CollectedInvoiceProduct>(
        { controller: 'invoices/get-collected-invoice-product' }, //Get_ProductOfInvoice
        orderNo
      )
      .toPromise();

    return response;
  }


  async deleteCollectedInvoiceProduct(id: string): Promise<boolean> {
    const response = await this.httpClientService
      .get_new<boolean>(
        { controller: 'invoices/delete-collected-invoice-product' }, //Get_ProductOfInvoice
        id
      )
      .toPromise();

    return response;
  }

  async editInvoiceProcess(request: InvoiceProcess): Promise<InvoiceProcess> {
    const response = await this.httpClientService
      .post<InvoiceProcess>(
        { controller: 'invoices/edit-invoice-process' },
        request
      )
      .toPromise();

    return response;
  }

  async deleteInvoiceProcess(id: string): Promise<boolean> {
    const response = await this.httpClientService
      .get_new<boolean>(
        { controller: 'invoices/delete-invoice-process' },
        id
      )
      .toPromise();

    return response;
  }


  async getInvoiceProcessList(processCode: string, processId: string): Promise<InvoiceProcess[]> {
    const response = await this.httpClientService
      .get<InvoiceProcess>(
        { controller: 'invoices/get-invoice-process' },
        processCode + '/' + processId
      )
      .toPromise();

    return response;
  }


  async addProcessPayment(request: ProcessPayment): Promise<ProcessPayment> {
    const response = await this.httpClientService
      .post<ProcessPayment>(
        { controller: 'invoices/add-process-payment' },
        request
      )
      .toPromise();

    return response;
  }
  async updateProcessPayment(request: ProcessPayment): Promise<ProcessPayment> {
    const response = await this.httpClientService
      .post<ProcessPayment>(
        { controller: 'invoices/update-process-payment' },
        request
      )
      .toPromise();

    return response;
  }

  async deleteProcessPayment(id: string): Promise<boolean> {
    const response = await this.httpClientService
      .get_new<boolean>(
        { controller: 'invoices/delete-process-payment' },
        id
      )
      .toPromise();

    return response;
  }

  async getProcessPayments(processId: string): Promise<ProcessPayment[]> {
    const response = await this.httpClientService
      .get<ProcessPayment>(
        { controller: 'invoices/get-process-payments' },
        processId
      )
      .toPromise();

    return response;
  }




  async createWSWaybillFromOrder(orderNumber: string, warehouseCode: string) {
    const response = await this.httpClientService
      .get_new<boolean>(
        { controller: 'invoices/create-waybill-from-nebim-order' },
        orderNumber + "/" + warehouseCode
      )
      .toPromise();

    return response;
  }


}
