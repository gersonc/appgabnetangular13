import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { LazyLoadEvent, Message, MessageService } from 'primeng/api';
import { take } from 'rxjs/operators';
import { WindowsService } from '../../_layout/_service';
import {
  CadastroTotalInterface,
  CadastroBuscaCampoInterface,
  CadastroSmsInterface,
  SmsDbInterface, CadastroSmsPaginacaoInterface
} from '../_models';
import { CadastroBuscaService, CadastroService } from '../_services';
import {AuthenticationService, CarregadorService, MenuInternoService} from '../../_services';
import { MostraMenuService } from '../../_services';
import { SmsService } from '../../sms/_services/sms.service';


@Component({
  selector: 'app-cadastro-sms-datatable',
  templateUrl: './cadastro-sms-datatable.component.html',
  styleUrls: ['./cadastro-sms-datatable.component.css'],
  providers: [MessageService]
})
export class CadastroSmsDatatableComponent implements OnInit, OnDestroy {
  @ViewChild('dtsms', { static: true }) public dtsms: any;
  @ViewChild('smstext', { static: false }) public smstext: any;
  loading = false;
  cols: any[];
  currentPage = 1;
  cadastros: CadastroSmsInterface[];
  total: CadastroTotalInterface;
  totalRecords = 0;
  numerodePaginas: number;
  first: number;
  rows = 50;
  selecionados: CadastroSmsInterface[];
  sortCampo = 'cadastro_nome';
  selectedColumns: any[] = [];
  selectedColumnsOld: any[] = [];
  camposSelecionados: CadastroBuscaCampoInterface[];
  altura = `${WindowsService.altura - 150}` + 'px';
  meiaAltura = `${(WindowsService.altura - 170) / 2}` + 'px';
  tmp = false;
  clonedCad: { [id: number]: CadastroSmsInterface; } = {};
  idx: number;
  campo: string;
  resp: any[];
  msgs: Message[] = [];
  telefones: string[] = [];
  telefones2: string[] = [];
  smsTexto = '';
  todos1: boolean = null;
  todos2: boolean = null;
  celular1: SmsDbInterface[] = [];
  celular2: SmsDbInterface[] = [];
  celular: SmsDbInterface[] = [];
  sms_restante = 0;
  sms_rest = 0;
  sms_contador = 0;
  sms_contador1 = 0;
  sms_contador2 = 0;
  display = false;
  displayEnvio = false;
  sub: Subscription[] = [];
  soLeitura = false;
  buscaStateSN: boolean;


  constructor(
    private smsService: SmsService,
    // public mm: MostraMenuService,
    public mi: MenuInternoService,
    public authenticationService: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private cadastroService: CadastroService,
    private cbs: CadastroBuscaService,
    private cs: CarregadorService
  ) { }

  ngOnInit() {
    this.getSmsRestante();
    this.checaPermissoes();
    this.cols = [
      {field: 'cadastro_tipo_nome', header: 'TIPO', sortable: 'true', largura: '200px'},
      {field: 'cadastro_nome', header: 'NOME / RAZÃO SOCIAL', sortable: 'true', largura: '300px'},
      {field: 'cadastro_celular', header: 'CELULAR 1', sortable: 'false', largura: '150px'},
      {field: 'cadastro_celular2', header: 'CELULAR 2', sortable: 'false', largura: '150px'},
      {field: 'cadastro_municipio_nome', header: 'MUNICÍPIO', sortable: 'true', largura: '250px'}
    ];

    if (this.cbs.buscaStateSN) {
      this.getState();
    } else {
      this.cbs.cadastroBusca.todos = false;
    }

    this.sub.push(this.cbs.busca$.subscribe(
      () => {
        this.cbs.cadastroBusca.todos = false;
        this.dtsms.reset();
        this.dtsms.selectionKeys = [];
        this.selecionados = [];
      }
    ));
  }

  ngOnDestroy(): void {
    this.cbs.cadastroBusca.todos = false;
    this.celular1 = [];
    this.telefones = [];
    this.celular2 = [];
    this.telefones2 = [];
    this.dtsms.reset();
    this.dtsms.selectionKeys = [];
    this.sub.forEach(s => s.unsubscribe());
  }

  // EVENTOS ===================================================================

