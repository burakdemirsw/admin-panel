import { OnInit, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BarcodeModel } from 'src/app/models/model/product/barcodeModel';
import { WarehouseModel } from 'src/app/models/model/warehouse/warehouseModel';
import { WarehouseOfficeModel } from 'src/app/models/model/warehouse/warehouseOfficeModel';
import { OfficeModel } from 'src/app/models/model/warehouse/officeModel';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';
import { GeneralService } from 'src/app/services/admin/general.service';
import { ProductService } from 'src/app/services/admin/product.service';
import {
  ProductCountModel,
  ProductCountModel3,
} from 'src/app/models/model/shelfNameModel';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { TransferModel } from 'src/app/models/model/warehouse/transferModel';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { ClientUrls } from 'src/app/models/const/ClientUrls';
import { WarehouseItem } from 'src/app/models/model/warehouse/warehouseItem';
import { InventoryItem } from 'src/app/models/model/product/inventoryItemModel';
import { OrderService } from 'src/app/services/admin/order.service';
import { QrControlCommandModel } from 'src/app/models/model/product/qrControlModel';
import { QrOperationModel } from 'src/app/models/model/product/qrOperationModel';
import { QrOperationResponseModel } from 'src/app/models/model/client/qrOperationResponseModel';
declare var window: any;

@Component({
  selector: 'app-warehouse-operation',
  templateUrl: './warehouse-operation.component.html',
  styleUrls: ['./warehouse-operation.component.css'],
})
export class WarehouseOperationComponent implements OnInit {
  currentOrderNo: string = '';
  activeTab: number = 1;
  warehoseModel: WarehouseModel[];
  warehouseForm: FormGroup;
  isDisabled: boolean = true;
  qrCode: string = null;

  currentBarcode: string = null;
  stockStatus: boolean = false;
  warehousePackageDetails: WarehouseModel[] = [];
  constructor(
    private httpClientService: HttpClientService,
    private formBuilder: FormBuilder,
    private alertifyService: AlertifyService,
    private activatedRoute: ActivatedRoute,
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private generalService: GeneralService,
    private productService: ProductService,
    private warehouseService: WarehouseService,
    private title: Title,
    private httpClient: HttpClient,
    private orderService: OrderService
  ) { } // Add this line
  warehouseModels: WarehouseOfficeModel[] = [];
  warehouseModels2: WarehouseOfficeModel[] = [];
  barcodeModel: BarcodeModel = new BarcodeModel();
  shelfNo: string = null;
  colorCode: string = null;
  itemDim1Code: string = null;
  itemCode: string = null;
  batchCode: string;
  officeModels: OfficeModel[] = [];

  visible: boolean = false;
  _barcode: string = null;
  quantity: number = null;
  change(barcode: string, quantity: number) {
    this.visible = !this.visible;
    this._barcode = barcode;
    this.quantity = quantity
  }

  async ngOnInit() {
    this.formGenerator();
    this.warehouseForm.valueChanges.subscribe(() => {
      var office = this.warehouseForm.get('office').value
      var officeTo = this.warehouseForm.get('officeTo').value
      if ((office === officeTo) && (office !== null)) {
        // this.alertifyService.error("Ofisler Farklı Olmalıdır")
        this.warehouseForm.get('office').setValue(null)
        this.warehouseForm.get('officeTo').setValue(null)
      }
    });

    //this.spinnerService.show();
    this.activatedRoute.params.subscribe(async (params) => {
      this.currentOrderNo = 'TP-' + params['number'];

      if (!this.currentOrderNo.includes('REQ-')) {
        await this.getProductOfCount(this.currentOrderNo); //this.list.push(formValue);
      } else if (this.currentOrderNo.includes('REQ-')) {
        await this.getProductOfCount(this.currentOrderNo);

        await this.getInventoryItems(this.currentDataType);
      }

      this.warehouseForm.get('orderNo').setValue(this.currentOrderNo);
      //this.alertifyService.success(this.warehouseForm.get('orderNo').value)
      //this.spinnerService.hide();
    });


    //  await this.getOfficeCodeList();
  }

