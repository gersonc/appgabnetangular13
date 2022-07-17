import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SelectItem} from "primeng/api";
import {Subscription} from "rxjs";
import {OficioIncluirForm} from "../_models/oficio-incluir-form";
import {OficioFormulario} from "../_models/oficio-formulario";
import {DropdownnomeidClass} from "../../_models";
import {DdForm, DdOficioProcessoIdI} from "../_models/dd-oficio-processo-id-i";
import {CpoEditor} from "../../_models/in-out-campo-texto";
import {Location} from "@angular/common";
import {Router} from "@angular/router";
import {OficioFormService} from "../_services/oficio-form.service";
import {OficioService} from "../_services/oficio.service";
import {AuthenticationService, DropdownService, MenuInternoService} from "../../_services";
import {take} from "rxjs/operators";
import {MsgService} from "../../_services/msg.service";

@Component({
  selector: 'app-oficio-incluir',
  templateUrl: './oficio-incluir.component.html',
  styleUrls: ['./oficio-incluir.component.css']
})
export class OficioIncluirComponent implements OnInit {
  oficioIncluir = new OficioIncluirForm();
  formOfIncluir: FormGroup;
  oficio: OficioFormulario;
  ddNomeIdArray = new DropdownnomeidClass();
  processoLabelLenght: string;
  ddOficio_processo_id: any[] = [];
  ddPrioridade_id: SelectItem[] = [];
  ddAndamento_id: SelectItem[] = [];
  ddrecebimento_id: SelectItem[] = [];
  ddProcessoId: SelectItem[] = [];
  mostraForm = false;
  mostraModulos1 = 'none';
  mostraModulos2 = 'none';
  ptBr: any;
  sub: Subscription[] = [];
  processo_id: number;
  processo_numero = '';
  solicitacao_cadastro_nome = '';
  solicitacao_assunto_nome = '';
  solicitacao_data = '';
  solicitacao_area_interesse_nome = '';
  solicitacao_descricao = '';
  solicitacao_descricao_texto = null;
  solicitacao_descricao_delta = null;
  cadastro_municipio_nome = '';
  oficio_codigo = '';

  spinner = false;
  oficod = false;
  resp: any[];
  solicitacao = false;
  url: string;
  botoesInativos = false;
  botaoEnviarVF = false;
  arquivoDesativado = false;
  enviarArquivos = false;
  clearArquivos = false;
  arquivo_registro_id = 0;
  possuiArquivos = false;

  ddOficioStatus: SelectItem[] = [
    {label: 'EM ANDAMENTO', value: 0},
    {label: 'DEFERIDO', value: 1},
    {label: 'INDEFERIDO', value: 2}
  ];

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

  ddForm: DdForm = {
    ddPrioridade_id: [],
    ddAndamento_id: [],
    ddrecebimento_id: [],
    DdOficioProcessoIdI: []
  }
  lb: DdOficioProcessoIdI = {
    processo_numero: '',
    solicitacao_cadastro_nome: '',
    solicitacao_data: '',
    solicitacao_assunto_nome: '',
    solicitacao_orgao: '',
    solicitacao_area_interesse_nome: '',
    solicitacao_descricao: '',
    solicitacao_descricao_texto: '',
    solicitacao_descricao_delta: '',
    cadastro_bairro: '',
    cadastro_municipio_nome: '',
    oficio_codigo: '',
  }
  htm: string | null = null;
  txt: string | null = null;
  delta: any = null;
  display = false;
  dialog = false;
  cpoEditor: CpoEditor[] | null = [];
  btEnviarInativo = false;
  herancaSN = false;

  constructor(
    private formBuilder: FormBuilder,
    private dd: DropdownService,
    private ofs: OficioFormService,
    public mi: MenuInternoService,
    private location: Location,
    public aut: AuthenticationService,
    private os: OficioService,
    private ms: MsgService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.ofs.criaOficio();
    this.carregaDropdownSessionStorage();
    if (this.url === 'processo') {
      this.location.go('../solic/listar/busca');
    }
    if (this.ofs.oficioProcessoId !== null) {
      this.lb = this.ofs.oficioProcessoId;
      this.herancaSN = true;
    }
    this.criaForm();
  }

