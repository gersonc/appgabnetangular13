import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuDatatableService {

  _mdt = false;
// (this.md.mdt) ? 'menu-principal' : 'menu-principal-fechado';

  menuClass = 'menu-principal-fechado';

  constructor() { }

  set mdt(vf: boolean) {
    this._mdt = vf;
    this.menuClass = this._mdt ? 'menu-principal' : 'menu-principal-fechado';
  }

  get mdt(): boolean {
    return this._mdt;
  }

  togle() {
    this._mdt = !this._mdt;
    this.menuClass = this._mdt ? 'menu-principal' : 'menu-principal-fechado';
  }

  show() {
    this._mdt = true;
    this.menuClass =  'menu-principal';
  }

  hide() {
    this._mdt = false;
    this.menuClass = 'menu-principal-fechado';
  }
}
