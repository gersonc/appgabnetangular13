import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {SelectItem} from "primeng/api";
import {AuthenticationService} from "../../_services";
import {Router} from "@angular/router";
import {SolicFormService} from "../_services/solic-form.service";
import {SolicService} from "../_services/solic.service";
import {VersaoService} from "../../_services/versao.service";
import {SolicFormAnalisar} from "../_models/solic-form-analisar-i";
import {SolicListarI} from "../_models/solic-listar-i";
import {Editor} from "primeng/editor";
import {SolicInformacao} from "../_models/solic-informacao";

@Component({
  selector: 'app-solic-analisar',
  templateUrl: './solic-analisar.component.html',
  styleUrls: ['./solic-analisar.component.css']
})
export class SolicAnalisarComponent implements OnInit {
  @ViewChild('soldesc', {static: true}) soldesc: Editor;
  @ViewChild('solacerecus', {static: true}) solacerecus: Editor;
  @ViewChild('histand', {static: true}) histand: Editor;
  @ViewChild('solcar', {static: true}) solcar: Editor;
  formSol: FormGroup;
  sub: Subscription[] = [];
  // solicitacao_id: number;
  ddAcao: SelectItem[] = [];
  // cadastro: SolicitacaoCadastroInterface;
  solicitacao?: SolicFormAnalisar;
  // mostraModulos1 = 'none';
  // mostraModulos2 = 'none';
  resp: any[];
  // processo_id = 0;
  sol?: SolicListarI;
  arquivoDesativado = false;
  info?: SolicInformacao;



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
      ['clean'],                                         // remove formatting button
      ['link']                         // link and image, video
    ]
  };

  constructor(
    private formBuilder: FormBuilder,
    public sfs: SolicFormService,
    public ss: SolicService,
    public aut: AuthenticationService,
    public vs: VersaoService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    // this.sol = this.sfs.solicListar;
    this.info = this.sfs.info[0];
    this.solicitacao = this.sfs.solA;
    // this.carregaDropdown();
    this.criaForm();
  }

  carregaDropdown() {
    this.ddAcao = [];
    if (this.vs.solicitacaoVersao === 1) {
      this.ddAcao.push(
        {label: 'Deferido - Aceitar solicitação sem processo', value: 7},
        {label: 'Aceitar solicitação e abrir processo', value: 1}
      );
      if (this.aut.oficio_incluir) {
        this.ddAcao.push({label: 'Aceitar solicitação, abrir processo e incluir ofíco(s)', value: 2});
      }
      this.ddAcao.push(
        {label: 'Indeferido - Solicitação inviável', value: 3},
        {label: 'Indeferido - Solicitação inviável', value: 4},
        {label: 'Solicitação resolvida', value: 5},
        {label: 'Suspenso', value: 6}
      );
    }
    if (this.vs.solicitacaoVersao > 1) {
      this.ddAcao.push(
        {label: 'Em aberto', value: 7},
        {label: 'Deferido', value: 8},
        {label: 'Indeferido', value: 9},
        {label: 'Em andamento', value: 10},
        {label: 'Suspenso', value: 11}
      );
    }

  }

  /*carregaDropdown() {
    if (this.aut.solicitacao_analisar) {
      this.ddAcao.push({label: 'ACEITAR SOLICITAÇÃO, ABRIR PROCESSO E INCLUIR DADOS.', value: 1});
    }
    this.ddAcao.push(
      {label: 'SOLICITAÇÃO INVIAVEL.', value: 2},
      {label: 'ACEITAR SOLICITAÇÃO E ABRIR PROCESSO.', value: 3},
      {label: 'SOLICITAÇÃO RESOLVIDA.', value: 4}
    );
  }*/

  criaForm() {
    this.formSol = this.formBuilder.group({
      acao: [null, Validators.required],
      solicitacao_aceita_recusada: [null],
      solicitacao_carta: [null],
      historico_andamento: [null]
    });

    if (this.testaCampoQuill(this.solicitacao.solicitacao_aceita_recusada_delta)) {
      const ql2delta = JSON.parse(this.solicitacao.solicitacao_aceita_recusada_delta);
      this.solacerecus.getQuill().setContents(ql2delta);
    } else {
      if (this.testaCampoQuill(this.solicitacao.solicitacao_aceita_recusada)) {
        this.formSol.get('solicitacao_aceita_recusada').patchValue(this.solicitacao.solicitacao_aceita_recusada);
      }
    }

    if (this.testaCampoQuill(this.solicitacao.solicitacao_carta_delta)) {
      const ql3delta = JSON.parse(this.solicitacao.solicitacao_carta_delta);
      this.solcar.getQuill().setContents(ql3delta);
    } else {
      if (this.testaCampoQuill(this.solicitacao.solicitacao_carta)) {
        this.formSol.get('solicitacao_carta').patchValue(this.solicitacao.solicitacao_carta);
      }
    }
  }

  onSubmit() {

  }

  enviarAnaliseSolicitacao() {
    /*this.sfs.analise.solicitacao_id = this.solicitacao.solicitacao_id;
    this.sfs.analise.solicitacao_cadastro_id = this.solicitacao.solicitacao_cadastro_id;
    this.sfs.analise.solicitacao_aceita_recusada = this.formSol.get('solicitacao_aceita_recusada').value;
    this.sfs.analise.solicitacao_carta = this.formSol.get('solicitacao_carta').value;
    this.sfs.analise.acao = +this.formSol.get('acao').value;
    this.sub.push(this.ss.postSolicitacaoAnalise(this.sfs.analise)
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
      }));*/
  }

  resetForm() {
    // this.sfs.resetAnalisar();
    this.formSol.reset();
  }

  voltarListar() {
    this.router.navigate(['/solic/listar']);
  }

  ngOnDestroy(): void {
    this.sfs.resetSolicitacaoAnalise();
    this.sub.forEach(s => s.unsubscribe());
  }

  verificaValidTouched(campo: string) {
    return (
      !this.formSol.get(campo).valid &&
      (this.formSol.get(campo).touched || this.formSol.get(campo).dirty)
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
      !this.formSol.get(campo).valid &&
      (this.formSol.get(campo).touched || this.formSol.get(campo).dirty) &&
      situacao
    );
  }

  aplicaCssErroAsync(campo: string, situacao: boolean) {
    return {
      'has-error': this.validaAsync(campo, situacao),
      'has-feedback': this.validaAsync(campo, situacao)
    };
  }

  testaCampoQuill(v: string | null | undefined): boolean {
    if (v === null || v === undefined) {
      return false;
    } else {
      return v.length !== 0;
    }
  }

  onChangeAcao(ev: any) {
    if (ev.value !== undefined) {
      this.info = this.sfs.info[+ev.value];
    } else {
      this.info = this.sfs.info[0];
    }

  }

  /*focus1(event) {
    this.mostraModulos1 = 'inline-block';
    this.mostraModulos2 = 'none';
  }
  focus2(event) {
    this.mostraModulos1 = 'none';
    this.mostraModulos2 = 'inline-block';
  }*/

  onPossuiArquivos(ev) {

  }



}
