import {Component, OnDestroy, OnInit} from '@angular/core';
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
// import {Editor} from "primeng/editor";
import {take} from "rxjs/operators";
import {CpoEditor, InOutCampoTexto} from "../../_models/in-out-campo-tezto";
import {MsgService} from "../../_services/msg.service";
import {OficioFormService} from "../../oficio/_services";

@Component({
  selector: 'app-solic-analisar',
  templateUrl: './solic-analisar.component.html',
  styleUrls: ['./solic-analisar.component.css']
})
export class SolicAnalisarComponent implements OnInit, OnDestroy {
  /*@ViewChild('soldesc', {static: true}) soldesc: Editor;
  @ViewChild('solacerecus', {static: true}) solacerecus: Editor;
  @ViewChild('histand', {static: true}) histand: Editor;
  @ViewChild('solcar', {static: true}) solcar: Editor;*/
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
  msgSolNumPro = 'Já existe processo com esse número.';
  tituloNumOfi = 'Número do ofício';
  solNumOfi = false;
  solNumPro = false;
  sgstNumPro: string | null = null;


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
  cpoEditor: CpoEditor[] | null = [];
  format0: 'html' | 'object' | 'text' | 'json' = 'html';
  format1: 'html' | 'object' | 'text' | 'json' = 'html';
  format2: 'html' | 'object' | 'text' | 'json' = 'html';

  constructor(
    private formBuilder: FormBuilder,
    public sfs: SolicFormService,
    public ss: SolicService,
    public aut: AuthenticationService,
    public vs: VersaoService,
    private ms: MsgService,
    private router: Router,
    private ofs: OficioFormService
  ) { }

  ngOnInit() {
    this.sfs.acao = 'analisar';
    this.criaForm();
    if (this.aut.solicitacaoVersao === 1) {
      this.sub.push(this.ss.getSgstNumProcesso().pipe(take(1)).subscribe(dados => {
        this.sgstNumPro = dados[0];
        this.formSol.get('processo_numero').setValue(dados[0]);
      }));
    }
  }

  criaForm() {
    this.format0 = 'html';
    this.cpoEditor['historico_andamento'] = null;
    this.cpoEditor['solicitacao_carta'] = null;
    this.cpoEditor['solicitacao_aceita_recusada'] = null;


    if (this.vs.solicitacaoVersao === 1) {
      this.msgSolNumOfi = 'Já existe processo(s) com esse número.'
      this.tituloNumOfi = 'Número do processo';
      this.formSol = this.formBuilder.group({
        solicitacao_tipo_analize: [this.sfs.solA.solicitacao_tipo_analize, Validators.required],
        solicitacao_aceita_recusada: [null],
        solicitacao_carta: [null],
        solicitacao_numero_oficio: [this.sfs.solA.solicitacao_numero_oficio],
        processo_numero: [null],
        historico_andamento: [null]
      });

      const cp1 = InOutCampoTexto(this.sfs.solA.solicitacao_carta, this.sfs.solA.solicitacao_carta_delta);
      this.format1 = cp1.format;
      if (cp1.vf) {
        this.formSol.get('solicitacao_carta').setValue(cp1.valor);
      }
    } else {
      this.formSol = this.formBuilder.group({
        solicitacao_tipo_analize: [this.sfs.solA.solicitacao_tipo_analize, Validators.required],
        solicitacao_numero_oficio: [this.sfs.solA.solicitacao_numero_oficio],
        solicitacao_aceita_recusada: [null],
        historico_andamento: [null]
      });
    }
    const cp0 = InOutCampoTexto(this.sfs.solA.solicitacao_aceita_recusada!, this.sfs.solA.solicitacao_aceita_recusada_delta);
    this.format0 = cp0.format;
    if (cp0.vf) {
      this.formSol.get('solicitacao_aceita_recusada').setValue(cp0.valor);
    }

    const cp2 = InOutCampoTexto(this.sfs.solA.historico_andamento!, this.sfs.solA.historico_andamento);
    this.format2 = cp2.format;
    if (cp2.vf) {
      this.formSol.get('historico_andamento').setValue(cp2.valor);
    }

  }

