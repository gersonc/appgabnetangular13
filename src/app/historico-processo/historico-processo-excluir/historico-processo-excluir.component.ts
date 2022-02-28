import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ConfirmationService, MessageService} from "primeng/api";
import {AuthenticationService} from "../../_services";
import {HistoricoProcessoService} from "../_services/historico-processo.service";
import {Subscription} from "rxjs";
import {take} from "rxjs/operators";
import {ProcessoHistoricoInterface} from "../../processo/_models";

@Component({
  selector: 'app-historico-processo-excluir',
  templateUrl: './historico-processo-excluir.component.html',
  styleUrls: ['./historico-processo-excluir.component.css']
})
export class HistoricoProcessoExcluirComponent implements OnInit, OnDestroy {
  @Input() id?: number;
  @Input() idx?: number;
  @Output() OnExcluir = new EventEmitter<number>();
  sub: Subscription[] = [];
  resp: any[];
  msg: any[] = [];

  constructor(
    private confirmationService: ConfirmationService,
    public authenticationService: AuthenticationService,
    private historicoProcessoService: HistoricoProcessoService,
    private messageService: MessageService
  ) {}

  confirm(event: Event) {
    this.confirmationService.confirm({
      target: event.target,
      message: 'Deseja excluir este andamento?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.exluir();
      },
      reject: () => {
        // this.messageService.add({severity:'error', summary:'Erro', detail:'Ocorreu um erro.'});
      }
    });
  }

  ngOnInit(): void {
  }

  exluir() {
    this.sub.push(this.historicoProcessoService.delete(this.id)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.resp = dados;
        },
        error: (err) => {
          this.msg[2] = err + " - Ocorreu um erro.";
          this.messageService.add({severity:'error', summary:'Erro', detail:this.msg[2]});
          console.error(err);
        },
        complete: () => {
          if (this.resp[0]) {
            this.messageService.add({severity:'info', summary:'Andamento', detail:'Excluido com sucesso.'});
            this.OnExcluir.emit(this.idx);
          } else {
            this.messageService.add({severity:'error', summary:'Erro', detail:this.msg[2]});
          }

        }
      })
    );
  }

  /*
  this.sub.push(this.historicoProcessoService.alterar(this.historico)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: (err) => {
            this.enviando = true;
            this.msg[2] = err + " - Ocorreu um erro.";
            console.error(err);
            this.resetForm();
          },
          complete: () => {
            if (this.resp[0]) {
              this.historico.historico_id = this.resp[1];

              this.msg[1] = 'Andamento Alterado com sucesso.';
              this.msg[0] = 1;
              this.novosDados.emit(this.historico);
            } else {
              this.enviando = true;
              this.msg[0] = 2;
              this.msg[1] = this.resp[0] + " - Ocorreu um erro.";
              this.resetForm();
            }

          }
        })
      );
  */

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
