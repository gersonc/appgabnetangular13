import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ConfirmationService, MessageService} from "primeng/api";
import {AuthenticationService} from "../../_services";
import {HistService} from "../_services/hist.service";
import {Subscription} from "rxjs";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-hist-excluir',
  template: `<button *ngIf="excluir" pButton pRipple type="button" icon="pi pi-trash" pTooltip="APAGAR" class="historico p-button-sm p-button-rounded p-button-danger" (click)="confirm($event)"></button><p-confirmPopup *ngIf="excluir"></p-confirmPopup>`
})
export class HistExcluirComponent implements OnInit {
  @Input() id?: number;
  @Input() idx?: number;
  @Input() modulo: string;
  @Output() onExcluir = new EventEmitter<number>();
  sub: Subscription[] = [];
  resp: [boolean, string, string] = [false,'',''];
  msg: any[] = [];

  excluir = false;

  constructor(
    private cf: ConfirmationService,
    public aut: AuthenticationService,
    private hs: HistService,
    private ms: MessageService
  ) {

  }

  ngOnInit(): void {
    this.excluir = ((this.modulo === 'processo' && this.aut.historico_apagar) || (this.modulo === 'solicitacao' && this.aut.historico_solicitacao_apagar));
  }

  confirm(event: Event) {
    this.cf.confirm({
      target: event.target,
      message: 'Deseja excluir este andamento?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.exluir();
      }
    });
  }

  exluir() {
    this.sub.push(this.hs.delete(this.id, this.modulo)
      .pipe(take(1))
      .subscribe({
        next: (dados: [boolean, string, string]) => {
          this.resp = dados;
        },
        error: (err) => {
          this.msg[2] = err + " - Ocorreu um erro.";
          this.ms.add({
            key: 'principal',
            severity: 'warn',
            summary: this.resp[1],
            detail: this.resp[2]
          });
          // this.ms.add({severity:'error', summary:'Erro', detail:this.msg[2]});
          console.error(err);
        },
        complete: () => {
          if (this.resp[0]) {
            this.ms.add({
              key: 'principal',
              severity: 'success',
              summary: 'ANDAMENTO',
              detail: this.resp[1],
            });
            // this.ms.add({severity:'success', summary:'Andamento', detail:'Excluido com sucesso.'});
            this.onExcluir.emit(this.idx);
          } else {
            this.ms.add({
              key: 'principal',
              severity: 'warn',
              summary: this.resp[1],
              detail: this.resp[2]
            });
            // this.ms.add({severity:'error', summary:'Erro', detail:this.msg[2]});
          }

        }
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
