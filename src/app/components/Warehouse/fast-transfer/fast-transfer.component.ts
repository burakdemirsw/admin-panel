import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientUrls } from 'src/app/models/const/ClientUrls';
import { CountProductRequestModel } from 'src/app/models/model/order/countProductRequestModel';
import { OrderBillingListModel } from 'src/app/models/model/order/orderBillingListModel';
import { ProductOfOrder } from 'src/app/models/model/order/productOfOrders';
import { ItemBillingModel } from 'src/app/models/model/product/itemBillingModel ';
import {
  ProductCountModel
} from 'src/app/models/model/shelfNameModel';
import { ProductService } from 'src/app/services/admin/product.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { OrderService } from '../../../services/admin/order.service';

import { Title } from '@angular/platform-browser';
import { QrOperationResponseModel } from 'src/app/models/model/client/qrOperationResponseModel';
import { CollectedProduct } from 'src/app/models/model/product/collectedProduct';
import { QrOperationModel } from 'src/app/models/model/product/qrOperationModel';
import { FastTransferModel, FastTransferModel2 } from 'src/app/models/model/warehouse/fastTransferModel';
import { WarehouseOfficeModel } from 'src/app/models/model/warehouse/warehouseOfficeModel';
import { GeneralService } from 'src/app/services/admin/general.service';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';
import { HeaderService } from '../../../services/admin/header.service';
import { OrderStatus } from 'src/app/models/model/order/orderStatus';

declare var window: any;

@Component({
  selector: 'app-fast-transfer',
  templateUrl: './fast-transfer.component.html',
  styleUrls: ['./fast-transfer.component.css'],
})
export class FastTransferComponent implements OnInit {
  lastCollectedProducts: CollectedProduct[] = [];
  productsToCollect: FastTransferModel[];
  collectedProducts: FastTransferModel[] = [];
  process: boolean = false;
  checkForm: FormGroup;
  activeTab: number = 1;
  pageDescription: string = null;
  shelfNumbers: string;
  currentOrderNo: string;

  constructor(
    private formBuilder: FormBuilder,
    private toasterService: ToasterService,
    private orderService: OrderService,
    private router: Router,
    private httpClient: HttpClient,
    private productService: ProductService,
    private warehouseService: WarehouseService,
    private generalService: GeneralService,
    private httpClientService: HttpClientService,
    private title: Title,
    private headerService: HeaderService,
    private activatedRoute: ActivatedRoute
  ) {
  }
  orderNo: string;
  orderBillingModel: OrderBillingListModel;
  url2: string = ClientUrls.baseUrl + '/Order/CountTransferProductPuschase';
  totalCount: number = 0;
  orderBillingList: OrderBillingListModel[] = [];
  itemBillingModels: ItemBillingModel[] = [];
  modalImageUrl: string;
  formModal: any;
  warehouseModels: WarehouseOfficeModel[] = [];

  shelfNo: string;
  shelfNoList: string[] = [];
  barcodeValue: string = null;

  logger(event: Event) {
    // Seçilen değeri alın
    const selectedValue = (event.target as HTMLSelectElement).value;
    const selectedValue2 = this.checkForm.get('warehouseCode').value;

    // Değeri console'a yazdırın
    this.toasterService.success(
      'Seçilen Değer:\n' +
      selectedValue +
      '\n\n Form Değeri \n:' +
      selectedValue2
    );
  }

  async ngOnInit() {
    this.title.setTitle('Raflar Arası Transfer');
    this.headerService.updatePageTitle('Raflar Arası Transfer');
    this.formGenerator();
    // this.currentOrderNo = (await this.generalService.generateGUID()).toString();
    this.activatedRoute.params.subscribe(async params => {
      if (params['operationNo']) {
        this.currentOrderNo = params['operationNo'];
        // this.toasterService.info('İşlem Numarası: ' + this.currentOrderNo);
        await this.getFastTransferModels();
        this.addOperationStatus();
      }

    });
    this.collectedProducts = [];
    //this.spinnerService.hide();
  }

