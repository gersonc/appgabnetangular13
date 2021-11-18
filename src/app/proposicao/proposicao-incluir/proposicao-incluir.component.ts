import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { SelectItem, MessageService } from 'primeng/api';
import { DropdownService, MostraMenuService } from '../../_services';
import { AuthenticationService, CarregadorService } from '../../_services';
import { ProposicaoFormulario } from '../_models';
import { ProposicaoFormService, ProposicaoService } from '../_services';

@Component({
  selector: 'app-proposicao-incluir',
  templateUrl: './proposicao-incluir.component.html',
  styleUrls: ['./proposicao-incluir.component.css'],
  providers: [MessageService]
})
export class ProposicaoIncluirComponent implements OnInit, OnDestroy {
  proposicaoIncluir = new ProposicaoFormulario();
  formProp: FormGroup;
  proposicao: ProposicaoFormulario;
  ddProposicao_parecer: SelectItem[];
  ddProposicao_tipo_id: SelectItem[];
  ddProposicao_area_interesse_id: SelectItem[];
  ddProposicao_situacao_id: SelectItem[];
  ddProposicao_origem_id: SelectItem[];
  ddProposicao_orgao_id: SelectItem[];
  ddProposicao_emenda_tipo_id: SelectItem[];
  mostraForm = false;
  mostraAnamento = true;
  mostraModulos1 = 'none';
  foco1 = false;
  mostraModulos2 = 'none';
  mostraModulos3 = 'none';
  ptBr: any;
  sub: Subscription[] = [];
  display = false;
  spinner = false;
  resp: any[];

  botaoEnviarVF = false;
  arquivoDesativado = false;
  enviarArquivos = false;
  clearArquivos = false;
  arquivo_registro_id = 0;
  possuiArquivos = false;

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

  constructor(
    private formBuilder: FormBuilder,
    private dd: DropdownService,
    private pfs: ProposicaoFormService,
    private mm: MostraMenuService,
    private location: Location,
    private messageService: MessageService,
    public authenticationService: AuthenticationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private proposicaoService: ProposicaoService,
    private cs: CarregadorService
  ) {  }

  ngOnInit() {
    this.modulos = {
      toolbar: this.toolbarEditor
    };
    this.pfs.criaProposicao();
    this.pfs.proposicao.proposicao_tipo_id = 0;
    this.carregaDropdownSessionStorage();
    this.configuraCalendario();
    this.criaForm();
    this.cs.escondeCarregador();
  }

  carregaDropdownSessionStorage() {
    this.ddProposicao_parecer = JSON.parse(sessionStorage.getItem('dropdown-parecer'));
    this.ddProposicao_tipo_id = JSON.parse(sessionStorage.getItem('dropdown-tipo_proposicao'));
    this.ddProposicao_area_interesse_id = JSON.parse(sessionStorage.getItem('dropdown-area_interesse'));
    this.ddProposicao_situacao_id = JSON.parse(sessionStorage.getItem('dropdown-situacao_proposicao'));
    this.ddProposicao_origem_id = JSON.parse(sessionStorage.getItem('dropdown-origem_proposicao'));
    this.ddProposicao_orgao_id = JSON.parse(sessionStorage.getItem('dropdown-orgao_proposicao'));
    this.ddProposicao_emenda_tipo_id = JSON.parse(sessionStorage.getItem('dropdown-emenda_proposicao'));
  }

