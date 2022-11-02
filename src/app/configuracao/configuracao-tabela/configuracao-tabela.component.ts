import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {Subscription} from 'rxjs';
import {ConfiguracaoService} from '../_services';
import {take} from 'rxjs/operators';
import {AuthenticationService} from '../../_services';
import {Message, SelectItem} from 'primeng/api';
import {ConfiguracaoModel, ConfiguracaoModelInterface, ConfiguracaoRegistroI} from '../_models/configuracao-model';
import {MsgService} from "../../_services/msg.service";
import {DdService} from "../../_services/dd.service";

@Component({
  selector: 'app-configuracao-tabela',
  templateUrl: './configuracao-tabela.component.html',
  styleUrls: ['./configuracao-tabela.component.css']
})
export class ConfiguracaoTabelaComponent implements OnInit, OnChanges, OnDestroy {
  @Output() onConfTitulo = new EventEmitter<ConfiguracaoModelInterface>();
  @Input() componente?: string = null;

  private sub: Subscription[] = [];
  configuracao: ConfiguracaoModelInterface | null = null;
  listagem: ConfiguracaoRegistroI[] = [];
  perIncluir = false;
  perAltarar = false;
  perDeletar = false;
  mostraIncluir = false;
  mostraAlterar = false;
  btnacaoInativo = false;
  registro: ConfiguracaoRegistroI | null = null;
  registroOld: ConfiguracaoRegistroI | null = null;
  acao: string | null = null;
  msg: string[] = [];
  msgErro: Message[] = [];
  idx: number = -1;
  titulo = 'CONFIGURAÇÕES';
  dropDown: SelectItem[] = [];
  resp: any[] = [];
  confirmaAlterar = false;
  confirmaApagar = false;
  readOnly = false;
  btnCancelarInativo = false;
  btnEnviarInativo = true;
  mostraApagar = false;
  drop: SelectItem | null = null;

  // nome: string | null = null;

