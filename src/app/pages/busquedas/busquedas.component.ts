import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusquedasService } from '../../services/busquedas.service';
import { Usuario } from '../../models/usuario.model';
import { Medico } from '../../models/medico.mode';
import { Hospital } from '../../models/hospital.model';

@Component({
  selector: 'app-busquedas',
  templateUrl: './busquedas.component.html',
  styles: [
  ]
})
export class BusquedasComponent implements OnInit {

  usuarios:Usuario[] =[];
  medicos:Medico[] =[];
  hospitales:Hospital[] =[];

  constructor(private activatedRoute:ActivatedRoute,private busquedasService:BusquedasService) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(({termino})=>{
      this.busquedaGlobal(termino);
    })
  }


  busquedaGlobal(termino:string){
    this.busquedasService.buscarTodo(termino).subscribe((resp)=>{
      this.usuarios = resp.usuarios;
      this.medicos = resp.medicos;
      this.hospitales = resp.hospitales
    })
  }

}
