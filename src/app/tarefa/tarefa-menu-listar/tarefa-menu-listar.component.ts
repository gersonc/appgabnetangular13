import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SelectItem } from 'primeng/api';
import {MostraMenuService, DropdownService, AutocompleteService, MenuInternoService} from '../../_services';
import { CarregadorService } from '../../_services';
import { TarefaBuscaService } from '../_services';

import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { TarefaFormularioComponent } from "../tarefa-formulario/tarefa-formulario.component";

@Component({
  selector: 'app-tarefa-menu-listar',
  templateUrl: './tarefa-menu-listar.component.html',
  styleUrls: ['./tarefa-menu-listar.component.css']
})
export class TarefaMenuListarComponent implements OnInit, OnDestroy {
  public formMenuTarefa: FormGroup;
  public items: Array<any> = [];
  ptBr: any;
  sub: Subscription[] = [];
  public sgt: string[];
  public ddTarefa_situacao_id: SelectItem[] = [];
  public ddTarefa_autor_id1: SelectItem[] = [];
  public ddTarefa_autor_id2: SelectItem[] = [];
  public tpListagem = 'recebidas';
  public ddTipo_listagem: SelectItem[] = [
    {label: 'Enviadas', value: 'enviadas'},
    {label: 'Recebidas', value: 'recebidas'}
  ];
  public altura = (window.innerHeight) + 'px';
  public altura2 = ((window.innerHeight) - 130) + 'px';
  estilo1 = {width: '100%'};
  estilo2 = {height: this.altura2};

  constructor(
    private formBuilder: FormBuilder,
    private dd: DropdownService,
    public mi: MenuInternoService,
    // private mm: MostraMenuService,
    private autocompleteservice: AutocompleteService,
    private activatedRoute: ActivatedRoute,
    public dialogService: DialogService,
    private router: Router,
    private cs: CarregadorService,
    private tbs: TarefaBuscaService
  ) { }

  ngOnInit(): void {
    this.configuraCalendario();

    this.formMenuTarefa = this.formBuilder.group({
      tipo_listagem: [this.tpListagem],
      tarefa_titulo: [null],
      tarefa_usuario_autor_id: [null],
      tarefa_usuario_id: [null],
      tarefa_situacao_id: [null],
      tarefa_datahora1: [null],
      tarefa_datahora2: [null],
      tarefa_data1: [null],
      tarefa_data2: [null]
    });

    this.carregaDropDown();

    if (!this.tbs.buscaStateSN) {
      if (sessionStorage.getItem('tarefa-listagem')) {
        sessionStorage.removeItem('tarefa-listagem');
      }
      this.mi.mudaMenuInterno(true);
    }

    this.sub.push(this.tbs.atualisaMenu$.subscribe(
      (dados: boolean) => {
        if (dados) {
          const ddTarefa: any[] = JSON.parse(sessionStorage.getItem('tarefa-dropdown'));
          this.ddTarefa_autor_id1 = ddTarefa['ddTarefa_autor_id1'];
          this.ddTarefa_autor_id2 = ddTarefa['ddTarefa_autor_id2'];
        }}
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
    this.ddTarefa_situacao_id = JSON.parse(sessionStorage.getItem('dropdown-tarefa_situacao'));
    const ddTarefa: any[] = JSON.parse(sessionStorage.getItem('tarefa-dropdown'));
    this.ddTarefa_autor_id1 = ddTarefa['ddTarefa_autor_id1'];
    this.ddTarefa_autor_id2 = ddTarefa['ddTarefa_autor_id2'];
    this.cs.escondeCarregador();
  }

  onMudaForm() {
    this.tbs.resetTarefaBusca();
    this.tbs.tb = this.formMenuTarefa.getRawValue();
    if (!this.tbs.tb.sortcampo) {
      this.tbs.tb.sortcampo = 'tarefa_datahora';
      this.tbs.tb.sortorder = '01';
    }
    this.tbs.buscaMenu();
    this.mi.mudaMenuInterno(false);
    this.cs.mostraCarregador();
  }

  goIncluir() {
    const ref = this.dialogService.open(TarefaFormularioComponent, {
      data: {
        acao: 'incluir',
        origem: 'menu',
        tpBusca: this.tpListagem
      },
      styleClass: 'tablistagem',
      header: 'INCLUIR TAREFA',
      width: '60%',
      dismissableMask: false,
      showHeader: true,
      modal: true
    });
  }

  onKey(event) {
    let a = 0;
    event.key.toString() === 'Enter' ? this.onMudaForm() : a++;
  }



  mudaTipoListagem(ev) {
    this.tpListagem = this.formMenuTarefa.get('tipo_listagem').value;
    this.formMenuTarefa.get('tarefa_usuario_autor_id').reset();
    this.formMenuTarefa.get('tarefa_usuario_id').reset();
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
