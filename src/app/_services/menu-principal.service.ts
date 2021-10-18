import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuPrincipalService {
  public mostraMn?: boolean;
  public menuClasses?: string;
  public mostra?: boolean;

  constructor() { }

  abreFechaMenu() {
    console.log('mp.abreFechaMenu');
    this.mostraMn = !this.mostraMn;
    if (this.mostraMn) {
      this.menuClasses = this.mostraMn ? 'menu-principal' : 'menu-principal-fechado';
      setTimeout(() => {
        this.mostra = this.mostraMn;
      }, 1000);
    } else {
      this.mostra = this.mostraMn;
      setTimeout(() => {
        this.menuClasses = this.mostraMn ? 'menu-principal' : 'menu-principal-fechado';
      }, 500);
    }
  }

  abreMenu() {
    console.log('mp.abreMenu');
    this.mostraMn = true;
    this.menuClasses = 'menu-principal';
    setTimeout(() => {
      this.mostra = this.mostraMn;
    }, 1000);
  }

  fechaMenu() {
    console.log('mp.fechaMenu');
    this.mostraMn = false;
    this.menuClasses = 'menu-principal-fechado';
    this.mostra = this.mostraMn;

  }


}
