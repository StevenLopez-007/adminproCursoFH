import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterForm } from '../models/registerForm.model';
import { environment } from '../../environments/environment';
import { LoginForm } from '../models/loginForm.model';
import { tap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

const base_url = environment.base_url;
declare var gapi: any;

@Injectable({providedIn: 'root'})
export class UsuarioService {

  auth2: any;

  constructor(private http: HttpClient, private router:Router,private ngZone:NgZone) {
    this.googleInit();
  }

  googleInit(){
    return new Promise(resolve=>{
      gapi.load('auth2', ()=> {
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        this.auth2 = gapi.auth2.init({
          client_id: '839294487035-0eo1sovs9a1dfd9g3udk9dmm4fo3kg0e.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
          // Request scopes in addition to 'profile' and 'email'
          //scope: 'additional_scope'
        });

        resolve('');
      });
    })
  }

  logout(){
    localStorage.removeItem('token');
      this.auth2.signOut().then(()=> {
        this.ngZone.run(()=>this.router.navigateByUrl('/login'));
      });
  }

  validarToken():Observable<boolean>{

    const token = localStorage.getItem('token') || '';

    return this.http.get(`${base_url}/login/refreshToken`,{
      headers:{
        'a-token':token
      }
    }).pipe(
      tap((resp:any)=>{
        localStorage.setItem('token',resp.token)
      }),
      map(()=>true),
      catchError((err)=>of(false))
    )
  }

  crearUsuario(formData:RegisterForm){
    return this.http.post(`${base_url}/usuarios`,formData).pipe(tap((resp:any)=>{
      localStorage.setItem('token',resp.token);
    }));;
  }

  login(formData:LoginForm){
    return this.http.post(`${base_url}/login`,formData).pipe(tap((resp:any)=>{
      localStorage.setItem('token',resp.token);
    }));
  }

  loginGoogle(token:string){
    return this.http.post(`${base_url}/login/google`,{token}).pipe(tap((resp:any)=>{
      localStorage.setItem('token',resp.token);
    }));
  }

}