  carregaDropdownSessionStorage() {
    this.ddForm = {
      ddAndamento_id: JSON.parse(sessionStorage.getItem('dropdown-andamento')),
      ddPrioridade_id: JSON.parse(sessionStorage.getItem('dropdown-prioridade')),
      ddrecebimento_id: JSON.parse(sessionStorage.getItem('dropdown-tipo_recebimento'))
    };
    if (this.ofs.oficioProcessoId === null) {
      this.ddForm.DdOficioProcessoIdI = JSON.parse(sessionStorage.getItem('dropdown-oficio_processo_dd'));
      this.montaDdProcessoId(JSON.parse(sessionStorage.getItem('dropdown-oficio_processo_dd')));
    }
  }

  montaDdProcessoId(d: DdOficioProcessoIdI[]) {
    this.ddProcessoId = d.map(p => ({
      value: p.processo_id, label: p.processo_numero + ' - ' + p.solicitacao_data + ' - ' + p.solicitacao_cadastro_nome
    }));
    if (this.ofs.oficioProcessoId === null && (this.ofs.processo_id > 0 || this.ofs.solicitacao_id > 0)) {
      this.montaProcessoId();
    }
  }

  montaProcessoId() {
    if (this.ofs.processo_id > 0) {
      this.lb = this.ddForm.DdOficioProcessoIdI[this.ddForm.DdOficioProcessoIdI.findIndex(o => (o.processo_id === this.ofs.processo_id))];
      if (this.ofs.solicitacao_id === 0) {
        this.ofs.solicitacao_id = this.lb.solicitacao_id;
      }
    }
    if (this.ofs.processo_id === 0 && this.ofs.solicitacao_id > 0) {
      this.lb = this.ddForm.DdOficioProcessoIdI[this.ddForm.DdOficioProcessoIdI.findIndex(o => (o.solicitacao_id === this.ofs.solicitacao_id))];
      this.formOfIncluir.get('oficio_processo_id').patchValue(this.lb.processo_id);
      this.ofs.processo_id = this.lb.processo_id;
    }

  }

  criaForm() {
    const dt = new Date();
    const hoje = dt.toLocaleString('pt-BR').toString().slice(0,10);

    this.formOfIncluir = this.formBuilder.group({
      oficio_processo_id: [(this.ofs.processo_id > 0) ? this.ofs.processo_id : null, Validators.required],
      oficio_numero: [this.ofs.oficio.oficio_numero],
      oficio_convenio: [this.ofs.oficio.oficio_convenio],
      oficio_status: [0],
      oficio_prioridade_id: [this.ofs.oficio.oficio_prioridade_id, Validators.required],
      oficio_tipo_recebimento_id: [this.ofs.oficio.oficio_tipo_recebimento_id],
      oficio_tipo_andamento_id: [this.ofs.oficio.oficio_tipo_andamento_id, Validators.required],
      oficio_data_emissao: [hoje],
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
      historico_andamento: [this.ofs.oficio.historico_andamento]
    });

    if (this.ofs.processo_id > 0) {
      /*if (this.ofs.processo_id > 0) {
      this.lb = this.ddForm.ddOficioProcessoId[this.ddForm.ddOficioProcessoId.findIndex(o => (o.processo_id === this.ofs.processo_id))];
        this.formOfIncluir.get('oficio_processo_id').patchValue(this.ofs.processo_id);
        if (this.ofs.solicitacao_id === 0) {
          this.ofs.solicitacao_id = this.lb.solicitacao_id;
        }
      } else {
        this.lb = this.ddForm.ddOficioProcessoId[this.ddForm.ddOficioProcessoId.findIndex(o => (o.solicitacao_id === this.ofs.solicitacao_id))];
        this.formOfIncluir.get('oficio_processo_id').patchValue(this.lb.processo_id);
        this.ofs.processo_id = this.lb.processo_id;
      }*/
      this.formOfIncluir.get('oficio_processo_id').markAsTouched();
      this.formOfIncluir.get('oficio_processo_id').markAsDirty();
    }

  }

