import { Injectable } from '@angular/core';
import { Observable, of, EMPTY, Subscription, Subject } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, Resolve } from '@angular/router';
import { DropdownService } from '../../_services';
import { CarregadorService } from '../../_services';
import { DropdownnomeidClass } from '../../_models';
import { SelectItem } from 'primeng/api';



@Injectable({
  providedIn: 'root'
})
export class EmendaIncluirResolver implements Resolve<boolean | null> {
  private sub: Subscription[] = [];
  private resp = new Subject<boolean>();
  private resp$ = this.resp.asObservable();
  private dropdown = false;

  constructor(
    private router: Router,
    private dd: DropdownService,
    private cs: CarregadorService
  ) {}



  populaDropdown() {
    let contador = 0;

    if (!sessionStorage.getItem('dropdown-emenda_situacao')) {
      const emendaSituacao: SelectItem[] = [
        {label: 'CONTEMPLADO', value: 'CONTEMPLADO'},
        {label: 'EM ABERTO', value: 'EM ABERTO'},
        {label: 'PRIORIDADE', value: 'PRIORIDADE'},
        {label: 'EMPENHADO', value: 'EMPENHADO'},
        {label: 'NÃO EMPENHADO', value: 'NÃO EMPENHADO'},
        {label: 'CONTINGENCIADO', value: 'CONTINGENCIADO'},
        {label: 'MINUTA DE EMPENHO', value: 'MINUTA DE EMPENHO'},
        {label: 'PAGO', value: 'PAGO'},
        {label: 'PAGO PARCIALMENTE', value: 'PAGO PARCIALMENTE'},
        {label: 'NÃO PAGO', value: 'NÃO PAGO'},
        {label: 'EMPENHO CANCELADO', value: 'EMPENHO CANCELADO'}
      ];
      sessionStorage.setItem('dropdown-emenda_situacao', JSON.stringify(emendaSituacao));
      contador++;
      if (contador === 3) {
        this.espera();
      }
    } else {
      contador++;
      if (contador === 3) {
        this.espera();
      }
    }

    if (!sessionStorage.getItem('dropdown-tipo_cadastro')) {
      const d = {
        tabela: 'tipo_cadastro',
        campo_id: 'tipo_cadastro_id',
        campo_nome: 'tipo_cadastro_nome',
        campo_pesquisa: 'tipo_cadastro_tipo',
        valor_pesquisa: 0
      };

      this.sub.push(this.dd.postDropdown3campos(d)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            sessionStorage.setItem('dropdown-tipo_cadastro', JSON.stringify(dados));
          },
          error: (erro) => {
            console.log(erro);
          },
          complete: () => {
            contador++;
            if (contador === 3) {
              this.espera();
            }
          }
        })
      );
    } else {
      contador++;
      if (contador === 3) {
        this.espera();
      }
    }

    const ddNomeIdArray = new DropdownnomeidClass();

    // ****** emenda_assunto_id *****
    if (!sessionStorage.getItem('dropdown-assunto')) {
      ddNomeIdArray.add('emenda_assunto_id', 'assunto', 'assunto_id', 'assunto_nome');
    }
    // ****** emenda_local_id *****
    if (!sessionStorage.getItem('dropdown-local')) {
      ddNomeIdArray.add('emenda_local_id', 'local', 'local_id', 'local_nome');
    }
    // ****** emenda_tipo_emenda_id *****
    if (!sessionStorage.getItem('dropdown-tipo_emenda')) {
      ddNomeIdArray.add('emenda_tipo_emenda_id', 'tipo_emenda', 'tipo_emenda_id', 'tipo_emenda_nome');
    }
    // ****** emenda_ogu_id *****
    if (!sessionStorage.getItem('dropdown-ogu')) {
      ddNomeIdArray.add('emenda_ogu_id', 'ogu', 'ogu_id', 'ogu_nome');
    }

    if (ddNomeIdArray.count() > 0) {
      this.sub.push(this.dd.postDropdownNomeIdArray(ddNomeIdArray.get())
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            if (dados['emenda_assunto_id']) {
              sessionStorage.setItem('dropdown-assunto', JSON.stringify(dados['emenda_assunto_id']));
            }
            if (dados['emenda_local_id']) {
              sessionStorage.setItem('dropdown-local', JSON.stringify(dados['emenda_local_id']));
            }
            if (dados['emenda_tipo_emenda_id']) {
              sessionStorage.setItem('dropdown-tipo_emenda', JSON.stringify(dados['emenda_tipo_emenda_id']));
            }
            if (dados['emenda_ogu_id']) {
              sessionStorage.setItem('dropdown-ogu', JSON.stringify(dados['emenda_ogu_id']));
            }
          },
          error: err => {
            console.log(err);
          },
          complete: () => {
            contador++;
            if (contador === 3) {
              this.espera();
            }
          }
        })
      );
    } else {
      contador++;
      if (contador === 3) {
        this.espera();
      }
    }
  }

  espera() {
    setTimeout(() => {
      this.resp.next(true);
    }, 200);
  }


  onDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

  resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean> | Observable<never> {
    this.cs.mostraCarregador();
    this.populaDropdown();
    return this.resp$.pipe(
      take(1),
      mergeMap(vf => {
        if (vf) {
          this.onDestroy();
          this.cs.escondeCarregador();
          return of(vf);
        } else {
          this.onDestroy();
          this.cs.escondeCarregador();
          return EMPTY;
        }
      })
    );
  }
}
