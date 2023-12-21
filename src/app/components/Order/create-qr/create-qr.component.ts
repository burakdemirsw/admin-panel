import { DatePipe } from '@angular/common';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import html2canvas from 'html2canvas';
import { NgxSpinnerService } from 'ngx-spinner';
import { ClientUrls } from 'src/app/models/const/ClientUrls';
import {
  BarcodeModelResponse,
  BarcodeModel_A,
} from 'src/app/models/model/barcode/barcodeModel_A';
import { PrinterInvoiceRequestModel } from 'src/app/models/model/order/printerInvoiceRequestModel';
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
    private datePipe: DatePipe,
    private warehouseService : WarehouseService
  ) {}
  @ViewChild('qrCode') qrCode: ElementRef;
  @ViewChild('captureElement') captureElement: ElementRef;

  ngOnInit(): void {
    this.formGenerator();
    this.focusNextInput('barcode');
  }
  async capture() {  
    const element = this.captureElement.nativeElement;
  
      html2canvas(element).then(async (canvas) => {
        // Canvas'i bir görüntüye dönüştürün ve indirme bağlantısını oluşturun.
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        // link.download = 'captured-image.png';
        // link.click();
        var code = imgData.split('base64,')[1];
        if(code){
          const confirmDelete = window.confirm("Qr Kod Sisteme Kaydedilecektir. Emin misiniz?");
          if (confirmDelete) {
            var m = this.checkForm.value;
            var qr: QrCode = new QrCode();
            qr.id =0;
            qr.uniqueId = this.newId;
            qr.createdDate =new Date();
            qr.barcodeBase64 = code;
            qr.barcode = m.barcode
            qr.description =  this.products[0].description;
            qr.warehouseCode = this.products[0].warehouseCode;
            qr.photoUrl = ClientUrls.baseUrl2+ qr.uniqueId 
            qr.shelfNo = this.products[0].shelfNo;
            qr.itemCode = this.products[0].itemCode;
            qr.batchCode = this.products[0].batchCode;
            qr.price = this.products[0].price;
            qr.quantity = m.quantity;
            qr.brandDescription = this.products[0].brandDescription
            // this.capture();
            // Show confirmation alert
         
           
              var response = await this.productService.addQr(qr);
              if (response) {
                this.alertifyService.success("Kayıt Edildi");
        
                this.generalService.beep();
              } else {
                this.alertifyService.error("Kayıt Edilmedi");
              }
            
    
    
              const confirmDelete2 = window.confirm("Yazıcıdan Yazdırılacaktır. Emin misiniz?");
              if (confirmDelete2) {
                var requestModel = {imageCode: code,printCount : this.checkForm.get('printCount').value};
                var response = await this.httpClientService.post<any>({controller:'Order/Qr'},requestModel).toPromise();
                // Base64 veriyi konsola bas
                if(response){
                  this.alertifyService.success("Yazdırıldı")
                }
                console.log(imgData.split('base64,')[1]);
    
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
  brand : string =null;
  address : string = null;
  date : string  =null;
  getCurrentDateTime() {
    const currentDate = new Date();
    const formattedDate = this.datePipe.transform(currentDate, 'yyyy-dd-MM HH.mm');
    this.date = formattedDate
  }
   newId :string;

  async onSubmit(m: any) {
    if (m.barcode) {
      var model: BarcodeSearch_RM = new BarcodeSearch_RM();
      model.barcode = m.barcode;
      this.products = await this.productService.searchProduct(model);
      if (this.products) {
  
        this.address = m.address;
        this.getCurrentDateTime();
        var response = this.setFormValues(this.products[0]);
        this.brand = this.products[0].brandDescription;
        if (true) {
          var p = this.products[0];
          var guid = await this.generalService.generateGUID();
          this.currentQr = guid;
          m.id = this.currentQr;

          const formData = this.checkForm.value; 
          const formDataJSON = JSON.stringify(formData); 
          var response2 = await this.warehouseService.countProductRequest(
            formData.barcode,
            "",
          0,
            "",
            "",
            "",
            'Order/CountProductControl',
            "",
            ""  
          );
          if (response != undefined) {
            var data2: ProductCountModel = response2;
  
            formData.barcode = response2.description;
          }
          if(this.checkForm.valid){
            this.newId = await this.generalService.generateGUID()
            var json = ClientUrls.baseUrl2+this.newId;
            // var json  =  formData.itemCode +"-"+"010"+formData.barcode+"-"+"17-"+
            // formData.batchCode+"-Adet:"+ this.checkForm.get('quantity').value
            this.qrCodeValue =json;
            console.log(this.checkForm.value)

          }else{
            this.generalService.whichRowIsInvalid(this.checkForm)
            console.log(this.checkForm.value)
          }

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
        // shelfNo: model.shelfNo,
        batchCode: model.batchCode,
        itemDesc: model.description,
        brand: model.brandDescription 
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
      shelfNo: [null], 
      batchCode: [null], 

      boxArea: [null],
      quantity: [null, Validators.required], 
      printCount: [1, Validators.required],
      brand: [null, Validators.required],

      itemDesc: [null, Validators.required],
      dateArea: [new Date(), Validators.required], 
    });
  }

  async saveQr(m: any) {
   this.capture();
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
