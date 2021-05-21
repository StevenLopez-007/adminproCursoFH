import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Hospital } from '../models/hospital.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

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

  crearHospital(nombre:string){
    return this.http.post(`${base_url}/hospitales`,{nombre},this.headers).pipe(map((resp:{ok:boolean,hospitalDB:Hospital})=>{
      return resp.hospitalDB
    }));
  }

  actualizarHospital(_id:string,nombre:string){
    return this.http.put(`${base_url}/hospitales/${_id}`,{nombre},this.headers);
  }

  eliminarHospital(_id:string){
    return this.http.delete(`${base_url}/hospitales/${_id}`,this.headers);
  }

  cargarHospitales(){
    const url = `${base_url}/hospitales`;
    return this.http.get(url,this.headers).pipe(map((resp:{ok:boolean,hospitales:Hospital[]})=>resp.hospitales));
  }
}
