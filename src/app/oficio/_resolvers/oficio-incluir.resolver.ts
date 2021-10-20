import { Injectable } from '@angular/core';
import { Observable, of, EMPTY, Subscription, Subject } from 'rxjs';
import { take, mergeMap } from 'rxjs/operators';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, Resolve } from '@angular/router';
import { DropdownService } from '../../_services';
import { OficioIncluirForm, OficioIncluirFormInterface } from '../_models';
import { OficioService } from '../_services';
import { DropdownnomeidClass } from '../../_models';

@Injectable({
  providedIn: 'root',
})

export class OficioIncluirResolver implements Resolve<OficioIncluirForm | null> {
  private contador = 0;
  private ddNomeIdArray = new DropdownnomeidClass();
  private oficioIncluir = new OficioIncluirForm();
  private resp = new Subject<OficioIncluirForm>();
  private resp$ = this.resp.asObservable();
  private sub: Subscription[] = [];

  constructor(
    private router: Router,
    private oficioService: OficioService,
    private dd: DropdownService,
  ) {}

  // ***     FORMULARIO      *************************
  getProcessoId(processo_id: number) {
    this.sub.push(this.oficioService.getProcessoId(this.oficioIncluir.oficio_processo_id)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          console.log('log1');
          this.oficioIncluir.oficio_codigo = dados['oficio_codigo'];
          this.oficioIncluir.processo_numero = dados['processo_numero'];
          this.oficioIncluir.solicitacao_cadastro_nome = dados['solicitacao_cadastro_nome'];
          this.oficioIncluir.solicitacao_assunto_nome = dados['solicitacao_assunto_nome'];
          this.oficioIncluir.solicitacao_data = dados['solicitacao_data'];
          this.oficioIncluir.solicitacao_area_interesse_nome = dados['solicitacao_area_interesse_nome'];
          this.oficioIncluir.solicitacao_descricao = dados['solicitacao_descricao'];
          this.oficioIncluir.cadastro_municipio_nome = dados['cadastro_municipio_nome'];
        },
        error: (erro) => {
          console.log(erro);
        },
        complete: () => {
          this.contador++;
          if (this.contador === 2) {
            this.resp.next(this.oficioIncluir);
          }
        }
      }));
  }

  carregaDropDown() {
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
    if (ddNomeIdArray.count() > 0) {
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
            this.contador++;
            if (this.contador === 2) {
              this.resp.next(this.oficioIncluir);
            }
          }
        }));
    } else {
      this.contador++;
      if (this.contador === 2) {
        this.resp.next(this.oficioIncluir);
      }
    }



    if (this.oficioIncluir.solicitacao) {
      this.getProcessoId(this.oficioIncluir.oficio_processo_id);
    } else {
      this.sub.push(this.dd.postDropdownOficio('oficio_processo_id3')
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.oficioIncluir.ddOficio_processo_id = dados['processo'];
            this.oficioIncluir.processoLabelLenght = dados['tamanho'] + 'px';
          },
          error: err => console.log(err.toString()),
          complete: () => {
            this.contador++;
            if (this.contador === 2) {
              this.resp.next(this.oficioIncluir);
            }
          }
        }));
    }
  }

  onDestroy(): void {
    this.contador = 0;
    this.sub.forEach(s => s.unsubscribe());
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<OficioIncluirForm | null> {

    if (route.paramMap.get('id')) {
      this.oficioIncluir.oficio_processo_id = +route.paramMap.get('id');
      this.oficioIncluir.solicitacao = true;
    } else {
      this.oficioIncluir.solicitacao = false;
    }

    this.carregaDropDown();
    return this.resp$.pipe(
      take(1),
      mergeMap(dados => {
        if (dados) {
          this.onDestroy();
          return of(dados);
        } else {
          this.onDestroy();
          this.router.navigate(['/oficio/listar2']);
          return null;
        }
      })
    );
  }
}
