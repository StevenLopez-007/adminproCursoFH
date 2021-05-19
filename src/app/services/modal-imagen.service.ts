import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {

  private _ocultarModal: boolean = false;
  public tipo: string;
  public uid: string;
  public img: string;

  index:number;

  nuevaImagen:EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  get ocultarModal() {

    return this._ocultarModal;
  }

  abrirModal(tipo: 'usuarios' | 'medicos' | 'hospitales', uid: string, img: string='no-img',index:number) {
    this._ocultarModal = true;

    this.tipo = tipo;
    this.uid = uid;
    this.img = img;
    this.index = index;

    if(img.includes('https')){
      this.img = img;
    }else{
      this.img = `${base_url}/uploads/${tipo}/${img}`;
    }
  }

  cerrarModal() {
    this._ocultarModal = false;
  }

}

