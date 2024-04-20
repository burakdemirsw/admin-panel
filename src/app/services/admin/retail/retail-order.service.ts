import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CountListModel } from 'src/app/models/model/product/countListModel';
import { HttpClientService } from '../../http-client.service';
import { ToasterService } from '../../ui/toaster.service';
import { int } from '@zxing/library/esm/customTypings';
import { InvoiceOfCustomer_VM } from 'src/app/models/model/invoice/invoiceOfCustomer_VM';
import { OrderBillingRequestModel } from 'src/app/models/model/invoice/orderBillingRequestModel';
import { ProductOfOrder } from 'src/app/models/model/order/productOfOrders';
import { CreatePurchaseInvoice } from 'src/app/models/model/invoice/createPurchaseInvoice';
import { SalesPersonModel } from 'src/app/models/model/order/salesPersonModel';

@Injectable({
  providedIn: 'root'
})
export class RetailOrderService {

  constructor(
    private toasterService: ToasterService,
    private httpClientService: HttpClientService,
    private router: Router,
    private httpClient: HttpClient
  ) { }

  async getInvoiceList(): Promise<CountListModel[]> {
    const data = await this.httpClientService
      .get<CountListModel>({ controller: 'Order/Retail/GetInvoiceList' }) //Get_InvoicesList
      .toPromise();
    return data;
  }

  async collectAndPack(
    list: ProductOfOrder[],
    orderNo: string,
    taxedOrTaxtFree?: int,
    invoiceOfCustomer?: InvoiceOfCustomer_VM
  ): Promise<boolean> {
    try {
      const model: OrderBillingRequestModel = new OrderBillingRequestModel();
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
      } else {
        return false;
      }

      const response = await this.httpClientService
        .post<OrderBillingRequestModel>(
          {
            controller: 'Order/Retail/CollectAndPack/' + model,
          },
          model
        )
        .toPromise();
      if (response) {

        if (Boolean(response) == true) {
          this.toasterService.success('İşlem Başarılı');

          if (orderNo.includes('WS')) {
            return true;
          } else if (orderNo.includes('BP')) {
            this.router.navigate(['/purchase-orders-managament']);
          } else if (orderNo.includes('WT')) {
            this.router.navigate(['/warehouse-operation-list']);
          }

          return true;

        } else {
          this.toasterService.error('İşlem Başarısız');
          location.reload();
          return false;
        }
      }
    } catch (error: any) {
      // console.log(error.message);
      return false;
    }
    return false;
  }


  //faturanın ürünlerini getirme
  async getProductOfInvoice(orderNo: string): Promise<CreatePurchaseInvoice[]> {
    const response = await this.httpClientService
      .get<CreatePurchaseInvoice>(
        { controller: 'Order/Retail/GetProductOfInvoice' }, //Get_ProductOfInvoice
        orderNo
      )
      .toPromise();

    return response;
  }


  async getSalesPersonModels(): Promise<SalesPersonModel[]> {

    var response = await this.httpClientService
      .get<SalesPersonModel>({
        controller: 'Order/Retail/GetSalesPersonModels',
      })
      .toPromise();

    return response;

  }


}
