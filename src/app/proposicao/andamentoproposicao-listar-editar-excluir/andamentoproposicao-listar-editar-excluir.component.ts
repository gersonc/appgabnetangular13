import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService, ConfirmationService, SelectItem } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import {
  AndamentoProposicaoFormulario,
  AndamentoProposicaoFormularioInterface,
  AndamentoProposicaoListagemInterface,
  ProposicaoBuscaCampoInterface
} from '../_models';
import { WindowsService } from '../../_layout/_service';
import { DropdownService } from '../../_services';
import { AuthenticationService, CarregadorService } from '../../_services';
import { Location } from '@angular/common';
import { AndamentoProposicaoService } from '../_services';
import { DropdownnomeidClass } from '../../_models';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-andamentoproposicao-listar-editar-excluir',
  templateUrl: './andamentoproposicao-listar-editar-excluir.component.html',
  styleUrls: ['./andamentoproposicao-listar-editar-excluir.component.css']
})
export class AndamentoproposicaoListarEditarExcluirComponent implements OnInit {
  @ViewChild('dtap', { static: true }) public dtap: any;
  altura = `${WindowsService.altura - 180}` + 'px';
  meiaAltura = `${(WindowsService.altura - 210) / 2}` + 'px';
  mostraSeletor = false;
  camposSelecionados: ProposicaoBuscaCampoInterface[];
  loading = false;
  cols: any[];
  selectedColumns: any[] = [];
  andamento_proposicao: AndamentoProposicaoListagemInterface[];
  old: {[n: number]: AndamentoProposicaoFormularioInterface; } = {};
  novo: AndamentoProposicaoListagemInterface = null;
  proposicao_id: number;

