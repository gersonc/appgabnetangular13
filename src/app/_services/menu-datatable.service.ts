import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuDatatableService {

  _mdt = false;
// (this.md.mdt) ? 'menu-principal' : 'menu-principal-fechado';

  menuClass = 'menu-principal-fechado';
  tablecaptionClass = 'show-datatable';

  constructor() { }

  set mdt(vf: boolean) {
    this._mdt = vf;
    this.menuClass = this._mdt ? 'menu-principal' : 'menu-principal-fechado';
    this.tablecaptionClass = this._mdt ? 'hide-datatable' : 'show-datatable';
  }

  get mdt(): boolean {
    return this._mdt;
  }

  togle() {
    this._mdt = !this._mdt;
    this.menuClass = this._mdt ? 'menu-principal' : 'menu-principal-fechado';
    this.tablecaptionClass = this._mdt ? 'hide-datatable' : 'show-datatable';
  }

  show() {
    this._mdt = true;
    this.menuClass =  'menu-principal';
    this.tablecaptionClass = 'hide-datatable';
  }

  hide() {
    this._mdt = false;
    this.tablecaptionClass =  'show-datatable';
  }
}
