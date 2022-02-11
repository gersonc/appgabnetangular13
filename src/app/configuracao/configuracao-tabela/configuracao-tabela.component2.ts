import { Component, OnInit, OnDestroy} from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfiguracaoService } from '../_services';
import { take } from 'rxjs/operators';
import { AuthenticationService, CarregadorService } from '../../_services';
import { Message, MessageService, SelectItem } from 'primeng/api';
import { DropdownService } from '../../_services';
import { ConfiguracaoModel } from '../_models/configuracao-model';

@Component({
  selector: 'app-configuracao-tabela',
  templateUrl: './configuracao-tabela.component.html',
  styleUrls: ['./configuracao-tabela.component.css']
})
export class ConfiguracaoTabelaComponent implements OnInit, OnDestroy {

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
  titulo = 'CONFIGURAÇÕES';

  mostraIncluir = false;

  msgErroIncluir: Message[];
  msgErroEditar: Message[];

  constructor(
    public cfs: ConfiguracaoService,
    public alt: AuthenticationService,
    private cs: CarregadorService,
    private dd: DropdownService,
    private messageService: MessageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    console.log('construtor');
  }

  ngOnInit(): void {
    console.log('init');
    if (this.activatedRoute.snapshot.data.dados) {
      const snap = this.activatedRoute.snapshot.data.dados;
      this.perIncluir = this.alt.configuracao_incluir;
      this.perAltarar = this.alt.configuracao_alterar;
      this.perDeletar = this.alt.configuracao_apagar;
      this.perPrincipal = this.alt.usuario_principal_sn;
      this.perResponsavel = this.alt.usuario_responsavel_sn;
      if (this.alt.configuracao_alterar) {
        this.colsp++;
      }
      if (this.alt.configuracao_apagar) {
        this.colsp++;
      }
      this.tabela = snap.tabela;
      this.tabel = snap.tabela;
      this.configuracao = {
        titulo: snap.titulo,
        campo_id: snap.campo_id,
        campo_nome: snap.campo_nome,
        tabela: snap.tabela,
        texto: snap.texto
      };
      this.titulo = this.configuracao.titulo;
      this.cfs.configuracao = this.configuracao;
      this.getAll(this.tabela);
    } else {
      this.titulo = 'CONFIGURAÇÕES';
    }
  }

  ngOnDestroy(): void {
    this.cfs.configuracao = null;
    this.sub.forEach(s => {
      s.unsubscribe();
    });
    console.log('ngOnDestroy');
  }

  getAll(tabela: string) {
    this.cs.mostraCarregador();
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
          this.cs.escondeCarregador();
        },
        () => {
          this.cs.escondeCarregador();
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
  }

  onAlterar() {
    this.msgErroEditar = null;
    this.messageService.clear();
    if (this.nome && this.nome !== this.nomeOld) {
      if (this.nome.length > 1) {
        this.cs.mostraCarregador();
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
              this.cs.escondeCarregador();
            },
            () => {
              this.cs.escondeCarregador();
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
        this.cs.mostraCarregador();
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
              this.cs.escondeCarregador();
            },
            () => {
              this.cs.escondeCarregador();
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
    this.msgErroIncluir = null;
    this.messageService.clear();
    if (this.nomeIncluir) {
      if (this.nomeIncluir.length > 1) {
        this.cs.mostraCarregador();
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
              this.cs.escondeCarregador();
            },
            () => {
              this.cs.escondeCarregador();
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
    this.acao = 'deletar';
    const dados: any = {
      'tabela': this.tabel,
      'id': this.id
    };
    this.messageService.clear();
    this.cs.mostraCarregador();
    this.sub.push(this.cfs.deletar(dados)
      .pipe(take(1))
      .subscribe((dados3) => {
          this.resp = dados3;
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
          this.messageService.add({key: 'msgExcluir', severity: 'info', summary: 'Exclusão: ', detail: this.resp[2]});
          this.onCancela();
        })
    );
  }

  onDeletar(id: number, nome: string, idx: number) {
    this.acao = 'deletar';
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
    this.cs.mostraCarregador();
    this.sub.push(this.cfs.impactoDelete(dados)
      .pipe(take(1))
      .subscribe((dados4) => {
          this.resp = dados4;
        },
        (err) => {
          console.error(err);
          this.cs.escondeCarregador();
        },
        () => {
          this.cs.escondeCarregador();
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
      this.cs.mostraCarregador();
      this.sub.push(this.cfs.deletar(dados)
        .pipe(take(1))
        .subscribe((dados5) => {
            this.resp = dados5;
          },
          (err) => {
            console.error(err);
            this.cs.escondeCarregador();
          },
          () => {
            this.corrigeDropdown(this.tabel);
            this.cs.escondeCarregador();
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
  }

  corrigeDropdown(tabela: string) {
    this.cfs.corrigeDropdown(tabela);
  }

  clickIncluir() {
    this.mostraIncluir = !this.mostraIncluir;
  }


}
