import { Injectable } from '@angular/core';
import { Observable, of, EMPTY, Subscription, Subject } from 'rxjs';
import { take, mergeMap } from 'rxjs/operators';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, Resolve } from '@angular/router';
import { ProposicaoListagemInterface } from '../_models';
import { ProposicaoService } from '../_services';


@Injectable({
  providedIn: 'root',
})

export class ProposicaoDetalheExcluirResolver implements Resolve<ProposicaoListagemInterface | null> {
  private proposicao: ProposicaoListagemInterface | null = null;
  private resp = new Subject<ProposicaoListagemInterface | null>();
  private resp$ = this.resp.asObservable();
  private proposicao_id = 0;
  private esperar = 0;


  constructor(
    private router: Router,
    private proposicaoService: ProposicaoService,
  ) {}


  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<ProposicaoListagemInterface> | null {
    if (!route.paramMap.get('id')) {
      this.router.navigate(['/proposicao/busca']);
      return null;
    }
    const id = +route.paramMap.get('id');
    return this.proposicaoService.getProposicaoExcluir(id)
      .pipe(
      take(1),
      mergeMap(dados => {
        if (dados) {
          return of(dados);
        } else {
          this.router.navigate(['/proposicao/busca']);
          return null;
        }
      })
    );
  }
}
