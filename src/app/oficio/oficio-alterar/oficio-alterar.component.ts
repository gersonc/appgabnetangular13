import { Component, ViewChild, OnInit, OnDestroy, ViewEncapsulation, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { SelectItem, MessageService } from 'primeng/api';
import { DropdownService } from '../../util/_services';
import { OficioFormulario, OficioGetAlterarInterface, OficioInterface } from '../_models';
import { OficioFormService, OficioService } from '../_services';
import { DropdownnomeidClass } from '../../util/_models';
import { AuthenticationService, CarregadorService } from '../../_services';

@Component({
  selector: 'app-oficio-alterar',
  templateUrl: './oficio-alterar.component.html',
  styleUrls: ['./oficio-alterar.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService]
})
export class OficioAlterarComponent implements OnInit, OnDestroy {

  ofi: OficioInterface;
  formOfAlterar: FormGroup;
  oficio: OficioFormulario;
  ddNomeIdArray = new DropdownnomeidClass();
  ddOficio_processo_id: any[] = [];
  ddPrioridade_id: SelectItem[] = [];
  ddAndamento_id: SelectItem[] = [];
  ddRecebimento_id: SelectItem[] = [];
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
  cadastro_municipio_nome = '';
  oficio_codigo = '';
  display = false;
  spinner = true;
  oficod = false;
  resp: any[];
  solicitacao = false;
  url: string;
  oficio_id: number;
  botoesInativos = false;
  botaoEnviarInativo = false;
  @ViewChild('descricao', { static: true }) descricao: ElementRef;
  @ViewChild('enviar', { static: true }) enviar: ElementRef;
  modulos: any;
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


  constructor(
    private formBuilder: FormBuilder,
    private dd: DropdownService,
    private ofs: OficioFormService,
    private location: Location,
    private messageService: MessageService,
    public authenticationService: AuthenticationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private oficioService: OficioService,
    private cs: CarregadorService
  ) {
    this.ofs.criaOficio();
  }


  ngOnInit() {
    this.carregaDropdownSessionStorage();
    this.sub.push(this.activatedRoute.data.subscribe(
      (data: {dados: OficioGetAlterarInterface}) => {
        this.ofi = data.dados.oficio;
        this.oficio_id = +this.ofi.oficio_id;
        this.cs.escondeCarregador();
      }));
    this.modulos = {
      toolbar: this.toolbarEditor
    };
    this.configuraCalendario();
    this.criaForm();
    this.botaoEnviarInativo = !this.formOfAlterar.valid;

  }

  carregaDropdownSessionStorage() {
    this.ddPrioridade_id = JSON.parse(sessionStorage.getItem('dropdown-prioridade'));
    this.ddAndamento_id = JSON.parse(sessionStorage.getItem('dropdown-andamento'));
    this.ddRecebimento_id = JSON.parse(sessionStorage.getItem('dropdown-tipo_recebimento'));
  }

  // ***     FORMULARIO      *************************
  criaForm() {
    this.formOfAlterar = this.formBuilder.group({
      oficio_numero: [this.ofi.oficio_numero],
      oficio_codigo: [this.ofi.oficio_codigo],
      oficio_convenio: [this.ofi.oficio_convenio],
      oficio_prioridade_id: [this.ofi.oficio_prioridade_id, Validators.required],
      oficio_tipo_andamento_id: [this.ofi.oficio_tipo_andamento_id, Validators.required],
      oficio_data_emissao: [this.ofi.oficio_data_emissao],
      oficio_data_protocolo: [this.ofi.oficio_data_protocolo],
      oficio_data_pagamento: [this.ofi.oficio_data_pagamento],
      oficio_data_empenho: [this.ofi.oficio_data_empenho],
      oficio_data_recebimento: [this.ofi.oficio_data_recebimento],
      oficio_orgao_solicitado_nome: [this.ofi.oficio_orgao_solicitado_nome, Validators.required],
      oficio_orgao_protocolante_nome: [this.ofi.oficio_orgao_protocolante_nome, Validators.required],
      oficio_descricao_acao: [this.ofi.oficio_descricao_acao],
      oficio_protocolo_numero: [this.ofi.oficio_protocolo_numero],
      oficio_protocolante_funcionario: [this.ofi.oficio_protocolante_funcionario],
      oficio_prazo: [this.ofi.oficio_prazo],
      oficio_valor_recebido: [this.ofi.oficio_valor_recebido, Validators.pattern('[0-9]*')],
      oficio_valor_solicitado: [this.ofi.oficio_valor_solicitado, Validators.pattern('[0-9]*')],
      oficio_tipo_recebimento_id: [this.ofi.oficio_tipo_recebimento_id]
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

  resetForm() {
    this.formOfAlterar.reset();
    window.scrollTo(0, 0);
  }

  focus1(event) {
    this.mostraModulos1 = 'inline-block';
  }

  onSubmit() {}

  showDialog() {
    this.display = true;
  }

  fechar() {
    this.display = false;
  }

  voltarListar() {
    if (this.url) {
      if (this.url === 'processo') {
        this.router.navigate(['../solicitacao/listar/busca']);
      } else {
        this.router.navigate(['/oficio/listar/busca']);
      }
    }
    this.router.navigate(['/oficio/listar/busca']);
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
      'has-error': this.verificaValidTouched(campo),
      'has-feedback': this.verificaValidTouched(campo)
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
      'has-error': this.validaAsync(campo, situacao),
      'has-feedback': this.validaAsync(campo, situacao)
    };
  }

  enviarOficio() {
    if (this.formOfAlterar.valid) {
      this.botoesInativos = true;
      this.enviar.nativeElement.disabled = true;
      this.cs.mostraCarregador();
      this.criaOficio();
      this.sub.push(this.oficioService.putOficioAlterar(this.oficio_id, this.ofs.oficio)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: (err) => {
            this.messageService.add({key: 'oficioToast', severity: 'warn', summary: 'ERRO ALTERAR', detail: this.resp[2]});
            console.log(err);
            this.cs.escondeCarregador();
            this.botoesInativos = false;
            this.botaoEnviarInativo = false;
          },
          complete: () => {
            if (this.resp[0]) {
              if (sessionStorage.getItem('oficio-dropdown')) {
                sessionStorage.removeItem('oficio-dropdown');
              }
              this.messageService.add({
                key: 'oficioToast',
                severity: 'success',
                summary: 'ALTERAR OFÍCIO',
                detail: this.resp[2]
              });
              this.ofs.resetOficio();
              this.resetForm();
              this.voltarListar();
            } else {
              this.botoesInativos = false;
              this.botaoEnviarInativo = false;
              console.error('ERRO - ALTERAR ', this.resp[2]);
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
    this.ofs.oficio = this.formOfAlterar.getRawValue();

    for (const chave in this.ofs.oficio) {
      if (this.ofs.oficio[chave] === null) {
        delete this.ofs.oficio[chave];
      }
    }
    this.ofs.oficio.oficio_id = this.oficio_id;
  }

  onPossuiArquivos(ev) {
    this.possuiArquivos = ev;
  }

  onBlockSubmit(ev) {
    this.botaoEnviarInativo = ev;
  }

  ngOnDestroy(): void {
    this.ofs.resetOficio();
    this.sub.forEach(s => s.unsubscribe());
  }


}
