import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DdService} from "../../_services/dd.service";
import {AuthenticationService, AutocompleteService, CepService, MenuInternoService} from "../../_services";
import {ActivatedRoute, Router} from "@angular/router";
import {MsgService} from "../../_services/msg.service";
import {CadastroFormService} from "../_services/cadastro-form.service";
import {EMPTY, Subscription} from "rxjs";
import {CpoEditor} from "../../_models/in-out-campo-texto";
import Quill from "quill";
import {SelectItem, SelectItemGroup} from "primeng/api";
import {CadastroDuplicadoI} from "../_models/cadastro-duplicado-i";
import {WindowsService} from "../../_layout/_service";
import {catchError, take} from "rxjs/operators";
import {CEPError, Endereco, NgxViacepService} from "@brunoc/ngx-viacep";
import {CadastroService} from "../_services/cadastro.service";

@Component({
  selector: 'app-cadastro-form',
  templateUrl: './cadastro-form.component.html',
  styleUrls: ['./cadastro-form.component.css']
})
export class CadastroFormComponent implements OnInit, OnDestroy {
  formCadastro: FormGroup;
  municipio: any;
  regiao: any;
  tipotipo = 1;
  resp: any[] = [];
  sub: Subscription[] = [];
  mostraForm = true;
  disableSubmit = false;
  botaoEnviarVF = false;
  arquivoDesativado = false;
  enviarArquivos = false;
  clearArquivos = false;
  arquivo_registro_id = 0;
  possuiArquivos = false;
  lazy = false;
  titulo = 'CADASTRO';

  ddTipoCadastroId: SelectItemGroup[] = [];
  ddTratamento: SelectItem[] = [];
  ddGrupo: SelectItem[] = [];
  ddMunicipioId: SelectItem[] = [];
  ddEstadoId: SelectItem[] = [];
  ddRegiaoId: SelectItem[] = [];
  ddEscolaridadeId: SelectItem[] = [];
  ddEstadoCivilId: SelectItem[] = [];
  ddSexo: SelectItem[] = [];
  ddCampo4Id: SelectItem[] = [];

  cad: CadastroDuplicadoI[] = [];
  altura = (WindowsService.altura - 150) + 'px';
  block = true;

  nomeDuplicado = false;
  validaTratamento = false;
  validaNome = false;
  validaMunicipio = false;
  validaRegiao = false;
  validaEstado = false;

  format0: 'html' | 'object' | 'text' | 'json' = 'html';
  format1: 'html' | 'object' | 'text' | 'json' = 'html';
  kill0: Quill;
  kill1: Quill;
  cpoEditor: CpoEditor[] | null = [];
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



  constructor(
    public formBuilder: FormBuilder,
    private dd: DdService,
    public mi: MenuInternoService,
    private autocompleteservice: AutocompleteService,
    public aut: AuthenticationService,
    public cfs: CadastroFormService,
    public cs: CadastroService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private ms: MsgService,
    private viacep: NgxViacepService,
    private cepService: CepService,
  ) { }

  ngOnInit(): void {
    if (this.cfs.acao === 'incluir') {
      this.titulo = 'CADASTRO - INCLUIR';
    } else {
      this.titulo = 'CADASTRO - ALTERAR';
    }
    this.carregaDropdownSessionStorage();
    this.criaForm();
  }

