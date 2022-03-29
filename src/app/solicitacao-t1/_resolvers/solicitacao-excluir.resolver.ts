import { Injectable } from '@angular/core';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, Resolve } from '@angular/router';
import { SolicitacaoService } from '../_services';
import { SolicitacaoExcluirInterface } from '../_models';
import {CarregadorService} from "../../_services";

@Injectable({
  providedIn: 'root',
})

export class SolicitacaoExcluirResolver implements Resolve<SolicitacaoExcluirInterface> {

  constructor(
    private cs: CarregadorService,
    private solicitacaoService: SolicitacaoService,
    private router: Router
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<SolicitacaoExcluirInterface>
    | Observable<never> {

    const id = +route.paramMap.get('id');
    return this.solicitacaoService.getSolicitacaoExcluir(id)
      .pipe(
        take(1),
        mergeMap(dados => {
          this.cs.escondeCarregador();
          if (dados) {
            return of(dados);
          } else {
            this.router.navigate(['/solicitacaot1/listar']);
            return EMPTY;
          }
        })
      );

  }

}
