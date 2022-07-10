import {
  Component,
  ElementRef,
  EventEmitter,
  Input, OnChanges, OnDestroy,
  OnInit,
  Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import {HistFormI, HistI, HistListI} from "../_models/hist-i";
import {AuthenticationService} from "../../_services";
import {HistAuxService} from "../_services/hist-aux.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {HistService} from "../_services/hist.service";
import {take} from "rxjs/operators";
import {Subscription} from "rxjs";
import {MsgService} from "../../_services/msg.service";

@Component({
  selector: 'app-hist-datatable',
  templateUrl: './hist-datatable.component.html',
  styleUrls: ['./hist-datatable.component.css'],
  providers: [ConfirmationService]
})
export class HistDatatableComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('tb', { static: false }) tb!: ElementRef;
  @Output() dialogExterno = new EventEmitter<boolean>();
  @Output() novoRegistro = new EventEmitter<HistFormI>();
  @Output() displayChange = new EventEmitter<boolean>();
  @Input() display: boolean = false;
  @Input() imprimir?: boolean;
  @Input() histListI?: HistListI | undefined;
  @Input() permitirAcao: boolean = true;
  @Output() impressao = new EventEmitter<any>();


  his: HistI[];
  hisI: HistI[];
  // historico: HistI[];
  estilo = 'tablcomp';
  caption = 'ANDAMENTOS DA SOLICITAÇÃO';
  incluir = false;
  alterar = false;
  apagar = false;
  // modulo = '';
  // idx = 0;
  // registro_id: number = 0;
  tituloHistoricoDialog = 'ANDAMENTOS';
  histFormI?: HistFormI;
  showHistorico = false;
  excluir = false;
  sub: Subscription[] = [];
  resp: [boolean, string, string] = [false,'',''];
  msg: any[] = [];


  constructor(
    private cf: ConfirmationService,
    public aut: AuthenticationService,
    private hs: HistService,
    private ms: MessageService,
    public has: HistAuxService,
    private mssg: MsgService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    // this.modulo = this.histListI.modulo;
    // this.registro_id = this.histListI.registro_id;
    // this.idx = this.histListI.idx;
    if(this.histListI.modulo === 'solicitacao') {
      this.caption = 'ANDAMENTOS DA SOLICITAÇÃO';
      this.incluir = this.aut.historico_solicitacao_incluir;
      this.alterar = this.aut.historico_solicitacao_alterar;
      this.apagar = this.aut.historico_solicitacao_apagar;
    } else {
      this.caption = 'ANDAMENTOS DO PROCESSO';
      this.incluir = this.aut.historico_incluir;
      this.alterar = this.aut.historico_alterar;
      this.apagar = this.aut.historico_apagar;
    }
  }

  ngOnInit(): void { }

  fechar() {
    this.dialogExterno.emit(false);
    this.displayChange.emit(false);
  }

  dialogExternoSN(vf: boolean) {
    this.dialogExterno.emit(vf);
  }

  recebeRegistro(h: HistFormI) {
    h.idx = this.histListI.idx;
    this.novoRegistro.emit(h);
  }

  onExcluir(n: number[]) {
    const e: HistFormI = {
      modulo: this.histListI.modulo,
      acao: 'apagar',
      idx: n[1],
      hist: this.histListI.hist[n[0]]
    }
    this.novoRegistro.emit(e);
    this.histListI.hist.splice(n[0], 1);
  }

  escolheTipoImpressao(hi: any | null): Boolean | HistI {
    if (hi) {
      if (hi.historico_andamento_texto !== undefined && hi.historico_andamento_texto !== null) {
        hi.historico_andamento = hi.historico_andamento_texto;
        hi.historico_andamento_delta = null;
        hi.historico_andamento_texto = null;
        return hi;
      }
      if (hi.historico_andamento !== undefined && hi.historico_andamento !== null) {
        hi.historico_andamento_texto = null;
        hi.historico_andamento_delta = null;
        return hi;
      }
      return hi;
    }
    return false;
  }

  transformaDadosImpressao(dados: HistI[]): HistI[] {
    if (dados) {
      if (dados.length === 0) {
        return null;
      }
      let re: HistI[] = [];
      dados.forEach(value => {
        if (this.escolheTipoImpressao(value)) {
          re.push(<HistI>this.escolheTipoImpressao(value));
        }
      });
      if (re.length > 0) {
        return re;
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  mandaTabela() {
    this.impressao.emit(this.tb.nativeElement);
  }

  historicoAcao(acao: string, idx?: number, historico?: HistI) {
    this.tituloHistoricoDialog = (this.histListI.modulo === 'solicitacao') ? 'SOLICITAÇÃO - ' : 'PROCESSO - ';
    this.tituloHistoricoDialog += acao.toUpperCase() + ' ANDAMENTOS';
    if (acao === 'alterar') {
      this.histFormI = {
        idx: idx,
        acao: acao,
        modulo: this.histListI.modulo,
        hist: historico
      }
    }
    if (acao === 'incluir') {
      this.histFormI = {
        idx: this.histListI.idx,
        acao: acao,
        modulo: this.histListI.modulo,
        hist: {
          historico_solicitacao_id: (this.histListI.modulo === 'solicitacao') ? this.histListI.registro_id: undefined,
          historico_processo_id: (this.histListI.modulo === 'processo') ? this.histListI.registro_id : undefined,
        }
      }
    }
    this.showHistorico = true;
  }

  confirm(event: Event, excluir_id: number, idx: number) {
    this.cf.confirm({
      target: event.target,
      message: 'Deseja excluir este andamento?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log('confirm',excluir_id, this.histListI.modulo, idx, this.histListI.hist[idx]);
        this.onExluir(excluir_id, idx);
      }
    });
  }

  onExluir(excluir_id: number, idx: number) {
    this.sub.push(this.hs.delete(excluir_id, this.histListI.modulo)
      .pipe(take(1))
      .subscribe({
        next: (dados: [boolean, string, string]) => {
          this.resp = dados;
        },
        error: (err) => {
          this.msg[2] = err + " - Ocorreu um erro.";
          this.mssg.add({
            key: 'toastprincipal',
            severity: 'warn',
            summary: this.resp[1],
            detail: this.resp[2]
          });
          // this.ms.add({severity:'error', summary:'Erro', detail:this.msg[2]});
          console.error(err);
        },
        complete: () => {
          if (this.resp[0]) {
            this.mssg.add({
              key: 'toastprincipal',
              severity: 'success',
              summary: 'ANDAMENTO',
              detail: this.resp[1],
            });
            // this.ms.add({severity:'success', summary:'Andamento', detail:'Excluido com sucesso.'});
            const e: HistFormI = {
              modulo: this.histListI.modulo,
              acao: 'apagar',
              idx: idx,
              hist: this.histListI.hist[idx]
            }
            this.recebeRegistro(e);
          } else {
            this.mssg.add({
              key: 'toastprincipal',
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
