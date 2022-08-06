import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../_services";
import {MsgService} from "../../_services/msg.service";
import {Router} from "@angular/router";
import {ProposicaoService} from "../_services/proposicao.service";
import {Subscription} from "rxjs";
import {Stripslashes} from "../../shared/functions/stripslashes";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-proposicao-excluir',
  templateUrl: './proposicao-excluir.component.html',
  styleUrls: ['./proposicao-excluir.component.css']
})
export class ProposicaoExcluirComponent implements OnInit {
  botaoEnviarVF = false;
  public arquivoBlockSubmit = true;
  proposicao_id: number;
  acao = '';
  resp: any[];
  display = false;
  sub: Subscription[] = [];
  apagarAtivo = false;
  botoesInativos = false;
  botaoEnviarInativo = false;
  msg = 'Deseja excluir permanetemente esta proposição?';


  constructor(
    public aut: AuthenticationService,
    private ms: MsgService,
    private router: Router,
    public ps: ProposicaoService
  ) { }

  ngOnInit(): void {
    if (!this.aut.proposicao_apagar && !this.aut.usuario_principal_sn && !this.aut.usuario_responsavel_sn) {
      this.botoesInativos = true;
      this.ms.add({
        key: 'toastprincipal',
        severity: 'warn',
        summary: 'ATENÇÃO - ERRO',
        detail: 'PERMISSÃO NEGADA'
      });
      this.voltar();
    } else {
      this.proposicao_id = this.ps.proposicaoApagar.proposicao_id;
      if (this.ps.proposicaoApagar.proposicao_arquivos.length === 0) {
        this.msg += '?'
      } else {
        if (this.ps.proposicaoApagar.proposicao_arquivos.length === 1) {
          this.msg += ' e o arquivo anexado ele?'
        } else {
          this.msg += ' e os '+ this.ps.proposicaoApagar.proposicao_arquivos.length +' arquivos anexados ela?'
        }
      }

    }
  }

  stripslashes(str?: string): string | null {
    return Stripslashes(str)
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
    this.ps.proposicaoApagar = null;
  }

  voltarListar() {
    this.ps.stateSN = false;
    this.router.navigate(['/proposicao/listar']);
  }

  voltar() {
    this.ps.stateSN = false;
    sessionStorage.removeItem('proposicao-busca');
    this.router.navigate(['/proposicao/listar2']);
  }

  fecharDialog() {
    this.display = false;
    this.botaoEnviarInativo = false;
    this.botoesInativos = false;
  }

  showDialog() {
    this.botaoEnviarInativo = true;
    this.botoesInativos = true;
    this.display = true;
  }


  excluirProposicao() {
    this.sub.push(this.ps.excluirProposicao(this.proposicao_id)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.resp = dados;
        },
        error: (err) => {
          this.fecharDialog();
          this.ms.add({key: 'toastprincipal', severity: 'warn', summary: 'ERRO APAGAR', detail: this.resp[2]});
          console.error(err);
        },
        complete: () => {
          if (this.resp[0]) {
            sessionStorage.removeItem('proposicao-menu-dropdown');
            const idx = this.ps.proposicoes.findIndex(o => o.proposicao_id === this.proposicao_id);
            this.ps.proposicoes.splice(idx, 1);
            if (sessionStorage.getItem('proposicao-table')) {
              const tmp: any = JSON.parse(sessionStorage.getItem('proposicao-table'));
              if (tmp.expandedRowKeys !== undefined) {
                delete tmp.expandedRowKeys;
                sessionStorage.setItem('proposicao-table', JSON.stringify(tmp));
              }
            }
            if (this.ps.selecionados !== undefined && this.ps.selecionados !== null && this.ps.selecionados.length > 0) {
              const dx = this.ps.selecionados.findIndex(o => o.proposicao_id === this.proposicao_id);
              if(dx !== -1) {
                this.ps.selecionados.splice(dx,1);
              }
            }
            this.ps.tabela.selectedColumns = undefined;
            this.ps.tabela.totalRecords--;
            this.ms.add({
              key: 'toastprincipal',
              severity: 'success',
              summary: 'APAGAR PROPOSIÇÃO',
              detail: this.resp[2]
            });
            this.fecharDialog();
            this.voltarListar();
          } else {
            this.fecharDialog();
            console.error('ERRO - APAGAR ', this.resp[2]);
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

  onBlockSubmit(ev) {
    this.botaoEnviarInativo = ev;
  }

}
