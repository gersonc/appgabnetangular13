import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {Observable, of, Subject, Subscription} from 'rxjs';
import {EmendaFormService} from "../_services/emenda-form.service";
import {DdService} from "../../_services/dd.service";
import {VersaoService} from "../../_services/versao.service";
import {mergeMap, take} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class EmendaAtualizarResolver implements Resolve<boolean | never> {
  resp: Subject<boolean>;
  resp$: Observable<boolean>
  sub: Subscription[] = [];
  dados = true;
  dds: string[] = [];


  constructor(
    private efs: EmendaFormService,
    private router: Router,
    private dd: DdService
  ) {

  }

  espera(v: boolean) {
    this.resp.next(v);
    this.resp.complete();
  }

  carregaDados(): boolean {
    this.dds = [];
    this.resp = new Subject<boolean>();
    this.resp$ = this.resp.asObservable();

    if (!sessionStorage.getItem('dropdown-emenda_situacao')) {
      this.dds.push('dropdown-emenda_situacao');
    }

    if (this.dds.length > 0) {
      this.sub.push(this.dd.getDd(this.dds)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.dds.forEach(nome => {
              sessionStorage.setItem(nome, JSON.stringify(dados[nome]));
            });
          },
          error: (err) => {
            console.error(err);
          },
          complete: () => {
            this.espera(true);
          }
        })
      );
      return true;
    } else {
      return false
    }

  }

  onDestroy(): void {
    this.dds = [];
    this.sub.forEach(s => s.unsubscribe());
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | never> {
    if (this.carregaDados()) {
      return this.resp$.pipe(
        take(1),
        mergeMap(dados => {
          this.onDestroy();
          return of(dados);
        })
      );
    } else {
      this.onDestroy();
      return of(false);
    }

  }
}
