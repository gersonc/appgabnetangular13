import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuDatatableService {

  mdt = false;


  constructor() { }

  show() {
    this.mdt = true;
  }

  hide() {
    this.mdt = false;
  }
}
