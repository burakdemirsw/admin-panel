import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Exception } from '@zxing/library';
import { ClientUrls } from 'src/app/models/const/ClientUrls';
import { CreatePurchaseInvoice } from 'src/app/models/model/invoice/createPurchaseInvoice';
import { CountProductRequestModel2 } from 'src/app/models/model/order/countProductRequestModel2';
import { OrderBillingListModel } from 'src/app/models/model/order/orderBillingListModel';
import { ProductOfOrder } from 'src/app/models/model/order/productOfOrders';
import { CountProduct3 } from 'src/app/models/model/product/countProduct';
import { CountedProduct, CountedProductControl } from 'src/app/models/model/product/countedProduct';
import { ItemBillingModel } from 'src/app/models/model/product/itemBillingModel ';
import {
  ProductCountModel,
} from 'src/app/models/model/shelfNameModel';
import { AvailableShelf } from 'src/app/models/model/warehouse/availableShelf';
import { CompleteCountOperation_CM } from 'src/app/models/model/warehouse/completeCount_CM';
import { WarehouseOfficeModel } from 'src/app/models/model/warehouse/warehouseOfficeModel';
import { ZTMSG_CountedProduct, ProductOnShelf } from 'src/app/models/model/warehouse/ztmsg_CountedProduct';
import { GeneralService } from 'src/app/services/admin/general.service';
import { ProductService } from 'src/app/services/admin/product.service';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';
declare var window: any;

@Component({
  selector: 'app-warehosue-shelf-count',
  templateUrl: './warehosue-shelf-count.component.html',
  styleUrls: ['./warehosue-shelf-count.component.css'],
})
export class WarehosueShelfCountComponent implements OnInit {
  //#region params
  @Input() infoProducts: CreatePurchaseInvoice[] = [];
  [x: string]: any;
  productsToCollect: ProductOfOrder[];
  collectedProducts: ProductOfOrder[] = [];
  process: boolean = false;
  checkForm: FormGroup;
  activeTab: number = 1;
  currentOrderNo: string;
  modalImageUrl: string;
  formModal: any;
  qrCodeValue: string;
  qrCodeDownloadLink: any = this.sanitizer.bypassSecurityTrustResourceUrl('');
  blocked: boolean;
  visible: boolean = false;
  _visible: boolean = false;
  barcode: string = null;
  quantity: number = null;
  batchCode: string = null;
  orderBillingList: OrderBillingListModel[] = [];
  itemBillingModels: ItemBillingModel[] = [];
  orderNo: string = '';
  warehouseModels: WarehouseOfficeModel[] = [];
  currentQrCode: string = '';
  orderBillingModel: OrderBillingListModel;
  shelfNumbers: string = 'RAFLAR:';
  location = location.href;
  photoUrl: string = ClientUrls.photoUrl;
  offices: any[] = []
  warehouses: any[] = []
  shelves: AvailableShelf[] = [];
  shelves2: AvailableShelf[] = [];
  list: CountProductRequestModel2[] = [];
  totalCount: number = 0;
  currentPage: number = 1;
  isFirstBarcode: boolean = false;
  currentbarcode: string;
  barcodeList: string[] = [];
  countedProductControl: CountedProductControl[] = [];
  controlMessage = ""
  tableHeaders: string[] = [
    'Fotoğraf',
    'Raf',
    'Ürün Kodu',
    'Miktar',
    'Parti',
    'Barkod',
    'Müşteri Kodu',
    'Depo',
    'Ofis',
  ];
  _tableHeaders: string[] = [
    'Resim',
    'Raf',
    'Ürün Kodu',
    'Miktar',
    'Parti',
    'Barkod',
    'İşlem',
  ];

  _tableHeaders2: string[] = [

    'Ürün Kodu',

    'Durum',
  ];
  //#endregion

  constructor(
    private formBuilder: FormBuilder,
    private toasterService: ToasterService,
    private httpClient: HttpClient,
    private productService: ProductService,
    private generalService: GeneralService,
    private warehouseService: WarehouseService,
    private activatedRoute: ActivatedRoute,
    private title: Title,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
    this.title.setTitle('Sayım');
  }

  change(barcode: string, quantity: number, batchCode: string) {
    this.visible = !this.visible;
    this.barcode = barcode;
    this.quantity = quantity;
    this.batchCode = batchCode;
  }

  async ngOnInit() {

    this.getWarehouseAndOffices();
    this.formGenerator();
    this.activatedRoute.params.subscribe(async (params) => {
      this.currentOrderNo = params['orderNo'];
      if (this.currentOrderNo) {
        await this.getProductOfCount(this.currentOrderNo);

      } else {

      }
    });
  }


