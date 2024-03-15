import { DatePipe } from '@angular/common';
import { Component, ElementRef, ViewChild, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import html2canvas from 'html2canvas';
import { NgxSpinnerService } from 'ngx-spinner';
import { ClientUrls } from 'src/app/models/const/ClientUrls';
import { ProductList_VM } from 'src/app/models/model/product/productList_VM';
import { QrCode } from 'src/app/models/model/product/qrCode';
import { ProductCountModel } from 'src/app/models/model/shelfNameModel';
import { GeneralService } from 'src/app/services/admin/general.service';
import {
  BarcodeSearch_RM,
  ProductService,
} from 'src/app/services/admin/product.service';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';

@Component({
  selector: 'app-create-qr',
  templateUrl: './create-qr.component.html',
  styleUrls: ['./create-qr.component.css'],
})
export class CreateQrComponent implements OnInit, OnChanges {

  @Input() barcode: string = null;
  @Input() quantity: number = null;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["barcode"] && !changes["barcode"].isFirstChange()) {
      console.log("Barkod değişti:", changes["barcode"].currentValue);
      this.checkForm.get('barcode').setValue(changes["barcode"].currentValue)
    }

    if (changes["quantity"] && !changes["quantity"].isFirstChange()) {
      this.checkForm.get('quantity').setValue(changes["quantity"].currentValue)
    }
  }

  checkForm: FormGroup;
  shelfNumbers: string;
  activeTab: number = 1;
  qrCodeValue: string = '';
  constructor(
    private formBuilder: FormBuilder,
    private toasterService: ToasterService,
    private sanitizer: DomSanitizer,
    private generalService: GeneralService,
    private productService: ProductService,
    private httpClientService: HttpClientService,
    private datePipe: DatePipe,
    private warehouseService: WarehouseService,

  ) { }


  @ViewChild('qrCode') qrCode: ElementRef;
  @ViewChild('captureElement') captureElement: ElementRef;
  boxId: string;
  async ngOnInit() {

    this.formGenerator();
    this.focusNextInput('barcode');
    // Subscribe to the valueChanges observable to detect changes
    this.checkForm.valueChanges.subscribe((newValue) => {
      this.qrCodeValue = ''
    });
    await this.startPage();
  }
  async startPage() {
    this.boxId = await this.generalService.generateGUID();

    if (this.boxId) {
      this.checkForm.get('boxId').setValue(this.boxId);
    }
  }
  async newBox() {
    this.checkForm.reset();
    this.formGenerator();
    this.qrCodeValue = '';
    this.boxId = await this.generalService.generateGUID();

    if (this.boxId) {
      this.checkForm.get('boxId').setValue(this.boxId);
    }
  }
  formGenerator() {
    this.checkForm = this.formBuilder.group({
      barcode: [null, Validators.required],
      itemCode: [null, Validators.required],
      shelfNo: [null],
      batchCode: [null],
      boxId: [null],
      boxNo: [null],
      quantity: [null, Validators.required],
      printCount: [1, Validators.required],
      brand: [null, Validators.required],
      countMultiple: [false],
      doubleVerification: [false],
      itemDesc: [null, Validators.required],
      dateArea: [new Date(), Validators.required],
    });
  }
  async captureDirect() {

    const element = this.captureElement.nativeElement;

    html2canvas(element).then(async (canvas) => {
      // Canvas'i bir görüntüye dönüştürün ve indirme bağlantısını oluşturun.
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      // link.download = 'captured-image.png';
      // link.click();
      var code = imgData.split('base64,')[1];
      if (code) {
        var m = this.checkForm.value;
        var qr: QrCode = new QrCode();
        var formValue = this.checkForm.value;
        qr.id = 0;
        qr.uniqueId = this.boxId;
        qr.createdDate = new Date();
        qr.barcodeBase64 = code;
        qr.barcode = m.barcode;
        qr.description = formValue.itemDesc;
        qr.warehouseCode = this.products[0].warehouseCode;
        qr.photoUrl = ClientUrls.baseUrl2 + qr.uniqueId;
        qr.shelfNo = formValue.shelfNo;
        qr.itemCode = formValue.itemCode;
        qr.batchCode = formValue.batchCode;
        qr.price = formValue.price;
        qr.quantity = m.quantity;
        qr.brandDescription = formValue.brand;
        qr.boxNo = formValue.boxNo



        var response = await this.productService.addQr(qr);
        if (response) {
          this.toasterService.success('Kayıt Edildi');
          if (isMultipleCountPage === false) {
            location.reload();
          }
          this.generalService.beep();
        } else {
          this.toasterService.error('Kayıt Edilmedi');
        }

        const confirmDelete2 = window.confirm(
          'Yazıcıdan Yazdırılacaktır. Emin misiniz?'
        );
        if (confirmDelete2) {
          var requestModel = {
            imageCode: code,
            printCount: this.checkForm.get('printCount').value,
          };
          var response = await this.httpClientService
            .post<any>({ controller: 'Order/Qr' }, requestModel)
            .toPromise();
          // Base64 veriyi konsola bas
          if (response) {
            var isMultipleCountPage: Boolean =
              this.checkForm.get('countMultiple').value;
            if (!isMultipleCountPage) {
              location.reload();
            }
            this.toasterService.success('Yazdırıldı');
          }

        }
      }
    });
  }

  async captureVerification() {

    const element = this.captureElement.nativeElement;

    html2canvas(element).then(async (canvas) => {
      // Canvas'i bir görüntüye dönüştürün ve indirme bağlantısını oluşturun.
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      // link.download = 'captured-image.png';
      // link.click();
      var code = imgData.split('base64,')[1];

      if (code) {
        const confirmDelete = window.confirm("Qr Kod Sisteme Kaydedilecektir. Emin misiniz?");
        if (confirmDelete) {
          var m = this.checkForm.value;
          var qr: QrCode = new QrCode();
          var formValue = this.checkForm.value;
          qr.id = 0;
          qr.uniqueId = this.boxId;
          qr.createdDate = new Date();
          qr.barcodeBase64 = code;
          qr.barcode = m.barcode;
          qr.description = formValue.itemDesc;
          qr.warehouseCode = this.products[0].warehouseCode;
          qr.photoUrl = ClientUrls.baseUrl2 + qr.uniqueId;
          qr.shelfNo = formValue.shelfNo;
          qr.itemCode = formValue.itemCode;
          qr.batchCode = formValue.batchCode;
          qr.price = formValue.price;
          qr.quantity = m.quantity;
          qr.brandDescription = formValue.brand;
          qr.boxNo = formValue.boxNo


          var response = await this.productService.addQr(qr);
          if (response) {
            this.toasterService.success('Kayıt Edildi');
            // this.newId = await this.generalService.generateGUID(); // her barkod sisteme kayıt edildikten sonra yeni bir id değeri atandı;

            this.generalService.beep();
          } else {
            this.toasterService.error('Kayıt Edilmedi');
          }

          const confirmDelete2 = window.confirm(
            'Yazıcıdan Yazdırılacaktır. Emin misiniz?'
          );
          if (confirmDelete2) {
            var requestModel = {
              imageCode: code,
              printCount: this.checkForm.get('printCount').value,
            };
            var response = await this.httpClientService
              .post<any>({ controller: 'Order/Qr' }, requestModel)
              .toPromise();
            // Base64 veriyi konsola bas
            if (response) {
              var isMultipleCountPage: Boolean =
                this.checkForm.get('countMultiple').value;
              if (!isMultipleCountPage) {
                location.reload();
              }
              this.toasterService.success('Yazdırıldı');
            }

          }
        }

      }
    });
  }



  qrCodeDownloadLink: any = this.sanitizer.bypassSecurityTrustResourceUrl('');
  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
  }

  currentQr: string;

  products: ProductList_VM[] = [];
  brand: string = null;
  address: string = null;
  date: string = null;
  getCurrentDateTime() {
    const currentDate = new Date();
    const formattedDate = this.datePipe.transform(
      currentDate,
      'yyyy-dd-MM HH.mm'
    );
    this.date = formattedDate;
  }

  async onSubmit(m: any) {

    if (m.barcode) {
      var model: BarcodeSearch_RM = new BarcodeSearch_RM();
      model.barcode = m.barcode;
      if (m.barcode.includes('http')) {
        var result: string[] = await this.productService.countProductByBarcode3(
          m.barcode
        );

        if (result && result[3] != '' && result[3] != undefined) {
          this.checkForm.get('barcode').setValue(result[3]);
          this.onSubmit(this.checkForm.value);
          return;
        }
      }
      this.products = await this.productService.searchProduct(model);

      if (this.products) {
        this.address = m.address;
        this.getCurrentDateTime();
        var response = this.setFormValues(this.products[0], m);
        this.brand = this.products[0].brandDescription;
        if (true) {
          var p = this.products[0];
          var guid = await this.generalService.generateGUID();
          this.currentQr = guid;
          m.id = this.currentQr;

          const formData = this.checkForm.value;

          var response2 = await this.warehouseService.countProductRequest(
            formData.barcode,
            '',
            0,
            '',
            '',
            '',
            'Order/CountProductControl',
            '',
            ''
          );
          if (response != undefined) {
            var data2: ProductCountModel = response2;

            formData.barcode = response2.description;
          }
          if (this.checkForm.valid) {

            var json = ClientUrls.baseUrl2 + this.boxId;

            this.qrCodeValue = json;

          } else {
            this.generalService.whichRowIsInvalid(this.checkForm);

          }
        }
      }
      // this.getBarcodePage(model);
    } else {
      this.generalService.whichRowIsInvalid(this.checkForm);
    }
  }

  setFormValues(model: ProductList_VM, formValue: any) {
    try {
      this.checkForm.patchValue({
        itemCode: model.itemCode,
        // shelfNo: model.shelfNo,
        batchCode: model.batchCode,
        itemDesc: model.description,
        brand: model.brandDescription,
      });
      if (formValue.itemCode) {
        this.checkForm.get('itemCode').setValue(formValue.itemCode)
      }
      if (formValue.batchCode) {
        this.checkForm.get('batchCode').setValue(formValue.batchCode)
      }
      if (formValue.itemDesc) {
        this.checkForm.get('itemDesc').setValue(formValue.itemDesc)
      }


      return true;
    } catch (error) {
      return false;
    }
  }

  async saveQr(m: any) {
    //this.spinnerService.show();
    var result = this.checkForm.get('doubleVerification').value;
    if (result) {
      this.captureVerification();
    } else {
      this.captureDirect();
    }
    //this.spinnerService.hide();
  }

  clearShelfNumbers() {
    var shelfNo = this.checkForm.get('shelfNo').value;
    this.focusNextInput('barcode');
    this.checkForm.reset();
    this.checkForm.get('shelfNo').setValue(shelfNo);
  }
  focusNextInput(nextInputId: string) {
    const nextInput = document.getElementById(nextInputId) as HTMLInputElement;
    if (nextInput) {
      nextInput.focus();
    }
  }
}
