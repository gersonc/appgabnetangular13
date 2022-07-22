import {ElementRef, Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {CarregadorService} from "./carregador.service";
import {MenuDatatableService} from "./menu-datatable.service";

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
    // public cs: CarregadorService,
    public md: MenuDatatableService
  ) { }

  mudaMenuInterno(valor: boolean | null = null) {
    if (valor !== this.mostraMenuInterno) {
      if (valor === true) {
        this.showMenuInterno();
        // this.mostraMenuInterno = true;
      }
      if (valor === false) {
        this.hideMenu()
        //this.mostraMenuInterno = false;
        // this.md.hide();
      }
      if (valor === null) {
        // this.mostraMenuInterno = true;
        this.showMenuInterno();
      }
      // this.mostraMenuInternoSource.next(this.mostraMenuInterno);
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
    // if (this.mostraMenuInterno) {
      this.mostraMenuInterno = false;
      this.md.hide();
      this.mostraMenuInternoSource.next(this.mostraMenuInterno);
    // }
  }

  showMenuInterno(): void {
    // if (!this.mostraMenuInterno) {
      this.mostraMenuInterno = true;
      this.mostraMenuInternoSource.next(this.mostraMenuInterno);
    // }
  }




}