  async addOperationStatus() {
    var request = new OrderStatus();
    request.id = await this.generalService.generateGUID();
    request.orderNo = this.currentOrderNo;
    request.status = 'Raf Transfer İsteği';
    request.warehousePerson = localStorage.getItem('name') + ' ' + localStorage.getItem('surname');
    request.createdDate = new Date();
    const response = await this.orderService.addOrderStatus(request);
    if (response) {
      this.toasterService.success('Durum Güncellendi');
    } else {
      this.toasterService.error('Durum Güncellenemedi');
    }
  }


  collectedFastTransferModels: FastTransferModel2[] = [];
  async getFastTransferModels() {
    var response = await this.warehouseService.getFastTransferModels(this.currentOrderNo);
    if (response) {
      this.collectedFastTransferModels = response;
      this.calculateTotalQty();
    }
  }

  async deleteFastTransferModel(request: string): Promise<boolean> {
    var response = await this.warehouseService.deleteFastTransferModel(request);
    if (response) {
      this.toasterService.success("Başarılı")
      this.getFastTransferModels();
      return true;
    } else {
      return false;
    }
  }
  async addFastTransferModel(request: FastTransferModel2): Promise<boolean> {
    var response = await this.warehouseService.addFastTransferModel(request);
    if (response) {
      this.toasterService.success("Başarılı")
      await this.getFastTransferModels();
      return true;
    } else {
      this.toasterService.error("Başarısız")
      return false;
    }

  }
  calculateTotalQty() {
    //toplanan ürünler yazısı için
    let totalQty = 0;
    this.collectedFastTransferModels.forEach((item) => {
      totalQty += item.quantity;
    });
    this.totalCount = totalQty;
  }

  focusNextInput(nextInputId: string) {
    const nextInput = document.getElementById(nextInputId) as HTMLInputElement;
    if (nextInput) {
      nextInput.focus();
    }
  }
  offices: any[] = ["M", "U"]
  warehouses: any[] = ["MD", "UD"]
  formGenerator() {
    this.checkForm = this.formBuilder.group({
      barcode: [null, Validators.required],
      office: [null, Validators.required],
      warehouseCode: [null, Validators.required],
      shelfNo: [null, Validators.required],
      quantity: [null],
      batchCode: [null],
      targetShelfNo: [null, Validators.required],
    });

    this.checkForm.get('office').valueChanges.subscribe(value => {
      if (value === 'M') {
        this.checkForm.get('warehouseCode').setValue('MD');
      }
    });

    this.checkForm.get('office').valueChanges.subscribe(value => {
      if (value === 'U') {
        this.checkForm.get('warehouseCode').setValue('UD');
      }
    });
  }
  async confirmTransfer(operationNumberList: string[]) {
    var response = await this.orderService.confirmTransfer(operationNumberList);
    if (response) {
      this.router.navigate(['/warehouse-operation-confirm']);
    }
  }

