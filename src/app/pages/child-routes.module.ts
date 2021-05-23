import { NgModule } from '@angular/core';

import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { ProgressComponent } from '../pages/progress/progress.component';
import { Grafica1Component } from '../pages/grafica1/grafica1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { PerfilComponent } from './perfil/perfil.component';

// Mantenimientos
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
import { HospitalesComponent } from './mantenimientos/hospitales/hospitales.component';
import { MedicosComponent } from './mantenimientos/medicos/medicos.component';
import { MedicoComponent } from './mantenimientos/medicos/medico.component';
import { BusquedasComponent } from './busquedas/busquedas.component';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from '../guards/admin.guard';

const routes:Routes=[
  {
    path: '',
    component: DashboardComponent,
    data: {
      title: 'Dashboard'
    }
  },
  {
    path: 'progress',
    component: ProgressComponent,
    data: {
      title: 'Progress'
    }
  },
  {
    path: 'grafica1',
    component: Grafica1Component,
    data: {
      title: 'Grafica #1'
    }
  },
  {
    path: 'account-settings',
    component: AccountSettingsComponent,
    data: {
      title: 'Account-settings'
    }
  },
  {
    path: 'promesas',
    component: PromesasComponent,
    data: {
      title: 'Promesas'
    }
  },
  {
    path: 'rxjs',
    component: RxjsComponent,
    data: {
      title: 'Rxjs'
    }
  },
  {
    path: 'perfil',
    component: PerfilComponent,
    data: {
      title: 'Perfil'
    }
  },
  {
    path:'buscar/:termino',
    component:BusquedasComponent,
    data:{
      title:'Busquedas'
    }
  },

  // Mantenimentos
  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate:[AdminGuard],
    data: {
      title: 'Usuarios de la aplicacion'
    }
  },
  {
    path: 'hospitales',
    component: HospitalesComponent,
    data: {
      title: 'Hospitales de la aplicacion'
    }
  },
  {
    path: 'medicos',
    component: MedicosComponent,
    data: {
      title: 'Medicos de la aplicacion'
    }
  },
  {
    path: 'medico/:id',
    component: MedicoComponent,
    data: {
      title: 'Perfil médico'
    }
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class ChildRoutesModule { }
