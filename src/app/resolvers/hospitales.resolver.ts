import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { HospitalService } from '../services/hospital.service';
import { Hospital } from '../models/hospital.model';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HospitalesResolver implements Resolve<Hospital[]> {
  constructor(private hospitalService:HospitalService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.hospitalService.cargarHospitales();
  }
}
