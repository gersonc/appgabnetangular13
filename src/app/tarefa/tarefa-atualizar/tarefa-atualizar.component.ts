import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService, SelectItem, Message } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DropdownService, MostraMenuService } from '../../_services';
import { AuthenticationService, CarregadorService } from '../../_services';
import { take } from 'rxjs/operators';
import {TarefaService} from "../_services";
import {Subscription} from "rxjs";
import {SmsService} from "../../sms/_services/sms.service";
import {TarefaAtualizarForm, TarefaForm, TarefaListarInterface, TarefaUsuarioSituacaoInteface} from "../_models";


@Component({
  selector: 'app-tarefa-atualizar',
  templateUrl: './tarefa-atualizar.component.html',
  styleUrls: ['./tarefa-atualizar.component.css']
})
export class TarefaAtualizarComponent implements OnInit, OnDestroy {
  public formTarefa: FormGroup;
  public items: Array<any> = [];
  sub: Subscription[] = [];
  ptBr: any;
  public ddSituacao_id: SelectItem[] = [];

  botaoEnviarVF = false;
  mostraForm = true;
  acao: string = null;
  contador = 0;
  resp: any[];
  origem: string = null;
  atualisaDatatable = false;
  vfSms = false;
  smsRestante = 0;
  tarefa_usuario_autor_id_readonly = true;
  usuario_situacao: TarefaUsuarioSituacaoInteface[] = null;
  tarefa_usuario_autor_id: number = 0;
  permissaoArquivo: boolean;
  tf: TarefaListarInterface = null;


  arquivoDesativado = false;
  enviarArquivos = false;
  clearArquivos = false;
  arquivo_registro_id = 0;
  possuiArquivos = false;
  tarefa_id = 0;

