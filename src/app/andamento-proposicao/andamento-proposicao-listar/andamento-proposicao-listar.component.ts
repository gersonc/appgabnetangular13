import {
  Component,
  ElementRef,
  EventEmitter,
  Input, OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {WindowsService} from "../../_layout/_service";
import {AuthenticationService} from "../../_services";
import {MsgService} from "../../_services/msg.service";
import {Router} from "@angular/router";
import {
  AndamentoProposicaoFormI,
  AndamentoProposicaoI,
  AndPropI
} from "../../proposicao/_models/andamento-proposicao-i";
import {ConfirmationService, SelectItem} from "primeng/api";
import {AndamentoProposicaoService} from "../../proposicao/_services/andamento-proposicao.service";
import {Subscription} from "rxjs";
import {take} from "rxjs/operators";
import {HistFormI} from "../../hist/_models/hist-i";
import {Table} from "primeng/table/table";
import {Stripslashes} from "../../shared/functions/stripslashes";
import {ProposicaoListarI} from "../../proposicao/_models/proposicao-listar-i";


@Component({
  selector: 'app-andamento-proposicao-listar',
  templateUrl: './andamento-proposicao-listar.component.html',
  styleUrls: ['./andamento-proposicao-listar.component.css'],
  providers: [ConfirmationService]
})
export class AndamentoProposicaoListarComponent implements OnInit, OnDestroy {
  @ViewChild('tbl', { static: true }) tbl: Table;
  @Output() dialogExterno = new EventEmitter<boolean>();
  @Output() novoRegistro = new EventEmitter<ProposicaoListarI>();
  @Output() displayChange = new EventEmitter<boolean>();
  @Input() display: boolean = false;
  @Input() proposicao: ProposicaoListarI;
  @Input() idx: number;

  resp: [boolean, string, string] = [false,'',''];
  sub: Subscription[] = [];
  altura = `${WindowsService.altura - 180}` + 'px';
  meiaAltura = `${(WindowsService.altura - 210) / 2}` + 'px';
  cols: any[] = [];
  andexp: AndamentoProposicaoI | null = null;
  form: AndamentoProposicaoI | null = null;
  sortField?: string = 'andamento_proposicao_id';
  botaoEnviarVF = false;
  totalRecords = 0;
  msg = 'Deseja excluir permanetemente esta proposição?';
  permitirAcao = false;
  permitirAlterar = false;
  permitirApagar = false;
  permitirIncluir = false;
  displayDelete = false;
  btnIdx = '';
  // idx = -1;
  andamento_proposicao_proposicao_id: number;
  andamento: AndamentoProposicaoI | null = null;

  imprimir = false;
  showForm = false;
  acao = 'alterar';

  constructor(
    public aut: AuthenticationService,
    private ms: MsgService,
    private cf: ConfirmationService,
    private router: Router,
    public aps: AndamentoProposicaoService
  ) { }


  ngOnInit(): void {
    console.log('proposicao', this.proposicao);
    this.permitirAcao = (this.aut.andamentoproposicao_alterar || this.aut.andamentoproposicao_apagar || this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn);
    this.permitirAlterar = (this.aut.andamentoproposicao_alterar || this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn);
    this.permitirApagar = (this.aut.andamentoproposicao_apagar || this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn);
    this.permitirIncluir = (this.aut.andamentoproposicao_incluir || this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn);
    this.montaColunas();
  }


  montaColunas() {
    this.andamento_proposicao_proposicao_id = +this.proposicao.proposicao_id;
    this.cols = [
      {field: 'andamento_proposicao_data', header: 'DATA', sortable: 'true', width: '90px'},
      {field: 'andamento_proposicao_situacao_nome', header: 'SITUAÇÃO', sortable: 'true', width: '275px'},
      {field: 'andamento_proposicao_orgao_nome', header: 'ORGÃO ATUAL', sortable: 'true', width: '275px'},
      {field: 'andamento_proposicao_relator_atual', header: 'RELATOR ATUAL', sortable: 'true', width: '250px'},
      {field: 'andamento_proposicao_texto', header: 'ANDAMENTO', sortable: 'true', width: '860px'},
    ];
  }



  editar(rowData, rowIndex) {
      const a: AndamentoProposicaoI = rowData;
      this.andamento = this.proposicao.andamento_proposicao[rowIndex];
      this.andexp = a;
      this.form = rowData;
      this.showForm = true;
  }

  confirm(event: Event, excluir_id: number, idx: number) {
    this.cf.confirm({
      target: event.target,
      message: 'Deseja excluir este andamento?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.sub.push(this.aps.apagar(excluir_id)
          .pipe(take(1))
          .subscribe({
            next: (dados: [boolean, string, string]) => {
              this.resp = dados;
            },
            error: (err) => {
              this.ms.add({
                key: 'toastprincipal',
                severity: 'warn',
                summary: this.resp[1],
                detail: err + " - Ocorreu um erro."
              });
              console.error(err);
            },
            complete: () => {
              if (this.resp[0]) {
                this.ms.add({
                  key: 'toastprincipal',
                  severity: 'success',
                  summary: 'ANDAMENTO',
                  detail: this.resp[1],
                });
                this.proposicao.andamento_proposicao.splice(idx,1);
                this.tbl.reset();
                const i: number = this.proposicao.andamento_proposicao.length;
                if (i === 0) {
                  this.proposicao.andamento_proposicao_relator_atual = null;
                  this.proposicao.proposicao_orgao_id = null;
                  this.proposicao.proposicao_orgao_nome = null;
                  this.proposicao.andamento_proposicao_texto = null;
                  this.proposicao.andamento_proposicao_texto_delta = null;
                  this.proposicao.andamento_proposicao_texto_texto = null;
                  this.proposicao.andamento_proposicao_data = null;
                  this.proposicao.andamento_proposicao_id = null;
                  this.novoRegistro.emit(this.proposicao);
                  this.fechar();
                } else {
                  const j = i - 1;
                  const a = this.proposicao.andamento_proposicao[j];
                  this.proposicao.andamento_proposicao_relator_atual = a.andamento_proposicao_relator_atual;
                  this.proposicao.proposicao_orgao_id = a.andamento_proposicao_orgao_id;
                  this.proposicao.proposicao_orgao_nome = a.andamento_proposicao_orgao_nome;
                  this.proposicao.proposicao_situacao_id = a.andamento_proposicao_situacao_id;
                  this.proposicao.proposicao_situacao_nome = a.andamento_proposicao_situacao_nome;
                  this.proposicao.andamento_proposicao_texto = a.andamento_proposicao_texto;
                  this.proposicao.andamento_proposicao_texto_delta = a.andamento_proposicao_texto_delta;
                  this.proposicao.andamento_proposicao_texto_texto = a.andamento_proposicao_texto_texto;
                  this.proposicao.andamento_proposicao_data = a.andamento_proposicao_data;
                  this.proposicao.andamento_proposicao_id = +a.andamento_proposicao_id;
                  this.novoRegistro.emit(this.proposicao);
                }
              } else {
                this.ms.add({
                  key: 'toastprincipal',
                  severity: 'warn',
                  summary: this.resp[1],
                  detail: this.resp[2]
                });
              }

            }
          })
        );

      }
    });
  }

  incluir() {
    this.acao = 'incluir';
    this.showForm = true;
  }

  fechar() {
    this.dialogExterno.emit(false);
    this.displayChange.emit(false);
  }

  apListarChange2(ev: ProposicaoListarI[]) {
    this.proposicao.andamento_proposicao = ev;
  }

  fecharTgl() {
    document.getElementById(this.btnIdx).click();
  }

  onRowExpand(ev: any) {
    console.log('onRowExpand',ev);
  }

  onColReorder(ev: any) {

  }

  onRowCollapse(ev: any) {

  }

  stripslashes(str?: string): string | null {
    return Stripslashes(str)
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
