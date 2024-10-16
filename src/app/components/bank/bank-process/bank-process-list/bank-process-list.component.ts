import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BankHeader_VM } from "src/app/models/model/invoice/BankHeader_VM";
import { GeneralService } from 'src/app/services/admin/general.service';
import { HeaderService } from 'src/app/services/admin/header.service';
import { InfoService } from 'src/app/services/admin/info.service';
import { OrderService } from 'src/app/services/admin/order.service';
import { ProductService } from 'src/app/services/admin/product.service';
import { UserService } from 'src/app/services/admin/user.service';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';

@Component({
  selector: 'app-bank-process-list',
  templateUrl: './bank-process-list.component.html',
  styleUrls: ['./bank-process-list.component.css'] // Düzeltme: styleUrls yazılacak
})
export class BankProcessListComponent implements OnInit {
  bankHeaders: BankHeader_VM[] = []; // BankHeaderVm tipinde bir dizi

  constructor(
    private formBuilder: FormBuilder,
    private toasterService: ToasterService,
    private orderService: OrderService,
    private productService: ProductService,
    private warehouseService: WarehouseService,
    private generalService: GeneralService,
    private activatedRoute: ActivatedRoute,
    private headerService: HeaderService,
    private routerService: Router,
    private userService: UserService,
    private infoService: InfoService,
  ) { }

  ngOnInit(): void {
    this.headerService.updatePageTitle("Banka Operasyonları")
    this.loadBankHeaders(); // Bileşen yüklendiğinde bank headers'ı yükle
  }

  // Bank header verilerini yüklemek için fonksiyon
  async loadBankHeaders() {
    try {
      this.bankHeaders = await this.orderService.getBankHeaders(); // Servisten veriyi al
    } catch (error) {
      this.toasterService.error("Bank headers yüklenirken bir hata oluştu."); // Hata durumunda bildirim
      console.error(error);
    }
  }
  async deleteProcess(header: BankHeader_VM) {
    var response = await this.orderService.deleteBankHeader(header.id);
    if (response) {
      this.loadBankHeaders();
    }
  }

}
