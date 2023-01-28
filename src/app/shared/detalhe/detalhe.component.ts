import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges
} from '@angular/core';
import {SolicListarI} from "../../solic/_models/solic-listar-i";
import {AuthenticationService} from "../../_services";
import {VersaoService} from "../../_services/versao.service";
import {DetalheService} from "./_services/detalhe.service";
import {Stripslashes} from "../functions/stripslashes";
import {OficioListarI} from "../../oficio/_models/oficio-listar-i";
import {ProceListarI} from "../../proce/_model/proce-listar-i";
import {EmendaListarI} from "../../emenda/_models/emenda-listar-i";
import {ProposicaoListarI} from "../../proposicao/_models/proposicao-listar-i";
import {TarefaI} from "../../tarefa/_models/tarefa-i";
import {ContaI} from "../../conta/_models/conta-i";
import {CadastroI} from "../../cadastro/_models/cadastro-i";
import {DetalhersService} from "./_services/detalhers.service";
import {Subscription} from "rxjs";
import {take} from "rxjs/operators";
import {Router} from "@angular/router";
import {EventoInterface} from "../../calendario/_models/evento-interface";
import {EventoEstiloI} from "../../calendario/_models/evento-estilo-i";

@Component({
  selector: 'app-detalhe',
  templateUrl: './detalhe.component.html',
  styleUrls: ['./detalhe.component.css']
})
export class DetalheComponent implements OnInit, OnDestroy, OnChanges {
  @Input() id: number;
  @Input() modulo: string | null = null;
  @Output() fechaDetalhe = new EventEmitter<boolean>();

  sub: Subscription[] = [];

  sol?: SolicListarI | null = null;
  oficio?: OficioListarI | null = null;
  pro?: ProceListarI | null = null;
  emenda?: EmendaListarI | null = null;
  proposicao?: ProposicaoListarI | null = null;
  tarefa?: TarefaI | null = null;
  conta?: ContaI | null = null;
  cadastro?: CadastroI | null = null;
  calendario?: EventoInterface | null;
  evstl?: EventoEstiloI | null;

  dialog = false;
  mostraDetalhe = false;

  vSolicitacao = false;
  vOficio = false;
  vProcesso = false;
  vEmenda = false;
  vProposicao = false;
  vTarefa = false;
  vConta = false;
  vCadastro = false;
  vCalendario = false;


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
    public ds: DetalheService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    console.log('DETALHE..................');
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.id || changes.modulo) {
      if (this.id !== undefined && this.id !== null && this.modulo !== undefined && this.modulo !== null) {
        this.getDetalhe();
      }
    }
  }

  getDetalhe() {
    this.sub.push(this.ds.getBusca(this.modulo, this.id)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          switch (this.modulo) {
            case 'calendario': {
              this.calendario = dados;
              this.criaEvento(dados);
              this.vCalendario = true;
              break;
            }
            case 'tarefa': {
              this.tarefa = dados
              this.vTarefa = true;
              break;
            }
            case 'solicitacao': {
              this.sol = dados
              this.vSolicitacao = true;
              break;
            }
            case 'oficio': {
              this.oficio = dados
              this.vOficio = true;
              break;
            }
            case 'processo': {
              this.pro = dados
              this.vProcesso = true;
              break;
            }
            case 'emenda': {
              this.emenda = dados
              this.vEmenda = true;
              break;
            }
            case 'proposicao': {
              this.proposicao = dados
              this.vProposicao = true;
              break;
            }
            case 'conta': {
              this.conta = dados
              this.vConta = true;
              break;
            }
            case 'cadastro': {
              this.cadastro = dados
              this.vCadastro = true;
              break;
            }
          }
          console.log('dados', dados);
        },
        error: err => console.error('ERRO-->', err),
        complete: () => {
          this.dialog = true;
          this.mostraDetalhe = true;
        }
      })
    );
  }

  fechar() {
    this.dialog = false;
    this.mostraDetalhe = false;

  }

  stripslashes(str?: string): string | null {
    return Stripslashes(str)
  }

  criaEvento(dados: EventoInterface) {
    console.log('criaEvento', dados);
    this.calendario.description = Stripslashes(this.calendario.description);
    this.evstl.prioridadeStyle = null;
    this.evstl.calendarioStatusStyle = null;
    this.evstl.tipoStyle = null;
    if (this.calendario.backgroundColor === undefined) {
      this.calendario.backgroundColor = 'var(--primary-color)';
    }
    if (this.calendario.borderColor === undefined) {
      this.calendario.borderColor = 'transparent';
    }
    this.evstl.tituloEstilo = {
      backgroundColor: this.calendario.backgroundColor,
      color: this.calendario.textColor,
      borderColor: this.calendario.borderColor,
    };
    this.evstl.subTituloStyle = {
      backgroundColor: this.calendario.backgroundColor,
      color: this.calendario.textColor,
      borderColor: this.calendario.borderColor,
    };
    this.evstl.subTituloStyleLink = {
      backgroundColor: this.calendario.backgroundColor,
      color: this.calendario.textColor,
      borderColor: this.calendario.borderColor,
      cursor: 'pointer'
    };

    if (this.calendario.prioridade_color !== undefined) {
      this.evstl.prioridadeStyle = {
        backgroundColor: this.calendario.prioridade_color,
        color: this.getContrastYIQ(this.calendario.prioridade_color)
      };
    } else {
      this.evstl.prioridadeStyle = this.evstl.subTituloStyle;
    }


    if (this.calendario.calendario_status_color !== undefined) {
      this.evstl.calendarioStatusStyle = {
        backgroundColor: this.calendario.calendario_status_color,
        color: this.getContrastYIQ(this.calendario.calendario_status_color)
      };
    } else {
      this.evstl.calendarioStatusStyle = this.evstl.subTituloStyle;
    }


    if (this.calendario.type_color !== undefined) {
      this.evstl.tipoStyle = {
        backgroundColor: this.calendario.type_color,
        color: this.getContrastYIQ(this.calendario.type_color)
      };
    } else {
      this.evstl.tipoStyle = this.evstl.subTituloStyle;
    }


    if (this.calendario.local_color !== undefined) {
      this.evstl.localStyle = {
        backgroundColor: this.calendario.local_color,
        color: this.getContrastYIQ(this.calendario.local_color)
      };
    } else {
      this.evstl.tipoStyle = this.evstl.subTituloStyle;
    }

    /*if (this.calendario.modulo !== undefined) {
      this.modulo = this.calendario.modulo;
      this.calendario.registro_id = this.calendario.registro_id;
    }*/


  }

  getContrastYIQ(hexcolor) {
    hexcolor = hexcolor.replace('#', '');
    const r = parseInt(hexcolor.substring(0, 2), 16);
    const g = parseInt(hexcolor.substring(2, 2), 16);
    const b = parseInt(hexcolor.substring(4, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
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

  escondeDetalhe() {
    console.log('escondeDetalhe');
    this.fechaDetalhe.emit(true);
  }

  navegar() {
    this.router.navigate([this.modulo]);
  }

  ngOnDestroy() {
    console.log('ngOnDestroy');
    this.vSolicitacao = false;
    this.vOficio = false;
    this.vProcesso = false;
    this.vEmenda = false;
    this.vProposicao = false;
    this.vTarefa = false;
    this.vConta = false;
    this.vCadastro = false;

    delete this.sol;
    delete this.oficio;
    delete this.pro;
    delete this.emenda;
    delete this.proposicao;
    delete this.tarefa;
    delete this.conta;
    delete this.cadastro;
    delete this.dialog;
  }

}
