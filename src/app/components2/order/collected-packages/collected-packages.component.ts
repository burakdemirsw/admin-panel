import { Component, OnInit } from '@angular/core';
import { CollectedProductsPackage } from 'src/app/models-2/Count/collectedProductsPackage';
import { RetailOrderService } from 'src/app/services/admin/retail/retail-order.service';
import { HeaderService } from '../../../services/admin/header.service';

@Component({
  selector: 'app-collected-packages',
  templateUrl: './collected-packages.component.html',
  styleUrls: ['./collected-packages.component.css']
})
export class CollectedPackagesComponent implements OnInit {

  constructor(private orderService: RetailOrderService
    , private HeaderService: HeaderService
  ) { }

  currentPage = 1;
  ngOnInit(): void {
    this.HeaderService.updatePageTitle('Toplanan Paketler');
    this.getCollectedProducts();

  }

  packageList: CollectedProductsPackage[] = [];
  async getCollectedProducts() {

    this.packageList = await this.orderService.getGetCollectedProductsPackages();

  }

  async deleteCollectedProductsOfRetailOrderList(id: string) {
    await this.orderService.deleteCollectedProductsOfRetailOrderList(id);
    this.getCollectedProducts();
  }
}
