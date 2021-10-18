import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService, ConfirmationService, SelectItem } from 'primeng/api';
import { CarregadorService, AuthenticationService } from '../../_services';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { NucleoService } from '../_services/nucleo.service';
import { LocalClass, LocalInterface } from '../_models/nucleo';
import { ConfiguracaoService } from '../../configuracao/_services';

@Component({
  selector: 'app-nucleo-config',
  templateUrl: './nucleo-config.component.html',
  styleUrls: ['./nucleo-config.component.css'],
  providers: [ConfirmationService]
})
export class NucleoConfigComponent implements OnInit, OnDestroy {

  locais: LocalInterface[] = null;
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


  constructor(
    private cs: CarregadorService,
    private cf: ConfirmationService,
    private messageService: MessageService,
    private alt: AuthenticationService,
    public ns: NucleoService,
    private cfs: ConfiguracaoService
  ) { }

  ngOnInit(): void {
    this.perIncluir = this.alt.configuracao_incluir;
    this.perAltarar = this.alt.configuracao_alterar;
    this.perDeletar = this.alt.configuracao_apagar;
    this.listar();
  }

  listar() {
    this.locais = null;
    this.ns.nuMostraBt = true;
    this.sub.push(this.ns.listar()
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.locais = dados;
        },
        error: err => console.error('ERRO-->', err),
        complete: () => {
          this.cs.escondeCarregador();
        }
      })
    );
  }

  onIncluindo() {
    this.ns.nuMostraBt = true;
    this.ns.nuAcao = 'INCLUIR';
    this.ns.nuForm = new LocalClass();
    this.ns.formDisplay = true;
  }

  onEdit(local: LocalInterface) {
    this.ns.nuMostraBt = true;
    this.ns.nuForm = new LocalClass();
    this.ns.nuAcao = 'ALTERAR';
    this.ns.nuForm = local;
    this.ns.formDisplay = true;
  }

  onDelete(local: LocalInterface) {
    this.cf.confirm({
      message: 'Apagar local marca ' + local.local_nome + '?',
      header: 'APAGAR',
      icon: 'pi pi-trash',
      accept: () => {
        this.messageService.clear('msgExcluir');
        this.cs.mostraCarregador();
        this.sub.push(this.ns.excluir(local.local_id)
          .pipe(take(1))
          .subscribe({
            next: (dados) => {
              this.resp = dados;
            },
            error: err => console.error('ERRO-->', err),
            complete: () => {
              this.cs.escondeCarregador();
              if (this.resp[0]) {
                this.cfs.corrigeDropdown('nucleo');
                this.ns.nuExecutado = true;
                this.ns.nuForm.local_id = +this.resp[1];
                this.locais.splice(this.locais.indexOf(this.locais.find(i => i.local_id === local.local_id)), 1);

                this.messageService.add({key: 'msgExcluir', severity: 'info', summary: 'APAGAR: ', detail: this.resp[2]});
              } else {
                this.messageService.add({key: 'msgExcluir', severity: 'warn', summary: 'APAGAR: ', detail: this.resp[2]});
              }
            }
          })
        );

      }
    });
  }


  fechaDialog() {
    this.ns.nuMostraBt = true;
    if (this.ns.nuExecutado) {
      this.cfs.corrigeDropdown('nucleo');
      if (this.ns.nuAcao === 'INCLUIR') {
        this.locais.push(this.ns.nuForm);
        this.ns.nuExecutado = false;
      }
      if (this.ns.nuAcao === 'ALTERAR') {
        this.locais[this.locais.indexOf(this.locais.find(i => i.local_id === this.ns.nuForm.local_id))] = this.ns.nuForm;
        this.ns.nuExecutado = false;
      }
    }

    setTimeout(() => {
      this.ns.nuForm = new LocalClass();
    }, 1000);
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
