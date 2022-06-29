import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AuthenticationService, DropdownService, MenuInternoService} from "../../_services";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {SolicService} from "../_services/solic.service";
import {SolicBuscaI} from "../_models/solic-busca-i";
import {SolicDropdownMenuService} from "../_services/solic-dropdown-menu.service";
import {VersaoService} from "../../_services/versao.service";
import {SolicFormService} from "../_services/solic-form.service";
import {SolicDropdownMenuListarI} from "../_models/solic-dropdown-menu-listar-i";

@Component({
  selector: 'app-solic-menu-listar',
  templateUrl: './solic-menu-listar.component.html',
  styleUrls: ['./solic-menu-listar.component.css']
})
export class SolicMenuListarComponent implements OnInit, OnDestroy {
  public altura = (window.innerHeight) + 'px';
  public ddSolicitacao: SolicDropdownMenuListarI;
  public formListarSolicitacao: FormGroup;
  public ptBr: any;
  private sub: Subscription[] = [];

  constructor(
    public vs: VersaoService,
    private formBuilder: FormBuilder,
    private dd: DropdownService,
    private ss: SolicService,
    public mi: MenuInternoService,
    public authenticationService: AuthenticationService,
    private router: Router,
    private sdd: SolicDropdownMenuService,
    private sfs: SolicFormService
  ) { }

  ngOnInit() {
    this.formListarSolicitacao = this.formBuilder.group({
      solicitacao_situacao: [null],
      solicitacao_status_id: [null],
      processo_status_id: [null],
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

    this.mi.showMenuInterno();
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
    this.ss.resetSolicitacaoBusca();
    let solBusca: SolicBuscaI;
    solBusca = this.formListarSolicitacao.getRawValue();
    // this.ss.busca = solBusca;
    this.ss.novaBusca(solBusca);
    // this.ss.busca.rows = this.ss.tabela.rows;
    this.ss.buscaMenu();
    this.mi.hideMenu();
  }

  goIncluir() {
    if (this.authenticationService.solicitacao_incluir) {
      this.sfs.acao = 'incluir';
      this.sfs.criaTipoAnalise(this.authenticationService.solicitacao_analisar);
      /*if (this.ss.solicitacoes !== undefined) {
        if (this.ss.solicitacoes.length > 1) {
          this.ss.setState();
        }
      }*/
      this.mi.mudaMenuInterno(false);
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
