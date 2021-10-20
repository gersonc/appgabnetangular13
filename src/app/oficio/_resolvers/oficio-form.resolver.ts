import { Injectable } from '@angular/core';
import { Observable, of, EMPTY, Subscription, Subject } from 'rxjs';
import { take, mergeMap } from 'rxjs/operators';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, Resolve } from '@angular/router';
import { DropdownService } from '../../_services';
import { OficioGetAlterar, OficioGetAlterarInterface } from '../_models';
import { OficioService } from '../_services';
import { DropdownnomeidClass } from '../../_models';


@Injectable({
  providedIn: 'root',
})
export class OficioFormResolver implements Resolve<OficioGetAlterarInterface> {

  ddNomeIdArray = new DropdownnomeidClass();
  oficioAlterar = new OficioGetAlterar();
  private resp = new Subject<OficioGetAlterarInterface>();
  private resp$ = this.resp.asObservable();

  private sub: Subscription[] = [];

  constructor(
    private router: Router,
    private oficioService: OficioService,
    private dd: DropdownService,
  ) {}

  // ***     FORMULARIO      *************************
  getAlterar(id: number) {
    let contador = 0;


    const ddNomeIdArray = new DropdownnomeidClass();
    let ct = 0;
    if (!sessionStorage.getItem('dropdown-prioridade')) {
      ddNomeIdArray.add('ddprioridade_id', 'prioridade', 'prioridade_id', 'prioridade_nome');
      ct++;
    }
    if (!sessionStorage.getItem('dropdown-andamento')) {
      ddNomeIdArray.add('ddandamento_id', 'andamento', 'andamento_id', 'andamento_nome');
      ct++;
    }
    if (!sessionStorage.getItem('dropdown-tipo_recebimento')) {
      ddNomeIdArray.add('ddrecebimento_id', 'tipo_recebimento', 'tipo_recebimento_id', 'tipo_recebimento_nome');
      ct++;
    }
    if (ct > 0) {
      this.sub.push(this.dd.postDropdownNomeIdArray(ddNomeIdArray.get())
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            if (dados['ddrecebimento_id']) {
              sessionStorage.setItem('dropdown-tipo_recebimento', JSON.stringify(dados['ddrecebimento_id']));
            }
            if (dados['ddandamento_id']) {
              sessionStorage.setItem('dropdown-andamento', JSON.stringify(dados['ddandamento_id']));
            }
            if (dados['ddprioridade_id']) {
              sessionStorage.setItem('dropdown-prioridade', JSON.stringify(dados['ddprioridade_id']));
            }
          },
          error: (erro) => {
            console.log(erro);
          },
          complete: () => {
            contador++;
            if (contador === 2) {
              this.resp.next(this.oficioAlterar);
            }
          }
        }));
    } else {
      contador++;
      if (contador === 2) {
        this.resp.next(this.oficioAlterar);
      }
    }

    this.sub.push(this.oficioService.getOficioAlterar(id)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.oficioAlterar.oficio = dados['oficio'];
        },
        error: (erro) => {
          console.log(erro);
        },
        complete: () => {
          contador++;
          if (contador === 2) {
            this.resp.next(this.oficioAlterar);
          }
        }
      }));
  }

  onDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<OficioGetAlterarInterface> | Observable<never> {

    const id = +route.paramMap.get('id');
    this.getAlterar(id);
    return this.resp$.pipe(
      take(1),
      mergeMap(dados => {
        if (dados) {
          this.onDestroy();
          return of(dados);
        } else {
          this.onDestroy();
          this.router.navigate(['/oficio/listar2']);
          return EMPTY;
        }
      })
    );
  }
}
