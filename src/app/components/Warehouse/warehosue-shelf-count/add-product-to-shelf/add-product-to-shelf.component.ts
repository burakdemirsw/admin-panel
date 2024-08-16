import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Exception } from '@zxing/library';
import { ClientUrls } from 'src/app/models/const/ClientUrls';
import { CreatePurchaseInvoice } from 'src/app/models/model/invoice/createPurchaseInvoice';
import { OrderBillingListModel } from 'src/app/models/model/order/orderBillingListModel';
import { ProductOfOrder } from 'src/app/models/model/order/productOfOrders';
import { CountProduct3 } from 'src/app/models/model/product/countProduct';
import { AvailableShelf } from 'src/app/models/model/warehouse/availableShelf';
import { WarehouseOfficeModel } from 'src/app/models/model/warehouse/warehouseOfficeModel';
import { ProductOnShelf } from 'src/app/models/model/warehouse/ztmsg_CountedProduct';
import { GeneralService } from 'src/app/services/admin/general.service';
import { HeaderService } from 'src/app/services/admin/header.service';
import { ProductService } from 'src/app/services/admin/product.service';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';
declare var window: any;
@Component({
  selector: 'app-add-product-to-shelf',

  templateUrl: './add-product-to-shelf.component.html',
  styleUrl: './add-product-to-shelf.component.css'
})
export class AddProductToShelfComponent {
  //#region params
  @Input() infoProducts: CreatePurchaseInvoice[] = [];
  [x: string]: any;

  isInQty: boolean;
  productsToCollect: ProductOfOrder[];
  collectedProducts: ProductOfOrder[] = [];
  checkForm: FormGroup;
  currentOrderNo: string;
  isCompleted: boolean;
  formModal: any;
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
  totalCount: number = 0;
  isFirstBarcode: boolean = false;
  currentbarcode: string;
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

    'Ürün Kodu',
    'Barkod',
    'Raf',
    'Giren Miktar',
    'Çıkan Miktar',
    'Depo',
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
    private productService: ProductService,
    private generalService: GeneralService,
    private warehouseService: WarehouseService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private headerService: HeaderService
  ) {

  }



  async ngOnInit() {

    this.formGenerator();
    await this.getWarehouseAndOffices();
    this.activatedRoute.params.subscribe(async (params) => {
      if (params['id']) {
        this.currentOrderNo = params['id'];
        await this.getProductOfCount(this.currentOrderNo);
      }
      if (params['isCompleted']) {
        this.isCompleted = params['isCompleted'] == 'true' ? true : false;
        console.log(this.isCompleted)
      }
      if (params['type']) {
        this.isInQty = params['type'] == 'true' ? true : false;
        if (this.isInQty) {
          this.headerService.updatePageTitle('Rafa Ürün Ekle');
        } else {
          this.headerService.updatePageTitle('Raftan Ürün Çıkar');

        }
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
      office: [null, Validators.required],
      warehouseCode: [null, Validators.required],
      batchCode: [null]
    });

  }


  calculateTotalQty() {
    let totalQty = 0;

    this.lastCollectedProducts.forEach((item) => {
      if (this.isInQty) {
        totalQty += item.in_Quantity;
      } else {
        totalQty += item.out_Quantity;

      }

    });
    this.totalCount = totalQty;
  }
  lastCollectedProducts: ProductOnShelf[] = [];
  async getProductOfCount(orderNo: string): Promise<any> {
    this.lastCollectedProducts = await this.warehouseService.getProductOnShelf(orderNo);
    this.calculateTotalQty();
  }


  async setFormValues(product: CountProduct3): Promise<CountProduct3> {

    try {

      var result: string[] = await this.productService.getShelvesOfProduct(
        product.barcode
      );
      if (result) {
        this.shelfNumbers = result[0];
        this.checkForm.get('batchCode').setValue(result[2]);
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
    formValue: CountProduct3
  ): Promise<any> {
    formValue.warehouseCode = formValue.warehouseCode.code;
    // EĞER BARKODTA = VARSA - İLE DEĞİŞTİR
    if (formValue.barcode.includes('=')) {
      formValue.barcode = formValue.barcode.replace(/=/g, '-');
    }

    if (
      !this.checkForm.valid
    ) {
      var updated_product = await this.setFormValues(

        formValue
      );
      if (updated_product) {
        if (this.checkForm.valid) {
          this.onSubmit(updated_product);
        }
        formValue = updated_product;
        this.toasterService.success("Form Verileri Güncellendi")
      }

      return;
    }


    if (this.checkForm.valid) {
      try {
        var request: ProductOnShelf = new ProductOnShelf();
        request.barcode = formValue.barcode;
        request.shelfNo = formValue.shelfNo;
        request.in_Quantity = this.isInQty == true ? formValue.quantity : 0;
        request.out_Quantity = this.isInQty == false ? formValue.quantity : 0;
        request.warehouseCode = formValue.warehouseCode;
        request.batchCode = formValue.batchCode;
        request.operationNumber = this.currentOrderNo;
        var _response = await this.warehouseService.addProductOnShelf(request);

        if (_response)
          // SAYIM YAPILDI -------------------------------------------
          this.generalService.beep();
        await this.getProductOfCount(this.currentOrderNo); //this.list.push(formValue);
        this.clearQrAndBatchCode();
        this.state = true;

        // EĞER GİRİLEN RAF  RAFLARDA YOKSA SORAR


      } catch (error: any) {
        this.toasterService.error(error.message);
        this.state = true;
      }
    }
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



  async completeCountFromService(orderNo: string) {
    try {
      var response = await this.warehouseService.completeProductOnShelfOperation(this.currentOrderNo)
      if (response) {
        this.toasterService.success('İşlem Başarılı');

      } else {
        this.toasterService.error('İşlem Başarısız  ');
      }
    } catch (error: any) {

    }
  }


  async deleteOrderProduct(id: string): Promise<boolean> {
    const confirmDelete = window.confirm(
      'Bu hareketi silmek istediğinizden emin misiniz?'
    );

    if (confirmDelete) {
      const response: boolean = await this.warehouseService.deleteProductOnShelf(
        id
      );

      if (response) {

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
  goBack() {
    window.history.back();
  }

}
