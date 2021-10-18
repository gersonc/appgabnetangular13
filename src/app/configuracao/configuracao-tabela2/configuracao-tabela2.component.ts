import { Component, OnInit, OnDestroy} from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfiguracaoService } from "../_services";
import { take } from "rxjs/operators";
import { AuthenticationService, CarregadorService } from "../../_services";
import { ConfirmationService, Message, MessageService, SelectItem } from "primeng/api";
import { DropdownService } from "../../util/_services";
import { Configuracao2Model } from "../_models/configuracao-model";

@Component({
  selector: 'app-configuracao-tabela2',
  templateUrl: './configuracao-tabela2.component.html',
  styleUrls: ['./configuracao-tabela2.component.css'],
  providers: [ConfirmationService]
})
export class ConfiguracaoTabela2Component implements OnInit, OnDestroy {

  private sub: Subscription[] = [];
  listagem: any[] = null;
  nome: string = null;
  id: number = null;
  campo_txt1: string = null;
  campo_id2: number = null;
  idx: number = null;
  mostraDropDown = false;
  dropDown: SelectItem[] = null;
  drop = 0;
  acao: string = null;
  msgs: Message[] = [];
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
  labelTxt1: string = null;
  ddTipoCadastroTipo: SelectItem[] = [{ label: 'PF', value: 1}, { label: 'PJ', value: 2}];
  mostraApagar = 0;

  msgErroEditar: Message[];

