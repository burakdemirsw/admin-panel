import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import * as JsBarcode from 'jsbarcode';
import { CustomerAddress_VM, CustomerList_VM } from 'src/app/models/model/order/getCustomerList_CM';

@Component({
  selector: 'app-create-aras-cargo-barcode',
  templateUrl: './create-aras-cargo-barcode.component.html',
  styleUrls: ['./create-aras-cargo-barcode.component.css']
})
export class CreateArasCargoBarcodeComponent implements OnInit {
  @Input() receiverName: string;
  @Input() referenceId: number;
  @Input() address: CustomerAddress_VM;
  @Input() customer: CustomerList_VM;
  @ViewChild('captureElement') captureElement: ElementRef;
  @Output() dataEvent = new EventEmitter<string>();
  constructor() { }
  date: Date = new Date();
  ngOnInit(): void {
  }


  ngAfterViewInit(): void {
    this.generateBarcodes();
  }

  generateBarcodes() {
    // Entegrasyon No Barkodu
    JsBarcode("#integrationBarcode", this.referenceId.toString(), {
      format: "CODE128",
      lineColor: "#000",
      width: 2,
      height: 30,
      displayValue: false
    });

    // Paket Barkod No
    JsBarcode("#packageBarcode", this.referenceId + '01', {
      format: "CODE128",
      lineColor: "#000",
      width: 2,
      height: 30,
      displayValue: false
    });
  }

  saveImg() {
    const element = this.captureElement.nativeElement;

    html2canvas(element).then(async (canvas) => {
      // Canvas'i bir görüntüye dönüştürün ve indirme bağlantısını oluşturun.
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      // link.download = 'captured-image.png';
      // link.click();
      var base64 = imgData.split('base64,')[1];
      this.dataEvent.emit(base64)
    });
  }
}
