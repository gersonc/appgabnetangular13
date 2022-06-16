import {
  Component,
  ElementRef,
  EventEmitter,
  Input, OnChanges,
  OnInit,
  Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import {HistFormI, HistI, HistListI} from "../_models/hist-i";
import {AuthenticationService} from "../../_services";
import {HistAuxService} from "../_services/hist-aux.service";

@Component({
  selector: 'app-hist-datatable',
  templateUrl: './hist-datatable.component.html',
  styleUrls: ['./hist-datatable.component.css']
})
export class HistDatatableComponent implements OnInit, OnChanges {
  @ViewChild('tb', { static: false }) tb!: ElementRef;
  @Output() dialogExterno = new EventEmitter<boolean>();
  @Output() novoRegistro = new EventEmitter<HistFormI>();

  @Output() displayChange = new EventEmitter<boolean>();
  @Input() display: boolean = false;
  // @Input() modulo: string;
  @Input() imprimir?: boolean;
  // @Input() idx?: number | undefined;
  @Input() histListI?: HistListI | undefined;
  @Output() impressao = new EventEmitter<any>();


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
  registro_id: number = 0;

  constructor(
    private aut: AuthenticationService,
    public has: HistAuxService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    this.modulo = this.histListI.modulo;
    this.registro_id = this.histListI.registro_id;
    this.idx = this.idx;
    if(this.histListI.modulo === 'solicitacao') {
      // this.modulo = 'solicitacao';
      this.caption = 'ANDAMENTOS DA SOLICITAÇÃO';
      this.incluir = this.aut.historico_solicitacao_incluir;
      this.alterar = this.aut.historico_solicitacao_alterar;
      this.apagar = this.aut.historico_solicitacao_apagar;
    } else {
      // this.modulo = 'processo'
      this.caption = 'ANDAMENTOS DO PROCESSO';
      this.incluir = this.aut.historico_incluir;
      this.alterar = this.aut.historico_alterar;
      this.apagar = this.aut.historico_apagar;
    }
  }

  ngOnInit(): void {
    // this.idx = this.has.histListI.idx;

  }

  fechar() {
    this.dialogExterno.emit(false);
    this.displayChange.emit(false);
  }

  dialogExternoSN(vf: boolean) {
    this.dialogExterno.emit(vf);
  }

  recebeRegistro(h: HistFormI) {
    const n: number = h.idx;
    h.idx = this.idx;
    if (h.acao === 'incluir') {
      this.histListI.hist.push(h.hist);
    }
    if (h.acao === 'alterar') {
      this.histListI.hist.splice(h.idx, 1, h.hist);
    }
    this.novoRegistro.emit(h);
  }

  formMostra(acao: string) {

  }

  onExcluir(n: number[]) {
    const e: HistFormI = {
      modulo: this.modulo,
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

  mudaI(i: number): string {
    // this.idx = i;
    return '';
  }
}