  // ***     FORMULARIO      *************************
  criaForm() {
    this.formProp = this.formBuilder.group({
      proposicao_tipo_id: [this.pfs.proposicao.proposicao_tipo_id],
      proposicao_numero: [this.pfs.proposicao.proposicao_numero],
      proposicao_autor: [this.pfs.proposicao.proposicao_autor],
      proposicao_relator: [this.pfs.proposicao.proposicao_relator],
      proposicao_data_apresentacao: [this.pfs.proposicao.proposicao_data_apresentacao, Validators.required],
      proposicao_area_interesse_id: [this.pfs.proposicao.proposicao_area_interesse_id, Validators.required],
      proposicao_parecer: [this.pfs.proposicao.proposicao_parecer, Validators.required],
      proposicao_origem_id: [this.pfs.proposicao.proposicao_origem_id, Validators.required],
      proposicao_emenda_tipo_id: [this.pfs.proposicao.proposicao_emenda_tipo_id, Validators.required],
      proposicao_situacao_id: [this.pfs.proposicao.proposicao_situacao_id, Validators.required],
      proposicao_ementa: [this.pfs.proposicao.proposicao_ementa],
      proposicao_texto: [this.pfs.proposicao.proposicao_texto],
      proposicao_relator_atual: [this.pfs.proposicao.proposicao_relator_atual],
      proposicao_orgao_id: [this.pfs.proposicao.proposicao_orgao_id],
      andamento_proposicao_data: [this.pfs.proposicao.andamento_proposicao_data],
      andamento_proposicao_texto: [this.pfs.proposicao.andamento_proposicao_texto]
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
    this.formProp.reset();
    this.pfs.resetProposicao();
    this.pfs.proposicao.proposicao_tipo_id = 0;
    if (this.possuiArquivos) {
      this.clearArquivos = true;
    }
    this.arquivoDesativado = false;
    this.mostraForm = false;
    window.scrollTo(0, 0);
    this.cs.escondeCarregador();
  }

  onPossuiArquivos(ev) {
    this.possuiArquivos = ev;
  }

  onUpload(ev) {
    if (ev) {
      this.mostraForm = false;
      this.cs.escondeCarregador();
      this.messageService.add({
        key: 'proposicaoToast',
        severity: 'success',
        summary: 'INCLUIR PROPOSIÇÃO',
        detail: this.resp[2]
      });
      this.resetForm();
      this.botaoEnviarVF = false;
      // this.voltarListar();
    }
  }

  focus1(event) {
    this.foco1 = true;
    this.mostraModulos1 = 'inline-block';
    this.mostraModulos2 = 'none';
    this.mostraModulos3 = 'none';
  }

  focus2(event) {
    this.mostraModulos1 = 'none';
    this.mostraModulos2 = 'inline-block';
    this.mostraModulos3 = 'none';
  }

  focus3(event) {
    this.mostraModulos1 = 'none';
    this.mostraModulos2 = 'none';
    this.mostraModulos3 = 'inline-block';
  }

  onSubmit() {}

  mudaData() {}

  mostrarAndamento() {
    this.mostraAnamento = !this.mostraAnamento;
  }

  showDialog() {
    this.display = true;
  }

  fechar() {
    this.display = false;
  }

  voltarListar() {
    this.cs.escondeCarregador();
    this.clearArquivos = true;
    if (!sessionStorage.getItem('proposicao-busca')) {
      this.mm.showMenu();
    }
    this.router.navigate(['/proposicao']);
  }

  verificaValidTouched(campo: string) {
    return (
      !this.formProp.get(campo).valid &&
      (this.formProp.get(campo).touched || this.formProp.get(campo).dirty)
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
      !this.formProp.get(campo).valid &&
      (this.formProp.get(campo).touched || this.formProp.get(campo).dirty) &&
      situacao
    );
  }

  aplicaCssErroAsync(campo: string, situacao: boolean) {
    return {
      'has-error': this.validaAsync(campo, situacao),
      'has-feedback': this.validaAsync(campo, situacao)
    };
  }

  enviarProposicao() {
    if (this.formProp.valid) {
      this.arquivoDesativado = true;
      this.mostraForm = true;
      this.cs.mostraCarregador();
      this.criaProposicao();
      this.sub.push(this.proposicaoService.incluirProposicao(this.pfs.filtraProposicao())
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: (err) => {
            this.mostraForm = true;
            this.cs.escondeCarregador();
            this.messageService.add({key: 'proposicaoToast', severity: 'warn', summary: 'ERRO INCLUIR', detail: this.resp[2]});
            console.log(err);
          },
          complete: () => {
            if (this.resp[0]) {
              if (sessionStorage.getItem('proposicao-dropdown')) {
                sessionStorage.removeItem('proposicao-dropdown');
              }
              if (this.possuiArquivos) {
                this.arquivo_registro_id = +this.resp[1];
                this.enviarArquivos = true;
              } else {
                this.messageService.add({
                  key: 'proposicaoToast',
                  severity: 'success',
                  summary: 'INCLUIR PROPOSIÇÃO',
                  detail: this.resp[2]
                });
                this.resetForm();
              }
            } else {
              this.mostraForm = false;
              this.cs.escondeCarregador();
              console.error('ERRO - INCLUIR ', this.resp[2]);
              this.messageService.add({
                key: 'proposicaoToast',
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

  criaProposicao() {
    this.pfs.proposicao.proposicao_numero = this.formProp.get('proposicao_numero').value;
    this.pfs.proposicao.proposicao_tipo_id = this.formProp.get('proposicao_tipo_id').value;
    this.pfs.proposicao.proposicao_relator = this.formProp.get('proposicao_relator').value;
    this.pfs.proposicao.proposicao_relator_atual = this.formProp.get('proposicao_relator_atual').value;
    this.pfs.proposicao.proposicao_data_apresentacao = this.formProp.get('proposicao_data_apresentacao').value;
    this.pfs.proposicao.proposicao_area_interesse_id = this.formProp.get('proposicao_area_interesse_id').value;
    this.pfs.proposicao.proposicao_ementa = this.formProp.get('proposicao_ementa').value;
    this.pfs.proposicao.proposicao_texto = this.formProp.get('proposicao_texto').value;
    this.pfs.proposicao.proposicao_situacao_id = this.formProp.get('proposicao_situacao_id').value;
    this.pfs.proposicao.proposicao_parecer = this.formProp.get('proposicao_parecer').value;
    this.pfs.proposicao.proposicao_origem_id = this.formProp.get('proposicao_origem_id').value;
    this.pfs.proposicao.proposicao_orgao_id = this.formProp.get('proposicao_orgao_id').value;
    this.pfs.proposicao.proposicao_emenda_tipo_id = this.formProp.get('proposicao_emenda_tipo_id').value;
    this.pfs.proposicao.proposicao_autor = this.formProp.get('proposicao_autor').value;
    this.pfs.proposicao.andamento_proposicao_data = this.formProp.get('andamento_proposicao_data').value;
    this.pfs.proposicao.andamento_proposicao_texto = this.formProp.get('andamento_proposicao_texto').value;
  }

  onBlockSubmit(ev: boolean) {
    this.mostraForm = ev;
  }

  onNovoRegistroAux(ev) {
    if (ev.campo === 'proposicao_tipo_id') {
      this.ddProposicao_tipo_id = ev.dropdown;
    }
    if (ev.campo === 'proposicao_situacao_id') {
      this.ddProposicao_situacao_id = ev.dropdown;
    }
    if (ev.campo === 'proposicao_orgao_id') {
      this.ddProposicao_orgao_id = ev.dropdown;
    }
    if (ev.campo === 'proposicao_origem_id') {
      this.ddProposicao_origem_id = ev.dropdown;
    }
    if (ev.campo === 'proposicao_emenda_tipo_id') {
      this.ddProposicao_emenda_tipo_id = ev.dropdown;
    }
    this.formProp.get(ev.campo).patchValue(ev.valorId);
  }

  ngOnDestroy(): void {
    this.pfs.resetProposicao();
    this.sub.forEach(s => s.unsubscribe());
  }

}
