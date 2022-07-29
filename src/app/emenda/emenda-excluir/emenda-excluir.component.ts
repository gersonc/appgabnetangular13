import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../_services";
import {Stripslashes} from "../../shared/functions/stripslashes";
import {EmendaService} from "../_services/emenda.service";
import {MsgService} from "../../_services/msg.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-emenda-excluir',
  templateUrl: './emenda-excluir.component.html',
  styleUrls: ['./emenda-excluir.component.css']
})
export class EmendaExcluirComponent implements OnInit {

  real = Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

  botaoEnviarVF = false;
  public arquivoBlockSubmit = true;
  emenda_id: number;
  acao = '';
  resp: any[];
  display = false;
  sub: Subscription[] = [];
  apagarAtivo = false;
  botoesInativos = false;
  botaoEnviarInativo = false;
  msg = 'Deseja excluir permanetemente esta emenda';

  constructor(
    public aut: AuthenticationService,
    public es: EmendaService,
    private ms: MsgService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    if (!this.aut.emenda_apagar && !this.aut.usuario_principal_sn && !this.aut.usuario_responsavel_sn) {
      this.botoesInativos = true;
      this.ms.add({
        key: 'toastprincipal',
        severity: 'warn',
        summary: 'ATENÇÃO - ERRO',
        detail: 'PERMISSÃO NEGADA'
      });
      this.voltar();
    } else {
      this.emenda_id = this.es.emendaApagar.emenda_id;
      if (this.es.emendaApagar.emenda_arquivos.length === 0) {
        this.msg += '?'
      } else {
        if (this.es.emendaApagar.emenda_arquivos.length === 1) {
          this.msg += ' e o arquivo anexado ele?'
        } else {
          this.msg += ' e os '+ this.es.emendaApagar.emenda_arquivos.length +' arquivos anexados ela?'
        }
      }

    }
  }

  stripslashes(str?: string): string | null {
    return Stripslashes(str)
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
    this.es.emendaApagar = null;
  }

  voltarListar() {
    this.es.stateSN = false;
    this.router.navigate(['/emenda/listar']);
  }

  voltar() {
    this.es.stateSN = false;
    sessionStorage.removeItem('emenda-busca');
    this.router.navigate(['/emenda/listar2']);
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


  excluirEmenda() {
    this.sub.push(this.es.excluirEmenda(this.emenda_id)
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
            sessionStorage.removeItem('emenda-menu-dropdown');
            const idx = this.es.emendas.findIndex(o => o.emenda_id === this.emenda_id);
            this.es.emendas.splice(idx, 1);
            if (sessionStorage.getItem('emenda-table')) {
              const tmp: any = JSON.parse(sessionStorage.getItem('emenda-table'));
              if (tmp.expandedRowKeys !== undefined) {
                delete tmp.expandedRowKeys;
                sessionStorage.setItem('emenda-table', JSON.stringify(tmp));
              }
            }
            if (this.es.selecionados !== undefined && this.es.selecionados !== null && this.es.selecionados.length > 0) {
              const dx = this.es.selecionados.findIndex(o => o.emenda_id === this.emenda_id);
              if(dx !== -1) {
                this.es.selecionados.splice(dx,1);
              }
            }
            this.es.tabela.selectedColumns = undefined;
            this.es.tabela.totalRecords--;
            this.ms.add({
              key: 'toastprincipal',
              severity: 'success',
              summary: 'APAGAR EMENDA',
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
