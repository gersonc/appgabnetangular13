import { Injectable } from '@angular/core';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, Resolve } from '@angular/router';
import { SolicitacaoService } from '../_services';
import { SolicitacaoExcluirInterface } from '../_models';

@Injectable({
  providedIn: 'root',
})

export class SolicitacaoExcluirResolver implements Resolve<SolicitacaoExcluirInterface> {

  constructor(
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
          if (dados) {
            return of(dados);
          } else {
            this.router.navigate(['/solicitacao/listar']);
            return EMPTY;
          }
        })
      );

  }

}
