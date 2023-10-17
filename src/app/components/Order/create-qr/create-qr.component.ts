import { Component, ElementRef, ViewChild,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
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
    private sanitizer: DomSanitizer

  ) { }
  @ViewChild('qrCode') qrCode: ElementRef;

  ngOnInit(): void {
    this.formGenerator();
    
  }
  
  printQRCode() {
    if (this.qrCodeDownloadLink) {
      window.open(this.qrCodeDownloadLink.changingThisBreaksApplicationSecurity, '_blank');
    }
  }
  qrCodeDownloadLink: any = this.sanitizer.bypassSecurityTrustResourceUrl('');
  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
  }

  onSubmit(values:any){
    const formData = this.checkForm.value; // Form verilerini al
    const formDataJSON = JSON.stringify(formData); // Form verilerini JSON'a dönüştür
    this.qrCodeValue = formDataJSON;
  }
  

 
  formGenerator() {
    this.checkForm = this.formBuilder.group({
      barcode: [null, Validators.required],
      shelfNo: [null, Validators.required],
      quantity: [null],
      batchCode: [null],
    });
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
