import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SelectItem} from "primeng/api";
import {Subscription} from "rxjs";
import {EmendaListarI} from "../_models/emenda-listar-i";
import {DdService} from "../../_services/dd.service";
import {AuthenticationService, MenuInternoService} from "../../_services";
import {Router} from "@angular/router";
import {MsgService} from "../../_services/msg.service";
import {EmendaFormService} from "../_services/emenda-form.service";
import {EmendaService} from "../_services/emenda.service";
import {take} from "rxjs/operators";
import {CpoEditor, InOutCampoTexto} from "../../_models/in-out-campo-texto";
import {DateTime} from "luxon";
import {EmendaForm, EmendaFormI} from "../_models/emenda-form-i";
import {EmendaAtualizar, EmendaAtualizarI} from "../_models/emenda-atualizar-i";

@Component({
  selector: 'app-emenda-atualizar',
  templateUrl: './emenda-atualisar.component.html',
  styleUrls: ['./emenda-atualisar.component.css']
})
export class EmendaAtualizarComponent implements OnInit, OnDestroy {
  formEmenda: FormGroup;
  ddEmenda_porcentagem: SelectItem[] = [];
  ddEmenda_situacao_id: SelectItem[] = [];
  ptBr: any;
  botaoEnviarVF = false;
  mostraForm = true;
  arquivoDesativado = false;
  enviarArquivos = false;
  clearArquivos = false;
  arquivo_registro_id = 0;
  emenda_id = 0;
  hj =  new Date();

  // dados: EmendaListarI;
  em: EmendaListarI = null;
  sub: Subscription[] = [];
  resp: any[];

  cpoEditor: CpoEditor[] | null = [];
  format0: 'html' | 'object' | 'text' | 'json' = 'html';
  format1: 'html' | 'object' | 'text' | 'json' = 'html';

