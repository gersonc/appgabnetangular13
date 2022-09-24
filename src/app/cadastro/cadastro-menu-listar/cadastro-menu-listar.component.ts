import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { SelectItem, SelectItemGroup } from 'primeng/api';
import { take } from 'rxjs/operators';

import { AuthenticationService,  AutocompleteService } from '../../_services';
import { MenuInternoService } from "../../_services";
import {CadastroDropdownMenuService} from "../_services/cadastro-dropdown-menu.service";
import {CadastroService} from "../_services/cadastro.service";
import {CadastroBuscaI} from "../_models/cadastro-busca-i";
import {CadastroFormService} from "../_services/cadastro-form.service";
import {ProposicaoBuscaI} from "../../proposicao/_models/proposicao-busca-i";



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
      cadastro_nome2: [null],
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
    });

    this.sub.push(this.dd.resp$.pipe(take(1))
      .subscribe(
        (dados: boolean) => {
        },
        error => {
          console.error(error.toString());
        },
        () => {
          console.log('carregado dd');
          // this.dd = JSON.parse(sessionStorage.getItem('tarefa_menu-dropdown'));
        }
      ));

    this.dd.gravaDropDown();

    this.mi.showMenuInterno();

  }


  public transformaLabel(entrada: SelectItem[], num: number): SelectItem[] {
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
    this.sub.push(this.aut.getAcNomeNomeLimpo(event.query)
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
    let cadastroBusca: CadastroBuscaI;
    cadastroBusca = this.formMenu.getRawValue();
    this.cs.novaBusca(cadastroBusca);
    this.cs.buscaMenu();
    this.mi.hideMenu();
  }

  onKey(event) {
    let a = 0;
    event.key.toString() === 'Enter' ? this.onMudaForm() : a++;
  }


  goIncluir() {
    if (this.auth.usuario_responsavel_sn || this.auth.usuario_principal_sn || this.auth.cadastro_incluir) {
      this.cfs.acao = 'incluir';
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
