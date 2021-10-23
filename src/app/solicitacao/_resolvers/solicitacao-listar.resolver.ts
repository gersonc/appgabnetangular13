import { Injectable } from '@angular/core';
import { Observable, EMPTY } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, Resolve } from '@angular/router';
import { CarregadorService } from '../../_services';
import { SolicitacaoDropdownMenuListarInterface, SolicitacaoPaginacaoInterface} from '../_models';
import { SolicitacaoDropdownMenuService, SolicitacaoService } from '../_services';


@Injectable({
  providedIn: 'root'
})
export class SolicitacaoListarResolver implements
  Resolve<boolean | SolicitacaoPaginacaoInterface> {

  constructor(
    private router: Router,
    private cs: CarregadorService,
    private solicitacaoService: SolicitacaoService,
    private sdd: SolicitacaoDropdownMenuService
  ) { }

  getBusca(): Observable<SolicitacaoPaginacaoInterface> {
    return this.solicitacaoService.postSolicitacaoBusca(JSON.parse(sessionStorage.getItem('solicitacao-busca')))
      .pipe(take(1));
  }

  getDropDown(): Observable<boolean> {
    return this.sdd.populaDropdownMenu
      .pipe(take(1));
  }

  /*getResposta(): Observable<boolean | SolicitacaoPaginacaoInterface> {
    if (sessionStorage.getItem('solicitacao-busca')) {
      return this.sdd.populaDropdownMenu
        .pipe(take(1),
          mergeMap(vf => {
            return this.solicitacaoService.postSolicitacaoBusca(JSON.parse(sessionStorage.getItem('solicitacao-busca')))
              .pipe(take(1));
          })
        );
    } else {
      return this.sdd.populaDropdownMenu
        .pipe(take(1));
    }
  }*/

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):
    Observable<boolean> | Observable<SolicitacaoPaginacaoInterface> | Observable<never> {
    if (!sessionStorage.getItem('solicitacao-dropdown') || sessionStorage.getItem('solicitacao-busca')) {
      // this.cs.fechaMenu();
      this.cs.mostraCarregador();
      return this.getDropDown();
    } else {
      if (sessionStorage.getItem('solicitacao-busca')) {
        this.cs.mostraCarregador();
        return this.getBusca();
      } else {
        // this.cs.fechaMenu();
        this.router.navigate(['/solicitacao/listar2']);
        return EMPTY;
      }
    }
  }
}
