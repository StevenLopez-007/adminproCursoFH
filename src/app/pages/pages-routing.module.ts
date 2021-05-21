import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { ProgressComponent } from '../pages/progress/progress.component';
import { Grafica1Component } from '../pages/grafica1/grafica1.component';
import { PagesComponent } from '../pages/pages.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { AuthGuard } from '../guards/auth.guard';
import { PerfilComponent } from './perfil/perfil.component';

// Mantenimientos
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
import { HospitalesComponent } from './mantenimientos/hospitales/hospitales.component';
import { MedicosComponent } from './mantenimientos/medicos/medicos.component';
import { HospitalesResolver } from '../resolvers/hospitales.resolver';
import { MedicoComponent } from './mantenimientos/medicos/medico.component';

const routes:Routes =[
  {
    path:'dashboard',
    component:PagesComponent,
    canActivate:[AuthGuard],
    children:[
      {
        path:'',
        component:DashboardComponent,
        data:{
          title:'Dashboard'
        }
      },
      {
        path:'progress',
        component:ProgressComponent,
        data:{
          title:'Progress'
        }
      },
      {
        path:'grafica1',
        component:Grafica1Component,
        data:{
          title:'Grafica #1'
        }
      },
      {
        path:'account-settings',
        component:AccountSettingsComponent,
        data:{
          title:'Account-settings'
        }
      },
      {
        path:'promesas',
        component:PromesasComponent,
        data:{
          title:'Promesas'
        }
      },
      {
        path:'rxjs',
        component:RxjsComponent,
        data:{
          title:'Rxjs'
        }
      },
      {
        path:'perfil',
        component:PerfilComponent,
        data:{
          title:'Perfil'
        }
      },

      // Mantenimentos
      {
        path:'usuarios',
        component:UsuariosComponent,
        data:{
          title:'Usuarios de la aplicacion'
        }
      },
      {
        path:'hospitales',
        component:HospitalesComponent,
        data:{
          title:'Hospitales de la aplicacion'
        }
      },
      {
        path:'medicos',
        component:MedicosComponent,
        data:{
          title:'Medicos de la aplicacion'
        }
      },
      {
        path:'medico/:id',
        component:MedicoComponent,
        data:{
          title:'Perfil médico'
        }
      },
      {
        path:'',
        redirectTo:'/dashboard',
        pathMatch:'full'
      }
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
