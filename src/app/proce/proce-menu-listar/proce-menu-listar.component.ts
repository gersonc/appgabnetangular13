import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";
import {VersaoService} from "../../_services/versao.service";
import {AuthenticationService, DropdownService, MenuInternoService} from "../../_services";
import {Router} from "@angular/router";
import {ProceService} from "../_services/proce.service";
import {ProceDropdownMenuService} from "../_services/proce-dropdown-menu.service";
import {ProceBuscaI} from "../_model/proce-busca-i";
import {ProceDropdownMenuListarI} from "../_model/proce-dropdown-menu-listar-i";



@Component({
  selector: 'app-proce-menu-listar',
  templateUrl: './proce-menu-listar.component.html',
  styleUrls: ['./proce-menu-listar.component.css']
})
export class ProceMenuListarComponent implements OnInit, OnDestroy {
  public altura = (window.innerHeight) + 'px';
  public ddProce: ProceDropdownMenuListarI;
  public formListar: FormGroup;
  public ptBr: any;
  private sub: Subscription[] = [];

  constructor(
    public vs: VersaoService,
    private formBuilder: FormBuilder,
    private dd: DropdownService,
    private ps: ProceService,
    public mi: MenuInternoService,
    public pdd: ProceDropdownMenuService,
    public authenticationService: AuthenticationService,
    private router: Router,
  ) { }

  ngOnInit() {

    this.formListar = this.formBuilder.group({
      cadastro_regiao_id: [null],
      processo_id: [null],
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

  onDiv(ev) {
    console.log('focusin', ev);
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
    this.ps.novaBusca(proBusca);
    this.ps.buscaMenu();
    this.mi.hideMenu();
  }

  limpar() {
    this.formListar.reset();
    const k: string[] = Object.keys(this.formListar.controls);
    k.forEach(s => {
      this.formListar.get(s).enable({onlySelf: true, emitEvent: true});
    });
  }

  processoNumeroChange(ev) {
    console.log('processoNumeroChange', ev);
    const k: string[] = Object.keys(this.formListar.controls);
    if (ev.value !== undefined && ev.value !== null && +ev.value > 0) {
      const e = +ev.value;
      this.formListar.reset();
      k.forEach(s => {
          if (s !== 'processo_id') {
            this.formListar.get(s).disable({onlySelf: true, emitEvent: true});
          } else {
            this.formListar.get(s).setValue(e);
          }
      });
    } else {
      k.forEach(s => {
        this.formListar.get(s).enable({onlySelf: true, emitEvent: true});
      });
      this.formListar.get('processo_id').setValue(null);
    }
  }

  processoNumeroClear() {
    const k: string[] = Object.keys(this.formListar.controls);
    k.forEach(s => {
      this.formListar.get(s).enable({onlySelf: true, emitEvent: true});
    });
    this.formListar.get('processo_id').setValue(null);
  }



  onKey(event) {
    console.log(event);
    // this.onMudaForm()
  }

  fechar() {
  }

  incluirOficio() {
      this.router.navigate(['oficio/processo', {processo_id: 0, solicitacao_id: 0}]);
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
