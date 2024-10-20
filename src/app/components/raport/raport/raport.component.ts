import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MenuItem } from 'primeng/api';
import { BankAccount } from 'src/app/models/model/invoice/BankAccount';
import { CashAccount } from 'src/app/models/model/nebim/cdShipmentMethodDesc ';
import { Raport_BestSeller, Raport_ProductExtract, Raport_ProductInventory } from 'src/app/models/model/raport/raport_CR';
import { GeneralService } from 'src/app/services/admin/general.service';
import { HeaderService } from 'src/app/services/admin/header.service';
import { OrderService } from 'src/app/services/admin/order.service';
import { RaportService } from 'src/app/services/admin/raport.service';
import { ExportCsvService } from 'src/app/services/export-csv.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';
import { AssurSaleReport, BankReport, bsQueryMasterVm, bsQueryParams, GetFinalQueryRequest, TillReport } from '../../../models/model/raport/bsQueryMaster ';
import { InfoService } from '../../../services/admin/info.service';

@Component({


  templateUrl: './raport.component.html',
  styleUrl: './raport.component.css'
})
export class RaportComponent implements OnInit {


  constructor(
    private toasterService: ToasterService,
    private activatedRoute: ActivatedRoute,
    private raportService: RaportService,
    private headerService: HeaderService,
    private infoService: InfoService,
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

  async ngOnInit() {
    this.activatedRoute.params.subscribe(async (p) => {
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

      if (p['type'] == 'nebim-raports') {
        this.toasterService.info('Nebim Raporları');
        this.headerService.updatePageTitle('Nebim Raporları');
        this.raportID = 3;
        this.getAllNebimRaports();
      }

      if (p['type'] == 'assur-sale-report') {
        this.toasterService.info('Genel Satış Raporu');
        this.headerService.updatePageTitle('Genel Satış Raporu');
        this.raportID = 4;
        setTimeout(() => {
          this.filterDialog = true; // Open the dialog after 1 second
        }, 500);
        // this.getAssurSaleReport();
      }

      if (p['type'] == 'assur-till-report') {
        this.toasterService.info('Kasa Raporu');
        this.headerService.updatePageTitle('Kasa Raporu');
        this.raportID = 5;
        setTimeout(() => {
          this.filterDialog2 = true; // Open the dialog after 1 second
        }, 500);
        this.cashAccounts = await this.infoService.getCashAccounts();

        // this.getAssurSaleReport();
      }
      if (p['type'] == 'assur-bank-report') {

        this.bankAccounts = await this.infoService.getBankAccounts();
        this.toasterService.info('Banka Raporu');
        this.headerService.updatePageTitle('Banka Raporu');
        this.raportID = 6;
        setTimeout(() => {
          this.filterDialog3 = true; // Open the dialog after 1 second
        }, 500);
        // this.getAssurSaleReport();
      }
    })
  }
  cashAccounts: CashAccount[] = [];
  bankAccounts: BankAccount[] = [];
  filterDialog: boolean;
  filterDialog2: boolean;
  filterDialog3: boolean;
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

  exportCsv(data: any[]) {

    this.exportCsvService.exportToCsv(data, 'my-data');
    // if (this.raportID == 0) {
    //   this.exportCsvService.exportToCsv(this.productInventoryRaports, 'my-data');
    // } else if (this.raportID == 1) {
    //   this.exportCsvService.exportToCsv(this.productExtractRaports, 'my-data');
    // } else if (this.raportID == 2) {
    //   this.exportCsvService.exportToCsv(this.bestSellers, 'my-data');
    // } else {
    //   this.toasterService.error('Veri Yok')
    // }

  }

  columnTranslations: { [key: string]: string } = {
    "ProductCode": "Ürün Kodu",
    "ProductDescription": "Ürün Açıklaması",
    "ColorCode": "Renk Kodu",
    "ColorDescription": "Renk Açıklaması",
    "ItemDim1Code": "Boyut 1 Kodu",
    "ItemDim2Code": "Boyut 2 Kodu",
    "ItemDim3Code": "Boyut 3 Kodu",
    "RemainingQty1_PurchaseOrders": "Kalan Sipariş Miktarı 1",
    "RemainingReserveQty1": "Kalan Rezerv Miktarı 1",
    "RemainingDispOrderQty1": "Kalan Dağıtım Siparişi Miktarı 1",
    "RemainingConfirmedPickingQty1": "Kalan Onaylı Toplama Miktarı 1",
    "RemainingUnConfirmedPickingQty1": "Kalan Onaysız Toplama Miktarı 1",
    "RemainingOrderAsnQty1": "Kalan Sipariş ASN Miktarı 1",
    "ShipmentQty1": "Sevkiyat Miktarı 1",
    "RemainingOrderQty1": "Kalan Sipariş Miktarı 1",
    "InventoryQty1": "Stok Miktarı 1",
    "AvailableInventoryQty1": "Mevcut Stok Miktarı 1",
    "InventoryWithInOrderQty": "Sipariş İçeren Stok Miktarı",
    "StartDate": "Başlangıç Tarihi",
    "EndDate": "Bitiş Tarihi",
    "CompanyCode": "Şirket Kodu",
    "OfficeCode": "Ofis Kodu",
    "StoreCode": "Mağaza Kodu",
    "WarehouseCode": "Depo Kodu",
    "Qty1": "Miktar 1",
    "Price": "Fiyat",
    "TotalSalesQty1": "Toplam Satış Miktarı 1",
    "SalesWithoutTax": "Vergisiz Satış",
    "SalesWithTax": "Vergili Satış",
    "ProcessCode": "İşlem Kodu",
    "ProcessDescription": "İşlem Açıklaması",
    "TransTypeCode": "İşlem Türü Kodu",
    "TransTypeDescription": "İşlem Türü Açıklaması",
    "IsReturn": "İade mi?",
    "RefNumber": "Referans Numarası",
    "DocumentNumber": "Belge Numarası",
    "CurrAccTypeCode": "Müşteri Hesap Türü Kodu",
    "CurrAccTypeDescription": "Müşteri Hesap Türü Açıklaması",
    "CurrAccCode": "Müşteri Hesap Kodu",
    "CurrAccDescription": "Müşteri Hesap Açıklaması",
    "FromOfficeCode": "Gönderilen Ofis Kodu",
    "FromStoreCode": "Gönderilen Mağaza Kodu",
    "ApplicationCode": "Uygulama Kodu",
    "ApplicationDescription": "Uygulama Açıklaması",
    "LinkedApplicationCode": "Bağlantılı Uygulama Kodu",
    "LinkedApplicationID": "Bağlantılı Uygulama ID",
    "IsBlocked": "Engellendi mi?",
    "OperationDate": "İşlem Tarihi",
    "ProductSerialNumber": "Ürün Seri Numarası",
    "BalanceDate": "Bakiye Tarihi",
    "OrderDate": "Sipariş Tarihi",
    "OrderNumber": "Sipariş Numarası",
    "InvoiceNumber": "Fatura Numarası",
    "IsShipped": "Gönderildi mi?",
    "VendorAtt01": "Satıcı Özelliği 01",
    "VendorAtt02": "Satıcı Özelliği 02",
    "VendorAtt03": "Satıcı Özelliği 03",
    "VendorAtt04": "Satıcı Özelliği 04",
    "VendorAtt05": "Satıcı Özelliği 05",
    "ProductHierarchyLevel01": "Ürün Hiyerarşi Seviyesi 01",
    "ProductHierarchyLevel02": "Ürün Hiyerarşi Seviyesi 02",
    "ProductHierarchyLevel03": "Ürün Hiyerarşi Seviyesi 03",
    "ProductHierarchyLevel04": "Ürün Hiyerarşi Seviyesi 04",
    "ProductHierarchyLevel05": "Ürün Hiyerarşi Seviyesi 05",
    "ProductHierarchyLevel06": "Ürün Hiyerarşi Seviyesi 06",
    "ApplicationID": "Uygulama ID",
    "StoreDescription": "Mağaza Açıklaması",
    "WarehouseDescription": "Depo Açıklaması",
    "InQty1": "Giriş Miktarı 1",
    "OutQty1": "Çıkış Miktarı 1",
    "ATAtt01": "Ürün Özelliği 01",
    "ATAtt02": "Ürün Özelliği 02",
    "ATAtt03": "Ürün Özelliği 03",
    "ATAtt04": "Ürün Özelliği 04",
    "ATAtt05": "Ürün Özelliği 05",
    "ATAtt06": "Ürün Özelliği 06",
    "ATAtt07": "Ürün Özelliği 07",
    "ATAtt08": "Ürün Özelliği 08",
    "ATAtt09": "Ürün Özelliği 09",
    "ATAtt10": "Ürün Özelliği 10",
    "VendorAtt06": "Satıcı Özelliği 06",
    "VendorAtt07": "Satıcı Özelliği 07",
    "VendorAtt08": "Satıcı Özelliği 08",
    "VendorAtt09": "Satıcı Özelliği 09",
    "VendorAtt10": "Satıcı Özelliği 10",
    "VendorAtt11": "Satıcı Özelliği 11",
    "VendorAtt12": "Satıcı Özelliği 12",
    "VendorAtt13": "Satıcı Özelliği 13",
    "VendorAtt14": "Satıcı Özelliği 14",
    "VendorAtt15": "Satıcı Özelliği 15",
    "ITAtt01": "Ürün Türü Özelliği 01",
    "ITAtt02": "Ürün Türü Özelliği 02",
    "ITAtt03": "Ürün Türü Özelliği 03",
    "ITAtt04": "Ürün Türü Özelliği 04",
    "ITAtt05": "Ürün Türü Özelliği 05",
    "ITAtt06": "Ürün Türü Özelliği 06",
    "ITAtt07": "Ürün Türü Özelliği 07",
    "ITAtt08": "Ürün Türü Özelliği 08",
    "ITAtt09": "Ürün Türü Özelliği 09",
    "ITAtt10": "Ürün Türü Özelliği 10",
    "ProductAtt01": "Ürün Özelliği 01",
    "ProductAtt02": "Ürün Özelliği 02",
    "ProductAtt03": "Ürün Özelliği 03",
    "ProductAtt04": "Ürün Özelliği 04",
    "ProductAtt05": "Ürün Özelliği 05",
    "ProductAtt06": "Ürün Özelliği 06",
    "ProductAtt07": "Ürün Özelliği 07",
    "ProductAtt08": "Ürün Özelliği 08",
    "ProductAtt09": "Ürün Özelliği 09",
    "ProductAtt10": "Ürün Özelliği 10",
    "ProductAtt11": "Ürün Özelliği 11",
    "ProductAtt12": "Ürün Özelliği 12",
    "ProductAtt13": "Ürün Özelliği 13",
    "ProductAtt14": "Ürün Özelliği 14",
    "ProductAtt15": "Ürün Özelliği 15",
    "V3ReportFileName": "V3 Rapor Dosya Adı",
    "PivotFileName": "Pivot Dosya Adı",
    "GridFileName": "Grid Dosya Adı",
    "CanReportOtherCompanies": "Diğer Şirketler Raporlanabilir mi?",
    "AdvancedQueryOption": "Gelişmiş Sorgu Seçeneği",
    "DateColumnNamesMinMaxValueNotControl": "Tarih Sütunu Adları Min/Max Kontrol Edilmez",
    "VisibleName": "Görünür Ad",
    "SortOrder": "Sıralama Düzeni",
    "QueryTypeCode": "Sorgu Tipi Kodu",
    "ViewTypeCode": "Görünüm Tipi Kodu",
    "MasterDataTableQuery": "Ana Veri Tablosu Sorgusu",
    "IsUnchangeable": "Değiştirilemez mi?",
    "FromReportServer": "Rapor Sunucusundan mı?",
    "DefaultFilterCols": "Varsayılan Filtre Sütunları",
    "ParameteredFields": "Parametreli Alanlar",
    "NotBeFilteredFields": "Filtrelenmeyecek Alanlar",
    "InventoryDate": "Stok Tarihi",
    "gg.aa.yyyy": "gg.aa.yyyy",
    "ParamColorDetail": "Renk Detayı Parametresi",
    "ParamItemDimensionDetail": "Öğe Boyut Detayı Parametresi",
    "ParamIncludeTransferNotApproved": "Onaylanmamış Transferleri Dahil Et Parametresi",
    "ParamConsignmentSellerWarehouse": "Konsinye Satıcı Deposu Parametresi",
    "ParamDistributorSellerWarehouse": "Distribütör Satıcı Deposu Parametresi",
    "ParamWarehouseDetail": "Depo Detayı Parametresi"
  };
  bsQueryMasterVms: bsQueryMasterVm[] = [];
  selectedQueryId: string;
  filteredBsQueryMasterVms: bsQueryMasterVm[] = []; // Filtrelenmiş liste
  searchDesc: string = ''; // Arama kutusu değeri
  selectedQueryParams: bsQueryParams[] = [];
  finalQueryResult: any[] = []; // Sonuç olarak dönen JSON verisi
  displayForm: boolean = false; // Formu gösterme kontrolü
  onCancelDialog() {
    this.displayForm = false; // Dialog'u kapat
  }

  async onSelectReport(query: bsQueryMasterVm) {
    try {
      // Seçilen raporun parametrelerini almak için
      this.selectedQueryId = query.queryID;
      this.selectedQueryParams = await this.raportService.getRaportByQueryId(query.queryID);
      this.displayForm = true; // Formu gösteriyoruz
    } catch (error) {
      console.error('Rapor parametreleri alınırken hata oluştu', error);
    }
  }
  dataSource: any[] = [];
  displayedColumns: string[] = [];

  async onSubmitFinalQuery() {
    // Parametreleri birleştirip final sorgu için istek yapacağız
    const request: GetFinalQueryRequest = {
      id: this.selectedQueryId, // Seçili raporun ID'si
      params: this.selectedQueryParams,
    };

    try {
      const result = await this.raportService.getFinalRaportQuery(request);

      // Veriyi dataSource'a atayın
      this.dataSource = result;

      // Gelen sonuçlarda veri varsa sütun isimlerini dinamik olarak belirleyin
      if (this.dataSource && this.dataSource.length > 0) {
        this.displayedColumns = Object.keys(this.dataSource[0]);
      } else {
        console.warn('Boş sonuç döndü.');
      }
    } catch (error) {
      console.error('Final rapor alınırken hata oluştu', error);
    }
  }

  async getAllNebimRaports() {
    this.bsQueryMasterVms = await this.raportService.getAllNebimRaports_VM();

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
  bankReports: BankReport[] = [];

  async getBankReports() {

    if (this.startDate && this.endDate) {
      // Format dates to YYYY-MM-DD
      const formattedStartDate = this.startDate.toISOString().split('T')[0]; // Extracts only the date part
      const formattedEndDate = this.endDate.toISOString().split('T')[0]; // Extracts only the date part

      var response = await this.raportService.getBankReport(formattedStartDate, formattedEndDate, this.currAccCode);
      if (response) {
        this.filterDialog3 = false;
        this.bankReports = response;
      }
    } else {
      this.toasterService.error('Lütfen başlangıç ve bitiş tarihlerini seçiniz.');
    }
  }

  tillReports: TillReport[] = [];
  async getTillReport() {
    if (this.startDate && this.endDate) {
      // Format dates to YYYY-MM-DD
      const formattedStartDate = this.startDate.toISOString().split('T')[0]; // Extracts only the date part
      const formattedEndDate = this.endDate.toISOString().split('T')[0]; // Extracts only the date part

      var response = await this.raportService.getAssurTillReport(formattedStartDate, formattedEndDate, this.currAccCode);
      if (response) {
        this.filterDialog2 = false;
        this.tillReports = response;
      }
    } else {
      this.toasterService.error('Lütfen başlangıç ve bitiş tarihlerini seçiniz.');
    }
  }


  assurSaleReport: AssurSaleReport
  startDate: Date;
  endDate: Date;
  currAccCode: any;
  async getAssurSaleReport() {
    if (this.startDate && this.endDate) {
      // Format dates to YYYY-MM-DD
      const formattedStartDate = this.startDate.toISOString().split('T')[0]; // Extracts only the date part
      const formattedEndDate = this.endDate.toISOString().split('T')[0]; // Extracts only the date part

      var response = await this.raportService.getAssurSaleReport(formattedStartDate, formattedEndDate);
      if (response) {
        this.filterDialog = false;
        this.assurSaleReport = response;
      }
    } else {
      this.toasterService.error('Lütfen başlangıç ve bitiş tarihlerini seçiniz.');
    }
  }

  items_0: MenuItem[] = [
    {
      label: 'Excel\'e Aktar',
      command: () => {
        this.exportCsv(this.productInventoryRaports);
      }
    },
    {
      label: 'Filtrelenen Datayı Excel\'e Aktar',
      command: () => {
        this.exportCsv(this._filtered_data_0);
      }
    }
  ];
  items_1: MenuItem[] = [
    {
      label: 'Excel\'e Aktar',
      command: () => {
        this.exportCsv(this.productExtractRaports);
      }
    },
    {
      label: 'Filtrelenen Datayı Excel\'e Aktar',
      command: () => {
        this.exportCsv(this._filtered_data_1);
      }
    }
  ];
  items_2: MenuItem[] = [
    {
      label: 'Excel\'e Aktar',
      command: () => {
        this.exportCsv(this.bestSellers);
      }
    },
    {
      label: 'Filtrelenen Datayı Excel\'e Aktar',
      command: () => {
        this.exportCsv(this._filtered_data_2);
      }
    }
  ]; items_4_1: MenuItem[] = [
    {
      label: 'Excel\'e Aktar',
      command: () => {
        this.exportCsv(this.assurSaleReport.saleReports);
      }
    },
    {
      label: 'Filtrelenen Datayı Excel\'e Aktar',
      command: () => {
        this.exportCsv(this._filtered_data_4_1);
      }
    }
  ];

  items_4_2: MenuItem[] = [
    {
      label: 'Excel\'e Aktar',
      command: () => {
        this.exportCsv(this.assurSaleReport.stockReports);
      }
    },
    {
      label: 'Filtrelenen Datayı Excel\'e Aktar',
      command: () => {
        this.exportCsv(this._filtered_data_4_2);
      }
    }
  ];
  items_4_3: MenuItem[] = [
    {
      label: 'Excel\'e Aktar',
      command: () => {
        this.exportCsv(this.assurSaleReport.financialReports);
      }
    },
    {
      label: 'Filtrelenen Datayı Excel\'e Aktar',
      command: () => {
        this.exportCsv(this._filtered_data_4_3);
      }
    }
  ];
  items_4_4: MenuItem[] = [
    {
      label: 'Excel\'e Aktar',
      command: () => {
        this.exportCsv(this.assurSaleReport.accountReports);
      }
    },
    {
      label: 'Filtrelenen Datayı Excel\'e Aktar',
      command: () => {
        this.exportCsv(this._filtered_data_4_4);
      }
    }
  ];
  items_4_5: MenuItem[] = [
    {
      label: 'Excel\'e Aktar',
      command: () => {
        this.exportCsv(this.assurSaleReport.inventoryReports);
      }
    },
    {
      label: 'Filtrelenen Datayı Excel\'e Aktar',
      command: () => {
        this.exportCsv(this._filtered_data_4_5);
      }
    }
  ];
  items_5: MenuItem[] = [
    {
      label: 'Excel\'e Aktar',
      command: () => {
        this.exportCsv(this.tillReports);
      }
    },
    {
      label: 'Filtrelenen Datayı Excel\'e Aktar',
      command: () => {
        this.exportCsv(this._filtered_data_5);
      }
    }
  ];
  items_6: MenuItem[] = [
    {
      label: 'Excel\'e Aktar',
      command: () => {
        this.exportCsv(this.bankReports);
      }
    },
    {
      label: 'Filtrelenen Datayı Excel\'e Aktar',
      command: () => {
        this.exportCsv(this._filtered_data_6);
      }
    }
  ];

  _filtered_data_0: any[] = [];
  _filtered_data_1: any[] = [];
  _filtered_data_2: any[] = [];
  _filtered_data_3: any[] = [];
  _filtered_data_4_1: any[] = [];
  _filtered_data_4_2: any[] = [];
  _filtered_data_4_3: any[] = [];
  _filtered_data_4_4: any[] = [];
  _filtered_data_4_5: any[] = [];
  _filtered_data_5: any[] = [];
  _filtered_data_6: any[] = [];
  onFilter(e: any, order: number) {
    if (order == 0) {
      if (e.filteredValue && e.filteredValue.length > 0) {
        this._filtered_data_0 = e.filteredValue;
      }
    } else if (order == 1) {
      if (e.filteredValue && e.filteredValue.length > 0) {
        this._filtered_data_1 = e.filteredValue;
      }
    } else if (order == 2) {
      if (e.filteredValue && e.filteredValue.length > 0) {
        this._filtered_data_2 = e.filteredValue;
      }
    } else if (order == 3) {
      if (e.filteredValue && e.filteredValue.length > 0) {
        this._filtered_data_3 = e.filteredValue;
      }
    } else if (order == 4.1) {
      if (e.filteredValue && e.filteredValue.length > 0) {
        this._filtered_data_4_1 = e.filteredValue;
      }
    } else if (order == 4.2) {
      if (e.filteredValue && e.filteredValue.length > 0) {
        this._filtered_data_4_2 = e.filteredValue;
      }
    }
    else if (order == 4.3) {
      if (e.filteredValue && e.filteredValue.length > 0) {
        this._filtered_data_4_3 = e.filteredValue;
      }
    }
    else if (order == 4.4) {
      if (e.filteredValue && e.filteredValue.length > 0) {
        this._filtered_data_4_4 = e.filteredValue;
      }
    }
    else if (order == 4.5) {
      if (e.filteredValue && e.filteredValue.length > 0) {
        this._filtered_data_4_5 = e.filteredValue;
      }
    } else if (order == 5) {
      if (e.filteredValue && e.filteredValue.length > 0) {
        this._filtered_data_5 = e.filteredValue;
      }
    } else if (order == 6) {
      if (e.filteredValue && e.filteredValue.length > 0) {
        this._filtered_data_6 = e.filteredValue;
      }
    }


  }

}
