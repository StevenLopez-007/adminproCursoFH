import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from '../../../models/hospital.model';
import Swal from 'sweetalert2';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { Subscription } from 'rxjs';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit,OnDestroy,AfterViewInit {

  hospitales:Hospital[] =[];
  hospitalesTemp:Hospital[] =[];
  cargando:boolean=true;

  imgSubs:Subscription;

  @ViewChild('txtTermino',{read:ElementRef}) inputBuscar:ElementRef;
  constructor(private hospitalService:HospitalService,private modalImagenService:ModalImagenService,
              private busquedasService:BusquedasService) { }

  ngOnInit(): void {
    this.cargarHospitales();
    this.imgSubs = this.modalImagenService.nuevaImagen.subscribe((resp:any)=>{
      this.hospitales[resp.index].img = resp.img;
    });

  }

  ngOnDestroy(){
    this.imgSubs.unsubscribe();
  }

  ngAfterViewInit(){
    this.buscar();
  }

  cargarHospitales(){
    this.cargando=true;
    this.hospitalService.cargarHospitales().subscribe((hospitales)=>{
      this.hospitales = hospitales;
      this.hospitalesTemp = hospitales;
      this.cargando=false;
    });
  }

  actualizarHospital(hospital:Hospital){

    this.hospitalService.actualizarHospital(hospital._id,hospital.nombre)
    .subscribe(()=>{
      Swal.fire('Actualizado',`El nombre del hospital se actualizó a ${hospital.nombre}`,'success');
    },()=>{
      Swal.fire('Error','No se pudo actualizar el hospital','error');
    })
  }

  eliminarHospital(hospital:Hospital,index:number){
      Swal.fire({
        title: `¿Desea eliminar el hospital "${hospital.nombre}"?`,
        icon:'question',
        showCancelButton: true,
        cancelButtonColor:'#ef5350 ',
        confirmButtonText: `Sí, eliminar`,
        cancelButtonText:'No, cancelar'
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.hospitalService.eliminarHospital(hospital._id)
          .subscribe(()=>{
            this.hospitales.splice(index,1);
            Swal.fire('Hospital eliminado', '', 'success');
          },()=>{
            Swal.fire('Error', 'No se pudo eliminar el Hospital', 'error')
          })
        }
      })

  }

  async crearUsuario(){
    const { value: nombre } = await Swal.fire({
      input: 'text',
      inputLabel: 'Nombre del hospital',
      inputPlaceholder: 'Ingrese el nombre del hospital',
      confirmButtonText:'Guardar',
      showCancelButton:true,
      cancelButtonColor:'#ef5350 ',
      cancelButtonText:'Cancelar',
    })

    if (nombre?.trim().length>0) {
      this.hospitalService.crearHospital(nombre)
      .subscribe((resp)=>{
        Swal.fire('Guardado',`Se ha registrado el hospital ${nombre}`,'success');
        this.hospitales.push(resp);
      },()=>{
        Swal.fire('Error', 'No se pudo registrar el hospital', 'error')
      })
    }
  }

  abrirModal(hospital:Hospital,index:number){
    this.modalImagenService.abrirModal('hospitales',hospital._id,hospital.img,index);
  }


  buscar(){
    this.busquedasService.inputBuscar(this.inputBuscar).subscribe((termino)=>{
      if(termino.length ===0){
        return this.hospitales = this.hospitalesTemp;
      }
      this.busquedasService.buscar('hospitales',termino)
      .subscribe((resultados)=>{
        this.hospitales = resultados;
      })
    });
  }
}
