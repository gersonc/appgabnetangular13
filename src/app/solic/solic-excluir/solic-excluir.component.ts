import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../_services";
import {SolicService} from "../_services/solic.service";
import {VersaoService} from "../../_services/versao.service";
import {SolicListarI} from "../_models/solic-listar-i";
import {Router} from "@angular/router";
import {take} from "rxjs/operators";
import {Subscription} from "rxjs";
import {MsgService} from "../../_services/msg.service";

@Component({
  selector: 'app-solic-excluir',
  templateUrl: './solic-excluir.component.html',
  styleUrls: ['./solic-excluir.component.css']
})
export class SolicExcluirComponent implements OnInit {

  sub: Subscription[] = [];
  sol: SolicListarI;
  botaoEnviarVF = false;
  public arquivoBlockSubmit = true;
  // private arquivoSN = true;
  apagarSN = false;
  hisProNum = 0;

  arqSolNum = 0;
  arqProNum = 0;
  arqOfiNum = 0;
  permissao: any = {
    hisPro: false,
    hisProNum: 0,
    hisProMsg: '',
    hisSol: false,
    hisSolNum: 0,
    hisSolMsg: '',
    pro: false,
    proNum: 0,
    proMsg: '',
    ofi: false,
    ofiNum: 0,
    ofiMsg: '',
    arq: false,
    arqSolNum: 0,
    arqProNum: 0,
    arqOfiNum: 0,
    arqTot: 0,
    arqMsg: '',
    permissao: false
  }

  mensagens: string[] = [];
  resp: any[] = [];


  constructor(
    public aut: AuthenticationService,
    public ss: SolicService,
    public vs: VersaoService,
    private ms: MsgService,
    private router: Router
  ) {
    this.sol = this.ss.solicitacaoApagar;
  }

  ngOnInit(): void {
    this.verificaAssociacoes();
  }

