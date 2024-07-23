import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { GeneralService } from 'src/app/services/admin/general.service';
import { HeaderService } from 'src/app/services/admin/header.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';

@Component({
  selector: 'app-proposal-list',
  templateUrl: './proposal-list.component.html',
  styleUrl: './proposal-list.component.css'
})
export class ProposalListComponent implements OnInit {
  currentPage = 1;
  ngOnInit(): void {

  }
  constructor(
    private generalService: GeneralService,
    private toasterService: ToasterService,
    private headerService: HeaderService,
    private router: Router
  ) {

  }

  async routeNewPage() {
    var uuid = await this.generalService.generateGUID();
    this.router.navigate(["/create-proposal/" + uuid])
    this.toasterService.info("Ürün Aratınız")

  }

}
