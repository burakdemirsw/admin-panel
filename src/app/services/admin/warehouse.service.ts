import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientService } from '../http-client.service';
import { CountProductRequestModel2, CountProductRequestModel3 } from 'src/app/models/model/order/countProductRequestModel2';
import {
  ProductCountModel,
  ProductCountModel3,
} from 'src/app/models/model/shelfNameModel';
import { CustomerModel } from 'src/app/models/model/customer/customerModel';
import { OfficeModel } from 'src/app/models/model/warehouse/officeModel';
import { WarehouseOfficeModel } from 'src/app/models/model/warehouse/warehouseOfficeModel';
import { GeneralService } from './general.service';
import { CountListModel } from 'src/app/models/model/product/countListModel';
import { CollectProduct } from 'src/app/models/model/product/collectProduct';
import { CollectedProduct } from 'src/app/models/model/product/collectedProduct';
import { CountedProduct, CountedProductControl } from 'src/app/models/model/product/countedProduct';
import { FastTransferModel } from 'src/app/models/model/warehouse/fastTransferModel';
import { CountListFilterModel } from 'src/app/models/model/filter/countListFilterModel';
import { InvocieFilterModel } from 'src/app/models/model/filter/invoiceFilterModel';
import { WarehouseOperationListModel } from 'src/app/models/model/warehouse/warehosueOperationListModel';
import { WarehouseOperationListFilterModel } from 'src/app/models/model/filter/warehouseOperationListFilterModel';
import { TransferModel } from 'src/app/models/model/warehouse/transferModel';
import { WarehouseOperationProductModel } from 'src/app/models/model/warehouse/warehouseOperationProductModel';
import { WarehouseTransferListFilterModel } from 'src/app/models/model/filter/warehouseTransferListFilterModel';
import { TransferRequestListModel } from 'src/app/models/model/warehouse/transferRequestListModel';
import { AvailableShelf } from 'src/app/models/model/warehouse/availableShelf';
import { QrControlCommandModel } from 'src/app/models/model/product/qrControlModel';
import { QrOperationModel } from 'src/app/models/model/product/qrOperationModel';
import { FormGroup } from '@angular/forms';
import { ToasterService } from '../ui/toaster.service';

