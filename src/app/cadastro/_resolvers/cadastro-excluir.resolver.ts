import { Injectable } from '@angular/core';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, Resolve } from '@angular/router';
import {CadastroService} from "../_services/cadastro.service";


@Injectable({
  providedIn: 'root'
})

export class CadastroExcluirResolver implements Resolve<boolean | never> {

  constructor(
    private router: Router,
    private cs: CadastroService,
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | never> {
    const cadastro_id = +route.paramMap.get('id');
    return this.cs.getCadastroVinculos(cadastro_id)
      .pipe(
        take(1),
        mergeMap(dados => {
          if (dados) {
            this.cs.cadastroVinculos = dados;
            return of(true);
          } else {
            this.router.navigate(['/cadastro/listar']);
            return EMPTY;
          }
        })
      );
  }
}
