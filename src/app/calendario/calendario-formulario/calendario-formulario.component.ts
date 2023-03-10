import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { NgForm, FormGroup} from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UrlService, UuidService } from '../../_services';
import { AuthenticationService } from '../../_services';
import { Frequency, RRule, RRuleSet, Weekday } from 'rrule';
import { DateTime } from 'luxon';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import {EventoInterface} from "../_models/evento-interface";
import {CalendarioService} from "../_services/calendario.service";
import {Cal, CalDados, CalData, CalExtrutura, CalInterface, Evento, Opcoes} from "../_models/calendario";
import {MsgService} from "../../_services/msg.service";



@Component({
  selector: 'app-calendario-formulario',
  templateUrl: './calendario-formulario.component.html',
  styleUrls: ['./calendario-formulario.component.css']
})
export class CalendarioFormularioComponent implements OnInit, OnDestroy {
  @ViewChild('calForm', { static: true }) public calForm: NgForm;

  public ptBr: any;

  // FORMULARIO
  id: string = null;
  allDay: boolean;
  recorrenciaFim: boolean;
  frequencia: Frequency = null;
  // SEMANAL
  semanaDiasLiteral: number[] | null;
  // MESSAL 1
  mesDias: number[] | null;
  // MESSAL 2
  mesPosicao: number;
  mesDiasLiteral: number[] | null;
  // ANUAL 1
  anoDiaMes: number;
  anoMes: number;
  // ANUAL 2
  anoPosicao: number;
  anoDiasLiteral: number[] | null;
  anoMeses: number | number[] | null;
  // FINAL
  fimNumOcorrencias: number;
  fimAte: Date;
  fim: Date;

  trocaCor = 0;

  // COMPONENTE VARIAVEIS
  botaoEnviarVF = false;
  mostraForm = true;
  erro: any[] = [];
  formErro: any[] = [];

  // FORMULARIO VARIAVEIS
  recorrente = false;
  vfAno: boolean = null;
  vfMes: boolean = null;
  rdMensal: string = null;
  rdAnual: number = null;
  rdCountUntil = <'count'|'until'> null;
  vfApaga: boolean = null;
  urlUpload: string;

  // PARENTE VARIAVEIS
  acao: string = null;
  contador = 0;
  resp: any[];
  origem: string = null;

  // DROPDOWNS
  ddmonths: SelectItem[];
  ddias: SelectItem[];
  ddday: SelectItem[];
  ddday1: SelectItem[];
  ddday2: SelectItem[];
  ddmonthday: SelectItem[];
  ddnth: SelectItem[];
  ddymonthbt: SelectItem[];
  ddymonthbt1: SelectItem[];
  ddymonthbt2: SelectItem[];
  ddFrequencia: SelectItem[];
  ddtypes: SelectItem[];
  ddprioridade: SelectItem[];
  ddlocal: SelectItem[];
  ddcalendario_status: SelectItem[];
  ddusuario: SelectItem[];
  ddApaga: SelectItem[];


  // FULLCALENDAR
  start: Date;
  end: Date | null;
  title: string = null;
  description = null;
  observacao = null;
  duration: string = null;
  rrule = null;
  exdate: Date[] = null;
  local_id: SelectItem = null;
  groupId: string;

  type_id: number = null;
  prioridade_id: number = null;
  calendario_status_id: number = null;
  usuario_id: number[] = null;
  todos_usuarios_sn = true;
  textColor: string = null;
  bgc = '#007ad9';
  backgroundColor = '#007ad9';
  url: string = null;
  eventoRetorno: EventoInterface[] = [];

  evento: Evento;
  num = 0;
  cal: CalInterface;
  sub: Subscription[] = [];



  importarSN = true;

  uploadedFiles: any[] = [];

