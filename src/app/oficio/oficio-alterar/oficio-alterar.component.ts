import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MsgService} from "../../_services/msg.service";
import {OficioFormService} from "../_services/oficio-form.service";
import {OficioService} from "../_services/oficio.service";
import {AuthenticationService, DropdownService} from "../../_services";
import {SelectItem} from "primeng/api";
import {CpoEditor, InOutCampoTexto} from "../../_models/in-out-campo-texto";
import {Subscription} from "rxjs";
import {take} from "rxjs/operators";
import {OficioFormulario, OficioFormularioInterface} from "../_models/oficio-formulario";

@Component({
  selector: 'app-oficio-alterar',
  templateUrl: './oficio-alterar.component.html',
  styleUrls: ['./oficio-alterar.component.css']
})
export class OficioAlterarComponent implements OnInit {
  formOfAlterar: FormGroup;
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
  ddPrioridade_id: SelectItem[] = [];
  ddAndamento_id: SelectItem[] = [];
  ddRecebimento_id: SelectItem[] = [];
  resp: any[];
  sub: Subscription[] = [];
  cpoEditor: CpoEditor[] | null = [];
  format0: 'html' | 'object' | 'text' | 'json' = 'html';
  format1: 'html' | 'object' | 'text' | 'json' = 'html';
  botoesInativos = false;
  botaoEnviarInativo = false;
  possuiArquivos = false;



  constructor(
    private formBuilder: FormBuilder,
    private dd: DropdownService,
    public ofs: OficioFormService,
    public aut: AuthenticationService,
    private os: OficioService,
    private ms: MsgService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.carregaDropdownSessionStorage();
    this.criaForm();
  }

  carregaDropdownSessionStorage() {
    this.ddPrioridade_id = JSON.parse(sessionStorage.getItem('dropdown-prioridade'));
    this.ddAndamento_id = JSON.parse(sessionStorage.getItem('dropdown-andamento'));
    this.ddRecebimento_id = JSON.parse(sessionStorage.getItem('dropdown-tipo_recebimento'));
  }

  // ***     FORMULARIO      *************************
  /*criaForm() {
    this.formOfAlterar = this.formBuilder.group({
      oficio_numero: [this.ofs.oficio.oficio_numero],
      oficio_codigo: [this.ofs.oficio.oficio_codigo],
      oficio_convenio: [this.ofs.oficio.oficio_convenio],
      oficio_prioridade_id: [this.ofs.oficio.oficio_prioridade_id, Validators.required],
      oficio_tipo_andamento_id: [this.ofs.oficio.oficio_tipo_andamento_id, Validators.required],
      oficio_data_emissao: [this.ofs.oficio.oficio_data_emissao],
      oficio_data_protocolo: [this.ofs.oficio.oficio_data_protocolo],
      oficio_data_pagamento: [this.ofs.oficio.oficio_data_pagamento],
      oficio_data_empenho: [this.ofs.oficio.oficio_data_empenho],
      oficio_data_recebimento: [this.ofs.oficio.oficio_data_recebimento],
      oficio_orgao_solicitado_nome: [this.ofs.oficio.oficio_orgao_solicitado_nome, Validators.required],
      oficio_orgao_protocolante_nome: [this.ofs.oficio.oficio_orgao_protocolante_nome, Validators.required],
      oficio_descricao_acao: [this.ofs.oficio.oficio_descricao_acao],
      oficio_protocolo_numero: [this.ofs.oficio.oficio_protocolo_numero],
      oficio_protocolante_funcionario: [this.ofs.oficio.oficio_protocolante_funcionario],
      oficio_prazo: [this.ofs.oficio.oficio_prazo],
      oficio_valor_recebido: [this.ofs.oficio.oficio_valor_recebido, Validators.pattern('[0-9]*')],
      oficio_valor_solicitado: [this.ofs.oficio.oficio_valor_solicitado, Validators.pattern('[0-9]*')],
      oficio_tipo_recebimento_id: [this.ofs.oficio.oficio_tipo_recebimento_id]
    });
  }*/

