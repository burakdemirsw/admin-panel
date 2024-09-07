import { BaseEntity } from "../../entity/baseEntity";

export class Development extends BaseEntity {
  zone: string;

  constructor(zone: string) {
    super(0, new Date(), new Date());
    this.zone = zone;
  }
}

export class Development_RM {
  isCompleted: boolean;
  developmentId: number;
}
export class DevelopmentTask extends BaseEntity {
  developmentId: number;
  description?: string;
  isCompleted: boolean;
  finishedDate: Date;
  header: string;

  constructor(description: string, isCompleted: boolean, finishedDate: Date,
    id: number, createdDate: Date, updatedDate: Date, header: string, developmentId: number) {
    super(id, createdDate, updatedDate);
    this.developmentId = developmentId;
    this.description = description;
    this.isCompleted = isCompleted;
    this.finishedDate = finishedDate;
    this.header = header;
  }



}
export class DevelopmentTask_VM {
  id: number;
  createdDate: Date | null;
  zone: string;
  developmentId: number;
  description?: string;
  header: string;
  isCompleted: boolean;
  finishedDate: Date;
}

export class Development_Raport {
  dailyLooked: number;
  weeklyCompletedCount: number;
  dailyCreatedCount: number
  unfinishedCount: number;
}
export class TaskPriority {
  id: number;
  state: string;
  order: number;
  createdDate: Date | null;
  updatedDate: Date | null;


}
export class TaskControl {
  id: number;
  developmentTaskId: number;
  description: string | null;
  header: string | null;
  isCompleted: boolean | null;
  userId: number;
  createdDate: Date | null;
  updatedDate: Date | null;

}

export class TaskComment {
  id: number;
  developmentTaskId: number;
  header: string | null;
  description: string | null;
  userId: number;
  createdDate: Date | null;
  updatedDate: Date | null;


}
export class TaskPanel {
  id: number;
  finishedDate: Date | null;
  userId: number;
  createdDate: Date | null;
  updatedDate: Date | null;


}


export class TaskPanelDTO {
  id: number;
  finishedDate?: Date;
  taskCards: TaskCardDTO[];
}

export class TaskCardDTO {
  id: number;
  finishedDate?: Date;
  developmentTasks: DevelopmentTaskDTO[];
}

export class DevelopmentTaskDTO {
  id: number;
  header: string;
  description: string;
  isCompleted: boolean;
  finishedDate?: Date;
  taskPriority: TaskPriorityDTO;
  taskComments: TaskCommentDTO[];
  taskControls: TaskControlDTO[];
}

export class TaskPriorityDTO {
  id: number;
  state: string;
  order: number;
}

export class TaskCommentDTO {
  id: number;
  header: string;
  description: string;
}

export class TaskControlDTO {
  id: number;
  header: string;
  description: string;
  isCompleted?: boolean;
}


