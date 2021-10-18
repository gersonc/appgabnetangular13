import { Component, OnDestroy, OnInit } from '@angular/core';
// import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
// import { EmendaDetalheInterface, EmendaListarInterface, HistoricoEmendaInterface } from '../_models';
import { EmendaService } from "../_services";
import { Subscription } from 'rxjs';
import { Router} from "@angular/router";
import {AuthenticationService, CarregadorService} from "../../_services";
import {take} from "rxjs/operators";

declare interface ColumnsInterface {
  header: string;
  dataKey: string;
}

@Component({
  selector: 'app-emenda-excluir',
  templateUrl: './emenda-excluir.component.html',
  styleUrls: ['./emenda-excluir.component.css']
})
export class EmendaExcluirComponent implements OnInit, OnDestroy {

  emenda: any[] = [];
  titulos: any[] = null;
  emenda_titulo: any[] = null;
  historico_emenda_titulo: any[] = null;
  display = false;
  resp: any[];
  sub: Subscription[] = [];

  apagarAtivo = false;
  botoesInativos = false;
  botaoEnviarInativo = false;

  constructor(
    private router: Router,
    public es: EmendaService,
    private cs: CarregadorService,
    public authenticationService: AuthenticationService,
    private messageService: MessageService,
  ) {
    this.apagarAtivo = !this.authenticationService.emenda_apagar;
  }

  ngOnInit() {

    this.titulos = JSON.parse(sessionStorage.getItem('emenda-titulos'));
    this.emenda_titulo = this.titulos['emenda_titulo'];
    this.historico_emenda_titulo = this.titulos['historico_emenda_titulo'];

    const s1: string[] = Object.keys(this.titulos['emenda_titulo']);
    const v1: any[] = Object.values(this.titulos['emenda_titulo']);
    let tit1: any[] = [];
    for (let i = 0; i < s1.length; i++) {
      if (v1[i]) {
        tit1[s1[i]] = v1[i].toString();
      }
    }

    const s: string[] = Object.keys(this.es.emendaExcluir);
    const v: any[] = Object.values(this.es.emendaExcluir);
    let eme1: any[] = [];
    for (let i = 0; i < s.length; i++) {
      if (v[i]) {
        eme1[s[i]] = v[i].toString();
      }
    }

    s1.forEach( k => {
      if (eme1[k] && k !== 'emenda_justificativa' && k !== 'historico_emenda' && k !== 'historico_emenda_num') {
        this.emenda.push([tit1[k], eme1[k]]);
      }
    });

    this.cs.escondeCarregador();

  }


  voltarListar() {
    this.es.emendaExcluir = null;
    this.router.navigate(['/emenda']);
  }

  showDialog() {
    this.display = true;
  }

  excluirEmenda() {
    this.display = false;
    this.apagarAtivo = true;
    if (this.authenticationService.emenda_apagar) {
      this.apagarAtivo = true;
      this.botoesInativos = true;
      this.cs.mostraCarregador();
      this.sub.push(this.es.deleteEmendaId(this.es.emendaExcluir.emenda_id)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: (err) => {
            this.apagarAtivo = !this.authenticationService.emenda_apagar;
            this.botoesInativos = false;
            this.cs.escondeCarregador();
            this.messageService.add({key: 'emendaErro', severity: 'warn', summary: 'ERRO APAGAR', detail: this.resp[2]});
            console.log(err);
          },
          complete: () => {
            if (this.resp[0]) {
              this.messageService.add({
                key: 'emendaToast',
                severity: 'success',
                summary: 'APAGAR EMENDA',
                detail: this.resp[2]
              });
              this.voltarListar();
            } else {
              this.apagarAtivo = !this.authenticationService.emenda_apagar;
              this.botoesInativos = false;
              this.cs.escondeCarregador();
              console.error('ERRO - APAGAR ', this.resp[2]);
              this.messageService.add({
                key: 'emendaErro',
                severity: 'warn',
                summary: 'ATENÇÃO - ERRO',
                detail: this.resp[2]
              });
            }
          }
        })
      );
    } else {
      this.botoesInativos = false;
      this.cs.escondeCarregador();
      this.messageService.add({
        key: 'emendaErro',
        severity: 'warn',
        summary: 'ATENÇÃO - ERRO',
        detail: 'PERMISSÃO NEGADA'
      });
    }
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