  async getWarehouseAndOffices() {
    var response = await this.warehouseService.getWarehouseAndOffices();
    this.warehouseModels = response;

    const officeSet = new Set();
    const warehouseSet = new Set();

    this.warehouseModels.forEach(model => {
      officeSet.add(model.officeCode);
      warehouseSet.add(model.warehouseCode);
    });

    this.offices = Array.from(officeSet);
    this.warehouses = Array.from(warehouseSet).map(code => {
      const model = this.warehouseModels.find(warehouse => warehouse.warehouseCode === code);
      return {
        code: model.warehouseCode,
        name: model.warehouseDescription
      };
    });
  }


  goDown2(desc: string) {
    // packageNo'ya eşleşen ProductOfOrder'ı bulun
    const matchinShelf = this.shelves.find(
      (shelve) => shelve.description === desc
    );

    if (matchinShelf) {
      // Ürünü diziden çıkarın
      const index = this.shelves.indexOf(matchinShelf);
      if (index !== -1) {
        this.shelves2 = [];
        if (this.shelves.length - 1 >= index + 1) {
          this.shelves2.push(this.shelves[index + 1]);
        } else {
          this.shelves2.push(this.shelves[0]);
        }
      }
    }
  }

  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
    this.openImageModal(this.qrCodeDownloadLink);
    this.qrCodeValue = '';
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

  focusNextInput(nextInputId: string) {
    const nextInput = document.getElementById(nextInputId) as HTMLInputElement;
    if (nextInput) {
      nextInput.focus();
    }
  }

  formGenerator() {
    this.checkForm = this.formBuilder.group({
      barcode: [null, Validators.required],
      shelfNo: [null, Validators.required],
      quantity: [null, Validators.required],
      officeCode: [null, Validators.required],
      warehouseCode: [null, Validators.required],
      batchCode: [null],
      isShelfBased: [false],
      isShelfBased2: [false]
    });

  }


  calculateTotalQty() {
    let totalQty = 0;
    this.lastCollectedProducts.forEach((item) => {
      totalQty += item.quantity;
    });
    this.totalCount = totalQty;
  }
  lastCollectedProducts: ZTMSG_CountedProduct[] = [];
  lastCollectedProducts2: ProductOnShelf[] = [];
  async getProductOfCount(orderNo: string): Promise<any> {
    this.lastCollectedProducts = await this.warehouseService.getCountsOfOperation(
      orderNo
    );

    this.calculateTotalQty();
  }


  async countProductRequest(
    barcode: string,
    shelfNo: string,
    quantity: number,
    office: string,
    warehouseCode: string,
    batchCode: string,

    url: string
  ): Promise<ProductCountModel> {
    var requestModel: CountProductRequestModel2 =
      new CountProductRequestModel2();
    requestModel.barcode = barcode;
    requestModel.shelfNo = shelfNo;
    requestModel.quantity = quantity;
    requestModel.office = office;
    requestModel.warehouseCode = warehouseCode;
    requestModel.batchCode = batchCode;

    var response = await this.httpClient
      .post<ProductCountModel | undefined>(url, requestModel)
      .toPromise();

    return response;
  }

  async setFormValues(product: CountProduct3): Promise<CountProduct3> {

    try {

      var result: string[] = await this.productService.getShelvesOfProduct(
        product.barcode
      );
      if (result) {
        this.shelfNumbers = result[0];
        this.checkForm.get('batchCode').setValue(result[2]?.toString());
        this.checkForm.get('barcode').setValue(result[3]);
        this.checkForm.get('quantity').setValue(Number(result[1]));

        var updated_product: CountProduct3 = product;
        updated_product.quantity = Number(result[1]);
        updated_product.batchCode = result[2];
        updated_product.barcode = result[3];
        return updated_product;
      } else {

        throw new Exception('Ürün Doğrulaması Başarısız');
      }

    } catch (error) {
      this.toasterService.error(error.message);
      return null;
    }
  }

  async getQuantity(barcode: string): Promise<string> {
    var result: string[] = await this.productService.getShelvesOfProduct(
      barcode
    );

    return result[1];
  }
  state: boolean = true;