  // ***     FORMULARIO      *************************
  criaForm() {
    this.formCadastro = this.formBuilder.group({
      cadastro_tipo_id: [this.cfs.cadastro.cadastro_tipo_id, Validators.required],
      cadastro_tratamento_id: [this.cfs.cadastro.cadastro_tratamento_id, Validators.required],
      cadastro_nome: [this.cfs.cadastro.cadastro_nome, [Validators.required, Validators.minLength(2)]],
      cadastro_apelido: [this.cfs.cadastro.cadastro_apelido],
      cadastro_sigla: [this.cfs.cadastro.cadastro_sigla],
      cadastro_responsavel: [this.cfs.cadastro.cadastro_responsavel],
      cadastro_cargo: [this.cfs.cadastro.cadastro_cargo],
      cadastro_grupo_id: [this.cfs.cadastro.cadastro_grupo_id],
      cadastro_endereco: [this.cfs.cadastro.cadastro_endereco],
      cadastro_endereco_numero: [this.cfs.cadastro.cadastro_endereco_numero],
      cadastro_endereco_complemento: [this.cfs.cadastro.cadastro_endereco_complemento],
      cadastro_bairro: [this.cfs.cadastro.cadastro_bairro],
      cadastro_municipio_id: [this.cfs.cadastro.cadastro_municipio_id, Validators.required],
      cadastro_cep: [this.cfs.cadastro.cadastro_cep],
      cadastro_estado_id: [this.cfs.cadastro.cadastro_estado_id, Validators.required],
      cadastro_telefone: [this.cfs.cadastro.cadastro_telefone],
      cadastro_telcom: [this.cfs.cadastro.cadastro_telcom],
      cadastro_telefone2: [this.cfs.cadastro.cadastro_telefone2],
      cadastro_celular: [this.cfs.cadastro.cadastro_celular],
      cadastro_celular2: [this.cfs.cadastro.cadastro_celular2],
      cadastro_fax: [this.cfs.cadastro.cadastro_fax],
      cadastro_email: [this.cfs.cadastro.cadastro_email, Validators.email],
      cadastro_email2: [this.cfs.cadastro.cadastro_email2, Validators.email],
      cadastro_rede_social: [this.cfs.cadastro.cadastro_rede_social],
      cadastro_outras_midias: [this.cfs.cadastro.cadastro_outras_midias],
      cadastro_cpfcnpj: [this.cfs.cadastro.cadastro_cpfcnpj],
      cadastro_rg: [this.cfs.cadastro.cadastro_rg],
      cadastro_estado_civil_id: [this.cfs.cadastro.cadastro_estado_civil_id],
      cadastro_data_nascimento: [this.cfs.cadastro.cadastro_data_nascimento],
      cadastro_conjuge: [this.cfs.cadastro.cadastro_conjuge],
      cadastro_escolaridade_id: [this.cfs.cadastro.cadastro_escolaridade_id],
      cadastro_profissao: [this.cfs.cadastro.cadastro_profissao],
      cadastro_sexo: [this.cfs.cadastro.cadastro_sexo],
      cadastro_zona: [this.cfs.cadastro.cadastro_zona],
      cadastro_jornal: [this.cfs.cadastro.cadastro_jornal],
      cadastro_mala: [this.cfs.cadastro.cadastro_mala],
      cadastro_agenda: [this.cfs.cadastro.cadastro_agenda],
      cadastro_sigilo: [this.cfs.cadastro.cadastro_sigilo],
      cadastro_campo1: [this.cfs.cadastro.cadastro_campo1],
      cadastro_campo2: [this.cfs.cadastro.cadastro_campo2],
      cadastro_campo3: [this.cfs.cadastro.cadastro_campo3],
      cadastro_campo4_id: [this.cfs.cadastro.cadastro_campo4_id],
      cadastro_observacao: [this.cfs.cadastro.cadastro_observacao],
      // mun_nome: [this.cfs.mun_nome, [Validators.min(2), Validators.max(50)]],
      cadastro_regiao_id: [this.cfs.cadastro.cadastro_regiao_id],
      // reg_nome: [this.cfs.reg_nome, [Validators.min(2), Validators.max(50)]]
    });
    this.formCadastro.disable();
    this.formCadastro.get('cadastro_tipo_id').enable();
  }

  onEditorCreated(ev, campo) {
    if (campo === 'tarefa_tarefa'){
      this.kill0 = ev;
      this.kill0.update('user');
    }
    if (campo === 'th_historico'){
      this.kill1 = ev;
      this.kill1.update('user');
    }
    // this.kdisabled = true;
  }

