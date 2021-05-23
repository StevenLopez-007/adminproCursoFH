import { NgModule } from '@angular/core';
import { PagesComponent } from '../pages/pages.component';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    component: PagesComponent,
    // canActivate: [AuthGuard],
    canLoad:[AuthGuard],
    loadChildren:()=>import('./child-routes.module').then(m=>m.ChildRoutesModule)
  },
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class PagesRoutingModule { }
