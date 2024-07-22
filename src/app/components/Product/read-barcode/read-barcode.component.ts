import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
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
    setTimeout(() => {
      this.scanner.formats = this.allowedFormats;
    }, 100);
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
  currentStream: MediaStream | undefined;

  enableScannerMethod() {
    this.enableScanner = !this.enableScanner;
  }

  camerasFoundHandler(cameras: MediaDeviceInfo[]) {
    console.log('Cameras found:', cameras);
    this.availableCameras = cameras;
    if (cameras.length > 0) {
      this.selectedDevice = cameras[0]; // Default to the first camera
      this.updateCameraStream();
    }
  }

  onCameraSelected(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const deviceId = selectElement.value;
    this.selectedDevice = this.availableCameras.find(c => c.deviceId === deviceId);
    console.log('Selected device:', this.selectedDevice);
    this.updateCameraStream();
  }

  onZoomChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const zoomValue = parseFloat(inputElement.value);
    this.applyZoom(zoomValue);
  }

  applyZoom(zoomValue: number) {
    if (this.currentStream) {
      const track = this.currentStream.getVideoTracks()[0];
      const capabilities = track.getCapabilities() as any; // Use type assertion to bypass TypeScript error
      if (capabilities.zoom) {
        const constraints: any = {
          advanced: [{ zoom: zoomValue }]
        };
        track.applyConstraints(constraints).catch(e => this.toasterService.error('Error applying zoom constraints'));
      } else {
        // this.toasterService.error('Zoom capability not supported on this device');
      }
    }
  }

  updateCameraStream() {
    if (this.selectedDevice) {
      navigator.mediaDevices.getUserMedia({
        video: { deviceId: this.selectedDevice.deviceId }
      }).then(stream => {
        this.currentStream = stream;
        this.scanner.device = this.selectedDevice; // Set the device for the scanner
      }).catch(e => {
        console.error('Error accessing camera stream', e);
        this.toasterService.error('Kamera erişim hatası: ' + e.message);
      });
    }
  }

  scanSuccessHandler(event: any) {
    console.log('Scan success:', event);
    this.value.emit(event);
    this.enableScanner = !this.enableScanner;
  }
}
