import {Component, OnInit, OnDestroy, OnChanges, SimpleChanges, Input, Output, EventEmitter} from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfiguracaoService } from '../_services';
import { take } from 'rxjs/operators';
import { AuthenticationService, CarregadorService } from '../../_services';
import { Message, MessageService, SelectItem } from 'primeng/api';
import { DropdownService } from '../../_services';
import {ConfiguracaoModel, ConfiguracaoModelInterface} from '../_models/configuracao-model';

@Component({
  selector: 'app-configuracao-tabela',
  templateUrl: './configuracao-tabela.component.html',
  styleUrls: ['./configuracao-tabela.component.css']
})
export class ConfiguracaoTabelaComponent implements OnInit, OnChanges, OnDestroy {
  @Output() onConfTitulo = new EventEmitter<ConfiguracaoModelInterface>();
  @Input() componente?: string = null;

  private sub: Subscription[] = [];
  listagem: any[] = null;
  perIncluir = false;
  perAltarar = false;
  perDeletar = false;
  perPrincipal = false;
  perResponsavel = false;
  nome: string = null;
  id: number = null;
  idx: number = null;
  mostraAlterar = 0;
  mostraApagar = 0;
  mostraDropDown = false;
  dropDown: SelectItem[] = null;
  drop = 0;
  acao: string = null;
  tabel: string = null;
  msgs: Message[] = [];
  resp: any[];
  nomeIncluir: string = null;
  colsp = 1;
  nomeOld: string = null;
  confirmaAlterar = false;
  confirmaApagar = false;
  tabela: string = null;
  configuracao = new ConfiguracaoModel();
  titulo = 'CONFIGURAÇÕES'
  btnOff = false;

  mostraIncluir = false;

  msgErroIncluir: Message[];
  msgErroEditar: Message[];

