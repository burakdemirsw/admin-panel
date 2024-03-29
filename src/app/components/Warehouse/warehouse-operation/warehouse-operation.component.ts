import { OnInit, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BarcodeModel } from 'src/app/models/model/product/barcodeModel';
import { WarehouseModel } from 'src/app/models/model/warehouse/warehouseModel';
import { WarehouseOfficeModel } from 'src/app/models/model/warehouse/warehouseOfficeModel';
import { OfficeModel } from 'src/app/models/model/warehouse/officeModel';
import { HttpClientService } from 'src/app/services/http-client.service';
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
import { ToasterService } from 'src/app/services/ui/toaster.service';
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
    private toasterService: ToasterService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private generalService: GeneralService,
    private productService: ProductService,
    private warehouseService: WarehouseService,
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
  pageStatus = '';
  async ngOnInit() {
    if (location.href.includes('REQ-')) {
      var ls_currentDataType = localStorage.getItem('currentDataType')
      if (ls_currentDataType != undefined && !ls_currentDataType) {
        this.currentDataType = ls_currentDataType.toString() == '-1' ? '0' : ls_currentDataType.toString();
        // this.toasterService.success(localStorage.getItem('currentDataType'))
      } else {
        this.currentDataType = '0'


      }
      if (this.currentDataType === '1') {
        this.pageStatus = 'İstek - Standart'
      } else {
        this.pageStatus = 'İstek - Raf Fulle'
      }
    } else {
      this.pageStatus = 'Transfer'
      this.currentDataType = '-1'


    }



    this.formGenerator();
    this.warehouseForm.valueChanges.subscribe(() => {
      var office = this.warehouseForm.get('office').value
      var officeTo = this.warehouseForm.get('officeTo').value
      if ((office === officeTo) && (office !== null)) {
        // this.toasterService.error("Ofisler Farklı Olmalıdır")
        this.warehouseForm.get('office').setValue(null)
        this.warehouseForm.get('officeTo').setValue(null)
      }
    });

    //this.spinnerService.show();
    this.activatedRoute.params.subscribe(async (params) => {
      this.currentOrderNo = 'TP-' + params['number'];

      if (!this.currentOrderNo.includes('REQ-')) {
        await this.getProductOfCount(this.currentOrderNo);
      } else if (this.currentOrderNo.includes('REQ-')) {
        await this.getProductOfCount(this.currentOrderNo);


      }

      this.warehouseForm.get('orderNo').setValue(this.currentOrderNo);
      //this.toasterService.success(this.warehouseForm.get('orderNo').value)
      //this.spinnerService.hide();
    });


    //  await this.getOfficeCodeList();
  }

  inventoryItemColums: string[] = [
    'Fotoğraf',
    'Raf',
    'Ürün Kodu',
    'Transfer Miktarı',
    'UD Stok',
    // 'MD Stok',
    // 'UD Stok',
    'Ürün',
    'Barkod',
  ];
  _inventoryItemColums: string[] = [
    'Fotoğraf',
    'Raf',
    'Ürün Kodu',
    'Transfer Miktarı',
    'UD Stok',
    'Barkod',
    'İşlem',
  ];
  _inventoryItems: InventoryItem[] = [];
  inventoryItems: InventoryItem[] = [];//transfer Edilecek ürünler
  warehouseTransferForms: TransferModel[] = []; //eklenen ürünler
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
  deletedProductList: InventoryItem[] = [];
  async addDeletedItemList(item: InventoryItem) {
    this.deletedProductList.push(item);
    await this.getProductOfCount(this.currentOrderNo);
    this.toasterService.info("Ürün Transfer Edilecek Ürünlerden Silindi")
  }
  currentDataType;
  async onDataChange(currentDataType: string) {

    if (location.href.includes('REQ')) {
      var ls_currentDataType = localStorage.getItem('currentDataType')
      if (ls_currentDataType != undefined && ls_currentDataType) {
        localStorage.removeItem('currentDataType');
        localStorage.setItem('currentDataType', this.currentDataType)
      } else {
        localStorage.setItem('currentDataType', this.currentDataType)
      }
      this.currentDataType = currentDataType;
      if (currentDataType === '0') {
        this.toasterService.success("Varsayılan Ürünler Getirildi")

        this.pageStatus = 'İstek - Standart'
      } else if (currentDataType === '1') {
        this.pageStatus = 'İstek -Raf Fulle'
        this.toasterService.success("Raflar Fullendi")

      }

      this.inventoryItems = [];
      this.inventoryItems = await this.orderService.getInventoryItems(currentDataType); //transfer edilcek ürünler

    }

    if (currentDataType === '0') {
      this.toasterService.success("Varsayılan Ürünler Getirildi")

      // this.pageStatus = 'Standart'
    } else if (currentDataType === '1') {
      // this.pageStatus = 'Raf Fulle'
      this.toasterService.success("Raflar Fullendi")

    }



    if (this.deletedProductList.length > 0) {
      this.deletedProductList.forEach((deletedItem) => {

        this.inventoryItems.forEach((inventoryItem, _index) => {


          if (inventoryItem.barcode === deletedItem.barcode &&
            inventoryItem.shelfNo === deletedItem.shelfNo &&
            inventoryItem.itemCode === deletedItem.itemCode) {
            this.inventoryItems.splice(_index, 1);
          }


        });

      });
    }

  }
  pasteItemToForm(item: InventoryItem) {
    this.warehouseForm.get('shelfNo').setValue(item.shelfNo);
    this.warehouseForm.get('quantity').setValue(item.quantity);
    this.warehouseForm.get('barcode').setValue(item.barcode);

  }

  // inventoryItems: InventoryItem[] = [];//transfer Edilecek ürünler
  // warehouseTransferForms: TransferModel[] = []; //transfer edilen ürünler
  updateInventoryAndTransfers() {

    //eğer silinmiş ürün listesinde ürün varsa onları kaldır
    // İşlem sonrası çıkarılacak öğelerin indekslerini tutacak dizi
    let itemsToRemoveIndexes: number[] = [];


    // inventoryItems üzerinde döngü
    this.inventoryItems.forEach((inventoryItem, index) => {
      // Eşleşme arama ve güncelleme
      this.warehouseTransferForms.forEach((transferItem) => {
        // barcode, shelfNo ve itemCode değerlerine göre eşleşme kontrolü
        if (inventoryItem.barcode === transferItem.barcode &&
          inventoryItem.shelfNo === transferItem.shelfNo &&
          inventoryItem.itemCode === transferItem.itemCode) {

          // Eşleşen üründen quantity değerini çıkart
          inventoryItem.transferQty -= transferItem.quantity;

          // Eğer transfer edilen miktar sonucunda quantity 0 veya daha az ise
          if (inventoryItem.transferQty <= 0) {
            // İlgili inventoryItem'ın çıkarılması için indeksini kaydet
            itemsToRemoveIndexes.push(index);
          }
        }
      });
    });

    // Çıkarılacak öğeler için ters döngü (çıkarırken sıralamayı bozmamak için)
    for (let i = itemsToRemoveIndexes.length - 1; i >= 0; i--) {
      this.inventoryItems.splice(itemsToRemoveIndexes[i], 1);
    }
    itemsToRemoveIndexes = [];
    //--------------------------------------------------------

    // Çıkarılacak öğeler için ters döngü (çıkarırken sıralamayı bozmamak için)

    //--------------------------------------------------------
    console.log(this.inventoryItems);
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


  async getProductOfCount(orderNo: string): Promise<any> { //sayılanları çeker
    this.warehouseTransferForms =
      await this.warehouseService.getProductOfTrasfer(orderNo);
    await this.onDataChange(this.currentDataType);
    this.updateInventoryAndTransfers();
    this.calculateTotalQty();
  }


  // async getInventoryItems(type: string) {
  //   this.inventoryItems = await this.orderService.getInventoryItems(type); //tansfer edilcek ürünler

  //   if (this.inventoryItems.length > 0) {
  //     if (this.lastCollectedProduct == null) {
  //       //üste atılcak ürün seçildi
  //       this._inventoryItems = [];
  //       this._inventoryItems.push(this.inventoryItems[0]);
  //       this.lastCollectedProduct = this.inventoryItems[0];
  //     } else {
  //       //eğer son sayılan ürün varsa
  //       var foundedProduct = this.inventoryItems.find(
  //         (p) =>
  //           p.barcode == this.lastCollectedProduct.barcode &&
  //           p.itemCode == this.lastCollectedProduct.itemCode &&
  //           p.shelfNo == this.lastCollectedProduct.shelfNo
  //       );

  //       if (foundedProduct) {
  //         //eğer ürün bulunduysa

  //         if (foundedProduct.quantity > 0) {
  //           //miktar değeri 0 dan büyükse
  //           this._inventoryItems = [];
  //           this._inventoryItems.push(foundedProduct);
  //           this.lastCollectedProduct = foundedProduct;
  //         } else {
  //           //miktar değeri 0 dan küçükse
  //           this._inventoryItems = [];
  //           this._inventoryItems.push(this.inventoryItems[0]);
  //           this.lastCollectedProduct = this.inventoryItems[0];
  //         }
  //       } else {
  //         //üürn bulunmdadıysa

  //         this._inventoryItems = [];
  //         this._inventoryItems.push(this.inventoryItems[0]);
  //         this.lastCollectedProduct = this.inventoryItems[0];
  //       }
  //     }
  //   }
  // }

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
          this.toasterService.error('Depo Çekilemedi');
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
          this.toasterService.error('Depo Çekilemedi');
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
            this.toasterService.error('İşlem Başarısız');
          }
        } catch (error: any) {
          // console.log(error.message);
        }
      } else {
        this.toasterService.warn('İşlem iptal edildi.');
      }
    } else {
      this.toasterService.warn('Sipariş No Boş Geliyor.');
    }
    //this.spinnerService.hide();
  }

  changePage() {
    setTimeout(() => {
      this.router.navigate(['/warehouse-operation-confirm']);
    }, 2000);
  }

  barcode: string = null;



  async setShelfNo(barcode: string): Promise<string> {
    this.shelfNumbers = 'RAFLAR:';

    if (barcode) {
      var result: string[] = await this.productService.countProductByBarcode(
        barcode
      );
      this.shelfNumbers += result[0];
      return result[1];
    } else {
      this.toasterService.warn('Barkod Alanı Boş.');
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
      this.toasterService.error(error.message);
      return null;
    }
  }
  blockedCount: boolean = false;
  blockedCountReason = "";
  qrBarcodeUrl: string = null;
  qrOperationModels: QrOperationModel[] = [];
  async onSubmit(formValue: any): Promise<any> {

    for (const product of this.warehouseTransferForms) {
      if (product.availableQty < product.quantity) {
        this.blockedCount = true;
        this.blockedCountReason = "Başarısız Ürün | \n Stok Kodu -" + product.itemCode + "\n Barkod- " + product.barcode;

        return; // Bu return ifadesi fonksiyonun geri kalanının çalışmasını durdurur.
      }
    }


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
        this.toasterService.success(
          'Raflar Getirildi Ve Miktar Alanı Dolduruldu.'
        );
      } else {
        this.toasterService.warn('Barkod Alanı Boş.');
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
                this.toasterService.warn('Ekleme Yapılmadı!');
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
          this.toasterService.success(
            'Raflar Getirildi Ve Miktar Alanı Dolduruldu.'
          );
        }
      }
    } else {
      this.toasterService.error('Form Geçersiz');
    }
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
      this.toasterService.success('NEBIME BAŞARIYLA AKTARILDI!');
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
        this.toasterService.success('Silme İşlemi Başarılı.');
      } else {
        this.toasterService.error('Silme İşlemi Başarısız.');
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
          this.toasterService.success('Qr Operasyonu Geri Alındı');
        } else {
          this.toasterService.error('Qr Operasyonu Geri Alınamadı');
        }
      } else {
        this.toasterService.error('Qr Operasyonu Geri Alınamadı');
      }

      return response;
    } else {
      return false;
    }

  }

  updateItemStock() {
    location.reload();
  }


  //--------------------------------------------------------------------
  productShelvesDialog: boolean = false;
  productShelves: string[] = [];
  async getShelves(barcode: string) {
    var newResponse = await this.productService.countProductByBarcode(
      barcode
    );
    const shelves = newResponse[0]
      .split(',')
      .filter((raflar) => raflar.trim() !== '')


    this.productShelves = shelves;
    this.productShelvesDialog = true;
  }
  setShelveToForm(shelve) {
    this.warehouseForm.get('shelfNo').setValue(shelve);
    this.toasterService.success("Raf Yerleştirildi");
    this.productShelvesDialog = false;
  }
  //--------------------------------------------------------------------

}
