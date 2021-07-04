import { SocialAuthService } from 'angularx-social-login';
import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterForm } from '../interfaces/registerForm.interface';
import { environment } from '../../environments/environment';
import { LoginForm } from '../interfaces/loginForm.interface';
import { tap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

const base_url = environment.base_url;
declare var gapi: any;

@Injectable({ providedIn: 'root' })
export class UsuarioService {

  auth2: any;
  usuario: Usuario;
  constructor(private http: HttpClient, private router: Router, private ngZone: NgZone,private socialAuthService: SocialAuthService) {
    this.googleInit();
  }

  get token() {
    return localStorage.getItem('token') || '';
  }

  get role():'ADMIN_ROLE'| 'USER_ROLE'{
    return this.usuario.role;
  }

  get uid(){
    return this.usuario.uid || '';
  }

  googleInit() {
    return new Promise(resolve => {
      try {
        gapi.load('auth2', () => {
          // Retrieve the singleton for the GoogleAuth library and set up the client.
          this.auth2 = gapi.auth2.init({
            client_id: '839294487035-0eo1sovs9a1dfd9g3udk9dmm4fo3kg0e.apps.googleusercontent.com',
            cookiepolicy: 'single_host_origin',
            // Request scopes in addition to 'profile' and 'email'
            //scope: 'additional_scope'
          });

          resolve(null);
        });
      } catch (error) {

      }
    })
  }

  async logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('menu');
    //TODO:Borrar menu
    await Promise.all([
      this.auth2.signOut(),
      this.socialAuthService.signOut()
    ]);
    this.ngZone.run(() => this.router.navigateByUrl('/login'));
  }

  validarToken(): Observable<boolean> {
    return this.http.get(`${base_url}/login/refreshToken`, {
      headers: {
        'a-token': this.token
      }
    }).pipe(
      map((resp: any) => {

        const { nombre, email, google, role, img='', uid } = resp.usuario;
        this.usuario = new Usuario(nombre, email, '', img, google, role, uid);
        this.storeTokenMenu(resp.token,resp.menu);
        return true;
      }),
      catchError(() => of(false))
    )
  }

  crearUsuario(formData: RegisterForm) {
    return this.http.post(`${base_url}/usuarios`, formData).pipe(tap((resp: any) => {
      this.storeTokenMenu(resp.token,resp.menu)
    }));;
  }

  actualizarPerfil(data: { email: string, nombre: string,role:string }) {

    data ={
      ...data,
      role:this.usuario.role
    }
    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, {
      headers: {
        'a-token': this.token
      }
    });
  }

  login(formData: LoginForm) {
    return this.http.post(`${base_url}/login`, formData).pipe(tap((resp: any) => {
      this.storeTokenMenu(resp.token,resp.menu)
    }));
  }

  loginGoogle(token: string) {
    return this.http.post(`${base_url}/login/google`, { token }).pipe(tap((resp: any) => {
      localStorage.setItem('token', resp.token);
    }));
  }

  loginFacebook(token:string){
    return this.http.get(`${environment.base_url}/login/facebook/token`,{params:{access_token:token}}).pipe(tap((resp:any)=>{
      localStorage.setItem('token',resp.token);
      this.router.navigateByUrl('/dashboard');
    }));
  }

  cargarUsuarios(desde:number = 0){
    const url = `${base_url}/usuarios?desde=${desde}`;
    return this.http.get<CargarUsuario>(url,{
      headers:{
        'a-token':this.token
      }
    }).pipe(
      map(resp=>{
        const usuarios = resp.usuarios.map(user=> new Usuario(user.nombre,user.email,'',user.img,user.google,user.role,user.uid))
        return {
          total:resp.total,
          usuarios
        }
      })
    )
  }

  eliminarUsuario(usuario:Usuario){
    return this.http.delete(`${base_url}/usuarios/${usuario.uid}`,{
      headers:{
        'a-token':this.token
      }
    });
  }

  guardarUsuario(usuario:Usuario) {
    return this.http.put(`${base_url}/usuarios/${usuario.uid}`, usuario, {
      headers: {
        'a-token': this.token
      }
    });
  }

  storeTokenMenu(token:any,menu:any){
    localStorage.setItem('token',token);
    localStorage.setItem('menu',JSON.stringify(menu));
  }
}
