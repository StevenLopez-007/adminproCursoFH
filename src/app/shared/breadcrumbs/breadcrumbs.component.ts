import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, ActivationEnd, Data, Router, NavigationEnd } from '@angular/router';
import { filter,map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent implements OnDestroy {

  title:string;

  titleSubs$:Subscription;

  crumbs:string[];
  constructor(private router:Router) {
    this.titleSubs$ = this.getDataRuta()
    .subscribe(event=> {
      this.title = event['title'] || 'Defecto';
      document.title = `Adminpro - ${this.title}`
    });
    this.getCrumbs();
  }

  ngOnDestroy(){
    this.titleSubs$.unsubscribe();
  }

  getDataRuta(){
    return this.router.events
    .pipe(
      filter(event=> event instanceof ActivationEnd),
      filter((event:ActivationEnd)=> event.snapshot.firstChild === null ),
      map((event:ActivationEnd)=> event.snapshot.data )
    );
  }

  getCrumbs(){
    this.router.events
    .pipe(
      filter(event=>event instanceof NavigationEnd),
      map((event:NavigationEnd)=>event.url.split('/')),
      map(event=>event.filter(event=>event!=''))
    )
    .subscribe(sus=>{
      this.crumbs = sus;
    })
  }

  crumbUrl(path:string){

    let url = '';

    for (let i = 0; i < this.crumbs.length; i++) {

      if(path == this.crumbs[i]){
        url = url + '/' + this.crumbs[i];
        break;
      }

      url = url + '/' +this.crumbs[i];
    }
    return url;
  }
}
