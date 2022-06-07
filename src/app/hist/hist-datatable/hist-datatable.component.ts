import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges, OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {HistFormI, HistI, HistListI} from "../_models/hist-i";
import {SolicitacaoHistoricoInterface} from "../../solicitacao/_models";
import {AuthenticationService} from "../../_services";
import {take} from "rxjs/operators";
import {Subject, Subscription} from "rxjs";
import {HistService} from "../_services/hist.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-hist-datatable',
  templateUrl: './hist-datatable.component.html',
  styleUrls: ['./hist-datatable.component.css']
})
export class HistDatatableComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('tb', { static: false }) tb!: ElementRef;
  @Input() display: boolean = false;
  @Output() displayChange = new EventEmitter<boolean>();
  @Input() dados?: HistListI | null = null;
  @Output() dadosChange = new EventEmitter<HistListI>();
  @Input() imprimir?: boolean = false;
  @Output() impressao = new EventEmitter<any>();

  private sub: Subscription[] = [];

  his: HistI[];
  hisI: HistI[];
  historico: HistListI;
  estilo = 'tablcomp';
  caption = 'ANDAMENTOS DA SOLICITAÇÃO';
  incluir = false;
  alterar = false;
  apagar = false;
  modulo = '';
  histForm: HistFormI | null = null;
  // histForm: HistFormI = {};
  displayForm = false;
  idx = 0;
  side = false;

  constructor(
    private aut: AuthenticationService,
    private hs: HistService,
    private ms: MessageService
  ) {
    /*if(this.dados.hist.length > 0) {
      this.his = this.transformaDados(this.dados.hist);
      this.hisI = this.transformaDadosImpressao(this.dados.hist);
    }*/

  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.imprimir) {
      if (this.imprimir) {
        this.mandaTabela();
      }
    }
    if (changes.dados.currentValue !== null) {
      this.his = [...this.transformaDados(changes.dados.currentValue.hist)];
      this.hisI = [...this.transformaDadosImpressao(changes.dados.currentValue.hist)];
      this.historico = this.dados;
      this.modulo = changes.dados.currentValue.modulo;
      if (changes.dados.currentValue.modulo === 'processo') {
        this.caption = 'ANDAMENTOS DO PROCESSO';
        this.incluir = this.aut.historico_incluir;
        this.alterar = this.aut.historico_alterar;
        this.apagar = this.aut.historico_apagar;
      } else {
        this.caption = 'ANDAMENTOS DA SOLICITAÇÃO';
        this.incluir = this.aut.historico_solicitacao_incluir;
        this.alterar = this.aut.historico_solicitacao_alterar;
        this.apagar = this.aut.historico_solicitacao_apagar;
      }
    }
    if (changes.classeStylos) {
      this.estilo = changes.classeStylos.currentValue;
    }
  }

  escolheTipo(hi: any | null): Boolean | HistI {
    if (hi) {
      if (hi.historico_andamento_delta !== undefined && hi.historico_andamento_delta !== null) {
        hi.historico_andamento_texto = null;
        hi.historico_andamento = hi.historico_andamento_delta;
        hi.historico_andamento_delta = null;
        return hi;
      }
      if (hi.historico_andamento !== undefined && hi.historico_andamento !== null) {
        hi.historico_andamento_texto = null;
        hi.historico_andamento_delta = null;
        return hi;
      }
      if (hi.historico_andamento_texto !== undefined && hi.historico_andamento_texto !== null) {
        hi.historico_andamento = hi.historico_andamento_texto;
        hi.historico_andamento_delta = null;
        hi.historico_andamento_texto = null;
        return hi;
      }
      return hi;
    }
    return false;
  }



  transformaDados(dados: HistI[]): HistI[] {
    if (dados) {
      if (dados.length === 0) {
        return null;
      }
      let re: HistI[] = [];
      dados.forEach(value => {
        if (this.escolheTipo(value)) {
          re.push(<HistI>this.escolheTipo(value));
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


  escolheTipoImpressao(hi: any | null): Boolean | HistI {
    if (hi) {
      // let hi: HistI = h.hist;
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

  onIncluir() {
    let h: HistI;
    if (this.modulo === 'processo') {
      h = {
        historico_processo_id: this.his[0].historico_processo_id
      }
    } else {
      h = {
        historico_solocitacao_id: this.his[0].historico_solocitacao_id
      }
    }
    this.histForm = {
      acao: 'incluir',
      modulo: this.modulo,
      hist: h
    }

    this.displayForm = true;
    this.side = true;
  }

  onAlterar(his: HistI, idx: number) {
    this.histForm = {
      acao: 'alterar',
      modulo: this.modulo,
      hist: his
    }
    this.idx = idx;
    this.displayForm = true;
    this.side = true;
  }


  onApagar(his: HistI, idx: number) {
    this.histForm = {
      acao: 'apagar',
      modulo: this.modulo,
      hist: his
    }
    this.idx = idx;
    let resp: any[] = [];
    this.sub.push(this.hs.delete(this.histForm)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          resp = dados;
        },
        error: (err) => {
          this.ms.add({
            key: 'principal',
            severity: 'warn',
            summary: resp[1],
            detail: resp[2]
          });
          console.error(err);
        },
        complete: () => {
          if (resp[0]) {
            this.ms.add({
              key: 'principal',
              severity: 'success',
              summary: 'ANDAMENTO',
              detail: resp[1],
            });
            this.his.slice(this.idx, 1);
            this.hisI.slice(this.idx, 1);
            this.historico.hist.slice(this.idx, 1);
            this.dadosChange.emit(this.historico);
          } else {
            this.ms.add({
              key: 'principal',
              severity: 'warn',
              summary: resp[1],
              detail: resp[2]
            });
          }

        }
      })
    );
  }

  onHide() {
    if (this.histForm.acao === 'incluir') {
      this.hisI.push(<HistI>this.escolheTipoImpressao(this.histForm.hist));
      this.his.push(<HistI>this.escolheTipo(this.histForm.hist));
      this.historico.hist.push(this.histForm.hist);
      this.dadosChange.emit(this.historico);
    }
    if (this.histForm.acao === 'alterar') {
      this.hisI.splice(this.idx,1,<HistI>this.escolheTipoImpressao(this.histForm.hist));
      this.his.splice(this.idx,1,<HistI>this.escolheTipo(this.histForm.hist));
      this.historico.hist.splice(this.idx,1,this.histForm.hist);
      this.dadosChange.emit(this.historico);
    }
  }

  ngOnDestroy(): void {
    this.side = false;
    this.sub.forEach(s => s.unsubscribe());
  }

}
