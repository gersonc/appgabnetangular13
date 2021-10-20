import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MostraMenuService {
  public mostra = true;
  private vfSms = false;
  public mostraMenuSource = new BehaviorSubject<boolean>(true);
  private smsVF = new Subject<boolean>();
  public smsVF$ = this.smsVF.asObservable();
  public mostraMenu$ = this.mostraMenuSource.asObservable();
  public loading = true;


  constructor() {
  }


  mudaMenu(valor: boolean | null = null) {
    if (valor !== this.mostra) {
      if (valor === true) {
        this.mostra = true;
      }
      if (valor === false) {
        this.mostra = false;
      }
      if (valor === null) {
        this.mostra = true;
      }
      this.mostraMenuSource.next(this.mostra);
    }
  }

  mostraMenu(): Observable<boolean> {
    return this.mostraMenu$;
  }

  mostraMenuAsinc(): Observable<boolean> {
    return this.mostraMenu$.pipe();
  }

  mostraSMS(): Observable<boolean> {
    return this.smsVF$;
  }

  mudaSmsVF(valor: boolean | null = null) {
    if (valor === true) {
      this.vfSms = true;
    }
    if (valor === false) {
      this.vfSms = false;
    }
    if (valor === null) {
      this.vfSms = !this.vfSms;
    }
    this.smsVF.next(this.vfSms);
  }

  hideMenu(): void {
    if (this.mostra) {
      this.mostra = false;
      this.mostraMenuSource.next(this.mostra);
    }
  }

  showMenu(): void {
    if (!this.mostra) {
      this.mostra = true;
      this.mostraMenuSource.next(this.mostra);
    }
  }

}
