import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
  shelfNumbers: string = 'RAFLAR:';
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
  // warehouseModels2: WarehouseOfficeModel[] = [];
  shelfNo: string;
  shelfNoList: string[] = [];
  barcodeValue: string = null; // Değişkeni tanımlayın

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
      }

    });
    this.collectedProducts = [];
    //this.spinnerService.hide();
  }

  collectedFastTransferModels: FastTransferModel2[] = [];
  async getFastTransferModels() {
    var response = await this.warehouseService.getFastTransferModels(this.currentOrderNo);
    if (response) {
      this.collectedFastTransferModels = response;
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
  async setFormValues(barcode: string, check: boolean): Promise<string> {
    this.shelfNumbers = 'RAFLAR:';
    try {
      if (barcode.includes('http') || this.generalService.isGuid(barcode)) {
        var result: string[] = await this.productService.countProductByBarcode3(
          barcode
        );
        this.shelfNumbers += result[0];
        if (check) {
          var currentShelfNo = this.checkForm.get('shelfNo').value;
          // if(currentShelfNo==null ){
          //   this.checkForm.get('shelfNo').setValue(result[0].split(',')[0]);
          // }

          this.checkForm.get('batchCode').setValue(result[2]);
          this.checkForm.get('barcode').setValue(result[3]);
        }

        return result[1];
      } else {
        var result: string[] = await this.productService.countProductByBarcode(
          barcode
        );
        this.shelfNumbers += result[0];
        this.checkForm.get('barcode').setValue(result[3]);

        this.checkForm.get('batchCode').setValue(result[2].toString());
        return result[1];
      }
    } catch (error) {
      this.toasterService.error(error.message);
      return null;
    }
  }
  qrBarcodeUrl: string = null;
  qrOperationModels: QrOperationModel[] = [];
  async onSubmit(transferModel: FastTransferModel2): Promise<any> {


    if (transferModel.barcode.includes("=")) {
      transferModel.barcode = transferModel.barcode.replace(/=/g, "-");

    }

    if (
      transferModel.barcode.includes('http') ||
      this.generalService.isGuid(transferModel.barcode)
    ) {
      var number = await this.setFormValues(transferModel.barcode, true);
      this.qrBarcodeUrl = transferModel.barcode;
      this.checkForm.get('quantity')?.setValue(Number(number));

      //this.onSubmit(this.checkForm.value);
      return;
    }
    transferModel.operationId = this.currentOrderNo;
    var CONSTQTY = await this.getQuantity(transferModel.barcode);
    if (transferModel.barcode && !transferModel.shelfNo || transferModel.barcode && !transferModel.batchCode) {
      var number = await this.setFormValues(transferModel.barcode, true);
      this.checkForm.get('quantity')?.setValue(Number(number)); //quantity alanı dolduruldu
      this.toasterService.success(
        'Raflar Getirildi Ve Miktar Alanı Dolduruldu.'
      );
    } else if (transferModel.shelfNo != null) {
      if (this.checkForm.valid === true) {
        var response2: ProductCountModel =
          await this.warehouseService.countProductRequest(
            transferModel.barcode,
            transferModel.shelfNo,
            transferModel.quantity == null
              ? Number(CONSTQTY)
              : transferModel.quantity,
            null,
            null,
            transferModel.batchCode,
            'Order/CountProductControl',
            this.orderNo,
            ''
          );
        // barkod doğrulaması yapıldı CountProductControl

        if (response2.status != 'Barcode') {
          this.toasterService.error('Bu Qr Barkoduna Ait Barkod Bulunamadı');
          return;
        } else {
          transferModel.barcode = response2.description;
        }
        //burada parti ve barkod için istek at
        var qrmodelResponse = await this.productService.qrControl(
          transferModel.barcode
        );
        if (qrmodelResponse.batchCode) {
          if (transferModel.batchCode == null || transferModel.batchCode === '') {
            transferModel.batchCode = qrmodelResponse.batchCode;
          }

          // transferModel.barcode = qrmodelResponse.barcode; //qr basılmadı
        }
        var newResponse = await this.productService.countProductByBarcode(
          transferModel.barcode
        );

        const shelves = newResponse[0]
          .split(',')
          .filter((raflar) => raflar.trim() !== '')
          .map((raflar) => raflar.toLowerCase());

        if (shelves.includes(transferModel.shelfNo.toLowerCase())) {
          transferModel.quantity =
            transferModel.quantity != null
              ? transferModel.quantity
              : Number(CONSTQTY);


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
                Number(CONSTQTY),
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
            if (!transferModel.quantity) {
              transferModel.quantity = Number(CONSTQTY);
            }

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
      } else {
        var number = await this.setFormValues(transferModel.barcode, true);
        this.checkForm.get('quantity')?.setValue(Number(number)); //quantity alanı dolduruldu


        if (this.checkForm.value.targetShelfNo == null || this.checkForm.value.targetShelfNo == '') {
          // this.generalService.whichRowIsInvalid(this.checkForm);
          this.toasterService.info("Hedef Raf Numarası Boş Olamaz")
          this.focusNextInput('targetShelfNo');
        }
      }
    }
  }

  async deleteFastTransfer(qrModel: FastTransferModel2) {
    const confirmDelete = window.confirm(
      'Bu hareketi silmek istediğinizden emin misiniz?'
    );

    if (confirmDelete) {
      // var shelfNo = qrModel.shelfNo;
      // qrModel.shelfNo = qrModel.targetShelfNo;
      // qrModel.targetShelfNo = shelfNo;
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
          p.shelfNo == qrModel.targetShelfNo
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


  async getQuantity(barcode: string): Promise<string> {
    this.shelfNumbers = 'RAFLAR:';
    //  this.qrBarcodeUrl = null;
    var result: string[] = await this.productService.countProductByBarcode(
      barcode
    );

    // this.shelfNumbers += result[0];
    return result[1];
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
  // async deleteCountProduct(
  //   orderNo: string,
  //   itemCode: string
  // ): Promise<boolean> {
  //   const result = await this.productService.deleteProductFromFastTransfer(
  //     this.currentOrderNo,
  //     itemCode
  //   );
  //   this.collectedProducts =
  //     await this.warehouseService.getGetAllFastTransferModelById(
  //       this.currentOrderNo
  //     );
  //   return false;
  // }
}
