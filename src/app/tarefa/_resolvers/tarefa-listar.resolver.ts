import { Injectable } from '@angular/core';
import { Observable, of, EMPTY, Subscription, Subject } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, Resolve } from '@angular/router';
import { DropdownService } from '../../_services';
import { CarregadorService } from '../../_services';
import { SelectItem } from 'primeng/api';
import { TarefaDropdownInterface, TarefaPaginacaoInterface } from "../_models";
import { TarefaBuscaService, TarefaService } from "../_services";
import { ArquivoService } from "../../arquivo/_services";


@Injectable({
  providedIn: 'root'
})

export class TarefaListarResolver implements Resolve<TarefaPaginacaoInterface | boolean>{

  private sub: Subscription[] = [];
  private resp = new Subject<TarefaPaginacaoInterface | boolean>();
  private resp$ = this.resp.asObservable();
  private dropdown = false;
  private drop: SelectItem[];
  private drop2: any[];

  constructor(
    private router: Router,
    private dd: DropdownService,
    private cs: CarregadorService,
    private tbs: TarefaBuscaService,
    private ts: TarefaService,
    private as: ArquivoService
  ) { }

  populaDropdown() {
    let a = 0;
    if (!sessionStorage.getItem('dropdown-tarefa_situacao')) {
      const busca = {tabela: 'tarefa_situacao', campo_id: 'tarefa_situacao_id', campo_nome: 'tarefa_situacao_nome'};
      this.dd.postDropdownNomeId(busca)
        .pipe(take(1))
        .subscribe((dados) => {
            this.drop = dados;
          },
          error1 => {
            console.log('erro');
          },
          () => {
            sessionStorage.setItem('dropdown-tarefa_situacao', JSON.stringify(this.drop));
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

    if (!sessionStorage.getItem('tarefa-dropdown')) {
      this.dd.getDropdownTarefaAutores()
        .pipe(take(1))
        .subscribe((dados) => {
            this.drop2 = dados;
          },
          error1 => {
            console.log('erro');
          },
          () => {
            sessionStorage.setItem('tarefa-dropdown', JSON.stringify(this.drop2));
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
    Observable<TarefaPaginacaoInterface | boolean> | Observable<never> {
    this.as.verificaPermissoes();
    if (!sessionStorage.getItem('dropdown-tarefa_situacao') || !sessionStorage.getItem('tarefa-dropdown')) {
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
      if (sessionStorage.getItem('tarefa-busca')) {
        this.cs.mostraCarregador();
        this.tbs.buscaState = JSON.parse(sessionStorage.getItem('tarefa-busca'));
        return this.ts.postTarefaBusca(JSON.parse(sessionStorage.getItem('tarefa-busca')))
          .pipe(
            take(1),
            mergeMap(dados => {
              if (dados) {
                this.cs.escondeCarregador();
                return of(dados);
              } else {
                this.router.navigate(['/tarefa/listar']);
                this.cs.escondeCarregador();
                return EMPTY;
              }
            })
          );
      } else {
        this.router.navigate(['/tarefa/listar2']);
        this.cs.escondeCarregador();
        return EMPTY;
      }
    }
  }
}
