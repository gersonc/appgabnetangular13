import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {ProceListarI} from "../_model/proce-listar-i";
import {AuthenticationService} from "../../_services";
import {VersaoService} from "../../_services/versao.service";
import {MsgService} from "../../_services/msg.service";
import {Router} from "@angular/router";
import {ProceService} from "../_services/proce.service";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-proce-excluir',
  templateUrl: './proce-excluir.component.html',
  styleUrls: ['./proce-excluir.component.css']
})
export class ProceExcluirComponent implements OnInit, OnDestroy {
  sub: Subscription[] = [];
  pro: ProceListarI;
  botaoEnviarVF = false;
  public arquivoBlockSubmit = true;
  // private arquivoSN = true;
  apagarSN = false;
  hisProNum = 0;

  arqSolNum = 0;
  arqProNum = 0;
  arqOfiNum = 0;
  permissao: any = {
    pro: true,
    hisPro: false,
    hisProNum: 0,
    hisProMsg: '',
    hisSol: false,
    hisSolNum: 0,
    hisSolMsg: '',
    sol: false,
    solMsg: '',
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
    public vs: VersaoService,
    private ms: MsgService,
    private router: Router,
    public ps: ProceService
  ) {
    this.pro = this.ps.procApagar;
  }

  ngOnInit(): void {
    this.verificaAssociacoes();
  }

  verificaAssociacoes() {
    this.permissao.pro = (this.aut.processo_apagar || this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn);
      this.permissao.hisProNum = this.pro.historico_processo.length;
      // this.permissao.proNum = (this.pro.processo_id > 0) ? 1 : 0;
      this.permissao.ofiNum = this.pro.oficios.length;
      this.permissao.arqProNum = this.pro.processo_arquivos.length;
      if (this.pro.oficios.length> 0) {
        this.pro.oficios.forEach( o => {
          this.permissao.arqOfiNum += o.oficio_arquivos.length;
        });
      }
    this.permissao.hisSolNum = this.pro.historico_solicitcao.length;
    this.permissao.arqSolNum = this.pro.solicitacao_arquivos.length;


      if (!this.aut.solicitacao_apagar) {
        this.permissao.sol = false;
        this.permissao.proMsg = 'Você não tem permissão para apagar a solicitação vinculada a este processo.';
        this.mensagens.push(this.permissao.proMsg);
      } else {
        this.permissao.sol = true;
          this.permissao.proMsg = 'A solicitação vinculada a este processo será apagada.';
          this.mensagens.push(this.permissao.proMsg);
      }
      if (this.permissao.hisProNum > 0 && !this.aut.historico_apagar) {
        this.permissao.hisPro = false;
        this.permissao.hisProMsg = 'Existem ' + this.permissao.hisProNum + ' andamento(s) vinculado(s) a este processo e você não tem permissão para apaga-lo(s).';
        this.mensagens.push(this.permissao.hisProMsg);
      } else {
        this.permissao.hisPro = true;
        if (this.permissao.hisProNum > 0) {
          this.permissao.hisProMsg = 'Existem  ' + this.permissao.hisProNum + ' andamento(s) vinculado(s) a este processo e sera(ão) apagado(s).';
          this.mensagens.push(this.permissao.hisProMsg);
        }
      }
      if (this.permissao.ofiNum > 0 && !this.aut.oficio_apagar) {
        this.permissao.ofi = false;
        this.permissao.ofiMsg = 'Existe(m) ' + this.permissao.ofiNum + ' ofício(s) vinculado(s) a este processo e  e você não tem permissão para apaga-lo(s).';
        this.mensagens.push(this.permissao.ofiMsg);
      } else {
        this.permissao.ofi = true;
        if (this.permissao.ofiNum > 0) {
            this.permissao.ofiMsg = 'Existe(m) ' + this.permissao.ofiNum + ' ofício(s) vinculado(s) a este processo e será(ão) apagado(s).';
            this.mensagens.push(this.permissao.ofiMsg);
        }
      }


    if (this.permissao.hisSolNum > 0 && !this.aut.historico_solicitacao_apagar) {
      this.permissao.hisSol = false;
      this.permissao.hisSolMsg = 'Existe(m) ' + this.permissao.hisSolNum + ' andamento(s) da solicitação vinculada a este processo e você não tem permissão para apaga-lo(s).';
      this.mensagens.push(this.permissao.hisSolMsg);
    } else {
      this.permissao.hisSol = true;
      if (this.permissao.hisSolNum > 0) {
        this.permissao.hisSolMsg = 'Existe(m) ' + this.permissao.hisSolNum + ' andamento(s) da solicitação vinculada a este processo e será(ão) apagado(s).';
        this.mensagens.push(this.permissao.hisSolMsg);
      }
    }

    if (this.aut.config_arquivo_ativo) {
      this.permissao.arqTot = this.permissao.arqSolNum + this.permissao.arqProNum + this.permissao.arqOfiNum;
      if (this.permissao.arqTot > 0 && !this.aut.arquivos_apagar) {
        this.permissao.arq = false;
        this.permissao.arqMsg = 'Este processo tem: ';
        if (this.permissao.arqSolNum > 0) {
          this.permissao.arqMsg +=  this.permissao.arqSolNum + " arquivo(s) vinculado(s) a solicitacao.";
        }
        if (this.permissao.arqProNum > 0) {
          this.permissao.arqMsg +=  this.permissao.arqProNum + " arquivo(s) vinculado(s) ao processo.";
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
            this.permissao.arqMsg += this.permissao.arqProNum + " arquivo(s) vinculado(s) ao processo.";
          }
          if (this.permissao.arqOfiNum > 0) {
            this.permissao.arqMsg +=  this.permissao.arqOfiNum + " arquivo(s) vinculado(s) a(os) ofício(s).";
          }
          this.permissao.arqMsg += " e será(ão) apagado(s)."
          this.mensagens.push(this.permissao.arqMsg);
        }
      }

    } else {
      this.permissao.arq = true;
    }