  onLazyLoad(event: LazyLoadEvent): void {
    let bsc = false;
    if (event.sortField) {
      if (this.cbs.cadastroBusca.sortcampo !== event.sortField.toString ()) {
        this.cbs.cadastroBusca.sortcampo = event.sortField.toString ();
        bsc = true;
      }
    }
    if (this.cbs.cadastroBusca.inicio !== event.first.toString()) {
      this.cbs.cadastroBusca.inicio = event.first.toString();
      bsc = true;
    }
    if (this.cbs.cadastroBusca.numlinhas !== event.rows.toString()) {
      this.cbs.cadastroBusca.numlinhas = event.rows.toString();
      this.rows = event.rows;
      bsc = true;
    }
    if (this.cbs.cadastroBusca.sortorder !== event.sortOrder.toString()) {
      this.cbs.cadastroBusca.sortorder = event.sortOrder.toString();
      bsc = true;
    }

    if (bsc) {
      this.postCadastroSmsBusca();
    }
  }

  // FUNCOES DO COMPONENTE =====================================================

  mostraMenu(): void {
    this.mi.showMenuInterno();
  }

  resetSelectedColumns(): void {
    if (this.selectedColumns.length <= 1) {
      this.selectedColumns = [
        {field: 'cadastro_tipo_nome', header: 'TIPO', sortable: 'true', largura: '200px'},
        {field: 'cadastro_nome', header: 'NOME / RAZÃO SOCIAL', sortable: 'true', largura: '300px'},
        {field: 'cadastro_celular', header: 'CELULAR 1', sortable: 'false', largura: '150px'},
        {field: 'cadastro_celular2', header: 'CELULAR 2', sortable: 'false', largura: '150px'},
        {field: 'cadastro_municipio_nome', header: 'MUNICÍPIO', sortable: 'true', largura: '250px'}
      ];
    }
  }

  reset() {
    this.dtsms.reset();
  }

  limpaTelefone(str: string | null) {
    if (str) {
      str = str.replace('(', '');
      str = str.replace(')', '');
      str = str.replace('-', '');
      str = str.replace(' ', '');
      str = str.replace('_', '');
      if (str.length > 9) {
        str = str.substr(0, 2) + ' ' + str.substr(2);
      }
    }
    return str;
  }

  checke1(cad: CadastroSmsInterface) {
    if (this.todos1 === true) {
      this.todos1 = false;
    }
    if (this.telefones.length === 0) {
      this.telefones = [];
      this.todos1 = null;
    }
    if (this.telefones.length >= 1) {
      this.todos1 = false;
    }
    const idx = this.telefones.indexOf(cad.cadastro_celular);

    if (idx !== -1) {
      if (this.sms_rest > 0) {
        this.sms_rest--;
        this.sms_contador++;
        this.sms_contador1++;
        this.celular1.push({
            telefone: cad.cadastro_celular,
            nome: cad.cadastro_nome,
            municipio: cad.cadastro_municipio_nome
          }
        );
      } else {
        this.alerta();
      }
    } else {
      this.sms_rest++;
      this.sms_contador--;
      this.sms_contador2--;
      if (this.sms_contador > 0) {
        const nx = this.celular1.length - 1;
        for (let x = 0; x <= nx; x++) {
          if (cad.cadastro_celular === this.celular1[x].telefone) {
            this.celular1.splice(x, 1);
            break;
          }
        }
      } else {
        this.celular1 = [];
      }
    }
  }

  checke2(cad: CadastroSmsInterface) {
    if (this.todos2 === true) {
      this.todos2 = false;
    }
    if (this.telefones2.length === 0) {
      this.todos2 = null;
      this.telefones2 = [];
    }
    if (this.telefones2.length >= 1) {
      this.todos2 = false;
    }
    const idx = this.telefones2.indexOf(cad.cadastro_celular2);
    if (idx !== -1) {
      if (this.sms_rest > 0) {
        this.sms_rest--;
        this.sms_contador++;
        this.celular2.push({
            telefone: cad.cadastro_celular2,
            nome: cad.cadastro_nome,
            municipio: cad.cadastro_municipio_nome
          }
        );
      } else {
        this.alerta();
      }
    } else {
      this.sms_rest++;
      this.sms_contador--;
      if (this.sms_contador > 0) {
        const nx = this.celular2.length - 1;
        for (let x = 0; x <= nx; x++) {
          if (cad.cadastro_celular2 === this.celular2[x].telefone) {
            this.celular2.splice(x, 1);
            break;
          }
        }
      } else {
        this.celular2 = [];
      }
    }
  }

  testaCkbox1(cadastro_celular: string): boolean {
    return this.sms_rest === 0 && this.telefones.indexOf(cadastro_celular) === -1;
  }

