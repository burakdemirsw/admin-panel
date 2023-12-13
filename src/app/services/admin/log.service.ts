import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientService } from '../http-client.service';
import { AlertifyService } from '../ui/alertify.service';
import { LogFilterModel } from 'src/app/models/model/log/logFilterModel ';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(
    private alertifyService: AlertifyService,
    private httpClientService: HttpClientService,
    private router: Router,
    private httpClient: HttpClient
  ) {}

  async getLogs (model : LogFilterModel) : Promise< any>{
    const response = await this.httpClientService.post<LogFilterModel>({controller:"Logs/GetLogs"},model).toPromise()
    return response;

  }
}
