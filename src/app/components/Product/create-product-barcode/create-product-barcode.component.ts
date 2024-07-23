import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from 'src/app/services/admin/general.service';
import { ProductService } from 'src/app/services/admin/product.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';
import { CreateBarcodeFromOrder_RM, CreateBarcodeModel } from '../create-barcode/models/createBarcode';
import { HeaderService } from 'src/app/services/admin/header.service';

@Component({
  selector: 'app-create-product-barcode',
  templateUrl: './create-product-barcode.component.html',
  styleUrls: ['./create-product-barcode.component.css']
})
export class CreateProductBarcodeComponent implements OnInit {
  barcodeInput: string = '';
  barcodeList: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private toasterService: ToasterService,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private headerService: HeaderService
  ) { }

  operationId: string;
  async ngOnInit() {
    this.headerService.updatePageTitle("Ürün Etiketi")
    this.operationId = await this.generalService.generateGUID();
    this.toasterService.info(this.operationId);
  }

  addBarcode() {
    if (this.barcodeInput) {
      this.barcodeList.push(this.barcodeInput);
      this.barcodeInput = '';
    }
    var input = (document.getElementById('barcodeInput') as HTMLInputElement);
    input.focus;
  }

  delete(barcode: any, index: number) {
    // Implement your delete logic here
    // For example, remove the item from the array
    this.barcodeList.splice(index, 1);
    console.log(`Deleted item with barcode: ${barcode}`);
  }

  async onSubmit() {
    if (window.confirm("Ürün Etiketlerini Oluşturmak İstiyor Musunuz")) {

      var request: CreateBarcodeFromOrder_RM = new CreateBarcodeFromOrder_RM(false);
      request.operationNo = this.operationId;
      request.from = "create-product-barcode";

      this.barcodeList.forEach(b => {
        var _barcode: CreateBarcodeModel = new CreateBarcodeModel()
        _barcode.barcode = b;
        _barcode.quantity = 1;
        _barcode.operationNo = this.operationId;
        _barcode.batchCode = "0";
        request.products.push(_barcode);
      });

      var response = await this.productService.sendBarcodesToNebim(request);
      if (response) {
        this.toasterService.success("İşlem Başarılı")
      };

    }
  }
}
