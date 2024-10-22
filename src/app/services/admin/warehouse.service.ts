import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerModel } from 'src/app/models/model/customer/customerModel';
import { CountListFilterModel } from 'src/app/models/model/filter/countListFilterModel';
import { WarehouseOperationListFilterModel } from 'src/app/models/model/filter/warehouseOperationListFilterModel';
import { WarehouseTransferListFilterModel } from 'src/app/models/model/filter/warehouseTransferListFilterModel';
import { CountProductRequestModel2, CountProductRequestModel3 } from 'src/app/models/model/order/countProductRequestModel2';
import { CountListModel } from 'src/app/models/model/product/countListModel';
import { CountedProduct, CountedProductControl } from 'src/app/models/model/product/countedProduct';
import {
  ProductCountModel
} from 'src/app/models/model/shelfNameModel';
import { AvailableShelf, Shelf } from 'src/app/models/model/warehouse/availableShelf';
import { FastTransferListModel, FastTransferModel, FastTransferModel2, WarehouseTransferModel } from 'src/app/models/model/warehouse/fastTransferModel';
import { TransferModel } from 'src/app/models/model/warehouse/transferModel';
import { TransferRequestListModel } from 'src/app/models/model/warehouse/transferRequestListModel';
import { WarehouseOperationListModel } from 'src/app/models/model/warehouse/warehosueOperationListModel';
import { WarehouseOfficeModel, WarehouseOfficeModel_V1 } from 'src/app/models/model/warehouse/warehouseOfficeModel';
import { WarehouseOperationProductModel } from 'src/app/models/model/warehouse/warehouseOperationProductModel';
import { HttpClientService } from '../http-client.service';
import { ToasterService } from '../ui/toaster.service';
import { GeneralService } from './general.service';
import { InnerHeader, InnerLine, InnerLine_VM, ZTMSG_CountedProduct } from 'src/app/models/model/warehouse/ztmsg_CountedProduct';
import { CompleteCountOperation_CM } from 'src/app/models/model/warehouse/completeCount_CM';
import { ClientUrls } from 'src/app/models/const/ClientUrls';
import { WarehouseItem } from 'src/app/models/model/warehouse/warehouseItem';

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


  async deleteCount(
    request: ZTMSG_CountedProduct
  ): Promise<any> {

    var response = await this.httpClientService.get<any>(
      {
        controller: "Warehouse/delete-count/" + request.id.toString()
      },
    ).toPromise();

    return response;
  }

  async addCount(
    request: ZTMSG_CountedProduct
  ): Promise<boolean> {
    if (request.barcode.includes('/')) {
      request.barcode = request.barcode.replace(/\//g, '-');
    }

    var response = await this.httpClientService.post<ZTMSG_CountedProduct | any>(
      {
        controller: "Warehouse/add-count",
      },
      request
    )
      .toPromise();

    if (response == true) {
      return response;
    } else {
      return false;
    }

  }
  async getCountsOfOperation(
    request: string
  ): Promise<ZTMSG_CountedProduct[]> {

    try {
      var response = await this.httpClientService.get<ZTMSG_CountedProduct | any>(
        {
          controller: "Warehouse/get-counts-of-operation/" + request,
        },

      )
        .toPromise();

      return response;
    } catch (error) {
      return null;
    }

  }


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
    requestModel.quantity;
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
    toWarehouseCode: string,
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
    requestModel.toWarehouseCode = toWarehouseCode;
    requestModel.quantity = qty;
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


  //depo ve ofis listesini çeker
  async getWarehouseAndOffices(): Promise<WarehouseOfficeModel[]> {
    try {
      const data = await this.httpClientService
        .get<WarehouseOfficeModel>({
          controller: 'Warehouse/get-office-and-warehouses',
        })
        .toPromise();
      return data;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }

  async getWarehouseAndOffices_V1(): Promise<WarehouseOfficeModel_V1[]> {
    try {
      const data = await this.httpClientService
        .get<WarehouseOfficeModel_V1>({
          controller: 'Warehouse/get-office-and-warehouses-v1',
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

    const data = this.httpClientService
      .get<WarehouseOperationListModel>({
        controller: 'Warehouse/GetWarehosueOperationList',
      }, status)
      .toPromise();

    return data;

  }

  async getWarehosueOperationListByInnerNumber(
    innerNumber: string
  ): Promise<any> {

    const data = this.httpClientService
      .get<WarehouseOperationListModel>(
        {
          controller: 'Warehouse/getWarehosueOperationListByInnerNumber',
        },
        innerNumber
      )
      .toPromise();

    return data;

  }

  //transfer operasyonlarını nebimden filtreleyerek çeker
  async getWarehosueOperationListByFilter(
    model: WarehouseOperationListFilterModel
  ): Promise<any> {

    const data = this.httpClientService
      .post<WarehouseOperationListModel>(
        {
          controller: 'Warehouse/GetWarehosueOperationListByFilter',
        },
        model
      )
      .toPromise();

    return data;

  }

  //transfer işlemlerini filtreleyerek çeker
  async getWarehosueTransferListByFilter(
    model: WarehouseTransferListFilterModel
  ): Promise<any> {

    const data = this.httpClientService
      .post<WarehouseTransferListFilterModel>(
        {
          controller: 'Warehouse/GetWarehosueTransferList',
        },
        model
      )
      .toPromise();

    return data;

  }

  //transfer işlemi
  async transfer(model: WarehouseOperationProductModel): Promise<any> {

    const result = await this.httpClientService
      .post<WarehouseOperationProductModel>(
        {
          controller: 'Warehouse/Transfer',
        },
        model
      )
      .toPromise();

    return result;

  }
  //deleteCountById
  async deleteTransferFromId(id: string): Promise<any> {

    const result = await this.httpClientService
      .get<any>({
        controller: 'Warehouse/DeleteWarehouseTransferById/' + id,
      })
      .toPromise();

    return result;

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

    const response = await this.httpClientService
      .get<TransferRequestListModel>({
        controller: 'Warehouse/TransferRequestList'
      }, type)
      .toPromise();
    return response;

  }

  //sayılabilecek rafları çeker
  // Get_MSRAFWillBeCounted
  async getAvailableShelves(): Promise<AvailableShelf[]> {

    const data = await this.httpClientService
      .get<AvailableShelf>({ controller: 'Order/GetAvailableShelves' })
      .toPromise();
    return data;

  }


  //raflar arası transfer ----------------------------------------------------
  async addFastTransferModel(request: FastTransferModel2): Promise<boolean> {

    const response = await this.httpClientService
      .post<any>({ controller: 'Warehouse/add-fast-transfer-model' }, request)
      .toPromise();
    return response;

  }

  async deleteFastTransferModel(request: string): Promise<any> {

    const response = await this.httpClientService
      .get<any>({ controller: 'Warehouse/delete-fast-transfer-model' }, request)
      .toPromise();
    return response;

  }

  async getFastTransferModels(request: string): Promise<any> {

    const response = await this.httpClientService
      .get<any>({ controller: 'Warehouse/get-fast-transfer-models' }, request)
      .toPromise();
    return response;

  }

  // Get fast transfer list models
  async getFastTransferListModels(): Promise<FastTransferListModel[]> {
    const response = await this.httpClientService
      .get<FastTransferListModel>({
        controller: 'Warehouse/get-fast-transfer-list',
      })
      .toPromise();
    return response;
  }
  //---------------------------------------------------------------------------

  //raflar arası transfer ----------------------------------------------------
  async addWarehouseTransferModel(request: WarehouseTransferModel): Promise<boolean> {

    const response = await this.httpClientService
      .post<any>({ controller: 'Warehouse/add-warehouse-transfer-model' }, request)
      .toPromise();
    return response;

  }

  async deleteWarehouseTransferModel(request: string): Promise<any> {

    const response = await this.httpClientService
      .get<any>({ controller: 'Warehouse/delete-warehouse-transfer-model' }, request)
      .toPromise();
    return response;

  }

  async getWarehouseTransferModels(request: string): Promise<WarehouseTransferModel[]> {

    const response = await this.httpClientService
      .get<WarehouseTransferModel>({ controller: 'Warehouse/get-warehouse-transfer-models' }, request)
      .toPromise();
    return response;

  }

  // Get fast transfer list models
  async getWarehouseTransferListModels(): Promise<any> {
    const response = await this.httpClientService
      .get<any>({
        controller: 'Warehouse/get-warehouse-transfer-list',
      })
      .toPromise();
    return response;
  }
  //---------------------------------------------------------------------------

  async completeCountOperation(request: CompleteCountOperation_CM): Promise<boolean> {

    const response = await this.httpClientService
      .post<any>({ controller: 'Warehouse/complete-count-operation' }, request)
      .toPromise();
    return response;

  }


  //İTHALAT İŞLEMLERİ----------------------------------------------------------

  async getImportTransactionList(invoiceNumber?: string): Promise<any> {
    const response = await this.httpClientService
      .get<any>({
        controller: 'Warehouse/get-import-transactions',
      })
      .toPromise();
    return response;
  }
  async getExportTransactionList(invoiceNumber?: string): Promise<any> {
    const response = await this.httpClientService
      .get<any>({
        controller: 'Warehouse/get-export-transactions',
      })
      .toPromise();
    return response;
  }
  async completeImportTransaction(invoiceNumber: string, warehouseCode: string): Promise<any> {
    var request = invoiceNumber + "/" + warehouseCode
    const response = await this.httpClientService
      .get<any>({
        controller: 'Warehouse/complete-import-transaction',
      }, request)
      .toPromise();
    return response;
  }

  //---------------------------------------------------------------------------
  //RAFLAR----------------------------------------------------

  async getShelves(): Promise<Shelf[]> {
    const data = await this.httpClientService
      .get_new<Shelf[]>({ controller: 'Warehouse/get-shelves' })
      .toPromise();
    return data;
  }

  async addShelf(request: Shelf): Promise<boolean> {
    const result = await this.httpClientService
      .post<boolean>({ controller: 'Warehouse/add-shelf' }, request)
      .toPromise();
    return result;
  }

  async updateShelf(request: Shelf): Promise<boolean> {
    const result = await this.httpClientService
      .post<boolean>({ controller: 'Warehouse/update-shelf' }, request)
      .toPromise();
    return result;
  }

  async removeShelf(id: string): Promise<boolean> {
    const result = await this.httpClientService
      .get_new<boolean>({ controller: 'Warehouse/remove-Shelf' }, id)
      .toPromise();
    return result;
  }

  //----------------------------------------------------

  // Inner-----------------------------------------------------------


  async completeInnerHeader(opetationId: string, sendNebim: boolean): Promise<boolean> {
    const response = await this.httpClientService
      .get_new<boolean>({ controller: 'Warehouse/complete-inner-header' }, opetationId + "/" + sendNebim)
      .toPromise();
    return response;
  }
  async getInnerHeaders(innerProcessCodes: string[]): Promise<InnerHeader[]> {
    const response = await this.httpClientService
      .post<InnerLine_VM>({ controller: 'Warehouse/get-inner-headers', }, innerProcessCodes)
      .toPromise();
    return response;
  }

  async addInnerLine(request: InnerLine): Promise<boolean> {
    const response = await this.httpClientService
      .post<any>({ controller: 'Warehouse/add-inner-line' }, request)
      .toPromise();
    return response;
  }

  async getInnerLines(request: string): Promise<InnerLine[]> {
    const response = await this.httpClientService
      .get<InnerLine>({ controller: 'Warehouse/get-inner-lines' }, request)
      .toPromise();
    return response;
  }

  async deleteInnerLine(request: string): Promise<any> {

    const response = await this.httpClientService
      .get<any>({ controller: 'Warehouse/delete-inner-line' }, request)
      .toPromise();
    return response;
  }

  async completeInnerHeaderOperation(operationId: string): Promise<boolean> {
    const response = await this.httpClientService
      .get_new<boolean>({ controller: 'Warehouse/complete-inner-header-operation' }, operationId)
      .toPromise();
    return response;
  }

  // InnerHeader operasyon listesini alma
  async getInnerHeaderOperationList(): Promise<InnerHeader[]> {
    const response = await this.httpClientService
      .get<InnerHeader>({ controller: 'Warehouse/get-inner-header-operation-list' })
      .toPromise();
    return response;
  }

  // Yeni InnerHeader ekleme
  async addInnerHeader(request: InnerHeader): Promise<InnerHeader> {
    const response = await this.httpClientService
      .post<InnerHeader>({ controller: 'Warehouse/add-inner-header' }, request)
      .toPromise();
    return response;
  }
  // Yeni InnerHeader ekleme
  async updateInnerHeader(request: InnerHeader): Promise<InnerHeader> {
    const response = await this.httpClientService
      .post<InnerHeader>({ controller: 'Warehouse/update-inner-header' }, request)
      .toPromise();
    return response;
  }
  // InnerHeader işlemlerini ID ile getirme
  async getInnerHeaderById(request: string): Promise<InnerHeader> {
    const response = await this.httpClientService
      .get_new<InnerHeader>({ controller: 'Warehouse/get-inner-header' }, request)
      .toPromise();
    return response;
  }
  async getInnerHeaderByDescription(request: string): Promise<InnerHeader> {
    const response = await this.httpClientService
      .get_new<InnerHeader>({ controller: 'Warehouse/get-inner-header-by-description' }, request)
      .toPromise();
    return response;
  }

  // InnerHeader işlemini silme
  async deleteInnerHeader(request: string): Promise<any> {
    const response = await this.httpClientService
      .get<any>({ controller: 'Warehouse/delete-inner-header' }, request)
      .toPromise();
    return response;
  }
  //---------------------------------------------------------------------------
  async transferBetweenStoreWarehouses(id: string, userId: number): Promise<boolean> {
    try {
      const data = await this.httpClientService
        .get<any>({ controller: 'Warehouse/transfer-between-store-warehouses-v2' }, id + "/" + userId)
        .toPromise();
      if (data) {
        return true;
      } else {
        return false;
      }
    } catch (error: any) {
      return false;
    }
  }
  async createShipping(id: string, userId: number) {

    try {
      const data = await this.httpClientService
        .get<any>({ controller: 'Warehouse/create-shipping' }, id + "/" + userId)
        .toPromise();
      if (data) {
        return true;
      } else {
        return false;
      }
    } catch (error: any) {
      return false;
    }


  }


  async ApproveTransferBetweenStoreWarehouse(id: string): Promise<boolean> {
    try {
      const data = await this.httpClientService
        .get<any>({ controller: '/warehouse/approve-transfer-between-store-warehouse/' }, id)
        .toPromise();
      if (data) {
        return true;
      } else {
        return false;
      }
    } catch (error: any) {
      return false;
    }
  }
}
