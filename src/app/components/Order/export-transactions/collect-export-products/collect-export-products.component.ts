import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientUrls } from 'src/app/models/const/ClientUrls';
import { CountProductRequestModel } from 'src/app/models/model/order/countProductRequestModel';
import { ProductOfOrder } from 'src/app/models/model/order/productOfOrders';
import { CollectedProduct } from 'src/app/models/model/product/collectedProduct';
import { CountProduct } from 'src/app/models/model/product/countProduct';
import { QrOperationModel } from 'src/app/models/model/product/qrOperationModel';
import { ProductCountModel } from 'src/app/models/model/shelfNameModel';
import { WarehouseItem } from 'src/app/models/model/warehouse/warehouseItem';
import { GeneralService } from 'src/app/services/admin/general.service';
import { HeaderService } from 'src/app/services/admin/header.service';
import { OrderService } from 'src/app/services/admin/order.service';
import { ProductService } from 'src/app/services/admin/product.service';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';
declare var window: any;

@Component({
  selector: 'app-collect-export-products',

  templateUrl: './collect-export-products.component.html',
  styleUrl: './collect-export-products.component.css'
})
export class CollectExportProductsComponent {
  showDialog() {
    this._visible = true;
  }

  constructor(
    private headerService: HeaderService,
    private toasterService: ToasterService,
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient,
    private productService: ProductService,
    private warehouseService: WarehouseService,
    private gs: GeneralService,
  ) {

  }
  //#region  params
  pageDescription: string = "İhracat Detay";
  lastCollectedProducts: CollectedProduct[] = [];
  productsToCollect: ProductOfOrder[] = [];
  _productsToCollect: ProductOfOrder[] = [];
  collectedProducts: ProductOfOrder[] = [];
  checkForm: FormGroup;
  activeTab: number = 1;
  shelfNumbers: string = "Raf No"
  currentPage: number = 1;
  currentPage2: number = 1;
  currentOrderNo: string;
  warehouseCode: string;
  tableHeaders: string[] = [
    'Fotoğraf', 'Raf', 'Stok Kodu', 'Ürün', 'Barkod', 'Sipariş', 'Sayılan', 'Beden', 'Renk', 'Stok', 'İşlemler'
  ];
  _pageDescription: boolean = false;
  selectedInvoiceType: any;
  _visible: boolean;
  _visible2: boolean;
  customerName: string;

  modalImageUrl: string;
  formModal: any;
  currentProductModel: any;
  qrOperationModels: QrOperationModel[] = [];
  shelfNo: string;
  shelfNoList: string[] = [];
  productShelvesDialog: boolean = false;
  productShelves: string[] = [];
  quantity: number = null;
  visible2: boolean = false;
  visible: boolean = false;
  totalCount: number = 0;
  lastCollectedProduct: ProductOfOrder = null;
  //#endregion
  async ngOnInit() {

    //this.spinnerService.show();

    await this.activatedRoute.params.subscribe(async (params) => {
      this.formGenerator();
      if (params['id']) {
        this.currentOrderNo = params['id'];
      }
      if (params['warehouseCode']) {
        this.warehouseCode = params['warehouseCode'];
      }
      //toWarehouseCode

      await this.getAllProducts(); //toplanan ve toplanacak ürünleri çeker
      this.setPageDescription();

    });
  }

  async getCollectedOrderProducts(
    orderNo: string
  ): Promise<CollectedProduct[]> {
    var response = await this.productService.getCollectedOrderProducts(orderNo);
    this.lastCollectedProducts = response;

    this.calculateTotalQty();
    return response;
  }

  calculateTotalQty() {
    //toplanan ürünler yazısı için
    let totalQty = 0;
    this.lastCollectedProducts.forEach((item) => {
      totalQty += item.quantity;
    });
    this.totalCount = totalQty;
  }

  showCountPage() {
    if (this.visible) {
      this.visible = false;
    } else {
      this.visible = true;
    }
  }


  showModal2() {
    if (this.visible2) {
      this.visible2 = false;
    } else {
      this.visible2 = true;
    }
  }