  verificaAssociacoes() {
    if (this.aut.solicitacaoVersao === 1) {
      this.permissao.hisProNum = this.sol.historico_processo.length;
      this.permissao.proNum = (this.sol.processo_id > 0) ? 1 : 0;
      this.permissao.ofiNum = this.sol.oficio.length;
      this.permissao.arqProNum = this.sol.processo_arquivos.length;
      if (this.sol.oficio.length> 0) {
        this.sol.oficio.forEach( o => {
          this.permissao.arqOfiNum += o.oficio_arquivos.length;
        });
      }
    }
    this.permissao.hisSolNum = this.sol.historico_solicitcao.length;
    this.permissao.arqSolNum = this.sol.solicitacao_arquivos.length;

    if (this.aut.solicitacaoVersao === 1) {
      if (this.permissao.proNum === 1 && !this.aut.processo_apagar) {
        this.permissao.pro = false;
        this.permissao.proMsg = 'Esta solicitação está vinculada a um processo e você não tem permissão para apaga-lo';
        this.mensagens.push(this.permissao.proMsg);
      } else {
        this.permissao.pro = true;
        if (this.permissao.proNum === 1) {
          this.permissao.proMsg = 'Esta solicitação está vinculada a um processo e será apagado.';
          this.mensagens.push(this.permissao.proMsg);
        }
      }
      if (this.permissao.hisProNum > 0 && !this.aut.historico_apagar) {
        this.permissao.hisPro = false;
        this.permissao.hisProMsg = 'Esta solicitação está vinculada a um processo com ' + this.permissao.hisProNum + ' andamento(s) e você não tem permissão para apaga-lo(s).';
        this.mensagens.push(this.permissao.hisProMsg);
      } else {
        this.permissao.hisPro = true;
        if (this.permissao.hisProNum > 0) {
          this.permissao.hisProMsg = 'Esta solicitação está vinculada a um processo com ' + this.permissao.hisProNum + ' andamento(s) e ser(ão) apagado(s).';
          this.mensagens.push(this.permissao.hisProMsg);
        }
      }
      if (this.permissao.ofiNum > 0 && !this.aut.oficio_apagar) {
        this.permissao.ofi = false;
        this.permissao.ofiMsg = 'Esta solicitação está vinculada a ' + this.permissao.ofiNum + ' ofício(s) e você não tem permissão para apaga-lo(s)';
        this.mensagens.push(this.permissao.ofiMsg);
      } else {
        this.permissao.ofi = true;
        if (this.permissao.ofiNum > 0) {
          if (this.permissao.ofiNum === 1) {
            this.permissao.ofiMsg = 'Esta solicitação está vinculada a ' + this.permissao.ofiNum + ' ofício e será apagado.';
            this.mensagens.push(this.permissao.ofiMsg);
          } else {
            this.permissao.ofiMsg = 'Esta solicitação está vinculada a ' + this.permissao.ofiNum + ' ofícios e serão apagados.';
            this.mensagens.push(this.permissao.ofiMsg);
          }
        }
      }
    } else {
      this.permissao.pro = true;
      this.permissao.ofi = true;
      this.permissao.hisPro = true;
    }

    if (this.permissao.hisSolNum > 0 && !this.aut.historico_solicitacao_apagar) {
      this.permissao.hisSol = false;
      this.permissao.hisSolMsg = 'Esta solicitação está vinculada a ' + this.permissao.hisSolNum + ' andamento(s) e você não tem permissão para apaga-lo(s).';
      this.mensagens.push(this.permissao.hisSolMsg);
    } else {
      this.permissao.hisSol = true;
      if (this.permissao.hisSolNum > 0) {
        this.permissao.hisSolMsg = 'Esta solicitação está vinculada a ' + this.permissao.hisSolNum + ' andamento(s) que ser(ão) apagados.';
        this.mensagens.push(this.permissao.hisSolMsg);
      }
    }

    if (this.aut.config_arquivo_ativo) {
      this.permissao.arqTot = this.permissao.arqSolNum + this.permissao.arqProNum + this.permissao.arqOfiNum;
      if (this.permissao.arqTot > 0 && !this.aut.arquivos_apagar) {
        this.permissao.arq = false;
        this.permissao.arqMsg = 'Esta solicitação está vinculada a: ';
        if (this.permissao.arqSolNum > 0) {
          this.permissao.arqMsg +=  this.permissao.arqSolNum + " arquivo(s) vinculado(s) solicitacao.";
        }
        if (this.permissao.arqProNum > 0) {
          this.permissao.arqMsg +=  this.permissao.arqProNum + " arquivo(s) vinculado(s) a um processo.";
        }
        if (this.permissao.arqOfiNum > 0) {
          this.permissao.arqMsg +=  this.permissao.arqOfiNum + "arquivo(s) vinculado(s) a ofício(s).";
        }
        this.permissao.arqMsg += " e você não tem permissão para apaga-lo(s)."
        this.mensagens.push(this.permissao.arqMsg);
      } else {
        this.permissao.arq = true;
        if (this.permissao.arqTot > 0) {
          if (this.permissao.arqSolNum > 0) {
            this.permissao.arqMsg += this.permissao.arqSolNum + " arquivo(s) vinculado(s) a solicitacao.";
          }
          if (this.permissao.arqProNum > 0) {
            this.permissao.arqMsg += this.permissao.arqProNum + " arquivo(s) vinculado(s) a um processo.";
          }
          if (this.permissao.arqOfiNum > 0) {
            this.permissao.arqMsg +=  this.permissao.arqOfiNum + " arquivo(s) vinculado(s) a(os) ofício(s).";
          }
          this.permissao.arqMsg += " será(ão) apagado(s)."
          this.mensagens.push(this.permissao.arqMsg);
        }
      }

    } else {
      this.permissao.arq = true;
    }

    this.permissao.permissao = (this.permissao.pro && this.permissao.ofi && this.permissao.hisPro && this.permissao.hisSol && this.permissao.arq);
  }

  getPermissao(): boolean {
    return !this.permissao.permissao;
  }



  excluirSolicitacao() {
    if (this.permissao.permissao) {
      this.sub.push(this.ss.excluirSolicitacao(this.sol.solicitacao_id)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: (err) => {
            this.ms.add({key: 'toastprincipal', severity: 'warn', summary: 'ERRO INCLUIR', detail: this.resp[2]});
            console.error(err);
          },
          complete: () => {
            if (this.resp[0]) {
              sessionStorage.removeItem('solic-menu-dropdown')
                this.ms.add({
                  key: 'toastprincipal',
                  severity: 'success',
                  summary: 'EXCLUIR SOLICITAÇÃO',
                  detail: this.resp[2]
                });

              this.voltarListar();
            } else {
              console.error('ERRO - EXCLUIR ', this.resp[2]);
              this.ms.add({
                key: 'toastprincipal',
                severity: 'warn',
                summary: 'ATENÇÃO - ERRO',
                detail: this.resp[2]
              });
            }
          }
        })
      );
    }
  }

  voltarListar() {
    if (sessionStorage.getItem('solic-busca')) {
      this.router.navigate(['/solic/listar/busca']);
    } else {
      this.router.navigate(['/solic/listar']);
    }
  }


}