@Injectable({
  providedIn: 'root',
})
export class WarehouseService {
  constructor(
    private toasterService: ToasterService,
    private httpClientService: HttpClientService,
    private router: Router,
    private generalService: GeneralService
  ) { }

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
    if (barcode.includes('/')) {
      barcode = barcode.replace(/\//g, '-');
    }

    var requestModel: CountProductRequestModel2 =
      new CountProductRequestModel2();
    requestModel.barcode = barcode;
    requestModel.shelfNo = shelfNo;
    requestModel.batchCode = batchCode;
    requestModel.office = office;
    requestModel.warehouseCode = warehouseCode;
    requestModel.quantity = qty.toString() == '' ? 1 : qty;
    requestModel.currAccCode = currAccCode;
    requestModel.isReturn = false;
    requestModel.salesPersonCode = '';
    requestModel.taxTypeCode = '';
    requestModel.orderNo = orderNo;
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
  async countProductRequest2(
    barcode: string,
    shelfNo: string,
    qty: number,
    office: string,
    warehouseCode: string,
    batchCode: string,

    url: string,
    orderNo: string,
    currAccCode: string,
    lineId: string
  ): Promise<ProductCountModel> {
    if (barcode.includes('/')) {
      barcode = barcode.replace(/\//g, '-');
    }

    var requestModel: CountProductRequestModel3 =
      new CountProductRequestModel3();
    requestModel.barcode = barcode;
    requestModel.shelfNo = shelfNo;
    requestModel.batchCode = batchCode;
    requestModel.office = office;
    requestModel.warehouseCode = warehouseCode;
    requestModel.quantity = qty.toString() == '' ? 1 : qty;
    requestModel.currAccCode = currAccCode;
    requestModel.isReturn = false;
    requestModel.salesPersonCode = '';
    requestModel.taxTypeCode = '';
    requestModel.orderNo = orderNo;
    requestModel.lineId = lineId;
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
      .get<CountListModel>({ controller: 'Order/GetInvoiceList' }) //Get_InvoicesList
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
  //sayım ürünklerini kontrol eder
  async getProductOfCountControl(orderNo: string): Promise<CountedProductControl[]> {
    const data = await this.httpClientService
      .get<CountedProductControl>({ controller: 'Order/get-product-of-count-control/' + orderNo })
      .toPromise();
    return data;
  }

  //depolar arası transferin taplann ürünlerini çeker
  async getProductOfTrasfer(orderNo: string): Promise<TransferModel[]> {
    const data = await this.httpClientService
      .get<TransferModel>({
        controller: 'Order/GetProductOfTrasfer/' + orderNo,
      })
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
  async fastTransfer(model: FastTransferModel): Promise<any> {
    const data = await this.httpClientService
      .post<FastTransferModel>({ controller: 'Order/FastTransfer' }, model) //Usp_PostZtMSRAFSTOKTransfer
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
  async getWarehouseOperations(status: string): Promise<any> {
    try {
      const data = this.httpClientService
        .get<WarehouseOperationListModel>({
          controller: 'Warehouse/GetWarehosueOperationList',
        }, status)
        .toPromise();

      return data;
    } catch (error: any) {
      console.log(error.message);
    }
  }

  async getWarehosueOperationListByInnerNumber(
    innerNumber: string
  ): Promise<any> {
    try {
      const data = this.httpClientService
        .get<WarehouseOperationListModel>(
          {
            controller: 'Warehouse/getWarehosueOperationListByInnerNumber',
          },
          innerNumber
        )
        .toPromise();

      return data;
    } catch (error: any) {
      console.log(error.message);
    }
  }

  //transfer operasyonlarını nebimden filtreleyerek çeker
  async getWarehosueOperationListByFilter(
    model: WarehouseOperationListFilterModel
  ): Promise<any> {
    try {
      const data = this.httpClientService
        .post<WarehouseOperationListModel>(
          {
            controller: 'Warehouse/GetWarehosueOperationListByFilter',
          },
          model
        )
        .toPromise();

      return data;
    } catch (error: any) {
      console.log(error.message);
    }
  }

  //transfer işlemlerini filtreleyerek çeker
  async getWarehosueTransferListByFilter(
    model: WarehouseTransferListFilterModel
  ): Promise<any> {
    try {
      const data = this.httpClientService
        .post<WarehouseTransferListFilterModel>(
          {
            controller: 'Warehouse/GetWarehosueTransferList',
          },
          model
        )
        .toPromise();

      return data;
    } catch (error: any) {
      console.log(error.message);
    }
  }

  //transfer işlemi
  async transfer(model: WarehouseOperationProductModel): Promise<any> {
    try {
      const result = await this.httpClientService
        .post<WarehouseOperationProductModel>(
          {
            controller: 'Warehouse/Transfer',
          },
          model
        )
        .toPromise();

      return result;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }
  //deleteCountById
  async deleteTransferFromId(id: string): Promise<any> {
    try {
      const result = await this.httpClientService
        .get<any>({
          controller: 'Warehouse/DeleteWarehouseTransferById/' + id,
        })
        .toPromise();

      return result;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }

  async deleteCountFromId(id: string): Promise<any> {
    try {
      const result = await this.httpClientService
        .get<any>({
          controller: 'Warehouse/DeleteCountById/' + id,
        })
        .toPromise();

      return result;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }
  async getTransferRequestListModel(type: string): Promise<TransferRequestListModel[]> {
    try {
      const response = this.httpClientService
        .get<TransferRequestListModel>({
          controller: 'Warehouse/TransferRequestList'
        }, type)
        .toPromise();
      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }

  //sayılabilecek rafları çeker
  // Get_MSRAFWillBeCounted
  async getAvailableShelves(): Promise<AvailableShelf[]> {
    try {
      const data = await this.httpClientService
        .get<AvailableShelf>({ controller: 'Order/GetAvailableShelves' })
        .toPromise();
      return data;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }
}
