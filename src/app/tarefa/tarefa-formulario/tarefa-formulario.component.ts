import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DropdownService, MostraMenuService } from '../../util/_services';
import { AuthenticationService, CarregadorService } from '../../_services';
import { take } from 'rxjs/operators';
import {TarefaService} from "../_services";
import {Subscription} from "rxjs";
import {SmsService} from "../../sms/_services/sms.service";
import {TarefaForm, TarefaUsuarioSituacaoInteface} from "../_models";

@Component({
  selector: 'app-tarefa-formulario',
  templateUrl: './tarefa-formulario.component.html',
  styleUrls: ['./tarefa-formulario.component.css']
})
export class TarefaFormularioComponent implements OnInit, OnDestroy {
  public formTarefa: FormGroup;
  public items: Array<any> = [];
  sub: Subscription[] = [];
  ptBr: any;
  public ddUsuario_id: SelectItem[];

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
  tpBusca: string = null;
  permissaoArquivo: boolean;


  arquivoDesativado = false;
  enviarArquivos = false;
  clearArquivos = false;
  arquivo_registro_id = 0;
  possuiArquivos = false;
  tarefa_id = 0;

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
    this.ts.criaNovaTarefa();
    this.carregaDados();
    this.configuraCalendario();
    this.criaForm();
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

  carregaDados() {
    if (!sessionStorage.getItem('dropdown-usuario_id')) {
      this.sub.push(this.dd.postDropdownNomeId({tabela: 'usuario', campo_id: 'usuario_id', campo_nome: 'usuario_nome'})
        .pipe(take(1))
        .subscribe((dados) => {
            this.ddUsuario_id = dados;
          },
          error1 => {
            console.log('erro');
          },
          () => {
            sessionStorage.setItem('dropdown-usuario_id', JSON.stringify(this.ddUsuario_id));
          })
      );
    } else {
      this.ddUsuario_id = JSON.parse(sessionStorage.getItem('dropdown-usuario_id'));
    }
    this.acao = this.config.data.acao;
    console.log('this.config.data', this.config.data);
    this.tpBusca = this.config.data.tpBusca;
    if (this.config.data.acao === 'alterar') {
      this.ts.carregaAlterar(this.config.data.tarefa);
      this.usuario_situacao = this.config.data.tarefa.usuario_situacao;
      this.origem = this.config.data.origem;
    } else {
      this.ts.tf.tarefa_usuario_autor_id = this.authenticationService.usuario_id;
      this.ts.tf.tarefa_id = 0;
    }
    this.tarefa_usuario_autor_id_readonly = (!(this.authenticationService.usuario_principal_sn || this.authenticationService.usuario_responsavel_sn));
  }