  onContentChanged(ev, campo: string) {
    this.cpoEditor[campo] = {
      html: ev.html,
      delta: ev.content,
      text: ev.text
    }
  }

  carregaDropdownSessionStorage() {
    this.ddTipoCadastroId = JSON.parse(sessionStorage.getItem('dropdown-tipo_cadastro'));
    this.ddTratamento = JSON.parse(sessionStorage.getItem('dropdown-tratamento'));
    this.ddGrupo = JSON.parse(sessionStorage.getItem('dropdown-grupo'));
    this.ddMunicipioId = JSON.parse(sessionStorage.getItem('dropdown-municipio'));
    this.ddEstadoId = JSON.parse(sessionStorage.getItem('dropdown-estado'));
    this.ddRegiaoId = JSON.parse(sessionStorage.getItem('dropdown-regiao'));
    this.ddEscolaridadeId = JSON.parse(sessionStorage.getItem('dropdown-escolaridade'));
    this.ddEstadoCivilId = JSON.parse(sessionStorage.getItem('dropdown-estado_civil'));
    this.ddSexo = JSON.parse(sessionStorage.getItem('dropdown-sexo'));
    this.ddCampo4Id = JSON.parse(sessionStorage.getItem('dropdown-campo4'));
    // this.espera.next(this.carregamento);
  }

  consultaCEP(event) {
    if (this.formCadastro.get('cadastro_cep').value != null) {
      let cep = this.formCadastro.get('cadastro_cep').value;
      cep = cep.replace(/\D/g, '');
      // Verifica se campo cep possui valor informado.
      if (cep !== '') {
        // Expressão regular para validar o CEP.
        const validacep = /^[0-9]{8}$/;
        // Valida o formato do CEP.
        if (validacep.test(cep)) {
          // this.resetaDadosForm();
          // this.op.show(event);
          /*this.viacep.buscarPorCep(cep).then((endereco: Endereco) => {
            // Endereço retornado :)
            this.populaEnderecoForm(endereco);
            this.op.hide();
          }).catch((error: ErroCep) => {
            // Alguma coisa deu errado :/
            if (error.message === 'CEP_NAO_ENCONTRADO') {
              this.messageService.add({key: 'cepToast', severity: 'warn', summary: 'ATENÇÃO', detail: 'CEP NÃO ENCONTADOR'});
            }
            this.op.hide();
          });*/
          this.sub.push(
            this.viacep
              .buscarPorCep(cep)
              .pipe(
                catchError((error: CEPError) => {
                  // Ocorreu algum erro :/
                  console.log(error.message);
                  if (error.message === 'CEP_NAO_ENCONTRADO') {
                    this.ms.add({key: 'cepToast', severity: 'warn', summary: 'ATENÇÃO', detail: 'CEP NÃO ENCONTADOR'});
                  }
                  // this.op.hide();
                  return EMPTY;
                })
              )
              .subscribe((enderecos: Endereco) => {
                this.populaEnderecoForm(enderecos);
                // this.op.hide();
              }));
        }
      }
    }
  }

  populaEnderecoForm(endereco: Endereco = null) {
    if (endereco) {
      const st = this.achaValor(this.ddEstadoId, endereco.uf);
      if (st) {
        this.cfs.cadastro.cadastro_estado_id = st.value;
        this.formCadastro.get('cadastro_estado_id').patchValue(st.value);
      }
      this.cfs.cadastro.cadastro_endereco = endereco.logradouro;
      this.formCadastro.get('cadastro_endereco').patchValue(endereco.logradouro);
      this.cfs.cadastro.cadastro_bairro = endereco.bairro;
      this.formCadastro.get('cadastro_bairro').patchValue(endereco.bairro);
      const mun = this.achaValor(this.ddMunicipioId, endereco.localidade.toUpperCase());
      if (mun) {
        this.cfs.cadastro.cadastro_municipio_id = mun.value;
        this.formCadastro.get('cadastro_municipio_id').patchValue(mun.value);
      } else {
        this.formCadastro.get('cadastro_estado_id').disable();
        this.formCadastro.get('cadastro_endereco').disable();
        this.formCadastro.get('cadastro_bairro').disable();
        // this.mostraMunicipioForm(endereco.localidade.toUpperCase());
      }
    }
  }

