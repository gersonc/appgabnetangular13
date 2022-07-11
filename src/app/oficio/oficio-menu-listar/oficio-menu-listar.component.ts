import {Component, OnDestroy, OnInit} from '@angular/core';
import {SolicDropdownMenuListarI} from "../../solic/_models/solic-dropdown-menu-listar-i";
import {Subscription} from "rxjs";
import {FormBuilder, FormGroup} from "@angular/forms";
import {VersaoService} from "../../_services/versao.service";
import {AuthenticationService, DropdownService, MenuInternoService} from "../../_services";
import {SolicService} from "../../solic/_services/solic.service";
import {Router} from "@angular/router";
import {SolicDropdownMenuService} from "../../solic/_services/solic-dropdown-menu.service";
import {SolicFormService} from "../../solic/_services/solic-form.service";
import {SolicBuscaI} from "../../solic/_models/solic-busca-i";
import {OficioFormService} from "../_services/oficio-form.service";
import {OficioService} from "../_services/oficio.service";
import {OficioBuscaI} from "../_models/oficio-busca-i";
import {OficioDropdownMenuService} from "../_services/oficio-dropdown-menu.service";
import {OficioDropdownMenuListarInterface} from "../_models/oficio-dropdown-menu-listar";

@Component({
  selector: 'app-oficio-menu-listar',
  templateUrl: './oficio-menu-listar.component.html',
  styleUrls: ['./oficio-menu-listar.component.css']
})
export class OficioMenuListarComponent implements OnInit, OnDestroy {
  public altura = (window.innerHeight) + 'px';
  public ddOficio: OficioDropdownMenuListarInterface;
  public ptBr: any;
  private sub: Subscription[] = [];
  public formMenuOfico: FormGroup;

  constructor(
    public vs: VersaoService,
    private formBuilder: FormBuilder,
    private dd: DropdownService,
    private os: OficioService,
    public mi: MenuInternoService,
    public aut: AuthenticationService,
    private router: Router,
    private odd: OficioDropdownMenuService,
    private ofs: OficioFormService
  ) { }

  ngOnInit() {
    this.formMenuOfico = this.formBuilder.group({
      oficio_processo_id: [null],
      oficio_codigo: [null],
      oficio_convenio: [null],
      oficio_protocolo_numero: [null],
      oficio_assunto_id: [null],
      oficio_numero: [null],
      oficio_municipio_id: [null],
      oficio_tipo_solicitante_id: [null],
      oficio_cadastro_id: [null],
      solicitacao_assunto_id: [null],
      oficio_area_interesse_id: [null],
      solicitacao_reponsavel_analize_id: [null],
      solicitacao_local_id: [null],
      oficio_orgao_solicitado_nome: [null],
      oficio_orgao_protocolante_nome: [null],
      oficio_status: [null],
      oficio_prioridade_id: [null],
      oficio_tipo_andamento_id: [null],
      oficio_data_emissao1: [null],
      oficio_data_emissao2: [null],
      oficio_descricao_acao: [null],
      oficio_data_empenho1: [null],
      oficio_data_empenho2: [null],
      oficio_data_protocolo1: [null],
      oficio_data_protocolo2: [null],
      oficio_data_pagamento1: [null],
      oficio_data_pagamento2: [null],
      oficio_prazo1: [null],
      oficio_prazo2: [null],
    });

    this.carregaDropDown();

    this.mi.showMenuInterno();
  }

  carregaDropDown() {
    if (sessionStorage.getItem('oficio-menu-dropdown')) {
      this.ddOficio = JSON.parse(sessionStorage.getItem('oficio-menu-dropdown'));
    } else {
      this.getCarregaDropDown();
    }
  }

  getCarregaDropDown() {
    this.sub.push(this.odd.resp$.subscribe(
      (dados: boolean ) => {
      },
      error => {
        console.error(error.toString());
      },
      () => {
        this.carregaDropDown();
      }
    ));
    this.odd.gravaDropDown();
  }

  onMudaForm() {
    this.os.resetOficioBusca();
    let ofiBusca: OficioBuscaI;
    ofiBusca = this.formMenuOfico.getRawValue();
    this.os.novaBusca(ofiBusca);
    this.os.buscaMenu();
    this.mi.hideMenu();
  }

  goIncluir() {
    if (this.aut.solicitacao_incluir) {
      this.ofs.acao = 'incluir';
      // this.sfs.criaTipoAnalise(this.aut.solicitacao_analisar);
      this.mi.mudaMenuInterno(false);
      this.router.navigate(['oficio/incluir']);
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
