import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArquivoSpinnerService {
  public mostraSpinner = new Subject<boolean>();
  public tf = false;

  constructor() {
  }

  mostraCarregador() {
    this.tf = true;
    this.mostraSpinner.next(this.tf);
  }

  escondeCarregador() {
    this.tf = false;
    this.mostraSpinner.next(this.tf);
  }

  mudaCarregador() {
    this.tf = !this.tf;
    this.mostraSpinner.next(this.tf);
  }

  setCarregador(tf: boolean) {
    this.tf = tf;
    this.mostraSpinner.next(this.tf);
  }

  getCarregador(): Observable<boolean> {
    return this.mostraSpinner.asObservable();
  }
}
