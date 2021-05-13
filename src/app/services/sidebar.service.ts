import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any[] = [
    {
      title: 'Dashboard',
      icon: 'mdi mdi-gauge',
      submenu: [
        { title: 'Dashboard', url: '/' },
        { title: 'ProgressBar', url: 'progress' },
        { title: 'Grafica', url: 'grafica1' },
      ]
    }
  ];

  constructor() { }
}
