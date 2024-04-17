import { Injectable } from '@angular/core';
import { ToasterService } from '../ui/toaster.service';
import { HttpClientService } from '../http-client.service';
import { Development, DevelopmentTask, DevelopmentTask_VM } from 'src/app/models/model/development/development';

@Injectable({
  providedIn: 'root'
})
export class DevelopmentService {

  constructor(private toasterService: ToasterService, private httpClientService: HttpClientService) {
  }

  async getAllDevelopments(): Promise<Development[]> {
    return await this.httpClientService.get<Development>({ controller: "Developments/get-all-developments" }).toPromise();
  }

  async getAllDevelopmentTasks(request): Promise<any> {
    return await this.httpClientService.post<any>({ controller: "Developments/get-all-development-tasks" }, request).toPromise();
  }

  async addDevelopment(development: Development) {
    return await this.httpClientService.post<Development>({ controller: "Developments/add-development" }, development).toPromise();
  }
  async addDevelopmentTask(developmentTask: DevelopmentTask) {
    return await this.httpClientService.post<DevelopmentTask>({ controller: "Developments/add-development-task" }, developmentTask).toPromise();
  }

  async updateDevelopment(development: Development) {
    return await this.httpClientService.post<Development>({ controller: "Developments/update-development" }, development).toPromise();
  }
  async updateDevelopmentTask(developmentTask: DevelopmentTask) {
    return await this.httpClientService.post<DevelopmentTask>({ controller: "Developments/update-development-task" }, developmentTask).toPromise();
  }

  async deleteDevelopment(id: number) {
    return await this.httpClientService.get({ controller: "Developments/delete-development" }, id.toString()).toPromise();
  }
  async deleteDevelopmentTask(id: number) {
    return await this.httpClientService.get({ controller: "Developments/delete-development-task" }, id.toString()).toPromise();
  }
  async getDevelopmentRaport(): Promise<any> {
    return await this.httpClientService.get({ controller: "Developments/get-development-raport" }).toPromise();
  }
}
