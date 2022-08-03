import {Component, OnInit} from '@angular/core';
import {SelectItem} from "primeng/api";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PropForm, PropFormI} from "../_models/prop-form-i";
import {ProposicaoListarI} from "../_models/proposicao-listar-i";
import {Subscription} from "rxjs";
import {CpoEditor, InOutCampoTexto} from "../../_models/in-out-campo-texto";
import {DdService} from "../../_services/dd.service";
import {DateTime} from "luxon";
import {AuthenticationService, MenuInternoService} from "../../_services";
import {Router} from "@angular/router";
import {MsgService} from "../../_services/msg.service";
import {ProposicaoFormService} from "../_services/proposicao-form.service";
import {ProposicaoService} from "../_services/proposicao.service";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-proposicao-form',
  templateUrl: './proposicao-form.component.html',
  styleUrls: ['./proposicao-form.component.css']
})
export class ProposicaoFormComponent implements OnInit {

  proposicaoListarI: ProposicaoListarI;
  proposicao: PropFormI;
  formProp: FormGroup;
  ddProposicao_parecer: SelectItem[];
  ddProposicao_tipo_id: SelectItem[];
  ddProposicao_area_interesse_id: SelectItem[];
  ddProposicao_situacao_id: SelectItem[];
  ddProposicao_origem_id: SelectItem[];
  ddProposicao_orgao_id: SelectItem[];
  ddProposicao_emenda_tipo_id: SelectItem[];
  ptBr: any;
  emptyMessage = 'Nenhum registro encontrado.';
  resp: any[] = [];
  sub: Subscription[] = [];
  // botaoEnviarVF = false;
  mostraForm = false;
  arquivoDesativado = false;
  enviarArquivos = false;
  botaoEnviarVF = false;
  clearArquivos = false;
  arquivo_registro_id = 0;
  possuiArquivos = false;
  st0 = 'p-col-12 p-sm-12 p-md-12 p-lg-12 p-xl-12';
  st1 = 'p-col-12 p-sm-12 p-md-12 p-lg-12 p-xl-12';
  st2 = 'p-col-12 p-sm-12 p-md-12 p-lg-12 p-xl-12';
  titulo = 'PROPOSIÇÃO - INCLUIR';
  readonly = false;
  checked: boolean = false;
  fc: any;
  cpoEditor: CpoEditor[] | null = [];
  format0: 'html' | 'object' | 'text' | 'json' = 'html';
  format1: 'html' | 'object' | 'text' | 'json' = 'html';
  format2: 'html' | 'object' | 'text' | 'json' = 'html';
  format3: 'html' | 'object' | 'text' | 'json' = 'html';

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

  sit = false;

  mostraAnamento = true;

  constructor(
    public formBuilder: FormBuilder,
    private dd: DdService,
    public mi: MenuInternoService,
    public aut: AuthenticationService,
    private router: Router,
    private ms: MsgService,
    public pfs: ProposicaoFormService,
    public ps: ProposicaoService
  ) {
  }

