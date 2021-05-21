import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { ModalImagenService } from '../../services/modal-imagen.service';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  animations:[
    trigger('modalImg',
      [
        transition(':enter',[style({opacity:0}),animate('0.12s ease-out',style({opacity:1}))]),
        transition(':leave',[style({opacity:1}),animate('0.12s ease-in',style({opacity:0}))])
      ]
    )
  ]
})
export class ModalImagenComponent implements OnInit {

  imagenSubir:File;

  imgTemp:any=null;

  constructor(public modalImagenService:ModalImagenService,private fileUploadService:FileUploadService) { }

  ngOnInit(): void {
  }

  cerrarModal(){
    this.imgTemp =null;
    this.modalImagenService.cerrarModal();
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
    const tipo = this.modalImagenService.tipo;
    this.fileUploadService.actualizarFoto(this.imagenSubir,tipo,this.modalImagenService.uid)
    .then((img)=>{
      Swal.fire('Guardado','Se ha actualizado la imagen','success');
      const index = this.modalImagenService.index;
      this.modalImagenService.nuevaImagen.emit({img,index});

      this.modalImagenService.cerrarModal();
    }).catch((error)=>{
      Swal.fire('Error',error.error.msg,'error');
    });
  }
}
