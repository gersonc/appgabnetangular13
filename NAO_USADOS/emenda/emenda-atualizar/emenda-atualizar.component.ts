import { Component, OnDestroy, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService, SelectItem } from 'primeng/api';
import {EmendaDetalheInterface, EmendaFormulario, EmendaListarInterface, HistoricoEmendaInterface} from '../_models';
import { EmendaService } from "../_services";
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthenticationService, CarregadorService } from "../../_services";
import {take} from "rxjs/operators";
import {Location} from "@angular/common";

@Component({
  selector: 'app-emenda-atualizar',
  templateUrl: './emenda-atualizar.component.html',
  styleUrls: ['./emenda-atualizar.component.css']
})
export class EmendaAtualizarComponent implements OnInit, OnDestroy {
  @ViewChild('atualizaEmenda', { static: true }) public atualizaEmenda: any;
  formEmendaAtualizar: FormGroup;
  ddEmenda_porcentagem: SelectItem[] = [];
  ddEmenda_situacao: SelectItem[] = [];
  ptBr: any;

  botaoEnviarVF = false;
  mostraForm = true;
  arquivoDesativado = false;
  enviarArquivos = false;
  clearArquivos = false;
  arquivo_registro_id = 0;
  possuiArquivos = false;
  emenda_id = 0;
  hj =  new Date();

  dados: EmendaDetalheInterface;
  // emenda: any[] = [];
  em: EmendaListarInterface = null;
  // historico_emenda: HistoricoEmendaInterface[] = null;
  // titulos: any[] = null;
  emenda_titulo: any[] = null;
  historico_emenda_titulo: any[] = null;
  sub: Subscription[] = [];

