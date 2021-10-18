import { Injectable } from '@angular/core';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, Resolve } from '@angular/router';
import { OficioDetalheInterface } from '../_models';
import { OficioService } from '../_services';

@Injectable({
  providedIn: 'root'
})

export class OficioDetalheResolver implements Resolve<OficioDetalheInterface> {


  constructor(
    private router: Router,
    private oficioService: OficioService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<OficioDetalheInterface> | Observable<never> {

    const id = +route.paramMap.get('id');

    return this.oficioService.getOficioDetalhe(id)
      .pipe(
        take(1),
        mergeMap(dados => {
          if (dados) {
            return of(dados);
          } else {
            this.router.navigate(['/oficio/listar2']);
            return EMPTY;
          }
        })
      );

  }


}