  mudaProcesso(ev) {
    this.dialog = false;
    this.display = false
    const i: number = this.ddForm.DdOficioProcessoIdI.findIndex(o => (o.processo_id === ev.value));
    this.lb = this.ddForm.DdOficioProcessoIdI[i];

  }

  /*getProcessoId(processo_id: number) {
    this.sub.push(this.os.getProcessoId(this.processo_id)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.oficio_codigo = dados['oficio_codigo'];
          this.ofs.oficio.oficio_processo_id = dados['processo_id'];
          this.processo_numero = dados['processo_numero'];
          this.solicitacao_cadastro_nome = dados['solicitacao_cadastro_nome'];
          this.solicitacao_assunto_nome = dados['solicitacao_assunto_nome'];
          this.solicitacao_data = dados['solicitacao_data'];
          this.solicitacao_area_interesse_nome = dados['solicitacao_area_interesse_nome'];
          this.solicitacao_descricao = dados['solicitacao_descricao'];
          this.solicitacao_descricao_texto = dados['solicitacao_descricao_texto'];
          this.solicitacao_descricao_delta = dados['solicitacao_descricao_delta'];
          this.cadastro_municipio_nome = dados['cadastro_municipio_nome'];
        },
        error: (erro) => {
          console.log(erro);
        },
        complete: () => {
        }
      }));
  }*/

  resetForm() {
    this.formOfIncluir.reset();
    if (this.possuiArquivos) {
      this.clearArquivos = true;
    }
    this.arquivoDesativado = true;
    window.scrollTo(0, 0);
  }

  onBlockSubmit(ev: boolean) {
    this.mostraForm = ev;
  }

  onPossuiArquivos(ev) {
    this.possuiArquivos = ev;
  }

  onUpload(ev) {
    if (ev) {
      this.mostraForm = false;
      this.ms.add({
        key: 'toastprincipal',
        severity: 'success',
        summary: 'INCLUIR OFÍCIO',
        detail: this.resp[2]
      });
      this.ofs.resetOficio();
      this.resetForm();
      this.botaoEnviarVF = false;
      this.mostraForm = true;
      // this.voltarListar();
    }
  }

  isReadOnly(): boolean {
    return (this.ofs.processo_id > 0 || this.ofs.solicitacao_id > 0);
  }

  onSubmit() {}

  showDialog() {
    if (this.htm !== null || this.delta !== null) {
      this.dialog = true;
      this.display = true;
    }
  }