  inventoryItemColums: string[] = [
    'Fotoğraf',
    'Raf',
    'Ürün Kodu',
    'Transfer Miktarı',
    'Toplam Stok',
    'Ürün',
    'Barkod',
  ];
  _inventoryItemColums: string[] = [
    'Fotoğraf',
    'Raf',
    'Ürün Kodu',
    'Transfer Miktarı',
    'Toplam Stok',
    'Barkod',
    'İşlem',
  ];
  inventoryItems: InventoryItem[] = [];
  _inventoryItems: InventoryItem[] = [];
  lastCollectedProduct: InventoryItem = null;

  goDown2(
    barcode: string,
    shelfNo: string,
    itemCode: string,
    transferQty: number
  ) {
    // packageNo'ya eşleşen ProductOfOrder'ı bulun
    const matchingProduct = this.inventoryItems.find(
      (product) =>
        product.barcode === barcode &&
        product.shelfNo == shelfNo &&
        product.itemCode == itemCode &&
        product.transferQty == transferQty
    );

    // Eğer eşleşen bir ürün bulunduysa
    if (matchingProduct) {
      // Ürünü diziden çıkarın
      const index = this.inventoryItems.indexOf(matchingProduct);
      if (index !== -1) {
        if (this.inventoryItems.length - 1 >= index + 1) {
          this._inventoryItems = [];
          this._inventoryItems.push(this.inventoryItems[index + 1]);
          this.lastCollectedProduct = this.inventoryItems[index + 1];
        } else {
          this._inventoryItems = [];
          this._inventoryItems.push(this.inventoryItems[0]);
        }
        // this.productsToCollect.splice(index, 1);

        // // Ürünü dizinin sonuna ekleyin
        // this.productsToCollect.push(matchingProduct);
      }
    }
  }

  currentDataType = "0";
  async onDataChange(type: string) {
    if (type === '0') {
      this.alertifyService.success("Varsayılan Ürünler Getirildi")
    } else if (type === '1') {
      this.alertifyService.success("Raflar Fullendi")

    }
    this.currentDataType = type;
    this.inventoryItems = [];
    await this.getInventoryItems(this.currentDataType);
  }

