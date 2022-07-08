import { Injectable } from '@angular/core';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, Resolve } from '@angular/router';
import { ProcessoDetalheInterface } from '../_models';
import { ProcessoService } from '../_services';
import {CarregadorService} from "../../_services";

@Injectable({
  providedIn: 'root'
})

export class ProcessoUtilResolver implements Resolve<ProcessoDetalheInterface> {

  constructor(
    private router: Router,
    private processoService: ProcessoService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<ProcessoDetalheInterface> | Observable<never> {
    const id = +route.paramMap.get('id');
    return this.processoService.getProcessoDetalhe(id)
      .pipe(
        take(1),
        mergeMap(dados => {
          if (dados) {
            return of(dados);
          } else {
            this.router.navigate(['/processo/listar2']);
            return EMPTY;
          }
        })
      );
  }
}