  autor_sn = false;
  usuario_sn = false;
  aviso_sn = 0;
  tx: string = null;
  autorusuario = 2;
  ddAutorusuario: SelectItem[] = [
    {label: 'Autor', value: 1},
    {label: 'Demandado', value: 2}
  ];
  th_historico: string = null;
  tarefa_situacao_id = 0;
  tus_situacao_id = 0;
  tpBusca: string = null;
  mensagem_sms: string = null;


  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private formBuilder: FormBuilder,
    private dd: DropdownService,
    private mm: MostraMenuService,
    private messageService: MessageService,
    public authenticationService: AuthenticationService,
    private cs: CarregadorService,
    private ts: TarefaService,
    private ss: SmsService
  ) {
    this.permissaoArquivo = this.authenticationService.arquivos
  }

  ngOnInit(): void {
    this.carregaDados();
  }

  criaForm(): void {
    this.formTarefa = this.formBuilder.group({
      tarefa_id: [this.tf.tarefa_id],
      th_historico: [null, Validators.required ],
      autorusuario: [this.autorusuario],
      tarefa_situacao_id: [this.tarefa_situacao_id],
      tarefa_sms: [this.vfSms, false],
      mensagem_sms: [this.mensagem_sms]
    });
  }

  carregaDados(): void {
    if (this.ddSituacao_id.length === 0) {
      this.ddSituacao_id = JSON.parse(sessionStorage.getItem('dropdown-tarefa_situacao'));
    }

    this.tf = this.config.data.tarefa;
    console.log('this.config.data', this.config.data);
    this.tarefa_usuario_autor_id = this.authenticationService.usuario_id;
    this.tarefa_usuario_autor_id_readonly = (!(this.authenticationService.usuario_principal_sn || this.authenticationService.usuario_responsavel_sn));
    this.autor_sn = this.tf.tarefa_usuario_autor_id === this.tarefa_usuario_autor_id;
    this.tpBusca = this.config.data.tpBusca;

    const tmp: TarefaUsuarioSituacaoInteface = this.tf.usuario_situacao.find(i =>
      i.tus_usuario_id === this.authenticationService.usuario_id
    );
    if (tmp !== undefined) {
      this.usuario_sn = true;
      this.tus_situacao_id = tmp.tus_situacao_id;
      this.tarefa_situacao_id = tmp.tus_situacao_id;
    } else {
      this.tarefa_situacao_id = this.tf.tarefa_situacao_id;
    }
    this.autorusuario = 2;
    this.mensagem_sms = null;
    this.vfSms = false;
    this.aviso();
    this.criaForm();
  }

  atualizarTarefa() {
    if (this.formTarefa.valid) {
      this.arquivoDesativado = true;
      this.cs.mostraCarregador();
      this.ts.resetTarefaAtualizar();
      this.ts.taf = this.formTarefa.getRawValue();
      this.ts.taf.tipo_listagem = this.tpBusca;
      this.sub.push(this.ts.putTarefaAtualizar(this.ts.taf)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: (err) => {
            this.messageService.add({
              key: 'tarefaToast',
              severity: 'warn',
              summary: 'ERRO INCLUIR',
              detail: this.resp[2]
            });
            console.log(err);
          },
          complete: () => {
            if (this.resp[0]) {
              this.atualisaDatatable = true;
              /*
              if (this.possuiArquivos) {
                this.arquivo_registro_id = +this.resp[1];
                this.enviarArquivos = true;
              } else {
              */
                this.cs.escondeCarregador();
                this.messageService.add({
                  key: 'tarefaToast',
                  severity: 'success',
                  summary: 'ATUALIZAR TAREFA',
                  detail: this.resp[2]
                });
                this.ts.resetTarefaAtualizar();
                this.resetForm();
                this.voltarListar();
              // }
            } else {
              console.error('ERRO - ATUALIZAR ', this.resp[2]);
              this.messageService.add({
                key: 'tarefaToast',
                severity: 'warn',
                summary: 'ATENÇÃO - ERRO',
                detail: this.resp[2]
              });
            }
          }
        })
      );
    }
  }

  criaAtualizar(): TarefaAtualizarForm {
    let taf = new TarefaAtualizarForm();
    taf.tarefa_id = this.tf.tarefa_id;
    taf.autorusuario = this.formTarefa.get('autorusuario').value;
    taf.th_historico = this.formTarefa.get('th_historico').value;
    taf.tarefa_sms = this.formTarefa.get('tarefa_sms').value;
    taf.mensagem_sms = this.formTarefa.get('mensagem_sms').value;
    taf.tarefa_situacao_id = this.formTarefa.get('tarefa_situacao_id').value;
    console.log('criaAtualizar', taf);
    return taf;
  }


  resetForm() {
    this.formTarefa.reset();
    this.carregaDados();
    this.mostraForm = false;
  }

  voltarListar() {
    if (this.resp) {
      if (this.resp[0]) {
        this.ref.close(this.resp[3][0]);
      } else {
        this.ref.close();
      }
    } else {
      this.ref.close();
    }
  }

  smsVF(ev) {
    if (!sessionStorage.getItem('sms_restante')) {
      if (this.authenticationService.sms && this.authenticationService.sms_incluir) {
        this.sub.push(this.ss.getRestante()
          .pipe(take(1))
          .subscribe({
            next: (dados) => {
              this.smsRestante = +dados[0];
            },
            error: (err) => {
              console.log(err);
            },
            complete: () => {
              sessionStorage.setItem('sms_restante', this.smsRestante.toString());
              if (this.smsRestante > 0) {
                this.vfSms = ev.checked;
              } else {
                this.formTarefa.get('tarefa_sms').patchValue(false);
                this.vfSms = false;
              }
            }

          })
        )
      }
    } else {
      this.smsRestante = +sessionStorage.getItem('sms_restante');
      if (this.smsRestante > 0) {
        this.vfSms = ev.checked;
      } else {
        this.formTarefa.get('tarefa_sms').patchValue(false);
        this.vfSms = false;
      }
    }
  }

  aviso(): void {
    if (this.autor_sn && !this.usuario_sn) {
      this.autorusuario = 1;
      this.aviso_sn = 1;
      this.tx = 'Você é o AUTOR dessa tarefa. Mudar a situação como AUTOR modificará o status de toda tarefa.';
    }
    if (this.autor_sn && this.usuario_sn) {
      this.autorusuario = 2;
      this.aviso_sn = 2;
      this.tx = 'Você é o AUTOR e DEMANDADO dessa tarefa. Mudar a situação como AUTOR modificará o status de toda tarefa. Mudar como DEMANDADO modificará apenas a situação do DEMANDADO.';
    }
  }

  fcor(x: number) {
    let cor: string;
    switch(x)
    {
      case 1:
        cor = '#FF8C8C';
        break;
      case 2:
        cor = '#F3F198';
        break;
      case 3:
        cor = '#BBEABE';
        break;
      default:
        cor = '#BBEABE';
    }
    return cor;
  }

  mudaScopo(ev) {
    console.log('mudaScopo', ev);
    if (ev.valor === 0) {
      this.tarefa_situacao_id = this.tus_situacao_id;
    } else {
      this.tarefa_situacao_id = this.tf.tarefa_situacao_id;
    }
  }

  onPossuiArquivos(ev) {
    this.possuiArquivos = ev;
  }

  verificaValidTouched(campo: string) {
    return (
      !this.formTarefa.get(campo).valid &&
      (this.formTarefa.get(campo).touched || this.formTarefa.get(campo).dirty)
    );
  }

  verificaValidacoesForm(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(campo => {
      const controle = formGroup.get(campo);
      controle.markAsDirty();
      controle.markAsTouched();
      if (controle instanceof FormGroup) {
        this.verificaValidacoesForm(controle);
      }
    });
  }

  aplicaCssErro(campo: string) {
    return {
      'has-error': this.verificaValidTouched(campo),
      'has-feedback': this.verificaValidTouched(campo)
    };
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