  criaForm() {
    this.formOfAlterar = this.formBuilder.group({
      oficio_numero: [this.ofs.oficio.oficio_numero],
      oficio_codigo: [this.ofs.oficio.oficio_codigo],
      oficio_convenio: [this.ofs.oficio.oficio_convenio],
      oficio_prioridade_id: [this.ofs.oficio.oficio_prioridade_id, Validators.required],
      oficio_tipo_andamento_id: [this.ofs.oficio.oficio_tipo_andamento_id, Validators.required],
      oficio_data_emissao: [this.ofs.oficio.oficio_data_emissao],
      oficio_data_protocolo: [this.ofs.oficio.oficio_data_protocolo],
      oficio_data_pagamento: [this.ofs.oficio.oficio_data_pagamento],
      oficio_data_empenho: [this.ofs.oficio.oficio_data_empenho],
      oficio_data_recebimento: [this.ofs.oficio.oficio_data_recebimento],
      oficio_orgao_solicitado_nome: [this.ofs.oficio.oficio_orgao_solicitado_nome, Validators.required],
      oficio_orgao_protocolante_nome: [this.ofs.oficio.oficio_orgao_protocolante_nome, Validators.required],
      oficio_descricao_acao: [null],
      historico_andamento: [null],
      oficio_protocolo_numero: [this.ofs.oficio.oficio_protocolo_numero],
      oficio_protocolante_funcionario: [this.ofs.oficio.oficio_protocolante_funcionario],
      oficio_prazo: [this.ofs.oficio.oficio_prazo],
      oficio_valor_recebido: [this.ofs.oficio.oficio_valor_recebido],
      oficio_valor_solicitado: [this.ofs.oficio.oficio_valor_solicitado],
      oficio_tipo_recebimento_id: [this.ofs.oficio.oficio_tipo_recebimento_id]
    });
    this.getValorAlterar();
  }

  getValorAlterar() {
    const cp0 = InOutCampoTexto(this.ofs.oficio.oficio_descricao_acao, this.ofs.oficio.oficio_descricao_acao_delta);
    this.format0 = cp0.format;
    if (cp0.vf) {
      this.formOfAlterar.get('oficio_descricao_acao').setValue(cp0.valor);
    }
  }

  verificaValidTouched(campo: string) {
    return (
      !this.formOfAlterar.get(campo).valid &&
      (this.formOfAlterar.get(campo).touched || this.formOfAlterar.get(campo).dirty)
    );
  }

  verificaValidacoesForm(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(campo => {
      const controle = formGroup.get(campo);
      controle.markAsDirty();
      controle.markAsTouched();
      if (controle instanceof FormGroup) {
        this.verificaValidacoesForm(controle);
      }
    });
  }

  aplicaCssErro(campo: string) {
    return {
      'ng-invalid': this.verificaValidTouched(campo),
      'ng-dirty': this.verificaValidTouched(campo)
    };
  }

  validaAsync(campo: string, situacao: boolean) {
    return (
      !this.formOfAlterar.get(campo).valid &&
      (this.formOfAlterar.get(campo).touched || this.formOfAlterar.get(campo).dirty) &&
      situacao
    );
  }

  aplicaCssErroAsync(campo: string, situacao: boolean) {
    return {
      'ng-invalid': this.validaAsync(campo, situacao),
      'ng-dirty': this.validaAsync(campo, situacao)
    };
  }

  voltarListar() {
    if (this.ofs.url !== '') {
      this.ofs.processo_id = 0;
      this.ofs.solicitacao_id = 0;
      this.ofs.oficioProcessoId = null;
      const url: string = this.ofs.url;
      this.ofs.url = '';
      this.router.navigate([url]);
    } else {
      if (this.resp === undefined) {
        sessionStorage.removeItem('oficio-busca');
        this.router.navigate(['/oficio/listar2']);
      } else {
        this.router.navigate(['/oficio/listar/busca']);
      }
    }
  }

  onPossuiArquivos(ev) {
    this.possuiArquivos = ev;
  }

  onBlockSubmit(ev) {
    this.botoesInativos = ev;
    this.botaoEnviarInativo = ev;
  }


  onSubmit() {}

