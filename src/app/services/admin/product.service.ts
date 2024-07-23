import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ClientUrls } from 'src/app/models/const/ClientUrls';
import {
  BarcodeModelResponse,
  BarcodeModel_A,
} from 'src/app/models/model/barcode/barcodeModel_A';
import { QrOperationResponseModel } from 'src/app/models/model/client/qrOperationResponseModel';
import { CreatePurchaseInvoice } from 'src/app/models/model/invoice/createPurchaseInvoice';
import { CollectedProduct } from 'src/app/models/model/product/collectedProduct';
import { GetProductExtract_RM, GetProductStock_RM } from 'src/app/models/model/product/getProductStock';
import { ProductCountModel2 } from 'src/app/models/model/product/productCountModel2';
import { ProductCreateModel } from 'src/app/models/model/product/productCreateModel';
import { QrCode } from 'src/app/models/model/product/qrCode';
import { QrControlCommandModel } from 'src/app/models/model/product/qrControlModel';
import {
  QrOperationModel,
  QrOperationModel2,
} from 'src/app/models/model/product/qrOperationModel';
import {
  ProductCountModel,
  ProductCountModel3,
} from 'src/app/models/model/shelfNameModel';
import { WarehouseFormModel } from 'src/app/models/model/warehouse/warehosueTransferModel';
import { HttpClientService } from '../http-client.service';
import { ToasterService } from '../ui/toaster.service';
import { GeneralService } from './general.service';
import { CreateBarcodeFromOrder_RM, CreateBarcodeModel } from 'src/app/components/Product/create-barcode/models/createBarcode';
import { ProposalProduct_SM, ZTMSG_ProposalProduct } from 'src/app/models/model/product/proposalProduct_SM';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(
    private toasterService: ToasterService,
    private httpClientService: HttpClientService,
    private generalService: GeneralService,
    private httpClient: HttpClient
  ) { }

  //ürün oluşturma
  createProduct(model: ProductCreateModel): boolean {
    this.httpClientService
      .post<ProductCreateModel>(
        {
          controller: 'Product',
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

  //create_order - fast_Trasfer - shelf_count
  async countProductByBarcode(barcode: string): Promise<string[]> {
    try {
      if (barcode.includes('/')) {
        barcode = barcode.replace(/\//g, '-');
      }

      const model: ProductCountModel[] = await this.httpClientService
        .get<ProductCountModel>({
          controller: 'Order/GetShelvesOfProduct/' + barcode,
        })
        .toPromise();

      var shelfNumbers: string = '';
      model.forEach((element) => {
        shelfNumbers += element.description + ',';
      });
      var results: string[] = [];
      results.push(shelfNumbers);
      results.push(model[0].status);
      results.push(model[0].batchCode);
      results.push(model[0].barcode);
      // results.push(model[0].batchStatus.toString());
      results.push(model[0].batchStatus.toString());

      return results;
    } catch (error: any) {
      console.error(error.message);
      return null;
    }
  }

  //alış satış ve transfer işlemlerinde barkod ile ürün bilgisi getirme işlemi
  async countProductByBarcode4(barcode: string, warehosueCode: string): Promise<string[]> {
    try {
      if (barcode.includes('/')) {
        barcode = barcode.replace(/\//g, '-');
      }
      if (warehosueCode == 'ONL') {
        warehosueCode = "MD";
      }
      const model: ProductCountModel[] = await this.httpClientService
        .get<ProductCountModel>({
          controller: 'Order/GetShelvesOfProduct4/' + barcode + "/" + warehosueCode,
        })
        .toPromise();

      var shelfNumbers: string = '';
      model.forEach((element) => {
        shelfNumbers += element.description + ',';
      });
      var results: string[] = [];

      results.push(shelfNumbers);
      results.push(model[0].status);
      results.push(model[0].batchCode);
      results.push(model[0].barcode);
      results.push(model[0].batchStatus.toString());
      return results;
    } catch (error: any) {
      console.error(error.message);
      return null;
    }
  }



  //barkod ile ürün sayma işlemi | ürün kodu
  async countProductByBarcode2(barcode: string): Promise<string> {
    try {
      if (barcode.includes('/')) {
        barcode = barcode.replace(/\//g, '-');
      }

      const model: ProductCountModel2[] = await this.httpClientService
        .get<ProductCountModel2>({
          controller: 'Order/CountProductByBarcode2/' + barcode,
        })
        .toPromise();

      if (model.length > 0) {
        return model[0].itemCode;
      } else {
        return null;
      }
    } catch (error: any) {
      console.error(error.message);
      return null;
    }
  }

  //depolar arası transfer işlemlerinde barkod ile ürün sayma işlemi
  async countProductByBarcode3(barcode: string): Promise<string[]> {
    try {
      var qrModel: QrControlCommandModel = new QrControlCommandModel();
      qrModel.qr = barcode;
      const model: any = await this.httpClientService
        .post<QrControlCommandModel>(
          {
            controller: 'Order/GetShelvesOfProduct2',
          },
          qrModel
        )
        .toPromise();

      if (model) {
        var countModel: ProductCountModel3 = model;
        if (countModel) {
          var shelfNumbers: string = '';
          model.forEach((element) => {
            shelfNumbers += element.description + ',';
          });
          var results: string[] = [];
          results.push(shelfNumbers);
          results.push(model[0].status);
          results.push(model[0].batchCode);
          results.push(model[0].barcode);
          results.push(model[0].batchStatus.toString());
          return results;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error: any) {
      console.error(error.message);
      throw new Error('Bir hata oluştu');
    }
  }

  //order operation toplanan ürünleri getirme
  async getCollectedOrderProducts(
    orderNo: string
  ): Promise<CollectedProduct[]> {
    const response = await this.httpClientService
      .get<CollectedProduct>({
        controller: 'Order/GetCollectedOrderProducts/' + orderNo, //GET_MSRafCollectedProducts
      })
      .toPromise();
    return response;
  }

  //sayımı tamamlama
  async completeCount(orderNo: string): Promise<any> {
    const response = await this.httpClientService
      .get<any>({ controller: 'Order/CompleteCount/' + orderNo })
      .toPromise();
    return response;
  }
  //sayım içindeki ürünü silme
  async deleteOrderProduct(
    orderNo: string,
    itemCode: string,
    lineId: string
  ): Promise<boolean> {
    try {
      const requestModel = {
        orderNumber: orderNo,
        itemCode: itemCode,
        lineId: lineId

      };

      const response = await this.httpClientService
        .post<any>({ controller: 'Order/DeleteProductOfCount' }, requestModel)
        .toPromise();

      if (response > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Hata (90):', error);
      return false;
    }
  }

  //transfer ürünleriini sayma
  async countTransferProduct(
    model: WarehouseFormModel
  ): Promise<ProductCountModel> {
    try {
      const response = await this.httpClientService
        .post<any>({ controller: 'Order/CountTransferProduct' }, model)
        .toPromise();

      if (response) {
        return response;
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async deleteProductFromFastTransfer(
    orderNo: string,
    itemCode: string
  ): Promise<boolean> {
    try {
      const requestModel = {
        orderNumber: orderNo,
        itemCode: itemCode,
      };

      const response = await this.httpClientService
        .post<any>(
          { controller: 'Order/DeleteProductFromFastTransfer' },
          requestModel
        )
        .toPromise();

      if (response > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Hata (90):', error);
      return false;
    }
  }

  //faturanın ürünlerini getirme
  async getProductOfInvoice(orderNo: string): Promise<CreatePurchaseInvoice[]> {
    const response = await this.httpClientService
      .get<CreatePurchaseInvoice>(
        { controller: 'Order/GetProductOfInvoice' }, //Get_ProductOfInvoice
        orderNo
      )
      .toPromise();

    return response;
  }

  async _searchProduct(model: BarcodeSearch_RM): Promise<any> {
    const response = await this.httpClientService
      .post<BarcodeSearch_RM>({ controller: 'Products/SearchProduct' }, model)
      .toPromise();

    return response;
  }

  async searchProposalProducts(model: ProposalProduct_SM): Promise<any> {
    const response: ProposalProduct_SM[] = await this.httpClientService
      .post<ProposalProduct_SM>({ controller: 'Products/search-proposal-products' }, model)
      .toPromise();

    return response;
  }
  async getProposalProducts(request: string): Promise<ZTMSG_ProposalProduct[]> {
    const response: ZTMSG_ProposalProduct[] = await this.httpClientService
      .get_new<ZTMSG_ProposalProduct>({ controller: 'Products/get-proposal-products' }, request)
      .toPromise();

    return response;
  }
  async deleteProposalProduct(request: number): Promise<any> {
    const response: ZTMSG_ProposalProduct[] = await this.httpClientService
      .get_new<boolean>({ controller: 'Products/delete-proposal-product' }, request.toString())
      .toPromise();

    return response;
  }
  async addProposalProduct(request: ZTMSG_ProposalProduct): Promise<any> {
    const response: ZTMSG_ProposalProduct[] = await this.httpClientService
      .post<ZTMSG_ProposalProduct>({ controller: 'Products/add-proposal-product' }, request)
      .toPromise();

    return response;
  }
  async updateProposalProduct(request: ZTMSG_ProposalProduct): Promise<any> {
    const response: ZTMSG_ProposalProduct[] = await this.httpClientService
      .post<ZTMSG_ProposalProduct>({ controller: 'Products/update-proposal-product' }, request)
      .toPromise();

    return response;
  }
  async searchProduct(model: BarcodeSearch_RM): Promise<any> {
    const response = await this.httpClientService
      .post<BarcodeSearch_RM>({ controller: 'Products/SearchProduct2' }, model)
      .toPromise();

    return response;
  }


  async searchProduct3(barcode: string, batchCode: string, shelfNo: string): Promise<any> {
    if (batchCode === '0') {
      batchCode = null;
    }
    const response = await this.httpClientService
      .get<BarcodeSearch_RM>({ controller: 'Products/SearchProduct3/' + barcode + "/" + batchCode }, shelfNo)
      .toPromise();

    return response;
  }
  async searchProduct4(model: BarcodeSearch_RM): Promise<ZTMSG_ProposalProduct[]> {
    const response: ZTMSG_ProposalProduct[] = await this.httpClientService
      .post<BarcodeSearch_RM>({ controller: 'Products/search-product-4' }, model)
      .toPromise();

    return response;
  }
  async getQr(id: string): Promise<any> {
    const response = await this.httpClientService
      .get<QrCode>({ controller: 'Products/get-qr' }, id)
      .toPromise();

    return response;
  }

  async addQr(model: QrCode): Promise<any> {
    const response = await this.httpClientService
      .post<QrCode>({ controller: 'Products/AddQr' }, model)
      .toPromise();

    return response;
  }

  async qrControl(qr: string): Promise<any> {
    var model: QrControlCommandModel = new QrControlCommandModel();
    model.qr = qr;
    const response = await this.httpClientService
      .post<QrControlCommandModel | any>(
        { controller: 'Products/QrControl' },
        model
      )
      .toPromise();

    return response;
  }
  //QrOperationModel
  async getBarcodePage(model: BarcodeModel_A): Promise<any> {
    const response: BarcodeModelResponse = await this.httpClient
      .post<QrControlCommandModel | any>(
        ClientUrls.baseUrl + '/Products/GenerateBarcode_A',
        model
      )
      .toPromise();
    return response;
  }

  async qrOperation(model: QrOperationModel): Promise<any> {
    const response: BarcodeModelResponse = await this.httpClient
      .post<QrOperationModel | any>(
        ClientUrls.baseUrl + '/Products/qr-operation',
        model
      )
      .toPromise();
    return response;
  }
  async qrOperation2(model: QrOperationModel2): Promise<any> {
    //transfer onaylama ekranı için qr operasyonu eklendi eklendi
    const response: BarcodeModelResponse = await this.httpClient
      .post<QrOperationModel | any>(
        ClientUrls.baseUrl + '/Products/qr-operation2',
        model
      )
      .toPromise();
    return response;
  }

  async qrOperationMethod(
    qrBarcodeUrl: string,
    form: FormGroup,
    formValue: any,
    numberParameter: any,
    isReturn: boolean,
    processCode: string
  ): Promise<QrOperationResponseModel> {
    var response: QrOperationResponseModel =
      new QrOperationResponseModel();
    if (qrBarcodeUrl != null) {
      var qrModel: QrControlCommandModel = new QrControlCommandModel();
      qrModel.qr = qrBarcodeUrl;

      var qrOperationModel: QrOperationModel = new QrOperationModel();
      qrOperationModel.barcode = form.get('barcode').value;
      qrOperationModel.batchCode = formValue.batchCode;
      qrOperationModel.isReturn = isReturn;
      qrOperationModel.processCode = processCode;
      qrOperationModel.qrBarcode = qrBarcodeUrl;
      (qrOperationModel.qty =
        formValue.quantity === null
          ? numberParameter
          : formValue.quantity),
        (qrOperationModel.shelfNo = formValue.shelfNo);
      const qrOperationResponse = await this.qrOperation(
        qrOperationModel
      );
      if (qrOperationResponse) {
        this.generalService.beep2();
        this.toasterService.success('Qr Operasyonu Başarılı');


        response.state = true;
        response.qrOperationModel = qrOperationModel;
        return response;
      } else {
        return null;
      }

    }
    return null;
  }

  async getProductStock(request: GetProductStock_RM): Promise<any> {
    const response = await this.httpClientService.post<GetProductStock_RM>({
      controller: 'Products/get-product-stock'
    }, request).toPromise();
    return response;
  }

  async getProductExtract(request: GetProductExtract_RM): Promise<any> {
    const response = await this.httpClientService.post<GetProductExtract_RM>({
      controller: 'Products/get-product-extract'
    }, request).toPromise();
    return response;
  }
  async addBarcodeModel(request: CreateBarcodeModel): Promise<any> {
    const response = await this.httpClientService.post<CreateBarcodeModel>({
      controller: 'Products/add-barcode-model'
    }, request).toPromise();
    return response;
  } async deleteBarcodeModel(request: string): Promise<any> {
    const response = await this.httpClientService.get<any>({
      controller: 'Products/delete-barcode-model'
    }, request).toPromise();
    return response;
  }
  async getBarcodeModels(request: string): Promise<CreateBarcodeModel[]> {
    const response = await this.httpClientService.get<CreateBarcodeModel>({
      controller: 'Products/get-barcode-models'
    }, request).toPromise();
    return response;
  }
  async sendBarcodeModelsToNebim(request: string): Promise<any> {
    const response = await this.httpClientService.get<any>({
      controller: 'Products/send-barcode-models-to-nebim'
    }, request).toPromise();
    return response;
  }

  async sendBarcodesToNebim(request: CreateBarcodeFromOrder_RM): Promise<any> {
    const response = await this.httpClientService.post<CreateBarcodeFromOrder_RM>({
      controller: 'Products/send-barcode-models-to-nebim'
    }, request).toPromise();
    return response;
  }
}
export class BarcodeSearch_RM {
  barcode!: string;
}

