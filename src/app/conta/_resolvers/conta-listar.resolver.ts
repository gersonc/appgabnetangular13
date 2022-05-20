import { Injectable } from '@angular/core';
import { Observable, of, EMPTY, Subscription, Subject } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, Resolve } from '@angular/router';
import { DropdownService } from '../../_services';
import { CarregadorService } from '../../_services';

import { ContaBuscaService, ContaService } from '../_services';
import { ContaPaginacaoInterface } from '../_models';
import { SelectItem } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})

export class ContaListarResolver implements Resolve<ContaPaginacaoInterface | boolean> {
  private sub: Subscription[] = [];
  private resp = new Subject<ContaPaginacaoInterface | boolean>();
  private resp$ = this.resp.asObservable();
  private dropdown = false;
  private drop: SelectItem[];
  private drop2: string[];

  constructor(
    private router: Router,
    private dd: DropdownService,
    private cs: CarregadorService,
    private tbs: ContaBuscaService,
    private ts: ContaService
  ) { }

  populaDropdown() {
    let a = 0;
    const busca  = {tabela: 'local', campo_id: 'local_id', campo_nome: 'local_nome'};
    if (!sessionStorage.getItem('dropdown-local')) {
      this.dd.postDropdownNomeId(busca)
        .pipe(take(1))
        .subscribe((dados) => {
          this.drop = dados;
        },
        error1 => {
          console.log('erro');
        },
        () => {
          sessionStorage.setItem('dropdown-local', JSON.stringify(this.drop));
          a++;
          if (a === 2) {
            this.resp.next(true);
          }
        });
    } else {
      a++;
      if (a === 2) {
        this.resp.next(true);
      }
    }

    const busca2  = {tabela: 'contas', campo_id: 'conta_local_id', campo_nome: 'conta_local_nome'};
    if (!sessionStorage.getItem('dropdown-conta')) {
      this.dd.postDropdownNomeId(busca2)
        .pipe(take(1))
        .subscribe((dados) => {
            this.drop2 = dados;
          },
          error1 => {
            console.log('erro');
          },
          () => {
            sessionStorage.setItem('dropdown-conta', JSON.stringify(this.drop2));
            a++;
            if (a === 2) {
              this.resp.next(true);
            }
          });
    } else {
      a++;
      if (a === 2) {
        this.resp.next(true);
      }
    }
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):
    Observable<ContaPaginacaoInterface | boolean> |
    Observable<never> {
    if (!sessionStorage.getItem('dropdown-local') || !sessionStorage.getItem('dropdown-conta')) {
      this.dropdown = true;
      this.cs.mostraCarregador();
      this.populaDropdown();
      return this.resp$.pipe(
        take(1),
        mergeMap(vf => {
          if (vf) {
            this.cs.escondeCarregador();
            return of(vf);
          } else {
            this.cs.escondeCarregador();
            return EMPTY;
          }
        })
      );
    } else {
      if (sessionStorage.getItem('conta-busca')) {
        this.cs.mostraCarregador();
        this.tbs.buscaState = JSON.parse(sessionStorage.getItem('conta-busca'));
        return this.ts.postContaBusca(JSON.parse(sessionStorage.getItem('conta-busca')))
          .pipe(
            take(1),
            mergeMap(dados => {
              if (dados) {
                this.cs.escondeCarregador();
                return of(dados);
              } else {
                this.router.navigate(['/conta/listar2']);
                this.cs.escondeCarregador();
                return EMPTY;
              }
            })
          );
      } else {
        this.router.navigate(['/conta/listar2']);
        this.cs.escondeCarregador();
        return EMPTY;
      }
    }
  }

}