  constructor(
    public cfs: ConfiguracaoService,
    public alt: AuthenticationService,
    private cs: CarregadorService,
    private dd: DropdownService,
    private messageService: MessageService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.componente) {
      switch (changes.componente.currentValue) {
        case 'area_interesse': {
          this.configuracao = {
            tabela: 'area_interesse',
            campo_id: 'area_interesse_id',
            campo_nome: 'area_interesse_nome',
            titulo: 'ÁREAS DE INTERESSE',
            texto: 'a área de interesse'
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
            texto: 'o assunto'
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
            texto: 'a companhias aérea'
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
            texto: 'a escolaridade'
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
            texto: 'o estado'
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
            texto: 'o estado civil'
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
            texto: 'o grupo'
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
            texto: 'o município'
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
            texto: 'o O.G.U.'
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
            texto: 'a origem da proposicao'
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
            texto: 'o orgão da proposicao'
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
            texto: 'o tipo de emenda'
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
            texto: 'o tipo de proposição'
          }
          this.inicio();
          break;
        }
        case 'emenda_proposicao': {
          this.configuracao = {
            tabela: 'emenda_proposicao',
            campo_id: 'emenda_proposicao_id',
            campo_nome: 'emenda_proposicao_nome',
            titulo: 'TIPO DE EMEDA DE PROPOSIÇÃO',
            texto: 'o tipo de emenda de proposição'
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
            texto: 'o tipo de encaminhamento'
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
            texto: 'o tipo de recebimento'
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
            texto: 'o tratamento'
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
            texto: 'a situação da proposição'
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

  ngOnInit(): void { }

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
    this.perIncluir = this.alt.configuracao_incluir;
    this.perAltarar = this.alt.configuracao_alterar;
    this.perDeletar = this.alt.configuracao_apagar;
    this.perPrincipal = this.alt.usuario_principal_sn;
    this.perResponsavel = this.alt.usuario_responsavel_sn;
    this.colsp = 1;
    if (this.alt.configuracao_alterar) {
      this.colsp++;
    }
    if (this.alt.configuracao_apagar) {
      this.colsp++;
    }
    this.tabela = this.configuracao.tabela;
    this.tabel = this.configuracao.tabela;
    this.titulo = this.configuracao.titulo;
    this.cfs.configuracao = this.configuracao;
    // this.onConfTitulo.emit(this.configuracao);
    this.getAll(this.configuracao.tabela);
    this.btnOff = false;
  }

  resetAll() {
    this.listagem = null;
    this.perIncluir = false;
    this.perAltarar = false;
    this.perDeletar = false;
    this.perPrincipal = false;
    this.perResponsavel = false;
    this.nome  = null;
    this.id  = null;
    this.idx  = null;
    this.mostraAlterar = 0;
    this.mostraApagar = 0;
    this.mostraDropDown = false;
    this.dropDown = null;
    this.drop = 0;
    this.acao  = null;
    this.tabel  = null;
    this.msgs  = [];
    this.resp = null;
    this.nomeIncluir = null;
    this.colsp = 1;
    this.nomeOld = null;
    this.confirmaAlterar = false;
    this.confirmaApagar = false;
    this.tabela = null;
    this.mostraIncluir = false;
    this.msgErroIncluir = null;
    this.msgErroEditar = null;
    this.btnOff = false;
  }

  getAll(tabela: string) {
    this.getDropDown(tabela);
    const dados: any[] = [];
    dados.push(tabela);
    this.sub.push(this.cfs.postListarAll(dados)
      .pipe(take(1))
      .subscribe((dados1) => {
          this.listagem = dados1;
        },
        (err) => {
          console.error(err);
        },
        () => {
          this.onConfTitulo.emit(this.configuracao);
        }
      )
    );
  }

  getDropDown(tabela: string) {
    const dropDownNome = 'dropdown-' + tabela;
    let tp: number = null;
    switch (tabela) {
      case 'area_interesse' :
        tp = 1;
        break;
      case 'assunto' :
        tp = 1;
        break;
      case 'aerolinha' :
        tp = 1;
        break;
      case 'escolaridade' :
        tp = 1;
        break;
      case 'estado' :
        tp = 1;
        break;
      case 'estado_civil' :
        tp = 1;
        break;
      case 'grupo' :
        tp = 1;
        break;
      case 'municipio' :
        tp = 1;
        break;
      case 'ogu' :
        tp = 1;
        break;
      case 'origem_proposicao' :
        tp = 1;
        break;
      case 'orgao_proposicao' :
        tp = 1;
        break;
      case 'tipo_emenda' :
        tp = 1;
        break;
      case 'tipo_proposicao' :
        tp = 1;
        break;
      case 'emenda_proposicao' :
        tp = 1;
        break;
      case 'andamento' :
        tp = 1;
        break;
      case 'tipo_recebimento' :
        tp = 1;
        break;
      case 'tratamento' :
        tp = 1;
        break;
      case 'situacao_proposicao' :
        tp = 1;
        break;


    }
    if (tp === 1) {
      if (!sessionStorage.getItem(dropDownNome)) {
        this.sub.push(this.dd.getDropdownNomeId(this.configuracao.tabela, this.configuracao.campo_id, this.configuracao.campo_nome)
          .pipe(take(1))
          .subscribe({
            next: (dados) => {
              this.dropDown = dados;
            },
            error: (erro) => {
              console.error(erro);
            },
            complete: () => {
              sessionStorage.setItem(dropDownNome, JSON.stringify(this.dropDown));
              this.dropDown = JSON.parse(sessionStorage.getItem(dropDownNome));
            }
          })
        );
      } else {
        this.dropDown = JSON.parse(sessionStorage.getItem(dropDownNome));
      }
    }

  }

  onEditar(id: number, nome: string, idx: number) {
    this.msgErroEditar = null;
    this.messageService.clear();
    this.acao = 'editar';
    this.mostraApagar = 0;
    if (this.mostraAlterar === 0) {
      if (id) {
        this.mostraAlterar = id;
        this.id = id;
        this.nome = nome;
        this.idx = idx;
        this.nomeOld = nome;
      }
    }
    this.btnOff = true;
  }

  onAlterar() {
    this.msgErroEditar = null;
    this.messageService.clear();
    if (this.nome && this.nome !== this.nomeOld) {
      if (this.nome.length > 1) {
        const dados: any[] = [];
        dados.push(this.tabel);
        dados.push(this.id);
        dados.push(this.nome);
        const msg: string[] = null;
        this.sub.push(this.cfs.impactoAlterar(dados)
          .pipe(take(1))
          .subscribe((dados1) => {
              this.resp = dados1;
            },
            (err) => {
              console.error(err);
            },
            () => {
              if (!this.resp[0]) {
                this.nome = this.nomeOld;
                this.confirmaAlterar = false;
                this.mostraMsgs(this.resp[2]);
              } else {
                if (this.resp[1] === 0) {
                  this.confirmaAlterar = true;
                }
                if (+this.resp[1] === +this.id) {
                  this.corrigeDropdown(this.tabel);
                  const tmp = this.listagem.find(i =>
                    i.campo_id === this.id
                  );
                  if (tmp !== undefined) {
                    this.listagem[this.listagem.indexOf(tmp)] = {
                      campo_id: tmp.campo_id,
                      campo_nome: this.nome.toString().toUpperCase()
                    };
                  }
                  this.onCancela();
                  this.messageService.add({
                    key: 'msg2',
                    severity: 'success',
                    summary: 'Alterações: ',
                    detail: this.resp[2]
                  });
                }
                this.mostraMsgs(this.resp[2]);
              }
            }
          )
        );

      }
    }
  }

  onAlterarConfirma() {
    this.messageService.clear();
    if (this.nome && this.nome !== this.nomeOld) {
      if (this.nome.length > 1) {
        const dados: any[] = [];
        dados.push(this.tabel);
        dados.push(this.id);
        dados.push(this.nome);
        const msg: string[] = null;
        this.sub.push(this.cfs.alterar(dados)
          .pipe(take(1))
          .subscribe((dados1) => {
              this.resp = dados1;
            },
            (err) => {
              console.error(err);
            },
            () => {
              if (+this.resp[1] === +this.id) {
                this.corrigeDropdown(this.tabel);
                const tmp = this.listagem.find(i =>
                  i.campo_id === this.id
                );
                if (tmp !== undefined) {
                  this.listagem[this.listagem.indexOf(tmp)] = {
                    campo_id: tmp.campo_id,
                    campo_nome: this.nome.toString().toUpperCase()
                  };
                }
                this.onCancela();
                this.messageService.add({key: 'msg2', severity: 'success', summary: 'Alterações: ', detail: this.resp[2]});
              } else {
                this.mostraMsgs(this.resp[2]);
              }
            }
          )
        );

      }
    }
  }

  onIncluir() {
    this.acao = 'incluir';
    this.btnOff = true;
    this.msgErroIncluir = null;
    this.messageService.clear();
    if (this.nomeIncluir) {
      if (this.nomeIncluir.length > 1) {
        const dados: any[] = [];
        dados.push(this.tabel);
        dados.push(this.nomeIncluir);
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
                this.listagem.push({campo_id: this.resp[1], campo_nome: this.nomeIncluir.toUpperCase()});
                this.corrigeDropdown(this.tabel);
                this.messageService.add({key: 'msgIncluir', severity: 'info', summary: 'INCLUIR: ', detail: this.resp[2]});
                this.onCancela();
              } else {
                this.msgErroIncluir = [{key: 'msgIncluirErro', severity: 'warn', summary: 'INCLUIR: ', detail: this.resp[2]}];
                this.onCancela();
              }
            }
          )
        );
      } else {
        this.msgErroIncluir = [{key: 'msgIncluirErro', severity: 'warn', summary: 'INCLUIR: ', detail: 'DADOS INVÁLIDOS.'}];
      }
    }
  }

  mostraMsgs(res: string[]) {
    if (this.resp[0]) {
      if (res.length > 0) {
        if (this.resp[1] === 0) {
          res.forEach((m: string) => {
            this.msgs.push({key: 'msg1', severity: 'info', summary: 'Alterações: ', detail: m});
          });
        } else {
          this.messageService.add({key: 'msg2', severity: 'success', summary: 'Alterações: ', detail: this.resp[2]});
        }
      }
    } else {
      this.msgs.push({key: 'msg1', severity: 'error', summary: 'Alterações: ', detail: this.resp[2]});
    }
  }

  onApagar() {
    this.btnOff = true;
    this.acao = 'deletar';
    const dados: any = {
      'tabela': this.tabel,
      'id': this.id
    };
    this.messageService.clear();
    this.sub.push(this.cfs.deletar(dados)
      .pipe(take(1))
      .subscribe((dados3) => {
          this.resp = dados3;
        },
        (err) => {
          console.error(err);
        },
        () => {
          const tmp = this.listagem.find(i =>
            i.campo_id === this.id
          );
          if (tmp !== undefined) {
            const idx = this.listagem.indexOf(tmp);
            this.listagem.splice(idx, 1);
          }
          this.messageService.add({key: 'msgExcluir', severity: 'info', summary: 'Exclusão: ', detail: this.resp[2]});
          this.onCancela();
        })
    );
  }

  onDeletar(id: number, nome: string, idx: number) {
    this.acao = 'deletar';
    this.btnOff = true;
    this.mostraAlterar = 0;
    this.mostraApagar = id;
    this.id = id;
    this.nome = nome;
    this.idx = idx;
    this.drop = 0;
    this.nomeOld = nome;
    this.resp = null;
    this.msgs = [];
    this.mostraDropDown = false;
    this.messageService.clear();
    const dados: any[] = [];
    dados.push(this.tabel);
    dados.push(this.id);
    this.sub.push(this.cfs.impactoDelete(dados)
      .pipe(take(1))
      .subscribe((dados4) => {
          this.resp = dados4;
        },
        (err) => {
          console.error(err);
        },
        () => {
          this.confirmaApagar = this.resp[0];
          if (this.resp[2].length > 0) {
            this.resp[2].forEach((m: string) => {
              this.msgs.push({key: 'msg1', severity: 'info', summary: 'Vinculo(s): ', detail: m});
            });
          }
          if (this.confirmaApagar && this.resp[3]) {
            this.drop = this.id;
            this.mostraDropDown = true;
          }
          if (!this.confirmaApagar) {
            this.msgs.push({key: 'msg2', severity: 'info', summary: 'Exclusão: ', detail: 'Você não tem permissões suficientes'});
          }
        }
      )
    );
  }

  onApagarConfirma() {
    this.msgs = [];
    if (+this.drop > 0 && +this.drop !== this.id) {
      const dados: any = {
        'tabela': this.tabel,
        'id': this.id,
        'novo_id': this.drop
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
            this.corrigeDropdown(this.tabel);
            this.msgs.push({key: 'msg1', severity: 'info', summary: 'Exclusão: ', detail: this.resp[2]});
            this.onCancela();
          })
      );
    }
  }

  onCancela() {
    this.acao = null;
    this.nome = null;
    this.nomeIncluir = null;
    this.id = null;
    this.idx = null;
    this.nomeOld = null;
    this.mostraAlterar = 0;
    this.mostraApagar = 0;
    this.mostraIncluir = false;
    this.colsp = 1;
    if (this.alt.configuracao_alterar) {
      this.colsp++;
    }
    if (this.alt.configuracao_apagar) {
      this.colsp++;
    }
    this.confirmaAlterar = false;
    this.btnOff = false;
  }

  corrigeDropdown(tabela: string) {
    this.cfs.corrigeDropdown(tabela);
  }

  clickIncluir() {
    this.mostraIncluir = !this.mostraIncluir;
  }

  cssIncluir(): any {
    return (!this.mostraIncluir) ? null : {
      'background': 'var(--blue-200)'
    };
  }

  cssAlterar(): any {
    return (this.mostraAlterar === 0) ? null : {
      'background': 'var(--yellow-200)'
    };
  }

  cssApagar(): any {
    return (this.acao!=='deletar') ? null : {
      'background': 'var(--pink-200)'
    };
  }
}
