import { Component, OnInit } from '@angular/core';
import { CargoBarcode_VM, GetPackageStatus_MNG_Response } from '../create-cargo/models/models';
import { ToasterService } from 'src/app/services/ui/toaster.service';
import { CargoService } from 'src/app/services/admin/cargo.service';

@Component({
  selector: 'app-cargo-list',
  templateUrl: './cargo-list.component.html',
  styleUrls: ['./cargo-list.component.css']
})
export class CargoListComponent implements OnInit {

  constructor(private toasterService: ToasterService, private cargoService: CargoService) { }
  currentPage = 1;
  cargos: CargoBarcode_VM[] = [];
  visible: boolean = false;
  ngOnInit(): void {
    this.getCargos();
  }

  async getCargos() {
    this.cargos = await this.cargoService.getShippedCargos();
  }
  async printSingleBarcode(zplCode) {
    var response = await this.cargoService.printSingleBarcode(zplCode);
  }

  async deleteCargo(cargo: CargoBarcode_VM) {
    var response = await this.cargoService.deleteCargo(cargo)
    if (response) {
      this.toasterService.success("Gönderi Silindi")
      this.getCargos();
    } else {
      this.toasterService.warn("Gönderi Silinemedi")
    }
  }
  packageStatus: GetPackageStatus_MNG_Response = null;
  async getCargoDetail(cargo: CargoBarcode_VM, openDialog: boolean) {
    var response = await this.cargoService.getPackageStatus(cargo.referenceId);

    if (openDialog) {
      this.visible = true
      this.packageStatus = response
    } else {
      window.open(response.trackingUrl, "_blank");
    }
  }


  async createBarcode(referenceId: string) {
    var response = await this.cargoService.createBarcode(referenceId);
    if (response) {
      this.toasterService.success("BARKOD YAZDIRILDI");

      this.getCargos();
    }
  }
}
