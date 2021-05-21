import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Medico } from '../models/medico.mode';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor(private http:HttpClient) { }

  get token():string{
    return localStorage.getItem('token') || '';
  }
  get headers(){
    return {
      headers:{
        'a-token':this.token
      }
    }
  }

  crearMedico(medico:{nombre:string,hospital:string}){
    return this.http.post(`${base_url}/medicos`,medico,this.headers).pipe(map((resp:{ok:boolean,medicoBD:Medico})=>{
      return resp.medicoBD;
    }));
  }
  actualizarMedico(medico:Medico){
    return this.http.put(`${base_url}/medicos/${medico._id}`,medico,this.headers)
    .pipe(
      map((resp:{ok:boolean,hospitalActualizado:Medico})=>resp.hospitalActualizado)
    );
  }

  eliminarMedico(_id:string){
    return this.http.delete(`${base_url}/medicos/${_id}`,this.headers);
  }

  cargarMedicos(){
    const url = `${base_url}/medicos`;
    return this.http.get(url,this.headers).pipe(map((resp:{ok:boolean,medicos:Medico[]})=>resp.medicos));
  }

  getMedico(id:string){
    return this.http.get(`${base_url}/medicos/${id}`,this.headers).pipe(
      map((resp:{ok:boolean,medico:Medico})=>resp.medico)
    )
  }
}
