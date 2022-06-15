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
import {AuthenticationService} from "../../_services";
import {Subscription} from "rxjs";
import {HistService} from "../_services/hist.service";
import {MessageService} from "primeng/api";
import {HistAuxService} from "../_services/hist-aux.service";

@Component({
  selector: 'app-hist-datatable',
  templateUrl: './hist-datatable.component.html',
  styleUrls: ['./hist-datatable.component.css']
})
export class HistDatatableComponent implements OnInit, OnDestroy {
  @ViewChild('tb', { static: false }) tb!: ElementRef;
  @Output() dialogExterno = new EventEmitter<boolean>();
  @Output() novoRegistro = new EventEmitter<HistFormI>();
  @Output() displayChange = new EventEmitter<boolean>();
  @Input() display: boolean = false;
  @Input() imprimir?: boolean;
  @Output() impressao = new EventEmitter<any>();

  private sub: Subscription[] = [];

  his: HistI[];
  hisI: HistI[];
  historico: HistI[];
  estilo = 'tablcomp';
  caption = 'ANDAMENTOS DA SOLICITAÇÃO';
  incluir = false;
  alterar = false;
  apagar = false;
  modulo = '';
  idx = 0;
  constructor(
    private aut: AuthenticationService,
    private hs: HistService,
    private ms: MessageService,
    public has: HistAuxService
  ) { }

  ngOnInit(): void {
    this.idx = this.has.histListI.idx;
    if(this.has.histListI.modulo === 'solicitacao') {
      this.modulo = 'solicitacao';
      this.caption = 'ANDAMENTOS DA SOLICITAÇÃO';
      this.incluir = this.aut.historico_solicitacao_incluir;
      this.alterar = this.aut.historico_solicitacao_alterar;
      this.apagar = this.aut.historico_solicitacao_apagar;
    } else {
      this.modulo = 'processo'
      this.caption = 'ANDAMENTOS DO PROCESSO';
      this.incluir = this.aut.historico_incluir;
      this.alterar = this.aut.historico_alterar;
      this.apagar = this.aut.historico_apagar;
    }
  }

  fechar() {
    this.dialogExterno.emit(false);
    this.displayChange.emit(false);
  }

  dialogExternoSN(vf: boolean) {
   // this.displayChange.emit(vf);
    this.dialogExterno.emit(vf);
  }

  recebeRegistro(h: HistFormI) {
    if (h.acao === 'incluir') {
      this.has.histListI.hist.push(h.hist);
      this.novoRegistro.emit(h);
    }
    if (h.acao === 'alterar') {
      this.novoRegistro.emit(h);
    }
  }

  onExcluir(idx: number) {
    const e: HistFormI = {
      modulo: this.has.histListI.modulo,
      acao: 'apagar',
      idx: idx,
      hist: this.has.histListI.hist[idx]
    }
    this.novoRegistro.emit(e);
    this.has.histListI.hist.splice(idx, 1);
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


  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

  mudaI(i: number): string {
    this.idx = i;
    return '';
  }
}
