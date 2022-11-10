import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService, ConfirmationService, SelectItem } from 'primeng/api';
import { CarregadorService, AuthenticationService } from '../../_services';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { NucleoService } from '../_services/nucleo.service';
import { LocalClass, LocalInterface } from '../_models/nucleo';
import { ConfiguracaoService } from '../../configuracao/_services';
import {MsgService} from "../../_services/msg.service";
import {DdService} from "../../_services/dd.service";

@Component({
  selector: 'app-nucleo-config',
  templateUrl: './nucleo-config.component.html',
  styleUrls: ['./nucleo-config.component.css'],
  providers: [ConfirmationService]
})
export class NucleoConfigComponent implements OnInit, OnDestroy {

  // locais: LocalInterface[] = null;
  local: LocalInterface = null;
  sub: Subscription[] = [];
  incluindo = false;
  resp: any[];
  mostraBtn = true;
  acao = 'INCLUIR';
  editing = false;
  perIncluir = false;
  perAltarar = false;
  perDeletar = false;
  dds: string[] = [];

  constructor(
    private cf: ConfirmationService,
    private ms: MsgService,
    // private messageService: MessageService,
    private aut: AuthenticationService,
    private dd: DdService,
    public ns: NucleoService,
    private cfs: ConfiguracaoService
  ) { }

  ngOnInit(): void {
    this.perIncluir = (this.aut.configuracao_incluir || this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn);
    this.perAltarar = (this.aut.configuracao_alterar || this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn);
    this.perDeletar = (this.aut.configuracao_apagar || this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn);
    this.listar();
    this.getDropdown();
  }

  getDropdown() {
    // ****** dropdown-usuario *****
    if (!sessionStorage.getItem('dropdown-usuario')) {
      this.dds.push('dropdown-usuario');
    }
    // ****** dropdown-local *****
    if (!sessionStorage.getItem('dropdown-local')) {
      this.dds.push('dropdown-local');
    }

    if (this.dds.length > 0) {
      let ddd: any[] = [];
      this.sub.push(this.dd.getDd(this.dds)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            ddd = dados;
          },
          error: (err) => {
            console.error(err);
          },
          complete: () => {
            this.dds.forEach( nome => {
              sessionStorage.setItem(nome, JSON.stringify(ddd[nome]));
            });
          }
        })
      );
    }
  }

  listar() {
    this.ns.locais = [];
    this.ns.nuMostraBt = true;
    this.sub.push(this.ns.listar()
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.ns.locais = dados;
        },
        error: err => console.error('ERRO-->', err),
        complete: () => {
        }
      })
    );
  }

  onIncluindo() {
    if(this.perIncluir) {
      this.ns.nuMostraBt = true;
      this.ns.nuAcao = 'INCLUIR';
      this.acao = 'NÚCLEO INCLUIR'
      this.ns.nuForm = this.ns.newNucleo();
      this.ns.nuForm.local_id = 0;
      this.ns.formularioSN = true;
      this.ns.formDisplay = true;
    }
  }

  onEdit(local: LocalInterface, ri: number) {
    if(this.perAltarar) {
      this.ns.idx = ri;
      this.ns.nuMostraBt = true;
      this.ns.nuForm = {...local};
      this.ns.nuAcao = 'ALTERAR';
      this.acao = 'NÚCLEO ALTERAR'
      this.ns.formularioSN = true;
      this.ns.formDisplay = true;
    }
  }

  onDelete(local: LocalInterface, ri: number, ev: any) {
    if(this.perDeletar) {
      this.cf.confirm({
        target: ev.target,
        message: 'Apagar núcleo ' + local.local_nome + '?',
        header: 'APAGAR NÚCLEO',
        icon: 'pi pi-trash',
        accept: () => {
          // this.messageService.clear('msgExcluir');
          this.sub.push(this.ns.excluir(local.local_id)
            .pipe(take(1))
            .subscribe({
              next: (dados) => {
                this.resp = dados;
              },
              error: err => console.error('ERRO-->', err),
              complete: () => {
                if (this.resp[0]) {
                  this.ns.locais.splice(this.ns.locais.indexOf(this.ns.locais.find(i => i.local_id === local.local_id)), 1);
                  this.ns.ddnucleo = this.ns.locais.map((n) =>{
                    return {
                      label: n.local_nome,
                      value: n.local_id
                    }
                  });
                  sessionStorage.setItem('dropdown-local', JSON.stringify(this.ns.ddnucleo));
                } else {
                  this.ms.add({key: 'toastprincipal', severity: 'warn', summary: 'APAGAR', detail: this.resp[2]});
                }
              }
            })
          );

        }
      });
    }
  }

  hideForm(ev: boolean) {
    this.ns.formDisplay = ev;
    this.ns.formularioSN = false;
  }

  ngOnDestroy(): void {
    this.ns.ngDestroy();
    this.sub.forEach(s => s.unsubscribe());
  }

}
