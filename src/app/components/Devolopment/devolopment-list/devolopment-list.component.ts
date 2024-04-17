import { Component, OnInit } from '@angular/core';
import { Development, DevelopmentTask, DevelopmentTask_VM, Development_RM, Development_Raport } from 'src/app/models/model/development/development';
import { DevelopmentService } from 'src/app/services/admin/development.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HeaderService } from '../../../services/admin/header.service';

@Component({
  selector: 'app-devolopment-list',
  templateUrl: './devolopment-list.component.html',
  styleUrls: ['./devolopment-list.component.css']
})
export class DevolopmentListComponent implements OnInit {

  tasks: DevelopmentTask_VM[] = []
  devolopments: Development[] = []
  visible: boolean = false;
  visible2: boolean = false;
  addZoneVisible: boolean = false;
  addTaskVisible: boolean = false;
  zone: string = ""
  updateTask_Header: string = ""
  selectedTask: DevelopmentTask_VM = new DevelopmentTask_VM();
  description: string;
  currentPage = 0
  isCompleted: boolean = false;
  developmentId: number = 0;
  searchTaskForm: FormGroup;
  optionList: any = [{ value: true, label: "Tamamlananlar" }, { value: false, label: "Tamamlanmayanlar" }];

  constructor(private HeaderService: HeaderService, private formBuilder: FormBuilder, private toasterService: ToasterService, private developmentService: DevelopmentService) { }
  raport: Development_Raport;
  ngOnInit(): void {

    this.HeaderService.updatePageTitle("İstek Yönetimi")
    this.createSearchTaskForm();
    this.getAllZones();
    this.getAllDevelopments(this.searchTaskForm.value.searchTask_IsCompleted, this.searchTaskForm.value.searchTask_DevelopmentId);
    ;
  }
  async getDevelopmentRaport() {

    this.raport = await this.developmentService.getDevelopmentRaport();
  }
  createSearchTaskForm() {

    this.searchTaskForm = this.formBuilder.group({
      searchTask_IsCompleted: [false],
      searchTask_DevelopmentId: [0]
    })
  }

  async getAllDevelopments(isCompleted: any, developmentId: number) {
    if (isCompleted == 'true') {
      isCompleted = true;
    } else {
      isCompleted = false;
    }
    var request: Development_RM = new Development_RM();
    request.isCompleted = isCompleted;
    this.searchTaskForm.get('searchTask_IsCompleted').setValue(isCompleted);
    request.developmentId = Number(developmentId);
    this.searchTaskForm.get('searchTask_DevelopmentId').setValue(developmentId);
    await this.developmentService.getAllDevelopmentTasks(request).then((response) => {
      if (response.length == 0 || !response) { this.toasterService.error("Görev Bulunamadı") } else {
        this.tasks = response
      }


    })
    this.getDevelopmentRaport();
  }

  openModal(task: DevelopmentTask_VM) {
    this.selectedTask = task;
    this.description = task.description;
    this.updateTask_Header = task.header;
    this.visible = true;
  }
  updateTaskDescription() {


    var request: DevelopmentTask = new DevelopmentTask(this.description, this.selectedTask.isCompleted, this.selectedTask.finishedDate
      , this.selectedTask.id, this.selectedTask.createdDate, new Date(), this.updateTask_Header.toUpperCase(), this.selectedTask.developmentId)
    this.developmentService.updateDevelopmentTask(request).then((response) => {
      this.getAllDevelopments(this.searchTaskForm.get('searchTask_IsCompleted').value, this.searchTaskForm.get('searchTask_DevelopmentId').value);
      this.visible = false;
      this.description = ""
      this.updateTask_Header = ""
      this.toasterService.success("Görev Başarıyla Güncellendi")

    })

  }
  async updateTaskStatus(task: DevelopmentTask_VM, status: boolean) {


    if (window.confirm("Görevi güncellemek istediğinize emin misiniz?")) {
      var request: DevelopmentTask = new DevelopmentTask(task.description, status, task.finishedDate, task.id, task.createdDate, new Date(), task.header,
        task.developmentId)
      await this.developmentService.updateDevelopmentTask(request).then((response) => {
        this.getAllDevelopments(this.searchTaskForm.get('searchTask_IsCompleted').value, this.searchTaskForm.get('searchTask_DevelopmentId').value);
        this.toasterService.success("Görev Başarıyla Güncellendi")
      })
    }


  }


  async deleteTask(task: DevelopmentTask_VM) {


    if (window.confirm("Silmek istediğinize emin misiniz?")) {
      await this.developmentService.deleteDevelopmentTask(task.id).then((response) => {
        this.getAllDevelopments(this.searchTaskForm.value.searchTask_IsCompleted, this.searchTaskForm.value.searchTask_DevelopmentId);
        ;
        this.toasterService.success("Görev Başarıyla Silindi")
      })
    }


  }




  async addZone() {

    await this.developmentService.addDevelopment(new Development(this.zone)).then((response) => {
      this.getAllDevelopments(this.searchTaskForm.value.searchTask_IsCompleted, this.searchTaskForm.value.searchTask_DevelopmentId);
      ;
      this.getAllZones();
      this.toasterService.success("Bölge Başarıyla Eklendi")
      this.addZoneVisible = false;
      this.zone = ""
    })

  }


  async getAllZones() {
    await this.developmentService.getAllDevelopments().then((response) => {
      this.devolopments = response
    })
    //asdas
  }

  addTask_Zone: number = 0;
  addTask_Description: string = ""
  addTask_Header: string = ""

  async addTask() {

    var request: DevelopmentTask = new DevelopmentTask(this.addTask_Description, false, new Date(), 0, new Date(), new Date(), this.addTask_Header,
      this.addTask_Zone)
    await this.developmentService.addDevelopmentTask(request).then((response) => {
      this.getAllDevelopments(this.searchTaskForm.value.searchTask_IsCompleted, this.searchTaskForm.value.searchTask_DevelopmentId);
      ;
      this.toasterService.success("Görev Başarıyla Eklendi")
      this.addTaskVisible = false;
      this.addTask_Description = ""
      this.addTask_Header = ""
    })
  }

}
