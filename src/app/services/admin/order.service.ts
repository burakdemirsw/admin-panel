import { Injectable } from '@angular/core';
import { AlertifyService } from '../ui/alertify.service';
import { BarcodeAddModel } from 'src/app/models/model/product/barcodeAddModel';
import { HttpClientService } from '../http-client.service';
import { SalesPersonModel } from 'src/app/models/model/order/salesPersonModel';
import { ProductOfOrder } from 'src/app/models/model/order/productOfOrders';
import { Observable } from 'rxjs/internal/Observable';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { OrderBillingRequestModel } from 'src/app/models/model/invoice/orderBillingRequestModel';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(
    private alertifyService: AlertifyService,
    private httpClientService: HttpClientService,
    private router: Router
  ) {}
  //sipariş ekleme
  addProductToOrder(model: BarcodeAddModel): boolean {
    this.httpClientService
      .post<BarcodeAddModel>(
        {
          controller: 'Order/Add',
        },
        model
      )
      .subscribe({
        next: (result) => {
          this.alertifyService.success('Success');
          window.location.reload();
        },
        error: (err) => {
          if (err.status === 400) {
            this.alertifyService.warning(err.error);
          } else {
            this.alertifyService.warning(err.message);
          }
        },
      });
    return true;
  }
  //toplanacak siparişleri çeker
  getCollectedProducts(
    orderNo: string,
    orderNoType: string
  ): Observable<ProductOfOrder[]> {
    try {
      let endpoint: string = '';

      if (orderNoType === 'BP') {
        endpoint = 'Order/GetPurchaseOrderSaleDetail/';
      } else if (orderNoType === 'WT') {
        endpoint = 'Warehouse/GetWarehouseOperationDetail/' + orderNo;
      } else if (orderNoType === 'WS') {
        endpoint = 'Order/GetOrderSaleDetail/';
      }

      return this.httpClientService.get<ProductOfOrder>({
        controller: endpoint + orderNo,
      });
    } catch (error: any) {
      console.log(error.message);
      throw error; // Rethrow the error if necessary
    }
  }
  //transferi onaylama
  confirmOperation(operationNumberList: string[]): Observable<boolean> {
    return this.httpClientService
      .post<string[]>(
        {
          controller: 'Warehouse/ConfirmOperation',
        },
        operationNumberList
      )
      .pipe(
        map((data) => {
          return true;
        }),
        catchError((error) => {
          console.error(error.message);

          return of(false);
        })
      );
  }
  //faturalaştırma ve yazdırma
  collectAndPack(list: ProductOfOrder[], orderNo: string): Observable<boolean> {
    try {
      var model: OrderBillingRequestModel = new OrderBillingRequestModel();
      model.orderNo = orderNo;
      model.invoiceType = false;

      if (orderNo.includes('WS')) {
        model.invoiceModel = 4; // satış sipariş faturası
      } else if (orderNo.includes('BP')) {
        model.invoiceModel = 1; // alış sipariş faturası
      } else if (orderNo.includes('WT')) {
        return of(false);
      } else {
        return of(false);
      }

      this.httpClientService
        .post<OrderBillingRequestModel>(
          {
            controller: 'Order/CollectAndPack/' + model,
          },
          model
        )
        .subscribe();
      return of(true);
    } catch (error: any) {
      console.log(error.message);
      return of(false); // Return false in case of an exception
    }
  }

}
