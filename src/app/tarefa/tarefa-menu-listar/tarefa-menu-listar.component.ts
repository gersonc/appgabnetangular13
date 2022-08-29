import {Component, OnDestroy, OnInit} from '@angular/core';
import {TarefaDropdownService} from "../_services/tarefa-dropdown.service";
import {TarefaFormService} from "../_services/tarefa-form.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {SelectItem} from "primeng/api";
import {TarefaBuscaI} from "../_models/tarefa-i";
import {TarefaService} from "../_services/tarefa.service";
import {Subscription} from "rxjs";
import {MenuInternoService} from "../../_services";
import {DateTime} from "luxon";
import {ddTipo_listagem_id, TarefaMenuDropdownI} from "../_models/tarefa-menu-dropdown-i";

@Component({
  selector: 'app-tarefa-menu-listar',
  templateUrl: './tarefa-menu-listar.component.html',
  styleUrls: ['./tarefa-menu-listar.component.css']
})
export class TarefaMenuListarComponent implements OnInit, OnDestroy {
  public formMenuTarefa: FormGroup;
  ptBr: any;
  sub: Subscription[] = [];
  public sgt: string[];
  /*public ddTarefa_situacao_id: SelectItem[] = [];
  public ddTarefa_autor_id: SelectItem[] = [];
  public ddTarefa_demandados_id: SelectItem[] = [];*/
  // dd: TarefaMenuDropdownI | null = null;
  public tpListagem = 0;
  /*ddTipo_listagem: SelectItem[] = [
    {label: 'Enviadas', value: 1},
    {label: 'Recebidas', value: 0},
  ];*/
  dd = ddTipo_listagem_id;

  public altura = (window.innerHeight) + 'px';
  public altura2 = ((window.innerHeight) - 130) + 'px';
  estilo1 = {width: '100%'};
  estilo2 = {height: this.altura2};

  constructor(
    private formBuilder: FormBuilder,
    public cdd: TarefaDropdownService,
    public mi: MenuInternoService,
    public ts: TarefaService,
    private tfs: TarefaFormService
  ) { }

  ngOnInit() {
    this.criaFormMenu();
    this.carregaDropDown();
  }

  criaFormMenu() {
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
  }

  carregaDropDown() {
    if (this.cdd.tarefaMenuDD === null) {
      this.cdd.dropDown();
    }
  }


  onMudaForm() {
    this.ts.resetTarefaBusca();
    this.ts.novaBusca(this.criaBusca());
    delete this.ts.busca.ids;
    this.ts.buscaMenu();
    this.mi.hideMenu();
  }

  criaBusca(): TarefaBuscaI {
    let b: TarefaBuscaI = {};
    const f = this.formMenuTarefa.getRawValue();

    if (f.tarefa_titulo !== null) {
      if (Array.isArray(f.tarefa_titulo)) {
        const c: string[] = f.tarefa_titulo;
        b.tarefa_titulo_array = c.map(a => {
          return a.toUpperCase();
        });
      } else {
        b.tarefa_titulo = f.toUpperCase();
      }
    }
    b.tipo_listagem = +f.tipo_listagem;
    if (f.tarefa_data1 !== null) {
      b.tarefa_data1 = DateTime.fromJSDate(f.tarefa_data1).toSQLDate();
    }
    if (f.tarefa_data2 !== null) {
      b.tarefa_data2 = DateTime.fromJSDate(f.tarefa_data2).toSQLDate();
    }
    if (f.tarefa_datahora1 !== null) {
      b.tarefa_datahora1 = DateTime.fromJSDate(f.tarefa_datahora1).toSQLDate();
    }
    if (f.tarefa_datahora2 !== null) {
      b.tarefa_datahora2 = DateTime.fromJSDate(f.tarefa_datahora2).toSQLDate();
    }
    if (f.tarefa_situacao_id !== undefined && f.tarefa_situacao_id !== null && f.tarefa_situacao_id !== 999) {
      b.tarefa_situacao_id = +f.tarefa_situacao_id;
    }
    if (f.tarefa_usuario_autor_id !== undefined && f.tarefa_usuario_autor_id !== null && f.tarefa_usuario_autor_id !== 999) {
      b.tarefa_usuario_autor_id = +f.tarefa_usuario_autor_id;
    }
    if (f.tarefa_usuario_id !== undefined && f.tarefa_usuario_id !== null && f.tarefa_usuario_id !== 999) {
      b.tarefa_usuario_id = +f.tarefa_usuario_id;
    }
    return b;
  }

  limpar() {
    this.formMenuTarefa.reset();
    this.criaFormMenu();
  }

  onAddTarefa(ev, ev2) {
    const v1: string = ev.value;
    const v2: string[] = ev2;
    if (v1.length < 2) {
      if (v2.length === 1) {
        this.formMenuTarefa.get('cedente_array').patchValue(null);
      } else {
        ev2.pop();
        this.formMenuTarefa.get('cedente_array').patchValue(ev2);
      }
    }
  }

  goIncluir() {
      this.tfs.acao = 'incluir';
      this.tfs.criaFormIncluir()
      this.mi.mudaMenuInterno(false);
      this.ts.showForm = true;
  }

  onKey(event) {
    let a = 0;
    event.key.toString() === 'Enter' ? this.onMudaForm() : a++;
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
