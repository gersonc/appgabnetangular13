import { Injectable } from '@angular/core';
import {
  Configuracao2Model,
  Configuracao2ModelInterface,
  ConfiguracaoModel,
  ConfiguracaoModelInterface
} from "../_models/configuracao-model";
import { DropdownService, UrlService } from "../../_services";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, Subscription } from "rxjs";
import { take } from "rxjs/operators";
import { SelectItem, SelectItemGroup } from "primeng/api";
import {DdService} from "../../_services/dd.service";

@Injectable({
  providedIn: 'root'
})
export class ConfiguracaoService {
  public configuracao: ConfiguracaoModelInterface | null = null;
  public confTitulo: ConfiguracaoModelInterface = {};
  public configuracao2: Configuracao2ModelInterface | null = null;
  private sub: Subscription[] = [];

  constructor(
    private url: UrlService,
    private http: HttpClient,
    private dd2: DropdownService,
    private dd: DdService,
  ) { }

  postListarAll(dados: any[]): Observable<any[]> {
    const url = this.url.configuracao + '/listar';
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.post<any[]>(url, dados, httpOptions);
  }

  getConfiguracao(dado) {
    switch (dado) {
      case 'area_interesse' :
        this.configuracao.titulo = 'ÁREA DE INTERESSE';
        break;
    }
  }

  impactoAlterar(dados: any[]): Observable<any[]> {
    const url = this.url.configuracao + '/impactoalterar';
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.post<any[]>(url, dados, httpOptions);
  }

  alterar(dados: any[]): Observable<any[]> {
    const url = this.url.configuracao;
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.put<any[]>(url, dados, httpOptions);
  }

  verificaIncluir(dados: any[]): Observable<any[]> {
    const url = this.url.configuracao + '/verificaincluir';
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.post<any[]>(url, dados, httpOptions);
  }

  incluir(dados: any[]): Observable<any[]> {
    const url = this.url.configuracao + '/incluir';
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.post<any[]>(url, dados, httpOptions);
  }

  impactoDelete(dados: any[]): Observable<any[]> {
    const url = this.url.configuracao + '/impactodelete';
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.post<any[]>(url, dados, httpOptions);
  }

  deletar(dados: any): Observable<any[]> {
    const url = this.url.configuracao;
    const httpOptions = {
      headers: new HttpHeaders ({ 'Content-Type': 'application/json' }),
      body: dados
    };
    return this.http.delete<any[]>(url, httpOptions);
  }

  corrigeDropdown(dado: string) {
    switch (dado) {
      case 'area_interesse' :
        this.corrigeSimples('dropdown-area_interesse', 'area_interesse', 'area_interesse_id', 'area_interesse_nome');
        break;
      case 'assunto' :
        this.corrigeSimples('dropdown-assunto', 'assunto', 'assunto_id', 'assunto_nome');
        break;
      case 'aerolinha' :
        this.corrigeSimples('dropdown-aerolinha', 'aerolinha', 'aerolinha_id', 'aerolinha_nome');
        break;
      case 'escolaridade' :
        this.corrigeSimples('dropdown-escolaridade', 'escolaridade', 'escolaridade_id', 'escolaridade_nome');
        break;
      case 'estado' :
        this.corrigeSimples('dropdown-estado', 'estado', 'estado_id', 'estado_nome');
        break;
      case 'estado_civil' :
        this.corrigeSimples('dropdown-estado_civil', 'estado_civil', 'estado_civil_id', 'estado_civil_nome');
        break;
      case 'grupo' :
        this.corrigeSimples('dropdown-grupo', 'grupo', 'grupo_id', 'grupo_nome');
        break;
      case 'nucleo' :
        this.corrigeSimples('dropdown-local', 'local', 'local_id', 'local_nome');
        break;
      case 'municipio' :
        this.corrigeSimples('dropdown-municipio', 'municipio', 'municipio_id', 'municipio_nome');
        break;
      case 'ogu' :
        this.corrigeSimples('dropdown-ogu', 'ogu', 'ogu_id', 'ogu_nome');
        break;
      case 'origem_proposicao' :
        this.corrigeSimples('dropdown-origem_proposicao', 'origem_proposicao', 'origem_proposicao_id', 'origem_proposicao_nome');
        break;
      case 'orgao_proposicao' :
        this.corrigeSimples('dropdown-orgao_proposicao', 'orgao_proposicao', 'orgao_proposicao_id', 'orgao_proposicao_nome');
        break;
      case 'prioridade' :
        this.corrigeSimples('dropdown-prioridade', 'prioridade', 'prioridade_id', 'prioridade_nome');
        break;
      case 'tipo_cadastro' :
        // this.corrigeTipoCadastro();
        this.corrigeSimples('dropdown-tipo_cadastro', 'tipo_cadastro', 'tipo_cadastro_id', 'tipo_cadastro_nome');
        break;
      case 'tipo_emenda' :
        this.corrigeSimples('dropdown-tipo_emenda', 'tipo_emenda', 'tipo_emenda_id', 'tipo_emenda_nome');
        break;
      case 'tipo_proposicao' :
        this.corrigeSimples('dropdown-tipo_proposicao', 'tipo_proposicao', 'tipo_proposicao_id', 'tipo_proposicao_nome');
        break;
      case 'emenda_proposicao' :
        this.corrigeSimples('dropdown-emenda_proposicao', 'emenda_proposicao', 'emenda_proposicao_id', 'emenda_proposicao_nome');
        break;
      case 'andamento' :
        this.corrigeSimples('dropdown-andamento', 'andamento', 'andamento_id', 'andamento_nome');
        break;
      case 'tipo_recebimento' :
        this.corrigeSimples('dropdown-tipo_recebimento', 'tipo_recebimento', 'tipo_recebimento_id', 'tipo_recebimento_nome');
        break;
      case 'tratamento' :
        this.corrigeSimples('dropdown-tratamento', 'tratamento', 'tratamento_id', 'tratamento_nome');
        break;
      case 'situacao_proposicao' :
        this.corrigeSimples('dropdown-situacao_proposicao', 'situacao_proposicao', 'situacao_proposicao_id', 'situacao_proposicao_nome');
        break;
    }
  }

