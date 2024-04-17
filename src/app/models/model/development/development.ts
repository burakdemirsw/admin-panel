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
