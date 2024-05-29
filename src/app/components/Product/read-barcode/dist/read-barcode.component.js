"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ReadBarcodeComponent = void 0;
var core_1 = require("@angular/core");
var library_1 = require("@zxing/library");
var ReadBarcodeComponent = /** @class */ (function () {
    function ReadBarcodeComponent(toasterService) {
        this.toasterService = toasterService;
        this.enableScanner = false;
        this.autofocus = true;
        this.value = new core_1.EventEmitter();
        this.allowedFormats = [
            library_1.BarcodeFormat.CODE_39,
            library_1.BarcodeFormat.CODE_93,
            library_1.BarcodeFormat.CODE_128,
            library_1.BarcodeFormat.EAN_8,
            library_1.BarcodeFormat.EAN_13,
            library_1.BarcodeFormat.QR_CODE,
            library_1.BarcodeFormat.DATA_MATRIX
        ];
        this.availableCameras = [];
    }
    ReadBarcodeComponent.prototype.ngOnInit = function () {
    };
    ReadBarcodeComponent.prototype.enableScannerMethod = function () {
        this.enableScanner = !this.enableScanner;
    };
    ReadBarcodeComponent.prototype.camerasFoundHandler = function (cameras) {
        this.availableCameras = cameras;
        if (cameras.length > 0) {
            this.selectedDevice = cameras[0]; // Varsayılan olarak ilk kamerayı seç
        }
    };
    ReadBarcodeComponent.prototype.onCameraSelected = function (event) {
        var selectElement = event.target;
        var deviceId = selectElement.value;
        this.selectedDevice = this.availableCameras.find(function (c) { return c.deviceId === deviceId; });
    };
    ReadBarcodeComponent.prototype.scanSuccessHandler = function (event) {
        this.value.emit(event);
        this.enableScanner = !this.enableScanner;
    };
    __decorate([
        core_1.ViewChild('scanner')
    ], ReadBarcodeComponent.prototype, "scanner");
    __decorate([
        core_1.Output()
    ], ReadBarcodeComponent.prototype, "value");
    ReadBarcodeComponent = __decorate([
        core_1.Component({
            selector: 'app-read-barcode',
            templateUrl: './read-barcode.component.html',
            styleUrls: ['./read-barcode.component.css']
        })
    ], ReadBarcodeComponent);
    return ReadBarcodeComponent;
}());
exports.ReadBarcodeComponent = ReadBarcodeComponent;
