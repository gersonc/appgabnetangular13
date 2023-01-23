import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {Subscription} from 'rxjs';
import {ConfiguracaoService} from "../_services";
import {take} from "rxjs/operators";
import {AuthenticationService} from "../../_services";
import {Message, SelectItem} from "primeng/api";
import {
  Configuracao2ModelInterface,
  Configuracao2RegistroI,
  ConfiguracaoModelInterface,
} from "../_models/configuracao-model";
import {MsgService} from "../../_services/msg.service";
import {WindowsService} from "../../_layout/_service";
import {DdService} from "../../_services/dd.service";
import {SelectItemGroup} from "primeng/api/selectitemgroup";

@Component({
  selector: 'app-configuracao-tabela2',
  templateUrl: './configuracao-tabela2.component.html',
  styleUrls: ['./configuracao-tabela2.component.css']
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
  regTmp: Configuracao2RegistroI = {
    campo_id: 0,
    campo_id2: 0,
    campo_nome: null,
    campo_nome2: null
  };
  registroOld: Configuracao2RegistroI | null = null;
  acao: string | null = null;
  msg: string[] = [];
  msgErro: Message[] = [];
  idx = -1;
  titulo = 'CONFIGURAÇÕES';
  dropDown: SelectItem[] | SelectItemGroup[] = [];
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
  btnAlterar = true;

  ddtipo: SelectItem[] = [
    {label: 'PESSOA FISICA', value: 1}, {label: 'PESSOA JURIDICA', value: 2}
  ];
  cpn: string = null;
  tp = false;
  campoTxt2: string = null;

  constructor(
    public cfs: ConfiguracaoService,
    public aut: AuthenticationService, // private dd: DropdownService,
    private dd: DdService,
    private ms: MsgService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.componente) {
      this.cpn = changes.componente.currentValue.toString();
      switch (changes.componente.currentValue) {
        case 'calendario_status': {
          this.configuracao = {
            tabela: 'calendario_status',
            campo_id: 'calendario_status_id',
            campo_id2: null,
            campo_nome: 'calendario_status_nome',
            campo_nome2: 'calendario_status_color',
            titulo: 'AGENDA STATUS',
            campo_txt1: 'STATUS',
            campo_txt2: 'COR',
            texto: 'o status',
            tamanho: 45,
            bloqueio_id: 20
          };
          this.tp = false;
          this.inicio();
          break;
        }
        case 'evento_type': {
          this.configuracao = {
            tabela: 'evento_type',
            campo_id: 'type_id',
            campo_id2: null,
            campo_nome: 'type_name',
            campo_nome2: 'type_color',
            titulo: 'TIPO DE EVENTO (AGENDA)',
            campo_txt1: 'TIPO DE EVENTO',
            campo_txt2: 'COR',
            texto: 'o tipo de evento',
            tamanho: 50,
            bloqueio_id: 20
          };
          this.tp = false;
          this.inicio();
          break;
        }
        case 'prioridade': {
          this.configuracao = {
            tabela: 'prioridade',
            campo_id: 'prioridade_id',
            campo_id2: null,
            campo_nome: 'prioridade_nome',
            campo_nome2: 'prioridade_color',
            titulo: 'PRIORIDADES',
            campo_txt1: 'PRIORIDADE',
            campo_txt2: 'COR',
            texto: 'a prioridade',
            tamanho: 20,
            bloqueio_id: 20
          };
          this.tp = false;
          this.inicio();
          break;
        }
        case 'tipo_cadastro': {
          this.configuracao = {
            tabela: 'tipo_cadastro',
            campo_id: 'tipo_cadastro_id',
            campo_id2: 'tipo_cadastro_tipo',
            campo_nome: 'tipo_cadastro_nome',
            campo_nome2: null,
            titulo: 'TIPOS DE CADASTRO',
            campo_txt1: 'TIPO DE CADASTRO',
            campo_txt2: 'PF/PJ',
            texto: 'o tipo de cadastro',
            tamanho: 30,
            bloqueio_id: 20
          };
          this.tp = true;
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

  onCancela(cf: Configuracao2RegistroI, idx: number, cancelaVF = false) {
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

  onRowEditCancel(cf: Configuracao2RegistroI, idx: number, cancelaVF = false) {
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
            this.listagem = this.dropToReg(this.dropDown);
          }
        })
      );
    } else {
      this.dropDown = JSON.parse(sessionStorage.getItem('dropdown-' + this.configuracao.tabela));
      this.listagem = this.dropToReg(JSON.parse(sessionStorage.getItem('dropdown-' + this.configuracao.tabela)));

    }
  }

  clickIncluir() {
    this.acao = 'incluir';
    this.msg = [];
    this.msgErro = [];
    this.registroOld = {
      campo_id: 0,
      campo_id2: null,
      campo_nome: '',
      campo_nome2: ''
    }
    this.registro = {
      campo_id: 0,
      campo_id2: null,
      campo_nome: null,
      campo_nome2: null
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
      if (this.tp) {
        dados.push(this.registro.campo_id2);
      } else {
        if (this.registro.campo_nome2 !== null && this.registro.campo_nome2.length > 4) {
          this.registro.campo_nome2 = this.registro.campo_nome2.toUpperCase();
          dados.push(this.registro.campo_nome2);
        } else {
          dados.push(null);
        }
      }
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
              this.dropDown = this.regToDrop(this.listagem);
              sessionStorage.removeItem('dropdown-' + this.configuracao.tabela);
              sessionStorage.setItem('dropdown-' + this.configuracao.tabela, JSON.stringify(this.dropDown));
              this.ms.add({key: 'toastprincipal', severity: 'success', summary: 'INCLUIR', detail: this.resp[2][0]});
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

  onRowEditInit(cf: Configuracao2RegistroI, idx: number) {
    const cfn: string = cf.campo_nome.toUpperCase();
    const cfv: number = cf.campo_id;
    const cfn2: string = (!this.tp) ? (cf.campo_nome2 !== null) ? cf.campo_nome2.toUpperCase() : '' : '';
    const cfv2: number = (this.tp) ? +cf.campo_id2 : 0;
    this.registroOld = {
      campo_id: cfv,
      campo_nome: cfn,
      campo_id2: cfv2,
      campo_nome2: cfn2
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

  onAlterar(cd: Configuracao2RegistroI, i: number) {
    cd.campo_nome = cd.campo_nome.toUpperCase();
    const cn2: string = (!this.tp) ? (cd.campo_nome2 !== null) ? cd.campo_nome2.toUpperCase() : '' : '';
    if (
      cd.campo_nome !== null &&
      ((this.tp === true && (cd.campo_nome.toUpperCase() !== this.registroOld.campo_nome.toUpperCase() || cd.campo_id2 !== this.registroOld.campo_id2)) ||
        (this.tp === false && (cd.campo_nome.toUpperCase() !== this.registroOld.campo_nome.toUpperCase() || cn2 !== this.registroOld))) &&
      cd.campo_nome.length > 1
    ) {
      this.btnacaoInativo = true;
      this.btnCancelarInativo = true;
      this.btnEnviarInativo = true;
      this.msgErro = [];
      this.msg = [];
      this.readOnly = true;
      const dados: any[] = [];
      dados.push(this.configuracao.tabela);
      dados.push(+cd.campo_id);
      dados.push(cd.campo_nome);
      if (this.tp) {
        dados.push(this.registro.campo_id2);
      } else {
        if (this.registro.campo_nome2 !== null && this.registro.campo_nome2.length > 4) {
          this.registro.campo_nome2 = this.registro.campo_nome2.toUpperCase();
          dados.push(this.registro.campo_nome2);
        } else {
          dados.push(null);
        }
      }
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
                this.confirmaAlterar = true;
                this.btnEnviarInativo = false;
                const bt = document.getElementById('btnAlt');
                bt.dispatchEvent(new Event("click"));
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
    }
  }

  onRowEditSave(cd: Configuracao2RegistroI, i: number) {
    this.btnEnviarInativo = true;
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
              this.dropDown = this.regToDrop(this.listagem);
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
      this.dropDown = this.regToDrop(this.listagem);
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

  clickDeletar(cf: Configuracao2RegistroI, idx: number) {
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
              this.dropDown = this.regToDrop(this.listagem);
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
            this.dropDown = this.regToDrop(this.listagem);
            sessionStorage.removeItem('dropdown-' + this.configuracao.tabela);
            sessionStorage.setItem('dropdown-' + this.configuracao.tabela, JSON.stringify(this.dropDown));
            this.ms.add({key: 'toastprincipal', severity: 'success', summary: 'Exclusão: ', detail: this.resp[2][0]});
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
    this.dropDown = this.regToDrop(this.listagem);
  }

  dropListagem() {
    this.listagem = this.dropDown.map((d) => {
      return {
        campo_id: +d.value,
        campo_nome: d.label
      }
    });

  }

  testaBtnEnviar(r: Configuracao2RegistroI): boolean {
    if (this.tp) {
      return (this.btnEnviarInativo ||
        r.campo_nome === null ||
        r.campo_nome.length === 0 ||
        (r.campo_nome.toUpperCase() === this.registroOld.campo_nome.toUpperCase() && r.campo_id2 === this.registroOld.campo_id2) ||
        r.campo_id2 === null ||
        (r.campo_id2 !== 1 && r.campo_id2 !== 2)
      );
    }
    if (!this.tp) {
      const cn2: string = (!this.tp) ? (r.campo_nome2 !== null) ? r.campo_nome2.toUpperCase() : '' : '';
      return (this.btnEnviarInativo ||
        r.campo_nome === null ||
        r.campo_nome.length === 0 ||
        (r.campo_nome.toUpperCase() === this.registroOld.campo_nome.toUpperCase() && cn2 === this.registroOld.campo_nome2)
      );
    }
  }

  mostraBtnEnviarStyle() {
    return {
      display: (!this.confirmaAlterar) ? 'none' : null
    }
  }

  testaCampoNome(ev: string) {
    this.btnAlterar = (this.btnEnviarInativo || ev === null || ev.length === 0 || ev.toUpperCase() === this.registroOld.campo_nome.toUpperCase());
  }

  btnAlterarAtivo(): boolean {
    return this.btnAlterar;
  }

  regToDrop(r: Configuracao2RegistroI[]): SelectItem[] | SelectItemGroup[] {
    if (this.configuracao.tabela === 'tipo_cadastro') {
      return [
        {
          label: "PESSOA FÍSICA",
          items: r.filter((d) => d.campo_id2 === 1).map((d) => {
            return {
              label: d.campo_nome,
              value: d.campo_id,
              title: d.campo_id2.toString(),
              styleClass: null
            }
          })
        },
        {
          label: "PESSOA JURÍDICA",
          items: r.filter((d) => d.campo_id2 !== 1).map((d) => {
            return {
              label: d.campo_nome,
              value: d.campo_id,
              title: d.campo_id2.toString(),
              styleClass: null
            }
          })
        }
      ];
    }

    if (this.configuracao.tabela === 'prioridade') {
      return r.map((d) => {
        return {
          label: d.campo_nome,
          value: d.campo_id,
          title: null,
          styleClass: d.campo_nome2
        }
      });
    }

    if (this.configuracao.tabela === 'calendario_status') {
      return r.map((d) => {
        return {
          label: d.campo_nome,
          value: d.campo_id,
          title: null,
          styleClass: d.campo_nome2
        }
      });
    }

    if (this.configuracao.tabela === 'evento_type') {
      return r.map((d) => {
        return {
          label: d.campo_nome,
          value: d.campo_id,
          title: null,
          styleClass: d.campo_nome2
        }
      });
    }

  }

  regSel(r: Configuracao2RegistroI): SelectItem {
    if (this.configuracao.tabela === 'tipo_cadastro') {
      return {
        label: r.campo_nome,
        value: r.campo_id,
        title: r.campo_id2.toString(),
        styleClass: null
      };
    }

    if (this.configuracao.tabela === 'prioridade') {
      return {
        label: r.campo_nome,
        value: r.campo_id,
        title: null,
        styleClass: r.campo_nome2
      };
    }

    if (this.configuracao.tabela === 'calendario_status') {
      return {
        label: r.campo_nome,
        value: r.campo_id,
        title: null,
        styleClass: r.campo_nome2
      };
    }

    if (this.configuracao.tabela === 'evento_type') {
      return {
        label: r.campo_nome,
        value: r.campo_id,
        title: null,
        styleClass: r.campo_nome2
      };
    }




  }

  dropToReg(r: SelectItem[] | SelectItemGroup[]): Configuracao2RegistroI[] {
    if (this.configuracao.tabela === 'tipo_cadastro') {
      return this.dropToRegAux(r.map((d) => {
        return d.items.map((i: SelectItem) => {
          return {
            campo_id: i.value,
            campo_id2: +i.title,
            campo_nome: i.label,
            campo_nome2: null
          };
        });
      }));
    }

    if (this.configuracao.tabela === 'prioridade') {
      return r.map((i) => {
        return {
          campo_id: i.value,
          campo_id2: null,
          campo_nome: i.label,
          campo_nome2: i.styleClass
        }
      });
    }

    if (this.configuracao.tabela === 'calendario_status') {
      return r.map((i) => {
        return {
          campo_id: i.value,
          campo_id2: null,
          campo_nome: i.label,
          campo_nome2: i.styleClass
        }
      });
    }

    if (this.configuracao.tabela === 'evento_type') {
      return r.map((i) => {
        return {
          campo_id: i.value,
          campo_id2: null,
          campo_nome: i.label,
          campo_nome2: i.styleClass
        }
      });
    }


  }

  pfpj(v) {
    return v === 1 ? 'PF' : 'PJ';
  }

  dddelChange(dddel: SelectItem) {
    if (this.tp) {
      this.campoTxt2 = (+dddel.title === 1) ? 'PESSOA FISICA' : 'PESSOA JURIDICA';
    }

    if (!this.tp) {
      this.campoTxt2 = dddel.styleClass;
    }
  }

  dropToRegAux(r: Configuracao2RegistroI[][]): Configuracao2RegistroI[] {
    return (r.length === 2) ? r[0].concat(r[1]) : r[0];
  }

  selReg(r: SelectItem): Configuracao2RegistroI {
    if (this.configuracao.tabela === 'tipo_cadastro') {
      return {
        campo_id: r.value,
        campo_id2: +r.title,
        campo_nome: r.label,
        campo_nome2: null
      };
    }

    if (this.configuracao.tabela === 'prioridade') {
      return {
        campo_id: r.value,
        campo_id2: null,
        campo_nome: r.label,
        campo_nome2: r.styleClass
      };
    }

    if (this.configuracao.tabela === 'calendario_status') {
      return {
        campo_id: r.value,
        campo_id2: null,
        campo_nome: r.label,
        campo_nome2: r.styleClass
      };
    }

    if (this.configuracao.tabela === 'evento_type') {
      return {
        campo_id: r.value,
        campo_id2: null,
        campo_nome: r.label,
        campo_nome2: r.styleClass
      };
    }



  }

  boxCor(cor?: string): any {
    const b: string = (cor === undefined || cor === null) ? 'transparent' : cor;
    let c: string = (cor === undefined || cor === null) ? 'var(--text-color)' : cor;
    if (c === 'var(--text-color)' || c.substring(0, 4) === 'var(' || ((c.length < 3 || c.length > 4) && (c.length < 6 || c.length > 7))) {
      c = 'var(--text-color)';
    } else {
      c = this.setForegroundColor(cor);
    }
    return {
      border: '2px solid var(--surface-400)',
      padding: '0.429em',
      height: '30px',
      width: '2em',
      float: 'left',
      margin: 0,
      color: c,
      background: b,
      transition: 'box-shadow 0.2s',
      borderRadius: 0,
      'vertical-align': 'baseline'
    }
  }

  ddcor(cor?: string): any {
    const b: string = (cor === undefined || cor === null) ? 'transparent' : cor;
    let c: string = (cor === undefined || cor === null) ? 'var(--text-color)' : cor;
    if (c === 'var(--text-color)' || c.substring(0, 4) === 'var(' || ((c.length < 3 || c.length > 4) && (c.length < 6 || c.length > 7))) {
      c = 'var(--text-color)';
    } else {
      c = this.setForegroundColor(cor);
    }
    return {
      margin: 0,
      padding: '0.2rem 1rem',
      border: 0,
      color: c,
      background: b,
      transition: 'box-shadow 0.2s',
      borderRadius: 0
    }
  }

  getCorTxt(campo_txt1?: string | null): string {
    if (campo_txt1 === undefined || campo_txt1 === null) {
      return 'NÃO DEFINIDO';
    } else {
      if (campo_txt1.substring(0, 4) === 'var(') {
        return 'PADRÃO';
      } else {
        return campo_txt1;
      }
    }
  }

  setForegroundColor(cor: string) {
    const rgb = this.hexToRGB(cor, false);
    const sum = Math.round(((parseInt(rgb[0]) * 299) + (parseInt(rgb[1]) * 587) + (parseInt(rgb[2]) * 114)) / 1000);
    return (sum > 128) ? 'black' : 'white';
  }

  hexToRGB(h, isPct) {
    const ex = /^#([\da-f]{3}){1,2}$/i;
    if (ex.test(h)) {
      let r: any = 0, g: any = 0, b: any = 0;
      isPct = isPct === true;

      // 3 digits
      if (h.length == 4) {
        r = "0x" + h[1] + h[1];
        g = "0x" + h[2] + h[2];
        // @ts-ignore
        b = "0x" + h[3] + h[3];
      } else if (h.length == 7) {
        r = "0x" + h[1] + h[2];
        g = "0x" + h[3] + h[4];
        b = "0x" + h[5] + h[6];
      }
      if (isPct) {
        r = +(r / 255 * 100).toFixed(1);
        g = +(g / 255 * 100).toFixed(1);
        b = +(b / 255 * 100).toFixed(1);
      }
      return "rgb(" + (isPct ? r + "%," + g + "%," + b + "%" : +r + "," + +g + "," + +b) + ")";

    } else {
      return null;
    }
  }


}