  resp: any[];

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private messageService: MessageService,
    private location: Location,
    private formBuilder: FormBuilder,
    private cs: CarregadorService,
    private es: EmendaService,
    public authenticationService: AuthenticationService,

  ) { }

  ngOnInit() {
    this.carregaDropdownSessionStorage();
    this.configuraCalendario();
    this.dados = this.config.data;
    this.em = this.dados.emenda;
    this.emenda_id = this.em.emenda_id;
    /// this.titulos = JSON.parse(sessionStorage.getItem('emenda-titulos'));
    // this.emenda_titulo = this.titulos['emenda_titulo'];
    // this.historico_emenda_titulo = this.titulos['historico_emenda_titulo'];
    this.criaForm();


    /*
    const s1: string[] = Object.keys(this.titulos['emenda_titulo']);
    const v1: any[] = Object.values(this.titulos['emenda_titulo']);
    let tit1: any[] = [];
    for (let i = 0; i < s1.length; i++) {
      if (v1[i]) {
        tit1[s1[i]] = v1[i].toString();
      }
    }

    const s: string[] = Object.keys(this.dados.emenda);
    const v: any[] = Object.values(this.dados.emenda);
    let eme1: any[] = [];
    for (let i = 0; i < s.length; i++) {
      if (v[i]) {
        eme1[s[i]] = v[i].toString();
      }
    }

    s1.forEach( k => {
      if (eme1[k] && k !== 'emenda_justificativa' && k !== 'historico_emenda' && k !== 'historico_emenda_num') {
        this.emenda.push([tit1[k], eme1[k]]);
      }
    });

    if (this.dados.emenda.historico_emenda) {
      this.historico_emenda = this.dados.emenda.historico_emenda;
    }
    */
  }

  carregaDropdownSessionStorage() {
    if (!sessionStorage.getItem('dropdown-emenda_situacao')) {
      const emendaSituacao: SelectItem[] = [
        {label: 'CONTEMPLADO', value: 'CONTEMPLADO'},
        {label: 'EM ABERTO', value: 'EM ABERTO'},
        {label: 'PRIORIDADE', value: 'PRIORIDADE'},
        {label: 'EMPENHADO', value: 'EMPENHADO'},
        {label: 'NÃO EMPENHADO', value: 'NÃO EMPENHADO'},
        {label: 'CONTINGENCIADO', value: 'CONTINGENCIADO'},
        {label: 'MINUTA DE EMPENHO', value: 'MINUTA DE EMPENHO'},
        {label: 'PAGO', value: 'PAGO'},
        {label: 'PAGO PARCIALMENTE', value: 'PAGO PARCIALMENTE'},
        {label: 'NÃO PAGO', value: 'NÃO PAGO'},
        {label: 'EMPENHO CANCELADO', value: 'EMPENHO CANCELADO'}
      ];
      sessionStorage.setItem('dropdown-emenda_situacao', JSON.stringify(emendaSituacao));
      this.ddEmenda_situacao = emendaSituacao;
    } else {
      this.ddEmenda_situacao = JSON.parse(sessionStorage.getItem('dropdown-emenda_situacao'));
    }
    for (let i = 0; i < 101; i++) {
      this.ddEmenda_porcentagem.push({label: i.toString(), value: i});
    }
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

  // ***     FORMULARIO      *************************
  criaForm() {
    this.formEmendaAtualizar = this.formBuilder.group({
      emenda_situacao: [this.em.emenda_situacao, Validators.required],
      emenda_porcentagem: [this.em.emenda_porcentagem],
      his_data: [this.hj],
      his_texto: [null],
      emenda_id: [this.em.emenda_id]
    })
  }

  verificaValidTouched(campo: string) {
    return (
      !this.formEmendaAtualizar.get(campo).valid &&
      (this.formEmendaAtualizar.get(campo).touched || this.formEmendaAtualizar.get(campo).dirty)
    );
  }

  aplicaCssErro(campo: string) {
    return {
      'has-error': this.verificaValidTouched(campo),
      'has-feedback': this.verificaValidTouched(campo)
    };
  }

  onBlockSubmit(ev: boolean) {
    this.mostraForm = ev;
  }

  onPossuiArquivos(ev) {
    this.possuiArquivos = ev;
  }


  onSubmit() {
    let envio = this.criaEnvio();
    if (envio) {
      this.botaoEnviarVF = false;
      this.mostraForm = true;
      this.arquivoDesativado = false;
      this.cs.mostraCarregador();
      this.sub.push(this.es.putEmendaAtualizar(this.emenda_id, this.criaEnvio())
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: (err) => {
            this.botaoEnviarVF = false;
            this.mostraForm = true;
            this.cs.escondeCarregador();
            this.messageService.add({
              key: 'emendaToast',
              severity: 'warn',
              summary: 'ERRO ALTERAR',
              detail: this.resp[2]
            });
            console.log(err);
          },
          complete: () => {
            if (this.resp[0]) {
              if (sessionStorage.getItem('emenda-dropdown-menu')) {
                sessionStorage.removeItem('emenda-dropdown-menu');
              }

              this.resetForm();
              this.cs.escondeCarregador();
              this.messageService.add({
                key: 'emendaToast',
                severity: 'success',
                  summary: 'ATUALIZAR EMENDA',
                detail: this.resp[2]
              });

              this.voltarListar();

            } else {
              this.botaoEnviarVF = false;
              this.mostraForm = true;
              this.cs.escondeCarregador();
              console.error('ERRO - ATUALIZAR ', this.resp[2]);
              this.messageService.add({
                key: 'emendaToast',
                severity: 'warn',
                summary: 'ATENÇÃO - ERRO',
                detail: this.resp[2]
              });
            }
          }
        })
      );
    } else {
      this.messageService.add({
        key: 'emendaToast',
        severity: 'warn',
        summary: 'ATENÇÃO - SEM ATUALIZAÇÃO',
        detail: 'Nenhum campo foi alterado.'
      });
    }
  }

  criaEnvio(): any[] {
    let emendaFormulario: any[];
    let ct = 0;
    emendaFormulario = this.formEmendaAtualizar.getRawValue();
    for (const chave in emendaFormulario) {
      if (this.formEmendaAtualizar.get(chave).dirty) {
        emendaFormulario[chave] = this.formEmendaAtualizar.get(chave).value;
        ct++;
      } else {
        delete emendaFormulario[chave];
      }
    }
    if (emendaFormulario['emenda_id']) {
      emendaFormulario['emenda_id'] = this.emenda_id;
    }
    if (ct === 0) {
      return null;
    } else {
      return emendaFormulario;
    }
  }

  fechar() {
    this.ref.close ();
  }

  resetForm() {
    this.formEmendaAtualizar.reset();
    this.mostraForm = false;
  }

  voltarListar() {
    if (this.resp) {
      if (this.resp[0]) {
        this.ref.close(this.resp[3]);
      } else {
        this.ref.close();
      }
    } else {
      this.ref.close();
    }
  }


  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
