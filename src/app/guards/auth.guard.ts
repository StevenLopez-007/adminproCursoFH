import { Injectable } from '@angular/core';
import {CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UsuarioService } from '../services/usuario.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(private usuarioService:UsuarioService,private router:Router){}
  canLoad(): Observable<boolean> {
    return this.usuarioService.validarToken()
    .pipe(
      tap((estaAutenticado)=>{
        if(!estaAutenticado){
          this.router.navigateByUrl('/login')
        }
      })
    );
  }

}
