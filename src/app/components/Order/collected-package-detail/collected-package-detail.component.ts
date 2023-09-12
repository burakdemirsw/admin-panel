import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ClientUrls } from 'src/app/models/const/ClientUrls';
import { GetRemainigsProductsRequest } from 'src/app/models/model/order/getRemainingsProductRequest';
import { InvoiceNumberModel } from 'src/app/models/model/order/invoiceNumberModel';
import { InvoiceRequestModel } from 'src/app/models/model/order/invoiceRequestModel';
import { OrderBillingListModel } from 'src/app/models/model/order/orderBillingListModel';
import { ProductOfOrder } from 'src/app/models/model/order/productOfOrders';
import { RemainingProductsModel } from 'src/app/models/model/order/remainingProductsModel';
import { ItemBillingModel } from 'src/app/models/model/product/itemBillingModel ';
import { OrderService } from 'src/app/services/admin/order.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';
declare var window: any;
@Component({
  selector: 'app-collected-package-detail',
  templateUrl: './collected-package-detail.component.html',
  styleUrls: ['./collected-package-detail.component.css'],
})
export class CollectedPackageDetailComponent implements OnInit {
  productsToCollect: ProductOfOrder[];
  collectedProducts: ProductOfOrder[] = [];
  process: boolean = false;
  checkForm: FormGroup;
  checkForm2: FormGroup;
  modalTitle: string;
  activeTab: number = 1;
  constructor(
    private httpClientService: HttpClientService,
    private formBuilder: FormBuilder,
    private alertifyService: AlertifyService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient
  ) {}
  formModal: any;

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.getCollectedProducts(params['id']);
    });
    this.formGenerator();
    this.formGenerator2();
  }

  openModal(itemCode: string) {
    this.modalTitle = 'Okutulması Gereken Ürün Barkodu: ' + itemCode;
    if (!this.formModal) {
      this.formModal = new window.bootstrap.Modal(
        document.getElementById('myModal')
      );
    }
    this.formModal.show();
  }
  closeModal() {
    if (this.formModal) {
      this.formModal.hide();
    }
  }

  getCollectedProducts(numberOfList: string): any {
    try {
      this.httpClientService
        .get<ProductOfOrder>({
          controller: 'Order/GetOrderSaleDetailById/' + numberOfList.toString(),
        })
        .subscribe((data) => {
          //console.log(data);
          this.productsToCollect = data;
        });
    } catch (error: any) {
      console.log(error.message);
    }
  }

  SetReadyToShipmentPackagesStatus(id: string) {
    try {
      this.httpClientService
        .put<string>(
          {
            controller: 'Order/PutReadyToShipmentPackagesStatusById/' + id,
          },
          id
        )
        .subscribe((data) => {
          console.log(data);
          // this.productsToCollect = data;
        });
    } catch (error: any) {
      console.log(error.message);
    }
  }

  orderBillingList: OrderBillingListModel[] = [];
  itemBillingModels: ItemBillingModel[] = [];

  deleteRow(index: number) {
    this.itemBillingModels.splice(index, 1); // İlgili satırı listeden sil
  }
  orderNo: string = '';

  currentQrCode: string = '';
  orderBillingModel: OrderBillingListModel;
  formGenerator() {
    this.checkForm = this.formBuilder.group({
      barcode: ['', Validators.required],
    });
  }

  formGenerator2() {
    this.checkForm2 = this.formBuilder.group({
      barcodeText: ['', Validators.required],
    });
  }
  async sendRequest(getRemainigsProductsRequest: GetRemainigsProductsRequest): Promise<any> {
    const url =  ClientUrls.baseUrl+'/Order/GetRemainingsProducts';
    getRemainigsProductsRequest
    try {
      const data: any = await this.httpClient.post(url, getRemainigsProductsRequest).toPromise();
      var m1: InvoiceNumberModel = new InvoiceNumberModel();
      var m2: RemainingProductsModel = new RemainingProductsModel();
      if (data && data.hasOwnProperty('invoiceNumber')) {
        m1.invoiceNumber = data.invoiceNumber;
      } else {
        if (data.hasOwnProperty('itemCode') && m2 != null) {
          m2.itemCode = data.itemCode;
          m2.productsToBeCollected = data.productsToBeCollected;
          return m2;
        }
      }
      if (m1 instanceof InvoiceNumberModel && m1.invoiceNumber != undefined) {
        return m1;
      } else {
        return null;
      }
    } catch (error: any) {
      return null;
    }
  }

  setBarcodeInput() {
    var inputValue = this.checkForm2.get('barcodeText')?.value;
    this.checkForm.get('barcode')?.setValue(inputValue);
    this.onSubmit(this.checkForm.value);
    this.closeModal();
  }

  checkInvoiceNumber(requestModel: GetRemainigsProductsRequest) {
    var invoiceRequestModel: InvoiceRequestModel = new InvoiceRequestModel();

    //dönen veri null değilse
    try {
      this.httpClientService
        .get<any>({
          controller: 'Order/GetRemainingsProducts',
        })
        .subscribe((data: any) => {
          // data nesnesini InvoiceRequestModel türünde mi diye kontrol et
          if (data instanceof InvoiceNumberModel) {
            // data, InvoiceRequestModel türündeyse, bu kısma girer
            console.log('Veri InvoiceRequestModel türünde.');
            console.log(data); // Bu noktada data, InvoiceRequestModel türündeki nesne olacaktır.
          } else {
            if (data instanceof RemainingProductsModel) {
              // data, InvoiceRequestModel türündeyse, bu kısma girer
              console.log('Veri RemainingProductsModel türünde.');
              console.log(data); // Bu noktada data, InvoiceRequestModel türündeki nesne olacaktır.
            }
          }
        });
    } catch (error: any) {
      console.log(error.message);
    }
  }
  async onSubmit(productModel: ProductOfOrder) {
    if (this.checkForm.valid) {
      // this.alertifyService.success('Ürün Toplama İşlemi Tamamlandı!');

      // console.log(productModel);
      var foundModel = this.productsToCollect.find(
        (o) => o.barcode == productModel.barcode
      );
      if (foundModel) {
        const foundProduct = this.productsToCollect.find(
          (o) => o.barcode == productModel.barcode
        );
        if (
          foundProduct &&
          foundProduct.quantity &&
          foundProduct.quantity > 1
        ) {
          const index = this.productsToCollect.indexOf(foundProduct);

          // bu kısımda faturalaştırma işlemi onaylandıysa listeden kaldır!
          var model: GetRemainigsProductsRequest =
            new GetRemainigsProductsRequest();
          model.barcode = foundModel.barcode;
          model.packageId = foundModel.packageNo;
          model.quantity = foundModel.quantity;
          var data: any = await this.sendRequest(model);
          if (data instanceof InvoiceNumberModel) {
            this.alertifyService.success('Sipariş Faturalaştı!');
            this.productsToCollect.splice(index, 1);
            this.collectedProducts.push(foundModel);
            foundProduct.quantity -= 1;
          } else {
            this.productsToCollect.splice(index, 1);
            this.collectedProducts.push(foundModel);
            foundProduct.quantity -= 1;
            this.openModal(data.itemCode);
          }
          //onaylanmadıysa modal aç modalın içinde de toplanacak ürünleri listele!
          //tüm ürünler toplandıysa modal kapancak...
        } else if (foundProduct?.quantity === 1) {
          const index = this.productsToCollect.indexOf(foundProduct);
          // bu kısımda faturalaştırma işlemi onaylandıysa listeden kaldır!
          var model: GetRemainigsProductsRequest =
            new GetRemainigsProductsRequest();
          model.barcode = foundModel.barcode;
          model.packageId = foundModel.packageNo;
          model.quantity = foundModel.quantity;
          var data: any = await this.sendRequest(model);
          if (data instanceof InvoiceNumberModel) {
            this.alertifyService.success('Sipariş Faturalaştı!');
            this.productsToCollect.splice(index, 1);
            this.collectedProducts.push(foundModel);
            foundProduct.quantity -= 1;
          } else {
            this.productsToCollect.splice(index, 1);
            this.collectedProducts.push(foundModel);
            foundProduct.quantity -= 1;
            this.openModal(data.itemCode);
          }
          //onaylanmadıysa modal aç modalın içinde de toplanacak ürünleri listele!
          //tüm ürünler toplandıysa modal kapancak...

          if (index === 0) {
            if (this.productsToCollect.length === 0) {
              alert('Tüm Ürünler Toplandı!');

              this.activatedRoute.params.subscribe((params) => {
                this.SetReadyToShipmentPackagesStatus(params['id']);
              });
              this.router.navigate(['/collected-packages']);
            } else {
              //bu kısımda sorgu çalışacak ve faturalaştırma başlayacak
            }
          }
        }
      }
    }

    this.checkForm.get('barcode')?.setValue('');
  }
}
