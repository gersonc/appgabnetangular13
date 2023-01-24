import {Component, OnDestroy, OnInit} from '@angular/core';
import {WindowsService} from "../../_layout/_service";
import {Subscription} from "rxjs";
import {MenuInternoService} from "../../_services";
import {MensagemService} from "../_services/mensagem.service";
import {LazyLoadEvent, SelectItem} from "primeng/api";
import {FormBuilder, FormGroup} from "@angular/forms";
import {DdService} from "../../_services/dd.service";
import {take} from "rxjs/operators";
import {MansagemBuscaI} from "../_models/mansagem-busca-i";
import {DateTime} from "luxon";
import {MenuDatatableService} from "../../_services/menu-datatable.service";
import {DispositivoService} from "../../_services/dispositivo.service";
import {MsgService} from "../../_services/msg.service";
import {MensagemOnoffService} from "../../_services/mensagem-onoff.service";

@Component({
  selector: 'apmensagem-datatable',
  templateUrl: './mensagem-datatable.component.html',
  styleUrls: ['./mensagem-datatable.component.css']
})
export class MensagemDatatableComponent implements OnInit, OnDestroy {
  altura = `${WindowsService.altura - 170}` + 'px';
  meiaAltura = `${(WindowsService.altura - 210) / 2}` + 'px';
  sub: Subscription[] = [];
  mostraMenuInterno = false;
  classeOld = '';

  ptBr: any;
  // sub: Subscription[] = [];
  public formMenuMensagem?: FormGroup;
  public ddusuario_mensagem_usuario_id: SelectItem[] = [];
  public ddusuario_id: SelectItem[] = [];
  public ddTipo_listagem: SelectItem[] = [
    {label: 'Enviadas', value: 'enviadas'},
    {label: 'Recebidas', value: 'recebidas'},
  ];
  public ddMensagem_vistas: SelectItem[] = [
    {label: 'Todas', value: 0},
    {label: 'Lidas', value: 1},
    {label: 'Não lidas', value: 2},
  ];
  resp: any[] = [];
  classe = "col-12 sm:col-12 md:col-8 lg:col-9 xl:col-10";


  constructor(
    public ds: DispositivoService,
    public md: MenuDatatableService,
    public ms: MensagemService,
    private formBuilder: FormBuilder,
    private dd: DdService,
    private mss: MsgService,
    private mo: MensagemOnoffService
  ) { }

  ngOnInit(): void {
    this.classe = (this.ds.dispositivo === 'desktop') ? "col-12 sm:col-12 md:col-8 lg:col-9 xl:col-10" : "col-12 sm:col-12 md:col-8 lg:col-9 xl:col-10";
    this.formMenuMensagem = this.formBuilder.group({
      usuario_mensagem_usuario_id: [null],
      usuario_id: [null],
      mensagem_data1: [null],
      mensagem_data2: [null],
      // usuario_mensagem_visto: [0],
      tipo_listagem: ['recebidas'],
      mensagem_titulo: [null],
    });

    this.carregaDropDown();


    this.ms.criaTabela();
  }

  mostraMenu() {
    this.mostraMenuInterno = !this.mostraMenuInterno;

  }

  incluir() {
    this.mo.msgform = true;
  }


  onLazyLoad(event: LazyLoadEvent): void {
    let ct = 0;
    if (this.ms.tabela.sortField !== event.sortField) {
      this.ms.tabela.sortField = event.sortField;
      ct++;
    }
    if (this.ms.tabela.first !== +event.first) {
      this.ms.tabela.first = +event.first;
      ct++;
    }
    if (event.rows !== undefined && this.ms.tabela.rows !== +event.rows) {
      this.ms.tabela.rows = +event.rows;
      ct++;
    }
    if (this.ms.tabela.sortOrder !== +event.sortOrder) {
      this.ms.tabela.sortOrder = +event.sortOrder;
      ct++;
    }
    if (ct > 0) {
      this.ms.lazy = true;
      this.ms.mensagemBusca();
    }
  }



  // -----------------------------------------------------------------------------------

  carregaDropDown() {
    if (sessionStorage.getItem('dropdown-usuario')) {
      this.ddusuario_mensagem_usuario_id = JSON.parse(sessionStorage.getItem('dropdown-usuario'));
      this.ddusuario_id = JSON.parse(sessionStorage.getItem('dropdown-usuario')!);
    } else {
      this.populaDropdown();
    }
  }

  populaDropdown() {
    this.sub.push(this.dd.getDd('dropdown-usuario')
      .pipe(take(1))
      .subscribe({
        next: (dados) => sessionStorage.setItem('dropdown-usuario', JSON.stringify(dados)),
        error: (err) => console.error(err),
        complete: () => this.carregaDropDown()
      })
    );
  }



  onMudaForm() {
    this.ms.resetMensagemBusca();
    this.ms.novaBusca(this.criaBusca());
    this.ms.buscaMenu();
    //this.mi.hideMenu();
  }

