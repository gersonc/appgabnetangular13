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
import {HistAuxService} from "../_services/hist-aux.service";

@Component({
  selector: 'app-hist-datatable',
  templateUrl: './hist-datatable.component.html',
  styleUrls: ['./hist-datatable.component.css']
})
export class HistDatatableComponent implements OnInit, OnDestroy {
  @ViewChild('tb', { static: false }) tb!: ElementRef;
  @Output() escondeDialog = new EventEmitter<boolean>();
  @Output() novoRegistro = new EventEmitter<HistFormI>();
  @Input() display: boolean = false;
  @Output() displayChange = new EventEmitter<boolean>();
  @Input() imprimir?: boolean = false;
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
  // histForm: HistFormI | null = null;
  // histForm: HistFormI = {};
  displayForm = true;
  idx = 0;
  cssEsconde = 'p-mr-2';
  cssEsconde2 = null;
  // side = false;
  //  mostraBotao = true;

  constructor(
    private aut: AuthenticationService,
    private hs: HistService,
    private ms: MessageService,
    public has: HistAuxService
  ) { }

  ngOnInit(): void {
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
    this.displayChange.emit(false);
  }

  mostraBts(vf: boolean) {
    console.log('mostraBts', this.displayForm);
    this.escondeDialog.emit(vf);
    this.displayForm = vf;
    this.cssEsconde = (this.displayForm) ? 'p-mr-2' : 'p-d-none';
    this.cssEsconde2 = (this.displayForm) ? null : 'p-d-none';
  }

  recebeRegistro(h: HistFormI) {
    if (h.acao === 'incluir') {
      this.has.histListI.hist.push(h.hist);
      this.novoRegistro.emit(h);
    }

  }

  /*get mostraBts(): boolean {
    return this.displayForm;
  }*/


/*  ngOnChanges(changes: SimpleChanges) {
    if (changes.imprimir) {
      if (this.imprimir) {
        this.mandaTabela();
      }
    }
    if (changes.dados.currentValue !== null) {
      // this.his = this.dados;

      // this.his = [...this.transformaDados(changes.dados.currentValue.hist)];
      this.hisI = [...this.transformaDadosImpressao(changes.dados.currentValue)];
      // this.historico = this.dados;
    }
    if (changes.classeStylos) {
      this.estilo = changes.classeStylos.currentValue;
    }
    console.log('HistDatatableComponent',this.his, this.has.histListI);
  }*/

/*
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
*/


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

  /*onIncluir() {
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
  }*/

  /*onAlterar(his: HistI, idx: number) {
    this.histForm = {
      acao: 'alterar',
      modulo: this.modulo,
      hist: his
    }
    this.idx = idx;
    this.displayForm = true;
    this.side = true;
  }*/


  /*onApagar(his: HistI, idx: number) {
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
            this.historico.slice(this.idx, 1);
            // this.dadosChange.emit(this.historico);
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
  }*/

  /*onHide() {
    if (this.histForm.acao === 'incluir') {
      this.hisI.push(<HistI>this.escolheTipoImpressao(this.histForm.hist));
      // this.his.push(<HistI>this.escolheTipo(this.histForm.hist));
      this.historico.push(this.histForm.hist);
      // this.dadosChange.emit(this.historico);
    }
    if (this.histForm.acao === 'alterar') {
      this.hisI.splice(this.idx,1,<HistI>this.escolheTipoImpressao(this.histForm.hist));
      // this.his.splice(this.idx,1,<HistI>this.escolheTipo(this.histForm.hist));
      this.historico.splice(this.idx,1,this.histForm.hist);
      // this.dadosChange.emit(this.historico);
    }
  }*/

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

  mudaI(i: number): string {
    this.idx = i;
    return '';
  }
}