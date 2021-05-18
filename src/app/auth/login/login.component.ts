import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';

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

  constructor(private router: Router, private formBuilder: FormBuilder, private usuarioService: UsuarioService,
              private ngZone:NgZone) {
    this.loginForm = this.formBuilder.group({
      email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      remember: [false, Validators.required]
    });
  }

  ngOnInit(): void {
    this.renderButton();
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
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
    });

    this.startApp();
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

}
