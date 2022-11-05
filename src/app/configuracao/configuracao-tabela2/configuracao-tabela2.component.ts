import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  Input,
  SimpleChanges,
  Output,
  EventEmitter,
  ViewChild, ElementRef
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfiguracaoService } from "../_services";
import { take } from "rxjs/operators";
import { AuthenticationService } from "../../_services";
import { ConfirmationService, Message, SelectItem } from "primeng/api";
import { DropdownService } from "../../_services";
import {
  Configuracao2Model,
  Configuracao2ModelInterface, Configuracao2RegistroI, ConfiguracaoModelInterface, ConfiguracaoRegistroI,
} from "../_models/configuracao-model";
import {MsgService} from "../../_services/msg.service";
import {WindowsService} from "../../_layout/_service";
import {DdService} from "../../_services/dd.service";

@Component({
  selector: 'app-configuracao-tabela2',
  templateUrl: './configuracao-tabela2.component.html',
  styleUrls: ['./configuracao-tabela2.component.css'],
  providers: [ConfirmationService]
})
export class ConfiguracaoTabela2Component implements OnInit, OnChanges, OnDestroy {
  @ViewChild('btnAlt', {static: true}) btnAlt: ElementRef;
  @Output() onConfTitulo = new EventEmitter<ConfiguracaoModelInterface>();
  @Input() componente?: string = null;

  private sub: Subscription[] = [];
  configuracao: Configuracao2ModelInterface | null = null;
  listagem: Configuracao2RegistroI[] = [];
  perIncluir = false;
  perAltarar = false;
  perDeletar = false;
  mostraIncluir = false;
  mostraAlterar = false;
  btnacaoInativo = false;
  registro: Configuracao2RegistroI = {
    campo_id: 0,
    campo_id2: 0,
    campo_nome: null,
    campo_nome2: null
  };
  registroOld: Configuracao2RegistroI | null = null;
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
  drop: number | null = null;
  altura = `${WindowsService.altura - 170}` + 'px';
  alterarFake = false;
  apagarFake = false;
  btnAlterar: boolean = true;

  cpn: string = null;

