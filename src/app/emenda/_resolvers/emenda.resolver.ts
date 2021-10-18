import { Injectable } from '@angular/core';
import { Observable, of, EMPTY, Subscription, Subject } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, Resolve } from '@angular/router';
import { DropdownService } from '../../util/_services';
import { CarregadorService } from '../../_services';
import {EmendaBuscaService, EmendaService} from "../_services";
import {EmendaPaginacaoInterface} from "../_models";



@Injectable({
  providedIn: 'root'
})
export class EmendaResolver implements Resolve<any[] | boolean | EmendaPaginacaoInterface> {
  emendaDropdownMenu: any[];
  private sub: Subscription[] = [];
  private resp = new Subject<boolean>();
  private resp$ = this.resp.asObservable();
  private dropdown = false;

  constructor(
    private router: Router,
    private dd: DropdownService,
    private cs: CarregadorService,
    private es: EmendaService,
    private ebs: EmendaBuscaService
  ) {}

  populaDropdown() {
    if (!sessionStorage.getItem('emenda-dropdown-menu')) {
      this.sub.push(this.dd.getDropdownEmendaMenuTodos()
        .pipe(take(1))
        .subscribe((dados) => {
            this.emendaDropdownMenu = dados;
          },
          (err) => console.error(err),
          () => {
              this.gravaDropDown();
          }
        )
      );
    }
  }

  gravaDropDown() {
    if (!sessionStorage.getItem('emenda-dropdown-menu')) {
      sessionStorage.setItem('emenda-dropdown-menu', JSON.stringify(this.emendaDropdownMenu));
    }
    this.resp.next(true);
  }

  onDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

  // @ts-ignore
  resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any[]> | Observable<boolean> | Observable<never> | Observable<EmendaPaginacaoInterface>{
    this.es.getTitulos();
    if (sessionStorage.getItem('emenda-busca')) {
      this.cs.mostraCarregador();
      this.ebs.buscaState = JSON.parse(sessionStorage.getItem('emenda-busca'));
      return this.es.postEmendaBusca(JSON.parse(sessionStorage.getItem('emenda-busca')))
        .pipe(
          take(1),
          mergeMap(dados => {
            if (!sessionStorage.getItem('emenda-dropdown-menu')) {
              this.populaDropdown();
            }
            if (dados) {
              return of(dados);
            } else {
              this.router.navigate(['/emenda/listar']);
              return EMPTY;
            }
          })
        );
    }
    if (!sessionStorage.getItem('emenda-dropdown-menu')) {
      this.dropdown = true;
      this.cs.mostraCarregador();
      this.populaDropdown();
      return this.resp$.pipe(
        take(1),
        mergeMap(vf => {
          if (vf) {
            this.onDestroy();
            return of(vf);
          } else {
            this.onDestroy();
            return EMPTY;
          }
        })
      );
    }
  }
}