  async onSubmit(
    countProductRequestModel: CountProduct3
  ): Promise<any> {

    // EĞER BARKODTA = VARSA - İLE DEĞİŞTİR
    if (countProductRequestModel.barcode.includes('=')) {
      countProductRequestModel.barcode = countProductRequestModel.barcode.replace(/=/g, '-');
    }

    if (
      !this.checkForm.valid
    ) {
      var updated_product = await this.setFormValues(

        countProductRequestModel
      );
      if (updated_product) {
        if (this.checkForm.valid) {
          this.onSubmit(updated_product);
        }
        countProductRequestModel = updated_product;
        this.toasterService.success("Form Verileri Güncellendi")
      }

      return;
    }


    if (this.checkForm.valid) {
      try {
        countProductRequestModel.warehouseCode = countProductRequestModel.warehouseCode.code;
        var request: ZTMSG_CountedProduct = new ZTMSG_CountedProduct();
        request.barcode = countProductRequestModel.barcode;
        request.shelfNo = countProductRequestModel.shelfNo;
        request.quantity = countProductRequestModel.quantity;
        request.officeCode = countProductRequestModel.office;
        request.warehouseCode = countProductRequestModel.warehouseCode;
        request.batchCode = countProductRequestModel.batchCode;
        request.operationNumber = this.currentOrderNo;
        request.isCompleted = false;
        request.operationType = this.checkForm.get("isShelfBased").value == true ? this.checkForm.get("isShelfBased").value : this.checkForm.get("isShelfBased2").value

        var _response = await this.warehouseService.addCount(request);
        if (_response)
          // SAYIM YAPILDI -------------------------------------------
          this.generalService.beep();
        await this.getProductOfCount(this.currentOrderNo); //this.list.push(countProductRequestModel);
        this.clearQrAndBatchCode();
        this.state = true;

        // EĞER GİRİLEN RAF  RAFLARDA YOKSA SORAR


      } catch (error: any) {
        this.toasterService.error(error.message);
        this.state = true;
      }
    }
  }

  async check() {
    await this.onSubmit(this.checkForm.value);
  }

  clearShelfNumbers() {
    this.checkForm.get('shelfNo').setValue(null);
    this.checkForm.get('barcode').setValue(null);
    this.focusNextInput('shelfNo');
    this.shelfNumbers = 'Raf No';

    this.checkForm.get('quantity').setValue(null);
    this.checkForm.get('batchCode').setValue(null);
  }
  clearQrAndBatchCode() {
    this.checkForm.get('barcode').setValue(null);
    this.checkForm.get('batchCode').setValue(null);
    this.checkForm.get('quantity').setValue(null);
    this.focusNextInput('countPageBarcode');
    this.shelfNumbers = 'Raf No';

    this.calculateTotalQty();
  }


  async completeCountFromService(orderNo: string): Promise<boolean> {
    try {
      // İşlem öncesi kullanıcıya onay iletilisi göster
      const userConfirmed = window.confirm(
        'İşlemi tamamlamadan önce sayımı eşitlemek istiyor musunuz?'
      );

      if (!userConfirmed) {
        // Kullanıcı işlemi onaylamadıysa işlemi iptal et
        return false;
      }

      var isShelfBased = this.checkForm.get("isShelfBased");
      var isShelfBased2 = this.checkForm.get("isShelfBased2");
      if (isShelfBased.value === false && isShelfBased2.value === false) {
        this.toasterService.error("Lütfen bir sayım tipi seçiniz")

        return false;

      }
      if (isShelfBased.value === true && isShelfBased2.value === true) {
        isShelfBased.setValue(false);
        isShelfBased2.setValue(false);

        this.toasterService.error("Sadece bir sayım tipi seçilmelidir")
        return false;

      }

      //YENI KODLAR-------------- 29.08
      var request: CompleteCountOperation_CM
      request = new CompleteCountOperation_CM();
      request.countType = isShelfBased.value === true ? 0 : 1; //0-> raf bazında dayım | 1-> ürün bazında ürün sayım
      request.operationNo = this.currentOrderNo;
      const response = await this.warehouseService.completeCountOperation(request)

      if (response === true) {

        this.toasterService.success("İşlem Başarılı")
        this.router.navigate(['/warehouse-shelf-count-list']);
        return true;
      } else {

        this.toasterService.error('İşlem Başarısız');
        return false;
      }
    } catch (error: any) {
      this.toasterService.error('İşlem Başarısız');
      return false;
    }
  }

  async getControlledProducts() {
    this.countedProductControl = await this.warehouseService.getProductOfCountControl(this.currentOrderNo);
    if (this.collectedProducts.length > 0) {
      this.controlMessage = "Aşağıdaki Ürünlerin Sayımı BAŞARISIZDIR.Lütfen Ürünlerin Parti /  Barkodunu Kontrol Ediniz."

    } else {
      this.controlMessage = "Sayım Başarılıdır"

    }
    this._visible = true;
  }
  async deleteOrderProduct(orderNo: string, product: any): Promise<boolean> {
    const confirmDelete = window.confirm(
      'Bu hareketi silmek istediğinizden emin misiniz?'
    );

    if (confirmDelete) {
      const response: boolean = await this.warehouseService.deleteCount(
        product
      );

      if (response) {
        this.list = this.list.filter(
          (o) => !(o.barcode == product.itemCode && o.shelfNo == product.shelfNo)
        );
        this.calculateTotalQty();
        await this.getProductOfCount(this.currentOrderNo);
        this.toasterService.success('Silme İşlemi Başarılı.');
      } else {
        this.toasterService.error('Silme İşlemi Başarısız.');
      }
      return response;

    } else {
      return false;
    }

  }


}
