import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from 'src/app/services/admin/general.service';
import { ProductService } from 'src/app/services/admin/product.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';
import { CreateBarcodeModel } from './models/createBarcode';

@Component({
  selector: 'app-create-barcode',
  templateUrl: './create-barcode.component.html',
  styleUrls: ['./create-barcode.component.css']
})
export class CreateBarcodeComponent implements OnInit {

  countedProducts: CreateBarcodeModel[] = [];
  checkForm: FormGroup;
  shelfNumbers: string;
  activeTab: number = 1;
  operationNo: string;
  constructor(
    private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private toasterService: ToasterService,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router

  ) { }

  boxId: string;
  async ngOnInit() {
    //sşldfks
    this.activatedRoute.params.subscribe(async params => {

      if (params['operationNo']) {
        this.operationNo = params['operationNo']
        this.countedProducts = await this.productService.getBarcodeModels(this.operationNo)
      } else {
        this.operationNo = await this.generalService.generateGUID();
      }
    });


    this.formGenerator();

  }
  // KAMERA KODU--------------------------------------------

  //--------------------------------------------
  formGenerator() {
    this.checkForm = this.formBuilder.group({
      barcode: [null, Validators.required],
      batchCode: [null, Validators.required],
      quantity: [null, Validators.required],

    });
  }

  async onSubmit(formValue: any) {

    if (!this.checkForm.valid) {
      if (
        formValue.barcode.includes('http') ||
        this.generalService.isGuid(formValue.barcode)
      ) {
        var number = await this.setFormValues(formValue.barcode); //burası uzun
        // this.onSubmit(this.checkForm.value);
        return;
      }

      if (formValue.barcode) {
        var number = await this.setFormValues(formValue.barcode);


        // this.onSubmit(this.checkForm.value);
      } else {
        this.toasterService.warn('Barkod Alanı Boş.');
      }

      return;
    } else if (this.checkForm.valid) {

      var request: CreateBarcodeModel = new CreateBarcodeModel();
      request.barcode = formValue.barcode;
      request.batchCode = formValue.batchCode;
      request.quantity = formValue.quantity;
      request.operationNo = this.operationNo;
      request.id = await this.generalService.generateGUID();
      request.createdDate = new Date();
      var repsonse = await this.productService.addBarcodeModel(request);
      if (repsonse) {
        this.countedProducts = await this.productService.getBarcodeModels(this.operationNo)
      }
      this.toasterService.success('Form Başarılı.');
      this.clearShelfNumbers();
    }

  }

  async setFormValues(barcode: string): Promise<string> {
    this.shelfNumbers = 'RAFLAR:';
    try {
      if (barcode.includes('http') || this.generalService.isGuid(barcode)) {
        var result: string[] = await this.productService.countProductByBarcode3(
          barcode
        );
        this.shelfNumbers += result[0];
        this.checkForm.get('batchCode').setValue(result[2]);
        this.checkForm.get('barcode').setValue(result[3]);

        return result[1];
      } else {
        var result: string[] = await this.productService.getShelvesOfProduct(
          barcode
        );
        this.shelfNumbers += result[0];
        this.checkForm.get('quantity').setValue(result[1]);

        this.checkForm.get('batchCode').setValue(result[2]);
        this.checkForm.get('barcode').setValue(result[3]);
        return null;
      }
    } catch (error) {
      this.toasterService.error(error.message);
      return null;
    }
  }

  clearShelfNumbers() {
    this.checkForm.reset();
    this.focusNextInput('barcode');

  }
  focusNextInput(nextInputId: string) {
    const nextInput = document.getElementById(nextInputId) as HTMLInputElement;
    if (nextInput) {
      nextInput.focus();
    }
  }

  async completeOperation() {
    var response = await this.productService.sendBarcodeModelsToNebim(this.operationNo);
    if (response) {
      this.toasterService.success('İşlem Tamamlandı.');
      this.router.navigate(['dashboard'])
    }

  }

  async deleteProduct(value: CreateBarcodeModel) {
    var response = await this.productService.deleteBarcodeModel(value.id);
    if (response) {
      this.countedProducts = await this.productService.getBarcodeModels(this.operationNo)
      this.toasterService.success('Ürün Silindi.');
    }
  }
}
