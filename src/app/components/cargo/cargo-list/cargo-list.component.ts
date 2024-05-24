import { Component, OnInit } from '@angular/core';
import { ToasterService } from 'src/app/services/ui/toaster.service';
import { CargoService } from 'src/app/services/admin/cargo.service';
import { HeaderService } from 'src/app/services/admin/header.service';
import { CargoBarcode_VM, GetPackageStatus_MNG_Response } from '../create-cargo/models/models';

@Component({
  selector: 'app-cargo-list',
  templateUrl: './cargo-list.component.html',
  styleUrls: ['./cargo-list.component.css']
})
export class CargoListComponent implements OnInit {

  constructor(private headerService: HeaderService, private toasterService: ToasterService, private cargoService: CargoService) { }
  currentPage = 1;
  cargos: CargoBarcode_VM[] = [];
  visible: boolean = false;
  cargoState: boolean = false;
  ngOnInit(): void {
    this.headerService.updatePageTitle("Kargolar");
    this.getCargos(this.cargoState);
  }

  async getCargos(isPrinted: boolean) {
    this.cargoState = isPrinted;
    this.cargos = await this.cargoService.getShippedCargos(this.cargoState);
  }
  // async printSingleBarcode(zplCode) {
  //   var response = await this.cargoService.printSingleBarcode(zplCode);
  // }

  async deleteCargo(cargo: CargoBarcode_VM, cargoFirmId: number) {
    var windowResponse = window.confirm("Gönderiyi silmek istediğinize emin misiniz?")
    if (windowResponse) {

      var response = await this.cargoService.deleteCargo(cargo, cargoFirmId)
      if (response) {
        this.toasterService.success("Gönderi Silindi")
        this.getCargos(this.cargoState);
      } else {
        this.toasterService.warn("Gönderi Silinemedi")
      }
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

    if (window.confirm("Barkod yazdırmak istediğinize emin misiniz?")) {
      var data = await this.cargoService.createBarcode(referenceId);
      if (data) {


        const file = new Blob([data], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);

        // Create a temporary link element
        const downloadLink = document.createElement('a');
        downloadLink.href = fileURL;
        downloadLink.download = "marketplace-order-cargo-barcode.pdf";  // Set the filename for the download
        document.body.appendChild(downloadLink); // Append to body
        downloadLink.click();  // Trigger the download
        document.body.removeChild(downloadLink); // Remove the link after triggering the download
        URL.revokeObjectURL(fileURL); // Clean up the URL object





        const _file = new Blob([data], { type: 'application/pdf' });
        const _fileURL = URL.createObjectURL(_file);

        // Create an iframe element
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';  // Hide the iframe
        iframe.src = _fileURL;

        // Append the iframe to the body
        document.body.appendChild(iframe);

        // Wait until the iframe is loaded, then call print
        iframe.onload = () => {
          iframe.contentWindow?.print();
        };
      }


      this.toasterService.success("BARKOD YAZDIRILDI");

      this.getCargos(this.cargoState);
    }
  }

}

