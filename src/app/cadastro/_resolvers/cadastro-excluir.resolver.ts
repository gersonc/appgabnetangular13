import { Injectable } from '@angular/core';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, Resolve } from '@angular/router';
import { CadastroDetalheCompletoInterface } from '../_models';
import { CadastroService } from '../_services';
import {CarregadorService} from "../../_services";

@Injectable({
  providedIn: 'root'
})

export class CadastroExcluirResolver implements Resolve<CadastroDetalheCompletoInterface> {

  constructor(
    private router: Router,
    private cadastroService: CadastroService,
    private cr: CarregadorService,
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<CadastroDetalheCompletoInterface> | Observable<never> {
    const cadastro_id = +route.paramMap.get('id');
    return this.cadastroService.getDetalheCompleto(cadastro_id)
      .pipe(
        take(1),
        mergeMap(dados => {
          if (dados) {
            this.cr.escondeCarregador();
            return of(dados);
          } else {
            this.cr.escondeCarregador();
            this.router.navigate(['/cadastro/listar']);
            return EMPTY;
          }
        })
      );
  }
}
