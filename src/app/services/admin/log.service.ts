import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LogFilterModel } from 'src/app/models/model/log/logFilterModel ';
import { HttpClientService } from '../http-client.service';
import { ToasterService } from '../ui/toaster.service';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(
    private toasterService: ToasterService,
    private httpClientService: HttpClientService,
    private router: Router,
    private httpClient: HttpClient
  ) { }

  async getLogs(model: LogFilterModel): Promise<any> {
    const response = await this.httpClientService.post<LogFilterModel>({ controller: "Logs/GetLogs" }, model).toPromise()
    return response;

  }
}
