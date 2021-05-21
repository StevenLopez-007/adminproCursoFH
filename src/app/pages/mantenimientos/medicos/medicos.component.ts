import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Medico } from 'src/app/models/medico.mode';
import { MedicoService } from '../../../services/medico.service';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { Subscription } from 'rxjs';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit,OnDestroy,AfterViewInit {

  medicos:Medico[]=[];
  medicosTemp:Medico[]=[];

  imgSubs:Subscription;

  cargando:boolean = true;

  @ViewChild('txtTermino',{read:ElementRef}) inputBuscar:ElementRef;
  constructor(private medicoService:MedicoService, private modalImagenService:ModalImagenService,
              private busquedasService:BusquedasService) { }

  ngOnInit(): void {
    this.cargarMedicos();
    this.imgSubs = this.modalImagenService.nuevaImagen.subscribe((resp:any)=>{
      this.medicos[resp.index].img = resp.img;
    });
  }

  ngAfterViewInit(){
    this.buscar();
  }

  ngOnDestroy(){
    this.imgSubs.unsubscribe();
  }

  cargarMedicos(){
    this.cargando=true;
    this.medicoService.cargarMedicos()
    .subscribe((medicos:Medico[])=>{
      this.medicos = medicos;
      this.medicosTemp = medicos;
      this.cargando=false;
    },()=>{
      this.cargando=false;
      Swal.fire('Error','No se pudo cargar los medicos','error');
    })
  }

  actualizarFoto(medico:Medico,index:number){
    this.modalImagenService.abrirModal('medicos',medico._id,medico.img,index)
  }

  eliminarMedico(medico:Medico,index:number){
    Swal.fire({
      title: `¿Desea eliminar el medico "${medico.nombre}"?`,
      icon:'question',
      showCancelButton: true,
      cancelButtonColor:'#ef5350 ',
      confirmButtonText: `Sí, eliminar`,
      cancelButtonText:'No, cancelar'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.medicoService.eliminarMedico(medico._id)
        .subscribe(()=>{
          this.medicos.splice(index,1);
          Swal.fire('Medico eliminado', '', 'success');
        },()=>{
          Swal.fire('Error', 'No se pudo eliminar el medico', 'error')
        })
      }
    })

}

  buscar(){
    this.busquedasService.inputBuscar(this.inputBuscar).subscribe((termino)=>{
      if(termino.length ===0){
        return this.medicos = this.medicosTemp;
      }
      this.busquedasService.buscar('medicos',termino)
      .subscribe((resultados)=>{
        this.medicos = resultados;
      })
    });
  }

}
