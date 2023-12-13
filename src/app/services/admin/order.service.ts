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
import { SaleOrderModel } from 'src/app/models/model/order/saleOrderModel';
import { CreatePurchaseInvoice } from 'src/app/models/model/invoice/createPurchaseInvoice';
import { ProductCountModel } from 'src/app/models/model/shelfNameModel';
import { HttpClient } from '@angular/common/http';
import { ClientUrls } from 'src/app/models/const/ClientUrls';
import { OrderFilterModel } from 'src/app/models/model/filter/orderFilterModel';
import { WarehouseOperationProductModel } from 'src/app/models/model/warehouse/warehouseOperationProductModel';
import { InventoryItem } from 'src/app/models/model/product/inventoryItemModel';
import { TransferRequestListModel } from 'src/app/models/model/warehouse/transferRequestListModel';
import { InventoryResponseModel } from 'src/app/models/model/order/inventoryResponseModel';
import { CountConfirmData } from 'src/app/models/model/product/countConfirmModel';
import { int } from '@zxing/library/esm/customTypings';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(
    private alertifyService: AlertifyService,
    private httpClientService: HttpClientService,
    private router: Router,
    private httpClient: HttpClient
  ) {}

  //satış siparişleri çekme //exec GET_MSRAFOrderList
  async getOrders(): Promise<SaleOrderModel[]> {
    try {
      const response = this.httpClientService
        .get<SaleOrderModel>({
          controller: 'Order',
        })
        .toPromise();
      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }

 

  async getPurchaseOrdersByFilter(model:OrderFilterModel): Promise<SaleOrderModel[]> {
    try {
      const response = this.httpClientService
        .post<any>({
          controller: 'Order/GetPurchaseOrdersByFilter',
        },model)
        .toPromise();
      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }

  async getOrdersByFilter(model: OrderFilterModel): Promise<SaleOrderModel[]> {
    try {
      const response = this.httpClientService
        .post<any>({
          controller: 'Order/GetOrdersByFilter',
        },model)
        .toPromise();
      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }



  //alış siparişlerini çekme GET_MSRAFSalesOrderDetailBP
  getPurchaseOrders(): Promise<any> {
    try {
      const response = this.httpClientService
        .get<SaleOrderModel>({
          controller: 'Order/GetPurchaseOrders',
        })
        .toPromise();

      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }
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
        endpoint = 'Order/GetPurchaseOrderSaleDetail/'; //GET_MSRAFSalesOrderDetailBP
      } else if (orderNoType === 'WT') {
        endpoint = 'Warehouse/GetWarehouseOperationDetail/'; //Usp_GETTransferOnayla
      } else if (orderNoType === 'WS') {
        endpoint = 'Order/GetOrderSaleDetail/'; //GET_MSRAFSalesOrderDetail
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
  async confirmTransfer(operationNumberList: string[]): Promise<boolean> {
    const response = await  this.httpClientService
      .post<any>(
        {
          controller: 'Warehouse/ConfirmOperation',
        },
        operationNumberList
      )
      .toPromise();
      if(response===true){
        return true;

      }else{
        return false
      }
  }
  //faturalaştırma ve yazdırma
  async collectAndPack(
    list: ProductOfOrder[],
    orderNo: string
  ): Promise<boolean> {
    try {
      const model: OrderBillingRequestModel = new OrderBillingRequestModel();
      model.orderNo = orderNo;
      model.invoiceType = false;

      if (orderNo.includes('WS')) {
        model.invoiceModel = 4; // satış sipariş faturası
      } else if (orderNo.includes('BP')) {
        model.invoiceModel = 2; // alış sipariş faturası -- BP
      } else if (orderNo.includes('WT')) {
        return false;
      } else {
        return false;
      }

      const response = await this.httpClientService
        .post<OrderBillingRequestModel>(
          {
            controller: 'Order/CollectAndPack/' + model,
          },
          model
        )
        .toPromise();  
        if (response) {
       
          if (Boolean(response) == true) {
            this.alertifyService.success('İşlem Başarılı');

            if (orderNo.includes('WS')) {
              this.router.navigate(['/orders-managament']);
            } else if (orderNo.includes('BP')) {
              this.router.navigate(['/purchase-orders-managament']);
            } else if (orderNo.includes('WT')) {
              this.router.navigate(['/warehouse-operation-list']);
            } 
           
            return true;

          } else {
            this.alertifyService.error('İşlem Başarısız');
            location.reload();
            return false;
          }
        }
    } catch (error: any) {
      console.log(error.message);
      return false;
    }
    return false;
  }

  //sipariş numarasına göre transfer yapma 

  async postModel(orderNo :string, ):Promise <any> {
    let innerNumber: string;


  

      // let model: WarehouseOperationProductModel =
      //   new WarehouseOperationProductModel();
      // model.barcode = this.warehouseConfirmForm.get('barcode')?.value;
      // model.batchCode =
      //   this.barcodeModel == undefined ? 'null' : this.barcodeModel.party;
      // model.quantity = (
      //   this.fistQtyNumber - this.totalProductNumber
      // ).toString();
      // model.shelfNumber = this.warehouseConfirmForm.get('shelfNo')?.value;
      // model.warehouse =
      //   localStorage.getItem('currentWarehouse')?.toString() || '';
      // model.innerNumber = innerNumber;
      // try {
      //   this.httpClientService
      //     .post<WarehouseOperationProductModel>(
      //       {
      //         controller: 'Warehouse/SendNebımToTransferProduct',
      //       },
      //       model
      //     )
      //     .subscribe((data) => {
      //       console.log(data);
      //     });
      // } catch (error: any) {
      //   console.log(error.message);
      // }
      // Diğer işlemler...
 
  }
  //alış fatura oluşturma
  async createPurchaseInvoice(
    array: any[],
    orderNo: string,
    isReturn: boolean,
    invoiceType : int
  ): Promise<any> {
    //alış faturası oluştur
    
      try {
        var model: OrderBillingRequestModel = new OrderBillingRequestModel();
        model.orderNo = orderNo;
        model.invoiceType = isReturn;
        model.invoiceModel = invoiceType;
        const data = await this.httpClientService
          .post<OrderBillingRequestModel>(
            {
              controller: 'Order/CollectAndPack/' + model,
            },
            model
          )
          .toPromise();
        if (data) {
          this.router.navigate(['/orders-management']);
          this.alertifyService.success('Faturalaştırma İşlemi Başarılı')
          return data;
        }
      } catch (error: any) {
        this.alertifyService.error('An error occurred:' + error.message);
        return false;
      }
 
  }
async createSaleInvoice(  array: any[],
  orderNo: string,
  isReturn: boolean,
  salesPersonCode: string,
  currency :string):Promise<any>{
  if (array.length === 0 ) {
    this.alertifyService.warning('Lütfen Ürün EKleyiniz.');
    return;  
  }
  
  else {
    try {
      var model : OrderBillingRequestModel = new OrderBillingRequestModel();
      model.orderNo = orderNo;
      model.invoiceType = isReturn;
      model.invoiceModel = 3  ; //satış faturası
      model.salesPersonCode = salesPersonCode; 
      model.currency = currency; 

      const data = await this.httpClientService
        .post<OrderBillingRequestModel>(
          {
            controller: 'Order/CollectAndPack/' + model,
          },
          model
        )
        .toPromise();
       if(data){
         this.router.navigate(['orders-managament']);
         
         return data;
        
       }else{
        this.alertifyService.error("İşlem Başarısız")
        return null;
       }
    } catch (error: any) {
      
      return null;
    }
  }
}
// alış fatura doğrulama 

  async purchaseInvoiceProductCheck(
    model: CreatePurchaseInvoice
  ): Promise<any> {
    try {
      const response = this.httpClient
        .post<ProductCountModel | any>(
          ClientUrls.baseUrl +
            '/Order/CountProductPurchase',
          model
        )
        .toPromise();
      if (response) {
        console.log(response);
        if (Boolean(response) == true) {
         
        } else {
          
          location.reload();
        }
      }
      return response;
    } catch (error: any) {
      this.alertifyService.error('An error occurred:' + error.message);
      return null;
    }
  }

  async  deleteInvoiceProducts(orderNumber:string):Promise<any> {
    try {
      const result = await this.httpClientService
        .get<any>(
          {
            controller: 'Order/DeleteInvoiceProducts/'+orderNumber,
          }
          
        )
        .toPromise();

        return result;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }

    //onaylanacak ürünleri çekme
    getInventoryItems(): Promise<InventoryItem[]> {
      try {
        const response = this.httpClientService
          .get<InventoryItem>({
            controller: 'Order/InventoryItems',
          })
          .toPromise();
  
        return response;
      } catch (error: any) {
        console.log(error.message);
        return null;
      }
    }
    async getInventoryFromOrderNumber(orderNo :string): Promise<CountConfirmData[]> {
      try {
        const response = this.httpClientService
          .get<CountConfirmData>({
            controller: 'Order/GetInventoryFromOrderNumber/'+orderNo,
          })
          .toPromise();
        return response;
      } catch (error: any) {
        console.log(error.message);
        return null;
      }
    }

    async setInventoryByOrderNumber(orderNo :string): Promise<CountConfirmData[]> {
      try {
        const response = this.httpClientService
          .get<CountConfirmData>({
            controller: 'Order/SetInventoryByOrderNumber/'+orderNo,
          })
          .toPromise();
        return response;
      } catch (error: any) {
        console.log(error.message);
        return null;
      }
    }
}
