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
import {take} from "rxjs/operators";

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
  // info: number = 0;
  formAtivo = true;
  msgSolNumOfi = 'Já existe ofício(s) com esse número.';
  tituloNumOfi = 'Número do ofício';
  solNumOfi = false;


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
    // this.solicitacao = this.sfs.solA;
    // this.carregaDropdown();
    this.criaForm();
  }

  /*carregaDropdown() {
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

  }*/

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
    if (this.vs.solicitacaoVersao === 1) {
      this.msgSolNumOfi = 'Já existe processo(s) com esse número.'
      this.tituloNumOfi = 'Número do processo';
      this.formSol = this.formBuilder.group({
        solicitacao_tipo_analize: [this.sfs.solA.solicitacao_tipo_analize, Validators.required],
        solicitacao_aceita_recusada: [null],
        solicitacao_carta: [null],
        solicitacao_numero_oficio: [this.sfs.solA.solicitacao_numero_oficio],
        historico_andamento: [null]
      });


      if (this.testaCampoQuill(this.sfs.solA.solicitacao_aceita_recusada_delta)) {
        const ql2delta = JSON.parse(this.sfs.solA.solicitacao_aceita_recusada_delta);
        this.solacerecus.getQuill().setContents(ql2delta);
      } else {
        if (this.testaCampoQuill(this.sfs.solA.solicitacao_aceita_recusada!)) {
          this.formSol.get('solicitacao_aceita_recusada').patchValue(this.sfs.solA.solicitacao_aceita_recusada!);
        }
      }

      if (this.testaCampoQuill(this.sfs.solA.solicitacao_carta_delta)) {
        const ql3delta = JSON.parse(this.sfs.solA.solicitacao_carta_delta);
        this.solcar.getQuill().setContents(ql3delta);
      } else {
        if (this.testaCampoQuill(this.sfs.solA.solicitacao_carta)) {
          this.formSol.get('solicitacao_carta').patchValue(this.sfs.solA.solicitacao_carta);
        }
      }
    } else {
      this.formSol = this.formBuilder.group({
        solicitacao_tipo_analize: [this.sfs.solA.solicitacao_tipo_analize, Validators.required],
        solicitacao_numero_oficio: [this.sfs.solA.solicitacao_numero_oficio],
        historico_andamento: [null]
      });
    }

  }

  onSubmit() {
    this.formAtivo = false;
    if (
      this.formSol.get('solicitacao_tipo_analize').value > 0 ||
      this.formSol.get('solicitacao_tipo_analize').value < 22) {

      let solicitacao = new SolicFormAnalisar();
      solicitacao.solicitacao_tipo_analize = this.formSol.get('solicitacao_tipo_analize').value;
      solicitacao.solicitacao_id = this.sfs.solA.solicitacao_id;
      solicitacao.solicitacao_cadastro_id = this.sfs.solA.solicitacao_cadastro_id;
      solicitacao.solicitacao_numero_oficio = this.formSol.get('solicitacao_numero_oficio').value;

      if (this.formSol.get('solicitacao_numero_oficio').value) {
        if (this.sfs.solA.solicitacao_numero_oficio !== this.formSol.get('solicitacao_numero_oficio').value) {
          solicitacao.solicitacao_numero_oficio = this.formSol.get('solicitacao_numero_oficio').value;
        }
      }

      if (this.formSol.get('historico_andamento').value) {
        const ql3: any = this.histand.getQuill();
        solicitacao.historico_andamento = this.formSol.get('historico_andamento').value;
        solicitacao.historico_andamento_delta = JSON.stringify(ql3.getContents());
        solicitacao.historico_andamento_texto = ql3.getText();
      }

      if (this.vs.solicitacaoVersao === 1) {
        if (this.formSol.get('solicitacao_carta').value) {
          const ql4: any = this.solacerecus.getQuill();
          if (this.sfs.solA.solicitacao_carta_texto !== ql4.getText()) {
            solicitacao.solicitacao_carta = this.formSol.get('solicitacao_aceita_recusada').value;
            solicitacao.solicitacao_carta_delta = JSON.stringify(ql4.getContents());
            solicitacao.solicitacao_carta_texto = ql4.getText();
          }
        }

        if (this.formSol.get('solicitacao_aceita_recusada').value) {
          const ql2: any = this.solacerecus.getQuill();
          if (this.sfs.solA.solicitacao_aceita_recusada_texto !== ql2.getText()) {
            solicitacao.solicitacao_aceita_recusada = this.formSol.get('solicitacao_aceita_recusada').value;
            solicitacao.solicitacao_aceita_recusada_delta = JSON.stringify(ql2.getContents());
            solicitacao.solicitacao_aceita_recusada_texto = ql2.getText();
          }
        }
      }


    } else {
      this.formAtivo = true;
    }
    console.log('form', this.formSol.getRawValue());
  }

  enviarAnaliseSolicitacao(s: SolicFormAnalisar) {


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

  /*criaEnvio(): SolicFormAnalisar {
    console.log('form', this.formSol.getRawValue());
    console.log('sfs.solA', this.sfs.solA);
    let solicitacao = new SolicFormAnalisar();
    solicitacao.solicitacao_id = this.sfs.solA.solicitacao_id;
    solicitacao.solicitacao_cadastro_id = this.sfs.solA.solicitacao_cadastro_id;

    if (this.formSol.get('solicitacao_aceita_recusada').value) {
      const ql2: any = this.solacerecus.getQuill();
      if (this.sfs.solA.solicitacao_aceita_recusada_texto !== ql2.getText()) {
        console.log('diferente1');
        solicitacao.solicitacao_aceita_recusada = this.formSol.get('solicitacao_aceita_recusada').value;
        solicitacao.solicitacao_aceita_recusada_delta = JSON.stringify(ql2.getContents());
        solicitacao.solicitacao_aceita_recusada_texto = ql2.getText();
      } else {
        console.log('igual1');
      }
    }

    if (this.formSol.get('historico_andamento').value) {
      const ql3: any = this.histand.getQuill();
      solicitacao.historico_andamento = this.formSol.get('historico_andamento').value;
      solicitacao.historico_andamento_delta = JSON.stringify(ql3.getContents());
      solicitacao.historico_andamento_texto = ql3.getText();

    }
    if (this.vs.solicitacaoVersao === 1) {
      if (this.formSol.get('solicitacao_carta').value) {
        const ql4: any = this.solacerecus.getQuill();
        if (this.sfs.solA.solicitacao_carta_texto !== ql4.getText()) {
          console.log('diferente2');
          solicitacao.solicitacao_carta = this.formSol.get('solicitacao_aceita_recusada').value;
          solicitacao.solicitacao_carta_delta = JSON.stringify(ql4.getContents());
          solicitacao.solicitacao_carta_texto = ql4.getText();
        } else {
          console.log('igual2');
        }
      }

    }

    solicitacao.solicitacao_tipo_analize = this.formSol.get('solicitacao_tipo_analize').value;
    console.log('criaEnvio', solicitacao);

    return solicitacao;

  }*/

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

  verificaNumOficio(ev) {
    console.log(this.formSol.get('solicitacao_numero_oficio').value);
    if (this.sfs.solA.solicitacao_numero_oficio !== this.formSol.get('solicitacao_numero_oficio').value) {
      let of = this.formSol.get('solicitacao_numero_oficio').value;
      if (of.length > 0) {
        let resp: any[] = [];
        const dados: any = {
          solicitacao_numero_oficio: of
        }
        this.sub.push(this.ss.postVerificarNumOficio(dados).pipe(take(1)).subscribe(r => {
          resp = r;
          console.log(resp);
          if (resp[0]) {
            this.solNumOfi = true;
          }
        }));
      }
    }
  }


  onPossuiArquivos(ev) {

  }


}