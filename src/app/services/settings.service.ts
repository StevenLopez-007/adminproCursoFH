import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService implements OnInit {
  private themes: string[] = [
    'default',
    'green',
    'red',
    'blue',
    'purple',
    'megna',
    'default-dark',
    'green-dark',
    'red-dark',
    'blue-dark',
    'purple-dark',
    'megna-dark'
  ]

  private linkTheme:Element =document.querySelector('#theme');
  private links:NodeListOf<Element>;
  constructor() { }

  ngOnInit(){

  }

  setCurrentTheme(){
    const theme = localStorage.getItem('theme') || 'default-dark';
    this.linkTheme.setAttribute('href',`./assets/css/colors/${theme}.css`)

    if (this.themes.includes(theme.trim().toLowerCase())) {
      this.linkTheme.setAttribute('href', `./assets/css/colors/${theme}.css`);
      localStorage.setItem('theme', theme)
    } else {
      this.linkTheme.setAttribute('href', './assets/css/colors/default-dark.css');
      localStorage.setItem('theme', 'default-dark')
    }
  }

  changeTheme(theme:string){
    this.linkTheme.setAttribute('href',`./assets/css/colors/${theme}.css`)
    localStorage.setItem('theme',theme);

    this.checkCurrentTheme();
  }

  checkCurrentTheme(){
    this.links = document.querySelectorAll('.selector');
    const theme = localStorage.getItem('theme');
    this.links.forEach((item)=>{
      item.classList.remove('working');

      const btnTheme = item.getAttribute('data-theme');
      if(btnTheme === theme){
        item.classList.add('working');
      }
    });
  }
}
