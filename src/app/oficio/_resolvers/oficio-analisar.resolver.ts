import { Injectable } from '@angular/core';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, Resolve } from '@angular/router';
import { OficioInterface } from '../_models';
import { OficioService } from '../_services';
import {CarregadorService} from "../../_services";

@Injectable({
  providedIn: 'root'
})

export class OficioAnalisarResolver implements Resolve<OficioInterface> {

  constructor(
    private router: Router,
    private oficioService: OficioService,
    private cs: CarregadorService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<OficioInterface> | Observable<never> {

    const id = +route.paramMap.get('id');

    return this.oficioService.getOficioIdAnalisar(id)
      .pipe(
        take(1),
        mergeMap(dados => {
          if (dados) {
            this.cs.escondeCarregador();
            return of(dados);
          } else {
            this.router.navigate(['/oficio/listar2']);
            return EMPTY;
          }
        })
      );

  }


}
