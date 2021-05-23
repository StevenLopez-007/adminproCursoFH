import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { BusquedasService } from '../../services/busquedas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements AfterViewInit{

  usuario:Usuario;

  @ViewChild('txtTermino',{read:ElementRef}) inputBuscar:ElementRef;
  constructor(private usuarioService:UsuarioService,private router:Router) {
    this.usuario = usuarioService.usuario;
   }

   ngAfterViewInit(){
   }

  logout(){
    this.usuarioService.logout();
  }

  buscar(termino:string){
    if(termino.length>0){
      this.router.navigate(['/dashboard','buscar',termino]);
    }
  }

}
