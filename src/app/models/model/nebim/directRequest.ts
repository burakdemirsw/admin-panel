export class DirectRequest {
  request: string;
  controller: string;
  userType: number;

  constructor(request: string, controller: string, userType: number) {
    this.request = request;
    this.controller = controller;
    this.userType = userType;
  }
}