  onSubmit() {
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

      if (this.formSol.get('processo_numero').value) {
        if (this.sfs.solA.processo_numero !== this.formSol.get('processo_numero').value) {
          solicitacao.processo_numero = this.formSol.get('processo_numero').value;
        }
      }

      if (this.cpoEditor['historico_andamento'] !== null) {
        solicitacao.historico_andamento = this.cpoEditor['historico_andamento'].html;
        solicitacao.historico_andamento_delta = JSON.stringify(this.cpoEditor['historico_andamento'].delta);
        solicitacao.historico_andamento_texto = this.cpoEditor['historico_andamento'].text;
      }

      if (this.cpoEditor['solicitacao_aceita_recusada'] !== null) {
        if (this.cpoEditor['solicitacao_aceita_recusada'].html !== this.sfs.solA.solicitacao_aceita_recusada) {
          solicitacao.solicitacao_aceita_recusada = this.cpoEditor['solicitacao_aceita_recusada'].html;
          solicitacao.solicitacao_aceita_recusada_delta = JSON.stringify(this.cpoEditor['solicitacao_aceita_recusada'].delta);
          solicitacao.solicitacao_aceita_recusada_texto = this.cpoEditor['solicitacao_aceita_recusada'].text;
        }
      }

      if (this.vs.solicitacaoVersao === 1) {
        if (this.cpoEditor['solicitacao_carta'] !== null) {
          if (this.cpoEditor['solicitacao_carta'].html !== this.sfs.solA.solicitacao_carta) {
            solicitacao.solicitacao_carta = this.cpoEditor['solicitacao_carta'].html;
            solicitacao.solicitacao_carta_delta = JSON.stringify(this.cpoEditor['solicitacao_carta'].delta);
            solicitacao.solicitacao_carta_texto = this.cpoEditor['solicitacao_carta'].text;
          }
        }
      }
      solicitacao.solicitacao_id = this.sfs.solA.solicitacao_id;
      solicitacao.solicitacao_cadastro_id = this.sfs.solA.solicitacao_cadastro_id;

      if (this.sfs.processoSN) {
        solicitacao.solicitacao_numero_oficio = null;
      } else {
        solicitacao.processo_numero = null;
      }
      console.log('onSubmit', solicitacao);
      this.enviarAnaliseSolicitacao(solicitacao)
    }
    console.log('form', this.formSol.getRawValue());
  }

  enviarAnaliseSolicitacao(s: SolicFormAnalisar) {
    this.sub.push(this.ss.analisarSolicitacao(s)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.resp = dados;
        },
        error: (err) => {
          this.ms.add({
            key: 'principal',
            severity: 'warn',
            summary: 'ERRO ANALISAR',
            detail: this.resp[2]
          });
          console.log(err);
        },
        complete: () => {
          this.ms.add({
            key: 'pricipal',
            severity: 'success',
            summary: 'SOLICITAÇÃO ANALISADA',
            detail: this.resp[2]
          });
          this.resetForm();
          sessionStorage.removeItem('solic-menu-dropdown');
          if (this.resp[4] > 0) {
            this.ofs.solicitacao_id = +this.resp[1];
            this.ofs.processo_id = +this.resp[4];
            this.ofs.url = '../solic/listar2';
            this.router.navigate(['../oficio/solicitacao']);
          } else {
            this.voltarListar();
          }
        }
      }));
  }

  resetForm() {
    this.formSol.reset();
  }

  voltarListar() {
    this.sfs.solicListar = {};
    this.sfs.resetSolicitacao();
    if (sessionStorage.getItem('solic-busca')) {
      this.router.navigate(['/solic/listar/busca']);
    } else {
      this.router.navigate(['/solic/listar']);
    }
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
      'ng-invalid': (this.verificaValidTouched(campo) || this.verificaValidTouched(campo))
    };
  }

  validaAsync(campo: string, situacao: boolean) {
    return (
      ((!this.formSol.get(campo).valid || situacao) && (this.formSol.get(campo).touched || this.formSol.get(campo).dirty))
    );
  }

  aplicaCssErroAsync(campo: string, situacao: boolean) {
    return {
        'ng-invalid': this.validaAsync(campo, situacao),
        'ng-dirty': this.validaAsync(campo,situacao)
      };
  }

/*  testaCampoQuill(v: string | null | undefined): boolean {
    if (v === null || v === undefined) {
      return false;
    } else {
      return v.length !== 0;
    }
  }*/

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
            this.aplicaCssErroAsync('solicitacao_numero_oficio', !resp);
            this.solNumOfi = !resp[0];
          }
        }));
      }
    }
  }

  verificaNumProcesso(ev) {
    let np = this.formSol.get('processo_numero').value;
    let nPro = '';
    console.log('verificaNumProcesso1', ev, np);
    if (typeof this.sfs.solA.processo_numero !== 'undefined' &&
      this.sfs.solA.processo_numero !== null &&
      this.sfs.solA.processo_numero.length > 0) {
      nPro = this.sfs.solA.processo_numero;
    }
    if (nPro !== np && np !== this.sgstNumPro) {
      const dado = {'processo_numero': np};
      this.sub.push(this.ss.postVerificarNumProesso(dado).pipe(take(1)).subscribe(r => {
        const resp: boolean = r[0];
        console.log('verificaNumProcesso2', resp);
        this.solNumPro = !resp;
        this.aplicaCssErroAsync('processo_numero', !resp);
      }));
    }
  }

  getInvalid() {
    return (this.solNumPro) ? 'ng-invalid': null;
  }

  onContentChanged(ev, campo: string) {
    this.cpoEditor[campo] = {
      html: ev.html,
      delta: ev.content,
      text: ev.text
    }
  }

  numProceChange(ev) {
    console.log('numProceChange', ev);
  }

  onPossuiArquivos(ev) {

  }

  ngOnDestroy(): void {
    this.sfs.resetSolicitacaoAnalise();
    this.sub.forEach(s => s.unsubscribe());
  }

}
