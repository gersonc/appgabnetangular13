import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { EtiquetaClass, EtiquetaInterface } from "../_models";
import { EtiquetaConfigService } from "../_services";
import { CarregadorService, AuthenticationService } from "../../_services";
import { Subscription } from "rxjs";
import { take } from "rxjs/operators";


@Component({
  selector: 'app-etiqueta-config',
  templateUrl: './etiqueta-config.component.html',
  styleUrls: ['./etiqueta-config.component.css'],
  providers: [ConfirmationService]
})
export class EtiquetaConfigComponent implements OnInit, OnDestroy {

  etiquetas: EtiquetaInterface[];
  etiqueta: EtiquetaInterface;
  sub: Subscription[] = [];
  incluindo = false;
  resp: any[];
  mostraBtn = true;
  acao: string = 'INCLUIR';
  editing = false;
  perIncluir = false;
  perAltarar = false;
  perDeletar = false;

  constructor(
    private cs: CarregadorService,
    private cf: ConfirmationService,
    public ecs: EtiquetaConfigService,
    private messageService: MessageService,
    private alt: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.perIncluir = this.alt.configuracao_incluir;
    this.perAltarar = this.alt.configuracao_alterar;
    this.perDeletar = this.alt.configuracao_apagar;
    this.listar();
  }

  listar() {
    this.etiquetas = null;
    this.sub.push(this.ecs.listar()
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.etiquetas = dados;
        },
        error: err => console.error('ERRO-->', err),
        complete: () => {
          this.cs.escondeCarregador();
        }
      })
    );
  }

  onIncluindo() {
    this.ecs.etqAcao = 'INCLUIR';
    this.ecs.etqForm = new EtiquetaClass();
    this.ecs.formDisplay = true;
  }

  onEdit(etiqueta: EtiquetaInterface) {
    this.ecs.etqAcao = 'ALTERAR';
    this.ecs.etqForm = etiqueta;
    this.ecs.formDisplay = true;
  }

  onDelete(etiqueta: EtiquetaInterface) {
    this.cf.confirm({
      message: 'Apagar etiqueta marca ' + etiqueta.etq_marca + ' modelo ' + etiqueta.etq_modelo + '?',
      header: 'APAGAR',
      icon: 'pi pi-trash',
      accept: () => {
        this.messageService.clear('msgExcluir');
        this.cs.mostraCarregador();
        this.sub.push(this.ecs.excluir(etiqueta.etq_id)
          .pipe(take(1))
          .subscribe({
            next: (dados) => {
              this.resp = dados;
            },
            error: err => console.error('ERRO-->', err),
            complete: () => {
              this.cs.escondeCarregador();
              if (this.resp[0]) {
                this.ecs.etqExecutado = true;
                this.ecs.etqForm.etq_id = +this.resp[1];
                this.etiquetas.splice(this.etiquetas.indexOf(this.etiquetas.find(i => i.etq_id === etiqueta.etq_id)), 1);
                this.messageService.add({key: 'msgExcluir',severity: 'info', summary: 'APAGAR: ', detail: this.resp[2]});
              } else {
                this.messageService.add({key: 'msgExcluir',severity: 'warn', summary: 'APAGAR: ', detail: this.resp[2]});
              }
            }
          })
        );

      }
    });
  }

  fechaDialog() {
    if (this.ecs.etqExecutado) {
      if (this.ecs.etqAcao === 'INCLUIR') {
        this.etiquetas.push(this.ecs.etqForm);
        this.ecs.etqExecutado = false;
      } else {
        this.etiquetas.forEach((eq) => {
          if (eq.etq_id === this.ecs.etqForm.etq_id) {
            eq = this.ecs.etqForm;
          }
        });
        this.ecs.etqExecutado = false;
      }
    }
    setTimeout(() => {
      this.ecs.etqForm = new EtiquetaClass();
    }, 1000);
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
