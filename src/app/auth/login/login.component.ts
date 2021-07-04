import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';
import { FacebookLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { switchMap } from 'rxjs/operators';

declare var gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.components.css']
})
export class LoginComponent implements OnInit {
  formSubmitted = false;
  loginForm: FormGroup;
  auth2: any;
  socialUser:SocialUser;
  constructor(private router: Router, private formBuilder: FormBuilder, private usuarioService: UsuarioService,
              private ngZone:NgZone,private socialAuthService: SocialAuthService) {
    this.loginForm = this.formBuilder.group({
      email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      remember: [false, Validators.required]
    });
  }

  ngOnInit(): void {
    this.renderButton();

    this.socialAuthService.authState.pipe(switchMap((resp:any)=>{
      return this.usuarioService.loginFacebook(resp.authToken)
    })).subscribe((user)=>{
      this.socialUser = user;
    });
  }

  login() {
    this.formSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    // Realizar el posteo
    this.usuarioService.login(this.loginForm.value)
      .subscribe((resp) => {
        if (this.loginForm.get('remember').value) {
          localStorage.setItem('email', this.loginForm.get('email').value)
        } else {
          localStorage.removeItem('email');
        }

        this.router.navigateByUrl('/dashboard')
      }, (err) => {
        Swal.fire('Error', err.error.msg, 'error');
      })

    // this.router.navigateByUrl('/')
  }

  renderButton() {
    try {
      gapi.signin2.render('my-signin2', {
        'scope': 'profile email',
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
      });

      this.startApp();
    } catch (error) {

    }
  }

  async startApp() {
      await this.usuarioService.googleInit();
      this.auth2 = this.usuarioService.auth2;
      this.attachSignin(document.getElementById('my-signin2'));
  };

  attachSignin(element): any {
    this.auth2.attachClickHandler(element, {},
      (googleUser: any) => {
        const id_token = googleUser.getAuthResponse().id_token;
        this.usuarioService.loginGoogle(id_token).subscribe(resp=> {
          this.ngZone.run(()=>this.router.navigateByUrl('/dashboard'))
        });

      }, (error: any) => {
        alert(JSON.stringify(error, undefined, 2));
      });
  }

  loginWithFacebook(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

}
