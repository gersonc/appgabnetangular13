import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { SelectItem } from 'primeng/api';
import { take } from 'rxjs/operators';

import { AuthenticationService,  AutocompleteService } from '../../_services';
import { MenuInternoService } from "../../_services";
import {CadastroDropdownMenuService} from "../_services/cadastro-dropdown-menu.service";
import {CadastroService} from "../_services/cadastro.service";
import {CadastroBuscaI} from "../_models/cadastro-busca-i";
import {CadastroFormService} from "../_services/cadastro-form.service";
import {DateTime} from "luxon";



@Component({
  selector: 'app-cadastro-menu-listar',
  templateUrl: './cadastro-menu-listar.component.html',
  styleUrls: ['./cadastro-menu-listar.component.css']
})
export class CadastroMenuListarComponent implements OnInit, OnDestroy {
  public altura = (window.innerHeight) + 'px';
  public formMenu: FormGroup;
  public items: Array<any> = [];
  public sgt: string[];
  public ptBr: any;
  private sub: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public dd: CadastroDropdownMenuService,
    private aut: AutocompleteService,
    public cs: CadastroService,
    public mi: MenuInternoService,
    public auth: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private cfs: CadastroFormService
  ) { }

  ngOnInit() {
    this.cs.getCampoCadastro();
    this.formMenu = this.formBuilder.group({
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
      cadastro_animes: [null],
      cadastro_anidia: [null],
      quinzena: [null],
      cadastro_data_nascimento1: [null],
      cadastro_data_nascimento2: [null],
      cadastro_usuario: [null],
      cadastro_estado_civil_id: [null],
      cadastro_escolaridade_id: [null],
      cadastro_profissao: [null],
      cadastro_sexo2: [null],
      cadastro_zona: [null],
      cadastro_data_cadastramento: [null],
      cadastro_jornal: [null],
      cadastro_mala: [null],
      cadastro_agenda: [null],
      cadastro_sigilo2: [null],
      cadastro_cpfcnpj: [null],
      telefone: [null],
      cadastro_campo1: [null],
      cadastro_campo2: [null],
      cadastro_campo3: [null],
      cadastro_campo4_id: [null],
    });

    this.sub.push(this.dd.resp$.pipe(take(1))
      .subscribe(
        (dados: boolean) => {
        },
        error => {
          console.error(error.toString());
        },
        () => {
        }
      ));

    this.dd.gravaDropDown();

    this.mi.showMenuInterno();
  }

  transformaLabel(entrada: SelectItem[], num: number): SelectItem[] {
    const b: SelectItem[] = [];
    for (const { label, value} of entrada) {
      b.push({label: label.substring(0, num), value: value});
    }
    return b;
  }

  autoComp (event, campo) {
    let sg: any[];
    const tabela = campo.substring(0, campo.indexOf('_'));
    this.sub.push(this.aut.getACSimples3(tabela, campo, event.query)
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

  autoComp2 (event) {
    let sg: any[];
    // this.sub.push(this.aut.getAcNomeLimpo(event.query)
    this.sub.push(this.aut.acCadastroIdContem(event.query, this.formMenu.get('cadastro_tipo_id').value)
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
    this.cs.resetCadastroBusca();
    this.cs.novaBusca(this.criaBusca());
    this.cs.buscaMenu();
    this.mi.hideMenu();
  }

  onKey(event) {
    let a = 0;
    event.key.toString() === 'Enter' ? this.onMudaForm() : a++;
  }

  criaBusca(): CadastroBuscaI {
    const b: CadastroBuscaI = {};
    if (this.formMenu.get('cadastro_nome').value !== null) {
      if (typeof this.formMenu.get('cadastro_nome').value === 'string') {
        b.cadastro_nome = this.formMenu.get('cadastro_nome').value;
      }
      if (typeof this.formMenu.get('cadastro_nome').value === 'object') {
        b.cadastro_id = +this.formMenu.get('cadastro_nome').value.value;
        return b;
      }
    }
    if (this.formMenu.get('cadastro_tipo_id').value !== null && this.formMenu.get('cadastro_tipo_id').value > 0) {
      b.cadastro_tipo_id = +this.formMenu.get('cadastro_tipo_id').value;
    }
    if (this.formMenu.get('cadastro_sigla').value !== null && this.formMenu.get('cadastro_sigla').value !== '') {
      b.cadastro_sigla = this.formMenu.get('cadastro_sigla').value;
    }
    if (this.formMenu.get('cadastro_apelido').value !== null && this.formMenu.get('cadastro_apelido').value !== '') {
      b.cadastro_apelido = this.formMenu.get('cadastro_apelido').value;
    }
    if (this.formMenu.get('cadastro_responsavel').value !== null && this.formMenu.get('cadastro_responsavel').value !== '') {
      b.cadastro_responsavel = this.formMenu.get('cadastro_responsavel').value;
    }
    if (this.formMenu.get('cadastro_cargo').value !== null && this.formMenu.get('cadastro_cargo').value !== '') {
      b.cadastro_cargo = this.formMenu.get('cadastro_cargo').value;
    }
    if (this.formMenu.get('cadastro_estado_id').value !== null && this.formMenu.get('cadastro_estado_id').value.value > 0) {
      b.cadastro_estado_id = +this.formMenu.get('cadastro_estado_id').value.value;
    }
    if (this.formMenu.get('cadastro_bairro').value !== null && this.formMenu.get('cadastro_bairro').value.value !== '') {
      b.cadastro_bairro = this.formMenu.get('cadastro_bairro').value.value;
    }
    if (this.formMenu.get('cadastro_municipio_id').value !== null && this.formMenu.get('cadastro_municipio_id').value.value > 0) {
      b.cadastro_municipio_id = +this.formMenu.get('cadastro_municipio_id').value.value;
    }
    if (this.formMenu.get('cadastro_regiao_id').value !== null && this.formMenu.get('cadastro_regiao_id').value.value > 0) {
      b.cadastro_regiao_id = +this.formMenu.get('cadastro_regiao_id').value.value;
    }
    if (this.formMenu.get('cadastro_grupo_id').value !== null && this.formMenu.get('cadastro_grupo_id').value.value > 0) {
      b.cadastro_grupo_id = +this.formMenu.get('cadastro_grupo_id').value.value;
    }
    if (this.formMenu.get('cadastro_animes').value !== null && this.formMenu.get('cadastro_animes').value.value > 0) {
      b.cadastro_animes = +this.formMenu.get('cadastro_animes').value.value;
    }
    if (this.formMenu.get('cadastro_anidia').value !== null && this.formMenu.get('cadastro_anidia').value.value > 0) {
      b.cadastro_anidia = +this.formMenu.get('cadastro_anidia').value.value;
    }
    if (this.formMenu.get('quinzena').value !== null && this.formMenu.get('quinzena').value.value > 0) {
      b.quinzena = +this.formMenu.get('quinzena').value.value;
    }
    if (this.formMenu.get('cadastro_estado_civil_id').value !== null && this.formMenu.get('cadastro_estado_civil_id').value.value > 0) {
      b.cadastro_estado_civil_id = +this.formMenu.get('cadastro_estado_civil_id').value.value;
    }
    if (this.formMenu.get('cadastro_escolaridade_id').value !== null && this.formMenu.get('cadastro_escolaridade_id').value.value > 0) {
      b.cadastro_escolaridade_id = +this.formMenu.get('cadastro_escolaridade_id').value.value;
    }
    if (this.formMenu.get('cadastro_sexo2').value !== null) {
      b.cadastro_sexo2 = this.formMenu.get('cadastro_sexo2').value.value;
    }
    if (this.formMenu.get('cadastro_zona').value !== null) {
      b.cadastro_zona = this.formMenu.get('cadastro_zona').value.value;
    }
    if (this.formMenu.get('cadastro_jornal').value !== null) {
      b.cadastro_jornal = +this.formMenu.get('cadastro_jornal').value.value;
    }
    if (this.formMenu.get('cadastro_mala').value !== null) {
      b.cadastro_mala = +this.formMenu.get('cadastro_mala').value.value;
    }
    if (this.formMenu.get('cadastro_agenda').value !== null) {
      b.cadastro_agenda = +this.formMenu.get('cadastro_agenda').value.value;
    }
    if (this.formMenu.get('cadastro_sigilo2').value !== null) {
      b.cadastro_sigilo2 = +this.formMenu.get('cadastro_sigilo2').value.value;
    }
    if (this.formMenu.get('cadastro_campo4_id').value !== null && this.formMenu.get('cadastro_campo4_id').value.value > 0) {
      b.cadastro_campo4_id = +this.formMenu.get('cadastro_campo4_id').value.value;
    }
    if (this.formMenu.get('cadastro_profissao').value !== null && this.formMenu.get('cadastro_profissao').value !== '') {
      b.cadastro_profissao = this.formMenu.get('cadastro_profissao').value;
    }
    if (this.formMenu.get('cadastro_cpfcnpj').value !== null && this.formMenu.get('cadastro_cpfcnpj').value !== '') {
      b.cadastro_cpfcnpj = this.formMenu.get('cadastro_cpfcnpj').value;
    }
    if (this.formMenu.get('telefone').value !== null && this.formMenu.get('telefone').value !== '') {
      b.telefone = this.formMenu.get('telefone').value;
    }
    if (this.formMenu.get('cadastro_campo1').value !== null && this.formMenu.get('cadastro_campo1').value !== '') {
      b.cadastro_campo1 = this.formMenu.get('cadastro_campo1').value;
    }
    if (this.formMenu.get('cadastro_campo2').value !== null && this.formMenu.get('cadastro_campo2').value !== '') {
      b.cadastro_campo2 = this.formMenu.get('cadastro_campo2').value;
    }
    if (this.formMenu.get('cadastro_campo3').value !== null && this.formMenu.get('cadastro_campo3').value !== '') {
      b.cadastro_campo3 = this.formMenu.get('cadastro_campo3').value;
    }
    if (this.formMenu.get('cadastro_data_nascimento1').value !== null) {
      const dt1: DateTime = DateTime.fromJSDate(this.formMenu.get('cadastro_data_nascimento1').value);
      b.cadastro_data_nascimento1 = dt1.toSQLDate();
    }
    if (this.formMenu.get('cadastro_data_nascimento2').value !== null) {
      const dt2: DateTime = DateTime.fromJSDate(this.formMenu.get('cadastro_data_nascimento2').value);
      b.cadastro_data_nascimento2 = dt2.toSQLDate();
    }
    if (this.formMenu.get('cadastro_data_cadastramento').value !== null) {
      const dt3: DateTime = DateTime.fromJSDate(this.formMenu.get('cadastro_data_cadastramento').value);
      b.cadastro_data_cadastramento = dt3.toSQLDate();
    }
    return b;
  }

  goIncluir() {
    if (this.auth.usuario_responsavel_sn || this.auth.usuario_principal_sn || this.auth.cadastro_incluir) {
      this.cfs.origem = 'menu';
      this.cfs.acao = 'incluir';
      this.cfs.resetCadastro();
      this.cfs.criaFormIncluir();
      this.mi.mudaMenuInterno(false);
      this.router.navigate(['cadastro/incluir']);
    } else {
      console.error('SEM PERMISSAO');
    }
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
