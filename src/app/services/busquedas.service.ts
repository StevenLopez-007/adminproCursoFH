import { Injectable, Input, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { fromEvent, Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { Medico } from '../models/medico.mode';
import { Hospital } from '../models/hospital.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor(private http:HttpClient) { }

  get token() {
    return localStorage.getItem('token') || '';
  }

  get headers(){
    return {
      headers:{
        'a-token':this.token
      }
    }
  }

  private transformarUsuarios(resultados:any[]):Usuario[]{
    return resultados.map(user=>new Usuario(user.nombre,user.email,'',user.img,user.google,user.role,user.uid))
  }

  buscar(tipo:'usuarios'|'medicos'|'hospitales',termino:string){
    const url = `${base_url}/todo/coleccion/${tipo}/${termino}`;
    return this.http.get<any[]>(url,this.headers)
    .pipe(
      map((resp:any)=>{
        switch(tipo){
          case 'usuarios':{
            return this.transformarUsuarios(resp.resultados)
          }
          case 'hospitales':{
            return resp.resultados
          }
          case 'medicos':{
            return resp.resultados
          }
        }
      })
    )
  }

  buscarTodo(termino:string){
    return this.http.get<any>(`${base_url}/todo/${termino}`,this.headers).pipe(
      map(({usuarios,medicos,hospitales})=>{
        return {usuarios,medicos,hospitales}
      })
    )
  }

  inputBuscar(input:ElementRef){

   return fromEvent(input.nativeElement,'keyup')
    .pipe(
      map((ev:any)=>ev.target.value),
      debounceTime(500)
    );
  }
}