  ngOnInit(): void {
    console.log('this.pfs.proposicaoListar', this.pfs.proposicaoListar);
    if (this.pfs.acao === 'incluir') {
      const dt = new Date();
      const hoje = dt.toLocaleString('pt-BR');
    }
    if (this.pfs.acao === 'incluir') {
      this.titulo = 'PROPOSIÇÃO - INCLUIR';
    } else {
      this.titulo = 'PROPOSIÇÃO - ALTERAR';
    }
    this.carregaDropdownSessionStorage();
    this.criaForm();
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

  criaForm() {
    this.formProp = this.formBuilder.group({
      proposicao_tipo_id: [this.pfs.proposicao.proposicao_tipo_id, Validators.required],
      proposicao_numero: [this.pfs.proposicao.proposicao_numero],
      proposicao_autor: [this.pfs.proposicao.proposicao_autor],
      proposicao_relator: [this.pfs.proposicao.proposicao_relator],
      proposicao_data_apresentacao: [null, Validators.required],
      proposicao_area_interesse_id: [this.pfs.proposicao.proposicao_area_interesse_id, Validators.required],
      proposicao_parecer: [this.pfs.proposicao.proposicao_parecer, Validators.required],
      proposicao_origem_id: [this.pfs.proposicao.proposicao_origem_id, Validators.required],
      proposicao_emenda_tipo_id: [this.pfs.proposicao.proposicao_emenda_tipo_id, Validators.required],
      proposicao_situacao_id: [this.pfs.proposicao.proposicao_situacao_id, Validators.required],
      proposicao_ementa: [null],
      proposicao_texto: [null],
      proposicao_relator_atual: [this.pfs.proposicao.proposicao_relator_atual],
      proposicao_orgao_id: [this.pfs.proposicao.proposicao_orgao_id],
      andamento_proposicao_data: [null],
      andamento_proposicao_texto: [null],
      sn_relator_atual: [false],
      sn_orgao: [false],
      sn_situacao: [false]
    });
    this.getValorAlterar();
  }

  getValorAlterar() {

    if (this.pfs.acao === 'incluir') {
      const dt1: DateTime = DateTime.now().setZone('America/Sao_Paulo');
      this.formProp.get('proposicao_data_apresentacao').patchValue(dt1.toJSDate());
    }


    if (this.pfs.acao === 'alterar') {
      const dt1: DateTime = DateTime.fromSQL(this.pfs.proposicao.proposicao_data_apresentacao);
      this.formProp.get('proposicao_data_apresentacao').patchValue(dt1.toJSDate());

      const cp0 = InOutCampoTexto(this.pfs.proposicao.proposicao_ementa, this.pfs.proposicao.proposicao_ementa_delta);
      this.format0 = cp0.format;
      if (cp0.vf) {
        this.formProp.get('proposicao_ementa').setValue(cp0.valor);
      }

      const cp1 = InOutCampoTexto(this.pfs.proposicao.proposicao_texto, this.pfs.proposicao.proposicao_texto_delta);
      this.format1 = cp1.format;
      if (cp1.vf) {
        this.formProp.get('proposicao_texto').setValue(cp1.valor);
      }
    }

      const dt: DateTime = DateTime.now().setZone('America/Sao_Paulo');
      this.formProp.get('andamento_proposicao_data').patchValue(dt.toJSDate());

      /*const cp2 = InOutCampoTexto(this.pfs.proposicao.andamento_proposicao_texto, this.pfs.proposicao.andamento_proposicao_texto_delta);
      this.format2 = cp2.format;
      if (cp2.vf) {
        this.formProp.get('andamento_proposicao_texto').setValue(cp2.valor);
      }*/


  }

  onSubmit() {
    this.mostraForm = true;
    this.botaoEnviarVF = true;
    this.arquivoDesativado = true;
    this.verificaValidacoesForm(this.formProp);
    if (this.formProp.valid) {
      const r = this.formProp.getRawValue();
      console.log('onSubmit', r);
      if (this.pfs.acao === 'incluir') {
        this.incluirProposicao();
      }
      if (this.pfs.acao === 'alterar') {
        this.alterarProposicao();
      }
    } else {
      this.arquivoDesativado = false;
      this.mostraForm = false;
      this.botaoEnviarVF = false;
    }

  }

  criaProposicao() {
    let p = new PropForm();

    p.sn_relator_atual= this.formProp.get('sn_relator_atual').value ? 1 : 0;
    p.sn_orgao= this.formProp.get('sn_orgao').value ? 1 : 0;
    p.sn_situacao= this.formProp.get('sn_situacao').value ? 1 : 0;

    if (this.pfs.acao === 'alterar') {
      p.proposicao_id = +this.pfs.proposicao.proposicao_id;
    }
    p.proposicao_numero = this.formProp.get('proposicao_numero').value;
    p.proposicao_tipo_id = this.formProp.get('proposicao_tipo_id').value;
    p.proposicao_relator = this.formProp.get('proposicao_relator').value;
    p.proposicao_relator_atual = this.formProp.get('proposicao_relator_atual').value;
    if (this.formProp.get('proposicao_data_apresentacao').value !== null) {
      const tmp2: DateTime = DateTime.fromJSDate(this.formProp.get('proposicao_data_apresentacao').value) ;
      p.proposicao_data_apresentacao = tmp2.toSQLDate();
    }
    p.proposicao_area_interesse_id = this.formProp.get('proposicao_area_interesse_id').value;
    if (this.cpoEditor['proposicao_ementa'] !== undefined && this.cpoEditor['proposicao_ementa'] !== null) {
      p.proposicao_ementa = this.cpoEditor['proposicao_ementa'].html;
      p.proposicao_ementa_delta = JSON.stringify(this.cpoEditor['proposicao_ementa'].delta);
      p.proposicao_ementa_texto = this.cpoEditor['proposicao_ementa'].text;
    }
    if (this.cpoEditor['proposicao_texto'] !== undefined && this.cpoEditor['proposicao_texto'] !== null) {
      p.proposicao_texto = this.cpoEditor['proposicao_texto'].html;
      p.proposicao_texto_delta = JSON.stringify(this.cpoEditor['proposicao_texto'].delta);
      p.proposicao_texto_texto = this.cpoEditor['proposicao_texto'].text;
    }
    p.proposicao_situacao_id = this.formProp.get('proposicao_situacao_id').value;
    p.proposicao_parecer = this.formProp.get('proposicao_parecer').value;
    p.proposicao_origem_id = this.formProp.get('proposicao_origem_id').value;
    p.proposicao_orgao_id = this.formProp.get('proposicao_orgao_id').value;
    p.proposicao_emenda_tipo_id = this.formProp.get('proposicao_emenda_tipo_id').value;
    p.proposicao_autor = this.formProp.get('proposicao_autor').value;
    if (this.formProp.get('andamento_proposicao_data').value !== null) {
      const tmp3: DateTime = DateTime.fromJSDate(this.formProp.get('andamento_proposicao_data').value);
      p.andamento_proposicao_data = tmp3.toSQLDate();
    } else {
      p.andamento_proposicao_data = p.proposicao_data_apresentacao;
    }
    if (this.cpoEditor['andamento_proposicao_texto'] !== undefined && this.cpoEditor['andamento_proposicao_texto'] !== null) {
      p.andamento_proposicao_texto = this.cpoEditor['andamento_proposicao_texto'].html;
      p.andamento_proposicao_texto_delta = JSON.stringify(this.cpoEditor['andamento_proposicao_texto'].delta);
      p.andamento_proposicao_texto_texto = this.cpoEditor['andamento_proposicao_texto'].text;
    }
    if (this.pfs.acao === 'incluir') {
      for (const key in p) {
        if (p[key] === null) {
          delete p[key];
        }
      }
    }

    return p;
  }

  incluirProposicao() {
    const p: PropFormI = this.criaProposicao();
    console.log(p);
    this.sub.push(this.ps.incluirProposicao(p)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.resp = dados;
        },
        error: (err) => {
          this.botaoEnviarVF = false;
          this.mostraForm = false;
          this.arquivoDesativado = false;
          this.ms.add({key: 'toastprincipal', severity: 'warn', summary: 'ERRO INCLUIR', detail: this.resp[2]});
          console.error(err);
        },
        complete: () => {
          if (this.resp[0]) {
            if (sessionStorage.getItem('proposicao-menu-dropdown')) {
              sessionStorage.removeItem('proposicao-menu-dropdown');
            }
            if (this.possuiArquivos) {
              this.arquivo_registro_id = +this.resp[1];
              this.enviarArquivos = true;
            } else {
              this.pfs.resetProposicao();
              this.resetForm();
              this.ms.add({
                key: 'toastprincipal',
                severity: 'success',
                summary: 'INCLUIR PROPOSIÇÃO',
                detail: this.resp[2]
              });
              this.voltarListar();
            }
          } else {
            this.botaoEnviarVF = false;
            this.mostraForm = false;
            this.arquivoDesativado = false;
            console.error('ERRO - INCLUIR ', this.resp[2]);
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
    this.botaoEnviarVF = false;
    this.mostraForm = false;
    this.arquivoDesativado = false;
  }

  alterarProposicao() {
    const p: PropFormI = this.criaProposicao();
    console.log(p);
    /*if (this.formProp.valid) {
      this.arquivoDesativado = true;
      const p: PropFormI = this.criaProposicao();
      this.ms.fundoSN(false);
      this.sub.push(this.ps.alterarProposicao(p)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: (err) => {
            this.ms.add({key: 'toastprincipal', severity: 'warn', summary: 'ERRO ALTERAR', detail: this.resp[2]});
            console.error(err);
            this.mostraForm = false;
          },
          complete: () => {
            if (this.resp[0]) {
              sessionStorage.removeItem('proposicao-menu-dropdown');
              this.ms.add({
                key: 'toastprincipal',
                severity: 'success',
                summary: 'ALTERAR PROPOSIÇÃO',
                detail: this.resp[2]
              });
              this.resetForm();
              this.dd.ddSubscription('proposicao-menu-dropdown');
              if (sessionStorage.getItem('proposicao-busca') && this.ps.proposicoes.length > 0) {
                const el: ProposicaoListarI = this.resp[3];
                const id: number = +this.pfs.proposicao.proposicao_id;
                const idx: number = this.ps.proposicoes.findIndex(s => p.proposicao_id = id);
                if (idx !== -1) {
                  this.ps.proposicoes[idx] = el;
                  const c = {
                    data: this.ps.proposicoes[idx],
                    originalEvent: {}
                  }
                  this.ps.onRowExpand(c);
                  this.voltar();
                } else {
                  this.voltarListar();
                }
              } else {
                this.voltarListar();
              }
            } else {
              this.mostraForm = false;
              console.error('ERRO - ALTERAR ', this.resp[2]);
              this.ms.add({key: 'toastprincipal',
                severity: 'warn',
                summary: 'ATENÇÃO - ERRO',
                detail: this.resp[2]
              });
            }
          }
        })
      );
    } else {
      this.verificaValidacoesForm(this.formProp);
    }*/
    this.botaoEnviarVF = false;
    this.mostraForm = false;
    this.arquivoDesativado = false;
  }

  onBlockSubmit(ev: boolean) {
    this.mostraForm = !ev;
  }

  onPossuiArquivos(ev) {
    this.possuiArquivos = ev;
  }

  onUpload(ev) {
    if (ev) {
      this.ms.add({
        key: 'toastprincipal',
        severity: 'success',
        summary: 'INCLUIR PROPOSIÇÃO',
        detail: this.resp[2]
      });
      this.dd.ddSubscription('proposicao-menu-dropdown');
      this.pfs.resetProposicao();
      this.resetForm();
      this.resp = [];
      this.voltarListar();
    }
  }

  voltarListar() {
    this.pfs.proposicaoListar = undefined;
    this.pfs.acao = null;
    if (sessionStorage.getItem('proposicao-busca')) {
      this.router.navigate(['/proposicao/listar']);
    } else {
      this.router.navigate(['/proposicao/listar2']);
    }
  }

  voltar() {
    this.pfs.resetProposicao();
    this.pfs.proposicaoListar = undefined;
    this.pfs.acao = null;
    this.ps.stateSN = false;
    sessionStorage.removeItem('proposicao-busca');
    this.router.navigate(['/proposicao/listar2']);
  }

  resetForm() {
    this.mostraForm = false;
    if (this.pfs.acao === 'incluir') {
      this.formProp.reset();
    } else {
      this.criaForm();
    }
    if (this.possuiArquivos) {
      this.clearArquivos = true;
    }
    this.possuiArquivos = false;
    this.arquivoDesativado = true;
    window.scrollTo(0, 0);
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
      'ng-invalid': this.verificaValidTouched(campo),
      'ng-dirty': this.verificaValidTouched(campo)
    };
  }

  validaAsync(campo: string, situacao: boolean) {
    return (
      ((!this.formProp.get(campo).valid || situacao) && (this.formProp.get(campo).touched || this.formProp.get(campo).dirty))
    );
  }

  aplicaCssErroAsync(campo: string, situacao: boolean) {
    return {
      'ng-invalid': this.validaAsync(campo, situacao),
      'ng-dirty': this.validaAsync(campo, situacao)
    };
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

  mostrarAndamento() {
    this.mostraAnamento = !this.mostraAnamento;
  }

 trocaSituacao(ev) {
   this.sit =  ev.checked;
 }

  onContentChanged(ev, campo: string) {
    this.cpoEditor[campo] = {
      html: ev.html,
      delta: ev.content,
      text: ev.text
    }
  }

  ngOnDestroy(): void {
    this.pfs.resetProposicao();
    this.sub.forEach(s => s.unsubscribe());
  }

}
