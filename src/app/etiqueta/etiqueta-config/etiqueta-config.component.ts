import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {  ConfirmationService } from 'primeng/api';
import { EtiquetaInterface } from "../_models";
import { EtiquetaConfigService } from "../_services";
import { AuthenticationService } from "../../_services";
import { Subscription } from "rxjs";
import { take } from "rxjs/operators";
import {ConfiguracaoModelInterface} from "../../configuracao/_models/configuracao-model";
import {MsgService} from "../../_services/msg.service";


@Component({
  selector: 'app-etiqueta-config',
  templateUrl: './etiqueta-config.component.html',
  styleUrls: ['./etiqueta-config.component.css'],
  providers: [ConfirmationService]
})
export class EtiquetaConfigComponent implements OnInit, OnDestroy {
  @Output() onConfTitulo = new EventEmitter<ConfiguracaoModelInterface>();
  // etiquetas: EtiquetaInterface[];
  // etiqueta: EtiquetaInterface;
  sub: Subscription[] = [];
  incluindo = false;
  resp: any[];
  mostraBtn = true;
  acao: string = 'INCLUIR';
  editing = false;
  perIncluir = false;
  perAltarar = false;
  perDeletar = false;
  configuracao: ConfiguracaoModelInterface = {
    tabela: 'etiquetas',
    campo_id: 'etq_id',
    campo_nome: 'etq_modelo',
    titulo: 'ETIQUETAS',
    texto: ''
  }

  constructor(
    private cf: ConfirmationService,
    public ecs: EtiquetaConfigService,
    private ms: MsgService,
    // private messageService: MessageService,
    private alt: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.ecs.etiqueta = this.ecs.novaEtiqueta();
    this.perIncluir = this.alt.configuracao_incluir;
    this.perAltarar = this.alt.configuracao_alterar;
    this.perDeletar = this.alt.configuracao_apagar;
    this.listar();
  }

  listar() {
    this.ecs.etiquetas = [];
    if (sessionStorage.getItem('dropdown-etiqueta')) {
      this.ecs.etiquetas = this.ecs.dropToList(JSON.parse(sessionStorage.getItem('dropdown-etiqueta')));
      console.log('this.ecs.etiquetas', this.ecs.etiquetas);
    } else {
      this.sub.push(this.ecs.listar()
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.ecs.etiquetas = dados;
          },
          error: err => console.error('ERRO-->', err),
          complete: () => {
            sessionStorage.setItem('dropdown-etiqueta', JSON.stringify(this.ecs.listToDrop(this.ecs.etiquetas)));
            this.onConfTitulo.emit(this.configuracao);
          }
        })
      );
    }



  }

  onIncluindo() {
    this.acao = 'INCLUIR ETIQUETA'
    this.ecs.etqAcao = 'INCLUIR';
    this.ecs.etqForm = this.ecs.novaEtiqueta();
    this.ecs.formDisplay = true;
  }

  onEdit(etiqueta: EtiquetaInterface, idx: number) {
    this.ecs.idx = idx;
    const e: EtiquetaInterface = {...etiqueta};
    this.acao = 'ALTERAR ETIQUETA'
    this.ecs.etqAcao = 'ALTERAR';
    this.ecs.etqForm = e;
    this.ecs.formDisplay = true;
  }

  onDelete(etiqueta: EtiquetaInterface, idx: number, ev: any) {
    this.cf.confirm({
      target: ev.target,
      message: 'Apagar etiqueta marca ' + etiqueta.etq_marca + ' modelo ' + etiqueta.etq_modelo + '?',
      header: 'APAGAR ETIQUETA',
      icon: 'pi pi-trash',
      accept: () => {
        // this.messageService.clear('msgExcluir');
        this.sub.push(this.ecs.excluir(etiqueta.etq_id)
          .pipe(take(1))
          .subscribe({
            next: (dados) => {
              this.resp = dados;
            },
            error: err => console.error('ERRO-->', err),
            complete: () => {
              if (this.resp[0]) {
                this.ecs.etqExecutado = true;
                this.ecs.etqForm.etq_id = +this.resp[1];
                this.ecs.etiquetas.splice(idx, 1);
                sessionStorage.setItem('dropdown-etiqueta', JSON.stringify(this.ecs.listToDrop(this.ecs.etiquetas)));
                this.ms.add({key: 'toastprincipal', severity: 'success', summary: 'APAGAR', detail: this.resp[2]});
              } else {
                this.ms.add({key: 'toastprincipal', severity: 'warn', summary: 'APAGAR', detail: this.resp[2]});
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
        this.ecs.etiquetas.push(this.ecs.etqForm);
        this.ecs.etqExecutado = false;
      } else {
        this.ecs.etiquetas.forEach((eq) => {
          if (eq.etq_id === this.ecs.etqForm.etq_id) {
            eq = this.ecs.etqForm;
          }
        });
        this.ecs.etqExecutado = false;
      }
    }
    setTimeout(() => {
      this.ecs.etqForm = this.ecs.novaEtiqueta();
    }, 1000);
  }

  hideForm(ev: boolean) {
    this.ecs.formDisplay = ev;
  }

  ngOnDestroy(): void {
    delete this.ecs.etiquetas;
    delete this.ecs.etqForm;
    delete this.ecs.etiqueta;
    delete this.ecs.etqAcao;
    delete this.ecs.idx;
    this.sub.forEach(s => s.unsubscribe());
  }

}
