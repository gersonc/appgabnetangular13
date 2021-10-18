import { Injectable } from '@angular/core';
import {Observable, EMPTY, Subscription, Subject, of} from 'rxjs';
import {map, mergeMap, take, tap} from 'rxjs/operators';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, Resolve } from '@angular/router';
import { CarregadorService } from '../../_services';
import { SolicitacaoDropdownMenuListarInterface, SolicitacaoPaginacaoInterface} from '../_models';
import {SolicitacaoBuscarService, SolicitacaoDropdownMenuService, SolicitacaoService} from '../_services';
import {SolicitacaoDdMenuService} from '../_services/solicitacao-dd-menu.service';


@Injectable({
  providedIn: 'root'
})
export class SolicitacaoListarResolver implements
  Resolve<SolicitacaoPaginacaoInterface | boolean> {
  private sub: Subscription[] = [];
  private resp = new Subject<boolean>();
  private resp$ = this.resp.asObservable();
  private contador = 0;
  private solicitacoes: SolicitacaoPaginacaoInterface = null;

  constructor(
    private router: Router,
    private cs: CarregadorService,
    private solicitacaoService: SolicitacaoService,
    private sdd: SolicitacaoDdMenuService,
    private sbs: SolicitacaoBuscarService
  ) { }

  populaDropDown() {
    this.sub.push(this.sdd.getDropDown().pipe(take(1))
      .subscribe({
        next: (dados) => {
          const vf = dados;
          this.contador++;
          if (this.contador === 1) {
            this.responde();
          }
        }
      })
    );
  }

  /*getBusca() {
    if (!sessionStorage.getItem('solicitacao-busca')) {
      this.sub.push(
        this.solicitacaoService
          .postSolicitacaoBusca(JSON.parse(sessionStorage.getItem('solicitacao-busca')))
          .pipe(take(1))
          .subscribe({
            next: (dados) => {
              this.solicitacoes = dados;
            },
            error: (err) => {
              console.error(err);
            },
            complete: () => {
              this.contador++;
              if (this.contador === 2) {
                this.responde();
              }
            }
          }));
    } else {
      this.contador++;
      if (this.contador === 2) {
        this.responde();
      }
    }
  }*/

  onDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

  responde() {
    this.onDestroy();
    this.resp.next(true);
  }

  /*getResposta(): Observable<boolean | SolicitacaoPaginacaoInterface> {
    if (sessionStorage.getItem('solicitacao-busca')) {
      return this.sdd.getDropDown()
        .pipe(take(1),
          mergeMap(vf => {
            return this.solicitacaoService.postSolicitacaoBusca(JSON.parse(sessionStorage.getItem('solicitacao-busca')))
              .pipe(take(1));
          })
        );
    } else {
      return this.sdd.getDropDown()
        .pipe(take(1));
    }
  }*/

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):
    Observable<boolean> |
    Observable<never> |
    Observable<SolicitacaoPaginacaoInterface>  {
    if (!sessionStorage.getItem('solicitacao-dropdown')) {
      this.cs.fechaMenu();
      this.cs.mostraCarregador();
      this.populaDropDown();
      return this.resp$.pipe(
        take(1),
        mergeMap(vf => {
          if (vf) {
            this.onDestroy();
            return of(vf);
          } else {
            this.onDestroy();
            return EMPTY;
          }})
        );
    } else {
      if (sessionStorage.getItem('solicitacao-busca') && this.sbs.buscaStateSN) {
        this.cs.fechaMenu();
        this.cs.mostraCarregador();
        this.sbs.buscaState = JSON.parse(sessionStorage.getItem('solicitacao-busca'));
        this.cs.fechaMenu();
        return this.solicitacaoService.postSolicitacaoBusca(JSON.parse(sessionStorage.getItem('solicitacao-busca')))
          .pipe(
            take(1),
            mergeMap(dados => {
              if (dados) {
                return of(dados);
              } else {
                return EMPTY;
              }
            })
          );
      } else {
          this.cs.fechaMenu();
          this.router.navigate(['/solicitacao/listar2']);
          return EMPTY;
        }
      }
    }
}