  corrigeSimples(drop: string, tabela: string, campo_id: string, campo_nome: string) {
    // if (sessionStorage.getItem(drop)) {
      // let dd: SelectItem[] = null;
    this.sub.push(this.dd.getDd(drop)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          // dd = dados;
          sessionStorage.removeItem(drop);
          sessionStorage.setItem(drop, JSON.stringify(dados));
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {
          this.destroy()
        }
      })
    );
  }

  corrigeTipoCadastro() {
    if (sessionStorage.getItem('dropdown-tipo_cadastro')) {
      let dd: SelectItemGroup[] = null;
      this.sub.push(this.dd2.getDropdown3campos(
        'tipo_cadastro', 'tipo_cadastro_id', 'tipo_cadastro_nome', 'tipo_cadastro_tipo', '2')
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            const tipo: SelectItemGroup = {
              label: dados['label'].toString(),
              value: null,
              items: dados['items']
            };
            dd.push(tipo);
          },
          error: (erro) => {
            console.log(erro);
          },
          complete: () => {
            this.sub.push(this.dd2.getDropdown3campos(
              'tipo_cadastro', 'tipo_cadastro_id', 'tipo_cadastro_nome', 'tipo_cadastro_tipo', '1')
              .pipe(take(1))
              .subscribe({
                next: (dados) => {
                  const tipo: SelectItemGroup = {
                    label: dados['label'].toString(),
                    value: null,
                    items: dados['items']
                  };
                  dd.push(tipo);
                },
                error: (erro) => {
                  console.log(erro);
                },
                complete: () => {
                  sessionStorage.removeItem('dropdown-tipo_cadastro');
                  sessionStorage.setItem('dropdown-tipo_cadastro', JSON.stringify(dd));
                  setTimeout (() => {
                    this.destroy();
                  }, 500);
                }
              })
            );
          }
        })
      );
    }
  }

  corrigeTipoCadastro2() {
    if (sessionStorage.getItem('dropdown-tipo_cadastro')) {
      let dd: SelectItemGroup[] = null;
      this.sub.push(this.dd2.getDropdown3campos(
        'tipo_cadastro', 'tipo_cadastro_id', 'tipo_cadastro_nome', 'tipo_cadastro_tipo', '2')
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            const tipo: SelectItemGroup = {
              label: dados['label'].toString(),
              value: null,
              items: dados['items']
            };
            dd.push(tipo);
          },
          error: (erro) => {
            console.log(erro);
          },
          complete: () => {
            this.sub.push(this.dd2.getDropdown3campos(
              'tipo_cadastro', 'tipo_cadastro_id', 'tipo_cadastro_nome', 'tipo_cadastro_tipo', '1')
              .pipe(take(1))
              .subscribe({
                next: (dados) => {
                  const tipo: SelectItemGroup = {
                    label: dados['label'].toString(),
                    value: null,
                    items: dados['items']
                  };
                  dd.push(tipo);
                },
                error: (erro) => {
                  console.log(erro);
                },
                complete: () => {
                  sessionStorage.removeItem('dropdown-tipo_cadastro');
                  sessionStorage.setItem('dropdown-tipo_cadastro', JSON.stringify(dd));
                  setTimeout (() => {
                    this.destroy();
                  }, 500);
                }
              })
            );
          }
        })
      );
    }
  }


  destroy(): void {
    this.sub.forEach(s => s.unsubscribe());
    this.sub = [];
  }

}
