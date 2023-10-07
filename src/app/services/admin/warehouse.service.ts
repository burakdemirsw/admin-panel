import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientService } from '../http-client.service';
import { AlertifyService } from '../ui/alertify.service';
import { CountProductRequestModel2 } from 'src/app/models/model/order/countProductRequestModel2';
import { ProductCountModel } from 'src/app/models/model/shelfNameModel';
import { CustomerModel } from 'src/app/models/model/customer/customerModel';
import { OfficeModel } from 'src/app/models/model/warehouse/officeModel';
import { WarehouseOfficeModel } from 'src/app/models/model/warehouse/warehouseOfficeModel';
import { GeneralService } from './general.service';
import { CountListModel } from 'src/app/models/model/product/countListModel';
import { CollectProduct } from 'src/app/models/model/product/collectProduct';
import { CollectedProduct } from 'src/app/models/model/product/collectedProduct';
import { CountedProduct } from 'src/app/models/model/product/countedProduct';
import { FastTransferModel } from 'src/app/models/model/warehouse/fastTransferModel';
import { CountListFilterModel } from 'src/app/models/model/filter/countListFilterModel';
import { InvocieFilterModel } from 'src/app/models/model/filter/invoiceFilterModel';
import { WarehouseOperationListModel } from 'src/app/models/model/warehouse/warehosueOperationListModel';
import { WarehouseOperationListFilterModel } from 'src/app/models/model/filter/warehouseOperationListFilterModel';

@Injectable({
  providedIn: 'root',
})
export class WarehouseService {
  constructor(
    private alertifyService: AlertifyService,
    private httpClientService: HttpClientService,
    private router: Router,
    private generalService: GeneralService
  ) {}

  //ürün sayım 1
  async countProductRequest(
    barcode: string,
    shelfNo: string,
    qty: number,
    office: string,
    warehouseCode: string,
    batchCode: string,

    url: string,
    orderNo: string,
    currAccCode: string
  ): Promise<ProductCountModel> {
    var requestModel: CountProductRequestModel2 =
      new CountProductRequestModel2();
    requestModel.orderNo = orderNo;
    requestModel.barcode = barcode;
    requestModel.shelfNo = shelfNo;
    requestModel.quantity = qty.toString() == '' ? 1 : qty;
    requestModel.office = office;
    requestModel.warehouseCode = warehouseCode;
    requestModel.batchCode = batchCode;
    requestModel.currAccCode = currAccCode;
    var response = await this.httpClientService
      .post<ProductCountModel | any>(
        {
          controller: url,
        },
        requestModel
      )
      .toPromise();

    return response;
  }

  //ofisleri çeker
  async getOfficeCodeList(): Promise<OfficeModel[]> {
    try {
      const data = await this.httpClientService
        .get<OfficeModel>({
          controller: 'Warehouse/GetOfficeModel',
        })
        .toPromise();

      return data;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }
  //depo listesini çeker

  async getWarehouseList(value: string): Promise<WarehouseOfficeModel[]> {
    try {
      const selectElement = document.getElementById(
        'officeCode'
      ) as HTMLSelectElement;

      value = selectElement.value == '' ? 'M' : selectElement.value;

      const data = await this.httpClientService
        .get<WarehouseOfficeModel>({
          controller: 'Warehouse/GetWarehouseModel/' + value,
        })
        .toPromise();
      return data;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }

  //müşteri listesini çeker
  async getCustomerList(customerType: string): Promise<CustomerModel[]> {
    try {
      const data = await this.httpClientService
        .get<CustomerModel>({
          controller: 'Order/CustomerList/' + customerType,
        })
        .toPromise();

      return data;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }

  //sayım listesini çeker
  async getCountList(): Promise<CountListModel[]> {
    const data = await this.httpClientService
      .get<CountListModel>({ controller: 'Order/GetCountList' })
      .toPromise();
    return data;
  }

  //fatura listesini çeker
  async getInvoiceList(): Promise<CountListModel[]> {
    const data = await this.httpClientService
      .get<CountListModel>({ controller: 'Order/GetInvoiceList' })
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

  //sayım ürünklerini çeker 100 adet
  async getProductOfCount(orderNo: string): Promise<CountedProduct[]> {
    const data = await this.httpClientService
      .get<CountedProduct>({ controller: 'Order/GetProductOfCount/' + orderNo })
      .toPromise();
    return data;
  }

  //sayım ürünklerini filtreli Çeker
  async GetCountListByFilter(model: CountListFilterModel): Promise<any> {
    const data = await this.httpClientService
      .post<CountListFilterModel>(
        { controller: 'Order/GetCountListByFilter/' },
        model
      )
      .toPromise();
    return data;
  }

  //hızlı transfer ekleme
  async postFastTransfer(model: FastTransferModel): Promise<any> {
    const data = await this.httpClientService
      .post<FastTransferModel>({ controller: 'Order/AddFastTransfer/' }, model)
      .toPromise();
    return data;
  }

  //hızlı transferin ürünlerini çeker
  async getGetAllFastTransferModelById(
    operationId: string
  ): Promise<FastTransferModel[]> {
    const data = await this.httpClientService
      .get<FastTransferModel>({
        controller: 'Order/GetFastTransferModel/' + operationId,
      })
      .toPromise();
    return data;
  }

  //transfer işlemlerini çeker
  async   getWarehouseOperations():  Promise<any> {
    try {
      const data =  this.httpClientService
        .get<WarehouseOperationListModel>({
          controller: 'Warehouse/GetWarehosueOperationList',
        })
        .toPromise();

        return  data
    } catch (error: any) {
      console.log(error.message);
    }
  }

  //transfer işlemlerini filtreleyerek çeker
  async   getWarehosueOperationListByFilter(model: WarehouseOperationListFilterModel):  Promise<any> {
    try {
      const data =  this.httpClientService
        .post<WarehouseOperationListModel>({
          controller: 'Warehouse/GetWarehosueOperationListByFilter',
        },model)
        .toPromise();

        return  data
    } catch (error: any) {
      console.log(error.message);
    }
  }

}
