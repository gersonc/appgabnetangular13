import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { SelectItem, SelectItemGroup } from 'primeng/api';
import { take } from 'rxjs/operators';

import { AuthenticationService, CarregadorService, AutocompleteService, MostraMenuService, DropdownService } from '../../_services';
import { CadastroBuscaService, CadastroService } from '../_services';
import { CadastroBuscaInterface } from '../_models';
import { DropdownnomeidClass } from '../../_models';
import { MenuInternoService } from "../../_services";


@Component({
  selector: 'app-cadastro-menu-listar',
  templateUrl: './cadastro-menu-listar.component.html',
  styleUrls: ['./cadastro-menu-listar.component.css']
})
export class CadastroMenuListarComponent implements OnInit, OnDestroy {
  public altura = (window.innerHeight) + 'px';
  public ddCadastroTipoId: SelectItemGroup[] = [];
  public ddCadastroMunicipioId: SelectItem[] = [];
  public ddCadastroEstadoId: SelectItem[] = [];
  public ddCadastroRegiaoId: SelectItem[] = [];
  public ddCadastroGrupoId: SelectItem[] = [];
  public ddCadastroAniversario: SelectItem[] = [];
  public ddCadastroAnidia: SelectItem[] = [];
  public ddCadastroQuinzena: SelectItem[] = [];
  public ddCadastroUsuario: SelectItem[] = [];
  public ddCadastroEstadoCivilId: SelectItem[] = [];
  public ddCadastroSexo: SelectItem[] = [];
  public ddCadastroZona: SelectItem[] = [];
  public ddCadastroEscolaridadeId: SelectItem[] = [];
  public ddCadastroCampo4Id: SelectItem[] = [];
  public ddCadastroSn: SelectItem[] = [];
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
    public cadastroService: CadastroService,
    private cbs: CadastroBuscaService,
    public mi: MenuInternoService,
    public authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private cs: CarregadorService
  ) { }

  ngOnInit() {
    this.cadastroService.getCampoCadastro();
    this.formlistarcadastro = this.formBuilder.group({
      cadastro_tipo_id: [null],
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
      if (sessionStorage.getItem('cadastro-listagem')) {
        sessionStorage.removeItem('cadastro-listagem');
      }
      this.mi.showMenuInterno();
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
    this.ddCadastroTipoId = dr.ddCadastroTipoId;
    this.ddCadastroMunicipioId = dr.ddCadastroMunicipioId;
    this.ddCadastroEstadoId = dr.ddCadastroEstadoId;
    this.ddCadastroRegiaoId = dr.ddCadastroRegiaoId;
    this.ddCadastroGrupoId = dr.ddCadastroGrupoId;
    this.ddCadastroAniversario = dr.ddCadastroAniversario;
    this.ddCadastroAnidia = dr.ddCadastroAnidia;
    this.ddCadastroQuinzena = dr.ddCadastroQuinzena;
    this.ddCadastroUsuario = dr.ddCadastroUsuario;
    this.ddCadastroEstadoCivilId = dr.ddCadastroEstadoCivilId;
    this.ddCadastroSexo = dr.ddCadastroSexo;
    this.ddCadastroZona = dr.ddCadastroZona;
    this.ddCadastroEscolaridadeId = dr.ddCadastroEscolaridadeId;
    this.ddCadastroCampo4Id = dr.ddCadastroCampo4Id;
    this.ddCadastroSn = dr.ddCadastroSn;
    dr = null;
    this.cs.escondeCarregador();
  }


  onSMSChange(event) {
    if (this.authenticationService.sms && this.authenticationService.sms_incluir) {
      if (event.checked) {
        this.cbs.buscaStateSN = false;
        this.cbs.smsSN = true;
        this.router.navigate(['/cadastro/listar/sms']);
      } else {
        this.cbs.smsSN = false;
        this.router.navigate(['/cadastro/listar']);
      }
    }
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
    this.mi.hideMenu();
    this.cbs.buscaMenu();
    this.cs.mostraCarregador();
  }

  onKey(event) {
    let a = 0;
    event.key.toString() === 'Enter' ? this.onMudaForm() : a++;
  }

  goIncluir() {
    if (this.authenticationService.cadastro_incluir) {
      this.cbs.buscaStateSN = false;
      this.cs.mostraCarregador();
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