  async refundToCenter(currentOrderNo: string) {
    if (currentOrderNo != null && currentOrderNo !== '') {
      const userConfirmed = window.confirm(
        this.currentOrderNo +
        ' numaralı transfer için İşlemi başlatmak istediğinize emin misiniz?'
      );

      if (userConfirmed) {
        try {

          const data = await this.httpClient
            .get<WarehouseItem | any>(
              ClientUrls.baseUrl +
              '/warehouse/refund-to-center/' +
              currentOrderNo
            )
            .toPromise();

          if (data === true) {
            this.gs.waitAndNavigate(
              'Merkeze İade İşlemi Başarıyla Gerçekleşti.',
              'warehouse-operation-list'
            );
          } else {
            this.toasterService.error('İşlem Başarısız');
          }
        } catch (error: any) {

        }
      } else {
        this.toasterService.warn('İşlem iptal edildi.');
      }
    } else {
      this.toasterService.warn('Sipariş No Boş Geliyor.');
    }

  }
  setPageDescription() {
    this.headerService.updatePageTitle(this.pageDescription);

  }
  async getAllProducts(): Promise<any> {
    const productData = await this.orderService //toplanacak ürünler çekildi
      .getCollectedProducts(this.currentOrderNo, 'ES');


    if (productData.length === 0) {
      this._productsToCollect = []
    }
    this.productsToCollect = productData; //toplanacak ürünler çekildi
    if (this.productsToCollect.length > 0) {
      if (this.lastCollectedProduct == null) {
        //üste atılcak ürün seçildi
        this._productsToCollect = [];
        this._productsToCollect.push(productData[0]);
        this.lastCollectedProduct = productData[0];
      } else {
        //eğer son sayılan ürün varsa toplanacak ürünlerden bul
        var foundedProduct = this.productsToCollect.find(
          (p) =>
            p.barcode == this.lastCollectedProduct.barcode &&
            p.itemCode == this.lastCollectedProduct.itemCode &&
            p.shelfNo == this.lastCollectedProduct.shelfNo
        );

        if (foundedProduct) {
          //eğer ürün bulunduysa

          if (foundedProduct.quantity > 0) {
            //miktar değeri 0 dan büyükse üste at
            this._productsToCollect = [];
            this._productsToCollect.push(foundedProduct);
            this.lastCollectedProduct = foundedProduct;
          } else {
            //miktar değeri 0 dan küçükse
            this._productsToCollect = [];
            this._productsToCollect.push(productData[0]);
            this.lastCollectedProduct = productData[0];
          }
        } else {
          //üürn bulunmdadıysa

          this._productsToCollect = [];
          this._productsToCollect.push(productData[0]);
          this.lastCollectedProduct = productData[0];
        }
      }
    }
    if (this._productsToCollect.length > 0) {
      this.checkForm.get('shelfNo').setValue(this._productsToCollect[0].shelfNo);
    }


    await this.getCollectedOrderProducts(this.currentOrderNo); //toplanan ürünler çekildi
  }
  focusNextInput(nextInputId: string) {
    const nextInput = document.getElementById(nextInputId) as HTMLInputElement;
    if (nextInput) {
      nextInput.focus();
    }
  } //general service



