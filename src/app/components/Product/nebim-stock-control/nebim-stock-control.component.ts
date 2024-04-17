import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GetProductStock, GetProductStock_RM } from 'src/app/models/model/product/getProductStock';
import { ProductService } from 'src/app/services/admin/product.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';

@Component({
  selector: 'app-nebim-stock-control',
  templateUrl: './nebim-stock-control.component.html',
  styleUrls: ['./nebim-stock-control.component.css']
})
export class NebimStockControlComponent implements OnInit {
  form: FormGroup;
  activeTab = 1;
  products: GetProductStock[] = [];
  constructor(private formBuilder: FormBuilder, private productService: ProductService, private toasterService: ToasterService) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {

    this.form = this.formBuilder.group({
      itemCode: [null],
      barcode: [null]
    });
  }

  async onSubmit(value: any) {
    var request = new GetProductStock_RM();
    request = value;

    var response = await this.productService.getProductStock(request);
    if (response) {
      this.products = response;
      this.toasterService.success("Ürün Bulundu");
    } else {
      this.toasterService.error("Ürün Bulunamadı");
    }

  }

  clearBarcode() {
    this.form.reset();
  }
}
