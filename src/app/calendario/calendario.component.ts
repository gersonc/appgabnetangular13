import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import luxonPlugin from '@fullcalendar/luxon';
import rrulePlugin from '@fullcalendar/rrule';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import {CalendarOptions, EventApi, FullCalendarComponent} from '@fullcalendar/angular';
import {AuthenticationService, UrlService} from '../_services';
import {HttpClient} from '@angular/common/http';
import {take} from 'rxjs/operators';
import {DialogService} from 'primeng/dynamicdialog';
import {Subscription} from 'rxjs';
import {WindowsService} from '../_layout/_service';
import {ResizedEvent} from 'angular-resize-event';
import {DateTime, Duration} from 'luxon';
import autoTable from 'jspdf-autotable';
import {ParceEventos} from "./_services/parce-eventos";
import {EventoInterface} from "./_models/evento-interface";
import {CalendarioService} from "./_services/calendario.service";
import {limpaTextoNull} from "../shared/functions/limpa-texto";
import {CalBusca, Evento} from "./_models/calendario";
import {SelectItem} from "primeng/api";
import {MsgService} from "../_services/msg.service";
import { DispositivoService } from "../_services/dispositivo.service";

declare let jsPDF: any;

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css'],
  providers: [DialogService]
})
export class CalendarioComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('fc', {static: true}) fc: FullCalendarComponent;
  @ViewChild('cesq', {static: true}) cesq: ElementRef;
  @ViewChild('calForm', {static: true}) public calForm: NgForm;



  eventos: EventoInterface[];
  evT: { ev: Evento, jsEvent: any } = null;
  ev: Evento | null = null;
  options: CalendarOptions;
  startOld: Date;
  endOld: Date;
  sub: Subscription[] = [];
  info: any;

  public titulo: string;
  offsetX: number;
  offsetY: number;
  altura: number;
  novaAltura: number;
  largura: number = 0;
  novaLargura: number;
  mostra = false;
  mudaDetalhe = false;
  mostraDetalhe = false;
  // mostraDetalheClass = 'calendario-direita-0';
  // calEsq = 'calendario-esquerda-0';
  escala = 1.88;
  largPadrao = 768;
  initView = 'dayGridMonth';
  headerStart = 'prevYear,prev,today,next,nextYear,btnBusca';
  headerCenter = 'title';
  headerEnd = 'btaoIncluir,btaoImprimir,dayGridMonth,timeGridWeek,timeGridDay';
  footerStart = null;
  footerCenter = null;
  footerEnd = null;
  eventoData: Date;
  formDados: any;
  formTitulo: string;
  mostraForm = false;
  mostraExibir = false;
  dadosExibir: any;
  mostraExcluir = false;
  dadosExcluir: any;
  mostraImprimir = false;
  dadosImprimir: any;
  acao: string = null;
  mostraMenu = false;

  // BUSCA ***
  ddtypes: SelectItem[];
  ddprioridade: SelectItem[];
  ddlocal: SelectItem[];
  ddcalendario_status: SelectItem[];

  bsStart: Date = null;
  bsFim: Date = null;
  bsTituloIni: string = null;
  bsTitulo: string = null;
  bsObsIni: string = null;
  bsObs: string = null;
  bsType_id: number = null;
  bsPrioridade_id: number = null;
  bsLocal_id: number = null;
  bsStatus_id: number = null;
  bsAtivo = false;
  bsPrimeiro = false;

  windowObjectReference = null;
  PreviousUrl: string = null;
  id: number;

  detalhemodulo: string = null;
  detalheid: number = null;

  constructor(
    private url: UrlService,
    private http: HttpClient,
    public cl: CalendarioService,
    public authenticationService: AuthenticationService,
    private messageService: MsgService,
    public dialogService: DialogService,
    public ds: DispositivoService
  ) {
  }

  ngOnInit() {
    this.cl.calBusca = new CalBusca();
    this.carregaDropdownSessionStorage();
    const x = WindowsService.nativeWindow.innerWidth - 20;
    const y = WindowsService.nativeWindow.innerHeight - 140;
    this.largura = WindowsService.nativeWindow.innerWidth - 32;
    this.altura = WindowsService.nativeWindow.innerHeight - 90;
    this.responsivel();
    this.options = {
      themeSystem: 'standard',
      plugins: [rrulePlugin, luxonPlugin, dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
      timeZone: 'America/Sao_Paulo',
      locale: ptBrLocale,
      initialDate: new Date(),
      aspectRatio: this.getEscala(),
      initialView: this.initView,
      customButtons: {
        btaoIncluir: {
          text: 'Incluir',
          click: () => this.incluirEvento()
        },
        btaoImprimir: {
          text: 'Imprimir',
          click: () => this.imprimir()
        },
        btnLsemana: {
          text: 'Lst.Sem',
          click: () => this.listaSemana()
        },
        btnLmes: {
          text: 'Lst.Mês',
          click: () => this.listaMes()
        },
        btnLano: {
          text: 'Lst.Ano',
          click: () => this.listaAno()
        },
        btnTeste: {
          text: 'Lst.Ano',
          click: () => this.imprimirTeste()
        },
        btnBusca: {
          text: 'Busca',
          click: () => this.mostrabusca()
        },
        btnBusca1: {
          text: 'Limpar',
          click: () => this.resetBusca()
        }
      },
      buttonText: {
        today: ' Hoje ',
        month: ' Mês ',
        week: 'Semana',
        day: 'Dia ',
        list: 'Lista',
      },
      headerToolbar: {
        start: this.headerStart,
        center: this.headerCenter,
        end: this.headerEnd
      },
      footerToolbar: {
        start: this.footerStart,
        center: this.footerCenter,
        end: this.footerEnd
      },
      eventTimeFormat: { // like '14:30:00'
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      },
      dayMaxEventRows: true, // for all non-TimeGrid views
      views: {
        timeGrid: {
          dayMaxEventRows: true // adjust to 6 only for timeGridWeek/timeGridDay
        },
        timeGridDay: {
          eventContent: (arg) => {
            if (arg.event.title) {
              let n = 0;
              const tabEl = document.createElement('table');
              const tbEl = tabEl.createTBody();
              const rowEl0 = tbEl.insertRow(n);
              const celEl0 = rowEl0.insertCell(0);
              const titleEl = document.createTextNode(arg.event.title);
              celEl0.appendChild(titleEl);
              const desc = limpaTextoNull(arg.event.extendedProps.description);
              if (desc) {
                n = n + 1;
                const rowEl1 = tbEl.insertRow(n);
                const celEl1 = rowEl1.insertCell(0);
                const descEl = document.createTextNode(desc);
                celEl1.appendChild(descEl);
              }
              const arrayOfDomNodes = [tabEl];
              return {domNodes: arrayOfDomNodes};
            } else {
              return arg;
            }
          }
        }
      },
      showNonCurrentDates: false,
      weekNumbers: false,
      navLinks: true,
      loading: (e: boolean) => {
      },
      navLinkDayClick: (date, jsEvent) => {
        this.mostraDia(date);
      },
      moreLinkClick: 'popover',
      eventClick: (e) => {
        e.jsEvent.preventDefault();
        this.eventoData = e.event.start;
        const evto: { ev: Evento, jsEvent: any } = this.criaEvento(e);
        this.exibirEvento(evto.ev, e.event.startStr, e.event.endStr, this.largura, this.altura);
      },
      eventSources: [
        {
          events: (info, successCallback, failureCallback) => {

            this.sub.push(this.cl.calendarioListar(info.startStr, info.endStr)
              .pipe(take(1))
              .subscribe((data) => {
                  this.eventos = ParceEventos(data);

                  successCallback(this.eventos);
                },
                error1 => {
                  failureCallback(error1);
                }
              ));

          },
          display: 'block'
        },
        {
          // url: 'https://www.officeholidays.com/ics/brazil', // use the `url` property
        }

      ],
      eventMouseEnter: (info: any) => {
          this.evT = this.criaEvento(info);
          if (this.evT.ev) {
            this.mostra = true;
            this.ev = this.evT.ev;
            if (this.detalheAtivo && this.mudaDetalhe) {
              this.mostraDetalhe = true;
            }
          }
      },
      eventMouseLeave: (info) => {
        this.mostraDetalhe = false;
        this.mostra = false;
      }
    };

  }

  get detalheAtivo(): boolean {
    return this.largura > this.largPadrao;
  }

  get detalheClass(): string {
    return (this.detalheAtivo && this.mudaDetalhe) ? 'calendario-direita-1' : 'calendario-direita-0';
  }

  get calendarioEsquerdaClass(): string {
    return (this.detalheAtivo && this.mudaDetalhe) ? 'calendario-esquerda-1' : 'calendario-esquerda-0';
  }

  ngAfterViewInit() {
  }

  onResized(event: ResizedEvent) {
    this.novaLargura = event.newRect.width - 20;
    this.novaAltura = event.newRect.height;
    this.responsivel();
    this.fc.getApi().setOption('aspectRatio', this.getEscala());
    const headerToolbar = {
      start: this.headerStart,
      center: this.headerCenter,
      end: this.headerEnd
    };
    const footerToolbar = {
      start: this.footerStart,
      center: this.footerCenter,
      end: this.footerEnd
    };
    this.fc.getApi().setOption('headerToolbar', headerToolbar);
    this.fc.getApi().setOption('footerToolbar', footerToolbar);
  }

  verificaView(): void {
    if (this.detalheAtivo) {
      this.fc.getApi().setOption('initialView', 'listMonth');
    }
  }

  showDtelhe() {
    this.mudaDetalhe = !this.mudaDetalhe;
  }

  criaEvento(info) {
    const ev = new Evento();
    if (info.event.id) {
      ev.id = info.event.id;
    } else {
      delete ev.id;
    }
    if (info.event.groupId) {
      ev.groupId = info.event.groupId;
    } else {
      delete ev.groupId;
    }
    ev.allDay = info.event.allDay;
    const dt1: DateTime = DateTime.fromJSDate(info.event.start);
    if (!ev.allDay) {
      ev.start = dt1.toFormat('DDDD');
      ev.inicio = dt1.toFormat('T');
    } else {
      ev.start = dt1.toFormat('DDDD');
    }
    if (info.event.backgroundColor) {
      ev.backgroundColor = info.event.backgroundColor;
      ev.textColor = this.getContrastYIQ(ev.backgroundColor);
    } else {
      ev.backgroundColor = 'var(--primary-color)';
      ev.textColor = 'var(--primary-color-text)';
    }

    if (info.event.borderColor) {
      ev.borderColor = info.event.borderColor;
    } else {
      ev.borderColor = 'var(--primary-color)';
    }

    if (info.event.url) {
      ev.url = info.event.url;
    } else {
      delete ev.url;
    }

    if (info.event.end) {
      const dt2: DateTime = DateTime.fromJSDate(info.event.end);
      ev.end = dt2.toFormat('DDDD');
      ev.endHora = dt2.toFormat('T');
    } else {
      delete ev.end;
      delete ev.endHora;
    }

    if (info.event.color) {
      ev.color = info.event.color;
    } else {
      delete ev.color;
    }
    ev.title = info.event.title;
    if (info.event.rrule) {
      ev.rrule = info.event.rrule;
    } else {
      delete ev.rrule;
    }

    if (info.event.allDay) {
      const dur = 'Dia inteiro';
      ev.duracao = dur;
      ev.tempo = dur;
    } else {
      if (info.event.extendedProps.duration) {
        const dur: string = info.event.extendedProps.duration;
        if (dur.charAt(2) === ':') {
          ev.tempo = '';
          const dur1 = dur.split(':');
          if (+dur[0] > 0) {
            ev.tempo += dur[0] + ' hora(s) ';
          }
          if (+dur[1] > 0) {
            if (+dur[0] > 0) {
              ev.tempo += 'e ';
            }
            ev.tempo += +dur[1] + ' minuto(s)';
          }
          ev.duracao = ev.tempo;
        }
        if (dur.charAt(0) === 'P') {
          ev.tempo = '';
          const d: Duration = Duration.fromISO(dur);
          if (d.days > 0) {
            ev.tempo += d.days + ' dias(s) ';
          }
          if (d.hours > 0) {
            if (d.days > 0) {
              ev.tempo += 'e ';
            }
            ev.tempo += d.hours + ' hora(s) ';
          }
          if (d.minutes > 0) {
            if (d.days > 0 || d.hours > 0) {
              ev.tempo += 'e ';
            }
            ev.tempo += d.minutes + ' minuto(s)';
          }
        }

      } else {
        const dt4: DateTime = DateTime.fromJSDate(info.event.end);
        const dif = dt4.diff(dt1, ['days', 'hours', 'minutes']);
        if (dif.days) {
          const d = (dif.days > 0) ? dif.days + ' dia(s), ' : '';
          let dura = d;
          if (dif.hours) {
            dura += dif.hours + '\xa0' + 'hora(s), ';
            if (dif.minutes) {
              dura += dif.minutes + '\xa0' + 'minutos';
            }
          }
          ev.tempo = dura;
          ev.duracao = dura;
        } else {
          delete ev.tempo;
        }
      }
    }

    if (info.event.extendedProps.fim) {
      const dt4: DateTime = DateTime.fromSQL(info.event.extendedProps.fim);
      ev.fim = info.event.extendedProps.fim;
      if (ev.allDay) {
        ev.fim = dt4.toFormat('DDD');
      } else {
        ev.fim = dt4.toFormat('DDD T');
      }
      delete ev.fimHora;
    } else {
      delete ev.fim;
      delete ev.fimHora;
    }
    if (info.event.extendedProps.recorrente) {
      ev.recorrente = info.event.extendedProps.recorrente;
    } else {
      delete ev.recorrente;
    }
    if (info.event.extendedProps.modulo) {
      ev.modulo = info.event.extendedProps.modulo;
    } else {
      delete ev.modulo;
    }
    if (info.event.extendedProps.registro_id) {
      ev.registro_id = +info.event.extendedProps.registro_id;
    } else {
      delete ev.registro_id;
    }
    if (info.event.extendedProps.description) {
      ev.description = info.event.extendedProps.description;
    } else {
      delete ev.description;
    }
    if (info.event.extendedProps.description_delta) {
      ev.description_delta = info.event.extendedProps.description_delta;
    } else {
      delete ev.description_delta;
    }
    if (info.event.extendedProps.description_texto) {
      ev.description_texto = info.event.extendedProps.description_texto;
    } else {
      delete ev.description_texto;
    }

    if (info.event.extendedProps.observacao) {
      ev.observacao = info.event.extendedProps.observacao;
    } else {
      delete ev.observacao;
    }
    if (info.event.extendedProps.prioridade_id) {
      ev.prioridade_id = info.event.extendedProps.prioridade_id;
    } else {
      delete ev.prioridade_id;
    }
    if (info.event.extendedProps.prioridade_nome) {
      ev.prioridade_nome = info.event.extendedProps.prioridade_nome;
    } else {
      delete ev.prioridade_nome;
    }
    if (info.event.extendedProps.prioridade_color) {
      ev.prioridade_color = info.event.extendedProps.prioridade_color;
    } else {
      delete ev.prioridade_color;
    }
    if (info.event.extendedProps.calendario_status_id) {
      ev.calendario_status_id = info.event.extendedProps.calendario_status_id;
    } else {
      delete ev.calendario_status_id;
    }
    if (info.event.extendedProps.calendario_status_nome) {
      ev.calendario_status_nome = info.event.extendedProps.calendario_status_nome;
    } else {
      delete ev.calendario_status_nome;
    }
    if (info.event.extendedProps.calendario_status_color) {
      ev.calendario_status_color = info.event.extendedProps.calendario_status_color;
    } else {
      delete ev.calendario_status_color;
    }
    if (info.event.extendedProps.type_id) {
      ev.type_id = info.event.extendedProps.type_id;
    } else {
      delete ev.type_id;
    }
    if (info.event.extendedProps.type_name) {
      ev.type_name = info.event.extendedProps.type_name;
    } else {
      delete ev.type_name;
    }
    if (info.event.extendedProps.type_color) {
      ev.type_color = info.event.extendedProps.type_color;
    } else {
      delete ev.type_color;
    }

    if (info.event.extendedProps.local_id) {
      ev.local_id = info.event.extendedProps.local_id;
    } else {
      delete ev.local_id;
    }
    if (info.event.extendedProps.local_nome) {
      ev.local_nome = info.event.extendedProps.local_nome;
    } else {
      delete ev.local_nome;
    }
    if (info.event.extendedProps.local_color) {
      ev.local_color = info.event.extendedProps.local_color;
    } else {
      delete ev.local_color;
    }

    delete ev.usuario_id;
    delete ev.classNames;
    delete ev.todos_usuarios_sn;

    return {ev: ev, jsEvent: info.jsEvent};
  }

  mostraDia(dia) {
    this.fc.getApi().changeView('timeGridDay', dia);
  }

  alterarEvento(ev: Evento) {
    if (this.authenticationService.agenda_alterar) {
      this.id = ev.id;
      let evto: EventoInterface;
      this.sub.push(this.cl.getEventoId(ev.id)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            evto = dados[0];
          },
          error: err => {
          },
          complete: () => {
            this.acao = 'alterar';
            this.formDados = {
              acao: 'alterar',
              evento: evto
            };
            this.formTitulo = 'ALTERAR EVENTO';
            this.dadosExibir = null;
            this.mostraExibir = false;
            this.mostraForm = true;
          }
        })
      );
    }
  }

  incluirEvento() {
    if (this.authenticationService.agenda_incluir) {
      this.acao = 'incluir';
      this.formDados = {
        acao: 'incluir',
        id: 0
      };
      this.formTitulo = 'INCLUIR EVENTO';
      this.mostraForm = true;
    }
  }

  exibirEvento(ev: Evento, startStr: string, endStr?: string, largura = 0, altura = 0) {
    const tmp = this.eventos.find(i => i.id === ev.id);
    this.dadosExibir = {
      data: {ev: ev, startStr: startStr, endStr: endStr, mostrabts: true},
      acao: 'exibir',
      largura: largura,
      altura: altura
    };
    this.mostraExibir = true;
  }

  apagarEvento(ev: Evento) {
    if (this.authenticationService.agenda_apagar) {
      let resp: any[];
      this.sub.push(this.cl.eventoApagarId(ev.id)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            resp = dados;
          },
          error: err => {
            console.error(err);
          },
          complete: () => {
            if (resp[0]) {
              if (+resp[1] === -1) {
                this.messageService.add({
                  key: 'toastprincipal',
                  severity: 'success',
                  summary: 'APAGAR EVENTO',
                  detail: resp[2]
                });
                if (this.eventos.find(i => i.id === ev.id) !== undefined) {
                  this.fc.getApi().getEventById(ev.id).remove();
                  this.eventos.splice(this.eventos.indexOf(this.eventos.find(i => i.id === ev.id)), 1);
                }
                this.mostraExibir = false;
              } else {
                this.acao = 'apagar';
                this.dadosExcluir = {
                  acao: 'apagar',
                  evento: ev,
                  eventoData: this.eventoData.toISOString(),
                  num: resp[4]
                };
                this.dadosExibir = null;
                this.mostraExibir = false;
                this.mostraExcluir = true;
              }
            } else {
              this.messageService.add({
                key: 'toastprincipal',
                severity: 'warn',
                summary: 'ATENÇÃO - ERRO',
                detail: resp[2]
              });
            }
          }
        })
      );
    }
  }

  abreFechaForm() {
    this.mostraForm = false;
  }

  onFecharExibir(ev: string = null): void {
    if (ev) {
      if (ev === 'alterar') {
        this.alterarEvento(this.dadosExibir.data.ev);
      }
      if (ev === 'apagar') {
        this.apagarEvento(this.dadosExibir.data.ev);
      }
    } else {
      this.dadosExibir = null;
      this.mostraExibir = false;
    }
  }

  onFecharExcluir(ev: any = null): void {
    if (ev.evento) {
      const et: EventApi = this.fc.getApi().getEventById(ev.id);
      et.remove();
      this.fc.getApi().addEvent(ev);
      this.fc.getApi().render();
      this.eventos.splice(this.eventos.indexOf(this.eventos.find(i => i.id === ev.id)), 1, ev.evento);
    } else {
      if (ev.id > 0) {
        this.fc.getApi().getEventById(ev.id).remove();
        this.eventos.splice(this.eventos.indexOf(this.eventos.find(i => i.id === ev.id)), 1);
      }
    }
    this.dadosExcluir = null;
    this.mostraExcluir = false;
  }

  eventoRetorno(ev: EventoInterface[]) {
    if (this.acao === 'incluir') {
      if (ev.length > 0) {
        ev.forEach((e: EventoInterface) => {
          this.fc.getApi().addEvent(e);
          this.eventos.push(e);
        });
        this.mostraForm = false;
      } else {
        this.mostraForm = false;
      }
    }
    if (this.acao === 'alterar') {
      if (ev.length > 0) {
        const eve: EventoInterface = ev[0];
        const tmp = this.eventos.find(i =>
          +i.id === this.id
        );
        if (tmp !== undefined) {
          const idx = this.eventos.indexOf(tmp);
          this.eventos.splice(idx, 1, eve);
        }
        this.fc.getApi().getEventById(this.id.toString()).remove();
        this.fc.getApi().addEvent(eve);
        setTimeout(() => {
          this.fc.getApi().render();
        }, 3000);


        // this.eventos.push(eve);
        this.mostraForm = false;
      } else {
        this.mostraForm = false;
      }
    }
  }

  getContrastYIQ(hexcolor) {
    hexcolor = hexcolor.replace('#', '');
    const r = parseInt(hexcolor.substring(0, 2), 16);
    const g = parseInt(hexcolor.substring(2, 2), 16);
    const b = parseInt(hexcolor.substring(4, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
  }

  imprimir() {
    let ev: any[];
    this.sub.push(this.cl.imprimir(
      this.fc.getApi().view.currentStart.toISOString(),
      this.fc.getApi().view.currentEnd.toISOString())
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          ev = dados;
        },
        error: err => {
          console.error(err);
        },
        complete: () => {
          if (ev['anos'].length > 0) {
            this.dadosImprimir = {
              acao: 'imprimir',
              dadosImp: ev
            };
            this.mostraImprimir = true;
          } else {
            this.messageService.add({
              key: 'toastprincipal',
              severity: 'warn',
              summary: 'IMPRIMIR EVENTOS',
              detail: 'Não existem eventos nesse período.'
            });
          }
        }
      })
    );
  }

  imprimirFechar() {
    this.dadosImprimir = null;
    this.mostraImprimir = false;
  }

  imprimir2() {
  }

  imprimirTudo() {
    const fcal = this.fc.getApi();
    const vfc = document.getElementsByTagName('table');
    const imprimir = false;

    const doc = new jsPDF(
      {
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true
      }
    );
    doc.setFontSize(15);
    doc.text('CALENDARIO', 15, 15);
    doc.setFontSize(8);
    autoTable(doc, {html: vfc[0]});

    const fileName = `calendario_${new Date().getTime()}.pdf`;

    setTimeout(() => {
      if (imprimir === false) {
        doc.save(fileName);
      } else {
        doc.autoPrint();
        // doc.output('dataurlnewwindow');
        window.open(doc.output('bloburl'));
      }
    }, 1000);
  }

  imprimirTeste() {
    const divToPrint = this.fc.getApi().el;
    const newWindow = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    newWindow.document.open();
    newWindow.document.write(`
    <html>
        <head>
          <title>Calendario - GabNet</title>
          </head>
        <body onload="window.print();window.close()">
        ${divToPrint}
        </body>
    </html>
    `);
    newWindow.document.close();
  }

  mostrabusca() {
    this.mostraMenu = !this.mostraMenu;
  }

  listaAno() {
    this.initView = 'listYear';
    this.fc.getApi().changeView('listYear');
  }

  listaMes() {
    this.initView = 'listMonth';
    this.fc.getApi().changeView('listMonth');
  }

  listaSemana() {
    this.initView = 'listWeek';
    this.fc.getApi().changeView('listWeek');
  }

  responsivel() {
    if (this.largura >= 1120) {
      this.initView = 'dayGridMonth';
      this.headerStart = 'prevYear,prev,today,next,nextYear,btnBusca';
      this.headerCenter = 'title';
      this.headerEnd = 'btaoIncluir,btaoImprimir,dayGridMonth,timeGridWeek,timeGridDay,btnLsemana,btnLmes,btnLano';
      this.footerStart = null;
      this.footerCenter = null;
      this.footerEnd = null;
    } else {
      this.initView = (this.largura > this.largPadrao) ? 'dayGridMonth' : 'listMonth';
      this.headerStart = 'prevYear,prev,today,next,nextYear,btnBusca';
      this.headerCenter = (this.largura > this.largPadrao) ? 'title' : null;
      this.headerEnd = (this.largura > this.largPadrao) ? 'dayGridMonth,timeGridWeek,timeGridDay' : 'title';
      this.footerStart = (this.largura > this.largPadrao) ? 'btaoIncluir,btaoImprimir' : 'timeGridDay,btnLsemana,btnLmes,btnLano';
      this.footerCenter = (this.largura > this.largPadrao) ? null : null;
      this.footerEnd = (this.largura > this.largPadrao) ? 'btnLsemana,btnLmes,btnLano' : 'btaoIncluir,btaoImprimir';
    }
  }

  getEscala(): number {
    this.largura = WindowsService.nativeWindow.innerWidth - 32;
    this.altura = WindowsService.nativeWindow.innerHeight - 90;
    if (this.largura < 1120) {
      this.altura = WindowsService.nativeWindow.innerHeight - 128;
    }
    if (this.largura >= this.altura) {
      this.escala = this.largura / this.altura;
    } else {
      this.escala = this.largura / (this.altura * 0.9);
    }
    return this.escala;
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

  // BUSCA **********************************************
  carregaDropdownSessionStorage() {
    this.ddtypes = JSON.parse(sessionStorage.getItem('dropdown-types'));
    this.ddprioridade = JSON.parse(sessionStorage.getItem('dropdown-prioridade'));
    this.ddlocal = JSON.parse(sessionStorage.getItem('dropdown-local'));
    this.ddcalendario_status = JSON.parse(sessionStorage.getItem('dropdown-calendario_status'));
  }

  limpaFormulario() {
    this.bsStart = null;
    this.bsFim = null;
    this.bsTituloIni = null;
    this.bsTitulo = null;
    this.bsObsIni = null;
    this.bsObs = null;
    this.bsType_id = null;
    this.bsPrioridade_id = null;
    this.bsLocal_id = null;
    this.bsStatus_id = null;
    this.bsAtivo = false;
    this.bsPrimeiro = false;
  }

  resetBusca() {
    this.limpaFormulario();
    // this.fc.getApi().removeAllEventSources();
    this.headerStart = 'prevYear,prev,today,next,nextYear,btnBusca';
    this.fc.getApi().setOption('headerToolbar', {
      start: this.headerStart,
      center: this.headerCenter,
      end: this.headerEnd
    });
    this.fc.getApi().changeView(this.initView);
    this.fc.getApi().removeAllEventSources();
    this.fc.getApi().addEventSource({
        events: (info, successCallback, failureCallback) => {
          this.sub.push(this.cl.calendarioListar(info.startStr, info.endStr)
            .pipe(take(1))
            .subscribe((data) => {
                this.eventos = data;
                successCallback(this.eventos);
              },
              error1 => {
                failureCallback(error1);
              }
            ));
        },
        display: 'block'
      }
    );
    this.bsPrimeiro = false;
  }

  mudaAte(ev) {

  }

  onSubmit() {
    if (
      this.bsStart ||
      this.bsFim ||
      this.bsTitulo ||
      this.bsTituloIni ||
      this.bsObs ||
      this.bsObsIni ||
      this.bsLocal_id ||
      this.bsType_id ||
      this.bsPrioridade_id ||
      this.bsStatus_id
    ) {
      this.bsPrimeiro = true;
      this.cl.calBusca = new CalBusca();
      this.cl.calBusca.bsStart = this.bsStart ? this.bsStart.toISOString() : null;
      this.cl.calBusca.bsFim = this.bsFim ? this.bsFim.toISOString() : null;
      this.cl.calBusca.bsTitulo = this.bsTitulo ? this.bsTitulo.length > 0 ? this.bsTitulo : null : null;
      this.cl.calBusca.bsTituloIni = this.bsTituloIni ? this.bsTituloIni.length > 0 ? this.bsTituloIni : null : null;
      this.cl.calBusca.bsObs = this.bsObs ? this.bsObs.length > 0 ? this.bsObs : null : null;
      this.cl.calBusca.bsObsIni = this.bsObsIni ? this.bsObsIni.length > 0 ? this.bsObsIni : null : null;
      this.cl.calBusca.bsLocal_id = this.bsLocal_id ? this.bsLocal_id : null;
      this.cl.calBusca.bsType_id = this.bsType_id ? this.bsType_id : null;
      this.cl.calBusca.bsPrioridade_id = this.bsPrioridade_id ? this.bsPrioridade_id : null;
      this.cl.calBusca.bsStatus_id = this.bsStatus_id ? this.bsStatus_id : null;
      this.cl.calBusca.bsAtivo = true;
      this.mostraMenu = false;
      this.fc.getApi().removeAllEventSources();
      this.headerStart = 'prevYear,today,nextYear,btnBusca1';
      this.fc.getApi().setOption('headerToolbar', {
        start: this.headerStart,
        center: this.headerCenter,
        end: this.headerEnd
      });
      this.fc.getApi().changeView('listYear');
      this.fc.getApi().addEventSource({
          events: (info, successCallback, failureCallback) => {
            if (this.bsPrimeiro) {
              if (this.bsStart) {
                if (this.bsStart <= info.start) {
                  info.startStr = this.cl.calBusca.bsStart;
                }
              }
              if (this.bsFim) {
                if (this.bsFim >= info.end) {
                  info.endStr = this.cl.calBusca.bsFim;
                }
              }
              this.startOld = this.bsStart;
              this.endOld = this.bsFim;
            } else {
              this.startOld = info.start;
              this.endOld = info.end;
            }
            this.sub.push(this.cl.postCalendarioBuscar(this.cl.calBusca)
              .pipe(take(1))
              .subscribe((data) => {
                  this.eventos = data;
                  if (this.bsPrimeiro) {
                    this.bsPrimeiro = false;
                  }
                  successCallback(this.eventos);
                },
                error1 => {
                  failureCallback(error1);
                }
              ));
          },
          display: 'block'
        }
      );

    }
  }

  getUtc(d: DateTime = null) {
    d = d ? d : DateTime.now();
    return Date.UTC(
      d.year,
      d.month,
      d.day,
      d.hour,
      d.minute,
      d.second
    );
  }

  resetForm() {
    this.cl.limpaFormulario();
    this.limpaFormulario();
  }

  fecharBusca() {
    this.mostraMenu = false;
  }

  onDetalhe(ev: any) {
    this.detalhemodulo = ev.modulo;
    this.detalheid = ev.id;
    this.mostraExibir = false;
  }

  openRequestedSinglePopup(url) {
    // tslint:disable-next-line:max-line-length
    const feat: string = 'height=' + this.altura / 2 + ',width=' + this.largura / 2 + ',resizable=yes,scrollbars=yes,status=yes,menubar=yes';
    if (this.windowObjectReference == null || this.windowObjectReference.closed) {
      this.windowObjectReference = window.open(url, 'SingleSecondaryWindowName', feat);
    } else {
      if (this.PreviousUrl !== url) {
        this.windowObjectReference = window.open(url, 'SingleSecondaryWindowName', feat);
        this.windowObjectReference.focus();
      } else {
        this.windowObjectReference.focus();
      }
    }
  }



}
