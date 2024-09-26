import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MenuItem } from 'primeng/api';
import { Raport_BestSeller, Raport_ProductExtract, Raport_ProductInventory } from 'src/app/models/model/raport/raport_CR';
import { GeneralService } from 'src/app/services/admin/general.service';
import { HeaderService } from 'src/app/services/admin/header.service';
import { OrderService } from 'src/app/services/admin/order.service';
import { RaportService } from 'src/app/services/admin/raport.service';
import { ExportCsvService } from 'src/app/services/export-csv.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';

@Component({


  templateUrl: './raport.component.html',
  styleUrl: './raport.component.css'
})
export class RaportComponent implements OnInit {


  constructor(private router: Router, private toasterService: ToasterService, private orderService: OrderService,
    private activatedRoute: ActivatedRoute, private generalService: GeneralService, private formBuilder: FormBuilder,
    private spinnerService: NgxSpinnerService,
    private raportService: RaportService,
    private headerService: HeaderService,
    private exportCsvService: ExportCsvService) { }
  raportID = 0;
  tableHeaders: string[] = [
    'Ürün Kodu',
    'İşlem Tarihi',
    'İşlem Kodu',
    'İşlem Açıklaması',
    'İşlem Türü Kodu',
    'İşlem Türü Açıklaması',
    'İade mi?',
    'Referans Numarası',
    'Belge Numarası',
    'Müşteri Hesap Türü Kodu',
    'Müşteri Hesap Türü Açıklaması',
    'Müşteri Hesap Kodu',
    'Müşteri Hesap Açıklaması',
    'Renk Kodu',
    'Renk Açıklaması',
    'Boyut 1 Kodu',
    'Giriş Miktarı',
    'Çıkış Miktarı',
    'Stok Miktarı',
    'Şirket Kodu',
    'Ofis Kodu',
    'Mağaza Kodu',
    'Depo Kodu',
    'Depo Açıklaması',
    'Gönderilen Ofis Kodu',
    'Gönderilen Mağaza Kodu',
    'Uygulama Kodu',
    'Uygulama Açıklaması',
    'Bağlantılı Uygulama Kodu',
    'Bağlantılı Uygulama ID',
    'Ürün Açıklaması',
    'Engellendi mi?',
    'Referans Numarası'
  ];
  selectedColumns: any[] = [];

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(p => {
      if (p['type'] == 'product-inventory-raport') {
        this.toasterService.info('Ürün Envanter Raporu');
        this.headerService.updatePageTitle('Ürün Envanter Raporu')
        this.raportID = 0;
      }

      if (p['type'] == 'product-extract-quantity') {
        this.toasterService.info('Ürün Envanter Ekstresi Miktarlı');
        this.headerService.updatePageTitle('Ürün Envanter Ekstresi Miktarlı');
        this.raportID = 1;
      }

      if (p['type'] == 'best-seller') {
        this.toasterService.info('Çok Satan Ürünler Raporu');
        this.headerService.updatePageTitle('Çok Satan Ürünler Raporu');
        this.raportID = 2;
        this.getBestSellers();
      }
    })
  }

  search: string;
  async handleOnSubmit() {
    if (this.raportID == 0) {
      await this.getProductInventoryRaport(this.search);
    } else if (this.raportID == 1) {
      await this.getProductExtractQuantity(this.search);
    } else if (this.raportID == 2) {
      return;
    } else if (this.raportID == 3) {

    }
  }
  items: MenuItem[] = [
    {
      label: 'Excel\'e Aktar',
      command: () => {
        this.exportCsv();
      }
    }
  ];
  exportCsv() {
    if (this.raportID == 0) {
      this.exportCsvService.exportToCsv(this.productInventoryRaports, 'my-data');
    } else if (this.raportID == 1) {
      this.exportCsvService.exportToCsv(this.productExtractRaports, 'my-data');
    } else if (this.raportID == 2) {
      this.exportCsvService.exportToCsv(this.bestSellers, 'my-data');
    } else {
      this.toasterService.error('Veri Yok')

    }

  }


  productInventoryRaports: Raport_ProductInventory[] = [];
  async getProductInventoryRaport(itemCode: string) {
    this.productInventoryRaports = await this.raportService.getProductInventoryRaport(itemCode);
  }
  productExtractRaports: Raport_ProductExtract[] = [];
  async getProductExtractQuantity(itemCode: string) {
    this.productExtractRaports = await this.raportService.getProductExtractQuantity(itemCode);
  }
  bestSellers: Raport_BestSeller[] = []
  async getBestSellers() {
    this.bestSellers = await this.raportService.getBestSellers();
  }
}
