import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ExportTransaction } from 'src/app/models/model/warehouse/importTransaction';
import { WarehouseOfficeModel } from 'src/app/models/model/warehouse/warehouseOfficeModel';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { ExportCsvService } from 'src/app/services/export-csv.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';
import { HeaderService } from '../../../services/admin/header.service';

@Component({
  selector: 'app-export-transactions',
  templateUrl: './export-transactions.component.html',
  styleUrl: './export-transactions.component.css'
})
export class ExportTransactionsComponent {
  importTransactions: ExportTransaction[] = [];
  selectedTransactions: ExportTransaction[] = [];
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

    this.HeaderService.updatePageTitle('İhracat İşlemleri');
    this.getWarehouseAndOffices();
    this.getExportTransactionList();
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

  async getExportTransactionList() {
    var response = await this.warehouseService.getExportTransactionList();
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
