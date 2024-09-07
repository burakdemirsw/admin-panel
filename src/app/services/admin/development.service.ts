import { Injectable } from '@angular/core';
import { Development, DevelopmentTask, TaskPriority, TaskControl, TaskComment, TaskPanel, TaskCardDTO, TaskPanelDTO } from 'src/app/models/model/development/development';
import { HttpClientService } from '../http-client.service';
import { ToasterService } from '../ui/toaster.service';

@Injectable({
  providedIn: 'root'
})
export class DevelopmentService {

  constructor(private toasterService: ToasterService, private httpClientService: HttpClientService) { }

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

  // TaskPriority methods
  async addTaskPriority(taskPriority: TaskPriority) {
    return await this.httpClientService.post<TaskPriority>({ controller: "Developments/add-task-priority" }, taskPriority).toPromise();
  }

  async updateTaskPriority(taskPriority: TaskPriority) {
    return await this.httpClientService.post<TaskPriority>({ controller: "Developments/update-task-priority" }, taskPriority).toPromise();
  }

  async deleteTaskPriority(id: number) {
    return await this.httpClientService.get({ controller: "Developments/delete-task-priority" }, id.toString()).toPromise();
  }

  async getAllTaskPriorities(): Promise<TaskPriority[]> {
    return await this.httpClientService.get<TaskPriority>({ controller: "Developments/get-all-task-priorities" }).toPromise();
  }

  // TaskControl methods
  async addTaskControl(taskControl: TaskControl) {
    return await this.httpClientService.post<TaskControl>({ controller: "Developments/add-task-control" }, taskControl).toPromise();
  }

  async updateTaskControl(taskControl: TaskControl) {
    return await this.httpClientService.post<TaskControl>({ controller: "Developments/update-task-control" }, taskControl).toPromise();
  }

  async deleteTaskControl(id: number) {
    return await this.httpClientService.get({ controller: "Developments/delete-task-control" }, id.toString()).toPromise();
  }

  async getAllTaskControls(): Promise<TaskControl[]> {
    return await this.httpClientService.get<TaskControl>({ controller: "Developments/get-all-task-controls" }).toPromise();
  }

  // TaskComment methods
  async addTaskComment(taskComment: TaskComment) {
    return await this.httpClientService.post<TaskComment>({ controller: "Developments/add-task-comment" }, taskComment).toPromise();
  }

  async updateTaskComment(taskComment: TaskComment) {
    return await this.httpClientService.post<TaskComment>({ controller: "Developments/update-task-comment" }, taskComment).toPromise();
  }

  async deleteTaskComment(id: number) {
    return await this.httpClientService.get({ controller: "Developments/delete-task-comment" }, id.toString()).toPromise();
  }

  async getAllTaskComments(): Promise<TaskComment[]> {
    return await this.httpClientService.get<TaskComment>({ controller: "Developments/get-all-task-comments" }).toPromise();
  }

  // TaskPanel CRUD işlemleri
  async addTaskPanel(taskPanel: TaskPanel) {
    return await this.httpClientService.post<TaskPanel>({ controller: "Developments/add-task-panel" }, taskPanel).toPromise();
  }

  async updateTaskPanel(taskPanel: TaskPanel) {
    return await this.httpClientService.post<TaskPanel>({ controller: "Developments/update-task-panel" }, taskPanel).toPromise();
  }

  async deleteTaskPanel(id: number) {
    return await this.httpClientService.get({ controller: "Developments/delete-task-panel" }, id.toString()).toPromise();
  }

  async getAllTaskPanels(): Promise<TaskPanel[]> {
    return await this.httpClientService.get<TaskPanel>({ controller: "Developments/get-all-task-panels" }).toPromise();
  }

  // TaskCard CRUD işlemleri
  async addTaskCard(taskCard: TaskCardDTO) {
    return await this.httpClientService.post<TaskCardDTO>({ controller: "Developments/add-task-card" }, taskCard).toPromise();
  }

  async updateTaskCard(taskCard: TaskCardDTO) {
    return await this.httpClientService.post<TaskCardDTO>({ controller: "Developments/update-task-card" }, taskCard).toPromise();
  }

  async deleteTaskCard(id: number) {
    return await this.httpClientService.get({ controller: "Developments/delete-task-card" }, id.toString()).toPromise();
  }

  async getAllTaskCards(): Promise<TaskCardDTO[]> {
    return await this.httpClientService.get<TaskCardDTO>({ controller: "Developments/get-all-task-cards" }).toPromise();
  }

  // GetPanelDetails method for fetching all details of a panel by panelId
  async getPanelDetails(panelId: number): Promise<TaskPanelDTO> {
    return await this.httpClientService.get_new<TaskPanelDTO>({ controller: `Developments/get-panel-details/${panelId}` }).toPromise();
  }
}
