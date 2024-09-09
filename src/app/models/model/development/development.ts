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
  taskPriorityId: number;
  taskCardId: number;
  userId: number;

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
export class TaskCard {
  id: number;
  developmentTasks: DevelopmentTask[] | null;
  taskPanel
  userId: number;
  user: any
  finishedDate: Date | null;
  createdDate: Date | null;
  updatedDate: Date | null;


}

export class DevelopmentTaskDTO {
  id: number;
  header: string;
  description: string;
  isCompleted: boolean;
  user: UserDTO;
  development: DevelopmentDTO;
  taskPriority: TaskPriorityDTO;
  taskComments: TaskCommentDTO[];
  taskControls: TaskControlDTO[];
  finishedDate?: Date;
  createdDate?: Date;
  updatedDate?: Date;
}

export class UserDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  photoUrl?: string;
  createdDate?: Date;
}
export class DevelopmentDTO {
  id: number;
  zone?: string;
  createdDate?: Date;
  updatedDate?: Date;
}

export class TaskPanelDTO {
  id: number;
  userId: number;
  taskCards: TaskCardDTO[];
  finishedDate?: Date;
  createdDate?: Date;
  updatedDate?: Date;
}
export class TaskCardDTO {
  id: number;
  header?: string; // Optional property
  taskPanelId: number;
  userId: number;
  finishedDate?: Date;
  createdDate?: Date;
  updatedDate?: Date;
  developmentTasks: DevelopmentTaskDTO[];
}
export class TaskPriorityDTO {
  id: number;
  state: string;
  order: number;
  createdDate?: Date;
  updatedDate?: Date;
}

export class TaskCommentDTO {
  id: number;
  header?: string;
  description?: string;
  developmentTaskId: number;
  userId: number;
  createdDate?: Date;
  updatedDate?: Date;
}

export class TaskControlDTO {
  id: number;
  description?: string;
  header?: string;
  isCompleted?: boolean;
  developmentTaskId: number;
  userId: number;
  finishedDate?: Date;
  createdDate?: Date;
  updatedDate?: Date;
}
