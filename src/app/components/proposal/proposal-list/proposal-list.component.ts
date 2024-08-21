import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Proposal_VM } from 'src/app/models/model/product/proposalProduct';
import { GeneralService } from 'src/app/services/admin/general.service';
import { HeaderService } from 'src/app/services/admin/header.service';
import { ProductService } from 'src/app/services/admin/product.service';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';

@Component({
  selector: 'app-proposal-list',
  templateUrl: './proposal-list.component.html',
  styleUrl: './proposal-list.component.css'
})
export class ProposalListComponent implements OnInit {
  currentPage = 1;
  async ngOnInit() {
    await this.getProposals()
  }
  constructor(
    private generalService: GeneralService,
    private toasterService: ToasterService,
    private headerService: HeaderService,
    private router: Router,
    private productService: ProductService,
    private warehouseService: WarehouseService
  ) {

  }
  proposals: Proposal_VM[] = []

  async getProposals() {
    this.proposals = await this.productService.getProposals();
  }

  async deleteProposal(id: number) {
    const confirmed = window.confirm('Bu teklifi silmek istediğinizden emin misiniz?');
    if (confirmed) {
      try {
        const response = await this.productService.deleteProposal(id);
        if (response) {
          this.toasterService.success('Silindi');
          await this.getProposals();
        } else {
          this.toasterService.error('Silinemedi');
        }
      } catch (error) {
        console.error('Error deleting proposal', error);
        this.toasterService.error('Silinemedi');
      }
    }
  }
  async createProposalReport(proposal: Proposal_VM) {

    if (window.confirm("Teklifi Oluşturmak İstediğinize Emin Misiniz?")) {
      var data = await this.productService.createProposalReport(proposal.id);
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
        this.toasterService.success("Teklif YAZDIRILDI");

      } else {
        this.toasterService.error("Teklif YAZDIRILAMADI");
      }

    }
  }
  async routeNewPage() {
    var uuid = await this.generalService.generateGUID();
    this.router.navigate(["/create-proposal"])
    this.toasterService.info("Ürün Aratınız")

  }

}
