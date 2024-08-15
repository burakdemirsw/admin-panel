import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { GeneralService } from 'src/app/services/admin/general.service';
import { HeaderService } from 'src/app/services/admin/header.service';
import { ProductService, StockDetail } from 'src/app/services/admin/product.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';

@Component({
  selector: 'app-product-stock-report',

  templateUrl: './product-stock-report.component.html',
  styleUrl: './product-stock-report.component.css'
})
export class ProductStockReportComponent implements OnInit {
  stockDetails: StockDetail[] = [];
  text: string = ""
  constructor(

    private toasterService: ToasterService,
    private productService: ProductService,
    private formBuilder: FormBuilder, private sanitizer: DomSanitizer,
    private headerService: HeaderService,
    private generalService: GeneralService
  ) { }
  ngOnInit(): void {
    this.headerService.updatePageTitle("Ürün Stok Detay")
  }

  async search() {
    this.stockDetails = await this.productService.getProductStockDetail(this.text);
    if (this.stockDetails.length <= 0) {
      this.toasterService.error("Hareket Bulunamadı")
    }
  }

  sumIncoms() {
    return this.stockDetails.reduce((sum, stock) => sum + stock.incomingQuantity, 0)
  }
  sumIOutGoing() {
    return this.stockDetails.reduce((sum, stock) => sum + stock.outgoingQuantity, 0)
  }
}