  criaForm() {
    if (this.acao == 'incluir') {
      this.formTarefa = this.formBuilder.group({
        tarefa_id: [this.ts.tf.tarefa_id],
        tarefa_usuario_autor_id: [this.ts.tf.tarefa_usuario_autor_id, Validators.required],
        tarefa_usuario_id: [this.ts.tf.tarefa_usuario_id, Validators.required],
        tarefa_data: [this.ts.tf.tarefa_data, Validators.required],
        tarefa_hora: [this.ts.tf.tarefa_hora],
        tarefa_titulo: [this.ts.tf.tarefa_titulo, Validators.required],
        tarefa_tarefa: [this.ts.tf.tarefa_tarefa],
        tarefa_email: [this.ts.tf.tarefa_email],
        tarefa_sms: [this.ts.tf.tarefa_sms, false],
        mensagem_sms: [this.ts.tf.mensagem_sms, false],
        agenda: [0],
        tipo_listagem: [this.tpBusca]
      });
    } else {
      this.formTarefa = this.formBuilder.group({
        tarefa_id: [this.ts.tf.tarefa_id],
        tarefa_usuario_autor_id: [this.ts.tf.tarefa_usuario_autor_id, Validators.required],
        // tarefa_usuario_id: [this.ts.tf.tarefa_usuario_id, Validators.required],
        tarefa_data: [this.ts.tf.tarefa_data, Validators.required],
        tarefa_hora: [this.ts.tf.tarefa_hora],
        tarefa_titulo: [this.ts.tf.tarefa_titulo, Validators.required],
        tarefa_tarefa: [this.ts.tf.tarefa_tarefa],
        tarefa_email: [this.ts.tf.tarefa_email]
        // tarefa_sms: [this.ts.tf.tarefa_sms, false],
        // mensagem_sms: [this.ts.tf.mensagem_sms, false],
        // agenda: [0]
      });
    }

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

  enviarTarefa() {
    if (this.formTarefa.valid) {
      this.arquivoDesativado = true;
      this.cs.mostraCarregador();
      this.ts.tf = this.formTarefa.getRawValue();
      this.sub.push(this.ts.postTarefaIncluir(this.ts.tf)
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
              if (this.resp[3]) {
                this.resp[3] = this.resp[3]['tarefa_listar'][0];
              }
              if (this.resp[4]) {
                sessionStorage.setItem('sms_restante', this.resp[4].toString())
              }
              if (this.possuiArquivos) {
                this.arquivo_registro_id = +this.resp[1];
                this.enviarArquivos = true;
              } else {
                this.cs.escondeCarregador();
                this.messageService.add({
                  key: 'tarefaToast',
                  severity: 'success',
                  summary: 'INCLUIR TAREFA',
                  detail: this.resp[2]
                });
                this.ts.resetTarefa();
                this.resetForm();
                this.voltarListar();
              }
            } else {
              console.error('ERRO - INCLUIR ', this.resp[2]);
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

  criaAlterar(): TarefaForm {
    let ta = new TarefaForm();
    ta.tarefa_id = this.ts.tf.tarefa_id;
    if(this.formTarefa.get('tarefa_usuario_autor_id').dirty || this.formTarefa.get('tarefa_usuario_autor_id').touched) {
      ta.tarefa_usuario_autor_id = this.formTarefa.get('tarefa_usuario_autor_id').value;
    } else {
      delete ta.tarefa_usuario_autor_id;
    }
    if(this.formTarefa.get('tarefa_data').dirty || this.formTarefa.get('tarefa_data').touched) {
      ta.tarefa_data = this.formTarefa.get('tarefa_data').value;
    } else {
      delete ta.tarefa_data;
    }
    if(this.formTarefa.get('tarefa_hora').dirty || this.formTarefa.get('tarefa_hora').touched) {
      ta.tarefa_hora = this.formTarefa.get('tarefa_hora').value;
    } else {
      delete ta.tarefa_hora;
    }
    if(this.formTarefa.get('tarefa_titulo').dirty || this.formTarefa.get('tarefa_titulo').touched) {
      ta.tarefa_titulo = this.formTarefa.get('tarefa_titulo').value;
    } else {
      delete ta.tarefa_titulo;
    }
    if(this.formTarefa.get('tarefa_tarefa').dirty || this.formTarefa.get('tarefa_tarefa').touched) {
      ta.tarefa_tarefa = this.formTarefa.get('tarefa_tarefa').value;
    } else {
      delete ta.tarefa_tarefa;
    }
    if(this.formTarefa.get('tarefa_email').dirty || this.formTarefa.get('tarefa_email').touched) {
      ta.tarefa_email = this.formTarefa.get('tarefa_email').value;
    } else {
      delete ta.tarefa_email;
    }
    ta.tipo_listagem = this.tpBusca;
    delete ta.tarefa_sms;
    delete ta.tarefa_usuario_id;
    delete ta.mensagem_sms;
    delete ta.agenda;
    return ta;
  }

  enviarTarefaAlterar() {
    if (this.formTarefa.valid) {
      this.arquivoDesativado = true;
      this.cs.mostraCarregador();
      this.ts.tf = this.formTarefa.getRawValue();
      this.sub.push(this.ts.putTarefaAlterar(this.criaAlterar())
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
              if (this.possuiArquivos) {
                this.arquivo_registro_id = +this.resp[1];
                this.enviarArquivos = true;
              } else {
                this.cs.escondeCarregador();
                this.messageService.add({
                  key: 'tarefaToast',
                  severity: 'success',
                  summary: 'ALTERAR TAREFA',
                  detail: this.resp[2]
                });
                this.ts.resetTarefa();
                this.resetForm();
                this.voltarListar();
              }
            } else {
              console.error('ERRO - ALTERAR ', this.resp[2]);
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

  resetForm() {
    this.formTarefa.reset();
    this.carregaDados();
    this.mostraForm = false;
  }

  voltarListar() {
    if (this.acao === 'alterar') {
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
    if (this.acao === 'incluir') {
      this.ref.close(this.atualisaDatatable);
    }
  }

  onUpload(ev) {
    console.log('onUpload', ev);
    if (ev) {
      this.mostraForm = false;
      this.cs.escondeCarregador();
      this.messageService.add({
        key: 'tarefaToast',
        severity: 'success',
        summary: 'TAREFA',
        detail: this.resp[2]
      });
      this.ts.resetTarefa();
      this.resetForm();
      this.botaoEnviarVF = false;
      this.mostraForm = true;
      this.voltarListar();
    }
  }

  onBlockSubmit(ev: boolean) {
    this.mostraForm = !ev;
  }

  onPossuiArquivos(ev) {
    this.possuiArquivos = ev;
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

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
