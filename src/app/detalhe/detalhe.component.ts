import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges} from '@angular/core';
import {SolicListarI} from "../solic/_models/solic-listar-i";
import {AuthenticationService} from "../_services";
import {VersaoService} from "../_services/versao.service";
import {DetalheService} from "./_services/detalhe.service";
import {Stripslashes} from "../shared/functions/stripslashes";
import {OficioListarI} from "../oficio/_models/oficio-listar-i";
import {ProceListarI} from "../proce/_model/proce-listar-i";
import {EmendaListarI} from "../emenda/_models/emenda-listar-i";
import {ProposicaoListarI} from "../proposicao/_models/proposicao-listar-i";
import {TarefaI} from "../tarefa/_models/tarefa-i";
import {ContaI} from "../conta/_models/conta-i";
import {CadastroI} from "../cadastro/_models/cadastro-i";

@Component({
  selector: 'app-detalhe',
  templateUrl: './detalhe.component.html',
  styleUrls: ['./detalhe.component.css']
})
export class DetalheComponent implements OnInit, OnChanges {
  @Input() id: number;
  @Input() modulo: string | null = null;
  @Input() registro?: any = null;
  @Output() hideDetalhe = new EventEmitter<boolean>();

  sol?: SolicListarI | null = null;
  oficio?: OficioListarI | null = null;
  pro?: ProceListarI | null = null;
  emenda?: EmendaListarI | null = null;
  proposicao?: ProposicaoListarI | null = null;
  tarefa?: TarefaI | null = null;
  conta?: ContaI | null = null;
  cadastro?: CadastroI | null = null;

  vSolicitacao = false;
  vOficio = false;
  vProcesso = false;
  vEmenda = false;
  vProposicao = false;
  vTarefa = false;
  vConta = false;


  impressao = false;
  pdfOnOff = true;
  public real: Intl.NumberFormat = Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
  formatterBRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });


  constructor(
    public aut: AuthenticationService,
    public vs: VersaoService,
    public ds: DetalheService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {

  }

  fechar() {
    this.hideDetalhe.emit(true);
  }

  stripslashes(str?: string): string | null {
    return Stripslashes(str)
  }

  fcor(vl1: number): string | null {
    switch (vl1) {
      case 1:
        return 'tstatus-1';
      case 2:
        return 'tstatus-2';
      case 3:
        return 'tstatus-3';
      case 4:
        return 'tstatus-4';
      default:
        return 'tstatus-0';
    }
  }

  formataValor(n: number): string {
    return this.formatterBRL.format(n);
  }

}
