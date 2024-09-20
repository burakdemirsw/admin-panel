import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(@Inject(DOCUMENT) private document, private elementRef: ElementRef, public _router: Router, private primengConfig: PrimeNGConfig) {
    this.primengConfig.setTranslation({
      startsWith: 'İle başlayan',
      contains: 'İçeren',
      notContains: 'İçermeyen',
      endsWith: 'İle biten',
      equals: 'Eşittir',
      notEquals: 'Eşit değil',
      noFilter: 'Filtre yok',
      lt: 'Küçüktür',
      lte: 'Küçük veya eşittir',
      gt: 'Büyüktür',
      gte: 'Büyük veya eşittir',
      is: 'Eşittir',
      isNot: 'Eşit değil',
      before: 'Öncesi',
      after: 'Sonrası',
      dateIs: 'Tarih Eşittir',
      dateIsNot: 'Tarih Eşit Değil',
      dateBefore: 'Tarih Öncesi',
      dateAfter: 'Tarih Sonrası',
      clear: 'Temizle',
      apply: 'Uygula',
      matchAll: 'Hepsi Eşleşen',
      matchAny: 'Herhangi Eşleşen',
      addRule: 'Kural Ekle',
      removeRule: 'Kural Kaldır',
      accept: 'Kabul Et',
      reject: 'Reddet',
      choose: 'Seç',
      upload: 'Yükle',
      cancel: 'İptal',
      fileSizeTypes: ['Dosya Boyutları'],
      dayNames: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
      dayNamesShort: ['Paz', 'Pts', 'Sal', 'Çar', 'Per', 'Cum', 'Cts'],
      dayNamesMin: ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'],
      monthNames: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
      monthNamesShort: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
      dateFormat: 'dd/mm/yy',
      firstDayOfWeek: 1,
      today: 'Bugün',
      weekHeader: 'Hafta',
      weak: 'Zayıf',
      medium: 'Orta',
      strong: 'Güçlü',
      passwordPrompt: 'Parolanızı girin',
      emptyMessage: 'Kayıt bulunamadı',
      emptyFilterMessage: 'Sonuç bulunamadı',
      pending: 'Beklemede',
      chooseYear: 'Yıl Seç',
      chooseMonth: 'Ay Seç',
      chooseDate: 'Tarih Seç',
      prevDecade: 'Önceki On Yıl',
      nextDecade: 'Sonraki On Yıl',
      prevYear: 'Önceki Yıl',
      nextYear: 'Sonraki Yıl',
      prevMonth: 'Önceki Ay',
      nextMonth: 'Sonraki Ay',
      prevHour: 'Önceki Saat',
      nextHour: 'Sonraki Saat',
      prevMinute: 'Önceki Dakika',
      nextMinute: 'Sonraki Dakika',
      prevSecond: 'Önceki Saniye',
      nextSecond: 'Sonraki Saniye',
      am: 'ÖÖ',
      pm: 'ÖS',
      searchMessage: 'Mesaj Ara',
      selectionMessage: 'Seçim Mesajı',
      emptySelectionMessage: 'Seçim yapılmadı',
      emptySearchMessage: 'Arama sonucu bulunamadı',

    });



    const bodyClassList = this.document.body.classList;
    const isMobile = window.innerWidth <= 768;
    this._router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (!bodyClassList.contains('toggle-sidebar')) {
        this.sidebarToggle();
      }
      if (isMobile) {
        if (bodyClassList.contains('toggle-sidebar')) {
          this.sidebarToggle();
        }
      }

      // Burada istediğiniz işlemi yapabilirsiniz
    });
  }




  sidebarToggle() {
    //toggle sidebar function
    this.document.body.classList.toggle('toggle-sidebar');
  }
  ngOnInit() {
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "../assets/js/main.js";
    console.clear();

  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const sidebar = document.getElementById('sidebar');
    const header = document.getElementById('header');
    const bodyClassList = this.document.body.classList;
    const isMobile = window.innerWidth <= 768;
    if ((sidebar && !sidebar.contains(event.target as Node)) && (header && !header.contains(event.target as Node))) {
      //   console.log('algılandı(3)');
      if (bodyClassList.contains('toggle-sidebar')) {
        bodyClassList.remove('toggle-sidebar');
      }
      if (!isMobile) {
        if (!bodyClassList.contains('toggle-sidebar')) {
          // console.log('Pc de Farklı Yere Tıklandığı için Sidebar Kapandı');
          bodyClassList.add('toggle-sidebar');
        }
      }
    }
  }
}