  constructor(
    public cfs: ConfiguracaoService,
    public aut: AuthenticationService, // private dd: DropdownService,
    private dd: DdService,
    private ms: MsgService,
    private cf: ConfirmationService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.componente) {
      this.cpn = changes.componente.currentValue.toString();
      switch (changes.componente.currentValue) {
        case 'prioridade': {
          this.configuracao = {
            tabela: 'prioridade',
            campo_id: 'prioridade_id',
            campo_id2: null,
            campo_nome: 'prioridade_nome',
            campo_txt1: 'prioridade_color',
            titulo: 'PRIORIDADES',
            campo_txt2: 'COR',
            texto: 'a prioridade',
            tamanho: 20,
          };
          this.inicio();
          break;
        }
        case 'tipo_cadastro': {
          this.configuracao = {
            tabela: 'tipo_cadastro',
            campo_id: 'tipo_cadastro_id',
            campo_id2: 'tipo_cadastro_tipo',
            campo_nome: 'tipo_cadastro_nome',
            titulo: 'TIPOS DE CADASTRO',
            campo_txt1: null,
            campo_txt2: 'PF/PJ',
            texto: 'o tipo de cadastro',
            tamanho: 30,
          }
          this.inicio();
          break;
        }
        default: {
          this.configuracao = null;
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
    this.resetAll();
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
    this.onConfTitulo.emit(this.configuracao);
    this.cfs.configuracao = this.configuracao;
    this.getDropDown(this.configuracao.tabela);
  }

  resetAll() {
    this.listagem = [];
    this.mostraIncluir = false;
    this.mostraAlterar = false;
    this.btnacaoInativo = false;
    this.btnCancelarInativo = false;
    delete this.registro;
    delete this.registroOld;
    this.acao = null;
    this.msgErro = [];
    this.msg = [];
    this.idx = -1;
    this.titulo = 'CONFIGURAÇÕES';
    this.dropDown = [];
    this.resp = [];
    this.confirmaAlterar = false;
    this.mostraAlterar = false;
    this.readOnly = false;
    this.mostraApagar = false
    this.confirmaApagar = false
    this.btnEnviarInativo = false;
    this.drop = null;
    this.alterarFake = false;
    this.apagarFake = false;
  }

  onCancela(cf: ConfiguracaoRegistroI, idx: number, cancelaVF: boolean = false) {
    if (this.acao === 'editar' && cancelaVF) {
      this.listagem[idx] = this.registroOld;
    }
    this.alterarFake = false;
    this.apagarFake = false;
    this.readOnly = false;
    this.mostraIncluir = false;
    this.btnacaoInativo = false;
    this.btnCancelarInativo = false;
    delete this.registro;
    delete this.registroOld;
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
    this.drop = null;
    this.listagemDrop();
  }

  onRowEditCancel(cf: ConfiguracaoRegistroI, idx: number, cancelaVF: boolean = false) {
    if (this.acao === 'editar' && cancelaVF) {
      this.registro[idx] = this.registroOld;
    }
    this.readOnly = false;
    this.mostraIncluir = false;
    this.btnacaoInativo = false;
    this.btnCancelarInativo = false;
    delete this.registro;
    delete this.registroOld;
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
      campo_id: 0,
      campo_nome: null
    }
    this.btnacaoInativo = true;
    this.mostraIncluir = !this.mostraIncluir;
    this.btnCancelarInativo = false;
    this.btnEnviarInativo = false;
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
      this.registro.campo_nome = this.registro.campo_nome.toUpperCase();
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
              this.registro.campo_id = +this.resp[1];
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
              this.ms.add({key: 'toastprincipal', severity: 'info', summary: 'INCLUIR', detail: this.resp[2][0]});
              this.onCancela(this.registro, 0);
            } else {
              this.msgErro.push({key: 'msgIncluirErro', severity: 'warn', summary: 'INCLUIR', detail: this.resp[2][0]});
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

  onRowEditInit(cf: ConfiguracaoRegistroI, idx: number) {
    const cfn: string = cf.campo_nome;
    const cfv: number = cf.campo_id;
    this.registroOld = {
      campo_id: cfv,
      campo_nome: cfn
    };
    cf.campo_nome = cf.campo_nome.toUpperCase();
    this.msg = [];
    this.msgErro = [];
    this.btnacaoInativo = true;
    this.acao = 'editar';
    this.confirmaAlterar = false;
    this.registro = cf;
    this.idx = idx;
    this.btnEnviarInativo = false;
    this.mostraAlterar = !this.mostraAlterar;
  }

  onAlterar(cd: ConfiguracaoRegistroI, i: number) {
    cd.campo_nome = cd.campo_nome.toUpperCase();
    const n: number = this.dropDown.findIndex(r => r.label.toUpperCase() === cd.campo_nome.toUpperCase());
    if (cd.campo_nome !== null && cd.campo_nome.toUpperCase() !== this.registroOld.campo_nome.toUpperCase() && cd.campo_nome.length > 1 && n < 0) {
      this.btnacaoInativo = true;
      this.btnCancelarInativo = true;
      this.btnEnviarInativo = true;
      this.msgErro = [];
      this.msg = [];
      this.readOnly = true;
      const dados: any[] = [];
      dados.push(this.configuracao.tabela);
      dados.push(+cd.campo_id);
      dados.push(cd.campo_nome.toUpperCase());
      this.sub.push(this.cfs.impactoAlterar(dados)
        .pipe(take(1))
        .subscribe((dados1) => {
            this.resp = dados1;
          },
          (err) => {
            console.error(err);
            this.onCancela(cd, i);
          },
          () => {
            if (!this.resp[0]) {
              this.listagem[i] = this.registroOld;
              this.confirmaAlterar = false;
              this.msgErro.push({key: 'msgAlterarErro', severity: 'warn', summary: 'ALTERAR', detail: this.resp[2][0]});
              this.btnCancelarInativo = false;
              this.btnEnviarInativo = false;
              this.readOnly = false;
            } else {
              if (this.resp[3]) {
                this.registro = cd;
                this.confirmaAlterar = true;
                this.alterarFake = false;
                const str: string = 'Vinculo(s): ' + this.resp[2].join(', ') + '.';
                this.msg.push(str);
                this.btnCancelarInativo = false;
                this.btnEnviarInativo = false;
                this.readOnly = true;
              }
              if (!this.resp[3]) {
                this.registro = cd;
                this.alterarFake = true;
                this.btnEnviarInativo = false;
                this.btnAlt.nativeElement.click();
              }
            }
          }
        )
      )
    } else {
      if (cd.campo_nome === null || cd.campo_nome.length === 0) {
        this.msgErro.push({
          key: 'msgAlterarErro',
          severity: 'warn',
          summary: 'ALTERAR',
          detail: 'ERRO - Registro com 0 caracteres.'
        });
      }
      if (cd.campo_nome.toUpperCase() === this.registroOld.campo_nome.toUpperCase()) {
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

  onRowEditSave(cd: ConfiguracaoRegistroI, i: number) {
    cd.campo_nome = cd.campo_nome.toUpperCase();
    if (!this.alterarFake) {
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
              this.listagem[i] = cd;
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
              this.onCancela(cd, i);
            } else {
              this.registro = this.registroOld;
              this.listagem[i] = this.registroOld;
              this.confirmaAlterar = false;
              this.msgErro.push({key: 'msgAlterarErro', severity: 'warn', summary: 'ALTERAR', detail: this.resp[2][0]});
              this.btnCancelarInativo = false;
              this.btnEnviarInativo = false;
              this.readOnly = false;
            }
          }
        )
      );
    } else {
      this.listagem[i] = this.registro;
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
      this.onCancela(cd, i);
    }

  }

  clickDeletar(cf: ConfiguracaoRegistroI, idx: number) {
    const cfn: string = cf.campo_nome;
    const cfv: number = cf.campo_id;
    this.registroOld = {
      campo_id: cfv,
      campo_nome: cfn
    };
    this.msg = [];
    this.msgErro = [];
    this.btnacaoInativo = true;
    this.acao = 'deletar';
    this.mostraApagar = true;
    this.confirmaApagar = false;
    this.registro = cf;
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
          if (this.resp[3]) {
            this.dropDown.splice(+idx, 1);
          }
        },
        (err) => {
          console.error(err);
          this.onCancela(cf, idx);
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
              this.listagem.splice(+idx, 1);
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
              this.onCancela(cf, idx);
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

  onApagarConfirma(i: number) {
    this.btnacaoInativo = true;
    this.btnCancelarInativo = true;
    this.btnEnviarInativo = true;
    this.msg = [];
    if (this.drop !== null && +this.drop > 0 && +this.drop !== +this.registro.campo_id) {
      const dados: any = {
        'tabela': this.configuracao.tabela,
        'id': +this.registro.campo_id,
        'novo_id': +this.drop
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
            this.listagem.splice(i, 1);
            sessionStorage.removeItem('dropdown-' + this.configuracao.tabela);
            sessionStorage.setItem('dropdown-' + this.configuracao.tabela, JSON.stringify(this.dropDown));
            this.ms.add({key: 'toastprincipal', severity: 'info', summary: 'Exclusão: ', detail: this.resp[2][0]});
            this.onCancela({}, i);
          })
      );
    }


  }

