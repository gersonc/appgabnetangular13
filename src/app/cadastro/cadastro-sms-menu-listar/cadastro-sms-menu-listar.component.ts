import { Component, OnInit, OnDestroy, OnChanges, ViewEncapsulation, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

import { SelectItem, SelectItemGroup } from 'primeng/api';
import { take } from 'rxjs/operators';

import { AutocompleteService, MostraMenuService, DropdownService } from '../../_services';
import { CadastroBuscaService, CadastroService } from '../_services';
import { CadastroBuscaInterface } from '../_models';
import { AuthenticationService, CarregadorService } from '../../_services';
import { DropdownnomeidClass, DropdownsonomearrayClass } from '../../_models';



@Component({
  selector: 'app-cadastro-sms-menu-listar',
  templateUrl: './cadastro-sms-menu-listar.component.html',
  styleUrls: ['./cadastro-sms-menu-listar.component.css']
})
export class CadastroSmsMenuListarComponent implements OnInit, OnDestroy {

  @Output() carregando = new EventEmitter<boolean>();
  public ddTipoCadastroId: SelectItemGroup[] = [];
  public ddMunicipioId: SelectItem[] = [];
  public ddEstadoId: SelectItem[] = [];
  public ddRegiaoId: SelectItem[] = [];
  public ddGrupoId: SelectItem[] = [];
  public ddAniversario: SelectItem[] = [];
  public ddAnidia: SelectItem[] = [];
  public ddQuinzena: SelectItem[] = [];
  public ddUsuario: SelectItem[] = [];
  public ddEstadoCivilId: SelectItem[] = [];
  public ddSexo: SelectItem[] = [];
  public ddZona: SelectItem[] = [];
  public ddEscolaridadeId: SelectItem[] = [];
  public ddCampo4Id: SelectItem[] = [];
  public ddSn: SelectItem[] = [];
  public formlistarcadastro: FormGroup;
  public items: Array<any> = [];
  public sgt: string[];
  public ddNomeIdArray = new DropdownnomeidClass();
  public ptBr: any;
  private sub: Subscription[] = [];


  constructor(
    private formBuilder: FormBuilder,
    private ddService: DropdownService,
    private autocompleteservice: AutocompleteService,
    private cadastroService: CadastroService,
    private cbs: CadastroBuscaService,
    public mm: MostraMenuService,
    private location: Location,
    public authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private cs: CarregadorService
  ) { }

  ngOnInit() {
    this.formlistarcadastro = this.formBuilder.group({
      cadastro_tipo: [null],
      cadastro_nome: [null],
      cadastro_sigla: [null],
      cadastro_apelido: [null],
      cadastro_responsavel: [null],
      cadastro_cargo: [null],
      cadastro_estado_id: [null],
      cadastro_bairro: [null],
      cadastro_municipio_id: [null],
      cadastro_regiao_id: [null],
      cadastro_grupo_id: [null],
      aniversario: [null],
      anidia: [null],
      quinzena: [null],
      data1: [null],
      data2: [null],
      cadastro_usuario: [null],
      cadastro_estado_civil_id: [null],
      cadastro_escolaridade_id: [null],
      cadastro_profissao: [null],
      cadastro_sexo: [null],
      cadastro_zona: [null],
      cadastro_data_cadastramento: [null],
      cadastro_jornal: [null],
      cadastro_mala: [null],
      cadastro_agenda: [null],
      cadastro_sigilo: [null],
      cadastro_cpfcnpj: [null],
      telefone: [null],
      cadastro_campo1: [null],
      cadastro_campo2: [null],
      cadastro_campo3: [null],
      cadastro_campo4_id: [null],
      sms: [this.cbs.smsSN]
    });
    this.carregaDropDown();
    if (!this.cbs.buscaStateSN) {
      if (sessionStorage.getItem('cadastro-listagem-sms')) {
        sessionStorage.removeItem('cadastro-listagem-sms');
      }
      this.mm.mudaMenu(true);
    }

  }

  public transformaLabel(entrada: SelectItem[], num: number): SelectItem[] {
    const b: SelectItem[] = [];
    for (const { label, value} of entrada) {
      b.push({label: label.substring(0, num), value: value});
    }
    return b;
  }

  carregaDropDown() {
    let dr = JSON.parse(sessionStorage.getItem('cadastro-dropdown'));
    this.ddTipoCadastroId = dr.ddTipoCadastroId;
    this.ddMunicipioId = dr.ddMunicipioId;
    this.ddEstadoId = dr.ddEstadoId;
    this.ddRegiaoId = dr.ddRegiaoId;
    this.ddGrupoId = dr.ddGrupoId;
    this.ddAniversario = dr.ddAniversario;
    this.ddAnidia = dr.ddAnidia;
    this.ddQuinzena = dr.ddQuinzena;
    this.ddUsuario = dr.ddUsuario;
    this.ddEstadoCivilId = dr.ddEstadoCivilId;
    this.ddSexo = dr.ddSexo;
    this.ddZona = dr.ddZona;
    this.ddEscolaridadeId = dr.ddEscolaridadeId;
    this.ddCampo4Id = dr.ddCampo4Id;
    this.ddSn = dr.ddSn;
    dr = null;
    this.cs.escondeCarregador();
  }

  onSMSChange(event) {
    this.cbs.smsSN = false;
    this.cbs.buscaStateSN = false;
    this.router.navigate(['/cadastro/listar']);
  }

  autoComp (event, campo) {
    let sg: any[];
    const tabela = campo.substring(0, campo.indexOf('_'));
    this.sub.push(this.autocompleteservice.getACSimples3(tabela, campo, event.query)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          sg = dados;
        },
        error: err => console.error(err),
        complete: () => {
          this.sgt = sg;
        }
      }));
  }

  onMudaForm() {
    this.cbs.resetCadastroBusca();
    let cadBusca: CadastroBuscaInterface;
    cadBusca = this.formlistarcadastro.getRawValue();
    for (const propName in cadBusca ) {
      if (cadBusca[propName] == null) {
        cadBusca[propName] = '';
      }
      if ( typeof cadBusca[propName] === 'object' ) {
        cadBusca[propName] = cadBusca[propName].value;
      }
      this.cbs.cadastroBusca[propName] = cadBusca[propName].toString();
    }
    this.cbs.buscaMenu();
    this.mm.mudaMenu(false);
    this.cs.mostraCarregador();
  }

  onKey(event) {
    let a = 0;
    event.key.toString() === 'Enter' ? this.onMudaForm() : a++;
  }

  goIncluir() {
    if (this.authenticationService.cadastro_incluir) {
      this.router.navigate(['/cadastro/incluir']);
    } else {
      console.error('SEM PERMISSAO');
    }
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

  fechar() {
    this.cs.mostraEscondeCarregador(false);
  }
}
