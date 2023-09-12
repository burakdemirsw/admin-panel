import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertifyService } from 'src/app/services/ui/alertify.service';
import { AuthService } from 'src/app/services/ui/auth.service';

@Component({
  selector: 'app-pages-login',
  templateUrl: './pages-login.component.html',
  styleUrls: ['./pages-login.component.css']
})
export class PagesLoginComponent implements OnInit {
  username: string;
  password: string ;
  errorMessage: string;

  constructor(
    private alertifyService : AlertifyService,
    private router: Router,
    private authService : AuthService

  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.authService.login(this.username,this.password)
    
}
}