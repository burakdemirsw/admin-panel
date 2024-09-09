import { Component } from "@angular/core";
import {
  DevelopmentTask,
  TaskCardDTO,
  TaskComment,
  TaskControl,
  TaskPriority,
} from "src/app/models/model/development/development";
import { DevelopmentService } from "src/app/services/admin/development.service";
import { moveItemInArray } from "@angular/cdk/drag-drop";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MenuItem } from "primeng/api";
import { UserClientInfoResponse } from "src/app/models/model/user/userRegister_VM";
import { UserService } from "src/app/services/admin/user.service";
import { ToasterService } from "src/app/services/ui/toaster.service";
import { GeneralService } from "src/app/services/admin/general.service";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: "app-task-panel",
  templateUrl: "./task-panel.component.html",
  styleUrl: "./task-panel.component.css",
})
export class TaskPanelComponent {
  items: MenuItem[] | undefined;
  taskPanelId: number;
  userInfo: UserClientInfoResponse;
  taskCards = []; // TaskCard listesi
  selectedTaskCard: any;
  selectedTask: any; // Seçilen task
  displayAddTaskDialog = false; // Dialog'un görünürlüğünü kontrol eder
  addTaskForm: FormGroup;
  cardForm: FormGroup; // Form

  completionOptions = [
    { label: "Pending", value: false },
    { label: "Completed", value: true },
  ];
  displayTaskDetailsDialog = false;
  taskPriorities: TaskPriority[] = []; // DB'den çekilen task önceliklerini burada tutacağız
  _taskPriorities: any[] = []; // DB'den çekilen task önceliklerini burada tutacağız

  newComment: string;
  selectedCard: TaskCardDTO;
  addCardDialog: boolean = false;

  constructor(
    private gs: GeneralService,
    private toasterService: ToasterService,
    private developmentService: DevelopmentService,
    private fb: FormBuilder,
    private userService: UserService,
    private activatedRoute: ActivatedRoute
  ) {
    this.userInfo = this.userService.getUserClientInfoResponse();
    this.items = [
      {
        label: "Yeni Kart Ekle",
        icon: "fa fa-plus",
        command: (event) => (this.addCardDialog = true),
        // command: (event) => this.addCard()
      },
      { label: "Kartın Görevlerini Tamamla", icon: "fa fa-check" },
      { label: "Kartı Sil", icon: "fa fa-trash" },
    ];
    this.addTaskForm = this.fb.group({
      header: [null, Validators.required],
      description: [null, Validators.required],
      taskPriorityId: [null, Validators.required],
    });
    this.cardForm = this.fb.group({
      header: [null, Validators.required], // Header alanı zorunlu
    });
  }

  ngOnInit(): void {
    this.loadTaskCards();
    this.activatedRoute.params.subscribe(p => {
      if (p['id']) {
        this.taskPanelId = Number(p['id'])
      }
    })
  }

  // addTaskControl() {
  //   if (this.newControl.header.trim() !== "") {
  //     this.selectedTask.taskControls.push({ ...this.newControl });
  //     this.newControl = { header: "", description: "", isCompleted: false }; // Reset the new control input
  //     this.showNewControl = false; // Hide the input field
  //   }
  // }

  newControl: string
  async addTaskControl() {
    if (!this.gs.isNullOrEmpty(this.newControl)) {
      var request: TaskControl = new TaskControl();
      request.id = 0;
      request.header = this.newControl;
      request.userId = this.userInfo.userId;
      request.description = null;
      request.developmentTaskId = this.selectedTask.id;
      request.isCompleted = false;
      if (!this.gs.isNullOrEmpty(request.header) && request.userId > 0) {
        var response = await this.developmentService.addTaskControl(request);
        if (response) {
          this.toasterService.success("Eklendi");
          this.newControl = null;
          await this.loadTaskCards();
          this.displayTaskDetailsDialog = false;
          var foundTask = null;
          var foundCard = this.taskCards.find(card => {
            const task = card.developmentTasks.find(task => task.id === this.selectedTask.id);
            if (task) {
              foundTask = task;  // Eşleşen task'i saklıyoruz
              return true; // Eşleşen task'in olduğu kartı döndürmek için true döndürüyoruz
            }
            return false; // Eşleşme yoksa false
          }); this.openTaskDetailsDialog(foundTask)
        } else {
          this.toasterService.error("Hata Alındı");
        }
      } else {
        this.toasterService.error("Hata Alındı");
      }
    } else {
      this.toasterService.error("Hata Alındı");
    }

  }

