import {Component, OnInit, OnDestroy, OnChanges, Input, SimpleChanges, Output, EventEmitter} from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfiguracaoService } from "../_services";
import { take } from "rxjs/operators";
import { AuthenticationService } from "../../_services";
import { ConfirmationService, Message, SelectItem } from "primeng/api";
import { DropdownService } from "../../_services";
import {
  Configuracao2Model,
  Configuracao2ModelInterface,
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
  @Output() onConfTitulo = new EventEmitter<Configuracao2ModelInterface>();
  @Input() componente?: string = null;

  perIncluir = false;
  perAltarar = false;
  perDeletar = false;



  private sub: Subscription[] = [];
  listagem: any[] = null;
  nome: string = null;
  id: number = null;
  campo_txt1: string = null;
  campo_id2: number = null;
  idx: number = null;
  mostraDropDown = false;
  dropDown: SelectItem[] = null;
  testeDD: SelectItem = null;
  testeDD2: SelectItem = null;
  drop = 0;
  acao: string = null;
  msg: string[] = [];
  resp: any[];
  nomeIncluir: string = null;
  campo_txt1Incluir: string = null;
  campo_id2_incluir: number = null;
  nomeOld: string = null;
  campo_txt1Old: string = null;
  campo_idOld: number = null;
  confirmaAlterar = false;
  confirmaApagar = false;
  incluindo = false;
  editando = false;
  campo_txt2: string = null;
  ddTipoCadastroTipo: SelectItem[] = [{ label: 'Pessoa Fisica', value: 1}, { label: 'Pessoa Juridica', value: 2}];
  mostraApagar = 0;
  titulo = 'CONFIGURAÇÕES';
  altura = `${WindowsService.altura - 170}` + 'px';
  msgErroEditar: Message[];

  configuracao: Configuracao2ModelInterface | null = null;
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
    console.log('cor->',this.hexToRGB2('#dee2e6', false) );
  }

  inicio() {
    this.sub.forEach(s => {
      s.unsubscribe();
    });
    this.resetAll();
    this.cfs.configuracao2 = this.configuracao;

      this.cfs.configuracao2.titulo = this.configuracao.titulo;
      this.cfs.configuracao2.campo_id = this.configuracao.campo_id;
      this.cfs.configuracao2.campo_nome = this.configuracao.campo_nome;
      this.cfs.configuracao2.tabela = this.configuracao.tabela;
      this.cfs.configuracao2.texto = this.configuracao.texto;
      if (this.configuracao.tabela === 'prioridade') {
        this.cfs.configuracao2.campo_txt1 = this.configuracao.campo_txt1;
        this.cfs.configuracao2.campo_id2 = null;
      }
      if (this.configuracao.tabela === 'tipo_cadastro') {
        this.cfs.configuracao2.campo_txt1 = null;
        this.cfs.configuracao2.campo_id2 = this.configuracao.campo_id2;
      }
    this.campo_txt2 = this.configuracao.campo_txt2;
      this.getAll();
  }

  ngOnDestroy(): void {
    this.cfs.configuracao2 = null;
    this.acao = null;
    this.nome = null;
    this.nomeIncluir = null;
    this.campo_txt1Incluir = null;
    this.campo_id2_incluir = null;
    this.campo_txt1 = null;
    this.campo_id2 = null;
    this.id = null;
    this.idx = null;
    this.nomeOld = null;
    this.campo_txt1Old = null;
    this.campo_idOld = null;
    this.incluindo = false;
    this.editando = false;
    this.sub.forEach(s => {
      s.unsubscribe();
    });
  }

  resetAll() {
    this.listagem = null;
    this.nome = null;
    this.id = null;
    this.campo_txt1 = null;
    this.campo_id2 = null;
    this.idx = null;
    this.mostraDropDown = false;
    this.dropDown = null;
    this.drop = 0;
    this.acao = null;
    this.msg = [];
    this.resp = null;
    this.nomeIncluir = null;
    this.campo_txt1Incluir = null;
    this.campo_id2_incluir = null;
    this.nomeOld = null;
    this.campo_txt1Old = null;
    this.campo_idOld = null;
    this.confirmaAlterar = false;
    this.confirmaApagar = false;
    this.incluindo = false;
    this.editando = false;
    this.campo_txt2 = null;
    this.mostraApagar = 0;
    this.msgErroEditar = null;
  }

  getAll() {
    this.getDropDown();
    let dados: any[] = [];
    dados.push(this.cfs.configuracao2.tabela);
    this.sub.push(this.cfs.postListarAll(dados)
      .pipe(take(1))
      .subscribe((dados) => {
          this.listagem = dados;
        },
        (err) => {
          console.error(err);
        },
        () => {
          this.onConfTitulo.emit(this.configuracao);;
        }
      )
    );
  }

  getDropDown() {
    const dropDownNome = 'dropdown-' + this.cfs.configuracao2.tabela;
    let tp: number = null;
    switch (this.cfs.configuracao2.tabela) {
      case 'prioridade' :
        tp = 1;
        break;
      case 'tipo_cadastro' :
        tp = 2;
        break;
    }

    this.sub.push(this.dd.getDd(dropDownNome)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.dropDown = dados;
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {
          sessionStorage.setItem(dropDownNome, JSON.stringify(this.dropDown));
        }
      })
    );


    /*
    if (tp === 1) {
      if (!sessionStorage.getItem(dropDownNome)) {
        this.sub.push(this.dd.getDropdownNomeId(this.cfs.configuracao2.tabela, this.cfs.configuracao2.campo_id, this.cfs.configuracao2.campo_nome)
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

    if (tp === 2) {
      this.sub.push(this.dd.getDropdownTipoCadastroConcat().pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.dropDown = dados;},
          error: (erro) => {
            console.error(erro);},
          complete: () => {
            console.log('this.dropDown', this.dropDown);
          }
      }));
    }
    */


  }

  onIncluindo() {
    this.nomeIncluir = null;
    this.campo_txt1Incluir = null;
    this.campo_id2_incluir = 1;
    this.incluindo = true;
  }

  onIncluir() {
    this.acao = 'incluir';
    if (this.nomeIncluir) {
      if (this.nomeIncluir.length > 1) {
        let dados: any[] = [];
        dados.push(this.cfs.configuracao2.tabela);
        dados.push(this.nomeIncluir);
        if (this.cfs.configuracao2.tabela === 'prioridade') {
          dados.push(this.campo_txt1Incluir);
        }
        if (this.cfs.configuracao2.tabela === 'tipo_cadastro') {
          dados.push(this.campo_id2_incluir);
        }
        this.sub.push(this.cfs.verificaIncluir(dados)
          .pipe(take(1))
          .subscribe((dados) => {
              this.resp = dados;
            },
            (err) => {
              console.error(err);
            },
            () => {
              this.incluindo = false;
              if (this.resp[0]) {
                if (this.cfs.configuracao2.tabela === 'prioridade') {
                  this.listagem.push({
                    campo_id: this.resp[1],
                    campo_nome: this.nomeIncluir.toString().toUpperCase(),
                    campo_txt1: this.campo_txt1Incluir ? this.campo_txt1Incluir.toString().toUpperCase() : null
                  });
                }
                if (this.cfs.configuracao2.tabela === 'tipo_cadastro') {
                  this.listagem.push({
                    campo_id: this.resp[1],
                    campo_nome: this.nomeIncluir.toString().toUpperCase(),
                    campo_id2: this.campo_id2_incluir ? this.campo_id2_incluir : null
                  });
                }
                this.corrigeDropdown();
                this.ms.add({key: 'toastprincipal',severity: 'info', summary: 'INCLUIR: ', detail: this.resp[2]});
              } else {
                this.ms.add({key: 'toastprincipal',severity: 'warn', summary: 'INCLUIR: ', detail: this.resp[2]});
              }
            }
          )
        );
      } else {
        this.ms.add({key: 'toastprincipal',severity: 'warn', summary: 'INCLUIR: ', detail: 'DADOS INVÁLIDOS.'});
      }
    }
  }

  onRowEditInit(rowData) {
    this.confirmaAlterar = false;
    this.acao = 'alterar';
    this.editando = true;
    this.id = +rowData.id;
    this.nomeOld = rowData.campo_nome;
    if (this.cfs.configuracao2.tabela === 'prioridade' && rowData.campo_txt1) {
      this.campo_txt1Old = rowData.campo_txt1;
    }
    if (this.cfs.configuracao2.tabela === 'tipo_cadastro' && rowData.campo_id2) {
      this.campo_idOld = rowData.campo_id2;
    }

  }

  onRowEditSave(rowData) {
    this.editando = false;
    let a = 0;
    let erro = 0;
    if (!rowData.campo_nome) {
      erro++;
    } else {
      if (this.nomeOld === rowData.campo_nome) {
        if (this.cfs.configuracao2.tabela === 'prioridade') {
          if (!this.campo_txt1Old && !rowData.campo_txt1) {
            erro++;
          }
        }
        if (this.cfs.configuracao2.tabela === 'tipo_cadastro') {
          if (!this.campo_idOld && !rowData.campo_id2) {
            erro++;
          }
        }
      }
    }
    if (erro > 0) {
      this.onCancela();
    }
    if (rowData.campo_nome && erro === 0) {
      if (rowData.campo_nome.length > 1) {
        let dados: any[] = [];
        dados.push(this.cfs.configuracao2.tabela);
        dados.push(rowData.campo_id);
        dados.push(rowData.campo_nome);
        if (this.cfs.configuracao2.tabela === 'prioridade' && rowData.campo_txt1) {
          dados.push(rowData.campo_txt1);
        }
        if (this.cfs.configuracao2.tabela === 'tipo_cadastro' && rowData.campo_id2) {
          dados.push(rowData.campo_id2);
        }
        this.sub.push(this.cfs.impactoAlterar(dados)
          .pipe(take(1))
          .subscribe((dadosResp) => {
              this.resp = dadosResp;
            },
            (err) => {
              console.error(err);
            },
            () => {
              if (!this.resp[0]) {
                this.confirmaAlterar = false;
                this.ms.add({key: 'toastprincipal',severity: 'warn', summary: 'ALTERAR: ', detail: this.resp[2]});
              } else {
                if (this.resp[1] === 0) {
                  this.confirmaAlterar = true;
                  this.mostraConfirmacao(dados);
                }
                if (+this.resp[1] === +this.id) {
                  this.corrigeDropdown();
                  const tmp = this.listagem.find(i =>
                    i.campo_id === this.id
                  );
                  if (tmp !== undefined) {
                    this.confirmaAlterar = false;
                    if (this.cfs.configuracao2.tabela === 'prioridade') {
                      this.listagem[this.listagem.indexOf(tmp)] = {
                        campo_id: tmp.campo_id,
                        campo_nome: this.nome.toString().toUpperCase(),
                        campo_txt1: this.campo_txt1.toString().toUpperCase()
                      };
                    }
                    if (this.cfs.configuracao2.tabela === 'tipo_cadastro') {
                      this.listagem[this.listagem.indexOf(tmp)] = {
                        campo_id: tmp.campo_id,
                        campo_nome: this.nome.toString().toUpperCase(),
                        campo_id2: this.campo_id2
                      };
                    }
                  }
                  this.ms.add({
                    key: 'toastprincipal',
                    severity: 'success',
                    summary: 'Alterações: ',
                    detail: this.resp[2]
                  });
                }
              }
            }
          )
        );

      }
    }
  }

  onAlterarConfirma(dados: any[], txt: string) {
    this.sub.push(this.cfs.alterar(dados)
      .pipe(take(1))
      .subscribe({
        next: (dadosResp) => {
          this.resp = dadosResp;
        },
        error: err => console.error('ERRO-->', err),
        complete: () => {
          if (!this.resp[0]) {
            this.confirmaAlterar = false;
            this.ms.add({key: 'toastprincipal',severity: 'warn', summary: 'ALTERAR: ', detail: this.resp[2]});
          } else {
            if (+this.resp[1] === +this.id) {
              this.corrigeDropdown();
              const tmp = this.listagem.find(i =>
                i.campo_id === this.id
              );
              if (tmp !== undefined) {
                this.confirmaAlterar = false;
                if (this.cfs.configuracao2.tabela === 'prioridade') {
                  this.listagem[this.listagem.indexOf(tmp)] = {
                    campo_id: tmp.campo_id,
                    campo_nome: this.nome.toString().toUpperCase(),
                    campo_txt1: this.campo_txt1.toString().toUpperCase()
                  };
                }
                if (this.cfs.configuracao2.tabela === 'tipo_cadastro') {
                  this.listagem[this.listagem.indexOf(tmp)] = {
                    campo_id: tmp.campo_id,
                    campo_nome: this.nome.toString().toUpperCase(),
                    campo_id2: this.campo_id2
                  };
                }
              }
              this.mostraMsgs(this.resp[2]);
            }
          }
        }
      })
    );
  }

  onRowEditCancel(rowData, ri) {
    this.editando = false;
  }

  mostraMsgs(res: string[]) {
    if (this.resp[0]) {
      if (res.length > 0) {
        if (this.resp[1] === 0) {
          res.forEach((m: string) => {
            this.ms.add({key: 'toastprincipal',severity: 'info', summary: 'Alterações: ', detail: m});
          });
        } else {
          this.ms.add({key: 'toastprincipal',severity: 'success', summary: 'Alterações: ', detail: this.resp[2]});
        }
      }
    } else {
      this.ms.add({key: 'toastprincipal',severity: 'error', summary: 'Alterações: ', detail: this.resp[2]});
    }
  }

  mostraConfirmacao(dados: any[]) {
    const ms: string[] = this.resp[2];
    let txt: string = '';
    this.msg = [];
    this.resp[2].forEach( (m: string) => {
      this.msg.push('Existem ' + m + ' vinculados a esse registro.');
    });
    if (this.acao === 'alterar') {
      this.msg.push('Deseja realizar as alterações?');
      this.cf.confirm({
        message: txt,
        header: 'ALTERAR',
        icon: 'pi pi-pencil',
        accept: () => {
          this.onAlterarConfirma(dados, txt);
        }
      });
    }
    if (this.acao === 'deletar') {
      this.msg.push('Escolha o registro abaixo que ira substituir o registro excluido.');
    }

  }

  onApagarConfirma() {

    if (+this.drop > 0 && +this.drop !== this.id) {
      let dados: any = {
        'tabela': this.cfs.configuracao2.tabela,
        'id': this.id,
        'novo_id': this.drop
      };
      this.sub.push(this.cfs.deletar(dados)
        .pipe(take(1))
        .subscribe((dados) => {
            this.resp = dados;
          },
          (err) => {
            console.error(err);
          },
          () => {
            const tmp = this.listagem.find(i =>
              i.campo_id === this.id
            );
            this.listagem.splice(this.listagem[this.listagem.indexOf(tmp)],1);
            this.corrigeDropdown();
            this.ms.add({key: 'toastprincipal',severity: 'info', summary: 'Exclusão: ', detail: this.resp[2]});
            this.onCancela();
          })
      );
    }
  }

  onApagar() {
    this.acao = 'deletar';
    let dados: any = {
      'tabela': this.cfs.configuracao2.tabela,
      'id': this.id
    };

    this.sub.push(this.cfs.deletar(dados)
      .pipe(take(1))
      .subscribe((dados) => {
          this.resp = dados;
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
          this.ms.add({key: 'toastprincipal',severity: 'info', summary: 'Exclusão: ', detail: this.resp[2]});
          this.onCancela();
        })
    );
  }

  onDeletar(rowdata: any, idx: number) {
    this.acao = 'deletar';
    this.id = +rowdata.campo_id;
    this.idx = +idx;
    this.drop = 0;
    this.resp = null;

    this.mostraDropDown = false;

    let dados: any[] = [];
    dados.push(this.cfs.configuracao2.tabela);
    dados.push(this.id);
    this.sub.push(this.cfs.impactoDelete(dados)
      .pipe(take(1))
      .subscribe((dados) => {
          this.resp = dados;
        },
        (err) => {
          console.error(err);
        },
        () => {
          if (this.resp[0] === true) {
            if (+this.resp[1] === this.id) {
              const tmp = this.listagem.find(i =>
                i.campo_id === this.id
              );
              this.listagem.splice(this.listagem[this.idx],1);
              this.corrigeDropdown();
              this.ms.add({
                key: 'toastprincipal',
                severity: 'success',
                summary: 'Exclusão: ',
                detail: this.resp[2]
              });
            } else {
              if (this.resp[2].length > 0) {
                this.confirmaApagar = this.resp[0];
                this.mostraDropDown = this.resp[0];
                this.mostraConfirmacao([this.id, this.idx]);
              } else {
                this.ms.add({key: 'toastprincipal',severity: 'warn', summary: 'Exclusão: ', detail: this.resp[2]});
              }
            }
          } else {
            if (!this.confirmaApagar) {
              this.ms.add({key: 'toastprincipal',severity: 'info', summary: 'Exclusão: ', detail: 'Você não tem permissões suficientes'});
            }
          }

        }
      )
    );
  }

  toastClose() {
    if (this.acao === 'incluir') {
        this.onCancela();
    }
    if (this.acao === 'alterar') {
      if (!this.confirmaAlterar && !this.resp[0]) {
        this.onCancela();
      }
    }
    if (this.acao === 'deletar') {
      if (!this.confirmaApagar) {
        this.onCancela();
      }
    }
  }

  onCancela() {
    this.acao = null;
    this.nome = null;
    this.nomeIncluir = null;
    this.campo_txt1Incluir = null;
    this.campo_id2_incluir = null;
    this.campo_txt1 = null;
    this.campo_id2 = null;
    this.id = null;
    this.idx = null;
    this.nomeOld = null;
    this.mostraDropDown = false;
    this.mostraApagar = 0;
    this.incluindo = false;
    this.editando = false;
    this.confirmaApagar = false;
    this.confirmaAlterar = false;

  }

  corrigeDropdown() {
    this.cfs.corrigeDropdown(this.cfs.configuracao2.tabela);
  }

  pfpj(v) {
    return v === 1 ? 'PF' : 'PJ';
  }

  cssIncluir(): any {
    return (!this.incluindo) ? null : {
      'background': 'var(--blue-200)'
    };
  }

  cssAlterar(): any {
    return (!this.editando) ? null : {
      'background': 'var(--yellow-200)'
    };
  }

  cssApagar(): any {
    return (this.acao!=='deletar') ? null : {
      'background': 'var(--pink-200)'
    };
  }

  cssRow(): any {
    return (this.acao === 'deletar') ? {'background': 'var(--pink-200)'} : (!this.editando) ? null : { 'background': 'var(--yellow-200)'};
  }

  getCorTxt(campo_txt1?: string | null): string {
    if (campo_txt1 === undefined || campo_txt1 === null) {
      return 'NÃO DEFINIDO';
    } else {
      if (campo_txt1.substring(0,4) === 'var(') {
        return 'PADRÃO';
      } else {
        return campo_txt1;
      }
    }
  }

  testarDD(a,ev) {
    console.log('testarDD',a,ev, this.testeDD);
  }

  testarDD2(ev: SelectItem) {
    console.log('testarDD',ev, this.testeDD2);
  }

  ddcor(cor?: string): any {
    const b: string =  (cor === undefined || cor === null) ? 'transparent' : cor;
    let c: string =  (cor === undefined || cor === null ) ? 'var(--text-color)' : cor;
    if (c === 'var(--text-color)' || c.substring(0,4) === 'var(' || ((c.length < 3 || c.length > 4 ) && (c.length < 6 || c.length > 7))){
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

  setForegroundColor(cor: string) {
    let rgb  = this.hexToRGB(cor, false);
    let sum = Math.round(((parseInt(rgb[0]) * 299) + (parseInt(rgb[1]) * 587) + (parseInt(rgb[2]) * 114)) / 1000);
    return (sum > 128) ? 'black' : 'white';
  }

  hexToRGB(h,isPct) {
    let ex = /^#([\da-f]{3}){1,2}$/i;
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
      return "rgb("+ (isPct ? r + "%," + g + "%," + b + "%" : +r + "," + +g + "," + +b) + ")";
      // return [r,g,b];

    } else {
      return null;
    }
  }

  hexToRGB2(h,isPct) {
    let ex = /^#([\da-f]{3}){1,2}$/i;
    if (ex.test(h)) {
      let r: any = 0, g: any = 0, b: any = 0;
      isPct = isPct === true;

      // 3 digits
      if (h.length == 4) {
        // @ts-ignore
        r = "0x" + h[1] + h[1];
        g = "0x" + h[2] + h[2];
        // @ts-ignore
        b = "0x" + h[3] + h[3];

        // 6 digits
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
      return "rgb("+ (isPct ? r + "%," + g + "%," + b + "%" : +r + "," + +g + "," + +b) + ")";

    } else {
      return "Invalid input color";
    }
  }


}
