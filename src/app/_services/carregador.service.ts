import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})

export class CarregadorService {
  private vf = false;
  private contaVf = 0;
  private subject = new Subject<boolean>();
  public mostra?: boolean;
  public mostraMn?: boolean;
  public menuClasses?: string;
  constructor() { }


  setCarregador(vf: boolean) {
    this.vf = vf;
    this.subject.next(vf);
    console.log('cs 01');
  }

  mostraCarregador() {
    console.log('cs 02');
    if (this.vf !== true) {
      this.subject.next(true);
      this.vf = true;
    }
  }

  escondeCarregador() {
    console.log('cs 03');
    if (this.vf === true) {
      this.subject.next(false);
      this.vf = false;
    }
    if (this.mostraMn) {
      this.fechaMenu();
    }
  }

  clearCarregador() {
    console.log('cs 04');
    this.subject.next();
  }

  getCarregador(): Observable<boolean> {
    console.log('cs 05');
    return this.subject.asObservable();
  }

  public mostraEsconde(vf: boolean) {
    console.log('cs 06');
    if (vf) {
      this.mostraCarregador();
    } else {
      this.escondeCarregador();
    }
  }


  abreFechaMenu() {
    console.log('cs 07');
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
    console.log('cs 08');
    this.mostraMn = true;
    this.menuClasses = 'menu-principal';
    setTimeout(() => {
      this.mostra = this.mostraMn;
    }, 1000);
  }

  fechaMenu() {
    console.log('cs 09');
    this.mostraMn = false;
    this.menuClasses = 'menu-principal-fechado';
    this.mostra = this.mostraMn;

  }



}