  async addTaskComment() {
    if (!this.gs.isNullOrEmpty(this.newComment)) {
      var request: TaskComment = new TaskComment();
      request.id = 0;
      request.header = this.userInfo.mail;
      request.userId = this.userInfo.userId;
      request.description = this.newComment;
      request.developmentTaskId = this.selectedTask.id;
      if (!this.gs.isNullOrEmpty(request.header) && request.userId > 0) {
        var response = await this.developmentService.addTaskComment(request);
        if (response) {
          this.toasterService.success("Eklendi");
          this.newComment = null;
          await this.loadTaskCards();
          this.displayTaskDetailsDialog = false;
          var foundTask = null;
          var foundCard = this.taskCards.find(card => {
            const task = card.developmentTasks.find(task => task.id === this.selectedTask.id);
            if (task) {
              foundTask = task;  // Eşleşen task'i saklıyoruz
              return true; // Eşleşen task'in olduğu kartı döndürmek için true döndürüyoruz
            }
            return false; // Eşleşme yoksa false
          }); this.openTaskDetailsDialog(foundTask)
        } else {
          this.toasterService.error("Hata Alındı");
        }
      } else {
        this.toasterService.error("Hata Alındı");
      }
    } else {
      this.toasterService.error("Hata Alındı");
    }

  }
  async addTaskCard() {
    var request: TaskCardDTO = new TaskCardDTO();
    request.id = 0;
    request.header = this.cardForm.value.header;
    request.userId = this.userInfo.userId;
    request.taskPanelId = this.taskPanelId;
    if (!this.gs.isNullOrEmpty(request.header) && request.userId > 0) {
      var response = await this.developmentService.addTaskCard(request);
      if (response) {
        this.toasterService.success("Eklendi");
        this.cardForm.reset();
        this.loadTaskCards();
      } else {
        this.toasterService.error("Hata Alındı");
      }
    } else {
      this.toasterService.error("Hata Alındı");
    }
  }
  // Formu submit ettiğimizde yeni task eklenir
  async addDevolopmentTask() {
    if (this.addTaskForm.valid) {
      var value = this.addTaskForm.value;
      var request: DevelopmentTask = new DevelopmentTask(0, null);
      request.header = value.header;
      request.description = value.description;
      request.isCompleted = false;
      request.developmentId = 1;
      request.userId = this.userInfo.userId;
      request.taskPriorityId = value.taskPriorityId?.code;
      request.taskCardId = this.selectedTaskCard.id;

      if (!this.gs.isNullOrEmpty(request.header) && request.userId > 0) {
        var response = await this.developmentService.addDevelopmentTask(request);
        if (response) {
          this.toasterService.success("Eklendi");
          this.displayAddTaskDialog = false;
          this.addTaskForm.reset();
          this.loadTaskCards();
        } else {
          this.toasterService.error("Hata Alındı");
        }
      } else {
        this.toasterService.error("Hata Alındı");
      }
    } else {
      this.toasterService.error("Hata Alındı");
    }

  }
  async loadTaskCards() {
    try {
      // panelId değerini belirleyin ya da dinamik olarak alın
      const panelId = 1;
      var r = await this.developmentService.getPanelDetails(panelId);
      this.taskCards = r.taskCards;
      console.log(this.taskCards);

      var r2 = await this.developmentService.getAllTaskPriorities();
      this.taskPriorities = r2;

      this._taskPriorities = r2.map((priority: any) => ({
        name: priority.state,
        code: priority.id
      }));
    } catch (error) {
      console.error("Error loading task cards:", error);
    }
  }
  // addComment(task: any) {
  //   if (this.newComment.description) {
  //     task.taskComments.push({
  //       header: "New Comment",
  //       description: this.newComment.description,
  //     });
  //     // Yorum kaydedildikten sonra temizliyoruz
  //     this.newComment = {};
  //   }
  // }
  addTaskToCard(taskCard: TaskCardDTO) {
    // Yeni görev ekleme işlemi
    console.log("Add task to card:", taskCard);
  }

  completeTask(task) {
    task.isCompleted = true;
    console.log("Task marked as completed:", task);
  }
  // Drag and Drop işlemi için yeni metod
  drop(event: any) {
    moveItemInArray(this.taskCards, event.previousIndex, event.currentIndex);
    console.log("Updated TaskCard order:", this.taskCards);
  }

  // Plus butonuna tıklandığında dialog açılır ve ilgili TaskCard seçilir.
  openAddTaskDialog(taskCard) {
    this.selectedTaskCard = taskCard;
    this.displayAddTaskDialog = true;
  }

  // Dialog kapandığında yapılacak işlemler
  onDialogHide() {
    this.addTaskForm.reset(); // Formu sıfırla
  }


  openTaskDetailsDialog(task) {
    this.selectedTask = task;
    this.displayTaskDetailsDialog = true;
  }

  // Görev Tamamlanma Oranı Hesaplama
  getTaskCompletionPercentage(taskControls: any[]): number {
    if (taskControls.length === 0) return 0;
    const completed = taskControls.filter(
      (control) => control.isCompleted
    ).length;
    return Math.round((completed / taskControls.length) * 100);
  }

  // Kontrol Öğesini Güncelle
  toggleTaskControl(control: any) {
    console.log("Control updated:", control);
  }
  newTaskControl: any = {}; // Yeni kontrol eklenecek öğe
  showNewControl: boolean = false;

  // Yeni Kontrol Öğesi Ekleme
  saveTaskControl() {
    if (this.newTaskControl.header) {
      this.selectedTask.taskControls.push({
        header: this.newTaskControl.header,
        description: "",
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


  // Sample methods for additional options (assignment, deadline)
  assignControl() {
    // Logic to assign the task control to a user
  }

  setDeadline() {
    // Logic to set a deadline for the task control
  }
}
