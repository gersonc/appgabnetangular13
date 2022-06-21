import {
  Component,
  ViewChild,
  OnInit,
  DoCheck,
  OnDestroy,
  ViewEncapsulation,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { SelectItem, MenuItem, MessageService } from 'primeng/api';
import {DropdownService, MenuInternoService, MostraMenuService} from '../../_services';
import { DropdownnomeidClass } from '../../_models';
import { AuthenticationService, CarregadorService } from '../../_services';
import { OficioFormulario, OficioIncluirForm, OficioIncluirFormInterface } from '../_models';
import { OficioFormService, OficioService } from '../_services';
import {Editor} from 'primeng/editor';
import {DdForm, DdOficioProcessoId} from "../_models/oficio-i";


@Component({
  selector: 'app-oficio-incluir',
  templateUrl: './oficio-incluir.component.html',
  styleUrls: ['./oficio-incluir.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService]
})
export class OficioIncluirComponent implements AfterViewInit, OnInit, OnDestroy {

  @ViewChild('ofidesc', { static: true }) ofidesc: Editor;
  @ViewChild('histand', { static: true }) histand: Editor;
  @ViewChild('enviar', { static: true }) enviar: ElementRef;
  @ViewChild('descricao', { static: true }) descricao: ElementRef;

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
  modulos: any;
  botaoEnviarVF = false;
  arquivoDesativado = false;
  enviarArquivos = false;
  clearArquivos = false;
  arquivo_registro_id = 0;
  possuiArquivos = false;

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

  ddForm?: DdForm;
  lb: DdOficioProcessoId = {
    processo_numero: '',
    solicitacao_cadastro_nome: '',
    solicitacao_data: '',
    solicitacao_assunto_nome: '',
    solicitacao_orgao: '',
    solicitacao_area_interesse_nome: '',
    solicitacao_descricao: '',
    solicitacao_descricao_delta: '',
    cadastro_bairro: '',
    cadastro_municipio_nome: '',
    oficio_codigo: '',
  }
  htm: string | null = null;
  delta: any = null;
  display = false;
  dialog = false;


  constructor(
    private formBuilder: FormBuilder,
    private dd: DropdownService,
    private ofs: OficioFormService,
    public mi: MenuInternoService,
    private location: Location,
    private messageService: MessageService,
    public authenticationService: AuthenticationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private oficioService: OficioService,
    private cs: CarregadorService
  ) {  }


  ngOnInit() {
    this.ofs.criaOficio();
    this.carregaDropdownSessionStorage();

    this.modulos = {
      toolbar: this.toolbarEditor
    };

    this.sub.push(this.activatedRoute.data
      .pipe(take(1))
      .subscribe( (data => {
        console.log('activatedRoute.data',data);
        })
      /*(data: {dados: OficioIncluirFormInterface}) => {
        // this.solicitacao = data.dados.solicitacao;
        this.oficio_codigo = data.dados.oficio_codigo;
        this.processo_id = data.dados.oficio_processo_id;
        this.processo_numero = data.dados.processo_numero;
        this.solicitacao_cadastro_nome = data.dados.solicitacao_cadastro_nome;
        this.solicitacao_assunto_nome = data.dados.solicitacao_assunto_nome;
        this.solicitacao_data = data.dados.solicitacao_data;
        this.solicitacao_area_interesse_nome = data.dados.solicitacao_area_interesse_nome;
        this.solicitacao_descricao = data.dados.solicitacao_descricao;
        this.solicitacao_descricao_texto = data.dados.solicitacao_descricao_texto;
        this.solicitacao_descricao_delta = data.dados.solicitacao_descricao;
        this.cadastro_municipio_nome = data.dados.cadastro_municipio_nome;
        this.processoLabelLenght = data.dados.processoLabelLenght;
        this.ddOficio_processo_id = data.dados.ddOficio_processo_id;
      }*/));

    if (this.url === 'processo') {
      this.location.go('../solicitacao/listar/busca');
    }
    // this.configuraCalendario();
    this.criaForm();
    if (this.solicitacao) {
      this.formOfIncluir.get('oficio_processo_id').patchValue(this.processo_id);
      this.formOfIncluir.get('oficio_processo_id').markAsTouched();
      this.formOfIncluir.get('oficio_processo_id').markAsDirty();
    }
    this.cs.escondeCarregador();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.cs.escondeCarregador();
      this.mi.hideMenu();
    }, 500);
  }

  carregaDropdownSessionStorage() {
    this.ddForm = {
      ddOficioProcessoId: JSON.parse(sessionStorage.getItem('dropdown-oficio_processo_dd')),
      ddAndamento_id: JSON.parse(sessionStorage.getItem('dropdown-andamento')),
      ddPrioridade_id: JSON.parse(sessionStorage.getItem('dropdown-prioridade')),
      ddrecebimento_id: JSON.parse(sessionStorage.getItem('dropdown-tipo_recebimento'))
    };
    this.montaDdProcessoId(JSON.parse(sessionStorage.getItem('dropdown-oficio_processo_dd')));
    /*this.ddPrioridade_id = JSON.parse(sessionStorage.getItem('dropdown-prioridade'));
    this.ddAndamento_id = JSON.parse(sessionStorage.getItem('dropdown-andamento'));
    this.ddrecebimento_id = JSON.parse(sessionStorage.getItem('dropdown-tipo_recebimento'));*/
  }

  montaDdProcessoId(d: DdOficioProcessoId[]) {
    this.ddProcessoId = d.map(p => ({
      value: p.processo_id, label: p.processo_numero + ' - ' + p.solicitacao_data + ' - ' + p.solicitacao_cadastro_nome
    }))
  }

  // ***     FORMULARIO      *************************
  criaForm() {
    this.formOfIncluir = this.formBuilder.group({
      /*oficio_processo_id: [this.ofs.oficio.oficio_processo_id, Validators.required],*/
      oficio_processo_id: [null, Validators.required],
      oficio_numero: [this.ofs.oficio.oficio_numero],
      oficio_convenio: [this.ofs.oficio.oficio_convenio],
      oficio_prioridade_id: [this.ofs.oficio.oficio_prioridade_id, Validators.required],
      oficio_tipo_recebimento_id: [this.ofs.oficio.oficio_tipo_recebimento_id],
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
      historico_andamento: [this.ofs.oficio.historico_andamento]
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

  mudaProcesso(ev) {
    this.dialog = false;
    this.display = false
    const i: number = this.ddForm.ddOficioProcessoId.findIndex(o => (o.processo_id === ev.value));
    console.log(i, this.formOfIncluir.get('oficio_processo_id').value, ev);
    this.lb = this.ddForm.ddOficioProcessoId[i];
    if(typeof(this.lb.solicitacao_descricao_delta) !== 'undefined' && this.lb.solicitacao_descricao_delta !== null) {
      this.delta = this.lb.solicitacao_descricao_delta;
    } else {
      this.delta = null;
    }
    if(typeof(this.lb.solicitacao_descricao) !== 'undefined' && this.lb.solicitacao_descricao !== null) {
      this.htm = this.lb.solicitacao_descricao;
    } else {
      this.htm = null;
    }
    if (this.delta !== null || this.htm !== null) {
      //this.dialog = true;
    }
    console.log(this.lb);
    // this.lb = this.ddForm.ddOficioProcessoId[this.ddForm.ddOficioProcessoId.findIndex(o => o.processo_id = this.formOfIncluir.get('oficio_processo_id').value)];
    /*if(this.lb !== null) {
      if(typeof(this.lb.solicitacao_descricao) !== 'undefined') {
        this.htm = this.lb.solicitacao_descricao;
      } else {
        this.htm = null;
      }
      this.formOfIncluir.get('oficio_processo_id').setValue(this.lb.processo_id);
    } else {

    }*/

    // console.log(event, this.lb)
    /*this.oficio_codigo = 'AGUARDE...';
    this.oficod = true;
    this.processo_id = event.value.processo_id;
    this.ofs.oficio.oficio_processo_id = event.value.processo_id;
    this.processo_numero = event.value.processo_numero;
    this.solicitacao_cadastro_nome = event.value.solicitacao_cadastro_nome;
    this.solicitacao_assunto_nome = event.value.solicitacao_assunto_nome;
    this.solicitacao_data = event.value.solicitacao_data;
    this.solicitacao_area_interesse_nome = event.value.solicitacao_area_interesse_nome;
    this.solicitacao_descricao = event.value.solicitacao_descricao;
    this.cadastro_municipio_nome = event.value.cadastro_municipio_nome;
    this.sub.push(this.oficioService.getNovoCodigo(this.processo_id)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.oficio_codigo = dados;
        },
        error: (erro) => {
          console.log(erro);
        },
        complete: () => {
          this.oficod = false;
        }
      }));*/
  }

  getProcessoId(processo_id: number) {
    this.sub.push(this.oficioService.getProcessoId(this.processo_id)
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
  }

  resetForm() {
    this.formOfIncluir.reset();
    if (this.possuiArquivos) {
      this.clearArquivos = true;
    }
    this.oficio_codigo = '';
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
      this.cs.escondeCarregador();
      this.messageService.add({
        key: 'oficioToast',
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

  focus1(event) {
    this.mostraModulos1 = 'inline-block';
    this.mostraModulos2 = 'none';
  }

  focus2(event) {
    this.mostraModulos1 = 'none';
    this.mostraModulos2 = 'inline-block';
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
    if (this.url) {
      if (this.url === 'processo') {
        this.router.navigate(['../solicitacao/listar/busca']);
      } else {
        this.router.navigate(['/oficio/listar/busca']);
      }
    }
    if (!sessionStorage.getItem('oficio-busca')) {
      this.mi.mostraInternoMenu();
    }
    this.router.navigate(['/oficio/listar/busca']);
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
      'has-error': this.verificaValidTouched(campo),
      'has-feedback': this.verificaValidTouched(campo)
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
      'has-error': this.validaAsync(campo, situacao),
      'has-feedback': this.validaAsync(campo, situacao)
    };
  }

  enviarOficio() {
    if (this.formOfIncluir.valid) {
      this.botoesInativos = true;
      this.enviar.nativeElement.disabled = true;
      this.cs.mostraCarregador();
      this.criaOficio();
      this.sub.push(this.oficioService.incluirOficio(this.ofs.oficio)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: (err) => {
            this.botoesInativos = false;
            this.enviar.nativeElement.disabled = false;
            this.cs.escondeCarregador();
            this.messageService.add({key: 'oficioToast', severity: 'warn', summary: 'ERRO INCLUIR', detail: this.resp[2]});
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
                this.messageService.add({
                  key: 'oficioToast',
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
              this.enviar.nativeElement.disabled = false;
              this.cs.escondeCarregador();
              console.error('ERRO - INCLUIR ', this.resp[2]);
              this.messageService.add({
                key: 'oficioToast',
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
    if (!this.solicitacao) {
      this.ofs.oficio.oficio_processo_id = +this.formOfIncluir.get('oficio_processo_id').value.value;
    } else {
      this.ofs.oficio.oficio_processo_id = +this.processo_id;
    }
    this.ofs.oficio.oficio_numero = this.formOfIncluir.get('oficio_numero').value;
    this.ofs.oficio.oficio_prioridade_id = this.formOfIncluir.get('oficio_prioridade_id').value;
    this.ofs.oficio.oficio_tipo_andamento_id = this.formOfIncluir.get('oficio_tipo_andamento_id').value;
    this.ofs.oficio.oficio_data_emissao = this.formOfIncluir.get('oficio_data_emissao').value;
    this.ofs.oficio.oficio_data_protocolo = this.formOfIncluir.get('oficio_data_protocolo').value;
    this.ofs.oficio.oficio_data_pagamento = this.formOfIncluir.get('oficio_data_pagamento').value;
    this.ofs.oficio.oficio_orgao_solicitado_nome = this.formOfIncluir.get('oficio_orgao_solicitado_nome').value;
    this.ofs.oficio.oficio_orgao_protocolante_nome = this.formOfIncluir.get('oficio_orgao_protocolante_nome').value;
    // this.ofs.oficio.oficio_descricao_acao = this.formOfIncluir.get('oficio_descricao_acao').value;
    if (this.formOfIncluir.get('oficio_descricao_acao').value) {
      const ql0: any = this.ofidesc.getQuill();
      // const txt1 = ql.getContents();
      // const txt2 = ql.getText();
      this.ofs.oficio.oficio_descricao_acao = this.formOfIncluir.get('oficio_descricao_acao').value;
      this.ofs.oficio.oficio_descricao_acao_delta = JSON.stringify(ql0.getContents());
      this.ofs.oficio.oficio_descricao_acao_texto = ql0.getText();
    }
    this.ofs.oficio.oficio_protocolo_numero = this.formOfIncluir.get('oficio_protocolo_numero').value;
    this.ofs.oficio.oficio_protocolante_funcionario = this.formOfIncluir.get('oficio_protocolante_funcionario').value;
    this.ofs.oficio.oficio_prazo = this.formOfIncluir.get('oficio_prazo').value;
    this.ofs.oficio.oficio_valor_recebido = this.formOfIncluir.get('oficio_valor_recebido').value;
    this.ofs.oficio.oficio_valor_solicitado = this.formOfIncluir.get('oficio_valor_solicitado').value;
    // this.ofs.oficio.historico_andamento = this.formOfIncluir.get('historico_andamento').value;
    if (this.formOfIncluir.get('historico_andamento').value) {
      const ql1: any = this.histand.getQuill();
      // const txt3 = ql.getContents();
      // const txt4 = ql.getText();
      this.ofs.oficio.historico_andamento = this.formOfIncluir.get('historico_andamento').value;
      this.ofs.oficio.historico_andamento_delta = JSON.stringify(ql1.getContents());
      this.ofs.oficio.historico_andamento_texto = ql1.getText();
    }
    this.ofs.oficio.oficio_codigo = this.oficio_codigo;
  }

  ngOnDestroy(): void {
    this.ofs.resetOficio();
    this.sub.forEach(s => s.unsubscribe());
  }

}
