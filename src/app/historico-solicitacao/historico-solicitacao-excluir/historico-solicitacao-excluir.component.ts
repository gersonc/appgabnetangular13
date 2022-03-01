import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ConfirmationService, MessageService} from "primeng/api";
import {AuthenticationService} from "../../_services";
import {HistoricoSolicitacaoService} from "../_services/historico-solocitacao.service";
import {Subscription} from "rxjs";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-historico-solocitacao-excluir',
  templateUrl: './historico-solocitacao-excluir.component.html',
  styleUrls: ['./historico-solocitacao-excluir.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class HistoricoSolicitacaoExcluirComponent implements OnInit, OnDestroy {
  @Input() id?: number;
  @Input() idx?: number;
  @Output() OnExcluir = new EventEmitter<number>();
  sub: Subscription[] = [];
  resp: any[];
  msg: any[] = [];

  constructor(
    private confirmationService: ConfirmationService,
    public authenticationService: AuthenticationService,
    private historicoSolicitacaoService: HistoricoSolicitacaoService,
    private messageService: MessageService
  ) {}

  confirm(event: Event) {
    this.confirmationService.confirm({
      target: event.target,
      message: 'Deseja excluir este andamento?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.exluir();
      }
    });
  }

  ngOnInit(): void {
  }

  exluir() {
    this.sub.push(this.historicoSolicitacaoService.delete(this.id)
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
            this.messageService.add({severity:'success', summary:'Andamento', detail:'Excluido com sucesso.'});
            this.OnExcluir.emit(this.idx);
          } else {
            this.messageService.add({severity:'error', summary:'Erro', detail:this.msg[2]});
          }

        }
      })
    );
  }

  /*
  this.sub.push(this.historicoSolicitacaoService.alterar(this.historico)
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
