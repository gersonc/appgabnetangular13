import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';


@Injectable({
  providedIn: 'root',
})

export class CarregadorService {
  private vf = false;
  private subject = new BehaviorSubject<boolean>(false);
  public subjectCarregador = this.subject.asObservable();
  public mostra?: boolean;
  public menuClasses?: string;
  constructor() { }


  setCarregador(vf: boolean) {
    this.vf = vf;
    this.subject.next(vf);
  }

  mostraCarregador() {
    if (this.vf !== true) {
      this.subject.next(true);
      this.vf = true;
    }
  }

  escondeCarregador() {
    if (this.vf === true) {
      this.subject.next(false);
      this.vf = false;
    }
  }

  clearCarregador() {
    this.subject.next(false);
  }

  getCarregador(): Observable<boolean> {
    return this.subject.asObservable();
  }

  public mostraEscondeCarregador(vf: boolean) {
    if (vf) {
      this.mostraCarregador();
    } else {
      this.escondeCarregador();
    }
  }


  /*abreFechaMenu() {
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
  }*//*abreFechaMenu() {
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
  }*/

  /*abreMenu() {
    console.log('cs 08');
    this.mostraMn = true;
    this.menuClasses = 'menu-principal';
    setTimeout(() => {
      this.mostra = this.mostraMn;
    }, 1000);
  }*/

  /*fechaMenu() {
    console.log('cs 09');
    this.mostraMn = false;
    this.menuClasses = 'menu-principal-fechado';
    this.mostra = this.mostraMn;

  }*/



}
