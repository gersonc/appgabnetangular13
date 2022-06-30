import {Injectable} from '@angular/core';
import {Observable, of, Subject, Subscription} from 'rxjs';
import {mergeMap, take} from 'rxjs/operators';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {OficioIncluirForm} from '../_models';
import {OficioFormService, OficioService} from '../_services';
import {DropdownnomeidClass} from '../../_models';
import {DdService} from "../../_services/dd.service";
import {DdOficioProcessoId} from "../_models/oficio-i";

@Injectable({
  providedIn: 'root',
})

export class OficioIncluirResolver implements Resolve<boolean | never> {
  private contador = 0;
  private ddNomeIdArray = new DropdownnomeidClass();
  private oficioIncluir = new OficioIncluirForm();
  private oficioProcessoId: DdOficioProcessoId = {
    processo_id: 0
  };
  // private resp = new Subject<OficioIncluirForm>();
  // private resp = new Subject<OficioIncluirForm>();
  // private resp$ = this.resp.asObservable();
  resp: Subject<boolean>;
  resp$: Observable<boolean>
  private sub: Subscription[] = [];
  dds: string[] = [];
  ct = 0;

  constructor(
    private router: Router,
    // private cs: CarregadorService,
    private oficioService: OficioService,
    // private dd: DropdownService,
    private dd: DdService,
    private ofs: OficioFormService
  ) {
  }

  espera(v: boolean) {
    this.resp.next(v);
    this.resp.complete();
  }

  /*espera(v: boolean) {
    this.ct++;
    if(this.ct === 2) {
      if(this.oficioProcessoId.processo_id === 0) {
        this.resp.next(true);
      } else {
        this.resp.next(v);
      }
      this.resp.complete();
    }
  }*/

  // ***     FORMULARIO      *************************
  /*getProcessoId(processo_id: number) {
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
  }*/

  getProcessoId(processo_id: number) {
    this.sub.push(this.oficioService.getDdProcessoId(processo_id)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.oficioProcessoId = dados
          /*console.log('log1');
          this.oficioIncluir.oficio_codigo = dados['oficio_codigo'];
          this.oficioIncluir.processo_numero = dados['processo_numero'];
          this.oficioIncluir.solicitacao_cadastro_nome = dados['solicitacao_cadastro_nome'];
          this.oficioIncluir.solicitacao_assunto_nome = dados['solicitacao_assunto_nome'];
          this.oficioIncluir.solicitacao_data = dados['solicitacao_data'];
          this.oficioIncluir.solicitacao_area_interesse_nome = dados['solicitacao_area_interesse_nome'];
          this.oficioIncluir.solicitacao_descricao = dados['solicitacao_descricao'];
          this.oficioIncluir.cadastro_municipio_nome = dados['cadastro_municipio_nome'];*/
        },
        error: (erro) => {
          console.log(erro);
        },
        complete: () => {
          // this.espera(this.oficioProcessoId);
          this.espera(true);
        }
      }));
  }


  carregaDropDown(): boolean {

    this.dds = [];
    this.resp = new Subject<boolean>();
    this.resp$ = this.resp.asObservable();
    console.log('oficio resolver incluir');
    /*if (this.oficioProcessoId.processo_id !== 0) {
      /!*this.resp = new Subject<DdOficioProcessoId>();
      this.resp$ = this.resp.asObservable();*!/
      this.getProcessoId(this.oficioProcessoId.processo_id);
    } else {
      /!*this.resp = new Subject<boolean>();
      this.resp$ = this.resp.asObservable();*!/
      this.espera(true);
    }*/
    // 'dropdown-oficio_processo_dd'


    if (!sessionStorage.getItem('dropdown-prioridade')) {
      this.dds.push('dropdown-prioridade');
    }
    // ****** solicitacao_assunto_id *****
    if (!sessionStorage.getItem('dropdown-andamento')) {
      this.dds.push('dropdown-andamento');
    }

    // ****** solicitacao_tipo_recebimento_id *****
    if (!sessionStorage.getItem('dropdown-tipo_recebimento')) {
      this.dds.push('dropdown-tipo_recebimento');
    }

    // ****** solicitacao_local_id *****
    if (this.ofs.oficioProcessoId !== null) {
      if (this.ofs.processo_id > 0) {
        sessionStorage.removeItem('dropdown-oficio_processo_dd');
        this.dds.push('dropdown-oficio_processo_dd');
      } else {
        if (!sessionStorage.getItem('dropdown-oficio_processo_dd')) {
          this.dds.push('dropdown-oficio_processo_dd');
        }
      }
    }


    if (this.dds.length > 0) {
      this.sub.push(this.dd.getDd(this.dds)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.dds.forEach(nome => {
              sessionStorage.setItem(nome, JSON.stringify(dados[nome]));
            });
          },
          error: (err) => {
            console.error(err);
          },
          complete: () => {
            this.espera(true);
          }
        })
      );
      return true;
    } else {
      // this.espera(false);
      return false
    }

  }

  /*carregaDropDown() {
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
            if (dados['oficio_processo_id']) {
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
  }*/

  onDestroy(): void {
    this.contador = 0;
    this.sub.forEach(s => s.unsubscribe());
    // this.cs.escondeCarregador();
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | never> {

    if (this.carregaDropDown()) {
      return this.resp$.pipe(
        take(1),
        mergeMap(dados => {
          console.log('resolver3');
          this.onDestroy();
          return of(dados);
        })
      );
    } else {
      console.log('resolver4');
      this.onDestroy();
      return of(false);
    }
  }
}
