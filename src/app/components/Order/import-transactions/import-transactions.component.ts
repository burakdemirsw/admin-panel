import { Component, OnInit } from '@angular/core';
import { ToasterService } from '../../../services/ui/toaster.service';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { ImportTransaction } from 'src/app/models/model/warehouse/importTransaction';
import { ExportCsvService } from 'src/app/services/export-csv.service';
import { MenuItem } from 'primeng/api';
import { HeaderService } from '../../../services/admin/header.service';
import { WarehouseOfficeModel } from 'src/app/models/model/warehouse/warehouseOfficeModel';

@Component({
  selector: 'app-import-transactions',
  templateUrl: './import-transactions.component.html',
  styleUrl: './import-transactions.component.css'
})
export class ImportTransactionsComponent implements OnInit {

  importTransactions: ImportTransaction[] = [];
  selectedTransactions: ImportTransaction[] = [];
  offices: any[] = []
  warehouses: any[] = []
  warehouseModels: WarehouseOfficeModel[] = [];
  warehouseDialog: boolean = false;

  metaKey: boolean = true;
  constructor(private toasterService: ToasterService, private warehouseService: WarehouseService,
    private exportCsvService: ExportCsvService, private HeaderService: HeaderService
  ) { }
  items: MenuItem[] = [

    {
      label: 'Excel\'e Aktar',
      command: () => {

        this.exportCsv();
      }
    }

  ];
  ngOnInit() {

    this.HeaderService.updatePageTitle('İthalat İşlemleri');
    this.getWarehouseAndOffices();
    this.getImportTransactions();
  }

  async getWarehouseAndOffices() {
    var response = await this.warehouseService.getWarehouseAndOffices();
    this.warehouseModels = response;

    const officeSet = new Set();
    const warehouseSet = new Set();

    this.warehouseModels.forEach(model => {
      officeSet.add(model.officeCode);
      warehouseSet.add(model.warehouseCode);
    });

    this.offices = Array.from(officeSet);
    this.warehouses = Array.from(warehouseSet).map(code => {
      const model = this.warehouseModels.find(warehouse => warehouse.warehouseCode === code);
      return {
        code: model.warehouseCode,
        name: model.warehouseDescription
      };
    });
  }

  exportCsv() {
    if (this.selectedTransactions.length > 0) {

      this.exportCsvService.exportToCsv(this.selectedTransactions, 'my-invoices');
    } else {
      this.toasterService.error('Lütfen en az bir transfer seçiniz');
    }
  }

  async getImportTransactions() {
    var response = await this.warehouseService.getImportTransactionList();
    this.importTransactions = response;
  }

  selectedInvoiceNumber: string;
  sendTransfer(invoiceNumber: string) {
    this.selectedInvoiceNumber = invoiceNumber;
    this.warehouseDialog = true;

  }

  async completeImportTransaction(invoiceNumber: string, warehouseCode: string) {
    if (window.confirm('Transfer işlemi gerçekleştirilsin mi?')) {
      var response = await this.warehouseService.completeImportTransaction(invoiceNumber, warehouseCode);
      if (response) {
        this.toasterService.success('Transfer işlemi gerçekleştirildi');
      } else {
        this.toasterService.error('Transfer işlemi gerçekleştirilemedi');
      }
    }
  }
}
