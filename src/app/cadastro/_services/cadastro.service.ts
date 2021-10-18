import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { UrlService } from '../../util/_services';
import {
  CadastroDuplicadoBuscaInterface,
  CadastroFormulario,
  CadastroFormularioInterface,
  CadastroInterface,
  CadastroDetalheCompletoInterface,
  CadastroPaginacaoInterface,
  SmsTodosInterface,
  CadastroBuscaInterface,
  CadastroSmsPaginacaoInterface,
  CadastroEtiquetaInterface
} from '../_models';
import { ArquivoService } from '../../arquivo/_services';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {

  public cadastro_campo1_sn: boolean;
  public cadastro_campo1_nome: string;
  public cadastro_campo2_sn: boolean;
  public cadastro_campo2_nome: string;
  public cadastro_campo3_sn: boolean;
  public cadastro_campo3_nome: string;
  public cadastro_campo4_sn: boolean;
  public cadastro_campo4_nome: string;
  private cadastroUrl = this.url.cadastro;
  private cadastroPaginacao$: Observable<CadastroPaginacaoInterface>;
  private cadastroSMSPaginacao$: Observable<CadastroSmsPaginacaoInterface>;
  private selecionaTodos$: Observable<any>;
  private selecionaIds$: Observable<any>;
  private buscaBsSource = new Subject();
  private todosCelulares$: Observable<SmsTodosInterface>;
  public cadastroBusca: CadastroBuscaInterface;



  private incluirResposta$: Observable<any[]>;
  private celular$: Observable<any[]>;
  private cadastrosDuplicados$: Observable<CadastroDuplicadoBuscaInterface[]>;
  public duplicados: CadastroDuplicadoBuscaInterface[];
  private cadNum$: Observable<any>;
  private cadExc$: Observable<any>;
  public mun_nome: string = null;
  public reg_nome: string = null;
  public busca_Nome: string = null;
  private cadAlterar$: Observable<CadastroFormularioInterface>;
  public expandidoDados: any = false;
  public expandido = new Subject();
  public cadastro = new CadastroFormulario();

  private cadastros$: Observable<CadastroInterface>;
  private cadCompleto$: Observable<CadastroDetalheCompletoInterface>;
  private detalheUrl = this.url.cadastro + '/detalhe/';
  public ativo = false;


  constructor(
    private url: UrlService,
    private http: HttpClient,
    private as: ArquivoService,
    ) { }

  buscaMenu() {
    this.buscaBsSource.next();
  }

  procurarCadastroDuplicado (nome: string = null): Observable<CadastroDuplicadoBuscaInterface[]> {
    let url: string;
    let nm: string;
    url = this.url.cadastro + '/verificanome/';
    if (nome) {
      nm = url + nome;
    }
    if (this.busca_Nome) {
      nm = url + this.busca_Nome;
    }
    if (nm) {
      this.cadastrosDuplicados$ = this.http.get<CadastroDuplicadoBuscaInterface[]> (nm);
    } else {
      this.cadastrosDuplicados$ = null;
    }
    return this.cadastrosDuplicados$;
  }

  contaNomeDuplicado (nome: string): Observable<any> {
    this.cadNum$ = null;
    if (nome !== null && nome.length > 2) {
      const url = this.url.cadastro + '/contanomeduplicado/' + this.busca_Nome;
      this.cadNum$ = this.http.get<any[]> (url);
    }
    return this.cadNum$;
  }

  // @ts-ignore
  incluirCadastro (cadastro: CadastroFormularioInterface) {
    let url: string;
    url = this.url.cadastro + '/incluir';
    if (cadastro) {
      const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
      this.incluirResposta$ = this.http.post<any[]> (url, cadastro, httpOptions);
      return this.incluirResposta$;
    }
  }

  // @ts-ignore
  alterarCadastro (cadastro: CadastroFormularioInterface) {
    let url: string;
    url = this.url.cadastro + '/alterar';
    if (cadastro) {
      const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
      return this.http.post<any[]> (url, cadastro, httpOptions);
      // return this.incluirResposta$;
    }
  }

  criaCadastro(): void {
    this.cadastro = new CadastroFormulario();
  }

  resetCadastro() {
    delete this.cadastro;
    this.cadastro = new CadastroFormulario();
  }

  excluirCadastro(id: number) {
    if (!id) {
      return null;
    }
    let url: string;
    url = this.url.cadastro + '/' + id;
    this.cadExc$ = this.http.delete(url);
    return this.cadExc$;
  }

  alterarCadastroBusca (id: number) {
    if (!id) {
      return null;
    }
    let url: string;
    url = this.url.cadastro + '/alterar/' + id;
    this.cadAlterar$ = this.http.get<CadastroFormularioInterface> (url);
    return this.cadAlterar$;
  }

  // @ts-ignore
  postCelular(campo: string, valor: string, id: number) {
    let teste = true;
    if ((campo.length >= 16) &&
      (!valor || valor.length < 9) && (!id || id > 0)) {
      teste = false;
    }
    if (teste) {
      let url: string;
      url = this.url.cadastro + '/celular';
      const dados = {'campo': campo, 'valor': valor, 'id': id};
      const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
      this.celular$ = this.http.post<any[]> (url, dados, httpOptions);
      return this.celular$;
    }
  }

  // *****************************

  postCadastroBusca(busca: CadastroBuscaInterface) {
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    let url = this.cadastroUrl;
    url += '/listar';
    this.selecionaTodos$ = this.http.post<CadastroPaginacaoInterface>(url, busca, httpOptions);
    return this.selecionaTodos$;
  }

  postCadastroBuscaJson(busca: CadastroBuscaInterface) {
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    let url = this.cadastroUrl;
    url += '/listarjson';
    this.selecionaTodos$ = this.http.post<CadastroPaginacaoInterface>(url, busca, httpOptions);
    return this.selecionaTodos$;
  }

  postCadastroSmsBusca(busca: CadastroBuscaInterface): Observable<CadastroSmsPaginacaoInterface> {
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    const url = this.url.cadastro + '/listarsms';
    this.cadastroSMSPaginacao$ = this.http.post<CadastroSmsPaginacaoInterface>(url, busca, httpOptions);
    return this.cadastroSMSPaginacao$;
  }

  recuperaColunaExpandida() {
    let resp: any;
    if (!sessionStorage.getItem('cadastro-expandido')) {
      resp = false;
    } else {
      resp = JSON.parse(sessionStorage.getItem('cadastro-expandido'));
      sessionStorage.removeItem('cadastro-expandido');
    }
    return resp;
  }

  gravaColunaExpandida(dados) {
    sessionStorage.setItem('cadastro-expandido', JSON.stringify(dados));
  }

  montaColunaExpandida(ev: any[]) {
    const campo = [
      'cadastro_id',
      'cadastro_tipo_nome',
      'cadastro_tratamento_nome',
      'cadastro_nome',
      'cadastro_apelido',
      'cadastro_sigla',
      'cadastro_responsavel',
      'cadastro_cargo',
      'cadastro_endereco',
      'cadastro_endereco_numero',
      'cadastro_endereco_complemento',
      'cadastro_bairro',
      'cadastro_municipio_nome',
      'cadastro_estado_nome',
      'cadastro_cep',
      'cadastro_regiao_nome',
      'cadastro_telefone',
      'cadastro_telcom',
      'cadastro_telefone2',
      'cadastro_celular',
      'cadastro_celular2',
      'cadastro_fax',
      'cadastro_email',
      'cadastro_email2',
      'cadastro_rede_social',
      'cadastro_outras_midias',
      'cadastro_grupo_nome',
      'cadastro_data_nascimento',
      'cadastro_estado_civil_nome',
      'cadastro_conjuge',
      'cadastro_profissao',
      'cadastro_cpfcnpj',
      'cadastro_rg',
      'cadastro_sexo',
      'cadastro_escolaridade_nome',
      'cadastro_zona',
      'cadastro_jornal',
      'cadastro_mala',
      'cadastro_agenda',
      'cadastro_data_cadastramento',
      'cadastro_usuario',
      'cadastro_campo1',
      'cadastro_campo2',
      'cadastro_campo3',
      'cadastro_campo4_nome',
      'cadastro_observacoes'
    ];
    const titulo = [
      '#',
      'Tipo de Cadastro',
      'Tratamento',
      'Nome/Razão Social',
      'Apelido',
      'Sigla',
      'Empresa / Responsável',
      'Cargo',
      'Endereço',
      'Número',
      'Complemento',
      'Bairro',
      'Município',
      'Estado',
      'Cep',
      'Região',
      'Telefone1',
      'Telefone2',
      'Telefone3',
      'Celular1',
      'Celular2',
      'Fax',
      'E-mail1',
      'E-mail2',
      'Facebook',
      'Outras mídias',
      'Grupo',
      'Data de Nascimento / Fundação',
      'Estado Civil',
      'Conjuge',
      'Profissão',
      'Cpf/Cnpj',
      'Rg',
      'Genero',
      'Escolaridade',
      'Partido',
      'Boletim',
      'Mala direta',
      'Contato',
      'Data de cadastrmento',
      'Cadastrante',
      'Campo1',
      'Campo2',
      'Campo3',
      'Campo4',
      'Observações'
    ];
    let a = 0;
    const b: any[] = [];

    for (const v in ev) {
      // console.log('v in ev', v);
      if (ev[v] !== null) {
        if (ev[v].toString().length > 0) {
          const n = campo.indexOf(v);
          // console.log('aaaaa', v, ev[v].toString(), n);
          if (n >= 0) {
            const cc: string[] = [];
            cc.push(titulo[n].toString());
            switch (v) {
              case 'cadastro_jornal' : {
                switch (ev[v]) {
                  case 0 : {
                    ev[v] = 'INATIVO';
                    break;
                  }
                  case 1 : {
                    ev[v] = 'ATIVO';
                    break;
                  }
                  case 2 : {
                    ev[v] = 'INATIVO';
                    break;
                  }
                  default: {
                    ev[v] = 'INATIVO';
                    break;
                  }
                }
                break;
              }
              case 'cadastro_mala' : {
                switch (ev[v]) {
                  case 0 : {
                    ev[v] = 'INATIVO';
                    break;
                  }
                  case 1 : {
                    ev[v] = 'ATIVO';
                    break;
                  }
                  case 2 : {
                    ev[v] = 'INATIVO';
                    break;
                  }
                  default: {
                    ev[v] = 'INATIVO';
                    break;
                  }
                }
                break;
              }
              case 'cadastro_agenda' : {
                switch (ev[v]) {
                  case 0 : {
                    ev[v] = 'INATIVO';
                    break;
                  }
                  case 1 : {
                    ev[v] = 'ATIVO';
                    break;
                  }
                  case 2 : {
                    ev[v] = 'INATIVO';
                    break;
                  }
                  default: {
                    ev[v] = 'INATIVO';
                    break;
                  }
                }
                break;
              }
              case 'cadastro_sigilo' : {
                switch (ev[v]) {
                  case 0 : {
                    ev[v] = 'INATIVO';
                    break;
                  }
                  case 1 : {
                    ev[v] = 'ATIVO';
                    break;
                  }
                  default: {
                    ev[v] = 'INATIVO';
                    break;
                  }
                }
                break;
              }
            }
            cc.push(ev[v]);
            // console.log('ccccc', a, cc);
            // b.push(cc);
            b.push([titulo[n].toString(), ev[v]]);
            // console.log('bbbb', a, b);
            a++;
          }
        }
      } else {
        a++;
      }
    }

    /*
    const tamanho = b.length;
    let linhas: number = tamanho;
    let colunas = 1;
    if (tamanho > 10) {
      colunas = 2;
      linhas = Math.ceil(tamanho / 2);
      if (linhas > 10) {
        colunas = 3;
        linhas = Math.ceil(tamanho / 3);
        if (linhas > 10) {
          colunas = 4;
          linhas = Math.ceil(tamanho / 4);
        }
      }
    }

    let col: number;
    let lin: number;
    const idxC = [];

    let contador = 0;
    for (col = 1; col <= colunas; col++) {
      const idcL = [];
      for (lin = 1; lin <= linhas; lin++) {
        if (contador < tamanho) {
          idcL.push(b[contador]);
        }
        contador++;
      }
      idxC.push(idcL);
    }
    const largura = (100 / colunas).toFixed(2) + '%';
    idxC.push(largura.toString());
    */

    // this.expandido.next(idxC);
    setTimeout( () => {
      this.expandido.next(b);
    }, 1000);
  }

  getColunaExtendida(): Observable<any> {
    return this.expandido;
  }

  postCadastroSmsTodos(busca: CadastroBuscaInterface, cpo: number) {
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    let url = this.cadastroUrl;
    url += '/smstodos/' + cpo;
    this.todosCelulares$ = this.http.post<SmsTodosInterface>(url, busca, httpOptions);
    return this.todosCelulares$;
  }

  postCadastroBuscaEtiqueta(busca: CadastroBuscaInterface) {
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    let url = this.cadastroUrl;
    url += '/listaretiqueta';
    this.selecionaTodos$ = this.http.post<CadastroEtiquetaInterface>(url, busca, httpOptions);
    return this.selecionaTodos$;
  }

  getDetalheCompleto(id: number): Observable<CadastroDetalheCompletoInterface> {
    const url = this.detalheUrl + 'completo/' + id ;
    this.cadCompleto$ = this.http.get<CadastroDetalheCompletoInterface>(url);
    return this.cadCompleto$;
  }

  getCampoCadastro() {
    const tmp: any = JSON.parse(localStorage.getItem('currentUser'));
    this.cadastro_campo1_sn = tmp.cadastro_campo1_sn === 1;
    this.cadastro_campo1_nome = tmp.cadastro_campo1_sn === 1 ? tmp.cadastro_campo1_nome : null;
    this.cadastro_campo2_sn = tmp.cadastro_campo2_sn === 1;
    this.cadastro_campo2_nome = tmp.cadastro_campo2_sn === 1 ? tmp.cadastro_campo2_nome : null;
    this.cadastro_campo3_sn = tmp.cadastro_campo3_sn === 1;
    this.cadastro_campo3_nome = tmp.cadastro_campo3_sn === 1 ? tmp.cadastro_campo3_nome : null;
    this.cadastro_campo4_sn = tmp.cadastro_campo4_sn === 1;
    this.cadastro_campo4_nome = tmp.cadastro_campo4_sn === 1 ? tmp.cadastro_campo4_nome : null;
  }

}
