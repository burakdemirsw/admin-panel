import { Component, Input, OnInit, ViewChild, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { ToasterService } from 'src/app/services/ui/toaster.service';

@Component({
  selector: 'app-read-barcode',
  templateUrl: './read-barcode.component.html',
  styleUrls: ['./read-barcode.component.css']
})
export class ReadBarcodeComponent implements OnInit {
  @ViewChild('scanner') scanner: ZXingScannerComponent;
  constructor(private toasterService: ToasterService) { }
  enableScanner: boolean = false;
  autofocus: boolean = true;
  @Output() value = new EventEmitter<any>();

  ngOnInit(): void {



  }
  allowedFormats = [
    BarcodeFormat.CODE_39,
    BarcodeFormat.CODE_93,
    BarcodeFormat.CODE_128,
    BarcodeFormat.EAN_8,
    BarcodeFormat.EAN_13,
    BarcodeFormat.QR_CODE,
    BarcodeFormat.DATA_MATRIX
  ];
  availableCameras: MediaDeviceInfo[] = [];
  selectedDevice: MediaDeviceInfo | undefined;
  enableScannerMethod() {
    this.enableScanner = !this.enableScanner;
  }
  camerasFoundHandler(cameras: MediaDeviceInfo[]) {
    this.availableCameras = cameras;
    if (cameras.length > 0) {
      this.selectedDevice = cameras[0]; // Varsayılan olarak ilk kamerayı seç
    }
  }

  onCameraSelected(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const deviceId = selectElement.value;
    this.selectedDevice = this.availableCameras.find(c => c.deviceId === deviceId);
  }
  scanSuccessHandler(event: any) {
    this.value.emit(event)
    this.enableScanner = !this.enableScanner;
  }


}
