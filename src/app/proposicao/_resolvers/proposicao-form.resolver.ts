import { Injectable } from '@angular/core';
import { Observable, of, EMPTY, Subscription, Subject } from 'rxjs';
import { take, mergeMap } from 'rxjs/operators';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, Resolve } from '@angular/router';
import {CarregadorService, DropdownService} from '../../_services';
import { ProposicaoListagemInterface } from '../_models';
import { ProposicaoService } from '../_services';
import { DropdownnomeidClass } from '../../_models';


@Injectable({
  providedIn: 'root',
})
export class ProposicaoFormResolver implements Resolve<ProposicaoListagemInterface | null> {
  private proposicao: ProposicaoListagemInterface | null = null;
  private resp = new Subject<ProposicaoListagemInterface | null>();
  private resp$ = this.resp.asObservable();
  private proposicao_id = 0;
  private esperar = 0;

  constructor(
    private router: Router,
    private proposicaoService: ProposicaoService,
    private dd: DropdownService,
    private cs: CarregadorService
  ) {}

  espera() {
    this.esperar++;
    if (this.esperar === 2) {
      this.esperar = 0;
      this.resp.next(this.proposicao);
    }
  }

  // ***     FORMULARIO      *************************
  getDadosForm() {
    if (this.proposicao_id === 0) {
      setTimeout(() => {
        this.espera();
      }, 200);
    } else {
      this.proposicaoService.getProposicaoAlterar(this.proposicao_id)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.proposicao = dados;
          },
          error: err => {
            console.log(err);
          },
          complete: () => {
            this.espera();
          }
        }
      );
    }

    const ddNomeIdArray = new DropdownnomeidClass();
    let ct = 0;

    if (!sessionStorage.getItem('dropdown-parecer')) {
      const ddParecer = [
        { label: 'FAVORAVEL', value: 'FAVORAVEL' },
        { label: 'NÃO FAVORAVEL', value: 'NÃO FAVORAVEL' },
        { label: 'INDEFINIDO', value: 'INDEFINIDO' },
        { label: 'NENHUM', value: 'NENHUM' },
      ];
      sessionStorage.setItem('dropdown-parecer', JSON.stringify(ddParecer));
    }

    if (!sessionStorage.getItem('dropdown-tipo_proposicao')) {
      ddNomeIdArray.add('ddProposicao_tipo_id', 'tipo_proposicao', 'tipo_proposicao_id', 'tipo_proposicao_nome');
      ct++;
    }
    if (!sessionStorage.getItem('dropdown-area_interesse')) {
      ddNomeIdArray.add('ddProposicao_area_interesse_id', 'area_interesse', 'area_interesse_id', 'area_interesse_nome');
      ct++;
    }
    if (!sessionStorage.getItem('dropdown-origem_proposicao')) {
      ddNomeIdArray.add('ddProposicao_origem_id', 'origem_proposicao', 'origem_proposicao_id', 'origem_proposicao_nome');
      ct++;
    }
    if (!sessionStorage.getItem('dropdown-emenda_proposicao')) {
      ddNomeIdArray.add('ddProposicao_emenda_tipo_id', 'emenda_proposicao', 'emenda_proposicao_id', 'emenda_proposicao_nome');
      ct++;
    }
    if (!sessionStorage.getItem('dropdown-situacao_proposicao')) {
      ddNomeIdArray.add('ddProposicao_situacao_id', 'situacao_proposicao', 'situacao_proposicao_id', 'situacao_proposicao_nome');
      ct++;
    }
    if (!sessionStorage.getItem('dropdown-orgao_proposicao')) {
      ddNomeIdArray.add('ddProposicao_orgao_id', 'orgao_proposicao', 'orgao_proposicao_id', 'orgao_proposicao_nome');
      ct++;
    }

    if (ct > 0) {
      this.dd.postDropdownNomeIdArray(ddNomeIdArray.get())
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            if (dados['ddProposicao_tipo_id']) {
              if (this.proposicao_id === 0) {
                dados['ddProposicao_tipo_id'].unshift(
                  { label: 'NENHUM', value: 0 }
                );
              }
              sessionStorage.setItem('dropdown-tipo_proposicao', JSON.stringify(dados['ddProposicao_tipo_id']));
            }
            if (dados['ddProposicao_area_interesse_id']) {
              sessionStorage.setItem('dropdown-area_interesse', JSON.stringify(dados['ddProposicao_area_interesse_id']));
            }
            if (dados['ddProposicao_origem_id']) {
              sessionStorage.setItem('dropdown-origem_proposicao', JSON.stringify(dados['ddProposicao_origem_id']));
            }
            if (dados['ddProposicao_emenda_tipo_id']) {
              sessionStorage.setItem('dropdown-emenda_proposicao', JSON.stringify(dados['ddProposicao_emenda_tipo_id']));
            }
            if (dados['ddProposicao_situacao_id']) {
              sessionStorage.setItem('dropdown-situacao_proposicao', JSON.stringify(dados['ddProposicao_situacao_id']));
            }
            if (dados['ddProposicao_orgao_id']) {
              dados['ddProposicao_orgao_id'].unshift({ label: 'NENHUM', value: 0 });
              sessionStorage.setItem('dropdown-orgao_proposicao', JSON.stringify(dados['ddProposicao_orgao_id']));
            }
          },
          error: (erro) => {
            console.log(erro);
          },
          complete: () => {
            this.espera();
          }
        });
    } else {
      setTimeout(() => {
        this.espera();
      }, 200);
    }
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<ProposicaoListagemInterface> | null {
    if (route.paramMap.get('id')) {
      this.proposicao_id = +route.paramMap.get('id');
    }
    this.getDadosForm();
    return this.resp$.pipe(
      take(1),
      mergeMap(dados => {
        if (dados) {
          this.cs.escondeCarregador();
          return of(dados);
        } else {
          this.cs.escondeCarregador();
          this.router.navigate(['/proposicao/incluir2']);
          return null;
        }
      })
    );
  }
}
