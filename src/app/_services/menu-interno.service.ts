import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {CarregadorService} from "./carregador.service";

@Injectable({
  providedIn: 'root'
})
export class MenuInternoService {
  public mostraMenuInterno = false;
  private vfSms = false;
  public mostraMenuInternoSource = new BehaviorSubject<boolean>(true);
  private smsVF = new Subject<boolean>();
  public smsVF$ = this.smsVF.asObservable();
  public mostraInternoMenu$ = this.mostraMenuInternoSource.asObservable();
  public loading = true;



  constructor(
    public cs: CarregadorService
  ) { }

  mudaMenuInterno(valor: boolean | null = null) {
    if (valor !== this.mostraMenuInterno) {
      if (valor === true) {
        this.mostraMenuInterno = true;
      }
      if (valor === false) {
        this.mostraMenuInterno = false;
      }
      if (valor === null) {
        this.mostraMenuInterno = true;
      }
      this.mostraMenuInternoSource.next(this.mostraMenuInterno);
    }
  }

  mostraInternoMenu(): Observable<boolean> {
    return this.mostraInternoMenu$;
  }

  mostraMenuAsinc(): Observable<boolean> {
    return this.mostraInternoMenu$.pipe();
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
    if (this.mostraMenuInterno) {
      this.mostraMenuInterno = false;
      this.mostraMenuInternoSource.next(this.mostraMenuInterno);
    }
  }

  showMenuInterno(): void {
    if (!this.mostraMenuInterno) {
      this.mostraMenuInterno = true;
      this.mostraMenuInternoSource.next(this.mostraMenuInterno);
    }
  }
}