  fechar() {
    this.display = false;
    this.dialog = false;
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
        if (!sessionStorage.getItem('oficio-busca')) {
          this.mi.showMenuInterno();
        } else {
          sessionStorage.removeItem('oficio-busca');
        }
        this.router.navigate(['/oficio/listar2']);
      } else {
        if (!sessionStorage.getItem('oficio-busca')) {
          this.mi.mostraInternoMenu();
        }
        this.router.navigate(['/oficio/listar/busca']);
      }
    }
  }

  verificaValidTouched(campo: string) {
    return (
      !this.formOfIncluir.get(campo).valid &&
      (this.formOfIncluir.get(campo).touched || this.formOfIncluir.get(campo).dirty)
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
      !this.formOfIncluir.get(campo).valid &&
      (this.formOfIncluir.get(campo).touched || this.formOfIncluir.get(campo).dirty) &&
      situacao
    );
  }

  aplicaCssErroAsync(campo: string, situacao: boolean) {
    return {
      'ng-invalid': this.validaAsync(campo, situacao),
      'ng-dirty': this.validaAsync(campo, situacao)
    };
  }

  enviarOficio() {
    if (this.formOfIncluir.valid) {
      this.botoesInativos = true;
      this.btEnviarInativo = true;
      const of = this.criaOficio();
      this.sub.push(this.os.incluirOficio(of)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: (err) => {
            this.botoesInativos = false;
            this.btEnviarInativo = false;
            this.ofs.oficio = of;
            this.ms.add({key: 'principal', severity: 'warn', summary: 'ERRO INCLUIR', detail: this.resp[2]});
            console.log(err);
          },
          complete: () => {
            if (this.resp[0]) {
              if (sessionStorage.getItem('oficio-menu-dropdown')) {
                sessionStorage.removeItem('oficio-menu-dropdown');
              }
              if (this.possuiArquivos) {
                this.arquivo_registro_id = +this.resp[1];
                this.enviarArquivos = true;
              } else {
                this.ms.add({
                  key: 'toastprincipal',
                  severity: 'success',
                  summary: 'INCLUIR OFÍCIO',
                  detail: this.resp[2]
                });
                this.ofs.resetOficio();
                this.resetForm();
                this.voltarListar();
              }
            } else {
              this.botoesInativos = false;
              this.btEnviarInativo = false;
              // this.enviar.nativeElement.disabled = false;
              console.error('ERRO - INCLUIR ', this.resp[2]);
              this.ofs.oficio = of;
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

  criaOficio(): OficioFormulario  {
    let o = new OficioFormulario();
    console.log('lb',this.lb);
    if (this.ofs.processo_id === 0) {
      o.oficio_processo_id = +this.formOfIncluir.get('oficio_processo_id').value;
    } else {
      o.oficio_processo_id = this.ofs.processo_id;
      o.oficio_solicitacao_id = this.ofs.solicitacao_id;
    }
    o.oficio_codigo = this.lb.oficio_codigo;
    o.oficio_status = this.formOfIncluir.get('oficio_status').value;
    o.oficio_convenio = this.formOfIncluir.get('oficio_convenio').value;
    o.oficio_numero = this.formOfIncluir.get('oficio_numero').value;
    o.oficio_prioridade_id = this.formOfIncluir.get('oficio_prioridade_id').value;
    o.oficio_tipo_andamento_id = this.formOfIncluir.get('oficio_tipo_andamento_id').value;
    o.oficio_tipo_recebimento_id = this.formOfIncluir.get('oficio_tipo_recebimento_id').value;
    o.oficio_data_emissao = this.formOfIncluir.get('oficio_data_emissao').value;
    o.oficio_data_empenho = this.formOfIncluir.get('oficio_data_empenho').value;
    o.oficio_data_recebimento = this.formOfIncluir.get('oficio_data_recebimento').value;
    o.oficio_data_protocolo = this.formOfIncluir.get('oficio_data_protocolo').value;
    o.oficio_data_pagamento = this.formOfIncluir.get('oficio_data_pagamento').value;
    o.oficio_orgao_solicitado_nome = this.formOfIncluir.get('oficio_orgao_solicitado_nome').value;
    o.oficio_orgao_protocolante_nome = this.formOfIncluir.get('oficio_orgao_protocolante_nome').value;

    if (this.cpoEditor['oficio_descricao_acao'] !== undefined && this.cpoEditor['oficio_descricao_acao'] !== null) {
      o.oficio_descricao_acao = this.cpoEditor['oficio_descricao_acao'].html;
      o.oficio_descricao_acao_delta = JSON.stringify(this.cpoEditor['oficio_descricao_acao'].delta);
      o.oficio_descricao_acao_texto = this.cpoEditor['oficio_descricao_acao'].text;
    }

    o.oficio_protocolo_numero = this.formOfIncluir.get('oficio_protocolo_numero').value;
    o.oficio_protocolante_funcionario = this.formOfIncluir.get('oficio_protocolante_funcionario').value;
    o.oficio_prazo = this.formOfIncluir.get('oficio_prazo').value;
    o.oficio_valor_recebido = this.formOfIncluir.get('oficio_valor_recebido').value;
    o.oficio_valor_solicitado = this.formOfIncluir.get('oficio_valor_solicitado').value;

    if (this.cpoEditor['historico_andamento'] !== undefined && this.cpoEditor['historico_andamento'] !== null) {
      o.historico_andamento = this.cpoEditor['historico_andamento'].html;
      o.historico_andamento_delta = JSON.stringify(this.cpoEditor['historico_andamento'].delta);
      o.historico_andamento_texto = this.cpoEditor['historico_andamento'].text;
    }
    return o;
  }

  onContentChanged(ev, campo: string) {
    this.cpoEditor[campo] = {
      html: ev.html,
      delta: ev.content,
      text: ev.text
    }
  }

  ngOnDestroy(): void {
    this.ofs.resetOficio();
    this.sub.forEach(s => s.unsubscribe());
  }

}