  testaCkbox2(cadastro_celular: string): boolean {
    return this.sms_rest === 0 && this.telefones2.indexOf(cadastro_celular) === -1;
  }

  alerta() {
    if (this.sms_rest === 0) {
      const txt = 'ATENÇÃO - Total de créditos alcançado';
      this.messageService.add({
        key: 'semCreditos',
        severity: 'warn',
        summary: 'CRÉDITOS',
        detail: txt
      });
    }
  }

  mudaTodos1(event) {
    if (event.value === true) {
      this.cbs.cadastroBusca.todos = true;
      this.postCadastroSmsTodos(1);
    } else {
      this.cbs.cadastroBusca.todos = false;
      if (this.todos1 === null) {
        this.telefones = [];
        this.celular1 = [];
        this.sms_contador = this.sms_contador - this.sms_contador1;
        this.getSmsRestante();
      }
    }
  }

  mudaTodos2(event) {
    if (event.value === true) {
      this.cbs.cadastroBusca.todos = true;
      this.postCadastroSmsTodos(2);
    } else {
      this.cbs.cadastroBusca.todos = false;
      if (this.todos2 === null) {
        this.telefones2 = [];
        this.celular2 = [];
        this.sms_contador = this.sms_contador - this.sms_contador2;
      }
    }
  }

  voltarCadastro() {
    this.cbs.smsSN = false;
    this.cbs.criarCadastroBusca();
    if (sessionStorage.getItem('cadastro-busca-sms')) {
      sessionStorage.removeItem('cadastro-busca-sms');
    }
      this.mi.mudaSmsVF(false);
      this.cbs.buscaStateSN = false;
      this.cadastros = null;
      this.mi.showMenuInterno();
      this.router.navigate(['/cadastro/listar']);
  }

  verificaValido(valor: string | null) {
    let cor = 'inherit';
    if (valor === null || valor === '') {
      return cor;
    }
    if (valor.length < 12) {
      cor = '#ffc107';
    }
    return cor;
  }

  getSmsRestante() {
    this.sub.push(this.smsService.getRestante()
      .pipe(take(1))
      .subscribe(
        dados => this.sms_restante = +dados[0],
        error1 => console.error(error1),
        () => {
          this.soLeitura = this.sms_restante === 0;
          this.sms_rest = this.sms_restante;
        }
      ));
  }


  // FUNCOES DE BUSCA ==========================================================

