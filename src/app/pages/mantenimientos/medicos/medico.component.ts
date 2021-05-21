import { Component, OnInit } from '@angular/core';
import { Medico } from 'src/app/models/medico.mode';
import { MedicoService } from '../../../services/medico.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from '../../../models/hospital.model';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  medicoForm: FormGroup;
  hospitales: Hospital[];

  hospitalAsignado: Hospital;
  medicoSeleccionado: Medico;
  constructor(private medicoService: MedicoService, private formBuilder: FormBuilder,
    private hospitalService: HospitalService, private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(({ id }) => this.cargarMedico(id))

    this.medicoForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.maxLength(12), Validators.minLength(5)]],
      hospital: ['', [Validators.required]]
    });

    this.cargasHospitales();

    this.medicoForm.get('hospital').valueChanges.subscribe((hospitalId) => {
      this.hospitalAsignado = this.hospitales.find(h => h._id === hospitalId);
    });
  }

  cargasHospitales() {
    this.hospitalService.cargarHospitales()
      .subscribe((resp) => {
        this.hospitales = resp;
      })
  }

  guardarMedico() {

    if (this.medicoSeleccionado) {
      const data ={
        ...this.medicoForm.value,
        _id:this.medicoSeleccionado._id
      }
      this.medicoService.actualizarMedico(data)
      .subscribe((medico) => {
        console.log(medico)
        Swal.fire('Actualizado', `Se ha actualizado correctamente a ${medico.nombre}`, 'success');
      }, () => {
        Swal.fire('Error', 'No se ha podido actualizar al medico', 'error');
      })
    } else {
      this.medicoService.crearMedico(this.medicoForm.value)
        .subscribe((resp) => {
          Swal.fire('Guardado', `Se ha registrado correctamente a ${resp.nombre}`, 'success');
          this.router.navigate(['/dashboard', 'medico', resp._id])
        }, () => {
          Swal.fire('Error', 'No se ha podido guardar al medico', 'error');
        })
    }

  }

  cargarMedico(id: string) {

    if(id === 'nuevo') return;

    this.medicoService.getMedico(id)
    .pipe(
      delay(100)
    )
      .subscribe((medico) => {
        const { nombre, hospital: { _id } } = medico;
        this.medicoSeleccionado = medico;
        this.medicoForm.setValue({ nombre, hospital: _id });
      },()=>this.router.navigate(['/dashboard', 'medicos',]))
  }
}
