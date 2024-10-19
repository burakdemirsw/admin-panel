import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Proposal_VM } from 'src/app/models/model/product/proposalProduct';
import { GeneralService } from 'src/app/services/admin/general.service';
import { HeaderService } from 'src/app/services/admin/header.service';
import { OrderService } from 'src/app/services/admin/order.service';
import { ProductService } from 'src/app/services/admin/product.service';
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
    private router: Router,
    private productService: ProductService,
    private orderService: OrderService
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
  selectedProposal: Proposal_VM;
  async createProposalReport(selectedProposal: Proposal_VM) {

    this.completeDialog = true;
    this.selectedProposal = selectedProposal;
    // if (window.confirm("Mail Gönderilsin mi?")) {
    //   var data = await this.orderService.createProposalReport(this.proposal.id, true);
    // } else {
    //   var data = await this.orderService.createProposalReport(this.proposal.id, false);
    // }
  }

  async _createProposalReport(type: number) {

    //this.completeDialog = true;
    if (window.confirm("Mail Gönderilsin mi?")) {
      var data = await this.orderService.createProposalReport(this.selectedProposal.id, true, type);
    } else {
      var data = await this.orderService.createProposalReport(this.selectedProposal.id, false, type);
    }
  }

  completeDialog: boolean = false;
  raportType = 1;
  async routeNewPage() {
    var uuid = await this.generalService.generateGUID();
    this.router.navigate(["/create-proposal"])
    this.toasterService.info("Ürün Aratınız")

  }

}
