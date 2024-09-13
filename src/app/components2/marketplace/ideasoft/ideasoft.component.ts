import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from 'src/app/services/ui/toaster.service';

@Component({
  selector: 'app-ideasoft',
  templateUrl: './ideasoft.component.html',
  styleUrls: ['./ideasoft.component.css']
})
export class IdeasoftComponent implements OnInit {

  constructor(private route: ActivatedRoute, private toasterService: ToasterService) { }
  operationNo: string | null = '';
  code: string | null = '';
  state: string | null = '';

  ngOnInit(): void {
    // URL : http://localhost:4200/ideasoft/auth?state=2b33fdd45jbevd6nam&code=Q0ODMI2OGY
    var url = location.href;
    var date = new Date();
    var state = url.split('state=')[1].split('&')[0];
    var code = url.split('code=')[1];
    this.toasterService.success(state);
    this.toasterService.success(code); 

  }

}
