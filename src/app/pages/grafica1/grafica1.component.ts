import { Component, OnInit } from '@angular/core';

import { MultiDataSet, Label,Color } from 'ng2-charts';
@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component implements OnInit {

  labels1:string[]=['Pan', 'Refresco', 'Tacos'];
  data1 :number[][] =[[10, 15, 40]];

  colors1:any = [{backgroundColor:['#6857E6','#009FEE','#F02059']}];

  constructor() { }

  ngOnInit(): void {
  }

}
