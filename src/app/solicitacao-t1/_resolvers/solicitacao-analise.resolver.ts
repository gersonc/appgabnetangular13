import { Injectable } from '@angular/core';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, Resolve } from '@angular/router';
import { SolicitacaoService } from '../_services';
import { SolicitacaoCadastroAnalise } from '../_models';
import {CarregadorService} from "../../_services";

@Injectable({
  providedIn: 'root',
})
export class SolicitacaoAnaliseResolver implements Resolve<SolicitacaoCadastroAnalise> {

  constructor(
    private cs: CarregadorService,
    private solicitacaoService: SolicitacaoService,
    private router: Router
  ) { }
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<SolicitacaoCadastroAnalise>
    | Observable<never> {
      this.cs.mostraCarregador();
      const id = +route.paramMap.get('id');
      return this.solicitacaoService.getSolicitacaoAnalise(id)
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
