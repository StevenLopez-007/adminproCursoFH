import { Component, Input, Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: [
  ]
})
export class IncrementadorComponent {

  @Input()progreso:number = 0;
  @Input() btnClass:string  ='btn-primary';

  @Output() newProgreso:EventEmitter<number> = new EventEmitter<number>();

  getProgreso():string{
    return `${this.progreso}%`
  }

  cambiarValor(valor:number):number{
    if(this.progreso>=100 && valor>=0){
      this.newProgreso.emit(this.progreso);
      return this.progreso =100;
    }
    if(this.progreso<=0 && valor<0){
      this.newProgreso.emit(this.progreso);
      return this.progreso=0;
    }

    this.progreso = this.progreso+valor;

    this.newProgreso.emit(this.progreso);
  }

  onChange(nuevoValor:number){
    if(nuevoValor>=100){
      this.progreso = 100;
    }else if(nuevoValor <=0){
      this.progreso = 0;
    }else{
      this.progreso = nuevoValor;
    }
    this.newProgreso.emit(this.progreso);
  }

}