  enviarOficio(ofi: OficioFormularioInterface) {
    if (this.formOfAlterar.valid) {
      // this.botoesInativos = true;
      // this.botaoEnviarInativo = true;

      // this.criaOficio();
      this.sub.push(this.os.alterarOficio(ofi)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: (err) => {
            this.ms.add({key: 'toastprincipal', severity: 'warn', summary: 'ERRO ALTERAR', detail: this.resp[2]});
            console.log(err);
            this.botoesInativos = false;
            this.botaoEnviarInativo = false;
          },
          complete: () => {
            if (this.resp[0]) {
              if (sessionStorage.getItem('oficio-menu-dropdown')) {
                sessionStorage.removeItem('oficio-menu-dropdown');
              }
              this.ms.add({
                key: 'toastprincipal',
                severity: 'success',
                summary: 'ALTERAR OFÍCIO',
                detail: this.resp[2]
              });
              if (this.resp[3] !== undefined || this.resp[3] !== undefined) {
                const idx = this.os.oficios.findIndex(o => o.oficio_id === this.ofs.oficio.oficio_id);
                this.os.oficios[idx] = this.resp[3];
                const c = {
                  data: this.os.oficios[idx],
                  originalEvent: {}
                }
                this.os.onRowExpand(c);
              }
              this.ofs.resetOficio();
              this.resetForm();
              this.voltarListar();
            } else {
              this.botoesInativos = false;
              this.botaoEnviarInativo = false;
              console.error('ERRO - ALTERAR ', this.resp[2]);
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
    }
  }

  criaOficio() {
    let ct = 0;
    this.botoesInativos = true;
    this.botaoEnviarInativo = true;
    if (this.formOfAlterar.valid) {
      const r = new OficioFormulario();
      r.oficio_codigo = this.formOfAlterar.get('oficio_codigo').value;
      r.oficio_numero = this.formOfAlterar.get('oficio_numero').value;
      r.oficio_convenio = this.formOfAlterar.get('oficio_convenio').value;
      r.oficio_prioridade_id = this.formOfAlterar.get('oficio_prioridade_id').value;
      r.oficio_tipo_andamento_id = this.formOfAlterar.get('oficio_tipo_andamento_id').value;
      r.oficio_data_emissao = this.formOfAlterar.get('oficio_data_emissao').value;
      r.oficio_data_protocolo = this.formOfAlterar.get('oficio_data_protocolo').value;
      r.oficio_data_pagamento = this.formOfAlterar.get('oficio_data_pagamento').value;
      r.oficio_data_empenho = this.formOfAlterar.get('oficio_data_empenho').value;
      r.oficio_data_recebimento = this.formOfAlterar.get('oficio_data_recebimento').value;
      r.oficio_orgao_solicitado_nome = this.formOfAlterar.get('oficio_orgao_solicitado_nome').value;
      r.oficio_orgao_protocolante_nome = this.formOfAlterar.get('oficio_orgao_protocolante_nome').value;
      r.oficio_protocolo_numero = this.formOfAlterar.get('oficio_protocolo_numero').value;
      r.oficio_protocolante_funcionario = this.formOfAlterar.get('oficio_protocolante_funcionario').value;
      r.oficio_prazo = this.formOfAlterar.get('oficio_prazo').value;
      r.oficio_valor_recebido = this.formOfAlterar.get('oficio_valor_recebido').value;
      r.oficio_valor_solicitado = this.formOfAlterar.get('oficio_valor_solicitado').value;
      r.oficio_tipo_recebimento_id = this.formOfAlterar.get('oficio_tipo_recebimento_id').value;
      if (this.cpoEditor['oficio_descricao_acao'] !== undefined && this.cpoEditor['oficio_descricao_acao'] !== null) {
        if (this.cpoEditor['oficio_descricao_acao'].html !== this.ofs.oficio.oficio_descricao_acao) {
          r.oficio_descricao_acao = this.cpoEditor['oficio_descricao_acao'].html;
          r.oficio_descricao_acao_delta = JSON.stringify(this.cpoEditor['oficio_descricao_acao'].delta);
          r.oficio_descricao_acao_texto = this.cpoEditor['oficio_descricao_acao'].text;
        }
      }


      for (const chave in r) {
        if (r[chave] === undefined || r[chave] === null || r[chave] === this.ofs.oficio[chave]) {
          delete r[chave];
        } else {
          ct++;
        }
      }

      if (ct > 0) {
        if (this.cpoEditor['historico_andamento'] !== undefined && this.cpoEditor['historico_andamento'] !== null && this.cpoEditor['historico_andamento'].text.length > 0) {
            r.historico_andamento = this.cpoEditor['historico_andamento'].html;
            r.historico_andamento_delta = JSON.stringify(this.cpoEditor['historico_andamento'].delta);
            r.historico_andamento_texto = this.cpoEditor['historico_andamento'].text;
        }
        r.oficio_processo_id = this.ofs.oficio.oficio_id;
        r.oficio_id = this.ofs.oficio.oficio_id;
        console.log('criaOficio', r);
        this.enviarOficio(r);
      } else {
        this.ms.add({
          key: 'toastprincipal',
          severity: 'warn',
          summary: 'ALTERAR OFÍCIO',
          detail: 'SEM ALTERAÇÕES.'
        });
        this.botoesInativos = false;
        this.botaoEnviarInativo = false;
      }
    } else {
      this.ms.add({
        key: 'toastprincipal',
        severity: 'warn',
        summary: 'ALTERAR OFÍCIO',
        detail: 'DADOS INVÁLIDOS, VERIFIQUE OS CAMPOS OBRIGATÓRIOS.'
      });
      this.botoesInativos = false;
      this.botaoEnviarInativo = false;
    }
  }

  resetForm() {
    this.formOfAlterar.reset();
    this.criaForm();
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
    this.ofs.oficio = null;
    this.ofs.ofiListar = null;
    this.sub.forEach(s => s.unsubscribe());
  }

}
