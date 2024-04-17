import { Injectable } from '@angular/core';
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
import { InvoiceOfCustomer_VM } from 'src/app/models/model/invoice/invoiceOfCustomer_VM';
import { GetCustomerAddress_CM, GetCustomerList_CM } from 'src/app/models/model/order/getCustomerList_CM';
import { CreateCustomer_CM, AddCustomerAddress_CM } from '../../components/Order/create-order/models/createCustomer_CM';
import { ClientOrder, ClientOrderBasketItem, ClientOrder_DTO, NebimInvoice, NebimOrder, NebimOrder_2 } from 'src/app/components/Order/create-order/models/nebimOrder';
import { query } from '@angular/animations';
import { ToasterService } from '../ui/toaster.service';
import { ClientCustomer } from '../../components/Customer/customer-list/customer-list.component';
import { Raport_CR } from 'src/app/models/model/raport/raport_CR';
import { ExchangeRate } from 'src/app/models/model/order/exchangeRate';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(
    private toasterService: ToasterService,
    private httpClientService: HttpClientService,
    private router: Router,
    private httpClient: HttpClient
  ) { }

  //satış siparişleri çekme //exec GET_MSRAFOrderList
  async getOrders(type: number, invoiceStatus: number): Promise<SaleOrderModel[]> {
    try {
      var query: string = `${type}/${invoiceStatus}`
      const response = this.httpClientService
        .get<SaleOrderModel>({
          controller: 'order/get-sale-orders',
        }, query)
        .toPromise();
      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }

  async getMissingOrders(): Promise<SaleOrderModel[]> {
    try {
      const response = this.httpClientService
        .get<SaleOrderModel>({
          controller: 'order/get-orders-with-missing-items',
        })
        .toPromise();
      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }



  async getPurchaseOrdersByFilter(model: OrderFilterModel): Promise<SaleOrderModel[]> {
    try {
      const response = this.httpClientService
        .post<any>({
          controller: 'Order/GetPurchaseOrdersByFilter',
        }, model)
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
        }, model)
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
          this.toasterService.success('Success');
          window.location.reload();
        },
        error: (err) => {
          if (err.status === 400) {
            this.toasterService.warn(err.error);
          } else {
            this.toasterService.warn(err.message);
          }
        },
      });
    return true;
  }
  //toplanacak ürünleri çeker
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
      } else if (orderNoType === 'MIS') {
        endpoint = 'Order/get-missing-products-of-order/'; //GET_MSRAFOrderListMissing
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
    const response = await this.httpClientService
      .post<any>(
        {
          controller: 'Warehouse/ConfirmOperation',
        },
        operationNumberList
      )
      .toPromise();
    if (response === true) {
      return true;

    } else {
      return false
    }
  }
  //faturalaştırma ve yazdırma
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
            controller: 'Order/CollectAndPack/' + model,
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
      console.log(error.message);
      return false;
    }
    return false;
  }

  //sipariş numarasına göre transfer yapma

  async postModel(orderNo: string,): Promise<any> {
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
    invoiceType: int
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
        this.toasterService.success('Faturalaştırma İşlemi Başarılı')
        return data;
      }
    } catch (error: any) {
      this.toasterService.error('An error occurred:' + error.message);
      return false;
    }

  }
  async createSaleInvoice(array: any[],
    orderNo: string,
    isReturn: boolean,
    salesPersonCode: string,
    currency: string): Promise<any> {
    if (array.length === 0) {
      this.toasterService.warn('Lütfen Ürün EKleyiniz.');
      return;
    }

    else {
      try {
        var model: OrderBillingRequestModel = new OrderBillingRequestModel();
        model.orderNo = orderNo;
        model.invoiceType = isReturn;
        model.invoiceModel = 3; //satış faturası
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
        if (data) {
          this.router.navigate(['orders-managament']);

          return data;

        } else {
          this.toasterService.error("İşlem Başarısız")
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
      this.toasterService.error('An error occurred:' + error.message);
      return null;
    }
  }

  async deleteInvoiceProducts(orderNumber: string): Promise<any> {
    try {
      const result = await this.httpClientService
        .get<any>(
          {
            controller: 'Order/DeleteInvoiceProducts/' + orderNumber,
          }

        )
        .toPromise();

      return result;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }

  async createOrder(order: NebimOrder): Promise<any> {
    try {
      var response = await this.httpClientService.post<NebimOrder>({ controller: "order/create-order" }, order).toPromise();

      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }


  async createOrder2(order: NebimOrder_2): Promise<any> {
    try {
      var response = await this.httpClientService.post<NebimOrder>({ controller: "order/create-order-2" }, order).toPromise();

      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }
  async createInvoice(request: NebimInvoice): Promise<any> {
    try {
      var response = await this.httpClientService.post<NebimInvoice>({ controller: "order/create-sale-invoice" }, request).toPromise();

      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }
  //onaylanacak ürünleri çekme
  getInventoryItems(type: string): Promise<InventoryItem[]> {
    try {
      const response = this.httpClientService
        .get<InventoryItem>({
          controller: 'Order/InventoryItems/' + type,
        })
        .toPromise();

      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }
  async getInventoryFromOrderNumber(orderNo: string): Promise<CountConfirmData[]> {
    try {
      const response = this.httpClientService
        .get<CountConfirmData>({
          controller: 'Order/GetInventoryFromOrderNumber/' + orderNo,
        })
        .toPromise();
      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }

  async setInventoryByOrderNumber(orderNo: string): Promise<CountConfirmData[]> {
    try {
      const response = this.httpClientService
        .get<CountConfirmData>({
          controller: 'Order/SetInventoryByOrderNumber/' + orderNo,
        })
        .toPromise();
      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }

  async addMissingProduct(product: ProductOfOrder): Promise<any> {
    try {
      var response = await this.httpClientService.post<ProductOfOrder>({ controller: "order/destroy-item" }, product).toPromise();

      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }


  async deleteMissingProduct(orderNumber: string, barcode: string): Promise<any> {
    try {
      var response = await this.httpClientService.get<ProductOfOrder>({ controller: "order/delete-missing-item" + "/" + orderNumber + "/" + barcode }).toPromise();

      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }

  async getInvoicesOfCustomer(orderNumber: string): Promise<InvoiceOfCustomer_VM[]> {
    try {
      var response = await this.httpClientService.get<InvoiceOfCustomer_VM>({ controller: "order/get-invoices-of-customer" + "/" + orderNumber }).toPromise();

      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }

  async getCustomerList_2(request: GetCustomerList_CM): Promise<any> {
    try {
      var response = await this.httpClientService.post<GetCustomerList_CM>({ controller: "order/get-customer-list-2" }, request).toPromise();

      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }

  async getCustomerAddress(request: GetCustomerAddress_CM): Promise<any> {
    try {
      var response = await this.httpClientService.post<GetCustomerAddress_CM>({ controller: "order/get-customer-address" }, request).toPromise();

      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }

  async createCustomer(request: CreateCustomer_CM): Promise<any> {
    try {
      var response = await this.httpClientService.post<CreateCustomer_CM>({ controller: "order/create-customer" }, request).toPromise();

      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }


  async getClientOrder(id: string): Promise<any> {
    try {
      var response = await this.httpClientService.get<any>({ controller: "order/get-client-order" + "/" + id }).toPromise();

      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }




  async getClientOrders(isCompleted: boolean): Promise<any> {
    try {
      var response = await this.httpClientService.get<ClientOrder>({ controller: "order/get-client-orders" }, isCompleted.toString()).toPromise();

      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }


  asyn
  async createClientOrder(request: ClientOrder) {
    try {
      var response = await this.httpClientService.post<ClientOrder>({ controller: "order/create-client-order" }, request).toPromise();

      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }

  async createClientOrderBasketItem(request: ClientOrderBasketItem) {
    try {
      var response = await this.httpClientService.post<ClientOrderBasketItem>({ controller: "order/create-client-order-basket-item" }, request).toPromise();

      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }


  async updateClientOrderBasketItem(id: string, lineId: string, quantity: number, price: number, discountedPrice: number, basePrice: number): Promise<any> {
    try {

      var query = `${id}/${lineId}/${quantity}/${price}/${discountedPrice}/${basePrice}`
      var response = await this.httpClientService.get<any>({ controller: "order/update-client-order-basket-item" + "/" + query }).toPromise();

      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }

  async updateClientOrderPayment(orderId: string, paymentDescription: string): Promise<any> {
    try {

      var query = `${orderId}/${paymentDescription}`
      var response = await this.httpClientService.get<any>({ controller: "order/update-client-order-payment" + "/" + query }).toPromise();

      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }

  async editClientCustomer(request: ClientCustomer): Promise<any> {
    try {
      var response = await this.httpClientService.post<any>({ controller: "order/edit-client-customer" }, request).toPromise();
      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }

  async getClientCustomer(salesPersonCode: string): Promise<any> {
    try {
      var response = await this.httpClientService.get<any>({ controller: "order/get-client-customer" }, salesPersonCode).toPromise();

      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }


  async getOrderDetail(orderNumber: string): Promise<any> {
    try {
      var response = await this.httpClientService.get<any>({ controller: "order/get-order-detail" + "/" + orderNumber }).toPromise();

      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }

  async deleteClientOrder(id: string): Promise<any> {
    try {

      var response = await this.httpClientService.get<any>({ controller: "order/delete-client-order" + "/" + id }).toPromise();

      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }
  async deleteClientOrderBasketItem(orderId: string, lineId: string): Promise<any> {
    try {
      var query = `${orderId}/${lineId}`

      var response = await this.httpClientService.get<any>({ controller: "order/delete-client-order-basket-item" }, query).toPromise();

      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }

  async addCustomerAddress(request: AddCustomerAddress_CM): Promise<any> {
    try {
      var response = await this.httpClientService.post<any>({ controller: "order/add-customer-address" }, request).toPromise();

      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }

  async getRaports(day: number): Promise<any> {
    try {
      const response = this.httpClientService
        .get<any>({
          controller: 'order/get-raports',
        }, day.toString())
        .toPromise();
      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }


  }

  async getExchangeRates(): Promise<any> {
    try {
      const response = await this.httpClientService
        .get<ExchangeRate>({
          controller: 'order/get-exchange-rates',
        })
        .toPromise();
      return response[0];
    } catch (error: any) {
      console.log(error.message);
      return null;
    }


  }


  //ExecuteSqlRawAsync
}
