import { Component } from '@angular/core';
import { TaskCardDTO, TaskPriority } from 'src/app/models/model/development/development';
import { DevelopmentService } from 'src/app/services/admin/development.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({

  selector: 'app-task-panel',
  templateUrl: './task-panel.component.html',
  styleUrl: './task-panel.component.css'
})
export class TaskPanelComponent {
  constructor(private developmentService: DevelopmentService, private fb: FormBuilder) {

    this.addTaskForm = this.fb.group({
      header: ['', Validators.required],
      description: ['', Validators.required],
      isCompleted: [false]
    });


  }
  taskCards = [];  // TaskCard listesi
  selectedTaskCard: any;
  displayAddTaskDialog = false;  // Dialog'un görünürlüğünü kontrol eder
  addTaskForm: FormGroup;
  completionOptions = [{ label: 'Pending', value: false }, { label: 'Completed', value: true }];
  displayTaskDetailsDialog = false;
  taskPriorities: TaskPriority[] = []; // DB'den çekilen task önceliklerini burada tutacağız
  selectedTask: any; // Seçilen task
  newComment: any = {}; // Yeni yorum
  ngOnInit(): void {
    this.loadTaskCards();
  }

  async loadTaskCards() {
    try {
      // panelId değerini belirleyin ya da dinamik olarak alın
      const panelId = 1;
      var r = await this.developmentService.getPanelDetails(panelId);
      this.taskCards = r.taskCards;
      console.log(this.taskCards);

      var r2 = await this.developmentService.getAllTaskPriorities()
      this.taskPriorities = r2;

    } catch (error) {
      console.error('Error loading task cards:', error);
    }
  }
  addComment(task: any) {
    if (this.newComment.description) {
      task.taskComments.push({
        header: 'New Comment',
        description: this.newComment.description,
      });
      // Yorum kaydedildikten sonra temizliyoruz
      this.newComment = {};
    }
  }
  addTaskToCard(taskCard: TaskCardDTO) {
    // Yeni görev ekleme işlemi
    console.log('Add task to card:', taskCard);
  }

  completeTask(task) {
    task.isCompleted = true;
    console.log('Task marked as completed:', task);
  }
  // Drag and Drop işlemi için yeni metod
  drop(event: any) {
    moveItemInArray(this.taskCards, event.previousIndex, event.currentIndex);
    console.log('Updated TaskCard order:', this.taskCards);
  }

  // Plus butonuna tıklandığında dialog açılır ve ilgili TaskCard seçilir.
  openAddTaskDialog(taskCard) {
    this.selectedTaskCard = taskCard;
    this.displayAddTaskDialog = true;
  }

  // Dialog kapandığında yapılacak işlemler
  onDialogHide() {
    this.addTaskForm.reset();  // Formu sıfırla
  }

  // Formu submit ettiğimizde yeni task eklenir
  onSubmitTaskForm() {
    if (this.addTaskForm.valid) {
      const newTask = this.addTaskForm.value;
      this.selectedTaskCard.developmentTasks.push(newTask);  // Task'ı mevcut karta ekle
      this.displayAddTaskDialog = false;  // Dialogu kapat
      this.addTaskForm.reset();  // Formu sıfırla
    }
  }
  openTaskDetailsDialog(task) {
    this.selectedTask = task;
    this.displayTaskDetailsDialog = true;
  }



  // Görev Tamamlanma Oranı Hesaplama
  getTaskCompletionPercentage(taskControls: any[]): number {
    if (taskControls.length === 0) return 0;
    const completed = taskControls.filter(control => control.isCompleted).length;
    return Math.round((completed / taskControls.length) * 100);
  }

  // Kontrol Öğesini Güncelle
  toggleTaskControl(control: any) {
    console.log('Control updated:', control);
  }
  newTaskControl: any = {}; // Yeni kontrol eklenecek öğe
  showNewControl: boolean = false;
  newControl = { header: '', description: '', isCompleted: false };
  // Yeni Kontrol Öğesi Ekleme
  saveTaskControl() {
    if (this.newTaskControl.header) {
      this.selectedTask.taskControls.push({
        header: this.newTaskControl.header,
        description: '',
        isCompleted: false,
      });
      this.newTaskControl = {}; // Input alanını sıfırla
    }
  }

  // Yeni Kontrol Öğesi Ekleme İşlemini İptal Etme
  cancelNewTaskControl() {
    this.newTaskControl = {}; // Input alanını sıfırla
  }

  // Kontrol Öğesi Silme
  removeTaskControl(control: any) {
    const index = this.selectedTask.taskControls.indexOf(control);
    if (index > -1) {
      this.selectedTask.taskControls.splice(index, 1);
    }
  }
  addTaskControl() {
    if (this.newControl.header.trim() !== '') {
      this.selectedTask.taskControls.push({ ...this.newControl });
      this.newControl = { header: '', description: '', isCompleted: false }; // Reset the new control input
      this.showNewControl = false; // Hide the input field
    }
  }


  // Sample methods for additional options (assignment, deadline)
  assignControl() {
    // Logic to assign the task control to a user
  }

  setDeadline() {
    // Logic to set a deadline for the task control
  }
}