  formGenerator() {
    this.checkForm = this.formBuilder.group({
      barcode: [null, Validators.required],
      shelfNo: [null, Validators.required],
      quantity: [null, Validators.required],
      batchCode: [null],
      // invoiceType: [null]
    });


  }
  async confirmTransfer(operationNumberList: string[]): Promise<any> {
    //transfer onaylama yapılır ve transfer listesinin ekranına atar!
    const response: boolean = await this.orderService.confirmTransfer(
      operationNumberList
    );

    if (response) {
      this.toasterService.success('Transfer işlemi Başarılı');
      this.router.navigate(['/warehouse-operation-list']);
    }
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


  async setShelves(barcode: string) {

    var result: string[] = await this.productService.countProductByBarcode(
      barcode
    );
    this.shelfNumbers = result[0];
  }


  async setFormValues(barcode: string): Promise<CountProduct> {

    try {
      var result: string[] = await this.productService.countProductByBarcode(
        barcode
      );
      this.shelfNumbers = result[0];
      var currentShelfNo = this.checkForm.get('shelfNo').value;
      this.checkForm.get('barcode').setValue(result[3]);
      this.checkForm.get('batchCode').setValue(result[2].toString());
      this.checkForm.get('quantity').setValue(result[1]);

      var product: CountProduct = new CountProduct(result[3], currentShelfNo, result[2], Number(result[1]));
      return product;
    } catch (error) {
      this.toasterService.error(error.message);
      return null;
    }
  }

  async onSubmit(productModel: CountProduct): Promise<any> {

    var operationType = this.currentOrderNo.split('-')[1]

    // = işareti varsa - yap
    if (productModel.barcode.includes("=")) {
      productModel.barcode = productModel.barcode.replace(/=/g, "-");

    }
    //RAF MI BARKOD MU KONTROLÜ
    var response = await this.warehouseService.countProductRequest2(
      productModel.barcode,
      productModel.shelfNo,
      productModel.quantity,
      null,
      this.warehouseCode,
      null,
      productModel.batchCode,
      'Order/CountProductControl',
      this.currentOrderNo,
      null,
      lineId
    );
    if (response.status == "RAF") {
      this.checkForm.reset();
      this.checkForm.get('shelfNo').setValue(productModel.barcode);
      return;
    }

    if (!this.checkForm.valid) {

      var updated_product = await this.setFormValues(

        productModel.barcode
      );
      productModel = updated_product;

      await this.onSubmit(productModel);
      // this.toasterService.success("Formu Verileri Dolduruldu.")
      return;
    }

    //satış faturası alanı ------------------------------------------------------------------------ ES

    if (this.checkForm.valid) {

      if (this.gs.isNullOrEmpty(this.shelfNumbers)) {
        await this.getShelves(productModel.barcode);
      }

      var foundModel = this.productsToCollect.find(
        (o) => o.barcode == productModel.barcode
      );

      //↑↑↑↑↑↑↑↑↑ EŞLEŞEN ÜRÜN BULUNDU ↑↑↑↑↑↑↑↑↑

      if (true) {
        var newResponse = this.shelfNumbers;
        const shelves = newResponse
          .split(',')
          .filter((raflar) => raflar.trim() !== '')
          .map((raflar) => raflar.toLowerCase());

        const foundProduct = this.productsToCollect.find(
          (o) => o.barcode == productModel.barcode

        );

        if (
          shelves.find(
            (s) => s.toLowerCase() == productModel.shelfNo.toLowerCase()
          ) &&
          (foundProduct != null || foundProduct != undefined)
        ) {



          if (foundProduct.quantity - productModel.quantity >= 0) {
            var lineId = this.productsToCollect.find(p => p.barcode == productModel.barcode
            ).lineId
            if (!lineId) {
              this.toasterService.error("lineId bulunamadı")
            }

            var response = await this.warehouseService.countProductRequest2(
              productModel.barcode,
              productModel.shelfNo,
              productModel.quantity,
              null,
              this.warehouseCode,
              null,
              productModel.batchCode,
              'Order/CountProduct',
              this.currentOrderNo,
              null,
              lineId
            );

            //↑↑↑↑↑↑↑↑↑ SAYIM YAPILDI ↑↑↑↑↑↑↑↑↑
            if (response.status.includes('Error')) {
              this.toasterService.error("Sayım Sırasında Hata Alındı : " + response.status)
              return;

            }

            await this.getAllProducts();
            this.toasterService.success('Ürün Toplama İşlemi Tamamlandı!');
            this.clearBarcodeAndQuantity();

          } else {
            this.toasterService.warn('Stok Hatası.');
          }
        } else {
          const confirmDelete = window.confirm(
            'Raf Numarası Eşleşmedi Yine De Eklemek İstiyor Musunuz?'
          );

          if (confirmDelete) {

            productModel.quantity =
              productModel.quantity;

            if (foundProduct.quantity - productModel.quantity >= 0) {
              var lineId = this.productsToCollect.find(p => p.barcode == productModel.barcode
              ).lineId
              if (!lineId) {
                this.toasterService.error("lineId bulunamadı")
              }

              var response = await this.warehouseService.countProductRequest2(
                this.checkForm.get('barcode').value,
                productModel.shelfNo,
                productModel.quantity,
                null,
                this.warehouseCode,
                null,
                productModel.batchCode,
                'Order/CountProduct',
                this.currentOrderNo,
                null,
                lineId
              );
              //↑↑↑↑↑↑↑↑↑ SAYIM YAPILDI ↑↑↑↑↑↑↑↑↑
              if (response.status.includes('Error')) {
                this.toasterService.error("Sayım Sırasında Hata Alındı : " + response.status)
                return;

              }

              await this.getAllProducts();

              //↑↑↑↑↑↑↑↑↑ TOPLANAN ÜRÜNLER ÇEKİLDİ ↑↑↑↑↑↑↑↑↑
              this.toasterService.success('Ürün Toplama İşlemi Tamamlandı!');
              this.clearBarcodeAndQuantity();

            } else {
              this.toasterService.warn('Stok Hatası.');
            }

          } else {
            this.toasterService.error("Eklenmedi")
          }
        }
      }
    }


  }



  async getShelves(barcode: string) {
    var newResponse = await this.productService.countProductByBarcode2(
      barcode
    );
    if (newResponse != null) {
      const shelves = newResponse[0]
        .split(',')
        .filter((raflar) => raflar.trim() !== '')


      this.productShelves = shelves;
      this.productShelvesDialog = true;
    }

  }
  setShelveToForm(shelve) {
    this.checkForm.get('shelfNo').setValue(shelve);
    this.toasterService.success("Raf Yerleştirildi");
    this.productShelvesDialog = false;
  }
  clearShelfNumbers() {
    // this.checkForm.get('shelfNo').setValue(null);
    this.checkForm.get('shelfNo').setValue(null);

    this.checkForm.get('barcode').setValue(null);
    this.checkForm.get('batchCode').setValue(null);


    this.checkForm.get('quantity').setValue(null);
    if (this.currentOrderNo.split('-')[1] === 'WS') {
      this.focusNextInput('shelfNo');
    } else {
      this.focusNextInput('barcode');
    }
  }

  clearBarcodeAndQuantity() {
    if (this.currentOrderNo.includes('WS') || this.currentOrderNo.includes('WT')) {
      if (this.lastCollectedProduct) {
        this.checkForm.get('shelfNo').setValue(this.lastCollectedProduct.shelfNo);
      }
      this.checkForm.get('batchCode').setValue(null);

    }
    if (this.currentOrderNo.includes('WT')) {
      this.shelfNumbers = null;
      this.focusNextInput('shelfNo');
    } else {
      this.focusNextInput('barcode');

    }
    this.checkForm.get('barcode').setValue(null);
    this.shelfNumbers = null;
    this.checkForm.get('batchCode').setValue(null);
    this.checkForm.get('quantity').setValue(null);
    this.gs.beep();
  }
  async scanCompleteHandler(result: string) {
    if (result != undefined) {
      try {
        this.toasterService.success(result);
      } catch (error) {
        this.toasterService.error(error.message);
      }
    }
  }
  async deleteOrderProduct(orderNo: string, product: any): Promise<boolean> {


    const confirmDelete = window.confirm(
      'Bu hareketi silmek istediğinizden emin misiniz?'
    );

    if (confirmDelete) {
      const response: boolean = await this.productService.deleteOrderProduct(
        orderNo,
        product.itemCode,
        product.id
      );
      if (response) {
        this.toasterService.success('Silme İşlemi Başarılı');
        this.gs.beep3();
        this.lastCollectedProducts =
          await this.productService.getCollectedOrderProducts(this.currentOrderNo);
        await this.getAllProducts();

      }
      return response;
    } else {
      return false;
    }
  }

  goDown(packageNo: string) {
    // packageNo'ya eşleşen ProductOfOrder'ı bulun
    const matchingProduct = this.productsToCollect.find(
      (product) => product.packageNo === packageNo
    );

    // Eğer eşleşen bir ürün bulunduysa
    if (matchingProduct) {
      // Ürünü diziden çıkarın
      const index = this.productsToCollect.indexOf(matchingProduct);
      if (index !== -1) {
        this.productsToCollect.splice(index, 1);

        // Ürünü dizinin sonuna ekleyin
        this.productsToCollect.push(matchingProduct);
      }
    }
  }

  goDown2(barcode: string, shelfNo: string, itemCode: string) {
    // packageNo'ya eşleşen ProductOfOrder'ı bulun
    const matchingProduct = this.productsToCollect.find(
      (product) =>
        product.barcode === barcode &&
        product.shelfNo == shelfNo &&
        product.itemCode == itemCode
    );

    // Eğer eşleşen bir ürün bulunduysa
    if (matchingProduct) {
      // Ürünü diziden çıkarın
      const index = this.productsToCollect.indexOf(matchingProduct);
      if (index !== -1) {
        if (this.productsToCollect.length - 1 >= index + 1) {
          this._productsToCollect = [];
          this._productsToCollect.push(this.productsToCollect[index + 1]);
          this.lastCollectedProduct = this.productsToCollect[index + 1];
        } else {
          this._productsToCollect = [];
          this._productsToCollect.push(this.productsToCollect[0]);
        }
        // this.productsToCollect.splice(index, 1);

        // // Ürünü dizinin sonuna ekleyin
        // this.productsToCollect.push(matchingProduct);
      }
    }
  }

}