  async getInventoryItems(type: string) {
    this.inventoryItems = await this.orderService.getInventoryItems(type);

    if (this.inventoryItems.length > 0) {
      if (this.lastCollectedProduct == null) {
        //üste atılcak ürün seçildi
        this._inventoryItems = [];
        this._inventoryItems.push(this.inventoryItems[0]);
        this.lastCollectedProduct = this.inventoryItems[0];
      } else {
        //eğer son sayılan ürün varsa
        var foundedProduct = this.inventoryItems.find(
          (p) =>
            p.barcode == this.lastCollectedProduct.barcode &&
            p.itemCode == this.lastCollectedProduct.itemCode &&
            p.shelfNo == this.lastCollectedProduct.shelfNo
        );

        if (foundedProduct) {
          //eğer ürün bulunduysa

          if (foundedProduct.quantity > 0) {
            //miktar değeri 0 dan büyükse
            this._inventoryItems = [];
            this._inventoryItems.push(foundedProduct);
            this.lastCollectedProduct = foundedProduct;
          } else {
            //miktar değeri 0 dan küçükse
            this._inventoryItems = [];
            this._inventoryItems.push(this.inventoryItems[0]);
            this.lastCollectedProduct = this.inventoryItems[0];
          }
        } else {
          //üürn bulunmdadıysa

          this._inventoryItems = [];
          this._inventoryItems.push(this.inventoryItems[0]);
          this.lastCollectedProduct = this.inventoryItems[0];
        }
      }
    }
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

  formGenerator() {
    try {
      this.warehouseForm = this.formBuilder.group({
        id: [null],
        shelfNo: [this.shelfNo, Validators.required],
        barcode: [this.currentBarcode, Validators.required],
        quantity: [null, Validators.required],
        batchCode: [this.batchCode],
        office: [null, Validators.required],
        officeTo: [null, Validators.required],
        warehouse: [null, Validators.required],
        warehouseTo: [null, Validators.required],
        orderNo: [null, Validators.required],
      });
    } catch (error) {
      console.error(error);
      // Handle the error as needed.
    }
  }

  async getOfficeCodeList(): Promise<any> {
    try {
      const response = await this.httpClientService
        .get<OfficeModel>({
          controller: 'Warehouse/GetOfficeModel',
        })
        .toPromise();
      this.officeModels = response;
    } catch (error: any) {
      //// console.log(error.message);
    }
  }
  async getSelectedOffice(from: number): Promise<any> {
    if (from == 1) {
      await this.getWarehouseList(this.warehouseForm.get('office')?.value, 1);
    } else {
      await this.getWarehouseList(this.warehouseForm.get('officeTo')?.value, 2);
    }
  }

  async getWarehouseList(value: string, from: number): Promise<any> {
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

          this.warehouseForm
            .get('warehouse')
            .setValue(response[0].warehouseCode);
          const selectedValue2 = this.warehouseForm.get('warehouse').value;

          console.clear();
          // console.log('Form Değeri (warehouseCode) \n' + selectedValue2); //null geliyor
          return true;
        } else {
          this.alertifyService.error('Depo Çekilemedi');
          return false;
        }
      } else {
        const selectElement = document.getElementById(
          'officeTo'
        ) as HTMLSelectElement;

        value = selectElement.value == '' ? 'M' : selectElement.value;
        const response = await this.httpClientService
          .get<WarehouseOfficeModel>({
            controller: 'Warehouse/GetWarehouseModel/' + value,
          })
          .toPromise();

        if (response) {
          this.warehouseModels2.push(response[0]);

          this.warehouseForm
            .get('warehouseTo')
            .setValue(response[0].warehouseCode);
          const selectedValue2 = this.warehouseForm.get('warehouseTo').value;
          console.clear();
          // console.log('Form Değeri (warehouseTo) \n' + selectedValue2); //null geliyor
          return true;
        } else {
          this.alertifyService.error('Depo Çekilemedi');
          return false;
        }
      }
    } catch (error: any) {
      //// console.log(error.message);
    }
  }

  onModelChanged(value: string) {
    this.getShelfByQrDetail(value);
  }

  controlItemStock(): boolean {
    var barcodeList: string[] = [];

    this.warehouseTransferForms.forEach((t) => { });
    return true;
  }
  wrongItemList: WarehouseItem[] = [];
  async transferToNebim(currentOrderNo: string) {

    if (currentOrderNo != null && currentOrderNo !== '') {
      const userConfirmed = window.confirm(
        this.currentOrderNo +
        ' numaralı sipariş için İşlemi başlatmak istediğinize emin misiniz?'
      );

      if (userConfirmed) {
        try {
          //this.spinnerService.show();
          const data = await this.httpClient
            .get<WarehouseItem | any>(
              ClientUrls.baseUrl +
              '/Warehouse/TransferProducts/' +
              currentOrderNo
            )
            .toPromise();

          if (data === true) {
            this.generalService.waitAndNavigate(
              'Transfer İşlemi Başarıyla Gerçekleşti.',
              'warehouse-operation-list'
            );
          } else {
            this.alertifyService.error('İşlem Başarısız');
          }
        } catch (error: any) {
          // console.log(error.message);
        }
      } else {
        this.alertifyService.warning('İşlem iptal edildi.');
      }
    } else {
      this.alertifyService.warning('Sipariş No Boş Geliyor.');
    }
    //this.spinnerService.hide();
  }

  changePage() {
    setTimeout(() => {
      this.router.navigate(['/warehouse-operation-confirm']);
    }, 2000);
  }

  barcode: string = null;

  warehouseTransferForms: TransferModel[] = [];

  async setShelfNo(barcode: string): Promise<string> {
    this.shelfNumbers = 'RAFLAR:';

    if (barcode) {
      var result: string[] = await this.productService.countProductByBarcode(
        barcode
      );
      this.shelfNumbers += result[0];
      return result[1];
    } else {
      this.alertifyService.warning('Barkod Alanı Boş.');
      return null;
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
          var currentShelfNo = this.warehouseForm.get('shelfNo').value;
          // if(currentShelfNo==null ){
          //   this.warehouseForm.get('shelfNo').setValue(result[0].split(',')[0]);
          // }

          this.warehouseForm.get('batchCode').setValue(result[2]);
          this.warehouseForm.get('barcode').setValue(result[3]);
        }

        return result[1];
      } else {
        var result: string[] = await this.productService.countProductByBarcode(
          barcode
        );
        this.shelfNumbers += result[0];
        return result[1];
      }
    } catch (error) {
      this.alertifyService.error(error.message);
      return null;
    }
  }
  qrBarcodeUrl: string = null;
  qrOperationModels: QrOperationModel[] = [];
  async onSubmit(formValue: any): Promise<any> {

    if (formValue.barcode.includes("=")) {
      formValue.barcode = formValue.barcode.replace(/=/g, "-");

    }


    if (
      formValue.barcode.includes('http') ||
      this.generalService.isGuid(formValue.barcode)
    ) {
      var number = await this.setFormValues(formValue.barcode, true);
      this.qrBarcodeUrl = formValue.barcode;
      this.warehouseForm.get('quantity')?.setValue(Number(number));

      // this.onSubmit(this.warehouseForm.value);
      return;
    }

    if (!this.warehouseForm.valid) {
      if (formValue.barcode) {
        var number = await this.setFormValues(formValue.barcode, true);
        this.warehouseForm.get('quantity')?.setValue(Number(number)); //quantity alanı dolduruldu
        this.alertifyService.success(
          'Raflar Getirildi Ve Miktar Alanı Dolduruldu.'
        );
      } else {
        this.alertifyService.warning('Barkod Alanı Boş.');
      }

      return;
    } else if (this.warehouseForm.valid) {
      var newResponse = await this.productService.countProductByBarcode(
        formValue.barcode
      );

      const shelves = newResponse[0]
        .split(',')
        .filter((raflar) => raflar.trim() !== '')
        .map((raflar) => raflar.toLowerCase());
      shelves.forEach((s) => {
        s = s.toLowerCase();
      });

      if (shelves.includes(formValue.shelfNo.toLowerCase())) {
        var response = await this.productService.countTransferProduct(
          formValue
        );


        if (response != undefined) {

          //↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

          var qrResponse: QrOperationResponseModel =
            await this.productService.qrOperationMethod(
              this.qrBarcodeUrl,
              this.warehouseForm,
              formValue,
              Number(newResponse[1]),
              false,
              'WT'
            );
          if (qrResponse != null && qrResponse.state === true) {
            this.qrOperationModels.push(qrResponse.qrOperationModel);
          } else if (qrResponse === null) {
            this.qrBarcodeUrl = null
          }

          //↑↑↑↑↑↑↑↑↑ EĞER QRURl BOŞ DEĞİLSE KONTROL EDİLCEK ↑↑↑↑↑↑↑↑↑
          var data: ProductCountModel = response;
          if (data.status == 'RAF') {
            formValue.shelfNo = response.description;
          } else {
            formValue.barcode = response.description;
          }

          const parcalanmisVeri = this.shelfNumbers.split(':');
          const raflarKismi = parcalanmisVeri[1];
          const raflar = raflarKismi
            .split(',')
            .filter((raflar) => raflar.trim() !== '')
            .map((raflar) => raflar.toLowerCase());

          if (raflar.length > 0) {
            if (raflar.includes(formValue.shelfNo.toLowerCase())) {
              formValue.quantity = Number(newResponse[1]);

              await this.getProductOfCount(this.currentOrderNo); //this.list.push(formValue);
              this.generalService.beep();
              this.calculateTotalQty();
              this.clearQrAndBatchCode();
            } else {
              if (confirm('Raf Bulunamadı! Eklensin mi(1)?')) {
                var newResponse =
                  await this.productService.countProductByBarcode(
                    formValue.barcode
                  );
                formValue.quantity = Number(newResponse[1]);

                await this.getProductOfCount(this.currentOrderNo); //this.list.push(formValue);
                this.generalService.beep();
                this.calculateTotalQty();
                this.clearQrAndBatchCode();
              } else {
                this.calculateTotalQty();
                this.alertifyService.warning('Ekleme Yapılmadı!');
              }
            }
          } else {
            formValue.quantity = Number(newResponse[1]);
            this.generalService.beep();

            await this.getProductOfCount(this.currentOrderNo);
            this.calculateTotalQty();
            this.clearQrAndBatchCode();
          }
        }
      } else {
        if (
          confirm(
            'Raf Bulunamadı! Raf Barkod Doğrulaması Yapılmadan Eklensin mi(2)?'
          )
        ) {
          var number = await this.setShelfNo(formValue.barcode);
          this.warehouseForm.get('quantity')?.setValue(Number(number));

          var response = await this.productService.countTransferProduct(
            formValue
          );


          if (response != undefined) {
            //↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

            var qrResponse: QrOperationResponseModel =
              await this.productService.qrOperationMethod(
                this.qrBarcodeUrl,
                this.warehouseForm,
                formValue,
                Number(newResponse[1]),
                false,
                'WT'
              );
            if (qrResponse != null && qrResponse.state === true) {
              this.qrOperationModels.push(qrResponse.qrOperationModel);
            } else if (qrResponse === null) {
              this.qrBarcodeUrl = null
            }
            //↑↑↑↑↑↑↑↑↑ EĞER QRURl BOŞ DEĞİLSE KONTROL EDİLCEK ↑↑↑↑↑↑↑↑↑
            var data: ProductCountModel = response;
            if (data.status == 'RAF') {
              formValue.shelfNo = response.description;
            } else {
              formValue.barcode = response.description;
            }
            formValue.quantity = Number(newResponse[1]);

            await this.getProductOfCount(this.currentOrderNo); //this.list.push(formValue);
            this.generalService.beep();
            this.calculateTotalQty();
            this.clearQrAndBatchCode();
          }
        } else {
          var number = await this.setShelfNo(formValue.barcode);
          this.warehouseForm.get('quantity')?.setValue(Number(number));
          this.alertifyService.success(
            'Raflar Getirildi Ve Miktar Alanı Dolduruldu.'
          );
        }
      }
    } else {
      this.alertifyService.error('Form Geçersiz');
    }
  }

  async getProductOfCount(orderNo: string): Promise<any> {
    this.warehouseTransferForms =
      await this.warehouseService.getProductOfTrasfer(orderNo);
    this.calculateTotalQty();
  }

  totalCount: number;
  calculateTotalQty() {
    //toplanan ürünler yazısı için
    let totalQty = 0;
    this.warehouseTransferForms.forEach((item) => {
      totalQty += item.quantity;
    });
    this.totalCount = totalQty;
  }

  clearQrAndBatchCode() {
    this.warehouseForm.get('barcode').setValue(null);
    this.warehouseForm.get('batchCode').setValue(null);
    this.warehouseForm.get('quantity').setValue(null);
    this.warehouseForm.get('shelfNo').setValue(null);
    this.shelfNumbers = 'RAFLAR:';
    this.qrBarcodeUrl = null;

    this.focusNextInput('barcode');
  }
  resetForm() {
    this.warehouseForm.patchValue({
      shelfNo: null,
      barcode: null,
      batchCode: null,
      itemCode: null,
    });
    this.focusNextInput('shelfNo');
  }
  warehosueModel: WarehouseModel = new WarehouseModel();
  getShelfDetail(id: string): any {
    //apiden gerekli fonksiyonlar kurulcak

    try {
      this.httpClientService
        .get<WarehouseModel>({
          controller: 'Shelves/' + id,
        })
        .subscribe((data) => {
          ////// console.log(data);
          this.warehoseModel = data;
          this.warehosueModel = data[0];
          this.formGenerator();
        });
    } catch (error: any) {
      // console.log(error.message);
    }
  }

  deleteRow(index: number) {
    this.warehouseTransferForms.splice(index, 1); // İlgili satırı listeden sil
  }

  clearAllList() {
    this.warehousePackageDetails.splice(0); // Tüm elemanları sil
    this.warehouseForm.reset();
    //this.spinnerService.show();
    setTimeout(() => {
      //this.spinnerService.hide();
      this.alertifyService.success('NEBIME BAŞARIYLA AKTARILDI!');
    }, 2000);
  }

  focusNextInput2() {
    this.onSubmit(this.warehouseForm.value);
  }

  focusNextInput(nextInputId: string) {
    const nextInput = document.getElementById(nextInputId) as HTMLInputElement;
    if (nextInput) {
      nextInput.focus();
    }
  }

  getShelfByQrDetail(id: string): any {
    //apiden gerekli fonksiyonlar kurulcak

    try {
      this.httpClientService
        .get<WarehouseModel>({
          controller: 'Shelves/qr/' + id,
        })
        .subscribe((data) => {
          ////// console.log(data);
          this.warehoseModel = data;
          this.warehosueModel = data[0];
          this.formGenerator();
        });
    } catch (error: any) {
      // console.log(error.message);
    }
  }
  shelfNumbers: string = 'RAFLAR:';
  clearShelfNumbers() {
    this.warehouseForm.get('shelfNo').setValue(null);
    this.warehouseForm.get('barcode').setValue(null);
    this.focusNextInput('shelfNo');
    this.shelfNumbers = 'RAFLAR:';
    this.qrBarcodeUrl = null;
    this.warehouseForm.get('quantity').setValue(null);
  }

  async deleteOrderProduct(orderNo: string, product: any): Promise<boolean> {
    const confirmDelete = window.confirm(
      'Bu hareketi silmek istediğinizden emin misiniz?'
    );

    if (confirmDelete) {
      const response: boolean = await this.productService.deleteOrderProduct(
        this.currentOrderNo,
        product.itemCode,
        product.id
      );
      if (response) {
        this.warehouseTransferForms = this.warehouseTransferForms.filter(
          (o) => !(o.barcode == product.itemCode && o.shelfNo == product.shelfNo)
        );
        this.calculateTotalQty();
        await this.getProductOfCount(this.currentOrderNo);
        this.alertifyService.success('Silme İşlemi Başarılı.');
      } else {
        this.alertifyService.error('Silme İşlemi Başarısız.');
      }

      var model: QrOperationModel = new QrOperationModel();
      var qrOperationModel: QrOperationModel = new QrOperationModel();

      qrOperationModel = this.qrOperationModels.find(
        (p) =>
          p.barcode == product.barcode &&
          p.batchCode == product.batchCode &&
          p.shelfNo == product.shelfNo
      );
      var matchingData = this.qrOperationModels.filter(
        (p) =>
          p.barcode == product.barcode &&
          p.batchCode == product.batchCode &&
          p.shelfNo == product.shelfNo
      );
      const totalQuantity = 0;

      if (qrOperationModel) {
        if (matchingData) {
          const totalQuantity = matchingData.reduce(
            (acc, curr) => acc + curr.qty,
            0
          );
          qrOperationModel.qty = totalQuantity;
        }
        // qrOperationModel nesnesini model'e kopyala
        model = Object.assign({}, qrOperationModel);

        if (qrOperationModel.isReturn) {
          model.isReturn = false;
        } else {
          model.isReturn = true;
        }
        const qrOperationResponse = await this.productService.qrOperation(model);
        if (qrOperationResponse) {
          // // console.log(this.qrOperationModels);
          this.generalService.beep3();
          this.alertifyService.success('Qr Operasyonu Geri Alındı');
        } else {
          this.alertifyService.error('Qr Operasyonu Geri Alınamadı');
        }
      } else {
        this.alertifyService.error('Qr Operasyonu Geri Alınamadı');
      }

      return response;
    } else {
      return false;
    }

  }

  updateItemStock() {
    location.reload();
  }
}
