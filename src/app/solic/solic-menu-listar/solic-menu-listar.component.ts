import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AuthenticationService, DropdownService, MenuInternoService} from "../../_services";
import {Router} from "@angular/router";
import {SelectItem} from "primeng/api";
import {Subscription} from "rxjs";
import {SolicitacaoDropdownMenuListarInterface} from "../../solicitacao/_models";
import {BuscaService} from "../../shared-datatables/services/busca.service";
import {SolicService} from "../_services/solic.service";
import {SolicBuscaI} from "../_models/solic-busca-i";
import {SolicDropdownMenuService} from "../_services/solic-dropdown-menu.service";
import {VersaoService} from "../../_services/versao.service";

@Component({
  selector: 'app-solic-menu-listar',
  templateUrl: './solic-menu-listar.component.html',
  styleUrls: ['./solic-menu-listar.component.css']
})
export class SolicMenuListarComponent implements OnInit, OnDestroy {
  public altura = (window.innerHeight) + 'px';
  public ddSolicitacao: SolicitacaoDropdownMenuListarInterface;
  public formListarSolicitacao: FormGroup;
  public ptBr: any;
  private sub: Subscription[] = [];

  constructor(
    public vs: VersaoService,
    private formBuilder: FormBuilder,
    private dd: DropdownService,
    private solicitacaoService: SolicService,
    private sbs: BuscaService,
    public mi: MenuInternoService,
    public authenticationService: AuthenticationService,
    private router: Router,
    private sdd: SolicDropdownMenuService
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
      cadastro_bairro: [null],
      solicitacao_descricao: [null]
    });

    this.carregaDropDown();

    if (!this.sbs.buscaStateSN) {
      if (sessionStorage.getItem('datatable-listagem')) {
        sessionStorage.removeItem('datatable-listagem');
      }
      this.mi.showMenuInterno();
    }
  }

  carregaDropDown() {
    if (sessionStorage.getItem('solic-menu-dropdown')) {
      this.ddSolicitacao = JSON.parse(sessionStorage.getItem('solic-menu-dropdown'));
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
    let solBusca: SolicBuscaI;
    solBusca = this.formListarSolicitacao.getRawValue();
    for (const propName in solBusca ) {
      if (solBusca[propName] == null) {
        solBusca[propName] = '';
      }
      if ( typeof solBusca[propName] === 'object' ) {
        solBusca[propName] = solBusca[propName].value;
      }
      this.sbs.busca[propName] = solBusca[propName].toString();
    }
    this.sbs.buscaMenu();
    this.mi.hideMenu();
  }

  goIncluir() {
    console.log('aaaaaaa');
    if (this.authenticationService.solicitacao_incluir) {
      console.log('ccccc');
      this.sbs.buscaStateSN = false;
      this.router.navigate(['solic/incluir']);
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
