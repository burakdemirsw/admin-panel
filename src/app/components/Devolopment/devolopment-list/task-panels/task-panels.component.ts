import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TaskPanel } from 'src/app/models/model/development/development';
import { DevelopmentService } from 'src/app/services/admin/development.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';

@Component({

  selector: 'app-task-panels',
  templateUrl: './task-panels.component.html',
  styleUrl: './task-panels.component.css'
})
export class TaskPanelsComponent {
  taskPanels: TaskPanel[] = [];   // Panel verilerini tutacak dizi
  addPanelDialogVisible: boolean = false;  // Dialog'un görünürlüğünü kontrol eden değişken
  newTaskPanel: TaskPanel = new TaskPanel();  // Yeni panel için boş model

  constructor(private router: Router, private developmentService: DevelopmentService, private toasterService: ToasterService) { }
  selectedPanels: any = {};


  ngOnInit(): void {
    this.loadTaskPanels();  // Panelleri yükle
  }

  // Tüm panelleri yükleyen fonksiyon
  async loadTaskPanels() {
    try {
      this.taskPanels = await this.developmentService.getAllTaskPanels();
    } catch (error) {
      this.toasterService.error("Paneller yüklenirken bir hata oluştu.");
    }
  }

  // Yeni panel ekleme dialog'unu açan fonksiyon
  showAddPanelDialog() {
    this.addPanelDialogVisible = true;
    this.newTaskPanel = new TaskPanel();  // Yeni panel için boş bir model oluştur
  }

  // Yeni panel ekleyen fonksiyon
  async addTaskPanel() {
    try {
      this.newTaskPanel.userId = Number(localStorage.getItem('userId'));
      await this.developmentService.addTaskPanel(this.newTaskPanel);
      this.addPanelDialogVisible = false;  // Dialog'u kapat
      this.loadTaskPanels();  // Panelleri tekrar yükle
      this.toasterService.success('Yeni panel başarıyla eklendi.');
    } catch (error) {
      this.toasterService.error('Panel eklenirken bir hata oluştu.');
    }
  }

  // Paneli silen fonksiyon
  async deleteTaskPanel(id: number) {
    try {
      if (window.confirm("Silmek İstediğinize Emin Misiniz?")) {
        await this.developmentService.deleteTaskPanel(id);
        this.loadTaskPanels();  // Panelleri tekrar yükle
        this.toasterService.success('Panel başarıyla silindi.');
      }
    } catch (error) {
      this.toasterService.error('Panel silinirken bir hata oluştu.');
    }
  }

  // Panel sayfasına gitme fonksiyonu (Örnek bir yönlendirme)
  goToPanel(id: number) {

    this.router.navigate(['/task/panel/', id]);
  }
}