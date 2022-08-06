import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {WindowsService} from "../../_layout/_service";
import {AuthenticationService} from "../../_services";
import {MsgService} from "../../_services/msg.service";
import {Router} from "@angular/router";
import {AndamentoProposicaoFormI, AndamentoProposicaoI} from "../../proposicao/_models/andamento-proposicao-i";
import {SelectItem} from "primeng/api";
import {AndamentoProposicaoService} from "../../proposicao/_services/andamento-proposicao.service";
import Quill from "quill";
import {DateTime} from "luxon";

@Component({
  selector: 'app-andamento-proposicao-listar',
  templateUrl: './andamento-proposicao-listar.component.html',
  styleUrls: ['./andamento-proposicao-listar.component.css']
})
export class AndamentoProposicaoListarComponent implements OnInit {
  @ViewChild('tgl', { static: true }) tgl: ElementRef;
  // @Input() apListarl?: AndamentoProposicaoI[];
  // Input() apl?: AndamentoProposicaoI;
  // @Input() proposicaoIdl?: number;
  // @Input() idxl?: number;
  @Input() acaol?: string;
  @Output() acaolChange = new EventEmitter<string>();
  @Output() apListarlChange = new EventEmitter<AndamentoProposicaoI[]>();
  @Output() aplChange = new EventEmitter<AndamentoProposicaoI>();

  altura = `${WindowsService.altura - 180}` + 'px';
  meiaAltura = `${(WindowsService.altura - 210) / 2}` + 'px';
  cols: any[] = [];
  andexp: AndamentoProposicaoI | null = null;
  form: AndamentoProposicaoI | null = null;
  sortField?: string = 'andamento_proposicao_id';
  // andSelect?: string;
  // expanded = true;
  display = false;
  botaoEnviarVF = false;
  totalRecords = 0;
  msg = 'Deseja excluir permanetemente esta proposição?';
  ddProposicao_orgao_id: SelectItem[];
  ddProposicao_situacao_id: SelectItem[];
  permitirAcao = false;
  permitirAlterar = false;
  permitirApagar = false;

  btnIdx = '';
  idx = -1;

  sn_relator_atual = false;
  sn_situacao = false;
  sn_orgao = false;

  format0: 'html' | 'object' | 'text' | 'json' = 'html';
  kill0: Quill;