  achaValor(arr: SelectItem[], valor): SelectItem {
    return arr.find(function(x) {
      return x.label === valor;
    });
  }

  onSubmit() {
    console.log('onsubmit', this.formCadastro.getRawValue());
  }

  verificaDuplicados2(event) {
    console.log('verificaDuplicados2',event);
  }

  verificaDuplicados(nome?: string) {
    this.validaNome = false;
    // this.numeroDuplicado = 0;
    // const nome = this.formCadastro.get('cadastro_nome').value;
    if (nome !== undefined && nome !== null && nome.length > 3) {
      this.formCadastro.disable();
      // this.nomeBusca = nome;
      this.sub.push(this.cs.procurarCadastroDuplicado(nome)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.cad = dados;
            console.log('verificaDuplicados',this.cad);
          },
          error: (erro) => {
            console.error(erro.toString());
            this.validaNome = true;
            this.nomeDuplicado = false;
            this.formCadastro.enable();
          },
          complete: () => {
            if (this.cad.length > 0) {
              this.nomeDuplicado = true;
            } else {
              this.nomeDuplicado = false;
              this.formCadastro.enable();
              this.validaNome = true;
            }
            // return this.numeroDuplicado;
          }
        }));
    } else {
      this.nomeDuplicado = false;
      this.validaNome = true;
    }
  }

  fechaNomeDuplicado() {
    this.formCadastro.enable();
    this.nomeDuplicado = false;
    this.cad = [];
  }

  validaAsync(campo: string, situacao: boolean) {
    return (
      (!this.formCadastro.get(campo).valid || this.formCadastro.get(campo).hasError('required')) &&
      (this.formCadastro.get(campo).touched || this.formCadastro.get(campo).dirty) &&
      situacao
    );
  }

  aplicaCssErroAsync(campo: string, situacao: boolean) {
    return {
      'ng-invalid': this.validaAsync(campo, situacao),
      'ng-dirty': this.validaAsync(campo, situacao)
    };
  }

  verificaRequired(campo: string) {
    return (
      this.formCadastro.get(campo).hasError('required') &&
      (this.formCadastro.get(campo).touched || this.formCadastro.get(campo).dirty)
    );
  }

  verificaValidTouched(campo: string) {
    return (
      (!this.formCadastro.get(campo).valid || this.formCadastro.get(campo).hasError('required')) &&
      (this.formCadastro.get(campo).touched || this.formCadastro.get(campo).dirty) && this.formCadastro.enabled
    );
  }

  verificaValidTouched2(campo: string) {
    return (
      this.formCadastro.enabled && !this.formCadastro.get(campo).valid &&
      (this.formCadastro.get(campo).touched && this.formCadastro.get(campo).dirty)
    );
  }

  verificaValidacoesForm(formGroup: FormGroup): boolean {
    let ct = 0;
    let ct2 = 0;
    Object.keys(formGroup.controls).forEach(campo => {
      const controle = formGroup.get(campo);
      controle?.markAsDirty();
      controle?.markAsTouched();
      if (controle instanceof FormGroup) {
        this.verificaValidacoesForm(controle);
      }
      if (!controle.valid) {
        ct++;
      }
      ct2++;
    });
    return (ct === 0);
  }

  aplicaCssErro(campo: string) {
    return {
      'ng-invalid': this.verificaValidTouched(campo),
      'ng-dirty': this.verificaValidTouched(campo)
    };
  }

  aplicaCssErro2(campo: string) {
    return {
      'ng-invalid': this.verificaValidTouched2(campo),
      'ng-dirty': this.verificaValidTouched2(campo)
    };
  }

  achaTipo(arr: SelectItemGroup[], valor): SelectItem {
    const a: SelectItem[] = arr[0].items.concat(arr[1].items);
    const rsp: any = a.find(function (x) {
      return x.value === valor;
    });
    if (this.disableSubmit === true) {
      this.disableSubmit = false;
    }
    return rsp ? rsp : false;
  }

  mudaTipo (event) {
    const a: SelectItem = this.achaTipo(this.ddTipoCadastroId, event.value);
    console.log('mudaTipo', event);
    this.tipotipo = Number(a.title);
    this.block = false;
    this.formCadastro.enable();
    this.arquivoDesativado = false;
  }

  onNovoRegistroAux(ev) {
    if (ev.campo === 'cadastro_tipo_id') {
      this.ddTipoCadastroId = ev.dropdown;
    }
    if (ev.campo === 'cadastro_tratamento_id') {
      this.ddTratamento = ev.dropdown;
    }
    if (ev.campo === 'cadastro_grupo_id') {
      this.ddGrupo = ev.dropdown;
    }
    if (ev.campo === 'cadastro_municipio_id') {
      this.ddMunicipioId = ev.dropdown;
    }
    if (ev.campo === 'cadastro_estado_id') {
      this.ddEstadoId = ev.dropdown;
    }
    if (ev.campo === 'cadastro_regiao_id') {
      this.ddRegiaoId = ev.dropdown;
    }
    if (ev.campo === 'cadastro_escolaridade_id') {
      this.ddEscolaridadeId = ev.dropdown;
    }
    if (ev.campo === 'cadastro_estado_civil_id') {
      this.ddEstadoCivilId = ev.dropdown;
    }
    if (ev.campo === 'cadastro_campo4_id') {
      this.ddCampo4Id = ev.dropdown;
    }

    this.formCadastro.get(ev.campo).patchValue(ev.valorId);
  }



  voltarListar() {
    this.cfs.cadastroListar = null;
    this.cfs.cadastro = null;
    this.cfs.acao = null;
    /*if (sessionStorage.getItem('solic-busca')) {
      this.router.navigate(['/solic/listar/busca']);
    } else {
      this.router.navigate(['/solic/listar']);
    }*/
    this.router.navigate(['/cadastro/listar']);
  }











  resetForm() {
    this.mostraForm = true;
    this.formCadastro.reset();
    if (this.possuiArquivos) {
      this.clearArquivos = true;
    }
    this.possuiArquivos = false;
    this.arquivoDesativado = true;
    window.scrollTo(0, 0);
  }









  onUpload(ev) {
    if (ev) {
      this.ms.add({
        key: 'toastprincipal',
        severity: 'success',
        summary: 'INCLUIR SOLICITAÇÃO',
        detail: this.resp[2]
      });
     /* this.sfs.resetSolicitacao();
      this.resetForm();
      if (this.solicitacao_tipo_analize === 6 && this.resp[4] > 0) {
        this.sfs.solicListar = undefined;
        this.sfs.solA = undefined;
        this.sfs.acao = null;
        this.sfs.tipo_analize = 0;
        this.router.navigate(['../oficio/solicitacao']);
      } else {
        this.resp = [];
        this.voltarListar();*/
      }
  }

  onBlockSubmit(ev: boolean) {
    this.mostraForm = !ev;
  }

  onPossuiArquivos(ev) {
    this.possuiArquivos = ev;
  }

  ngOnDestroy() {
    console.log('DESTROI');
    this.sub.forEach(s => {
      s.unsubscribe()
    });
    /*this.reset();
    this.tfs.resetTudo();
    this.th_historico = null;
    this.botaoEnviarVF = false;
    this.tarefa_situacao_id = 0;*/
  }



}
