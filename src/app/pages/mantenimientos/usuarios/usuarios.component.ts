import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';

import { UsuarioService } from '../../../services/usuario.service';
import { BusquedasService } from '../../../services/busquedas.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';

import { Usuario } from '../../../models/usuario.model';
import Swal from 'sweetalert2';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
})
export class UsuariosComponent implements OnInit,AfterViewInit,OnDestroy {

  totalUsuarios: number = 0;
  usuarios: Usuario[] = [];
  usuariosTemp: Usuario[] = [];
  buscando:boolean=false;
  desde: number = 0;
  cargando:boolean = true;

  imgSubs:Subscription;

  @ViewChild('txtTermino',{read:ElementRef}) inputBuscar:ElementRef;
  constructor(public usuarioService: UsuarioService,private busquedasService:BusquedasService,
              private modalImagenService:ModalImagenService) { }

  ngOnInit(): void {
    this.cargarUsuarios();

  }

  ngAfterViewInit(){
    this.buscar();
    this.imgSubs = this.modalImagenService.nuevaImagen.subscribe((resp:any)=>this.usuarios[resp.index].img = resp.img);
  }

  ngOnDestroy(){
    this.imgSubs.unsubscribe();
  }

  cargarUsuarios(){
    this.cargando =true;
    this.usuarioService.cargarUsuarios(this.desde)
      .subscribe(({ total, usuarios }) => {
        this.totalUsuarios = total;
        this.usuarios = usuarios;
        this.usuariosTemp= usuarios;
        this.cargando=false;
      })
  }

  cambiarPagina(valor: number) {
    // const resto = this.totalUsuarios % 5;
    // if ((this.desde === this.totalUsuarios) && resto != 0 && valor < 0) {
    //   this.desde = this.desde - resto;
    //   return this.cargarUsuarios();
    // }
    this.desde += valor;
    // if(this.desde === this.totalUsuarios){
    //   return this.desde -= 5;
    // }
    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde > this.totalUsuarios) {
      // const dif = this.desde - this.totalUsuarios;
      this.desde -= valor;
      return;
    }
    this.cargarUsuarios();
  }

  buscar(){
    this.busquedasService.inputBuscar(this.inputBuscar).subscribe((termino)=>{
      this.buscando=true;
      if(termino.length ===0){
        this.buscando=false;
        return this.usuarios = this.usuariosTemp;
      }
      this.busquedasService.buscar('usuarios',termino)
      .subscribe((resultados)=>{
        this.usuarios = resultados;
      })
    });
  }

  eliminarUsuario(usuario:Usuario,index:number){

    if(usuario.uid != this.usuarioService.uid){
      Swal.fire({
        title: `¿Desea eliminar el usuario "${usuario.nombre}"?`,
        icon:'question',
        showCancelButton: true,
        cancelButtonColor:'#ef5350 ',
        cancelButtonText:'No, cancelar',
        confirmButtonText: `Sí, eliminar`
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.usuarioService.eliminarUsuario(usuario)
          .subscribe(()=>{
            this.usuarios.splice(index,1);
            Swal.fire('Usuario eliminado', '', 'success');
          },()=>{
            Swal.fire('Error', 'No se pudo eliminar el usuario', 'error')
          })
        }
      })
    }
  }

  cambiarRole(usuario:Usuario,index:string,selectValue:any){
    const role = selectValue.value;
    if(!['ADMIN_ROLE','USER_ROLE'].includes(role)){
      return Swal.fire('Error', 'No se pudo cambiar el rol del usuario', 'error');
    }
    this.usuarioService.guardarUsuario(usuario)
    .subscribe(()=>{
      this.usuarios[index].role = role;
    },()=>{
      Swal.fire('Error', 'No se pudo cambiar el rol del usuario', 'error');
      this.usuarios[index].role = role=='ADMIN_ROLE'?'USER_ROLE':'ADMIN_ROLE'      ;
    })
  }

  abrirModal(usuario:Usuario,index:number){
    this.modalImagenService.abrirModal('usuarios',usuario.uid,usuario.img,index);
  }

}