  constructor(
    public cfs: ConfiguracaoService,
    public alt: AuthenticationService,
    private cs: CarregadorService,
    private dd: DropdownService,
    private messageService: MessageService,
    private cf: ConfirmationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.cfs.configuracao2 = new Configuracao2Model();
    if (this.activatedRoute.snapshot.data.dados) {
      let snap = this.activatedRoute.snapshot.data.dados;
      this.cfs.configuracao2.titulo = snap.titulo;
      this.cfs.configuracao2.campo_id = snap.campo_id;
      this.cfs.configuracao2.campo_nome = snap.campo_nome;
      this.cfs.configuracao2.tabela = snap.tabela;
      this.cfs.configuracao2.texto = snap.texto;
      if (snap.tabela === 'prioridade') {
        this.cfs.configuracao2.campo_txt1 = snap.campo_txt1;
        this.cfs.configuracao2.campo_txt2 = null;
        this.cfs.configuracao2.campo_id2 = null;
        this.labelTxt1 = snap.labelTxt1;
      }
      if (snap.tabela === 'tipo_cadastro') {
        this.cfs.configuracao2.campo_txt1 = null;
        this.cfs.configuracao2.campo_txt2 = null;
        this.cfs.configuracao2.campo_id2 = snap.campo_id2;
        this.labelTxt1 = snap.labelTxt1;
      }
      this.getAll();
    } else {
      this.cfs.configuracao2.titulo = 'CONFIGURAÇÕES';
    }
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

  getAll() {
    this.cs.mostraCarregador();
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
          this.cs.escondeCarregador();
        },
        () => {
          this.cs.escondeCarregador();
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
  }

  onIncluindo() {
    this.messageService.clear();
    this.nomeIncluir = null;
    this.campo_txt1Incluir = null;
    this.campo_id2_incluir = 1;
    this.incluindo = true;
  }

  onIncluir() {
    this.acao = 'incluir';
    if (this.nomeIncluir) {
      if (this.nomeIncluir.length > 1) {
        this.cs.mostraCarregador();
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
              this.cs.escondeCarregador();
            },
            () => {
              this.incluindo = false;
              this.cs.escondeCarregador();
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
                this.messageService.add({key: 'msg2',severity: 'info', summary: 'INCLUIR: ', detail: this.resp[2]});
              } else {
                this.messageService.add({key: 'msg2',severity: 'warn', summary: 'INCLUIR: ', detail: this.resp[2]});
              }
            }
          )
        );
      } else {
        this.messageService.add({key: 'msg2',severity: 'warn', summary: 'INCLUIR: ', detail: 'DADOS INVÁLIDOS.'});
      }
    }
  }

  onRowEditInit(rowData) {
    this.confirmaAlterar = false;
    this.messageService.clear();
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
        this.cs.mostraCarregador();
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
              this.cs.escondeCarregador();
            },
            () => {
              this.cs.escondeCarregador();
              if (!this.resp[0]) {
                this.confirmaAlterar = false;
                this.messageService.add({key: 'msg2',severity: 'warn', summary: 'ALTERAR: ', detail: this.resp[2]});
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
                  this.messageService.add({
                    key: 'msg2',
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
    this.messageService.clear();
    this.cs.mostraCarregador();
    this.sub.push(this.cfs.alterar(dados)
      .pipe(take(1))
      .subscribe({
        next: (dadosResp) => {
          this.resp = dadosResp;
        },
        error: err => console.error('ERRO-->', err),
        complete: () => {
          this.cs.escondeCarregador();
          if (!this.resp[0]) {
            this.confirmaAlterar = false;
            this.messageService.add({key: 'msg2',severity: 'warn', summary: 'ALTERAR: ', detail: this.resp[2]});
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
                /*else {
                  this.listagem[this.listagem.indexOf(tmp)] = {
                    campo_id: tmp.campo_id,
                    campo_nome: this.nome.toString().toUpperCase()
                  };
                }*/
              }
              this.mostraMsgs(this.resp[2]);
            }
          }
        }
      })
    );
  }

  onRowEditCancel(rowData, ri) {
    this.messageService.clear();
    this.editando = false;
  }

  mostraMsgs(res: string[]) {
    if (this.resp[0]) {
      if (res.length > 0) {
        if (this.resp[1] === 0) {
          res.forEach((m: string) => {
            this.messageService.add({key: 'msg2',severity: 'info', summary: 'Alterações: ', detail: m});
          });
        } else {
          this.messageService.add({key: 'msg2',severity: 'success', summary: 'Alterações: ', detail: this.resp[2]});
        }
      }
    } else {
      this.messageService.add({key: 'msg2',severity: 'error', summary: 'Alterações: ', detail: this.resp[2]});
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
    this.msgs = [];
    if (+this.drop > 0 && +this.drop !== this.id) {
      let dados: any = {
        'tabela': this.cfs.configuracao2.tabela,
        'id': this.id,
        'novo_id': this.drop
      };
      this.cs.mostraCarregador();
      this.sub.push(this.cfs.deletar(dados)
        .pipe(take(1))
        .subscribe((dados) => {
            this.resp = dados;
          },
          (err) => {
            console.error(err);
            this.cs.escondeCarregador();
          },
          () => {
            const tmp = this.listagem.find(i =>
              i.campo_id === this.id
            );
            this.listagem.splice(this.listagem[this.listagem.indexOf(tmp)],1);
            this.corrigeDropdown();
            this.cs.escondeCarregador();
            this.messageService.add({key: 'msg2',severity: 'info', summary: 'Exclusão: ', detail: this.resp[2]});
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
    this.messageService.clear();
    this.cs.mostraCarregador();
    this.sub.push(this.cfs.deletar(dados)
      .pipe(take(1))
      .subscribe((dados) => {
          this.resp = dados;
        },
        (err) => {
          console.error(err);
          this.cs.escondeCarregador();
        },
        () => {
          this.cs.escondeCarregador();
          const tmp = this.listagem.find(i =>
            i.campo_id === this.id
          );
          if (tmp !== undefined) {
            const idx = this.listagem.indexOf(tmp);
            this.listagem.splice(idx, 1);
          }
          this.messageService.add({key: 'msg2',severity: 'info', summary: 'Exclusão: ', detail: this.resp[2]});
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
    this.msgs = [];
    this.mostraDropDown = false;
    this.messageService.clear();
    let dados: any[] = [];
    dados.push(this.cfs.configuracao2.tabela);
    dados.push(this.id);
    this.cs.mostraCarregador();
    this.sub.push(this.cfs.impactoDelete(dados)
      .pipe(take(1))
      .subscribe((dados) => {
          this.resp = dados;
        },
        (err) => {
          console.error(err);
          this.cs.escondeCarregador();
        },
        () => {
          this.cs.escondeCarregador();
          if (this.resp[0] === true) {
            if (+this.resp[1] === this.id) {
              const tmp = this.listagem.find(i =>
                i.campo_id === this.id
              );
              this.listagem.splice(this.listagem[this.idx],1);
              this.corrigeDropdown();
              // this.confirmaApagar = false;
              // this.mostraDropDown = false;
              this.messageService.add({
                key: 'msg2',
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
                this.messageService.add({key: 'msg2',severity: 'warn', summary: 'Exclusão: ', detail: this.resp[2]});
              }
            }
          } else {
            if (!this.confirmaApagar) {
              this.messageService.add({key: 'msg2',severity: 'info', summary: 'Exclusão: ', detail: 'Você não tem permissões suficientes'});
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
    this.messageService.clear();
  }

  corrigeDropdown() {
    this.cfs.corrigeDropdown(this.cfs.configuracao2.tabela);
  }

  pfpj(v) {
    return v === 1 ? 'PF' : 'PJ';
  }


}
