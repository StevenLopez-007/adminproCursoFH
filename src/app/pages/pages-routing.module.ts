import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { ProgressComponent } from '../pages/progress/progress.component';
import { Grafica1Component } from '../pages/grafica1/grafica1.component';
import { PagesComponent } from '../pages/pages.component';

const routes:Routes =[
  {
    path:'dashboard',
    component:PagesComponent,
    children:[
      {
        path:'',
        component:DashboardComponent,
      },
      {
        path:'progress',
        component:ProgressComponent
      },
      {
        path:'grafica1',
        component:Grafica1Component
      },
      {
        path:'',
        redirectTo:'/dashboard',
        pathMatch:'full'
      },
    ]
  },
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class PagesRoutingModule { }
