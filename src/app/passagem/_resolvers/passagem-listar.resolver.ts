import { Injectable } from '@angular/core';
import { Observable, of, Subscription, Subject } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, Resolve } from '@angular/router';
import { PassagemBuscaService, PassagemService } from '../_services';
import { PassagemPaginacaoInterface } from '../_models';
import { DdService } from "../../_services/dd.service";

@Injectable({
  providedIn: 'root'
})

export class PassagemListarResolver implements Resolve<PassagemPaginacaoInterface | boolean> {
  private sub: Subscription[] = [];

  resp2: Subject<boolean>;
  resp2$: Observable<boolean>
  dados = true;
  dds: string[] = [];

  constructor(
    private router: Router,
    private dd: DdService,
    private tbs: PassagemBuscaService,
    private ts: PassagemService
  ) { }

  espera(v: boolean) {
    this.resp2.next(v);
    this.resp2.complete();
  }

  carregaDados(): boolean {
    this.dds = [];
    this.resp2 = new Subject<boolean>();
    this.resp2$ = this.resp2.asObservable();
    if (!sessionStorage.getItem('dropdown-aerolinha')) {
      this.dds.push('dropdown-aerolinha');
    }
    // ****** solicitacao_assunto_id *****
    if (!sessionStorage.getItem('passagem_aerolinha-dropdown')) {
      this.dds.push('passagem_aerolinha-dropdown');
    }
    // ****** solicitacao_atendente_cadastro_id *****
    if (!sessionStorage.getItem('passagem_beneficiario-dropdown')) {
      this.dds.push('passagem_beneficiario-dropdown');
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
    state: RouterStateSnapshot):
    Observable<PassagemPaginacaoInterface | boolean>{
    if (this.carregaDados()) {
      return this.resp2$.pipe(
        take(1),
        mergeMap(dados => {
          this.onDestroy();
          return of(dados);
        })
      );
    } else {
      if (sessionStorage.getItem('passagem-busca')) {
        this.tbs.buscaState = JSON.parse(sessionStorage.getItem('passagem-busca'));
        return this.ts.postPassagemBusca(JSON.parse(sessionStorage.getItem('passagem-busca')))
          .pipe(
            take(1),
            mergeMap(dados => {
              if (dados) {
                return of(dados);
              } else {
                this.router.navigate(['/passagem/listar2']);
                return of(false);
              }
            })
          );
      } else {
        this.router.navigate(['/passagem/listar2']);
        return of(false);
      }
    }
  }

}