  mudaTeste(cno: string, cno2: string) {
    this.registro.campo_nome = cno.toUpperCase();
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
    };
  }

  cssAlterar(vf: boolean, idx: number): any {
    return (this.acao === 'editar' && vf && this.idx === idx) ? {
      'background': 'var(--yellow-200)'
    } : (this.acao === 'deletar' && this.idx === idx) ? {
      'background': 'var(--pink-200)',
      'border': 'none'
    } : null;
  }

  cssAlterar2(vf: boolean, idx: number): any {
    return (this.acao === 'editar' && vf && this.idx === idx) ? {
      'background': 'var(--yellow-200)',
      'padding': '0.55rem 0 0.55rem 0.5em'
    } : (this.acao === 'deletar' && this.idx === idx) ? {
      'background': 'var(--pink-200)',
      'padding': '1rem 0.5rem',
      'border': 'none'
    } : null;
  }

  cssApagar(idx: number): any {
    return (this.acao === 'deletar' && this.idx === idx) ? {
      'background': 'var(--pink-200)',
      'border': 'none'
    } : null;
  }

  cssApagar2(idx: number): any {
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

  listagemDrop() {
    this.dropDown = this.listagem.map((d) => {
      return {
        value: +d.campo_id,
        label: d.campo_nome
      }
    });
  }

  dropListagem() {
    this.listagem = this.dropDown.map((d) => {
      return {
        campo_id: +d.value,
        campo_nome: d.label
      }
    });

  }

  testaCampoNome(ev: string) {
    this.btnAlterar = (this.btnEnviarInativo || ev === null || ev.length === 0 || ev.toUpperCase() === this.registroOld.campo_nome.toUpperCase());
  }

  btnAlterarAtivo(): boolean {
    return this.btnAlterar;
  }


}
