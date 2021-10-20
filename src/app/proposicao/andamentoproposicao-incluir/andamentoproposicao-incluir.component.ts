import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { take } from 'rxjs/operators';
import { SelectItem, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DropdownService, UrlService } from '../../_services';
import { AuthenticationService, CarregadorService } from '../../_services';
import { AndamentoProposicaoService } from '../_services';
import { DropdownnomeidClass } from '../../_models';

@Component({
  selector: 'app-andamentoproposicao-incluir',
  templateUrl: './andamentoproposicao-incluir.component.html',
  styleUrls: ['./andamentoproposicao-incluir.component.css']
})
export class AndamentoproposicaoIncluirComponent implements OnInit {
  formProp: FormGroup;
  ddProposicao_situacao_id: SelectItem[];
  ddProposicao_orgao_id: SelectItem[];
  mostraModulo = 'none';
  ptBr: any;
  resp: any[];
  botaoEnviarVF = false;
  proposicao_id = 0;
  contador = 0;


  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private formBuilder: FormBuilder,
    private dd: DropdownService,
    private cs: CarregadorService,
    private messageService: MessageService,
    private location: Location,
    private aut: AuthenticationService,
    private aps: AndamentoProposicaoService
  ) { }

  ngOnInit() {
    if (this.config.data.proposicao_id) {
      this.proposicao_id = this.config.data.proposicao_id;
      this.aps.criarAndamentoProposicao();
    } else {
      this.proposicao_id = this.aps.ap.andamento_proposicao_proposicao_id;
    }
    this.carregaDropdownSessionStorage();
    this.configuraCalendario();
    this.criaForm();
  }

  // ***     FORMULARIO      *************************
  criaForm() {
    this.formProp = this.formBuilder.group({
      andamento_proposicao_data: [this.aps.ap.andamento_proposicao_data],
      andamento_proposicao_relator_atual: [this.aps.ap.andamento_proposicao_relator_atual],
      andamento_proposicao_orgao_id: [this.aps.ap.andamento_proposicao_orgao_id],
      andamento_proposicao_situacao_id: [this.aps.ap.andamento_proposicao_situacao_id],
      andamento_proposicao_texto: [this.aps.ap.andamento_proposicao_texto],
      sn_relator_atual: [true],
      sn_orgao: [true],
      sn_situacao: [true]
    });
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

  focus(event) {
    this.mostraModulo = 'inline-block';
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

  resetForm() {
    this.formProp.reset();
    this.aps.resetAndamentoProposicao();
    this.aps.ap.andamento_proposicao_proposicao_id = this.proposicao_id;
    this.botaoEnviarVF = false;
    this.cs.escondeCarregador();
  }

  criaAndamentoProposicao() {
    this.aps.ap.andamento_proposicao_proposicao_id = this.proposicao_id;
    this.aps.ap.andamento_proposicao_data = this.formProp.get('andamento_proposicao_data').value;
    if (this.formProp.get('andamento_proposicao_texto').dirty) {
      this.contador++;
      this.aps.ap.andamento_proposicao_texto = this.formProp.get('andamento_proposicao_texto').value;
    }
    if (this.formProp.get('andamento_proposicao_relator_atual').dirty) {
      this.contador++;
      this.aps.ap.andamento_proposicao_relator_atual = this.formProp.get('andamento_proposicao_relator_atual').value;
    }
    if (this.formProp.get('andamento_proposicao_orgao_id').dirty) {
      this.contador++;
      this.aps.ap.andamento_proposicao_orgao_id = this.formProp.get('andamento_proposicao_orgao_id').value;
    }
    if (this.formProp.get('andamento_proposicao_situacao_id').dirty) {
      this.contador++;
      this.aps.ap.andamento_proposicao_situacao_id = this.formProp.get('andamento_proposicao_situacao_id').value;
    }
    this.aps.ap.sn_relator_atual = this.formProp.get('sn_relator_atual').value;
    this.aps.ap.sn_orgao = this.formProp.get('sn_orgao').value;
    this.aps.ap.sn_situacao = this.formProp.get('sn_situacao').value;
  }

  incluirAndamentoProposicao() {
    this.botaoEnviarVF = true;
    this.criaAndamentoProposicao();
    if (this.contador > 0) {
      this.cs.mostraCarregador();
      this.aps.postAndamentoProposicaoIncluir(this.aps.filtraAndamentoProposicao())
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: (err) => {
            this.botaoEnviarVF = true;
            this.cs.escondeCarregador();
            this.messageService.add({ key: 'andamentoProposicaoToast', severity: 'warn', summary: 'ERRO INCLUIR', detail: this.resp[2] });
            console.log(err);
          },
          complete: () => {
            if (this.resp[0]) {
              this.messageService.add({
                key: 'andamentoProposicaoToast',
                severity: 'success',
                summary: 'INCLUIR PROPOSIÇÃO',
                detail: this.resp[2]
              });
              this.resetForm();
            } else {
              this.botaoEnviarVF = false;
              this.cs.escondeCarregador();
              console.error('ERRO - INCLUIR ', this.resp[2]);
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

  fechar() {
    this.ref.close ();
  }

  onBlockSubmit(ev: boolean) {
    this.botaoEnviarVF = ev;
  }

  onNovoRegistroAux(ev) {
    if (ev.campo === 'andamento_proposicao_situacao_id') {
      this.ddProposicao_situacao_id = ev.dropdown;
    }
    if (ev.campo === 'andamento_proposicao_orgao_id') {
      this.ddProposicao_orgao_id = ev.dropdown;
    }
    this.formProp.get(ev.campo).patchValue(ev.valorId);
  }
}
