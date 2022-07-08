import { Component, OnDestroy, OnInit} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SelectItem } from 'primeng/api';
import { AuthenticationService, CarregadorService, MenuInternoService, DropdownService } from '../../_services';
import { SolicitacaoService, SolicitacaoBuscarService, SolicitacaoDropdownMenuService } from '../_services';
import { SolicitacaoBuscaInterface } from '../_models';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-solicitacao-menu-listar',
  templateUrl: './solicitacao-menu-listar.component.html',
  styleUrls: ['./solicitacao-menu-listar.component.css']
})
export class SolicitacaoMenuListarComponent implements OnInit, OnDestroy {
  public altura = (window.innerHeight) + 'px';
  public ddSolicitacao_situacao: SelectItem[] = [];
  public ddSolicitacao_cadastro_tipo_id: SelectItem[] = [];
  public ddSolicitacao_cadastro_id: SelectItem[] = [];
  public ddSolicitacao_assunto_id: SelectItem[] = [];
  public ddSolicitacao_atendente_cadastro_id: SelectItem[] = [];
  public ddSolicitacao_cadastrante_cadastro_id: SelectItem[] = [];
  public ddCadastro_municipio_id: SelectItem[] = [];
  public ddCadastro_regiao_id: SelectItem[] = [];
  public ddSolicitacao_local_id: SelectItem[] = [];
  public ddSolicitacao_tipo_recebimento_id: SelectItem[] = [];
  public ddSolicitacao_area_interesse_id: SelectItem[] = [];
  public ddSolicitacao_reponsavel_analize_id: SelectItem[] = [];
  public ddSolicitacao_data: SelectItem[] = [];
  public formListarSolicitacao: FormGroup;
  public ptBr: any;
  private sub: Subscription[] = [];


  constructor(
    private formBuilder: FormBuilder,
    private dd: DropdownService,
    private solicitacaoService: SolicitacaoService,
    private sbs: SolicitacaoBuscarService,
    public mi: MenuInternoService,
    public authenticationService: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cs: CarregadorService,
    private sdd: SolicitacaoDropdownMenuService
  ) { }


  ngOnInit() {
    this.formListarSolicitacao = this.formBuilder.group({
      solicitacao_posicao: [null],
      solicitacao_cadastro_tipo_id: [null],
      solicitacao_cadastro_id: [null],
      solicitacao_assunto_id: [null],
      solicitacao_atendente_cadastro_id: [null],
      solicitacao_cadastrante_cadastro_id: [null],
      cadastro_municipio_id: [null],
      cadastro_regiao_id: [null],
      solicitacao_local_id: [null],
      solicitacao_tipo_recebimento_id: [null],
      solicitacao_area_interesse_id: [null],
      solicitacao_reponsavel_analize_id: [null],
      solicitacao_data: [null],
      solicitacao_descricao: [null]
    });

    this.carregaDropDown();

    if (!this.sbs.buscaStateSN) {
      if (sessionStorage.getItem('solicitacao-listagem')) {
        sessionStorage.removeItem('solicitacao-listagem');
      }
      this.mi.showMenuInterno();
    }
  }

  carregaDropDown() {
    if (sessionStorage.getItem('solicitacao-dropdown')) {
      console.log('aaaaaaa');
      let dd = JSON.parse(sessionStorage.getItem('solicitacao-dropdown'));
      this.ddSolicitacao_situacao = dd['ddSolicitacao_situacao'];
      this.ddSolicitacao_cadastro_tipo_id = dd['ddSolicitacao_cadastro_tipo_id'];
      this.ddSolicitacao_cadastro_id = dd['ddSolicitacao_cadastro_id'];
      this.ddSolicitacao_assunto_id = dd['ddSolicitacao_assunto_id'];
      this.ddSolicitacao_atendente_cadastro_id = dd['ddSolicitacao_atendente_cadastro_id'];
      this.ddSolicitacao_cadastrante_cadastro_id = dd['ddSolicitacao_cadastrante_cadastro_id'];
      this.ddCadastro_municipio_id = dd['ddCadastro_municipio_id'];
      this.ddCadastro_regiao_id = dd['ddCadastro_regiao_id'];
      this.ddSolicitacao_local_id = dd['ddSolicitacao_local_id'];
      this.ddSolicitacao_tipo_recebimento_id = dd['ddSolicitacao_tipo_recebimento_id'];
      this.ddSolicitacao_area_interesse_id = dd['ddSolicitacao_area_interesse_id'];
      this.ddSolicitacao_reponsavel_analize_id = dd['ddSolicitacao_reponsavel_analize_id'];
      this.ddSolicitacao_data = dd['ddSolicitacao_data'];
      dd = null;
      this.cs.escondeCarregador();
    } else {
        this.getCarregaDropDown();
    }
  }

  getCarregaDropDown() {
    this.sub.push(this.sdd.resp$.subscribe(
      (dados: boolean ) => {
      },
      error => {
        console.error(error.toString());
      },
      () => {
        this.carregaDropDown();
      }
    ));
    this.sdd.gravaDropDown();
  }

  onMudaForm() {
    this.sbs.resetSolicitacaoBusca();
    let solBusca: SolicitacaoBuscaInterface;
    solBusca = this.formListarSolicitacao.getRawValue();
    for (const propName in solBusca ) {
      if (solBusca[propName] == null) {
        solBusca[propName] = '';
      }
      if ( typeof solBusca[propName] === 'object' ) {
        solBusca[propName] = solBusca[propName].value;
      }
      this.sbs.solicitacaoBusca[propName] = solBusca[propName].toString();
    }
    this.sbs.buscaMenu();
    this.mi.hideMenu();
    this.cs.mostraCarregador();
  }

  goIncluir() {
    if (this.authenticationService.solicitacao_incluir) {
      this.sbs.buscaStateSN = false;
      this.cs.mostraCarregador();
      this.router.navigate(['/solicitacao/incluir']);
    } else {
      console.error('SEM PERMISSAO');
    }
  }

  onKey(event) {
    let a = 0;
    event.key.toString() === 'Enter' ? this.onMudaForm() : a++;
  }

  fechar() {
    this.cs.mostraEscondeCarregador(false);
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }
}
