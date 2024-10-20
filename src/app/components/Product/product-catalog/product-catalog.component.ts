import { Component, OnInit } from '@angular/core';
import { FastTransfer_VM } from 'src/app/models/model/warehouse/transferRequestListModel';
import { ProductService } from 'src/app/services/admin/product.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';

@Component({
  selector: 'app-product-catalog',
  templateUrl: './product-catalog.component.html',
  styleUrl: './product-catalog.component.css'
})
export class ProductCatalogComponent implements OnInit {
  allProducts: FastTransfer_VM[] = [];
  constructor(private productService: ProductService,
    private toasterService: ToasterService
  ) {

  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }


}