  criaBusca(): MansagemBuscaI {
    const b: MansagemBuscaI = {};
    const f = this.formMenuMensagem.getRawValue();
    console.log('criaBusca1', f);
    if (f.tipo_listagem !== null) {
      b.tipo_listagem = (f.tipo_listagem === 'recebidas') ? 2 : 1;
    }
    if (f.usuario_mensagem_usuario_id !== null) {
      b.usuario_mensagem_usuario_id = f.usuario_mensagem_usuario_id;
    }
    if (f.usuario_id !== null) {
      b.usuario_id = f.usuario_id;
    }
    if (f.mensagem_titulo !== null && Array.isArray(f.mensagem_titulo)) {
      const c: string[] = f.mensagem_titulo;
      b.mensagem_titulo = c.map(a => {return a.toUpperCase()});
    }
    if (f.mensagem_data1 !== null) {
      b.mensagem_data1 = DateTime.fromJSDate(f.mensagem_data1).toFormat('yyyy-LL-dd');
    }
    if (f.mensagem_data2 !== null) {
      b.mensagem_data2 = DateTime.fromJSDate(f.mensagem_data2).toFormat('yyyy-LL-dd');
    }
    /*if (f.usuario_mensagem_visto !== null) {
      b.usuario_mensagem_visto = f.usuario_mensagem_visto;
    }*/
    console.log('criaBusca', b);
    return b;
  }

  limpar() {
    this.formMenuMensagem = this.formBuilder.group({
      usuario_mensagem_usuario_id: [null],
      usuario_id: [null],
      mensagem_data1: [null],
      mensagem_data2: [null],
      // usuario_mensagem_visto: [0],
      tipo_listagem: ['recebidas'],
      mensagem_titulo: [null],
    });
  }

  fechaMenu() {

  }

  onKey(event) {
    let a = 0;
    event.key.toString() === 'Enter' ? this.onMudaForm() : a++;
  }

  onAddTitulo(ev, ev2) {
    const v1: string = ev.value;
    const v2: string[] = ev2;
    if (v1.length < 4) {
      if (v2.length === 1) {
        this.formMenuMensagem.get('mensagem_titulo').patchValue(null);
      } else {
        ev2.pop();
        this.formMenuMensagem.get('mensagem_titulo').patchValue(ev2);
      }
    }
    console.log('mensagem_titulo',ev, ev2);
  }


  mudaTipo(tipo: string) {
    console.log('mudaTipo',tipo);
    this.ms.listagem_tipo = tipo;
  }

  onApagar(n: number) {
    if (this.ms.listagem_tipo === 'recebidas') {
      this.deleteRecebida(n);
    } else {
      this.deleteEnviadas(n);
    }
  }

  onApagar2(n: number) {
    this.sub.push(this.ms.excluirMensagemRemetenteTodos(n)
      .pipe(take(1))
      .subscribe({
        next: (dados) => this.resp = dados,
        error: (err) => console.error(err),
        complete: () => {
          if (this.resp[0]) {
            const i: number = this.ms.mensagens.findIndex(y => y.mensagem_id = n);
            this.ms.lazy = false;
            this.ms.mensagens.splice(i,1);
            this.ms.lazy = true;
            this.mss.add({
              key: 'toastprincipal',
              severity: 'success',
              summary: 'APAGAR MENSAGEMS',
              detail: this.resp[2]
            });
          } else {
            this.mss.add({
              key: 'toastprincipal',
              severity: 'warn',
              summary: 'ATENÇÃO - ERRO',
              detail: this.resp[2]
            });
          }
        }
      })
    );
  }


  deleteRecebida(n: number) {
    this.sub.push(this.ms.excluirMensagemUsuario(n)
      .pipe(take(1))
      .subscribe({
        next: (dados) => this.resp = dados,
        error: (err) => console.error(err),
        complete: () => {
          if (this.resp[0]) {
            const i: number = this.ms.mensagens.findIndex(y => y.mensagem_id = n);
            this.ms.lazy = false;
            this.ms.mensagens.splice(i,1);
            this.ms.lazy = true;
            this.mss.add({
              key: 'toastprincipal',
              severity: 'success',
              summary: 'APAGAR MENSAGEM',
              detail: this.resp[2]
            });
          } else {
            this.mss.add({
              key: 'toastprincipal',
              severity: 'warn',
              summary: 'ATENÇÃO - ERRO',
              detail: this.resp[2]
            });
          }
        }
      })
    );
  }

  deleteEnviadas(n: number) {
    this.sub.push(this.ms.excluirMensagemRemetente(n)
      .pipe(take(1))
      .subscribe({
        next: (dados) => this.resp = dados,
        error: (err) => console.error(err),
        complete: () => {
          if (this.resp[0]) {
            const i: number = this.ms.mensagens.findIndex(y => y.mensagem_id = n);
            this.ms.lazy = false;
            this.ms.mensagens.splice(i,1);
            this.ms.lazy = true;
            this.mss.add({
              key: 'toastprincipal',
              severity: 'success',
              summary: 'APAGAR MENSAGEM',
              detail: this.resp[2]
            });
          } else {
            this.mss.add({
              key: 'toastprincipal',
              severity: 'warn',
              summary: 'ATENÇÃO - ERRO',
              detail: this.resp[2]
            });
          }
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }
}