  collectAndPack(list: ProductOfOrder[]) {
    this.orderService.collectAndPack(list, this.currentOrderNo);

    return null;
  }
  async countProductRequest(
    barcode: string,
    shelfNo: string,
    qty: number,
    orderNo: string,
    url: string
  ): Promise<ProductCountModel> {
    var requestModel: CountProductRequestModel = new CountProductRequestModel();
    requestModel.barcode = barcode;
    requestModel.shelfNo = shelfNo;
    requestModel.qty = qty.toString() == null ? 1 : qty;
    requestModel.orderNumber = orderNo;
    var response = await this.httpClient
      .post<ProductCountModel | undefined>(url, requestModel)
      .toPromise();

    return response;
  }
  openImageModal(imageUrl: string) {
    this.modalImageUrl = imageUrl;
    if (!this.formModal) {
      this.formModal = new window.bootstrap.Modal(
        document.getElementById('myModal')
      );
    }
    this.formModal.show();
  }
  getSelectedOffice(from: number) {
    this.getWarehouseList(this.checkForm.get('office')?.value, 1);
  }
  finishTransfer(model: any) {
    this.generalService.waitAndNavigate(
      'Hızlı Transfer İşlemi Başarılı',
      'dashboard'
    );
  }
  async getWarehouseList(value: string, from: number): Promise<any> {
    //bu alanı servise bağla
    try {
      if (from === 1) {
        const selectElement = document.getElementById(
          'office'
        ) as HTMLSelectElement;

        value = selectElement.value == '' ? 'M' : selectElement.value;
        const response = await this.httpClientService
          .get<WarehouseOfficeModel>({
            controller: 'Warehouse/GetWarehouseModel/' + value,
          })
          .toPromise();

        if (response) {
          this.warehouseModels.push(response[0]);

          this.checkForm
            .get('warehouseCode')
            .setValue(response[0].warehouseCode);
          const selectedValue2 = this.checkForm.get('warehouseCode').value;

          // this.toasterService.success('Form Değeri \n' + selectedValue2); //null geliyor
          return true;
        } else {
          this.toasterService.error('Depo Çekilemedi');
          return false;
        }
      }
    } catch (error: any) {
      return false;
      //console.log(error.message);
    }
  }
  async setFormValues(product: FastTransferModel2): Promise<FastTransferModel2> {

    try {
      if (product.barcode.includes('http') || this.generalService.isGuid(product.barcode)) {
        var result: string[] = await this.productService.countProductByBarcode3(
          product.barcode
        );
        this.shelfNumbers = result[0];
        var updated_product = product;
        updated_product.barcode = result[3];
        updated_product.batchCode = result[2];
        updated_product.quantity = Number(result[1]);

        this.checkForm.get('batchCode').setValue(result[2]);
        this.checkForm.get('barcode').setValue(result[3]);
        this.checkForm.get('quantity').setValue(Number(result[1]));

        return updated_product;
      } else {
        var result: string[] = await this.productService.countProductByBarcode(
          product.barcode
        );
        this.shelfNumbers = result[0];
        var updated_product = product;
        updated_product.barcode = result[3];
        updated_product.batchCode = result[2];
        updated_product.quantity = Number(result[1]);

        this.checkForm.get('batchCode').setValue(result[2]);
        this.checkForm.get('barcode').setValue(result[3]);
        this.checkForm.get('quantity').setValue(Number(result[1]));

        return updated_product;
      }
    } catch (error) {
      this.toasterService.error(error.message);
      return null;
    }
  }
  qrBarcodeUrl: string = null;
  qrOperationModels: QrOperationModel[] = [];
  async onSubmit(transferModel: FastTransferModel2): Promise<any> {


    // = işareti varsa - yap
    if (transferModel.barcode.includes("=")) {
      transferModel.barcode = transferModel.barcode.replace(/=/g, "-");

    }
    if (
      transferModel.barcode.includes('http') ||
      this.generalService.isGuid(transferModel.barcode)
    ) {
      this.qrBarcodeUrl = transferModel.barcode;
    }

    if (
      !this.checkForm.valid
    ) {
      var updated_product = await this.setFormValues(transferModel);
      transferModel.barcode = updated_product.barcode;
      this.toasterService.success("Form Değerleri Güncellendi")
      return;
    }



    if (this.checkForm.valid) {
      transferModel.operationId = this.currentOrderNo;
      var qrmodelResponse = await this.productService.qrControl(
        transferModel.barcode
      );
      if (qrmodelResponse.batchCode) {
        if (transferModel.batchCode == null || transferModel.batchCode === '') {
          transferModel.batchCode = qrmodelResponse.batchCode;
        }
      }
      const shelves = this.shelfNumbers
        .split(',')
        .filter((raflar) => raflar.trim() !== '')
        .map((raflar) => raflar.toLowerCase());

      if (shelves.includes(transferModel.shelfNo.toLowerCase())) {
        transferModel.quantity;

        var response = await this.addFastTransferModel(
          transferModel
        );

        //RAFLAR ARASI TRANSFER YAPILDI----------------------------------
        if (response === true) {
          //↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
          var qrResponse: QrOperationResponseModel =
            await this.productService.qrOperationMethod(
              this.qrBarcodeUrl,
              this.checkForm,
              transferModel,
              transferModel.quantity,
              false,
              'FT'
            );
          if (qrResponse != null && qrResponse.state === true) {
            this.qrOperationModels.push(qrResponse.qrOperationModel);
          } else if (qrResponse === null) {
            this.qrBarcodeUrl = null
          }

          //↑↑↑↑↑↑↑↑↑ EĞER QRURl BOŞ DEĞİLSE KONTROL EDİLCEK ↑↑↑↑↑↑↑↑↑
          this.generalService.beep();
        } else {
          this.toasterService.error('Ekleme Yapılmadı');
        }

        this.clearForm();
      } else {
        if (
          confirm(
            'Raf Bulunamadı! Raf Barkod Doğrulaması Yapılmadan Eklensin mi(2)?'
          )
        ) {

          var response = await this.addFastTransferModel(
            transferModel
          );

          //RAFLAR ARASI TRANSFER YAPILDI----------------------------------
          if (response == true) {

            this.generalService.beep();
          } else {
            this.toasterService.error('Ekleme Yapılmadı');
          }

          this.clearForm();
        }
      }
    }
  }

