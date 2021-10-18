import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SelectItem, MessageService } from 'primeng/api';
import { SolicitacaoFormService } from '../_services';
import { AuthenticationService, CarregadorService } from '../../_services';
import { SolicitacaoService } from '../_services';
import { take } from 'rxjs/operators';
import {
  SolicitacaoAnaliseInterface,
  SolicitacaoCadastroAnalise,
  SolicitacaoCadastroInterface
} from '../_models';

@Component({
  selector: 'app-solicitacao-analisar',
  templateUrl: './solicitacao-analisar.component.html',
  styleUrls: ['./solicitacao-analisar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SolicitacaoAnalisarComponent implements OnInit, OnDestroy {

  formSolicitacaoAnalisar: FormGroup;
  sub: Subscription[] = [];
  solicitacao_id: number;
  ddAcao: SelectItem[] = [];
  cadastro: SolicitacaoCadastroInterface;
  solicitacao: SolicitacaoAnaliseInterface;
  mostraModulos1 = 'none';
  mostraModulos2 = 'none';
  resp: any[];
  processo_id = 0;
  modulos = {
    toolbar: [
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
    ]
  };

  constructor(
    private formBuilder: FormBuilder,
    private sfs: SolicitacaoFormService,
    private solicitacaoService: SolicitacaoService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private cs: CarregadorService
  ) { }

  ngOnInit() {
    this.sfs.criarAnalisar();
    this.sub.push(this.activatedRoute.data.subscribe(
      (data: {dados: SolicitacaoCadastroAnalise}) => {
        this.solicitacao = data.dados.solicitacao;
        this.cadastro = data.dados.cadastro;
      }
    ));
    this.sfs.analise.solicitacao_cadastro_id = this.solicitacao.solicitacao_cadastro_id;
    this.sfs.analise.solicitacao_id = this.solicitacao.solicitacao_id;
    this.solicitacao_id = this.solicitacao.solicitacao_id;
    this.carregaDropdown();
    this.criaForm();
    this.cs.escondeCarregador();
  }

  carregaDropdown() {
    if (this.authenticationService.oficio_incluir) {
      this.ddAcao.push({label: 'ACEITAR SOLICITAÇÃO, ABRIR PROCESSO E INCLUIR DADOS.', value: 1});
    }
    this.ddAcao.push(
      {label: 'SOLICITAÇÃO INVIAVEL.', value: 2},
      {label: 'ACEITAR SOLICITAÇÃO E ABRIR PROCESSO.', value: 3},
      {label: 'SOLICITAÇÃO RESOLVIDA.', value: 4}
      );
  }

  criaForm() {
    this.sfs.analise.solicitacao_id = this.solicitacao.solicitacao_id;

    this.formSolicitacaoAnalisar = this.formBuilder.group({
      acao: [this.sfs.analise.acao, Validators.required],
      solicitacao_aceita_recusada: [this.solicitacao.solicitacao_aceita_recusada],
      solicitacao_carta: [this.solicitacao.solicitacao_carta],
      arquivo: [null],
      solicitacao_id: [this.solicitacao.solicitacao_id]
    });
  }

  onSubmit() {

  }

  enviarAnaliseSolicitacao() {
    this.sfs.analise.solicitacao_id = this.solicitacao.solicitacao_id;
    this.sfs.analise.solicitacao_cadastro_id = this.solicitacao.solicitacao_cadastro_id;
    this.sfs.analise.solicitacao_aceita_recusada = this.formSolicitacaoAnalisar.get('solicitacao_aceita_recusada').value;
    this.sfs.analise.solicitacao_carta = this.formSolicitacaoAnalisar.get('solicitacao_carta').value;
    this.sfs.analise.acao = +this.formSolicitacaoAnalisar.get('acao').value;
    this.sub.push(this.solicitacaoService.postSolicitacaoAnalise(this.sfs.analise)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.resp = dados;
        },
        error: (err) => {
          this.messageService.add({
            key: 'solicitacaoAnalisarToast',
            severity: 'warn',
            summary: 'ERRO ANALISAR',
            detail: this.resp[2]
          });
          console.log(err);
        },
        complete: () => {
          if (this.sfs.analise.acao === 1) {
            this.resetForm();
            this.processo_id = +this.resp[3];
            this.router.navigate(['../oficio/processo', this.processo_id]);
          } else {
            this.messageService.add({
              key: 'solicitacaoAnalisarToast',
              severity: 'success',
              summary: 'SOLICITAÇÃO ANALISADA',
              detail: this.resp[2]
            });
            this.resetForm();
            this.router.navigate(['/solicitacao/listar/busca']);
          }
        }
      }));
  }

  resetForm() {
    this.sfs.resetAnalisar();
    this.formSolicitacaoAnalisar.reset();
  }

  voltarListar(ev?: any) {
    this.router.navigate(['/solicitacao/listar/busca']);
  }

  ngOnDestroy(): void {
    this.sfs.resetAnalisar();
    this.sub.forEach(s => s.unsubscribe());
  }

  verificaValidTouched(campo: string) {
    return (
      !this.formSolicitacaoAnalisar.get(campo).valid &&
      (this.formSolicitacaoAnalisar.get(campo).touched || this.formSolicitacaoAnalisar.get(campo).dirty)
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
      !this.formSolicitacaoAnalisar.get(campo).valid &&
      (this.formSolicitacaoAnalisar.get(campo).touched || this.formSolicitacaoAnalisar.get(campo).dirty) &&
      situacao
    );
  }

  aplicaCssErroAsync(campo: string, situacao: boolean) {
    return {
      'has-error': this.validaAsync(campo, situacao),
      'has-feedback': this.validaAsync(campo, situacao)
    };
  }

  focus1(event) {
    this.mostraModulos1 = 'inline-block';
    this.mostraModulos2 = 'none';
  }
  focus2(event) {
    this.mostraModulos1 = 'none';
    this.mostraModulos2 = 'inline-block';
  }

}
