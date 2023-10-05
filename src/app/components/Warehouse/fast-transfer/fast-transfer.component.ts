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
  warehouseModels: WarehouseOperationDetailModel[] = [];
  pageDescription: string = null;
  shelfNumbers: string = 'RAFLAR:';

  currentOrderNo: string;
  private codeReader: BrowserMultiFormatReader;

  constructor(
    private formBuilder: FormBuilder,
    private alertifyService: AlertifyService,
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient,
    private spinnerService: NgxSpinnerService,
    private productService: ProductService,
    private warehouseService: WarehouseService,
    private generalService: GeneralService
  ) {
    this.codeReader = new BrowserMultiFormatReader();
  }
  orderNo: string;

  orderBillingModel: OrderBillingListModel;
  url2: string = ClientUrls.baseUrl + '/Order/CountTransferProductPuschase';
  async ngOnInit() {
    this.spinnerService.show();
    this.formGenerator();
    this.currentOrderNo = (await this.generalService.generateGUID()).toString();
    this.collectedProducts =
      await this.warehouseService.getGetAllFastTransferModelById(
        this.currentOrderNo
      );
    this.spinnerService.hide();
  }

  // async getCollectedProducts(
  //   orderNo: string,
  //   orderNoType: string
  // ): Promise<any> {
  //   const productData = await this.orderService
  //     .getCollectedProducts(orderNo, orderNoType)
  //     .toPromise();
  //   // this.productsToCollect = productData.filter(
  //   //   (product) => product.quantity > 0
  //   // );
  //   this.productsToCollect =productData
  // }

  totalCount: number = 0;
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
  } //general service
  orderBillingList: OrderBillingListModel[] = [];
  itemBillingModels: ItemBillingModel[] = [];

  deleteRow(index: number) {
    this.itemBillingModels.splice(index, 1); // İlgili satırı listeden sil
  }

  formGenerator() {
    this.checkForm = this.formBuilder.group({
      barcode: [null, Validators.required],
      shelfNo: [null, Validators.required],
      quantity: [null],
      batchCode: [null],
      targetShelfNo: [null, Validators.required],
    });
  }
  confirmOperation(operationNumberList: string[]) {
    if (this.orderService.confirmOperation(operationNumberList).toPromise) {
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
  modalImageUrl: string;
  formModal: any;
  openImageModal(imageUrl: string) {
    this.modalImageUrl = imageUrl;
    if (!this.formModal) {
      this.formModal = new window.bootstrap.Modal(
        document.getElementById('myModal')
      );
    }
    this.formModal.show();
  }

  async onSubmit(transferModel: FastTransferModel): Promise<any> {
    transferModel.operationId = this.currentOrderNo;
    if (transferModel.shelfNo == null || transferModel.shelfNo.trim() == '') {
      if (transferModel.barcode != null || transferModel.barcode.trim() == '') {
        var number = await this.setShelfNo(transferModel.barcode);
        this.checkForm.get('quantity').setValue(Number(number));
      } else {
        this.alertifyService.warning('Formu Doldurunuz.');
        return;
      }
    } else if (transferModel.shelfNo != null) {
      this.alertifyService.warning(this.checkForm.valid.toString())
      if (this.checkForm.valid === true) {
        var newResponse = await this.productService.countProductByBarcode(
          transferModel.barcode
        );

        const shelves = newResponse[0]
          .split(',')
          .filter((raflar) => raflar.trim() !== '');

        if (shelves.includes(transferModel.shelfNo)) {
          var response = await this.warehouseService.postFastTransfer(
            transferModel
          );

          //this.collectedProducts.push(transferModel);
          //bu alanda sp yazılcak
          this.collectedProducts =
            await this.warehouseService.getGetAllFastTransferModelById(
              transferModel.operationId
            );
          this.generalService.beep();

          //form temizleme işlemi yapılcak
          this.clearForm();
        } else {
          if (
            confirm(
              'Raf Bulunamadı! Raf Barkod Doğrulaması Yapılmadan Eklensin mi(2)?'
            )
          ) {
            var number = await this.setShelfNo(transferModel.barcode);
            this.checkForm.get('quantity')?.setValue(Number(number));
            //this.collectedProducts.push(transferModel);
            //bu alanda sp yazılcak
            this.collectedProducts =
              await this.warehouseService.getGetAllFastTransferModelById(
                transferModel.operationId
              );
            this.generalService.beep();

            //form temizleme işlemi yapılcak
            this.clearForm();
          }
        }
      }
    } else {
      this.alertifyService.error('Form Geçerli Değil');
    }
  }
  confirmedProductPackageNoList: string[] = [];

  addProductToList(packageNo: string) {
    var isChecked = (
      document.getElementById('pi' + packageNo) as HTMLInputElement
    ).checked;

    if (isChecked) {
      this.confirmedProductPackageNoList.push(packageNo);
      this.alertifyService.success('true');
    } else {
      // Checkbox işaretini kaldırdığınızda, bu ürünün indexini listeden kaldırın.
      const indexToRemove = this.confirmedProductPackageNoList.findIndex(
        (p) => p.toString() == packageNo
      );
      if (indexToRemove !== -1) {
        this.confirmedProductPackageNoList.splice(indexToRemove, 1);
        this.alertifyService.error('false');
      }
    }
  }


  shelfNo: string;
  shelfNoList: string[] = [];
  barcodeValue: string = null; // Değişkeni tanımlayın

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
    this.checkForm.get('targetShelfNo').setValue(null);
    this.focusNextInput('barcode');
    this.checkForm.get('quantity').setValue(null);
  }
  clearForm() {
    this.checkForm.get('barcode').setValue(null);
    this.checkForm.get('quantity').setValue(null);
    this.checkForm.get('batchCode').setValue(null);
    this.focusNextInput('barcode');
    this.calculateTotalQty()
  }
  async deleteCountProduct(
    orderNo: string,
    itemCode: string
  ): Promise<boolean> {

   const result = await this.productService.deleteProductFromFastTransfer(this.currentOrderNo,itemCode);
   this.collectedProducts =
            await this.warehouseService.getGetAllFastTransferModelById(
              this.currentOrderNo
            );
    return false;
  }
}
