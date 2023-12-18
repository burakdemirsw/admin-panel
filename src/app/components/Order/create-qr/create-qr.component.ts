import { DatePipe } from '@angular/common';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import html2canvas from 'html2canvas';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  BarcodeModelResponse,
  BarcodeModel_A,
} from 'src/app/models/model/barcode/barcodeModel_A';
import { PrinterInvoiceRequestModel } from 'src/app/models/model/order/printerInvoiceRequestModel';
import { ProductList_VM } from 'src/app/models/model/product/productList_VM';
import { QrCode } from 'src/app/models/model/product/qrCode';
import { GeneralService } from 'src/app/services/admin/general.service';
import {
  BarcodeSearch_RM,
  ProductService,
} from 'src/app/services/admin/product.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';

@Component({
  selector: 'app-create-qr',
  templateUrl: './create-qr.component.html',
  styleUrls: ['./create-qr.component.css'],
})
export class CreateQrComponent implements OnInit {
  checkForm: FormGroup;
  shelfNumbers: string;
  activeTab: number = 1;
  qrCodeValue: string = '';
  constructor(
    private formBuilder: FormBuilder,
    private alertifyService: AlertifyService,
    private spinnerService: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private generalService: GeneralService,
    private productService: ProductService,
    private httpClientService: HttpClientService,
    private datePipe: DatePipe
  ) {}
  @ViewChild('qrCode') qrCode: ElementRef;
  @ViewChild('captureElement') captureElement: ElementRef;

  ngOnInit(): void {
    this.formGenerator();
  }
  async capture() {
    const element = this.captureElement.nativeElement;

    html2canvas(element).then(async (canvas) => {
      // Canvas'i bir görüntüye dönüştürün ve indirme bağlantısını oluşturun.
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'captured-image.png';
      link.click();
      var code = imgData.split('base64,')[1];
      var requestModel = {imageCode: code};
      var response = await this.httpClientService.post<any>({controller:'Order/Qr'},requestModel).toPromise();
      // Base64 veriyi konsola bas
      console.log(imgData.split('base64,')[1]);
    });
}

  // printQRCode() {
  //   if (this.qrCodeDownloadLink) {
  //     window.open(this.qrCodeDownloadLink.changingThisBreaksApplicationSecurity, '_blank');
  //   }
  // }
  qrCodeDownloadLink: any = this.sanitizer.bypassSecurityTrustResourceUrl('');
  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
  }

  currentQr: string;
  // qrItemCode: string = '';
  // qrShelfNo: string = '';
  // qrQuantity: number = 0;
  // qrBatchCode: string = '';
  products: ProductList_VM[] = [];
  brand : string =null;
  address : string = null;
  date : string  =null;
  getCurrentDateTime() {
    const currentDate = new Date();
    const formattedDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd HH.mm');
    this.date = formattedDate
  }
   

  async onSubmit(m: any) {
    if (m.barcode) {
      var model: BarcodeSearch_RM = new BarcodeSearch_RM();
      model.barcode = m.barcode;
      this.products = await this.productService.searchProduct(model);
      if (this.products) {
        this.brand = m.brand;
        this.address = m.address;
        this.getCurrentDateTime();
        var response = this.setFormValues(this.products[0]);
        if (true) {
          var p = this.products[0];
          var guid = await this.generalService.generateGUID();
          this.currentQr = guid;
          m.id = this.currentQr;

          const formData = this.checkForm.value; 
          const formDataJSON = JSON.stringify(formData); 
          this.qrCodeValue = formDataJSON;

          // this.qrItemCode =
          //   'Barkod: ' + p.barcode + ' - ' + 'RafNo: \n' + p.shelfNo;
          // this.qrShelfNo =
          //   'Barkod: ' + p.barcode + ' - ' + 'RafNo: \n' + p.shelfNo;
          // this.qrShelfNo =
          //   'Barkod: ' + p.barcode + ' - ' + 'RafNo: \n' + p.shelfNo;

          // this.qrBatchCode =
          //   'Miktar: ' + p.quantity + '-' + 'Parti: ' + p.batchCode;
        }else{
          this.generalService.whichRowIsInvalid(this.checkForm);
        }
      }
      // this.getBarcodePage(model);
    } else {
      this.generalService.whichRowIsInvalid(this.checkForm);
    }
  }
  setFormValues(model: ProductList_VM) {
    try {
      this.checkForm.patchValue({
        itemCode: model.itemCode,
        shelfNo: model.shelfNo,
        batchCode: model.batchCode,
        itemDesc: model.description,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  formGenerator() {
    this.checkForm = this.formBuilder.group({
      barcode: [null, Validators.required], 
      itemCode: [null, Validators.required], 
      shelfNo: [null, Validators.required], 
      batchCode: [null, Validators.required], 

      boxArea: [null, Validators.required],
      qtyArea: [null, Validators.required], 
      address: [null, Validators.required],
      brand: [null, Validators.required],

      itemDesc: [null, Validators.required],
      dateArea: [new Date(), Validators.required], 
    });
  }

  async saveQr(m: any) {
    var qr: QrCode = m;
    qr.id = this.currentQr;
    qr.createDate = null;
    this.capture();
    // Show confirmation alert
    // this.printPicture("selamm");
    // if (!window.confirm("Qr Sisteme Eklencektir , Devam Edilsin Mi?")) {
    //   var response = await this.productService.addQr(qr);
    //   if (response) {
    //     this.alertifyService.success("Kayıt Edildi");
    //     this.printPicture("selamm");
    //     this.generalService.beep();
    //   } else {
    //     this.alertifyService.error("Kayıt Edilmedi");
    //   }
    // }
  }
  // printPicture(url:string){
  //   var  model : PrinterInvoiceRequestModel = new PrinterInvoiceRequestModel();
  //   model.printerName = "SEWOO LK-P4XX Label"
  //   model.url= url;
  //    try {
  //      this.httpClientService
  //        .post<PrinterInvoiceRequestModel>({
  //          controller: 'Order/TryPrintPicture',
  //        },model)
  //        .subscribe((data) => {
  //          console.log(data);
  //          // this.saleOrderModels = data;
  //        });
  //    } catch (error: any) {
  //      console.log(error.message);
  //    }
  //    }

  async getBarcodePage(model: BarcodeModel_A) {
    var htmlPageCode: BarcodeModelResponse =
      await this.productService.getBarcodePage(model);

    var newTab = window.open('', '_blank');
    if (newTab) {
      newTab.document.open();
      newTab.document.write(htmlPageCode.page);
      newTab.document.close();

      // Sayfanın tamamen yüklenmesini bekleyin (isteğe bağlı)
      newTab.addEventListener('load', function () {
        // Yazdırma işlemi
        newTab.print();
      });
    }
  }

  clearShelfNumbers() {
    this.checkForm.get('shelfNo').setValue(null);
    this.checkForm.get('barcode').setValue(null);
    this.focusNextInput('shelfNo');
    this.shelfNumbers = 'RAFLAR:';
    this.checkForm.get('quantity').setValue(null);
  }
  focusNextInput(nextInputId: string) {
    const nextInput = document.getElementById(nextInputId) as HTMLInputElement;
    if (nextInput) {
      nextInput.focus();
    }
  }
}
