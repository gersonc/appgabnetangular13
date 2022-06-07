import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";
import {VersaoService} from "../../_services/versao.service";
import {AuthenticationService, DropdownService, MenuInternoService} from "../../_services";
import {Router} from "@angular/router";
import {ProceBuscaI, ProceDropdownMenuI} from "../_model/proc-i";
import {ProceService} from "../_services/proce.service";
import {ProceDropdownMenuService} from "../_services/proce-dropdown-menu.service";


@Component({
  selector: 'app-proce-menu-listar',
  templateUrl: './proce-menu-listar.component.html',
  styleUrls: ['./proce-menu-listar.component.css']
})
export class ProceMenuListarComponent implements OnInit, OnDestroy {
  public altura = (window.innerHeight) + 'px';
  public ddProce: ProceDropdownMenuI;
  public formListar: FormGroup;
  public ptBr: any;
  private sub: Subscription[] = [];

  constructor(
    public vs: VersaoService,
    private formBuilder: FormBuilder,
    private dd: DropdownService,
    private ps: ProceService,
    public pdd: ProceDropdownMenuService,
    public mi: MenuInternoService,
    public authenticationService: AuthenticationService,
    private router: Router,

  ) {
    console.log('mi');
  }

  ngOnInit() {
    this.formListar = this.formBuilder.group({
      cadastro_regiao_id: [null],
      processo_numero: [null],
      cadastro_municipio_id: [null],
      cadastro_tipo_id: [null],
      cadastro_id: [null],
      solicitacao_assunto_id: [null],
      solicitacao_area_interesse_id: [null],
      solicitacao_reponsavel_analize_id: [null],
      solicitacao_local_id: [null],
      solicitacao_situacao: [null],
      solicitacao_orgao: [null],
      processo_status_id: [null],
      // solicitacao_status_id: [null],
      solicitacao_data1: [null],
      solicitacao_data2: [null],
    });

    this.carregaDropDown();

    this.mi.showMenuInterno();
  }

  carregaDropDown() {
    if (sessionStorage.getItem('proce-menu-dropdown')) {
      this.ddProce = JSON.parse(sessionStorage.getItem('proce-menu-dropdown'));
    } else {
      this.getCarregaDropDown();
    }
  }

  getCarregaDropDown() {
    this.sub.push(this.pdd.resp$.subscribe(
      (dados: boolean ) => {
      },
      error => {
        console.error(error.toString());
      },
      () => {
        this.carregaDropDown();
      }
    ));
    this.pdd.gravaDropDown();
  }

  onMudaForm() {
    this.ps.resetProceBusca();
    let proBusca: ProceBuscaI;
    proBusca = this.formListar.getRawValue();
    this.ps.busca = proBusca;
    this.ps.busca.rows = this.ps.tabela.rows;
    this.ps.buscaMenu();
    this.mi.hideMenu();
  }

  limpar() {
    this.formListar.reset();
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
