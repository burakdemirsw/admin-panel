export class BaseEntity {
  id: number;
  createdDate: Date;
  updatedDate: Date;

  constructor(id: number, createdDate: Date, updatedDate: Date = new Date()) {
    this.id = id;
    this.createdDate = createdDate;
    this.updatedDate = updatedDate;
  }
}
