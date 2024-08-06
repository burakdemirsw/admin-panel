import { Component, ElementRef, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/admin/order.service';
import { Raport_CR } from '../../models/model/raport/raport_CR';
import { HeaderService } from '../../services/admin/header.service';
import { UserClientInfoResponse } from 'src/app/models/model/user/userRegister_VM';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private headerService: HeaderService, private elementRef: ElementRef, private orderService: OrderService) { }
  data: any;

  options: any;
  raportData: Raport_CR;
  userId: number;
  userName: string
  userinfo: UserClientInfoResponse;
  async ngOnInit() {
    this.headerService.updatePageTitle("Anasayfa")
    this.userId = Number(localStorage.getItem('userId'))
    this.userName = localStorage.getItem('name')

    if (this.userId == 5 || this.userId == 1) {
      await this.saleCountRaport();
    }

    // var s = document.createElement("script");
    // s.type = "text/javascript";
    // s.src = "../assets/js/main.js";
    // this.elementRef.nativeElement.appendChild(s);
  }

  async saleCountRaport() {
    const response: Raport_CR = await this.orderService.getRaports(7);
    this.raportData = response;
    var days: string[] = [];
    var data: number[] = [];
    var _data: number[] = [];
    response.raport_2.forEach(raport => {
      days.push(raport.day)
      data.push(raport.orderCount)
    });


    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data = {
      labels: days,
      datasets: [
        {
          label: 'Satış Adedi',
          data: data,
          fill: true,
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          tension: 0.4
        }
        // {
        //   label: 'Kazanç',
        //   data: _data,
        //   fill: true,
        //   borderColor: documentStyle.getPropertyValue('--orange-500'),
        //   tension: 0.4,
        //   backgroundColor: 'rgba(255,167,38,0.2)'
        // }
      ]
    };

    this.options = {

      maintainAspectRatio: false,
      aspectRatio: 0.5,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };

  }
  async saleRevenueRaport() {
    const response: Raport_CR = await this.orderService.getRaports(0);
    this.raportData = response;
    var days: string[] = [];
    var data: number[] = [];

    // response.raport_2.forEach(raport => {
    //   days.push(raport.day)
    //   data.push(raport.orderCount * 30)
    // });
    response.raport_3.forEach(raport => {
      days.push(raport.day)

      data.push(raport.orderRevenue)
    });

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data = {
      labels: days,
      datasets: [
        {
          label: 'Kazanç',
          data: data,
          fill: true,
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          tension: 0.4
        }
        // {
        //   label: 'Kazanç',
        //   data: _data,
        //   fill: true,
        //   borderColor: documentStyle.getPropertyValue('--orange-500'),
        //   tension: 0.4,
        //   backgroundColor: 'rgba(255,167,38,0.2)'
        // }
      ]
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.5,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };

  }
}