  icals: string[];

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public authenticationService: AuthenticationService,
    private messageService: MsgService,
    public cl: CalendarioService,
    private urlService: UrlService,
  ) {
    this.urlUpload = this.urlService.calendario + '/upload';
  }

  ngOnInit() {
    this.carregaDados();
    this.carregaDropdowns();
    this.carregaDropdownSessionStorage();
    this.cl.criaCalendarioForm();
    this.configuraCalendario();
  }

  resetOpcoes() {
    // FORMULARIO
    this.id = null;
    this.groupId = null;
    this.start = new Date();
    this.end = null;
    this.allDay = true;
    this.recorrente = false;
    this.frequencia = null;
    // SEMANAL
    this.semanaDiasLiteral = null;
    // MESSAL 1
    this.mesDias = null;
    // MESSAL 2
    this.mesPosicao = null;
    this.mesDiasLiteral = null;
    // ANUAL 1
    this.anoDiaMes = null;
    this.anoMes = null;
    // ANUAL 2
    this.anoPosicao = null;
    this.anoDiasLiteral = null;
    this.anoMeses = null;
    // FINAL
    this.fimNumOcorrencias = null;
    this.fimAte = null;
    this.recorrente = false;
    this.title = null;
    this.description = null;
    this.observacao = null;
    this.local_id = null;
    this.type_id = null;
    this.prioridade_id = null;
    this.calendario_status_id = null;
    this.usuario_id = null;
    this.todos_usuarios_sn = true;
    this.textColor = null;
    this.bgc = '#007ad9';
    this.backgroundColor = '#007ad9';
    this.url = null;
  }

  carregaFormulario() {
    if (this.acao === 'alterar' || this.acao === 'apagar') {
      this.start = new Date();
      this.end = null;
      this.allDay = true;
      this.recorrente = false;
      this.frequencia = null;
      // SEMANAL
      this.semanaDiasLiteral = null;
      // MESSAL 1
      this.mesDias = null;
      // MESSAL 2
      this.mesPosicao = null;
      this.mesDiasLiteral = null;
      // ANUAL 1
      this.anoDiaMes = null;
      this.anoMes = null;
      // ANUAL 2
      this.anoPosicao = null;
      this.anoDiasLiteral = null;
      this.anoMeses = null;
      // FINAL
      this.fimNumOcorrencias = null;
      this.fimAte = null;
      this.recorrente = false;


      // FORMULARIO
      this.id = this.evento.id;
      if (this.evento.groupId) {
        this.groupId = this.evento.groupId;
      } else {
        this.groupId = UuidService.getUuid();
      }
      this.start = new Date(this.evento.start);
      if (this.evento.allDay) {
        this.allDay = true;
        this.end = null;
      } else {
        this.allDay = false;
        if (this.evento.end) {
          this.end = new Date(this.evento.end);
        } else {
          this.end = null;
        }
      }
      if (this.evento.recorrente) {
        this.recorrente = true;
        if (this.evento.rrule) {
          let rr1: string = null;
          let rr3: any[] = [];
          const rr0 = this.evento.rrule.toString().indexOf('RRULE:') + 6;
          const rr00 = this.evento.rrule.toString().indexOf('EXDATE:');
          if (rr00 === -1) {
            rr1 = this.evento.rrule.toString().substring(rr0);
          } else {
            rr1 = this.evento.rrule.toString().substring(rr0, (rr0 - rr00));
            rr3 = this.evento.rrule.toString().substring(rr00).split(',');
          }
          const rr = rr1.split(';');
          const rr2: any[] = [];
          rr.forEach( (e: string) => {
            const r: string[] = e.split('=');
            let r1: any | any[] = null;
            if (r[1].indexOf(',') >= 0) {
              r1 = r[1].split(',');
            } else {
              r1 = r[1];
            }
            rr2[r[0]] = r1;
          });

          if (rr3.length > 0) {
            rr3.forEach( (e: string) => {
              const a = e.replace('T', '').replace('Z', '');
              const b = DateTime.fromFormat(a, 'yyyyLLddHHmmss').toJSDate();
              this.exdate.push(b);
            });
          }

          switch (rr2['FREQ']) {
            case 'DAILY': {
              this.frequencia = Frequency.DAILY;
              break;
            }
            case 'WEEKLY': {
              this.frequencia = Frequency.WEEKLY;
              break;
            }
            case 'MONTHLY': {
              this.frequencia = Frequency.MONTHLY;
              break;
            }
            case 'YEARLY': {
              this.frequencia = Frequency.YEARLY;
              break;
            }
          }

          if (this.frequencia === Frequency.WEEKLY) {
            this.semanaDiasLiteral = [];
            if (Array.isArray(rr2['BYDAY'])) {
              rr2['BYDAY'].forEach((e: string) => {
                this.semanaDiasLiteral.push(this.getWeekDay(e));
              });
            } else {
              this.semanaDiasLiteral.push(this.getWeekDay(rr2['BYDAY']));
            }
          } else {
            this.semanaDiasLiteral = null;
          }

          if (this.frequencia === Frequency.MONTHLY) {
            // bymonthday
            if (rr2['BYMONTHDAY']) {
              this.mesDias = [];
              this.vfMes = true;
              this.rdMensal = 'mesDia';
              if (Array.isArray(rr2['BYMONTHDAY'])) {
                rr2['BYMONTHDAY'].forEach((e: number) => {
                  this.mesDias.push(e);
                });
              } else {
                this.mesDias.push(+rr2['BYMONTHDAY']);
              }
              this.mesPosicao = null;
              this.mesDiasLiteral = null;
            } else {
              this.mesDias = null;
              this.vfMes = false;
              this.rdMensal = 'mesPosicao';
              this.mesPosicao = rr2['BYSETPOS'];
              this.mesDiasLiteral = [];
              if (Array.isArray(rr2['BYDAY'])) {
                rr2['BYDAY'].forEach((e: string) => {
                  this.mesDiasLiteral.push(this.getWeekDay(e));
                });
              } else {
                this.mesDiasLiteral.push(this.getWeekDay(rr2['BYDAY']));
              }
            }
          } else {
            this.mesDiasLiteral = null;
          }

          if (this.frequencia === Frequency.YEARLY) {
            if (rr2['BYSETPOS']) {
              this.rdAnual = 2;
              this.vfAno = false;
              this.anoPosicao = rr2['BYSETPOS'];
              this.anoDiasLiteral = [];
              this.anoDiasLiteral.push(this.getWeekDay(rr2['BYDAY']));
              this.anoMeses = rr2['BYMONTHDAY'];
              this.anoDiaMes = null;
              this.anoMes = null;
            } else {
              this.rdAnual = 1;
              this.vfAno = true;
              this.anoPosicao = null;
              this.anoDiasLiteral = null;
              this.anoMeses = null;
              this.anoDiaMes = +rr2['BYMONTHDAY'];
              this.anoMes = +rr2['BYMONTH'];
            }
          } else {
            this.anoDiasLiteral = null;
          }

          if (rr2['COUNT']) {
            this.rdCountUntil = 'count';
            this.fimNumOcorrencias = +rr2['COUNT'];
            this.recorrenciaFim = true;
          } else {
            this.rdCountUntil = 'until';
            this.fimNumOcorrencias = null;
            this.fimAte = new Date(this.evento.fim);
            this.recorrenciaFim = false;
          }

        }
      } else {
        this.recorrente = false;
      }
      this.title = this.evento.title;
      if (this.evento.description) {
        this.description = this.evento.description;
      } else {
        this.description = null;
      }

      if (this.evento.observacao) {
        this.observacao = this.evento.observacao;
      } else {
        this.observacao = null;
      }

      if (this.evento.url) {
        this.url = this.evento.url;
      } else {
        this.url = null;
      }

      if (this.evento.textColor) {
        this.textColor = this.evento.textColor;
      } else {
        this.textColor = null;
      }

      if (this.evento.backgroundColor) {
        this.backgroundColor = this.evento.backgroundColor;
      } else {
        this.backgroundColor = null;
      }

      if (this.evento.local_id) {
        this.local_id = this.evento.local_id;
      } else {
        this.local_id = null;
      }

      if (this.evento.prioridade_id) {
        this.prioridade_id = this.evento.prioridade_id;
      } else {
        this.prioridade_id = null;
      }

      if (this.evento.calendario_status_id) {
        this.calendario_status_id = this.evento.calendario_status_id;
      } else {
        this.calendario_status_id = null;
      }

      if (this.evento.type_id) {
        this.type_id = this.evento.type_id;
      } else {
        this.type_id = null;
      }

      this.todos_usuarios_sn = (this.evento.todos_usuarios_sn === 1) ;

      if (this.evento.usuario_id) {
        this.usuario_id = this.evento.usuario_id;
      } else {
        this.usuario_id = null;
      }

    }

  }

  carregaDropdowns() {
    this.ddFrequencia = [
      {label: 'Di??rio', value: Frequency.DAILY, title: 'dia(s)'},
      {label: 'Semanal', value: Frequency.WEEKLY, title: 'semana(s)'},
      {label: 'Mensal', value: Frequency.MONTHLY, title: 'm??s(es)'},
      {label: 'Anual', value: Frequency.YEARLY, title: 'ano(s)'},
    ];
    this.ddmonths = [
      {label: 'janeiro', value: 1},
      {label: 'fevereiro', value: 2},
      {label: 'mar??o', value: 3},
      {label: 'abril', value: 4},
      {label: 'maio', value: 5},
      {label: 'junho', value: 6},
      {label: 'julho', value: 7},
      {label: 'agosto', value: 8},
      {label: 'septembro', value: 9},
      {label: 'outubro', value: 12},
      {label: 'novembro', value: 11},
      {label: 'dezembro', value: 12},
    ];
    this.ddnth = [
      {value: 1, label: '1??'},
      {value: 2, label: '2??'},
      {value: 3, label: '3??'},
      {value: 4, label: '4??'},
      {value: -1, label: '??ltimo'},
    ];
    this.ddday = [
      {value: 0, label: 'domingo'},
      {value: 1, label: 'segunda'},
      {value: 2, label: 'ter??a'},
      {value: 3, label: 'quarta'},
      {value: 4, label: 'quinta'},
      {value: 5, label: 'sexta'},
      {value: 6, label: 's??bado'},
    ];
    this.ddday1 = [
      {value: 0, label: 'domingo'},
      {value: 1, label: 'segunda'},
      {value: 2, label: 'ter??a'},
      {value: 3, label: 'quarta'}
    ];
    this.ddday2 = [
      {value: 4, label: 'quinta'},
      {value: 5, label: 'sexta'},
      {value: 6, label: 's??bado'},
    ];
    this.ddias = [
      {value: [6], label: 'domingo'},
      {value: [+0], label: 'segunda'},
      {value: [1], label: 'ter??a'},
      {value: [2], label: 'quarta'},
      {value: [3], label: 'quinta'},
      {value: [4], label: 'sexta'},
      {value: [5], label: 's??bado'},
      /*
      {value: [+0, 1, 2, 3, 4], label: 'dia util'},
      {value: [+0, 1, 2, 3, 4, 5, 6], label: 'semana'},
      {value: [5, 6], label: 'fim de semana'},
      */
    ];
    this.ddmonthday = [];
    for (let i = 1; i < 32; i++) {
      this.ddmonthday.push(
        {value: i, label: i.toString()}
      );
    }
    this.ddymonthbt = [
      {label: 'jan', value: 1},
      {label: 'fev', value: 2},
      {label: 'mar', value: 3},
      {label: 'abr', value: 4},
      {label: 'mai', value: 5},
      {label: 'jun', value: 6},
      {label: 'jul', value: 7},
      {label: 'ago', value: 8},
      {label: 'set', value: 9},
      {label: 'out', value: 10},
      {label: 'nov', value: 11},
      {label: 'dez', value: 12},
    ];
    this.ddymonthbt1 = [
      {label: 'jan', value: 1},
      {label: 'fev', value: 2},
      {label: 'mar', value: 3},
      {label: 'abr', value: 4},
      {label: 'mai', value: 5},
      {label: 'jun', value: 6}
    ];
    this.ddymonthbt2 = [
      {label: 'jul', value: 7},
      {label: 'ago', value: 8},
      {label: 'set', value: 9},
      {label: 'out', value: 10},
      {label: 'nov', value: 11},
      {label: 'dez', value: 12}
    ];

  }

  carregaDropdownSessionStorage() {
    this.ddtypes = JSON.parse(sessionStorage.getItem('dropdown-types'));
    this.ddprioridade = JSON.parse(sessionStorage.getItem('dropdown-prioridade'));
    this.ddlocal = JSON.parse(sessionStorage.getItem('dropdown-local'));
    this.ddusuario = JSON.parse(sessionStorage.getItem('dropdown-usuario'));
    this.ddcalendario_status = JSON.parse(sessionStorage.getItem('dropdown-calendario_status'));
  }

  carregaDados() {
    this.resetOpcoes();
    this.acao = this.config.data.acao;
    if (this.config.data.acao === 'alterar' || this.config.data.acao === 'apagar') {
      this.evento = new Evento();
      this.evento = this.config.data.evento;
      if (this.config.data.acao === 'apagar') {
        this.num = this.config.data.num;
      }
      this.carregaFormulario();
    } else {
      this.cl.criaCalendarioForm();
      this.cl.cf.id = '0';
      this.groupId = UuidService.getUuid();
    }
  }

  configuraCalendario() {
    this.ptBr = {
      firstDayOfWeek: 1,
      dayNames: ['domingo', 'segunda', 'ter??a', 'quarta', 'quinta', 'sexta', 's??bado'],
      dayNamesShort: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 's??b'],
      dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
      monthNames: ['janeiro', 'fevereiro', 'mar??o', 'abril', 'maio', 'junho', 'julho', 'agosto', 'septembro',
        'outubro', 'novembro', 'dezembro'],
      monthNamesShort: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
      today: 'Hoje',
      clear: 'Limpar',
      dateFormat: 'dd/mm/yy'
    };
  }

  verificaValidTouched(campo: any) {
    return  !campo.valid && (campo.touched || campo.dirty);
  }

  validacao(campo: string) {
    return this.formErro.indexOf(campo) >= 0;
  }

  verificaValidacoesForm(controls: FormGroup) {
    Object.keys(controls.controls).forEach( campo => {
      const controle: any = controls.controls[campo];
      controle.markAsDirty();
      controle.markAsTouched();
      if (controle instanceof FormGroup) {
        this.verificaValidacoesForm(controle);
      }
    });
  }

  aplicaCssErro(campo: any): any {
    return {
      'ng-invalid': this.verificaValidTouched(campo),
      'ng-dirty': this.verificaValidTouched(campo)
    };
  }

  resetForm() {
    this.carregaDados();
    this.resp = [];
    this.calForm.resetForm();
    this.botaoEnviarVF = false;
    this.mostraForm = true;
  }

  incluirCalendario() {
    const dados: any[] = [];
    if (this.criarData()) {
      this.sub.push(this.cl.incluirCalendario(this.cal)
        .pipe(take(1))
        .subscribe({
          next: value => {
            this.resp = value;
          },
          error: err => {
            this.messageService.add({key: 'toastprincipal', severity: 'warn', summary: 'ERRO INCLUIR', detail: this.resp[2]});
            this.botaoEnviarVF = false;
            this.mostraForm = true;
            console.error(err);
          },
          complete: () => {
            this.messageService.add({
              key: 'toastprincipal',
              severity: 'success',
              summary: 'INCLUIR EVENTO',
              detail: this.resp[2]
            });
            if (this.resp[3]) {
              this.eventoRetorno.push(this.resp[3]);
            }
            this.resetForm();
          }
        })
      );
    }
  }

  alterarCalendario() {
    const dados: any[] = [];
    if (this.criarData()) {
      this.sub.push(this.cl.alterarCalendario(this.cal, this.id)
        .pipe(take(1))
        .subscribe({
          next: value => {
            this.resp = value;
          },
          error: err => {
            this.messageService.add({key: 'toastprincipal', severity: 'warn', summary: 'ERRO ALTERAR', detail: this.resp[2]});
            this.botaoEnviarVF = false;
            this.mostraForm = true;
            console.error(err);
          },
          complete: () => {
            this.messageService.add({
              key: 'toastprincipal',
              severity: 'success',
              summary: 'ALTERAR EVENTO',
              detail: this.resp[2]
            });
            if (this.resp[3]) {
              this.eventoRetorno.push(this.resp[3]);
            }
            this.voltarListar();
          }
        })
      );
    }
  }

  importarCalendario() {
   // const reader = new TxtReader();
  }

  voltarListar() {
    if (this.acao === 'alterar') {
      if (this.resp) {
        if (this.resp.length === 4) {
          if (typeof this.resp[3] === 'object') {
            this.ref.close(this.resp[3]);
          }
        } else {
          this.ref.close();
        }
      } else {
        this.ref.close();
      }
    }
    if (this.acao === 'incluir') {
      if (this.eventoRetorno.length > 0) {
        this.ref.close(this.eventoRetorno);
      } else {
        this.ref.close();
      }
    }
  }

  // EVENTOS

  mudaAte(ev) {
    this.end = this.start;
    this.end.setHours(this.start.getHours() + 1);
  }

  recorrenteOnChange(ev) {
    if (this.recorrente) {
      if (this.acao === 'incluir') {
        this.frequencia = Frequency.DAILY;
        this.fimAte = null;
        this.fimNumOcorrencias = 1;
        this.semanaDiasLiteral = null;
        this.mesDias = null;
        this.mesPosicao = null;
        this.anoDiaMes = null;
        this.anoMes = null;
        this.anoPosicao = null;
        this.anoDiasLiteral = null;
        this.anoMeses = null;
        this.recorrenciaFim = true;
        this.rdCountUntil = 'count';
      }
    }
 }

  todosUsuariosOnChange(ev) {
    if (this.todos_usuarios_sn) {
      if (this.acao === 'incluir') {
        this.usuario_id = null;
      }
    }
  }

  onUsuarioIdChange(ev) {
    if (ev.value.length === this.ddusuario.length) {
      this.todos_usuarios_sn = true;
      this.usuario_id = null;
    }
  }

  vfAllDay(ev) {
    if (!ev.checked) {
      if (!this.end) {
        this.end = this.start;
        this.end = new Date(this.start.getTime());
        this.end.setHours(this.end.getHours() + 1);
      }
    }
  }

  frequenciaChange(ev) {

    // SEMANAL
    this.semanaDiasLiteral = null;
    // MENSAL 1
    this.mesDias = null;
    // MENSAL 2
    this.mesPosicao = null;
    this.mesDiasLiteral = null;
    // ANUAL 1
    this.anoDiaMes = null;
    this.anoMes = null;
    // ANUAL 2
    this.anoPosicao = null;
    this.anoDiasLiteral = null;
    this.anoMeses = null;
    // SELETORES
    this.rdMensal = null;
    this.vfMes = null;
    this.rdAnual = null;
    this.vfAno = null;

    // SEMANAL
    if (this.frequencia === 2) {
      this.semanaDiasLiteral = [];
      this.semanaDiasLiteral.push(this.ddday[this.start.getDay()].value);
    }
    // MENSAL
    if (this.frequencia === 1) {
      this.rdMensal = 'mesDia';
      this.vfMes = true;
      this.mesDias = [];
      this.mesDias.push(this.start.getDate());
    }
    // ANUAL
    if (this.frequencia === 0) {
      this.rdAnual = 1;
      this.vfAno = true;
      this.anoDiaMes = this.start.getDate();
      this.anoMes = this.start.getMonth() + 1;
      this.anoPosicao = null;
      this.anoDiasLiteral = null;
      this.anoMeses = null;
    }
  }

  semanaDiasLiteralChange(ev) {
    if (this.rdCountUntil === 'count') {
      this.fimNumOcorrencias = ev.value.length;
    }
  }

  mesDiasChange(ev) {
    if (this.rdCountUntil === 'count') {
      this.fimNumOcorrencias = ev.value.length;
    }
  }

  rdMensalClick(ev) {
    if (this.rdMensal === 'mesDia') {
      this.mesDias = [];
      this.mesDias.push(this.start.getDate());
      this.vfMes = true;
      this.mesPosicao = null;
      this.mesDiasLiteral = null;
    } else {
      this.mesDias = null;
      this.mesPosicao = 1;
      this.mesDiasLiteral = null;
      this.mesDiasLiteral = this.ddias[+this.start.getDay()].value;
      this.vfMes = false;
    }
  }

  rdAnualClick(ev) {
    switch (+this.rdAnual) {
      case 1: {
        this.anoDiaMes = this.start.getDate();
        this.anoMes = this.start.getMonth() + 1;
        this.anoPosicao = null;
        this.anoDiasLiteral = null;
        this.anoMeses = null;
        this.vfAno = true;
        break;
      }
      case 2: {
        this.anoDiaMes = null;
        this.anoMes = null;
        this.anoPosicao = 1;
        this.anoDiasLiteral = this.ddias[this.start.getDay()].value;
        this.anoMeses = [];
        this.anoMeses.push(this.start.getMonth() + 1);
        this.vfAno = false;
        break;
      }
    }
  }

  rdCountClick(ev) {
    this.fimNumOcorrencias = 1;
    this.fimAte = null;
    this.rdCountUntil = 'count';
    this.recorrenciaFim = true;
  }

  rdUntilClick(ev) {
    this.fimNumOcorrencias = null;
    if (!this.end) {
      this.fimAte = this.start;
    } else {
      this.fimAte = this.end;
    }
    this.rdCountUntil = 'until';
    this.recorrenciaFim = false;
  }

  onTrocaProridade(ev) {
    let v = 0;
    if (ev.value >= 1) {
      v = 1;
    } else {
      this.prioridade_id = null;
    }
    this.onTrocaCor(v);
  }

  onTrocaStatus(ev) {
    let v = 0;
    if (ev.value >= 1) {
      v = 2;
    } else {
      this.calendario_status_id = null;
    }
    this.onTrocaCor(v);
  }

  onTrocaCategoria(ev) {
    let v = 0;
    if (ev.value >= 1) {
      v = 3;
    }
    this.onTrocaCor(v);
  }

  onTrocaColor() {
    this.onTrocaCor(4);
  }

  onTrocaColor2(ev) {
    this.backgroundColor = this.bgc;
    this.onTrocaCor(0);
  }

  onTrocaCor(n: number): void {
    if (n >= 0) {
      this.trocaCor = n;
    }
  }

  // CALCULOS

  calculaDuracao(): string {
    const dt1: DateTime = DateTime.fromJSDate(this.start);
    const dt2: DateTime = DateTime.fromJSDate(this.end);
    const re = +dt2.diff(dt1, ['hours', 'minutes']).toFormat('hh');
    if (re > 24) {
      return  null;
    }
    return dt2.diff(dt1, ['hours', 'minutes']).toFormat('hh:mm');
  }

  dataToSql(dt: Date): string {
    const dr: DateTime = DateTime.fromJSDate(dt);
    return dr.toSQL({ includeOffset: false });
  }

  getUtc(d: Date = null) {
    d = d ? d : new Date();
    const utc = Date.UTC(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      d.getHours(),
      d.getMinutes(),
      d.getSeconds()
    );
    return utc;
  }

  // DADOS

  criarData(): boolean {
    if (this.allDay) {
      this.start.setHours(0, 0, 0);
      this.end = new Date(this.start.getTime());
      this.end.setHours(this.end.getHours() + 1);
      this.fim = this.end;
    } else {
      this.fim = this.end;
    }
    if (!this.recorrente) {
      this.fim = this.end;
    } else {
      let op = new Opcoes();
      op.freq = this.frequencia;
      op.dtstart = new Date(this.getUtc(this.start));
      // SEMANAL
      if (this.frequencia === 2) {
        const wddd: Weekday[] = [];
        this.semanaDiasLiteral.forEach( e => {
          const w = new Weekday(e);
          wddd.push(w);
        });
        op.byweekday = wddd;
      }
      // MENSAL
      if (this.frequencia === 1) {
        if (this.mesDias && this.vfMes) {
          op.bymonthday = this.mesDias;
        }
        if (this.mesDiasLiteral && !this.vfMes) {

          const wdd: Weekday[] = [];
          this.mesDiasLiteral.forEach( e => {
            // const w = new Weekday(e);
            const w = new Weekday(e);
            wdd.push(w);
          });
          op.bysetpos = this.mesPosicao;
          op.byweekday = wdd;
        }
      }
      // ANUAL
      if (this.frequencia === 0) {
        if (this.vfAno) {
          if (this.anoDiaMes) {
            op.bymonthday = this.anoDiaMes;
          }
          if (this.anoMes) {
            op.bymonth = this.anoMes;
          }
        } else {
          if (this.anoMeses) {
            op.bymonth = this.anoMeses;
          }
          const wd: Weekday[] = [];
          this.anoDiasLiteral.forEach( e => {
            const w = new Weekday(e);
            wd.push(w);
          });
          op.bysetpos = this.anoPosicao;
          op.byweekday = wd;
        }
      }
      // FIM
      if (this.recorrenciaFim) {
        op.count = this.fimNumOcorrencias;
      } else {
        op.until = new Date(this.getUtc(this.fimAte));
      }
      let rr = new RRule(op);
      let tmp = rr.all();
      if (tmp.length > 0) {

        if (this.exdate) {
          const rrr = new RRuleSet();
          rrr.rrule(rr);
          this.exdate.forEach( (e: Date) => {
            rrr.exdate(e);
          });
          this.rrule = rrr.toString();
        } else {
          this.rrule = rr.toString();
        }
        this.fim = tmp.pop();
        tmp = null;
      } else {
        this.fim = this.end;

        this.messageService.add({
          key: 'toastprincipal',
          severity: 'warn',
          summary: 'ERRO !!!',
          detail: 'Essa combina????o n??o retorna nenhuma data v??lida.'
        });
        op = null;
        rr = null;
        return false;
      }
    }
    return true;
  }

  // VALIDACAO

  onSubmit() {
    this.botaoEnviarVF = true;
    this.mostraForm = false;
    let ct: any;
    // console.log('calForm', this.calForm);
    this.formErro = [];
    const dt = DateTime.fromJSDate(this.start);
    if (!dt.isValid) {
      ct = {campo: 'start', msg: 'Data/Hora inv??lida.'};
      this.formErro.push(ct);
    }
    if (this.title === null || this.title.length < 1) {
      ct = {campo: 'title', msg: 'O T??tulo ?? obrigat??rio.'};
      this.formErro.push(ct);
    }
    if (!this.allDay) {
      if (this.start >= this.end) {
        ct = {campo: 'end', msg: 'Data/Hora at?? inv??lida.'};
        this.formErro.push(ct);
      }
    }
    if (this.recorrente) {
      if (this.rdCountUntil === 'until') {
        if (this.fimAte < this.start) {
          ct = {campo: 'until', msg: 'Data / Hora t??rmino inv??lido.'};
          this.formErro.push(ct);
        }
      } else {
        if (!this.fimNumOcorrencias || this.fimNumOcorrencias < 1) {
          ct = {campo: 'fimNumOcorrencias', msg: 'N??mero de ocorr??ncia inv??lido.'};
          this.formErro.push(ct);
        }
      }
      if (this.frequencia === 2) {
        if (this.semanaDiasLiteral.length === 0) {
          ct = {campo: 'semanaDiasLiteral', msg: 'Dias da semana para ocorr??ncia ?? obrigat??rio.'};
          this.formErro.push(ct);
        }
      }
      if (this.frequencia === 1) {
        if (this.rdMensal === 'mesDia') {
          if (!this.mesDias || typeof this.mesDias !== 'number' && this.mesDias.length === 0 ) {
            ct = {campo: 'mesDias', msg: 'Dias do m??s para ocorr??ncia ?? obrigat??rio.'};
            this.formErro.push(ct);
          }
        }
      }
      if (this.frequencia === 0) {
        if (this.rdAnual === 2) {
          if (!this.anoMeses || typeof this.anoMeses !== 'number' && this.anoMeses.length === 0 ) {
            this.formErro.push('anoMeses');
            this.formErro.push(ct);
          }
        }
      }
    } else {
      if (!this.allDay) {
        this.fim = this.end;
      } else {
        this.end = new Date(this.start.getTime());
        this.end.setHours(this.end.getHours() + 1);
        this.fim = this.end;
      }
    }
    ct = null;
    this.verificaValidacoesForm(this.calForm.form);
    if (this.formErro.length > 0) {
      this.formErro.forEach( e => {
        this.messageService.add({
          key: 'toastprincipal',
          severity: 'warn',
          summary: 'ERRO !!!',
          detail: e.msg
        });
      });
      this.botaoEnviarVF = false;
      this.mostraForm = true;
    } else {
      if (this.allDay) {
        this.duration = null;
      } else {
        this.duration = this.calculaDuracao();
      }
      if (this.recorrente) {
        if (this.criarData()) {
          this.criaEnvio();
        }
      } else {
        this.criaEnvio();
      }
    }
  }

  criaEnvio() {
    this.cal = new Cal();

    if (this.id) {
      this.cal.id = this.id;
    } else {
      delete this.cal.id;
    }

    if (this.groupId) {
      this.cal.groupId = this.groupId;
    } else {
      this.cal.groupId = UuidService.getUuid();
    }

    const calData = new CalData();
    calData.allDay = this.allDay;
    if (this.duration) {
      calData.duration = this.duration;
    } else {
      delete calData.duration;
    }

    if (this.end) {
      calData.end = this.end.toISOString();
    } else {
      delete calData.end;
    }
    if (this.fim) {
      calData.fim = this.fim.toISOString();
    } else {
      calData.fim = calData.end;
    }
    calData.recorrente = this.recorrente;
    if (this.rrule) {
      calData.rrule = this.rrule;
    } else {
      delete calData.rrule;
    }
    calData.start = this.start.toISOString();


    const calExtrutura = new CalExtrutura();
    if (this.backgroundColor) {
      if (this.backgroundColor !== this.bgc) {
        calExtrutura.backgroundColor = this.backgroundColor;
      } else {
        delete calExtrutura.backgroundColor;
      }
    } else {
      delete calExtrutura.backgroundColor;
    }
    if (this.textColor) {
      calExtrutura.textColor = this.textColor;
    } else {
      delete calExtrutura.textColor;
    }

    if (this.url) {
      calExtrutura.url = this.url;
    } else {
      delete calExtrutura.url;
    }

    const calDados = new CalDados();
    if (this.description) {
      calDados.description = this.description;
    } else {
      delete calDados.description;
    }
    if (this.observacao) {
      calDados.observacao = this.observacao;
    } else {
      delete calDados.observacao;
    }
    if (this.local_id) {
      calDados.local_id = this.local_id;
    } else {
      delete calDados.local_id;
      delete calDados.local_nome;
    }
    calDados.todos_usuarios_sn = this.todos_usuarios_sn ? 1 : 0;
    if (this.todos_usuarios_sn) {
      if (this.usuario_id) {
        calDados.usuario_id = this.usuario_id;
      } else {
          delete calDados.usuario_id;
      }
    } else {
      delete calDados.usuario_id;
    }
    if (this.type_id) {
      calDados.type_id = this.type_id;
    } else {
      delete calDados.type_id;
    }
    if (this.prioridade_id) {
      calDados.prioridade_id = this.prioridade_id;
    } else {
      delete calDados.prioridade_id;
    }
    if (this.calendario_status_id) {
      calDados.calendario_status_id = this.calendario_status_id;
    } else {
      delete calDados.calendario_status_id;
    }

    calDados.title =  this.title;
    this.cal.calDados = calDados;
    this.cal.calExtrutura = calExtrutura;
    this.cal.calData = calData;


    if (this.acao === 'alterar') {
      this.alterarCalendario();
    } else {
      this.incluirCalendario();
    }
  }

  getWeekDay(d: string): number {
    const wdia = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
    return +wdia.indexOf(d);
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

  myUploader(event) {
    const file = event.files[0];
    // console.log(this.geraIcal(file));
    const teste = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      'CLASS:PUBLIC"',
      'DESCRIPTION:"',
      'DTSTART:20200803T202535',
      'DTEND:20200804T202535',
      'LOCATION:',
      'SUMMARY:',
      'TRANSP:TRANSPARENT',
      'END:VEVENT',
      'END:VCALENDAR',
      'UID:ybjfx468xxm',
      'DTSTAMP:20200803',
      'PRODID:datebook.dev'
    ];

    // const teste2 = ical.parseFile(file.name);
    // console.log(teste2);
  }

  onBasicUpload(ev) {
  }
}