    this.permissao.permissao = (this.permissao.pro && this.permissao.sol && this.permissao.ofi && this.permissao.hisPro && this.permissao.hisSol && this.permissao.arq);
  }

  getPermissao(): boolean {
    return !this.permissao.permissao;
  }

  voltarListar() {
    this.router.navigate(['/proce/listar']);
  }

  voltar() {
    this.ps.procApagar = null;
    this.ps.stateSN = false;
    sessionStorage.removeItem('proce-busca');
    this.router.navigate(['/proce/listar2']);
  }

  excluirProcesso() {
    if (this.permissao.permissao) {
      this.botaoEnviarVF = true;
      this.apagarSN = true;
      this.botaoEnviarVF = true;
      this.sub.push(this.ps.excluirProcesso(this.pro.processo_id)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: (err) => {
            this.ms.add({key: 'toastprincipal', severity: 'warn', summary: 'ERRO INCLUIR', detail: this.resp[2]});
            console.error(err);
            this.apagarSN = false;
            this.botaoEnviarVF = false;
          },
          complete: () => {
            if (this.resp[0]) {
              sessionStorage.removeItem('solic-menu-dropdown');
              sessionStorage.removeItem('proce-menu-dropdown');
              if (this.pro.oficios.length > 0) {
                sessionStorage.removeItem('oficio-menu-dropdown');
              }
              if (Array.isArray(this.resp[2])) {
                this.resp[2].forEach(r => {
                  console.log(r);
                  this.ms.add({
                    key: 'toastprincipal',
                    severity: 'success',
                    summary: 'PROCESSO APAGADO',
                    detail: r
                  });
                });
              }
              this.router.navigate(['/proce/listar']);
            } else {
              console.error('ERRO - EXCLUIR ', this.resp[2]);
              this.ms.add({
                key: 'toastprincipal',
                severity: 'warn',
                summary: 'ATENÇÃO - ERRO',
                detail: this.resp[2]
              });
              this.apagarSN = false;
              this.botaoEnviarVF = false;
            }
          }
        })
      );
    }
  }

  ngOnDestroy() {
    this.ps.procApagar = null;
    this.sub.forEach(s => s.unsubscribe());
  }






}
