import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  perfilForm:FormGroup;
  usuario:Usuario;
  imagenSubir:File;

  imgTemp:any='';

  constructor(private formBuilder:FormBuilder,private usuarioService:UsuarioService,
              private fileUploadService:FileUploadService) {
    this.usuario = this.usuarioService.usuario;
  }

  ngOnInit(): void {
    this.perfilForm = this.formBuilder.group({
      nombre:[this.usuario.nombre,[Validators.required]],
      email:[this.usuario.email,[Validators.required,Validators.email]]
    });
  }

  actualizarPerfil(){
    this.usuarioService.actualizarPerfil(this.perfilForm.value)
    .subscribe((resp)=>{
      const {nombre,email}= this.perfilForm.value;
      this.usuario.nombre = nombre;
      this.usuario.email = email;

      Swal.fire('Guardado','Datos actualizados con exito','success');
    },(error)=>{
      Swal.fire('Error',error.error.msg,'error');
    })
  }

  cambiarImagen(file:File){
    this.imagenSubir = file;

    if(!file){return this.imgTemp=null;}

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = ()=>{
      this.imgTemp = reader.result;
    }
  }

  subirImagen(){
    this.fileUploadService.actualizarFoto(this.imagenSubir,'usuarios',this.usuario.uid)
    .then((img)=>{
      this.usuario.img = img;
      Swal.fire('Guardado','Se ha actualizado la imagen','success')
    }).catch((error)=>{
      Swal.fire('Error',error.error.msg,'error');
    });
  }

}
