import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductService } from 'src/app/services/admin/product.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../services/admin/order.service';
import { OrderBillingListModel } from 'src/app/models/model/order/orderBillingListModel';
import { ProductOfOrder } from 'src/app/models/model/order/productOfOrders';
import { ItemBillingModel } from 'src/app/models/model/product/itemBillingModel ';
import { ClientUrls } from 'src/app/models/const/ClientUrls';
import { CountProductRequestModel } from 'src/app/models/model/order/countProductRequestModel';
import { ProductCountModel } from 'src/app/models/model/shelfNameModel';
import { HttpClient } from '@angular/common/http';

import { WarehouseOperationDetailModel } from 'src/app/models/model/warehouse/warehouseOperationDetailModel';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { BrowserMultiFormatReader } from '@zxing/library';
import { GeneralService } from 'src/app/services/admin/general.service';
import { CollectProduct } from 'src/app/models/model/product/collectProduct';
import { CollectedProduct } from 'src/app/models/model/product/collectedProduct';
import { FastTransferModel } from 'src/app/models/model/warehouse/fastTransferModel';
import { WarehouseOfficeModel } from 'src/app/models/model/warehouse/warehouseOfficeModel';
import { Title } from '@angular/platform-browser';

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
  // warehouseModels: WarehouseOperationDetailModel[] = [];
  pageDescription: string = null;
  shelfNumbers: string = 'RAFLAR:';

  currentOrderNo: string;
  private codeReader: BrowserMultiFormatReader;

  constructor(
    private formBuilder: FormBuilder,
    private alertifyService: AlertifyService,
    private orderService: OrderService,
    private router: Router,
    private httpClient: HttpClient,
    private spinnerService: NgxSpinnerService,
    private productService: ProductService,
    private warehouseService: WarehouseService,
    private generalService: GeneralService,
    private httpClientService: HttpClientService,
    private title: Title
  ) {
    this.codeReader = new BrowserMultiFormatReader();
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
    this.alertifyService.success(
      'Seçilen Değer:\n' +
        selectedValue +
        '\n\n Form Değeri \n:' +
        selectedValue2
    );
  }

  async ngOnInit() {
    this.title.setTitle('Raflar Arası Transfer');
    this.spinnerService.show();
    this.formGenerator();
    this.currentOrderNo = (await this.generalService.generateGUID()).toString();
    this.collectedProducts = [];
    this.spinnerService.hide();
  }
  calculateTotalQty() {
    //toplanan ürünler yazısı için
    let totalQty = 0;
    this.collectedProducts.forEach((item) => {
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
  }
  confirmTransfer(operationNumberList: string[]) {
    if (this.orderService.confirmTransfer(operationNumberList).toPromise) {
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

    location.reload();
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

          // this.alertifyService.success('Form Değeri \n' + selectedValue2); //null geliyor
          return true;
        } else {
          this.alertifyService.error('Depo Çekilemedi');
          return false;
        }
      }
    } catch (error: any) {
      return false;
      //console.log(error.message);
    }
  }

  async onSubmit(transferModel: FastTransferModel): Promise<any> {
    transferModel.operationId = this.currentOrderNo;

    if (transferModel.shelfNo == null || transferModel.shelfNo.trim() == '') {
      if (transferModel.barcode != null || transferModel.barcode.trim() == '') {
        var number = await this.setShelfNo(transferModel.barcode);
        this.checkForm.get('quantity').setValue(Number(number));
        this.alertifyService.success(
          'Raflar Getirildi Ve Miktar Alanı Dolduruldu.'
        );
      } else {
        this.alertifyService.warning('Barkod Alanı Boş.');
        return;
      }
    } else if (transferModel.shelfNo != null) {
      if (this.checkForm.valid === true) {
        var response2: ProductCountModel =
          await this.warehouseService.countProductRequest(
            transferModel.barcode,
            transferModel.shelfNo,
            transferModel.quantity == null ? 1 : transferModel.quantity,
            null,
            null,
            transferModel.batchCode,
            'Order/CountProductControl',
            this.orderNo,
            ''
          ); //sayım yapıldı ve barkod doğrulaması yapıldı CountProductControl

        if (response2.status != 'Barcode') {
          this.alertifyService.error('Bu Qr Barkoduna Ait Barkod Bulunamadı');
          return;
        }

        var newResponse = await this.productService.countProductByBarcode(
          transferModel.barcode
        );

        const shelves = newResponse[0]
          .split(',')
          .filter((raflar) => raflar.trim() !== '');

        if (shelves.includes(transferModel.shelfNo)) {
          var number = await this.setShelfNo(transferModel.barcode);
          transferModel.quantity =
            transferModel.quantity != null
              ? transferModel.quantity
              : Number(number);

          var response = await this.warehouseService.fastTransfer(
            transferModel
          );
          if (response > 0) {
            this.collectedProducts.push(transferModel);
            this.collectedProducts.reverse();
          } else {
            this.alertifyService.error('Ekleme Yapılmadı');
          }

          this.generalService.beep();
          this.clearForm();
        } else {
          if (
            confirm(
              'Raf Bulunamadı! Raf Barkod Doğrulaması Yapılmadan Eklensin mi(2)?'
            )
          ) {
            var number = await this.setShelfNo(transferModel.barcode);
            transferModel.quantity = Number(number);

            var response = await this.warehouseService.fastTransfer(
              transferModel
            );
            if (response > 0) {
              this.collectedProducts.push(transferModel);
              this.collectedProducts.reverse();
            } else {
              this.alertifyService.error('Ekleme Yapılmadı');
            }

            this.generalService.beep();
            this.clearForm();
          }
        }
      } else {
        this.alertifyService.error('Form Geçerli Değil');
      }
    }
  }
  async setShelfNo(barcode: string): Promise<string> {
    this.shelfNumbers = 'RAFLAR:';

    if (barcode.length > 20) {
      var result: string[] = await this.productService.countProductByBarcode(
        barcode
      );

      this.shelfNumbers += result[0];
      return result[1];
    } else {
      this.checkForm.get('barcode').setValue(null);
      this.focusNextInput('shelfNo');
      return null;
    }
  }
  clearShelfNumbers() {
    this.checkForm.get('shelfNo').setValue(null);
    this.checkForm.get('barcode').setValue(null);
    this.focusNextInput('shelfNo');
    this.shelfNumbers = 'RAFLAR:';
    this.checkForm.get('quantity').setValue(null);
  }
  clearTargetShelfNumber() {
    this.checkForm.get('targetShelfNo').setValue(null);
  }
  clearForm() {
    this.checkForm.get('barcode').setValue(null);
    this.checkForm.get('quantity').setValue(null);
    this.checkForm.get('batchCode').setValue(null);
    this.focusNextInput('barcode');
    this.calculateTotalQty();
  }
  async deleteCountProduct(
    orderNo: string,
    itemCode: string
  ): Promise<boolean> {
    const result = await this.productService.deleteProductFromFastTransfer(
      this.currentOrderNo,
      itemCode
    );
    this.collectedProducts =
      await this.warehouseService.getGetAllFastTransferModelById(
        this.currentOrderNo
      );
    return false;
  }
}
