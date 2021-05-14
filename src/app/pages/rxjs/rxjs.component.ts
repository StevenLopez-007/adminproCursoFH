import { Component, OnDestroy } from '@angular/core';
import { Observable,interval, Subscription } from 'rxjs';
import {filter, map, retry, take} from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnDestroy{


  intervalSubs:Subscription;

  constructor() {

    // this.retornaObservable().pipe(
    //   retry(1)
    // ).subscribe(
    // sus=>console.log('Subs: ',sus),
    // err=>console.warn(err),
    // ()=>console.info('Obs Terminao')
    // )

    this.intervalSubs = this.retornaIntervalo()
    .subscribe(console.log);

  }

  ngOnDestroy(){
    this.intervalSubs.unsubscribe();
  }

  retornaIntervalo():Observable<number>{
    const intervalo$ = interval(100).pipe(
      // take(10),
      map((numero)=>numero+1),
      filter((numero)=>numero%2==0)
    );
    return intervalo$;
  }

  retornaObservable():Observable<number>{
    let i = -1;
      return new Observable<number>((observer=>{
      const intervalo = setInterval(()=>{
        i++;
        observer.next(i);

        if(i==4){
          clearInterval(intervalo);
          observer.complete();
        }

        if(i==2){

          observer.error('i llegó al valor de 2')
        }
      },1000)

    }));
  }

}
