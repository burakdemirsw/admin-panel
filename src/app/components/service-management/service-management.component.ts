import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { GeneralService } from 'src/app/services/admin/general.service';
import { HeaderService } from 'src/app/services/admin/header.service';
import { OrderService } from 'src/app/services/admin/order.service';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';

@Component({
  selector: 'app-service-management',
  templateUrl: './service-management.component.html',
  styleUrl: './service-management.component.css'
})
export class ServiceManagementComponent implements OnInit {

  constructor(
    private headerService: HeaderService,
    private httpClientService: HttpClientService,
    private toasterService: ToasterService,
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private warehouseService: WarehouseService,
    private generalService: GeneralService,
    private formBuilder: FormBuilder,

  ) { }
  ngOnInit(): void {
    this.headerService.updatePageTitle("Servisler")
  }

  services: any[] = [
    { header: 'Sayım Ekle', desc: 'Sayım Ekleme Operasyonunu yapar', action: this.addCount.bind(this) },
    { header: 'Sayım Çıkar', desc: 'Sayım Çıkarma Operasyonunu yapar', action: this.removeCount.bind(this) },
    { header: 'Sayım Eşitle', desc: 'Sayım Çıkarma Operasyonunu yapar', action: this.removeCount.bind(this) },
    { header: 'Sayım Ekle-Çıkar-Eşitle', desc: 'Tüm Sayım Operasyonunu yapar', action: this.doAllCount.bind(this) }

  ];

  async addCount() {
    var response = await this.warehouseService.doCount(1);
    if (response) {
      this.toasterService.success('Sayım ekleme işlemi gerçekleştirildi.');

    } else {
      this.toasterService.error("İşlem Başarısız")
    }
  }

  async removeCount() {
    var response = await this.warehouseService.doCount(2);
    if (response) {
      this.toasterService.success('Sayım çıkarma işlemi gerçekleştirildi.');

    } else {
      this.toasterService.error("İşlem Başarısız")
    }
  }
  async equalizeCount() {
    var response = await this.warehouseService.doCount(3);
    if (response) {
      this.toasterService.success('Sayım eşitleme işlemi gerçekleştirildi.');

    } else {
      this.toasterService.error("İşlem Başarısız")
    }
  }

  async doAllCount() {
    await this.addCount();
    await this.removeCount();
    await this.equalizeCount();
  }

  executeAction(action: () => void) {
    if (typeof action === 'function') {
      action();
    }
  }

}
