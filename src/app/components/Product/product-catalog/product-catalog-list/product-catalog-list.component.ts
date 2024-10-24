import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogHeader } from 'src/app/models/model/warehouse/transferRequestListModel';
import { CatalogService } from 'src/app/services/admin/catalog.service';
import { GeneralService } from 'src/app/services/admin/general.service';
import { HeaderService } from 'src/app/services/admin/header.service';
import { ProductService } from 'src/app/services/admin/product.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';

@Component({
  selector: 'app-product-catalog-list',

  templateUrl: './product-catalog-list.component.html',
  styleUrl: './product-catalog-list.component.css'
})
export class ProductCatalogListComponent implements OnInit {

  constructor(
    private toasterService: ToasterService,

    private productService: ProductService,
    private formBuilder: FormBuilder, private sanitizer: DomSanitizer,
    private httpClientService: HttpClientService,
    private activatedRoute: ActivatedRoute,
    private headerService: HeaderService,
    private generalService: GeneralService,
    private catalogService: CatalogService,
    private router: Router
  ) { }
  raports: CatalogHeader[] = [];
  async ngOnInit() {
    this.raports = await this.catalogService.getAllCatalogHeaders();
  }
  // Yönlendirme fonksiyonu
  navigateToProductCatalog(id: string): void {
    this.router.navigate([`/product-catalog/${id}`]);
  }
  async _navigateToProductCatalog() {
    var id = await this.generalService.generateGUID();
    this.navigateToProductCatalog(id);
  }
}