  modulos = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
      [{'header': 1}, {'header': 2}],               // custom button values
      [{'list': 'ordered'}, {'list': 'bullet'}],
      [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
      [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
      [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
      [{'header': [1, 2, 3, 4, 5, 6, false]}],
      [{'color': []}, {'background': []}],          // dropdown with defaults from theme
      [{'font': []}],
      [{'align': []}],
      ['clean']                        // link and image, video
    ]
  };

  constructor(
    public aut: AuthenticationService,
    private ms: MsgService,
    private router: Router,
    public aps: AndamentoProposicaoService
  ) { }


  ngOnInit(): void {
    this.permitirAcao = (this.aut.andamentoproposicao_alterar || this.aut.andamentoproposicao_apagar || this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn);
    this.permitirAlterar = (this.aut.andamentoproposicao_alterar || this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn);
    this.permitirApagar = (this.aut.andamentoproposicao_apagar || this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn);
    this.carregaDropdownSessionStorage();
    this.montaColunas();
  }

  carregaDropdownSessionStorage() {
    this.ddProposicao_situacao_id = JSON.parse(sessionStorage.getItem('dropdown-situacao_proposicao'));
    this.ddProposicao_orgao_id = JSON.parse(sessionStorage.getItem('dropdown-orgao_proposicao'));
  }

  montaColunas() {
    this.cols = [
      {field: 'andamento_proposicao_data', header: 'DATA', sortable: 'true', width: '90px'},
      {field: 'andamento_proposicao_situacao_nome', header: 'SITUAÇÃO', sortable: 'true', width: '275px'},
      {field: 'andamento_proposicao_orgao_nome', header: 'ORGÃO ATUAL', sortable: 'true', width: '275px'},
      {field: 'andamento_proposicao_relator_atual', header: 'RELATOR ATUAL', sortable: 'true', width: '250px'},
      {field: 'andamento_proposicao_texto', header: 'ANDAMENTO', sortable: 'true', width: '860px'},
    ];
  }

  onNovoRegistroAux(ev) {
    if (ev.campo === 'proposicao_situacao_id') {
      this.ddProposicao_situacao_id = ev.dropdown;
    }
    if (ev.campo === 'proposicao_orgao_id') {
      this.ddProposicao_orgao_id = ev.dropdown;
    }
    // this.formProp.get(ev.campo).patchValue(ev.valorId);
  }

  editar(rowData, rowIndex, expanded) {
    console.log('onRowEditInit', rowData);
    if (!expanded) {
      const a: AndamentoProposicaoI = rowData;
      this.andexp = a;
      this.form = {};
      this.form.andamento_proposicao_id = a.andamento_proposicao_id;
      this.form.andamento_proposicao_situacao_id = +a.andamento_proposicao_situacao_id;
      this.form.andamento_proposicao_relator_atual = a.andamento_proposicao_relator_atual;
      this.form.andamento_proposicao_texto = a.andamento_proposicao_texto;
      this.form.andamento_proposicao_orgao_id = a.andamento_proposicao_orgao_id;
      this.form.andamento_proposicao_data = a.andamento_proposicao_data;
      this.idx = +rowIndex;
      this.btnIdx = 'tgh' + rowIndex;
    }
    if (expanded) {
      this.andexp = null;
      this.idx = -1;
      this.btnIdx = '';
    }
  }

  gravar() {
    this.criaEnvio(this.form);
  }

  criaEnvio(a: AndamentoProposicaoI) {
    let erro = 0;
    let msg: string = '';
    let b: AndamentoProposicaoFormI = {};
    b.sn_orgao = this.sn_orgao;
    b.sn_relator_atual = this.sn_relator_atual;
    b.sn_situacao = this.sn_situacao;
    if (a.andamento_proposicao_data !== null && a.andamento_proposicao_data !== this.andexp.andamento_proposicao_data) {
      b.andamento_proposicao_data = DateTime.fromFormat(a.andamento_proposicao_data, "dd/MM/yyyy").toSQLDate();
    }
    if (a.andamento_proposicao_data === null) {
      erro++;
      msg = 'ERRO - Data é obrigatório.';
    }
    const txt = this.kill0.getText();
    b.andamento_proposicao_texto_texto = this.kill0.getText();
    if (b.andamento_proposicao_texto_texto === this.andexp.andamento_proposicao_texto_texto) {
      delete b.andamento_proposicao_texto;
      delete b.andamento_proposicao_texto_delta;
      delete b.andamento_proposicao_texto_texto;
    } else {
      b.andamento_proposicao_texto = a.andamento_proposicao_texto;
      b.andamento_proposicao_texto_delta = JSON.stringify(this.kill0.getContents());
    }
    if (b.sn_orgao && (+a.andamento_proposicao_orgao_id !== +this.andexp.andamento_proposicao_orgao_id)) {
      b.andamento_proposicao_orgao_id = +a.andamento_proposicao_orgao_id;
    } else {
      b.sn_orgao = false;
    }
    if (b.sn_relator_atual && (a.andamento_proposicao_relator_atual !== this.andexp.andamento_proposicao_relator_atual)) {
      b.andamento_proposicao_relator_atual = a.andamento_proposicao_relator_atual;
    } else {
      b.sn_relator_atual = false;
    }
    if (b.sn_situacao && (+a.andamento_proposicao_situacao_id !== +this.andexp.andamento_proposicao_situacao_id)) {
      b.andamento_proposicao_situacao_id = +a.andamento_proposicao_situacao_id;
    } else {
      b.sn_situacao = false;
    }
    console.log('criaEnvio2', b);

  }






  onBlockSubmit($event) {

  }

  trocaSituacao($event) {

  }

  onEditorCreated(ev) {
    this.kill0 = ev;
    this.kill0.update('user');
    this.andexp.andamento_proposicao_texto_texto = this.kill0.getText();
    console.log('this.andexp', this.andexp);
  }

  onChange0(ev) {
    if (!ev.checked) {
      this.form.andamento_proposicao_relator_atual = this.andexp.andamento_proposicao_relator_atual;
    }
  }

  onChange1(ev) {
    if (!ev.checked) {
      this.form.andamento_proposicao_orgao_id = this.andexp.andamento_proposicao_orgao_id;
    }
  }

  onChange2(ev) {
    if (!ev.checked) {
      this.form.andamento_proposicao_situacao_id = this.andexp.andamento_proposicao_situacao_id;
    }
  }





  fecharDialog(){

  }


  excluirProposicao(){

  }


  fechar(){

    // this.elemento.click();
  }

  onEditorCreated2($event) {

  }









  onDelete(rowData, rowIndex) {

  }

  fecharTgl() {
    document.getElementById(this.btnIdx).click();
  }

  onRowExpand(ev: any) {
    console.log('onRowExpand',ev);
  }

  onColReorder(ev: any) {

  }

  onRowCollapse(ev: any) {

  }

}
