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

}
