import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SelectItem } from 'primeng/api';
import { MostraMenuService, DropdownService, AutocompleteService } from '../../_services';
import { AuthenticationService, CarregadorService } from '../../_services';
import { PassagemBuscaService } from '../_services';
import { take } from 'rxjs/operators';
import { PassagemFormularioComponent } from '../passagem-formulario/passagem-formulario.component';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { PassagemDropdown } from '../_models';


@Component({
  selector: 'app-passagem-menu-listar',
  templateUrl: './passagem-menu-listar.component.html',
  styleUrls: ['./passagem-menu-listar.component.css'],
  providers: [ DialogService ]
})
export class PassagemMenuListarComponent implements OnInit, OnDestroy {
  public altura = (window.innerHeight) + 'px';
  public altura2 = ((window.innerHeight) - 130) + 'px';
  public formMenuPassagem: FormGroup;
  public items: Array<any> = [];
  ptBr: any;
  sub: Subscription[] = [];
  public sgt: string[];
  public ddPassagem_aerolinha_id: SelectItem[] = [];
  public ddPassagem_beneficiario: SelectItem[] = [];
  public ddPassagem_voado_id: SelectItem[];
  estilo1 = {width: '100%'};
  estilo2 = {height: this.altura2};

  constructor(
    private formBuilder: FormBuilder,
    private dd: DropdownService,
    private mm: MostraMenuService,
    public authenticationService: AuthenticationService,
    private autocompleteservice: AutocompleteService,
    private activatedRoute: ActivatedRoute,
    public dialogService: DialogService,
    private router: Router,
    private cs: CarregadorService,
    private pbs: PassagemBuscaService
  ) { }

  ngOnInit() {
    console.log('altura2', this.altura2);
    this.configuraCalendario();

    this.formMenuPassagem = this.formBuilder.group({
      passagem_beneficiario: [null],
      passagem_trecho: [null],
      passagem_voo: [null],
      passagem_aerolinha_id: [999],
      passagem_voado_id: [999],
      passagem_data1: [null],
      passagem_data2: [null],
    });

    if (!this.pbs.buscaStateSN) {
      if (sessionStorage.getItem('passagem-listagem')) {
        sessionStorage.removeItem('passagem-listagem');
      }
      this.mm.mudaMenu(true);
    }

    this.sub.push(this.pbs.atualisaMenu$.subscribe(
      (dados: boolean) => {
        if (dados) {
          this.carregaDropDown();
        }
      }
    ));
  }

  configuraCalendario() {
    this.ptBr = {
      firstDayOfWeek: 1,
      dayNames: ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
      dayNamesShort: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'],
      dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
      monthNames: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'septembro',
        'outubro', 'novembro', 'dezembro'],
      monthNamesShort: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
      today: 'Hoje',
      clear: 'Limpar',
      dateFormat: 'dd/mm/yy'
    };
  }

  carregaDropDown() {
    this.ddPassagem_aerolinha_id = JSON.parse(sessionStorage.getItem('passagem_aerolinha-dropdown'));
    this.ddPassagem_beneficiario = JSON.parse(sessionStorage.getItem('passagem_beneficiario-dropdown'));
    const c = new PassagemDropdown();
    this.ddPassagem_voado_id = c.ddPassagem_voado_id;
    this.cs.escondeCarregador();
  }

  autoComp (event, campo) {
    let sg: any[];
    this.autocompleteservice.getACSimples3('passagem', campo, event.query)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          sg = dados;
        },
        error: err => console.error('ERRO-->', err),
        complete: () => {
          this.sgt = sg;
        }
      });
  }

  onMudaForm() {
    this.pbs.resetPassagemBusca();
    this.pbs.ps = this.formMenuPassagem.getRawValue();
    if (this.formMenuPassagem.get('passagem_voado_id').value === 999) {
      this.pbs.ps.passagem_voado_id = null;
    }
    if (this.formMenuPassagem.get('passagem_aerolinha_id').value === 999) {
      this.pbs.ps.passagem_aerolinha_id = null;
    }
    this.pbs.buscaMenu();
    this.mm.mudaMenu(false);
    this.cs.mostraCarregador();
  }

  goIncluir() {
    if (this.authenticationService.passagemaerea_incluir) {
      const ref = this.dialogService.open(PassagemFormularioComponent, {
        data: {
          acao: 'incluir',
          origem: 'menu'
        },
        header: 'INCLUIR PASSAGEM',
        width: '60%',
        height: '50vh',
        dismissableMask: true,
        showHeader: true
      });
    }
  }

  onLimparForm() {
    this.formMenuPassagem.reset();
  }

  onKey(event) {
    let a = 0;
    event.key.toString() === 'Enter' ? this.onMudaForm() : a++;
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

  teste() {
    // this.tt.toggle()
  }

}
