import { Component, ElementRef, ViewChild,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { BarcodeModelResponse, BarcodeModel_A } from 'src/app/models/model/barcode/barcodeModel_A';
import { PrinterInvoiceRequestModel } from 'src/app/models/model/order/printerInvoiceRequestModel';
import { QrCode } from 'src/app/models/model/product/qrCode';
import { GeneralService } from 'src/app/services/admin/general.service';
import { ProductService } from 'src/app/services/admin/product.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';

@Component({
  selector: 'app-create-qr',
  templateUrl: './create-qr.component.html',
  styleUrls: ['./create-qr.component.css']
})
export class CreateQrComponent implements OnInit {
  checkForm: FormGroup;
  shelfNumbers : string;
  activeTab :number =1;
  qrCodeValue:string = ''
  constructor(
    private formBuilder: FormBuilder,
    private alertifyService: AlertifyService,
    private spinnerService: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private generalService :GeneralService,
    private productService : ProductService,
    private httpClientService:  HttpClientService
  ) { }
  @ViewChild('qrCode') qrCode: ElementRef;
   
  ngOnInit(): void {
    this.formGenerator();
    
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
  qrCodeValue2:string =""
  qrCodeValue3:string =""
  async onSubmit(model:BarcodeModel_A){

    if(this.checkForm.valid){

      this.getBarcodePage(model);
    }else{
      this.generalService.whichRowIsInvalid(this.checkForm)
    }
    // var guid = await this.generalService.generateGUID()
    // this.currentQr = guid;
    // values.id =  this.currentQr; 

    // const formData = this.checkForm.value; // Form verilerini al
    // const formDataJSON = JSON.stringify(formData); // Form verilerini JSON'a dönüştür
    // this.qrCodeValue = formDataJSON;
  
    // this.qrCodeValue2 = "Barkod:"+values.barcode+"-"+"RafNo:\n"+values.shelfNo
    // this.qrCodeValue3 = "Miktar:"+values.quantity+"-"+"Parti"+values.batchCode

  }
    
  async saveQr(values: any) {
    var qr: QrCode = values;
    qr.id = this.currentQr;
    qr.createDate = null;    
  
    // Show confirmation alert
    this.printPicture("selamm");
    if (!window.confirm("Qr Sisteme Eklencektir , Devam Edilsin Mi?")) {  
      var response = await this.productService.addQr(qr);
      if (response) {
        this.alertifyService.success("Kayıt Edildi");
        this.printPicture("selamm");
        this.generalService.beep();
      } else {
        this.alertifyService.error("Kayıt Edilmedi");
      }
    }
  
   
  }
  printPicture(url:string){
    var  model : PrinterInvoiceRequestModel = new PrinterInvoiceRequestModel();
    model.printerName = "SEWOO LK-P4XX Label"
    model.url= url;
     try {
       this.httpClientService
         .post<PrinterInvoiceRequestModel>({
           controller: 'Order/TryPrintPicture',  
         },model)
         .subscribe((data) => {
           console.log(data);  
           // this.saleOrderModels = data;
         });
     } catch (error: any) {
       console.log(error.message);
     }
     }
 
     formGenerator() {
      this.checkForm = this.formBuilder.group({
        
        addressArea: ["111", Validators.required], // Use model.boxArea as the initial value
        boxArea: ["111", Validators.required], // ++
        itemArea: ["111", Validators.required],//++
        productBarcodeJSON: ["111", Validators.required],
        qtyArea: [111, Validators.required], //++
        topBarcodeJSON: ["111", Validators.required],
        refArea: ["111", Validators.required], // Use model.dateArea as the initial value
        dateArea: [new Date(), Validators.required], // Use model.dateArea as the initial value
        lotArea: ["111", Validators.required], // Use model.dateArea as the initial value
        itemCode: ["111", Validators.required], // Use model.dateArea as the initial value
        barcode: ["111", Validators.required], // Use model.dateArea as the initial value

      });
    }

     async getBarcodePage(model: BarcodeModel_A ) {
      // this.spinnerService.show();
      // var model: BarcodeModel_A = new BarcodeModel_A();
      // model.addressArea = "burak";
      // model.boxArea = "kadir";
      // model.itemArea = "melih";
      // model.productBarcodeJSON = "burakdemir2001burakkadir";
      // model.qtyArea = "2";
      // model.topBarcodeJSON = "burak kadirden daha iyidir";
      // model.refArea = "burak dünyanın en iyi yazılımcısıdır";
      // model.dateArea = new Date();  
      var htmlPageCode: BarcodeModelResponse = await this.productService.getBarcodePage(model);
      // this.spinnerService.hide();
      // Yeni bir sekme aç
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
