import { Component, Input, OnInit } from '@angular/core';
import { Color, Label, MultiDataSet } from 'ng2-charts';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [
  ]
})
export class DonaComponent implements OnInit {
  @Input() title:string = 'Sin titulo';
  @Input('labels') doughnutChartLabels: Label[] = ['Part1','Part2'];
  @Input('data') doughnutChartData: MultiDataSet = [
    [50, 50],
  ];

  @Input('colors') colors:Color[]=[
    {backgroundColor:['#6857E6','#009FEE']}
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