  modulos = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
      [{'header': 1}, {'header': 2}],               // custom button values
      [{'list': 'ordered'}, {'list': 'bullet'}],
      [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
      [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
      [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
      [{'header': [1, 2, 3, 4, 5, 6, false]}],
      [{'color': []}, {'background': []}],          // dropdown with defaults from theme
      [{'font': []}],
      [{'align': []}],
      ['clean']                        // link and image, video
    ]
  };

  constructor(
    public formBuilder: FormBuilder,
    private dd: DdService,
    public mi: MenuInternoService,
    public aut: AuthenticationService,
    private router: Router,
    private ms: MsgService,
    public efs: EmendaFormService,
    public es: EmendaService
  ) { }

  ngOnInit(): void {
    this.carregaDropdownSessionStorage();
    this.criaForm();
  }

  carregaDropdownSessionStorage() {
    this.ddEmenda_situacao_id = JSON.parse(sessionStorage.getItem('dropdown-emenda_situacao'));
    for (let i = 0; i < 101; i++) {
      this.ddEmenda_porcentagem.push({label: i.toString(), value: i});
    }
  }

  criaForm() {
    this.formEmenda = this.formBuilder.group({
      emenda_situacao_id: [this.efs.emendaAt.emenda_situacao_id, Validators.required],
      emenda_contrato: [this.efs.emendaAt.emenda_contrato],
      emenda_valor_empenhado: [this.efs.emendaAt.emenda_valor_empenhado],
      emenda_data_empenho: [null],
      emenda_numero_empenho: [this.efs.emendaAt.emenda_numero_empenho],
      emenda_data_pagamento: [null],
      emenda_valor_pago: [this.efs.emendaAt.emenda_valor_pago],
      emenda_numero_ordem_bancaria: [this.efs.emendaAt.emenda_numero_ordem_bancaria],
      emenda_observacao_pagamento: [null],
      emenda_porcentagem: [this.efs.emendaAt.emenda_porcentagem],
      historico_andamento: [null]
    });
    this.getValorAlterar();
  }

  getValorAlterar() {
      if (this.efs.emendaAt.emenda_data_pagamento !== undefined && this.efs.emendaAt.emenda_data_pagamento !== null) {
        const dt0: DateTime = DateTime.fromSQL(this.efs.emendaAt.emenda_data_pagamento);
        this.formEmenda.get('emenda_data_pagamento').patchValue(dt0.toJSDate());
      }
      if (this.efs.emendaAt.emenda_data_empenho !== undefined && this.efs.emendaAt.emenda_data_empenho !== null) {
        const dt1: DateTime = DateTime.fromSQL(this.efs.emendaAt.emenda_data_empenho);
        this.formEmenda.get('emenda_data_empenho').patchValue(dt1.toJSDate());
      }
      const cp0 = InOutCampoTexto(this.efs.emendaAt.emenda_observacao_pagamento, this.efs.emendaAt.emenda_observacao_pagamento_delta);
      this.format0 = cp0.format;
      if (cp0.vf) {
        this.formEmenda.get('emenda_observacao_pagamento').setValue(cp0.valor);
      }
    console.log('getValorAlterar', this.formEmenda.getRawValue());
  }

  verificaValidTouched(campo: string) {
    return (
      !this.formEmenda.get(campo).valid &&
      (this.formEmenda.get(campo).touched || this.formEmenda.get(campo).dirty)
    );
  }

  aplicaCssErro(campo: string) {
    return {
      'ng-invalid': this.verificaValidTouched(campo),
      'ng-dirty': this.verificaValidTouched(campo)
    };
  }

  onBlockSubmit(ev: boolean) {
    this.mostraForm = !ev;
  }


  onSubmit() {
    const envio = this.criaEnvio();
    if (envio) {
      this.botaoEnviarVF = false;
      this.mostraForm = true;
      this.arquivoDesativado = false;
      this.sub.push(this.es.atualizarEmenda(this.criaEnvio())
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: (err) => {
            this.botaoEnviarVF = false;
            this.mostraForm = true;
            this.ms.add({
              key: 'toastprincipal',
              severity: 'warn',
              summary: 'ERRO ATUALIZAR',
              detail: this.resp[2]
            });
            console.log(err);
          },
          complete: () => {
            if (this.resp[0]) {
              if (sessionStorage.getItem('emenda-dropdown-menu')) {
                sessionStorage.removeItem('emenda-dropdown-menu');
              }

              this.resetForm();
              this.ms.add({
                key: 'toastprincipal',
                severity: 'success',
                summary: 'ATUALIZAR EMENDA',
                detail: this.resp[2]
              });

              this.voltarListar();

            } else {
              this.botaoEnviarVF = false;
              this.mostraForm = true;
              console.error('ERRO - ATUALIZAR ', this.resp[2]);
              this.ms.add({
                key: 'toastprincipal',
                severity: 'warn',
                summary: 'ATENÇÃO - ERRO',
                detail: this.resp[2]
              });
            }
          }
        })
      );
    } else {
      this.ms.add({
        key: 'toastprincipal',
        severity: 'warn',
        summary: 'ATENÇÃO - SEM ATUALIZAÇÃO',
        detail: 'Nenhum campo foi atualizado.'
      });
    }
  }

  criaEnvio(): EmendaAtualizarI {
    const e = new EmendaAtualizar();
    e.emenda_id = this.efs.emendaAt.emenda_id;
    e.emenda_situacao_id = +this.formEmenda.get('emenda_situacao_id').value;
    if (this.formEmenda.get('emenda_valor_empenhado').value !== null) {
      e.emenda_valor_empenhado = +this.formEmenda.get('emenda_valor_empenhado').value;
    }
    if (this.formEmenda.get('emenda_data_empenho').value !== null) {
      const tmp0: Date = this.formEmenda.get('emenda_data_empenho').value;
      e.emenda_data_empenho = tmp0.toISOString().slice(0,10);
    }
    e.emenda_numero_empenho = this.formEmenda.get('emenda_numero_empenho').value;

    if (this.formEmenda.get('emenda_data_pagamento').value !== null) {
      const tmp1: Date = this.formEmenda.get('emenda_data_pagamento').value;
      e.emenda_data_pagamento = tmp1.toISOString().slice(0,10);
    }
    if (this.formEmenda.get('emenda_valor_pago').value !== null) {
      e.emenda_valor_pago = +this.formEmenda.get('emenda_valor_pago').value;
    }
    e.emenda_numero_ordem_bancaria = this.formEmenda.get('emenda_numero_ordem_bancaria').value;
    e.emenda_contrato = this.formEmenda.get('emenda_contrato').value;
    if (this.formEmenda.get('emenda_porcentagem').value !== null) {
      e.emenda_porcentagem = +this.formEmenda.get('emenda_porcentagem').value;
    }
    if (this.cpoEditor['emenda_observacao_pagamento'] !== undefined && this.cpoEditor['emenda_observacao_pagamento'] !== null) {
      e.emenda_observacao_pagamento = this.cpoEditor['emenda_observacao_pagamento'].html;
      e.emenda_observacao_pagamento_delta = JSON.stringify(this.cpoEditor['emenda_observacao_pagamento'].delta);
      e.emenda_observacao_pagamento_texto = this.cpoEditor['emenda_observacao_pagamento'].text;
    }
    if (this.cpoEditor['historico_andamento'] !== undefined && this.cpoEditor['historico_andamento'] !== null) {
      e.historico_andamento = this.cpoEditor['historico_andamento'].html;
      e.historico_andamento_delta = JSON.stringify(this.cpoEditor['historico_andamento'].delta);
      e.historico_andamento_texto = this.cpoEditor['historico_andamento'].text;
    }
    return e;
  }

  voltarListar() {
    this.efs.emendaListar = undefined;
    if (sessionStorage.getItem('emenda-busca')) {
      this.router.navigate(['/emenda/listar']);
    } else {
      this.router.navigate(['/emenda/listar2']);
    }
  }

  voltar() {
    this.efs.resetAtualizar();
    this.efs.emendaListar = undefined;
    this.es.stateSN = false;
    sessionStorage.removeItem('emenda-busca');
    this.router.navigate(['/emenda/listar2']);
  }

  resetForm() {
    this.mostraForm = true;
      this.criaForm();
    this.arquivoDesativado = true;
    window.scrollTo(0, 0);
  }

  onContentChanged(ev, campo: string) {
    this.cpoEditor[campo] = {
      html: ev.html,
      delta: ev.content,
      text: ev.text
    }
  }

  ngOnDestroy(): void {
    this.efs.resetAtualizar();
    this.sub.forEach(s => s.unsubscribe());
  }

}
