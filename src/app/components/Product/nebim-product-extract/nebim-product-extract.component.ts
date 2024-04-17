import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GetProductExtract, GetProductExtract_RM, GetProductStock, GetProductStock_RM } from 'src/app/models/model/product/getProductStock';
import { ProductService } from 'src/app/services/admin/product.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';

@Component({
  selector: 'app-nebim-product-extract',
  templateUrl: './nebim-product-extract.component.html',
  styleUrls: ['./nebim-product-extract.component.css']
})
export class NebimProductExtractComponent implements OnInit {

  form: FormGroup;
  activeTab = 1;
  products: GetProductExtract[] = [];
  constructor(private formBuilder: FormBuilder, private productService: ProductService, private toasterService: ToasterService) { }

  ngOnInit(): void {
    this.createForm();
  }

  cycleStatuses: any[] = [{ label: "Devir Listelensin", value: true }, { label: "Devir Listelenmesin", value: false }];
  colorStatuses: any[] = [{ label: "Renk Listelensin", value: true }, { label: "Renk Listelenmesin", value: false }];
  dimentionStatuses: any[] = [{ label: "Beden Listelensin", value: true }, { label: "Beden Listelenmesin", value: false }];

  createForm() {

    this.form = this.formBuilder.group({
      startDate: [null],
      endDate: [null],
      cycleStatus: [null],
      colorStatus: [null],
      dimentionStatus: [null],
      warehouseCode: [null],
    });
  }

  async onSubmit(value: any) {
    var request = new GetProductExtract_RM();

    var response = await this.productService.getProductExtract(request);
    if (response) {
      this.products = response;
      this.toasterService.success("Ürün Ekstresi Bulundu");
    } else {
      this.toasterService.error("Ürün Ekstresi Bulunamadı");
    }

  }

  clearBarcode() {
    this.form.reset();
  }
}