  postCadastroSmsBusca(): void {
    this.cs.mostraCarregador();
    this.sub.push(this.cadastroService.postCadastroSmsBusca(this.cbs.cadastroBusca)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.cadastros = dados.cadastros;
          this.total = dados.total;
          this.totalRecords = this.total.num;
        },
        error: err => console.error('ERRO-->', err),
        complete: () => {
          this.cbs.cadastroBusca.todos = this.tmp;
          this.currentPage = (
            parseInt(this.cbs.cadastroBusca.inicio, 10) +
            parseInt(this.cbs.cadastroBusca.numlinhas, 10)) /
            parseInt(this.cbs.cadastroBusca.numlinhas, 10);
          this.numerodePaginas = Math.ceil(this.totalRecords / this.rows);
          this.cbs.buscaStateSN = true;
          this.cs.escondeCarregador();
        }
      }));
  }

  // @ts-ignore
  postCadastroSmsTodos(cpo: number) {
    if (cpo < 1 || cpo > 2) {
      return false;
    }
    this.cs.mostraCarregador();
    this.sub.push(this.cadastroService.postCadastroSmsTodos(this.cbs.cadastroBusca, cpo)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          if (cpo === 1) {
            this.telefones = dados.telefones;
            this.celular1 = dados.telsCompleto;
          } else {
            this.telefones2 = dados.telefones;
            this.celular2 = dados.telsCompleto;
          }
        },
        error: err => console.error('ERRO-->', err),
        complete: () => {
          // GRAVAR NO BD;
          this.cbs.buscaStateSN = true;
          this.cbs.cadastroBusca.todos = false;
          this.cs.escondeCarregador();
          return true;
        }
      }));
  }

  getState(): void {
    if (this.cbs.buscaStateSN && sessionStorage.getItem('cadastro-busca-sms')) {
      this.cbs.criarCadastroBusca();
      this.cbs.cadastroBusca = JSON.parse(sessionStorage.getItem('cadastro-busca-sms'));
      this.sub.push(this.activatedRoute.data.subscribe(
        (data: { dados: CadastroSmsPaginacaoInterface }) => {
          this.cadastros = data.dados.cadastros ? data.dados.cadastros : [];
          this.total = data.dados.total ? data.dados.total : null;
          this.totalRecords = data.dados.total ? data.dados.total.num : 0;
          this.cbs.cadastroBusca.todos = this.tmp;
          this.currentPage = (
            parseInt(this.cbs.cadastroBusca.inicio, 10) +
            parseInt(this.cbs.cadastroBusca.numlinhas, 10)) /
            parseInt(this.cbs.cadastroBusca.numlinhas, 10);
          this.numerodePaginas = Math.ceil(this.totalRecords / this.rows);
          this.cbs.buscaStateSN = true;
          sessionStorage.removeItem('cadastro-busca-sms');
          this.cs.escondeCarregador();
        }));
    }
  }

  // FUNCOES DE CRUD ===========================================================

  checaPermissoes(): void {
    if (!this.authenticationService.sms || !this.authenticationService.sms_incluir) {
      this.router.navigate(['/']);
    }
  }

  onEditInit(event) {
    this.clonedCad[event.data[0].cadastro_id] = {...event.data[0]};
    this.idx = event.data[1];
    this.campo = event.field;
  }

  onEditComplete(event) {
    let valor: string;
    let alterado = false;
    if (event.field === 'cadastro_celular') {
      valor = this.limpaTelefone(event.data[0].cadastro_celular);
      if (this.limpaTelefone(this.clonedCad[event.data[0].cadastro_id].cadastro_celular)
        !== valor ) {
        alterado = true;
      }
    }
    if (event.field === 'cadastro_celular2') {
      valor = this.limpaTelefone(event.data[0].cadastro_celular2);
      if (this.limpaTelefone(this.clonedCad[event.data[0].cadastro_id].cadastro_celular2)
        !== valor ) {
        alterado = true;
      }
    }
    if (alterado) {
      this.sub.push(this.cadastroService.postCelular(event.field, valor, event.data[0].cadastro_id)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: err => {
            console.error(err.toString());
            this.messageService.add({
              key: 'celularToast',
              severity: 'warn',
              summary: 'ERRO ALTERAR',
              detail: this.resp[2]
            });
          },
          complete: () => {
            if (this.resp[0]) {
              this.messageService.add({
                key: 'celularToast',
                severity: 'success',
                summary: 'ALTERAR CELULAR',
                detail: this.resp[2]
              });
              if (event.field === 'cadastro_celular') {
                this.cadastros[event.data[1]].cadastro_celular = valor;
              }
              if (event.field === 'cadastro_celular2') {
                this.cadastros[event.data[1]].cadastro_celular2 = valor;
              }
            } else {
              console.error('ERRO - CELULAR ', this.resp[2]);
              this.messageService.add({
                key: 'celularToast',
                severity: 'warn',
                summary: 'ATENÇÃO - ERRO',
                detail: this.resp[2]
              });
            }
          }
        }
      ));
    }
  }

  onEditCancel(event) {
    if (event.field === 'cadastro_celular') {
      this.clonedCad[event.data[0].cadastro_id].cadastro_celular =
        this.limpaTelefone(this.clonedCad[event.data[0].cadastro_id].cadastro_celular);
    }
    if (event.field === 'cadastro_celular2') {
      this.clonedCad[event.data[0].cadastro_id].cadastro_celular2 =
        this.limpaTelefone(this.clonedCad[event.data[0].cadastro_id].cadastro_celular2);
    }

    this.cadastros[event.data[1]] = this.clonedCad[event.data[0].cadastro_id];
    delete this.clonedCad[event.data[0].cadastro_id];
  }

  // FUNCOES RELATORIOS=========================================================

  enviaSms(mensagem: string) {
    if (mensagem.length === 0) {
      this.messageService.add({
        key: 'celularCreditos',
        severity: 'error',
        summary: 'MENSAGEM EM BRANCO',
        detail: 'ATENÇÃO - Mensagem em branco.'
      });
    } else {
      this.celular = this.celular1.concat(this.celular2);
      if (this.sms_restante < this.celular.length) {
        const txt = 'ATENÇÃO - Créditos insuficientes para envio';
        this.messageService.add({
          key: 'celularCreditos',
          severity: 'error',
          summary: 'CRÉDITOS INSUFICIENTE',
          detail: txt
        });
      } else {
        this.displayEnvio = true;
        this.celular1 = [];
        this.celular2 = [];
        this.display = true;
      }
    }
  }

  fechaSms(ev) {
    this.displayEnvio = false;
  }

}
