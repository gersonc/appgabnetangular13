import { Injectable } from '@angular/core';
import { Observable, of, EMPTY, Subscription, Subject } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, Resolve } from '@angular/router';
import { DropdownService } from '../../_services';
import { DropdownnomeidClass } from '../../_models';
import { CarregadorService } from '../../_services';

import { PassagemBuscaService, PassagemService } from '../_services';
import { PassagemPaginacaoInterface } from '../_models';
import { SelectItem } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})

export class PassagemListarResolver implements Resolve<PassagemPaginacaoInterface | boolean> {
  private ddNomeIdArray = new DropdownnomeidClass();
  private sub: Subscription[] = [];
  private resp = new Subject<PassagemPaginacaoInterface | boolean>();
  private resp$ = this.resp.asObservable();
  private dropdown = false;
  private drop: SelectItem[];
  private drop2: string[];

  constructor(
    private router: Router,
    private dd: DropdownService,
    private cs: CarregadorService,
    private tbs: PassagemBuscaService,
    private ts: PassagemService
  ) { }

  populaDropdown() {
    let contador = 0;
    let a = 0;

    // ****** aerolinha *****
    if (!sessionStorage.getItem('dropdown-aerolinha')) {
      a++;
      this.ddNomeIdArray.add('dropdown_aerolinha', 'aerolinha', 'aerolinha_id', 'aerolinha_nome');
    }
    // ****** passagem_aerolinha *****
    if (!sessionStorage.getItem('passagem_aerolinha-dropdown')) {
      a++;
      this.ddNomeIdArray.add('passagem_aerolinha_dropdown', 'passagem', 'passagem_aerolinha_id', 'passagem_aerolinha_nome');
    }

    if (a > 0) {
      this.dd.postDropdownNomeIdArray(this.ddNomeIdArray.get())
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            if (dados['dropdown_aerolinha']) {
              sessionStorage.setItem('dropdown-aerolinha', JSON.stringify(dados['dropdown_aerolinha']));
            }
            if (dados['passagem_aerolinha_dropdown']) {
              sessionStorage.setItem('passagem_aerolinha-dropdown', JSON.stringify(dados['passagem_aerolinha_dropdown']));
            }
          },
          error: (err) => {
            console.error(err);
          },
          complete: () => {
            contador++;
            if (contador === 2) {
              this.resp.next(true);
            }
          }
        });
    } else {
      contador++;
      if (contador === 2) {
        this.resp.next(true);
      }
    }


    if (!sessionStorage.getItem('passagem_beneficiario-dropdown')) {
      const busca  = {tabela: 'passagem', campo_nome: 'passagem_beneficiario'};
      this.dd.postDropdownSoNome(busca)
        .pipe(take(1))
        .subscribe((dados) => {
            if (dados) {
              sessionStorage.setItem('passagem_beneficiario-dropdown', JSON.stringify(dados));
            }
          },
          error1 => {
            console.log('erro');
          },
          () => {
            contador++;
            if (contador === 2) {
              this.resp.next(true);
            }
          });
    } else {
      contador++;
      if (contador === 2) {
        this.resp.next(true);
      }
    }
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):
    Observable<PassagemPaginacaoInterface | boolean> |
    Observable<never> {
    if (!sessionStorage.getItem('dropdown-aerolinha') ||
      !sessionStorage.getItem('passagem_aerolinha-dropdown') ||
      !sessionStorage.getItem('passagem_beneficiario-dropdown')
    ) {
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
      if (sessionStorage.getItem('passagem-busca')) {
        this.cs.mostraCarregador();
        this.tbs.buscaState = JSON.parse(sessionStorage.getItem('passagem-busca'));
        return this.ts.postPassagemBusca(JSON.parse(sessionStorage.getItem('passagem-busca')))
          .pipe(
            take(1),
            mergeMap(dados => {
              if (dados) {
                this.cs.escondeCarregador();
                return of(dados);
              } else {
                this.cs.escondeCarregador();
                this.router.navigate(['/passagem/listar2']);
                return EMPTY;
              }
            })
          );
      } else {
        this.cs.escondeCarregador();
        this.router.navigate(['/passagem/listar2']);
        return EMPTY;
      }
    }
  }

}