  ddProposicao_situacao_id: SelectItem[];
  ddProposicao_orgao_id: SelectItem[];
  mostraModulo = 'none';
  ptBr: any;
  resp: any[];
  botaoEnviarVF = false;
  contador = 0;
  editing = false;
  styleExpr = '';
  modulos: any;
  toolbarEditor = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['clean'],                                         // remove formatting button
    ['link']                         // link and image, video
  ];

  rowData: AndamentoProposicaoListagemInterface = null;


  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private dd: DropdownService,
    private cs: CarregadorService,
    private messageService: MessageService,
    private location: Location,
    public aut: AuthenticationService,
    public aps: AndamentoProposicaoService,
    private cf: ConfirmationService
  ) { }

  ngOnInit() {
    this.modulos = {
      toolbar: this.toolbarEditor
    };
    this.andamento_proposicao = this.config.data.andamentos;
    this.proposicao_id = this.config.data.andamentos[0].andamento_proposicao_proposicao_id;
    this.carregaDropdownSessionStorage();
    this.configuraCalendario();
  }

  configuraCalendario() {
    this.ptBr = {
      firstDayOfWeek: 1,
      dayNames: ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
      dayNamesShort: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'],
      dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
      monthNames: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'septembro',
        'outubro', 'novembro', 'dezembro'],
      monthNamesShort: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
      today: 'Hoje',
      clear: 'Limpar',
      dateFormat: 'dd/mm/yy'
    };
  }

  carregaDropdownSessionStorage() {
    const ddNomeIdArray = new DropdownnomeidClass();
    let ct = 0;
    if (!sessionStorage.getItem('dropdown-orgao_proposicao')) {
      ddNomeIdArray.add('ddProposicao_orgao_id', 'orgao_proposicao', 'orgao_proposicao_id', 'orgao_proposicao_nome');
      ct++;
    } else {
      this.ddProposicao_orgao_id = JSON.parse(sessionStorage.getItem('dropdown-orgao_proposicao'));
    }
    if (!sessionStorage.getItem('dropdown-situacao_proposicao')) {
      ddNomeIdArray.add('ddProposicao_situacao_id', 'situacao_proposicao', 'situacao_proposicao_id', 'situacao_proposicao_nome');
      ct++;
    } else {
      this.ddProposicao_situacao_id = JSON.parse(sessionStorage.getItem('dropdown-situacao_proposicao'));
    }
    if (ct > 0) {
      this.dd.postDropdownNomeIdArray(ddNomeIdArray.get())
        .pipe(take(1))
        .subscribe(dados => {
            if (dados['ddProposicao_situacao_id']) {
              this.ddProposicao_situacao_id = dados['ddProposicao_situacao_id'];
              sessionStorage.setItem('dropdown-situacao_proposicao', JSON.stringify(dados['ddProposicao_situacao_id']));
            }
            if (dados['ddProposicao_orgao_id']) {
              dados['ddProposicao_orgao_id'].unshift({ label: 'NENHUM', value: 0 });
              this.ddProposicao_orgao_id = dados['ddProposicao_orgao_id'];
              sessionStorage.setItem('dropdown-orgao_proposicao', JSON.stringify(dados['ddProposicao_orgao_id']));
            }
          },
          (error1) => {
            console.log('erro');
          },
          () => {
            this.cs.escondeCarregador();
          }
        );
    } else {
      this.cs.escondeCarregador();
    }
  }

  onNovoRegistroAux(ev) {
    if (ev.campo === 'andamento_proposicao_situacao_id') {
      this.ddProposicao_situacao_id = ev.dropdown;
    }
    if (ev.campo === 'andamento_proposicao_orgao_id') {
      this.ddProposicao_orgao_id = ev.dropdown;
    }
  }

  onBlockSubmit(ev: boolean) {
    this.botaoEnviarVF = ev;
  }

  focus(event) {
    this.mostraModulo = 'inline-block';
  }

  fechar() {
    this.ref.close ();
  }

  onRowExpand(event): void {
    this.rowData = event.data;
    console.log("rowData", this.rowData);
  }

  onRowEditInit(prop: AndamentoProposicaoListagemInterface) {
    this.styleExpr = '10rem';
    this.old[prop.andamento_proposicao_id] = {...prop};
  }

  onDelete(prop: AndamentoProposicaoListagemInterface, index: number) {
    this.botaoEnviarVF = true;
    this.cf.confirm({
      message: 'Confirma exclusão?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onRowDelete(prop, index);
      },
      reject: () => {
        this.botaoEnviarVF = false;
        console.log('rejeitado');
      }
    });
  }

  onRowDelete(prop: AndamentoProposicaoListagemInterface, index: number) {
    this.styleExpr = '';
    this.botaoEnviarVF = true;
    this.aps.deleteAndamentoProposicao(prop.andamento_proposicao_id, this.proposicao_id)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.resp = dados;
        },
        error: (err) => {
          this.novo = null;
          this.botaoEnviarVF = false;
          this.cs.escondeCarregador();
          this.messageService.add({ key: 'andamentoProposicaoToast', severity: 'warn', summary: 'ERRO EXCLUIR', detail: this.resp[2] });
          console.log(err);
        },
        complete: () => {
          this.botaoEnviarVF = false;
          this.cs.escondeCarregador();
          if (this.resp[0]) {
            this.andamento_proposicao = this.resp[3];
            this.messageService.add({
              key: 'andamentoProposicaoToast',
              severity: 'success',
              summary: 'EXCLUIR ANDAMENTO',
              detail: this.resp[2]
            });
          } else {
            this.botaoEnviarVF = false;
            console.error('ERRO - EXCLUIR ', this.resp[2]);
            this.messageService.add({
              key: 'andamentoProposicaoToast',
              severity: 'warn',
              summary: 'ATENÇÃO - ERRO',
              detail: this.resp[2]
            });
          }
        }
      });
  }

  onRowEditSave(prop: AndamentoProposicaoListagemInterface, index: number) {
    this.styleExpr = '';
    this.criaAndamentoProposicao(prop);
    if (this.contador > 0) {
      this.botaoEnviarVF = true;
      this.cs.mostraCarregador();
      this.aps.putAndamentoProposicaoAlterar(this.aps.filtraAndamentoProposicao())
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: (err) => {
            this.novo = null;
            this.botaoEnviarVF = false;
            this.andamento_proposicao[index] = this.old[prop.andamento_proposicao_id];
            delete this.old[prop.andamento_proposicao_id];
            this.novo = null;
            this.cs.escondeCarregador();
            this.messageService.add({ key: 'andamentoProposicaoToast', severity: 'warn', summary: 'ERRO ALTERAR', detail: this.resp[2] });
            console.log(err);
          },
          complete: () => {
            this.botaoEnviarVF = false;
            this.cs.escondeCarregador();
            if (this.resp[0]) {
              this.andamento_proposicao[index] = this.novo;
              delete this.old[prop.andamento_proposicao_id];
              this.novo = null;
              this.messageService.add({
                key: 'andamentoProposicaoToast',
                severity: 'success',
                summary: 'ALTERAR ANDAMENTO',
                detail: this.resp[2]
              });
            } else {
              this.andamento_proposicao[index] = this.old[prop.andamento_proposicao_id];
              delete this.old[prop.andamento_proposicao_id];
              this.novo = null;
              this.botaoEnviarVF = false;
              console.error('ERRO - ALTERAR ', this.resp[2]);
              this.messageService.add({
                key: 'andamentoProposicaoToast',
                severity: 'warn',
                summary: 'ATENÇÃO - ERRO',
                detail: this.resp[2]
              });
            }
          }
        });
    }
  }

  onRowEditCancel(prop: AndamentoProposicaoListagemInterface, index: number) {
    this.botaoEnviarVF = false;
    this.styleExpr = '';
    this.andamento_proposicao[index] = this.old[prop.andamento_proposicao_id];
    delete this.old[prop.andamento_proposicao_id];
  }

  criaAndamentoProposicao(prop: AndamentoProposicaoListagemInterface) {
    this.contador = 0;
    this.novo = prop;
    this.aps.criarAndamentoProposicao();
    const id = +prop.andamento_proposicao_id;
    if (this.old[id].andamento_proposicao_data !== prop.andamento_proposicao_data) {
      this.aps.ap.andamento_proposicao_data = prop.andamento_proposicao_data;
      this.novo.andamento_proposicao_data = prop.andamento_proposicao_data;
      this.contador++;
    } else {
      this.aps.ap.andamento_proposicao_data = null;
    }

    if (this.old[id].andamento_proposicao_relator_atual !== prop.andamento_proposicao_relator_atual.toUpperCase()) {
      this.aps.ap.andamento_proposicao_relator_atual = prop.andamento_proposicao_relator_atual.toUpperCase();
      this.novo.andamento_proposicao_relator_atual = prop.andamento_proposicao_relator_atual.toUpperCase();
      this.contador++;
    } else {
      this.aps.ap.andamento_proposicao_relator_atual = null;
    }

    if (this.old[id].andamento_proposicao_orgao_id !== prop.andamento_proposicao_orgao_id) {
      this.aps.ap.andamento_proposicao_orgao_id = prop.andamento_proposicao_orgao_id;
      this.novo.andamento_proposicao_orgao_id = prop.andamento_proposicao_orgao_id;
      this.contador++;
    } else {
      this.aps.ap.andamento_proposicao_orgao_id = null;
    }

    if (this.old[id].andamento_proposicao_situacao_id !== prop.andamento_proposicao_situacao_id) {
      this.aps.ap.andamento_proposicao_situacao_id = prop.andamento_proposicao_situacao_id;
      this.novo.andamento_proposicao_situacao_id = prop.andamento_proposicao_situacao_id;
      this.contador++;
    } else {
      this.aps.ap.andamento_proposicao_situacao_id = null;
    }

    if (this.old[id].andamento_proposicao_texto !== prop.andamento_proposicao_texto) {
      this.aps.ap.andamento_proposicao_texto = prop.andamento_proposicao_texto;
      this.novo.andamento_proposicao_texto = prop.andamento_proposicao_texto;
      this.contador++;
    } else {
      this.aps.ap.andamento_proposicao_texto = null;
    }

    if (this.contador > 0) {
      this.aps.ap.andamento_proposicao_id = id;
    } else {
      this.novo = null;
    }
  }


}
