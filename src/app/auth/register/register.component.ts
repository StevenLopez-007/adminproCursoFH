import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.components.css']
})
export class RegisterComponent implements OnInit {

  formSubmitted = false;

  registerForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private usuarioService:UsuarioService,private router:Router) {
    this.registerForm = this.formBuilder.group({
      nombre: ['Alexander', [Validators.required, Validators.minLength(5), Validators.maxLength(10)]],
      email: ['alex@gmail.com', [Validators.required, Validators.email]],
      password: ['1234', [Validators.required]],
      password2: ['1234', [Validators.required]],
      terminos: [true, Validators.required]
    });
  }

  ngOnInit(): void {
  }

  crearUsuario() {
    this.formSubmitted = true;
    if(this.registerForm.invalid){
      return;
    }

    // Realizar el posteo
    this.usuarioService.crearUsuario(this.registerForm.value)
    .subscribe(resp=>{
      this.router.navigateByUrl('/dashboard')
    },(err)=>{
      Swal.fire('Error',err.error.msg,'error');
    })
  }

  campoNoValido(campo:string):boolean{
    if(this.registerForm.get(campo).invalid && this.formSubmitted){
      return true;
    }
    else{
      return false;
    }
  }

  contraseniasNoValidas(){
    const pass1 = this.registerForm.get('password').value;
    const pass2 = this.registerForm.get('password2').value;

    return (pass1 !== pass2) && this.formSubmitted?true:false;
  }

  aceptaTerminos(){
    return !this.registerForm.get('terminos').value && this.formSubmitted
  }

  passwordsIguales(pass1:string,pass2:string){
    return (formGroup:FormGroup)=>{
      const pass1Control = formGroup.get(pass1);
      const pass2Control = formGroup.get(pass2);

      if(pass1Control === pass2Control){
        pass2Control.setErrors(null)
      }else{
        pass2Control.setErrors({noEsIgual:true})
      }
    }
  }

}
