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
