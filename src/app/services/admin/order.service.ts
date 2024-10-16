import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { int } from '@zxing/library/esm/customTypings';
import { Observable } from 'rxjs/internal/Observable';
import { ClientUrls } from 'src/app/models/const/ClientUrls';
import { InvocieFilterModel } from 'src/app/models/model/filter/invoiceFilterModel';
import { OrderFilterModel } from 'src/app/models/model/filter/orderFilterModel';
import { InvoiceProcess } from "src/app/models/model/invoice/InvoiceProcess";
import { CreatePurchaseInvoice } from "src/app/models/model/invoice/CreatePurchaseInvoice.1";
import { OrderLineDetail_VM } from "src/app/models/model/invoice/OrderLineDetail_VM";
import { OrderLineDetail } from "src/app/models/model/invoice/OrderLineDetail";
import { BankHeader_VM } from "src/app/models/model/invoice/BankHeader_VM";
import { DebitHeader_VM } from "src/app/models/model/invoice/DebitHeader_VM";
import { CashHeader_VM } from "src/app/models/model/invoice/CashHeader_VM";
import { DebitLine } from "src/app/models/model/invoice/DebitLine";
import { DebitHeader } from "src/app/models/model/invoice/DebitHeader";
import { BankLine } from "src/app/models/model/invoice/BankLine";
import { BankHeader } from "src/app/models/model/invoice/BankHeader";
import { CashLine, NebimResponse } from "src/app/models/model/invoice/CashLine";
import { CashHeader } from "src/app/models/model/invoice/CashHeader";
import { ProductDetail_VM } from "src/app/models/model/invoice/ProductDetail_VM";
import { CollectedInvoiceProduct } from "src/app/models/model/invoice/CollectedInvoiceProduct";
import { InvoiceOfCustomer_VM } from 'src/app/models/model/invoice/invoiceOfCustomer_VM';
import { OrderBillingRequestModel } from 'src/app/models/model/invoice/orderBillingRequestModel';
import { ExchangeRate } from 'src/app/models/model/order/exchangeRate';
import { GetCustomerAddress_CM, GetCustomerList_CM, NebimCustomerDto } from 'src/app/models/model/order/getCustomerList_CM';
import { GetNebimOrders_RM } from 'src/app/models/model/order/getOrder_RM';
import { ClientOrder, ClientOrderBasketItem, NebimInvoice, NebimOrder, NebimOrder_2 } from 'src/app/models/model/order/nebimOrder';
import { OrderStatus } from 'src/app/models/model/order/orderStatus';
import { ProductOfOrder } from 'src/app/models/model/order/productOfOrders';
import { SaleOrderModel } from 'src/app/models/model/order/saleOrderModel';
import { SalesPersonModel } from 'src/app/models/model/order/salesPersonModel';
import { BarcodeAddModel } from 'src/app/models/model/product/barcodeAddModel';
import { CountConfirmData } from 'src/app/models/model/product/countConfirmModel';
import { CountListModel, Invoice_VM } from 'src/app/models/model/product/countListModel';
import { InventoryItem } from 'src/app/models/model/product/inventoryItemModel';
import { ProductCountModel } from 'src/app/models/model/shelfNameModel';
import { ClientCustomer } from '../../components/Customer/customer-list/customer-list.component';
import { AddCustomerAddress_CM, CreateCustomer_CM } from '../../models/model/order/createCustomer_CM';
import { HttpClientService } from '../http-client.service';
import { ToasterService } from '../ui/toaster.service';
import { Invoice_RPM } from 'src/app/models/model/order/RPMs/invoice_RPM';
import { ProposalLineDetail } from 'src/app/models/model/invoice/ProposalLineDetail';

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

    var query: string = `${type}/${invoiceStatus}`
    const response = await this.httpClientService
      .get<SaleOrderModel>({
        controller: 'order/get-sale-orders',
      }, query)
      .toPromise();
    return response;

  }

  async getMissingOrders(): Promise<SaleOrderModel[]> {

    const response = this.httpClientService
      .get<SaleOrderModel>({
        controller: 'order/get-orders-with-missing-items',
      })
      .toPromise();
    return response;

  }



  async getPurchaseOrdersByFilter(model: OrderFilterModel): Promise<SaleOrderModel[]> {

    const response = this.httpClientService
      .post<any>({
        controller: 'Order/GetPurchaseOrdersByFilter',
      }, model)
      .toPromise();
    return response;

  }

  //fatura listesini çeker
  async getInvoiceList(processType: string, processCode: string): Promise<Invoice_VM[]> {
    const data = await this.httpClientService
      .get<Invoice_VM>({ controller: 'Order/get-process-list' }, processType + '/' + processCode,) //Get_InvoicesList
      .toPromise();
    return data;
  }

  //fatura listesini filtreye göre çeker
  async getInvoiceListByFilter(
    model: InvocieFilterModel
  ): Promise<CountListModel[]> {
    const data = await this.httpClientService
      .post<any>({ controller: 'Order/GetInvoiceListByFilter' }, model)
      .toPromise();
    return data;
  }


  async getOrdersByFilter(model: OrderFilterModel): Promise<SaleOrderModel[]> {

    const response = this.httpClientService
      .post<any>({
        controller: 'Order/GetOrdersByFilter',
      }, model)
      .toPromise();
    return response;

  }



  //alış siparişlerini çekme GET_MSRAFSalesOrderDetailBP
  getPurchaseOrders(): Promise<any> {

    const response = this.httpClientService
      .get<SaleOrderModel>({
        controller: 'Order/GetPurchaseOrders',
      })
      .toPromise();

    return response;

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
  async getCollectedProducts(
    orderNo: string,
    orderNoType: string
  ): Promise<any> {

    let endpoint: string = '';

    if (orderNoType === 'BP') {
      endpoint = 'Order/GetPurchaseOrderSaleDetail/'; //GET_MSRAFSalesOrderDetailBP
    } else if (orderNoType === 'WT' || orderNoType === 'S') {
      endpoint = 'Warehouse/GetWarehouseOperationDetail/'; //Usp_GETTransferOnayla
    } else if (orderNoType === 'WS' || orderNoType === 'R') {
      endpoint = 'Order/GetOrderSaleDetail/'; //GET_MSRAFSalesOrderDetail
    } else if (orderNoType === 'MIS') {
      endpoint = 'Order/get-missing-products-of-order/'; //GET_MSRAFOrderListMissing
    } else if (orderNoType.includes('ES')) {
      endpoint = 'Warehouse/GetWarehouseOperationDetailExport/'; //GET_MSRAFOrderListMissing
    }

    var response = await this.httpClientService.get<ProductOfOrder>({
      controller: endpoint + orderNo,
    }).toPromise();

    return response;


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
            controller: 'Order/CollectAndPack/' + model,
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



  async getSalesPersonModels(): Promise<SalesPersonModel[]> {

    var response = await this.httpClientService
      .get<SalesPersonModel>({
        controller: 'Order/GetSalesPersonModels',
      })
      .toPromise();

    return response;

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
    //       // console.log(data);
    //     });
    // } catch (error: any) {
    //   // console.log(error.message);
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
        // console.log(response);
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
      // console.log(error.message);
      return null;
    }
  }

  async createOrder(order: NebimOrder): Promise<any> {
    try {
      var response = await this.httpClientService.post<NebimOrder>({ controller: "order/create-order" }, order).toPromise();

      return response;
    } catch (error: any) {
      // console.log(error.message);
      return null;
    }
  }


  async createOrder2(order: NebimOrder_2): Promise<any> {
    try {
      var response = await this.httpClientService.post<NebimOrder>({ controller: "order/create-order-2" }, order).toPromise();

      return response;
    } catch (error: any) {
      // console.log(error.message);
      return null;
    }
  }
  async createInvoice(request: NebimInvoice): Promise<any> {
    try {
      var response = await this.httpClientService.post<NebimInvoice>({ controller: "order/create-sale-invoice" }, request).toPromise();

      return response;
    } catch (error: any) {
      // console.log(error.message);
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
      // console.log(error.message);
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
      // console.log(error.message);
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
      // console.log(error.message);
      return null;
    }
  }

  async addMissingProduct(products: ProductOfOrder[]): Promise<any> {
    try {
      var response = await this.httpClientService.post<ProductOfOrder[]>({ controller: "order/add-missing-item" }, products).toPromise();

      return response;
    } catch (error: any) {
      // console.log(error.message);
      return null;
    }
  }


  async deleteMissingProduct(orderNumber: string, barcode: string): Promise<any> {
    try {
      var response = await this.httpClientService.get<ProductOfOrder>({ controller: "order/delete-missing-item" + "/" + orderNumber + "/" + barcode }).toPromise();

      return response;
    } catch (error: any) {
      // console.log(error.message);
      return null;
    }
  }

  async getInvoicesOfCustomer(orderNumber: string): Promise<InvoiceOfCustomer_VM[]> {
    try {
      var response = await this.httpClientService.get<InvoiceOfCustomer_VM>({ controller: "order/get-invoices-of-customer" + "/" + orderNumber }).toPromise();

      return response;
    } catch (error: any) {
      // console.log(error.message);
      return null;
    }
  }

  async getCustomerList_2(request: GetCustomerList_CM): Promise<any> {
    try {
      var response = await this.httpClientService.post<GetCustomerList_CM>({ controller: "order/get-customer-list-2" }, request).toPromise();

      return response;
    } catch (error: any) {
      // console.log(error.message);
      return null;
    }
  }


  async deleteCustomerCommunication(communicationID: string): Promise<any> {
    try {
      var response = await this.httpClientService.get_new<boolean>({ controller: "order/delete-customer-communication" }, communicationID).toPromise();

      return response;
    } catch (error: any) {
      // console.log(error.message);
      return null;
    }
  }

  async deleteCustomerAddress(postalAddressID: string): Promise<any> {
    try {
      var response = await this.httpClientService.get_new<boolean>({ controller: "order/delete-customer-address" }, postalAddressID).toPromise();

      return response;
    } catch (error: any) {
      // console.log(error.message);
      return null;
    }
  }

  async getCustomerDetail(currAccCode: string): Promise<any> {
    try {
      var response = await this.httpClientService.get_new<NebimCustomerDto>({ controller: "order/get-customer-detail" }, currAccCode).toPromise();

      return response;
    } catch (error: any) {
      // console.log(error.message);
      return null;
    }
  }
  async getCustomerAddress(request: GetCustomerAddress_CM): Promise<any> {
    try {
      var response = await this.httpClientService.post<GetCustomerAddress_CM>({ controller: "order/get-customer-address" }, request).toPromise();

      return response;
    } catch (error: any) {
      // console.log(error.message);
      return null;
    }
  }

  async createCustomer(request: CreateCustomer_CM): Promise<any> {
    try {
      var response = await this.httpClientService.post<CreateCustomer_CM>({ controller: "order/create-customer" }, request).toPromise();

      return response;
    } catch (error: any) {
      // console.log(error.message);
      return null;
    }
  }

  async updateCustomer(request: CreateCustomer_CM): Promise<any> {
    try {
      var response = await this.httpClientService.post<CreateCustomer_CM>({ controller: "order/update-customer" }, request).toPromise();

      return response;
    } catch (error: any) {
      // console.log(error.message);
      return null;
    }
  }


  async getClientOrder(id: string): Promise<any> {
    try {
      var response = await this.httpClientService.get<any>({ controller: "order/get-client-order" + "/" + id }).toPromise();

      return response;
    } catch (error: any) {
      // console.log(error.message);
      return null;
    }
  }




  async getClientOrders(isCompleted: boolean): Promise<any> {
    try {
      var response = await this.httpClientService.get<ClientOrder>({ controller: "order/get-client-orders" }, isCompleted.toString()).toPromise();

      return response;
    } catch (error: any) {
      // console.log(error.message);
      return null;
    }
  }



  async createClientOrder(request: ClientOrder) {
    try {
      var response = await this.httpClientService.post<ClientOrder>({ controller: "order/create-client-order" }, request).toPromise();

      return response;
    } catch (error: any) {
      // console.log(error.message);
      return null;
    }
  }

  async createClientOrderBasketItem(request: ClientOrderBasketItem) {
    try {
      var response = await this.httpClientService.post<ClientOrderBasketItem>({ controller: "order/create-client-order-basket-item" }, request).toPromise();

      return response;
    } catch (error: any) {
      // console.log(error.message);
      return null;
    }
  }


  async updateClientOrderBasketItem(id: string, lineId: string, quantity: number, price: number, discountedPrice: number, basePrice: number): Promise<any> {
    try {

      var query = `${id}/${lineId}/${quantity}/${price}/${discountedPrice}/${basePrice}`
      var response = await this.httpClientService.get<any>({ controller: "order/update-client-order-basket-item" + "/" + query }).toPromise();

      return response;
    } catch (error: any) {
      // console.log(error.message);
      return null;
    }
  }

  async updateClientOrderPayment(orderId: string, paymentDescription: string): Promise<any> {
    try {

      var query = `${orderId}/${paymentDescription}`
      var response = await this.httpClientService.get<any>({ controller: "order/update-client-order-payment" + "/" + query }).toPromise();

      return response;
    } catch (error: any) {
      // console.log(error.message);
      return null;
    }
  }

  async editClientCustomer(request: ClientCustomer): Promise<any> {
    try {
      var response = await this.httpClientService.post<any>({ controller: "order/edit-client-customer" }, request).toPromise();
      return response;
    } catch (error: any) {
      // console.log(error.message);
      return null;
    }
  }

  async getClientCustomer(salesPersonCode: string): Promise<any> {
    try {
      var response = await this.httpClientService.get<any>({ controller: "order/get-client-customer" }, salesPersonCode).toPromise();

      return response;
    } catch (error: any) {
      // console.log(error.message);
      return null;
    }
  }


  async getOrderDetail(orderNumber: string): Promise<any> {
    try {
      var response = await this.httpClientService.get<any>({ controller: "order/get-order-detail" + "/" + orderNumber }).toPromise();

      return response;
    } catch (error: any) {
      // console.log(error.message);
      return null;
    }
  }

  async deleteClientOrder(id: string): Promise<any> {
    try {

      var response = await this.httpClientService.get<any>({ controller: "order/delete-client-order" + "/" + id }).toPromise();

      return response;
    } catch (error: any) {
      // console.log(error.message);
      return null;
    }
  }
  async deleteClientOrderBasketItem(orderId: string, lineId: string): Promise<any> {
    try {
      var query = `${orderId}/${lineId}`

      var response = await this.httpClientService.get<any>({ controller: "order/delete-client-order-basket-item" }, query).toPromise();

      return response;
    } catch (error: any) {
      // console.log(error.message);
      return null;
    }
  }

  async addCustomerAddress(request: AddCustomerAddress_CM): Promise<any> {
    try {
      var response = await this.httpClientService.post<any>({ controller: "order/add-customer-address" }, request).toPromise();

      return response;
    } catch (error: any) {
      // console.log(error.message);
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
      // console.log(error.message);
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
      // console.log(error.message);
      return null;
    }


  }
  async getNebimOrders(request: GetNebimOrders_RM): Promise<any> {
    try {
      const response = this.httpClientService
        .post<any>({
          controller: 'order/get-nebim-orders',
        }, request)
        .toPromise();
      return response;
    } catch (error: any) {
      // console.log(error.message);
      return null;
    }
  }

  async addOrderStatus(orderStatus: OrderStatus) {
    const response = this.httpClientService
      .post<OrderStatus>({
        controller: 'order/add-order-status',
      }, orderStatus)
      .toPromise();
    return response;
  }

  async getSaleOrdersWithStatus(type: number, invoiceStatus: number): Promise<any> {

    var query: string = `${type}/${invoiceStatus}`
    const response = this.httpClientService
      .get<any>({
        controller: 'order/get-orders-with-statuses',
      }, query)
      .toPromise();

    return response;
  }


  async deleteNebimOrder(request: string): Promise<any> {
    try {

      var response = await this.httpClientService.get<string>({ controller: "order/delete-nebim-order" + "/" + request }).toPromise();

      return response;


    } catch (error: any) {
      // console.log(error.message);
      return null;
    }
  }

  async sendInvoiceToPrinter(request: string): Promise<any> {
    try {
      // if (window.confirm("Faturayı yazdırmak istediğinize emin misiniz?")) {

      // }
      var userId = localStorage.getItem('userId')
      var response = await this.httpClientService.get<string>({ controller: "order/send-invoice-to-printer" + "/" + request + "/" + userId }).toPromise();

      return response;

    } catch (error: any) {
      // console.log(error.message);
      return null;
    }
  }

  async createPdf(request: string): Promise<any> {
    try {
      var userId = localStorage.getItem('userId')

      this.httpClient.get(ClientUrls.baseUrl + '/order/get-recepie-pdf/' + request + "/" + userId, { responseType: 'arraybuffer' })
        .subscribe((data: ArrayBuffer) => {
          const file = new Blob([data], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);

          // Open the PDF in a new tab/window
          const newWindow = window.open(fileURL);

          // Wait for a brief moment before printing (optional)
          setTimeout(() => {
            newWindow?.print();
          }, 1000);
        });

      return true;
    } catch (error: any) {
      // console.log(error.message);
      return null;
    }
  }

  async sendBeymenInvoices(request: string[]) {
    const response = this.httpClientService
      .post<any>({
        controller: 'order/send-beymen-invoices',
      }, request)
      .toPromise();

    return response;
  }
  async getWayBillReport(request: string[]): Promise<any> {
    try {
      var userId = localStorage.getItem('userId')

      this.httpClient.post(ClientUrls.baseUrl + '/order/get-waybill-report', request, { responseType: 'arraybuffer' })
        .subscribe((data: ArrayBuffer) => {
          const file = new Blob([data], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);

          // Open the PDF in a new tab/window
          const newWindow = window.open(fileURL);

          // Wait for a brief moment before printing (optional)
          setTimeout(() => {
            newWindow?.print();
          }, 1000);
        });

      return true;
    } catch (error: any) {
      // console.log(error.message);
      return null;
    }
  }


  //------------------------------------------------------------------------------------------  CollectedInvoiceProduct WS_B_R Faturaları (YENİ*)
  async getProductDetailByPriceCode(processCode: string, barcode: string): Promise<ProductDetail_VM> {
    const response = await this.httpClientService
      .get_new<ProductDetail_VM>(
        { controller: 'Order/get-product-detail' }, //Get_ProductOfInvoice
        processCode + '/' + barcode
      )
      .toPromise();

    return response;
  }
  async getCollectedInvoiceProducts(orderNo: string): Promise<CollectedInvoiceProduct[]> {
    const response = await this.httpClientService
      .get<CollectedInvoiceProduct>(
        { controller: 'Order/get-collected-invoice-product' }, //Get_ProductOfInvoice
        orderNo
      )
      .toPromise();

    return response;
  }
  async addCollectedInvoiceProduct(request: CollectedInvoiceProduct): Promise<boolean> {
    const response = await this.httpClientService
      .post<boolean>(
        { controller: 'Order/add-collected-invoice-product' }, //Get_ProductOfInvoice
        request
      )
      .toPromise();

    return response;
  }
  async updateCollectedInvoiceProduct(request: CollectedInvoiceProduct): Promise<boolean> {
    const response = await this.httpClientService
      .post<boolean>(
        { controller: 'Order/update-collected-invoice-product' }, //Get_ProductOfInvoice
        request
      )
      .toPromise();

    return response;
  }

  async deleteCollectedInvoiceProduct(id: string): Promise<boolean> {
    const response = await this.httpClientService
      .get_new<boolean>(
        { controller: 'Order/delete-collected-invoice-product' }, //Get_ProductOfInvoice
        id
      )
      .toPromise();

    return response;
  }
  async getInvoiceProcessList(processCode: string, processId: string): Promise<InvoiceProcess[]> {
    const response = await this.httpClientService
      .get<InvoiceProcess>(
        { controller: 'Order/get-invoice-process' },
        processCode + '/' + processId
      )
      .toPromise();

    return response;
  }

  async editInvoiceProcess(request: InvoiceProcess): Promise<InvoiceProcess> {
    const response = await this.httpClientService
      .post<InvoiceProcess>(
        { controller: 'Order/edit-invoice-process' },
        request
      )
      .toPromise();

    return response;
  }

  async deleteInvoiceProcess(id: string): Promise<boolean> {
    const response = await this.httpClientService
      .get_new<boolean>(
        { controller: 'Order/delete-invoice-process' },
        id
      )
      .toPromise();

    return response;
  }

  async createInvoice_New(processCode: string, processId: string) {
    const response = await this.httpClientService
      .get_new<boolean>(
        { controller: 'Order/create-invoice' },
        processCode + "/" + processId
      )
      .toPromise();

    return response;
  }
  async createOrder_New(processCode: string, processId: string) {
    const response = await this.httpClientService
      .get_new<boolean>(
        { controller: 'Order/create-order' },
        processCode + "/" + processId
      )
      .toPromise();

    return response;
  }

  async convertWSProposalToWSOrder(processType: string, processCode: string, id: string) {
    const response = await this.httpClientService
      .get_new<boolean>(
        { controller: 'Order/convert-ws-proposal-to-ws-order' },
        processType + "/" + processCode + "/" + id
      )
      .toPromise();

    return response;
  }
  async convertConfirmedWSProposalToWSOrder(processType: string, processCode: string, id: string) {
    const response = await this.httpClientService
      .get_new<boolean>(
        { controller: 'Order/convert-confirmed-ws-proposal-to-ws-order' },
        processType + "/" + processCode + "/" + id
      )
      .toPromise();

    return response;
  }

  // OrderLineDetail'ları almak için
  async getOrderLineDetails(processId: string): Promise<OrderLineDetail_VM[]> {
    const response = await this.httpClientService
      .get_new<OrderLineDetail_VM[]>({
        controller: 'Order/get-order-line-details'
      }, processId)
      .toPromise();

    return response;
  }

  // Yeni OrderLineDetail eklemek için
  async addOrderLineDetail(request: OrderLineDetail): Promise<boolean> {
    const response = await this.httpClientService
      .post<boolean>({
        controller: 'Order/add-order-line-detail'
      }, request)
      .toPromise();

    return response;
  }

  // Var olan OrderLineDetail güncellemek için
  async updateOrderLineDetail(request: OrderLineDetail): Promise<boolean> {
    const response = await this.httpClientService
      .post<boolean>({
        controller: 'Order/update-order-line-detail'
      }, request)
      .toPromise();

    return response;
  }

  // OrderLineDetail silmek için
  async deleteOrderLineDetail(id: string): Promise<boolean> {
    const response = await this.httpClientService
      .get_new<boolean>({
        controller: 'Order/delete-order-line-detail'
      }, id)
      .toPromise();

    return response;
  }

  // OrderLineDetail'ları almak için
  async getProposalLineDetails(processId: string): Promise<OrderLineDetail_VM[]> {
    const response = await this.httpClientService
      .get_new<OrderLineDetail_VM[]>({
        controller: 'Order/get-proposal-line-details'
      }, processId)
      .toPromise();

    return response;
  }

  // Yeni OrderLineDetail eklemek için
  async addProposalLineDetail(request: ProposalLineDetail): Promise<boolean> {
    const response = await this.httpClientService
      .post<boolean>({
        controller: 'Order/add-proposal-line-detail'
      }, request)
      .toPromise();

    return response;
  }

  // Var olan OrderLineDetail güncellemek için
  async updateProposalLineDetail(request: ProposalLineDetail): Promise<boolean> {
    const response = await this.httpClientService
      .post<boolean>({
        controller: 'Order/update-proposal-line-detail'
      }, request)
      .toPromise();

    return response;
  }

  // OrderLineDetail silmek için
  async deleteProposalLineDetail(id: string): Promise<boolean> {
    const response = await this.httpClientService
      .get_new<boolean>({
        controller: 'Order/delete-proposal-line-detail'
      }, id)
      .toPromise();

    return response;
  }


  //------------------------------------------------------------
  async completeCashPayment(request: string): Promise<NebimResponse> {
    const response = await this.httpClientService
      .get_new<NebimResponse>(
        { controller: 'Order/complete-cash-payment' },
        request
      )
      .toPromise();

    return response;
  }



  async getCashHeadersById(id: string): Promise<CashHeader> {
    const response = await this.httpClientService
      .get_new<CashHeader>(
        { controller: 'Order/get-cash-header-by-id' }, id
      )
      .toPromise();

    return response;
  }

  async editCashHeader(request: CashHeader): Promise<CashHeader> {
    const response = await this.httpClientService
      .post<CashHeader>(
        { controller: 'Order/edit-cash-header' },
        request
      )
      .toPromise();

    return response;
  }

  async deleteCashHeader(id: string): Promise<boolean> {
    const response = await this.httpClientService
      .get_new<boolean>(
        { controller: 'Order/delete-cash-header' },
        id
      )
      .toPromise();

    return response;
  }

  async addCashLine(request: CashLine): Promise<boolean> {
    const response = await this.httpClientService
      .post<boolean>(
        { controller: 'Order/add-cash-line' },
        request
      )
      .toPromise();

    return response;
  }

  async updateCashLine(request: CashLine): Promise<boolean> {
    const response = await this.httpClientService
      .post<boolean>(
        { controller: 'Order/update-cash-line' },
        request
      )
      .toPromise();

    return response;
  }

  async deleteCashLine(id: string): Promise<boolean> {
    const response = await this.httpClientService
      .get_new<boolean>(
        { controller: 'Order/delete-cash-line' },
        id
      )
      .toPromise();

    return response;
  }

  async getCashLinesByHeaderId(cashHeaderId: string): Promise<CashLine[]> {
    const response = await this.httpClientService
      .get<CashLine>(
        { controller: 'Order/get-cash-lines' },
        cashHeaderId
      )
      .toPromise();

    return response;
  }
  //------------------------------------------------------------

  async completeBankPayment(request: string): Promise<NebimResponse> {
    const response = await this.httpClientService
      .get_new<NebimResponse>(
        { controller: 'Order/complete-bank-payment' },
        request
      )
      .toPromise();

    return response;
  }


  async getBankHeaderById(id: string): Promise<BankHeader> {
    const response = await this.httpClientService
      .get_new<BankHeader>(
        { controller: 'Order/get-bank-header-by-id' },
        id
      )
      .toPromise();

    return response;
  }

  async editBankHeader(request: BankHeader): Promise<BankHeader> {
    const response = await this.httpClientService
      .post<BankHeader>(
        { controller: 'Order/edit-bank-header' },
        request
      )
      .toPromise();

    return response;
  }

  async deleteBankHeader(id: string): Promise<boolean> {
    const response = await this.httpClientService
      .get_new<boolean>(
        { controller: 'Order/delete-bank-header' },
        id
      )
      .toPromise();

    return response;
  }

  async addBankLine(request: BankLine): Promise<boolean> {
    const response = await this.httpClientService
      .post<boolean>(
        { controller: 'Order/add-bank-line' },
        request
      )
      .toPromise();

    return response;
  }

  async updateBankLine(request: BankLine): Promise<boolean> {
    const response = await this.httpClientService
      .post<boolean>(
        { controller: 'Order/update-bank-line' },
        request
      )
      .toPromise();

    return response;
  }

  async deleteBankLine(id: string): Promise<boolean> {
    const response = await this.httpClientService
      .get_new<boolean>(
        { controller: 'Order/delete-bank-line' },
        id
      )
      .toPromise();

    return response;
  }

  async getBankLinesByHeaderId(bankHeaderId: string): Promise<BankLine[]> {
    const response = await this.httpClientService
      .get<BankLine>(
        { controller: 'Order/get-bank-lines' },
        bankHeaderId
      )
      .toPromise();

    return response;
  }
  //-----------------------
  async completeDebitPayment(request: string): Promise<NebimResponse> {
    const response = await this.httpClientService
      .get_new<NebimResponse>(
        { controller: 'Order/complete-debit-payment' }, // Endpoint URL
        request
      )
      .toPromise();

    return response;
  }

  async getDebitHeaderById(id: string): Promise<DebitHeader> {
    const response = await this.httpClientService
      .get_new<DebitHeader>(
        { controller: 'Order/get-debit-header-by-id' },
        id
      )
      .toPromise();

    return response;
  }

  async editDebitHeader(request: DebitHeader): Promise<DebitHeader> {
    const response = await this.httpClientService
      .post<DebitHeader>(
        { controller: 'Order/edit-debit-header' },
        request
      )
      .toPromise();

    return response;
  }

  async deleteDebitHeader(id: string): Promise<boolean> {
    const response = await this.httpClientService
      .get_new<boolean>(
        { controller: 'Order/delete-debit-header' },
        id
      )
      .toPromise();

    return response;
  }

  async addDebitLine(request: DebitLine): Promise<boolean> {
    const response = await this.httpClientService
      .post<boolean>(
        { controller: 'Order/add-debit-line' },
        request
      )
      .toPromise();

    return response;
  }

  async updateDebitLine(request: DebitLine): Promise<boolean> {
    const response = await this.httpClientService
      .post<boolean>(
        { controller: 'Order/update-debit-line' },
        request
      )
      .toPromise();

    return response;
  }

  async deleteDebitLine(id: string): Promise<boolean> {
    const response = await this.httpClientService
      .get_new<boolean>(
        { controller: 'Order/delete-debit-line' },
        id
      )
      .toPromise();

    return response;
  }

  async getDebitLinesByHeaderId(debitHeaderId: string): Promise<DebitLine[]> {
    const response = await this.httpClientService
      .get<DebitLine>(
        { controller: 'Order/get-debit-lines' },
        debitHeaderId
      )
      .toPromise();

    return response;
  }


  // Cash Header listesini almak için
  async getCashHeaders(): Promise<CashHeader_VM[]> {
    const response = await this.httpClientService
      .get<CashHeader_VM>({
        controller: 'Order/get-cash-header-list'
      })
      .toPromise();

    return response;
  }

  // Debit Header'ı almak için
  async getDebitHeaders(): Promise<DebitHeader_VM[]> {
    const response = await this.httpClientService
      .get<DebitHeader_VM>({
        controller: 'Order/get-debit-header-list'
      })
      .toPromise();

    return response;
  }

  // Bank Header'ı almak için
  async getBankHeaders(): Promise<BankHeader_VM[]> {
    const response = await this.httpClientService
      .get<BankHeader_VM>({
        controller: 'Order/get-bank-header-list'
      })
      .toPromise();

    return response;
  }


}
