import { Injectable } from '@angular/core';
import { Observable, of, EMPTY, Subscription, Subject } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, Resolve } from '@angular/router';
import { DropdownService } from '../../_services';
import { CarregadorService } from '../../_services';

import { TelefoneBuscaService, TelefoneService } from '../_services';
import { TelefonePaginacaoInterface } from '../_models';
import { SelectItem } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})

export class TelefoneListarResolver implements Resolve<TelefonePaginacaoInterface | boolean> {
  private sub: Subscription[] = [];
  private resp = new Subject<TelefonePaginacaoInterface | boolean>();
  private resp$ = this.resp.asObservable();
  private dropdown = false;
  private drop: SelectItem[] | undefined;
  private drop2: string[] | undefined;

  constructor(
    private router: Router,
    private dd: DropdownService,
    private cs: CarregadorService,
    private tbs: TelefoneBuscaService,
    private ts: TelefoneService
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
          if (a === 3) {
            this.resp.next(true);
          }
        });
    } else {
      a++;
      if (a === 3) {
        this.resp.next(true);
      }
    }

    const busca2  = {tabela: 'telefone', campo_nome: 'telefone_usuario_nome'};
    if (!sessionStorage.getItem('telefone-dropdown')) {
      this.dd.postDropdownSoNome(busca2)
        .pipe(take(1))
        .subscribe((dados) => {
            this.drop2 = dados;
          },
          error1 => {
            console.log('erro');
          },
          () => {
            sessionStorage.setItem('telefone-dropdown', JSON.stringify(this.drop2));
            a++;
            if (a === 3) {
              this.resp.next(true);
            }
          });
    } else {
      a++;
      if (a === 3) {
        this.resp.next(true);
      }
    }


    const busca3  = {tabela: 'usuario', campo_nome: 'usuario_nome'};
    if (!sessionStorage.getItem('dropdown-usuario_nome')) {
      this.dd.postDropdownSoNome(busca3)
        .pipe(take(1))
        .subscribe((dados) => {
            this.drop2 = dados;
          },
          error1 => {
            console.log('erro');
          },
          () => {
            sessionStorage.setItem('dropdown-usuario_nome', JSON.stringify(this.drop2));
            a++;
            if (a === 3) {
              this.resp.next(true);
            }
          });
    } else {
      a++;
      if (a === 3) {
        this.resp.next(true);
      }
    }

  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):
    Observable<TelefonePaginacaoInterface | boolean> |
    Observable<never> {
    if (!sessionStorage.getItem('dropdown-local') || !sessionStorage.getItem('telefone-dropdown')) {
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
      if (sessionStorage.getItem('telefone-busca')) {
        this.cs.mostraCarregador();
        this.tbs.buscaState = JSON.parse(<string>sessionStorage.getItem('telefone-busca'));
        return this.ts.postTelefoneBusca(JSON.parse(<string>sessionStorage.getItem('telefone-busca')))
          .pipe(
            take(1),
            mergeMap(dados => {
              if (dados) {
                this.cs.escondeCarregador();
                return of(dados);
              } else {
                this.router.navigate(['/telefone/listar2']);
                return EMPTY;
              }
            })
          );
      } else {
        this.cs.escondeCarregador();
        this.router.navigate(['/telefone/listar2']);
        return EMPTY;
      }
    }
  }

}
