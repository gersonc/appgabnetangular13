import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService, MenuInternoService} from '../../_services';
import {EmendaDropdownMenuService} from "../../emenda/_services/emenda-dropdown-menu.service";
import {ProposicaoService} from "../_services/proposicao.service";
import {ProposicaoFormService} from "../_services/proposicao-form.service";
import {ProposicaoBuscaI} from "../_models/proposicao-busca-i";
import {ProposicaoDropdownMenuListarInterface} from "../_models/proposicao-dropdown-menu-listar";
import {Subscription} from "rxjs";


@Component({
  selector: 'app-proposicao-menu-listar',
  templateUrl: './proposicao-menu-listar.component.html',
  styleUrls: ['./proposicao-menu-listar.component.css']
})
export class ProposicaoMenuListarComponent implements OnInit {
  public formMenuProposicao: FormGroup;
  drd: ProposicaoDropdownMenuListarInterface | null = null;
  public ptBr: any;
  private sub: Subscription[] = [];

  estilo1 = {width: '100%'};
  estilo2 = {maxWidth: '400px'};

  constructor(
    private formBuilder: FormBuilder,
    private dd: EmendaDropdownMenuService,
    public mi: MenuInternoService,
    public aut: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ps: ProposicaoService,
    private pfs: ProposicaoFormService
  ) { }

  ngOnInit() {

    this.formMenuProposicao = this.formBuilder.group({
      proposicao_tipo_id: [null],
      proposicao_numero: [null],
      proposicao_autor: [null],
      proposicao_relator: [null],
      proposicao_area_interesse_id: [null],
      proposicao_parecer: [null],
      proposicao_origem_id: [null],
      proposicao_emenda_tipo_id: [null],
      proposicao_situacao_id: [null],
      proposicao_relator_atual: [null],
      proposicao_orgao_id: [null],
      proposicao_data1: [null],
      proposicao_data2: [null],
      proposicao_ementa: [null],
      proposicao_texto: [null]
    });

    this.carregaDropDown();

    this.mi.showMenuInterno();
  }


  carregaDropDown() {
    if (sessionStorage.getItem('proposicao-menu-dropdown')) {
      this.drd = JSON.parse(sessionStorage.getItem('proposicao-menu-dropdown'));
    } else {
      this.getCarregaDropDown();
    }
  }

  getCarregaDropDown() {
    this.sub.push(this.dd.resp$.subscribe(
      (dados: boolean ) => {
      },
      error => {
        console.error(error.toString());
      },
      () => {
        this.carregaDropDown();
      }
    ));
    this.dd.gravaDropDown();
  }


  onMudaForm() {
    this.ps.resetProposicaoBusca();
    let proposicaoBusca: ProposicaoBuscaI;
    proposicaoBusca = this.formMenuProposicao.getRawValue();
    this.ps.novaBusca(proposicaoBusca);
    this.ps.buscaMenu();
    this.mi.hideMenu();
  }

  goIncluir() {
    if (this.aut.usuario_responsavel_sn || this.aut.usuario_principal_sn || this.aut.proposicao_incluir) {
      // this.es.acao = 'incluir';
      this.pfs.acao = 'incluir';
      this.mi.mudaMenuInterno(false);
      this.router.navigate(['proposicao/incluir']);
    } else {
      console.error('SEM PERMISSAO');
    }
  }

  onKey(event) {
    let a = 0;
    event.key.toString() === 'Enter' ? this.onMudaForm() : a++;
  }

  fechar() {
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