  constructor(
    public cfs: ConfiguracaoService,
    public aut: AuthenticationService,
    private ms: MsgService,
    private dd: DdService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.componente) {
      switch (changes.componente.currentValue) {
        case 'area_interesse': {
          this.configuracao = {
            tabela: 'area_interesse',
            campo_id: 'area_interesse_id',
            campo_nome: 'area_interesse_nome',
            titulo: 'ÁREAS DE INTERESSE',
            texto: 'a área de interesse',
            tamanho: 50
          };
          this.inicio();
          break;
        }
        case 'assunto': {
          this.configuracao = {
            tabela: 'assunto',
            campo_id: 'assunto_id',
            campo_nome: 'assunto_nome',
            titulo: 'ASSUNTOS',
            texto: 'o assunto',
            tamanho: 100
          }
          this.inicio();
          break;
        }
        case 'aerolinha': {
          this.configuracao = {
            tabela: 'aerolinha',
            campo_id: 'aerolinha_id',
            campo_nome: 'aerolinha_nome',
            titulo: 'COMPANHIAS AÉREAS',
            texto: 'a companhias aérea',
            tamanho: 50
          }
          this.inicio();
          break;
        }
        case 'escolaridade': {
          this.configuracao = {
            tabela: 'escolaridade',
            campo_id: 'escolaridade_id',
            campo_nome: 'escolaridade_nome',
            titulo: 'ESCOLARIDADE',
            texto: 'a escolaridade',
            tamanho: 30
          }
          this.inicio();
          break;
        }
        case 'estado': {
          this.configuracao = {
            tabela: 'estado',
            campo_id: 'estado_id',
            campo_nome: 'estado_nome',
            titulo: 'ESTADOS',
            texto: 'o estado',
            tamanho: 2
          }
          this.inicio();
          break;
        }
        case 'estado_civil': {
          this.configuracao = {
            tabela: 'estado_civil',
            campo_id: 'estado_civil_id',
            campo_nome: 'estado_civil_nome',
            titulo: 'ESTADO CIVIL',
            texto: 'o estado civil',
            tamanho: 15
          }
          this.inicio();
          break;
        }
        case 'grupo': {
          this.configuracao = {
            tabela: 'grupo',
            campo_id: 'grupo_id',
            campo_nome: 'grupo_nome',
            titulo: 'GRUPOS',
            texto: 'o grupo',
            tamanho: 50
          }
          this.inicio();
          break;
        }
        case 'municipio': {
          this.configuracao = {
            tabela: 'municipio',
            campo_id: 'municipio_id',
            campo_nome: 'municipio_nome',
            titulo: 'MUNICÍPIOS',
            texto: 'o município',
            tamanho: 50
          }
          this.inicio();
          break;
        }
        case 'ogu': {
          this.configuracao = {
            tabela: 'ogu',
            campo_id: 'ogu_id',
            campo_nome: 'ogu_nome',
            titulo: 'O.G.U.',
            texto: 'o O.G.U.',
            tamanho: 50
          }
          this.inicio();
          break;
        }
        case 'origem_proposicao': {
          this.configuracao = {
            tabela: 'origem_proposicao',
            campo_id: 'origem_proposicao_id',
            campo_nome: 'origem_proposicao_nome',
            titulo: 'ORIGEM DA PROPOSIÇÃO',
            texto: 'a origem da proposicao',
            tamanho: 150
          }
          this.inicio();
          break;
        }
        case 'orgao_proposicao': {
          this.configuracao = {
            tabela: 'orgao_proposicao',
            campo_id: 'orgao_proposicao_id',
            campo_nome: 'orgao_proposicao_nome',
            titulo: 'ORGÃO DA PROPOSIÇÃO',
            texto: 'o orgão da proposicao',
            tamanho: 50
          }
          this.inicio();
          break;
        }
        case 'tipo_emenda': {
          this.configuracao = {
            tabela: 'tipo_emenda',
            campo_id: 'tipo_emenda_id',
            campo_nome: 'tipo_emenda_nome',
            titulo: 'TIPO DE EMENDA',
            texto: 'o tipo de emenda',
            tamanho: 50
          }
          this.inicio();
          break;
        }
        case 'tipo_proposicao': {
          this.configuracao = {
            tabela: 'tipo_proposicao',
            campo_id: 'tipo_proposicao_id',
            campo_nome: 'tipo_proposicao_nome',
            titulo: 'TIPO DE PROPOSIÇÃO',
            texto: 'o tipo de proposição',
            tamanho: 100
          }
          this.inicio();
          break;
        }
        case 'proposicao_emenda_tipo': {
          this.configuracao = {
            tabela: 'emenda_proposicao',
            campo_id: 'emenda_proposicao_id',
            campo_nome: 'emenda_proposicao_nome',
            titulo: 'TIPO DE EMEDA DE PROPOSIÇÃO',
            texto: 'o tipo de emenda de proposição',
            tamanho: 50
          }
          this.inicio();
          break;
        }
        case 'andamento': {
          this.configuracao = {
            tabela: 'andamento',
            campo_id: 'andamento_id',
            campo_nome: 'andamento_nome',
            titulo: 'TIPOS DE ENCAMINHAMENTO',
            texto: 'o tipo de encaminhamento',
            tamanho: 50
          }
          this.inicio();
          break;
        }
        case 'tipo_recebimento': {
          this.configuracao = {
            tabela: 'tipo_recebimento',
            campo_id: 'tipo_recebimento_id',
            campo_nome: 'tipo_recebimento_nome',
            titulo: 'TIPOS DE RECEBIMENTOS',
            texto: 'o tipo de recebimento',
            tamanho: 50
          }
          this.inicio();
          break;
        }
        case 'tratamento': {
          this.configuracao = {
            tabela: 'tratamento',
            campo_id: 'tratamento_id',
            campo_nome: 'tratamento_nome',
            titulo: 'TRATAMENTOS',
            texto: 'o tratamento',
            tamanho: 30
          }
          this.inicio();
          break;
        }
        case 'situacao_proposicao': {
          this.configuracao = {
            tabela: 'situacao_proposicao',
            campo_id: 'situacao_proposicao_id',
            campo_nome: 'situacao_proposicao_nome',
            titulo: 'SITUAÇÃO DA PROPOSIÇÃO',
            texto: 'a situação da proposição',
            tamanho: 150
          }
          this.inicio();
          break;
        }
        default: {
          this.configuracao = new ConfiguracaoModel();
          this.titulo = 'CONFIGURAÇÕES';
          break;
        }
      }
    }
  }

  ngOnInit(): void {
    this.perIncluir = (this.aut.configuracao_incluir || this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn);
    this.perAltarar = (this.aut.configuracao_alterar || this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn);
    this.perDeletar = (this.aut.configuracao_apagar || this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn);
  }

  ngOnDestroy(): void {
    this.cfs.configuracao = null;
    this.sub.forEach(s => {
      s.unsubscribe();
    });
  }

  inicio() {
    this.sub.forEach(s => {
      s.unsubscribe();
    });
    this.resetAll();
    this.titulo = this.configuracao.titulo;
    this.cfs.configuracao = this.configuracao;
    this.getDropDown(this.configuracao.tabela);
  }

  resetAll() {
    this.listagem = [];
    this.mostraIncluir = false;
    this.mostraAlterar = false;
    this.btnacaoInativo = false;
    this.btnCancelarInativo = false;
    this.registro = null;
    this.registroOld = null;
    this.acao = null;
    this.msgErro = [];
    this.msg = [];
    this.idx = -1;
    this.titulo = 'CONFIGURAÇÕES';
    this.dropDown = [];
    this.resp = [];
    this.confirmaAlterar = false;
    this.readOnly = false;
    this.mostraApagar = false;
    this.drop = null;
  }

  getDropDown(tabela: string) {
    if (!sessionStorage.getItem('dropdown-' + this.configuracao.tabela)) {
      this.sub.push(this.dd.getDd('dropdown-' + this.configuracao.tabela)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            sessionStorage.setItem('dropdown-' + this.configuracao.tabela, JSON.stringify(dados));
            this.dropDown = dados;
          },
          error: (erro) => {
            console.error(erro);
          },
          complete: () => {
            this.listagem = this.dropDown.map((d) => {
              return {
                campo_id: +d.value,
                campo_nome: d.label
              }
            });
          }
        })
      );
    } else {
      this.dropDown = JSON.parse(sessionStorage.getItem('dropdown-' + this.configuracao.tabela));
      this.listagem = this.dropDown.map((d) => {
        return {
          campo_id: +d.value,
          campo_nome: d.label
        }
      });
    }
  }

  clickIncluir() {
    this.msg = [];
    this.msgErro = [];
    this.registro = {
      campo_id: null,
      campo_nome: null
    }
    this.btnacaoInativo = true;
    this.mostraIncluir = !this.mostraIncluir;
    this.btnCancelarInativo = false;
    this.btnEnviarInativo = false;
  }

  clickEditar(cf: ConfiguracaoRegistroI, idx: number) {
    const cfn: string = cf.campo_nome;
    const cfv: number = cf.campo_id;
    this.msg = [];
    this.msgErro = [];
    this.btnacaoInativo = true;
    this.acao = 'editar';
    this.confirmaAlterar = false;
    this.registro = cf;
    // this.nome = cf.campo_nome;
    this.registroOld = {
      campo_id: cfv,
      campo_nome: cfn
    };
    this.idx = idx;
    this.btnEnviarInativo = false;
    this.mostraAlterar = !this.mostraAlterar;
  }

  onAlterar() {
    const n: number = this.dropDown.findIndex(r => r.label.toUpperCase() === this.registro.campo_nome.toUpperCase());
    if (this.registro.campo_nome !== null && this.registro.campo_nome.toUpperCase() !== this.registroOld.campo_nome.toUpperCase() && this.registro.campo_nome.length > 1 && n < 0) {
      this.btnacaoInativo = true;
      this.btnCancelarInativo = true;
      this.btnEnviarInativo = true;
      this.msgErro = [];
      this.msg = [];
      this.readOnly = true;
      const dados: any[] = [];
      dados.push(this.configuracao.tabela);
      dados.push(this.registro.campo_id);
      dados.push(this.registro.campo_nome.toUpperCase());
      this.sub.push(this.cfs.impactoAlterar(dados)
        .pipe(take(1))
        .subscribe((dados1) => {
            this.resp = dados1;
          },
          (err) => {
            console.error(err);
            this.onCancela();
          },
          () => {
            if (!this.resp[0]) {
              this.registro.campo_nome = this.registroOld.campo_nome;
              this.confirmaAlterar = false;
              this.msgErro.push({key: 'msgAlterarErro', severity: 'warn', summary: 'ALTERAR', detail: this.resp[2]});
              this.btnCancelarInativo = false;
              this.btnEnviarInativo = false;
              this.readOnly = false;
            } else {
              if (this.resp[3]) {
                this.confirmaAlterar = true;
                const str: string = 'Vinculo(s): ' + this.resp[2].join(', ') + '.';
                this.msg.push(str);
                this.btnCancelarInativo = false;
                this.btnEnviarInativo = false;
                this.readOnly = true;
              }
              if (!this.resp[3]) {
                this.listagem[this.idx].campo_nome = this.registro.campo_nome.toUpperCase();
                this.listagem.sort((a, b) => (a.campo_nome > b.campo_nome) ? 1 : ((b.campo_nome > a.campo_nome) ? -1 : 0));
                this.dropDown = [];
                this.dropDown = this.listagem.map((l) => {
                  return {
                    value: +l.campo_id,
                    label: l.campo_nome
                  }
                });
                sessionStorage.removeItem('dropdown-' + this.configuracao.tabela);
                sessionStorage.setItem('dropdown-' + this.configuracao.tabela, JSON.stringify(this.dropDown));
                this.ms.add({
                  key: 'toastprincipal',
                  severity: 'success',
                  summary: 'Alterações',
                  detail: this.resp[2][0]
                });
                this.onCancela();
              }
            }
          }
        )
      )
    } else {
      if (this.registro.campo_nome === null || this.registro.campo_nome.length === 0) {
        this.msgErro.push({
          key: 'msgAlterarErro',
          severity: 'warn',
          summary: 'ALTERAR',
          detail: 'ERRO - Registro com 0 caracteres.'
        });
      }
      if (this.registro.campo_nome.toUpperCase() === this.registroOld.campo_nome.toUpperCase()) {
        this.msgErro.push({
          key: 'msgAlterarErro',
          severity: 'warn',
          summary: 'ALTERAR',
          detail: 'ERRO - Registro não alterado.'
        });
      }
      if (n !== -1) {
        this.msgErro.push({
          key: 'msgAlterarErro',
          severity: 'warn',
          summary: 'ALTERAR',
          detail: 'ERRO - Registro com valor repetido.'
        });
      }
    }
  }

  onAlterarConfirma() {
    this.btnacaoInativo = true;
    this.btnCancelarInativo = true;
    this.btnEnviarInativo = true;
    this.msgErro = [];
    this.msg = [];
    const dados: any[] = [];
    dados.push(this.configuracao.tabela);
    dados.push(this.registro.campo_id);
    dados.push(this.registro.campo_nome);
    this.sub.push(this.cfs.alterar(dados)
      .pipe(take(1))
      .subscribe((dados1) => {
          this.readOnly = false;
          this.resp = dados1;
        },
        (err) => {
          console.error(err);
          this.readOnly = false;
        },
        () => {
          if (this.resp[0]) {
            this.listagem.splice(this.idx,1);
            this.listagem.push(this.registro);
            this.listagem.sort((a, b) => (a.campo_nome > b.campo_nome) ? 1 : ((b.campo_nome > a.campo_nome) ? -1 : 0));
            this.dropDown = [];
            this.dropDown = this.listagem.map((l) => {
              return {
                value: +l.campo_id,
                label: l.campo_nome
              }
            });
            sessionStorage.removeItem('dropdown-' + this.configuracao.tabela);
            sessionStorage.setItem('dropdown-' + this.configuracao.tabela, JSON.stringify(this.dropDown));
            this.ms.add({key: 'toastprincipal', severity: 'success', summary: 'Alterações', detail: this.resp[2][0]});
            this.onCancela();
          } else {
            this.registro.campo_nome = this.registroOld.campo_nome;
            this.confirmaAlterar = false;
            this.msgErro.push({key: 'msgAlterarErro', severity: 'warn', summary: 'ALTERAR', detail: this.resp[2]});
            this.btnCancelarInativo = false;
            this.btnEnviarInativo = false;
            this.readOnly = false;
          }
        }
      )
    );


  }

  onIncluir() {
    this.btnacaoInativo = true;
    this.btnCancelarInativo = true;
    this.btnEnviarInativo = true;
    this.acao = 'incluir';
    this.msgErro = [];
    this.msg = [];
    const n: number = this.dropDown.findIndex(r => r.label.toUpperCase() === this.registro.campo_nome.toUpperCase());
    if (this.registro.campo_nome !== null && this.registro.campo_nome.length > 1 && n < 0) {
      const dados: any[] = [];
      dados.push(this.configuracao.tabela);
      dados.push(this.registro.campo_nome);
      this.sub.push(this.cfs.verificaIncluir(dados)
        .pipe(take(1))
        .subscribe((dados2) => {
            this.resp = dados2;
          },
          (err) => {
            console.error(err);
          },
          () => {
            if (this.resp[0]) {
              this.listagem.push({campo_id: +this.resp[1], campo_nome: this.registro.campo_nome.toUpperCase()});
              this.listagem.sort((a, b) => (a.campo_nome > b.campo_nome) ? 1 : ((b.campo_nome > a.campo_nome) ? -1 : 0));
              this.dropDown = [];
              this.dropDown = this.listagem.map((l) => {
                return {
                  value: +l.campo_id,
                  label: l.campo_nome
                }
              });
              sessionStorage.removeItem('dropdown-' + this.configuracao.tabela);
              sessionStorage.setItem('dropdown-' + this.configuracao.tabela, JSON.stringify(this.dropDown));
              this.ms.add({key: 'toastprincipal', severity: 'info', summary: 'INCLUIR', detail: this.resp[2]});
              this.onCancela();
            } else {
              this.msgErro.push({key: 'msgIncluirErro', severity: 'warn', summary: 'INCLUIR', detail: this.resp[2]});
              this.btnCancelarInativo = false;
              this.btnEnviarInativo = false;
            }
          }
        )
      );
    } else {
      if (n > -1) {
        this.msg.push('ATENÇÃO - Já existe registro com essa informação.');
      }
      this.btnCancelarInativo = false;
      this.btnEnviarInativo = false;
    }
  }

  clickDeletar(cf: ConfiguracaoRegistroI, idx: number) {

    const cfn: string = cf.campo_nome;
    const cfv: number = cf.campo_id;
    this.msg = [];
    this.msgErro = [];
    this.btnacaoInativo = true;
    this.acao = 'deletar';
    this.mostraApagar = true;
    this.confirmaApagar = false;

    this.registro = cf;
    this.registroOld = {
      campo_id: cfv,
      campo_nome: cfn
    };
    this.idx = idx;
    this.btnEnviarInativo = false;
    this.btnCancelarInativo = true;


    this.resp = [];
    const dados: any[] = [];
    dados.push(this.configuracao.tabela);
    dados.push(cf.campo_id);
    this.sub.push(this.cfs.impactoDelete(dados)
      .pipe(take(1))
      .subscribe((dados4) => {
          this.resp = dados4;
        },
        (err) => {
          console.error(err);
          this.onCancela();
        },
        () => {
          if (this.resp[0]) {
            if (this.resp[3]) {
              this.confirmaApagar = true;
              const str: string = 'Vinculo(s): ' + this.resp[2].join(', ') + '.';
              this.msg.push(str);
              this.btnCancelarInativo = false;
              this.btnEnviarInativo = false;

            } else {
              this.listagem.splice(this.idx, 1);
              this.dropDown = [];
              this.dropDown = this.listagem.map((l) => {
                return {
                  value: +l.campo_id,
                  label: l.campo_nome
                }
              });
              sessionStorage.removeItem('dropdown-' + this.configuracao.tabela);
              sessionStorage.setItem('dropdown-' + this.configuracao.tabela, JSON.stringify(this.dropDown));
              this.ms.add({
                key: 'toastprincipal',
                severity: 'success',
                summary: 'Exclusão: ',
                detail: this.resp[2][0]
              });
              this.onCancela();
            }
          } else {
            this.msgErro.push({key: 'msgDeletarErro', severity: 'error', summary: 'APAGAR', detail: this.resp[2][0]});
            this.btnCancelarInativo = false;
            this.btnEnviarInativo = false;
          }
        }
      )
    );
  }

  onApagarConfirma(cf: SelectItem) {
    this.btnacaoInativo = true;
    this.btnCancelarInativo = true;
    this.btnEnviarInativo = true;
    this.msg = [];
    if (+cf.value > 0 && +cf.value !== +this.registro.campo_id) {
      const dados: any = {
        'tabela': this.configuracao.tabela,
        'id': +this.registro.campo_id,
        'novo_id': +cf.value
      };
      this.sub.push(this.cfs.deletar(dados)
        .pipe(take(1))
        .subscribe((dados5) => {
            this.resp = dados5;
          },
          (err) => {
            console.error(err);
          },
          () => {
            this.listagem.splice(this.idx, 1);
            this.dropDown = [];
            this.dropDown = this.listagem.map((l) => {
              return {
                value: +l.campo_id,
                label: l.campo_nome
              }
            });
            sessionStorage.removeItem('dropdown-' + this.configuracao.tabela);
            sessionStorage.setItem('dropdown-' + this.configuracao.tabela, JSON.stringify(this.dropDown));
            this.ms.add({key: 'toastprincipal', severity: 'info', summary: 'Exclusão: ', detail: this.resp[2]});
            this.onCancela();
          })
      );
    }
  }

  onCancela() {
    if (this.acao === 'editar') {
      this.registro.campo_nome = this.registroOld.campo_nome;
    }
    this.readOnly = false;
    this.mostraIncluir = false;
    this.btnacaoInativo = false;
    this.btnCancelarInativo = false;
    delete this.registro;
    this.registro = null;
    this.registroOld = null;
    this.acao = null;
    this.msgErro = [];
    this.msg = [];
    this.idx = -1;
    this.acao = null;
    this.confirmaAlterar = false;
    this.mostraAlterar = false;
    this.idx = null;
    this.mostraApagar = false
    this.confirmaApagar = false
    this.btnEnviarInativo = false;
    this.drop = null
  }

  testaInput(): boolean {
    return this.registro.campo_nome.toUpperCase() === this.registroOld.campo_nome.toUpperCase();
  }

  mudaTeste(cno: string, cno2: string) {
    this.registro.campo_nome = cno.toUpperCase();
  }

  corrigeDropdown(tabela: string) {
    this.cfs.corrigeDropdown(tabela);
  }

  cssIncluir(): any {
    return (!this.mostraIncluir) ? null : {
      'background': 'var(--blue-200)',
      'border': 'none !important'
    };
  }

  cssIncluir2(): any {
    return (!this.mostraIncluir) ? null : {
      'background': 'var(--blue-200)',
      'padding': '0.55rem 1.65em 0.55rem 0',
      'border': 'none'
    };
  }

  cssAlterar(): any {
    return (this.acao !== 'editar') ? null : {
      'background': 'var(--yellow-200)'
    };
  }

  cssAlterar2(): any {
    return (this.acao !== 'editar') ? null : {
      'background': 'var(--yellow-200)',
      'padding': '0.55rem 0 0.55rem 0.5em',
      'border': 'none'
    };
  }

  cssApagar(): any {
    return (this.acao !== 'deletar') ? null : {
      'background': 'var(--pink-200)',
      'border': 'none'
    };
  }

  cssApagar2(): any {
    return (this.acao !== 'deletar') ? null : {
      'background': 'var(--pink-200)',
      'padding': '1rem 0.5rem',
      'border': 'none'
    };
  }

  apagaMsg() {
    this.msg = [];
    this.msgErro = [];
  }


}