  async deleteFastTransfer(qrModel: FastTransferModel2) {
    const confirmDelete = window.confirm(
      'Bu hareketi silmek istediğinizden emin misiniz?'
    );

    if (confirmDelete) {
      var response = await this.deleteFastTransferModel(qrModel.id);
      if (response) {
        this.generalService.beep3();

      } else {
        return;
      }
      var model: QrOperationModel = new QrOperationModel();
      var qrOperationModel: QrOperationModel = new QrOperationModel();

      qrOperationModel = this.qrOperationModels.find(
        (p) =>
          p.barcode == qrModel.barcode &&
          p.batchCode == qrModel.batchCode &&
          p.shelfNo == qrModel.shelfNo
      );

      if (qrOperationModel) {
        // qrOperationModel nesnesini model'e kopyala
        model = Object.assign({}, qrOperationModel);

        if (qrOperationModel.isReturn) {
          model.isReturn = false;
        } else {
          model.isReturn = true;
        }

        const qrOperationResponse = await this.productService.qrOperation(
          model
        );
        if (qrOperationResponse) {
          // console.log(this.qrOperationModels);
          this.generalService.beep3();
          this.toasterService.success('Qr Operasyonu Geri Alındı');
        } else {
          this.toasterService.error('Qr Operasyonu Geri Alınamadı');
        }
      } else {
        this.toasterService.error('Qr Operasyonu Geri Alınamadı');
      }
    }
  }



  clearShelfNumbers() {
    this.checkForm.get('shelfNo').setValue(null);
    this.checkForm.get('barcode').setValue(null);
    this.focusNextInput('shelfNo');
    this.shelfNumbers = 'RAFLAR:';
    this.qrBarcodeUrl = null;
    this.checkForm.get('quantity').setValue(null);
  }
  clearTargetShelfNumber() {
    this.checkForm.get('targetShelfNo').setValue(null);
  }
  clearForm() {
    this.checkForm.get('barcode').setValue(null);
    this.checkForm.get('quantity').setValue(null);
    this.checkForm.get('shelfNo').setValue(null);
    this.checkForm.get('batchCode').setValue(null);
    this.focusNextInput('barcode');
    this.qrBarcodeUrl = null;
    this.shelfNumbers = 'RAFLAR:';

    this.calculateTotalQty();
  }

}
