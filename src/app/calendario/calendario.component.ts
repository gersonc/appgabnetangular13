import { Component, ElementRef, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Form } from '@angular/forms';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import luxonPlugin from '@fullcalendar/luxon';
import rrulePlugin from '@fullcalendar/rrule';

import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { CalendarioService } from './_services';
import {CalBusca, Evento, EventoInterface} from './_models';
import {FullCalendarComponent, CalendarOptions, EventApi} from '@fullcalendar/angular';
import { UrlService } from '../util/_services';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { AuthenticationService, CarregadorService } from '../_services';
import { MessageService, SelectItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { WindowsService } from '../_layout/_service';
import { ResizedEvent } from 'angular-resize-event';
import { CalendarioFormularioComponent } from './calendario-formulario/calendario-formulario.component';
import { DateTime } from 'luxon';
import { CalendarioExibirComponent } from './calendario-exibir/calendario-exibir.component';
import autoTable from 'jspdf-autotable';
import { CalendarioImprimirComponent } from './calendario-imprimir/calendario-imprimir.component';
import {EventSourceFunc, EventSourceInput} from '@fullcalendar/common';

declare var jsPDF: any;

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css'],
  providers: [ DialogService ]
})
export class CalendarioComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('fc', { static: true }) fc: FullCalendarComponent;
  @ViewChild('cesq', { static: true }) cesq: ElementRef;
  @ViewChild('calFm', { static: true }) public calFm: NgForm;

  eventos: EventoInterface[];
  evT: {ev: Evento, jsEvent: any} = null;
  ev: Evento | null = null;
  options: CalendarOptions;
  startOld: Date;
  endOld: Date;
  sub: Subscription[] = [];
  info: any;

  public titulo: String;
  offsetX: number;
  offsetY: number;
  altura: number;
  novaAltura: number;
  largura: number;
  novaLargura: number;
  mostra = false;
  mudaDetalhe = false;
  mostraDetalhe = false;
  mostraDetalheClass = 'cal-dir0';
  calEsq = 'cal-esq0';
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

  constructor(
    private url: UrlService,
    private http: HttpClient,
    public cl: CalendarioService,
    public authenticationService: AuthenticationService,
    private messageService: MessageService,
    public dialogService: DialogService,
    public cs: CarregadorService
  ) { }

  ngOnInit() {
    this.cl.calBusca = new CalBusca();
    this.carregaDropdownSessionStorage();
    const x = WindowsService.nativeWindow.innerWidth - 20;
    const y = WindowsService.nativeWindow.innerHeight - 140;
    this.largura = WindowsService.nativeWindow.innerWidth - 32;
    this.altura = WindowsService.nativeWindow.innerHeight - 90;
    this.responsivel();
    this.options = {
      plugins: [rrulePlugin, luxonPlugin, dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
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
        today: 'Hoje',
        month: 'Mês',
        week: 'Semana',
        day: 'Dia',
        list: 'Lista ',
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
              if (arg.event.extendedProps.description) {
                n = n + 1;
                const rowEl1 = tbEl.insertRow(n);
                const celEl1 = rowEl1.insertCell(0);
                const descEl = document.createTextNode(arg.event.extendedProps.description);
                celEl1.appendChild(descEl);
              }
              if (arg.event.extendedProps.observacao) {
                n = n + 1;
                const rowEl2 = tbEl.insertRow(n);
                const celEl2 = rowEl2.insertCell(0);
                const obsE2 = document.createTextNode(arg.event.extendedProps.observacao);
                celEl2.appendChild(obsE2);
              }
              const arrayOfDomNodes = [tabEl];
              return { domNodes: arrayOfDomNodes };
            } else {
              return arg;
            }
          }
        }
      },
      showNonCurrentDates: false,
      weekNumbers: true,
      navLinks: true,
      loading: (e: boolean) => {
        this.cs.mostraEsconde(e);
      },
      navLinkDayClick: (date, jsEvent) => {
        this.mostraDia(date);
      },
      moreLinkClick: 'popover',
      /*dateClick: (e) =>  {
        console.log('dateClick', e);
      },*/
      eventClick: (e) =>  {
        // console.log('eventClick', e.event);
        e.jsEvent.preventDefault();
        this.eventoData = e.event.start;
        const evto: {ev: Evento, jsEvent: any} = this.criaEvento(e);
        this.exibirEvento(evto.ev, e.event.startStr, e.event.endStr, this.largura, this.altura);
      },
      eventSources: [
        {
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
        },
        {
          // url: 'https://www.officeholidays.com/ics/brazil', // use the `url` property
        }

      ],
      eventMouseEnter: (info: any) => {
        if (this.largura > this.largPadrao) {
          this.evT = this.criaEvento(info);
          if (this.evT.ev) {
            this.ev = this.evT.ev;
          }
          if (!this.mostraDetalhe) {
            this.mostra = true;
          }
        }
      },
      eventMouseLeave: (info) => {
        this.mostra = false;
      }
    };
  }

  ngAfterViewInit() {
  }

  onResized(event: ResizedEvent) {
    this.novaLargura =   event.newRect.width - 20;
    this.novaAltura = event.newRect.height;
    this.responsivel();
    this.fc.getApi().setOption('aspectRatio', this.getEscala());
    const headerToolbar =  {
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

  verificaView() {
    if (this.largura <= this.largPadrao) {
      this.fc.getApi().setOption('initialView', 'listMonth');
    }
  }

  showDtelhe() {
    this.mudaDetalhe = !this.mudaDetalhe;
    if (this.mudaDetalhe) {
      setTimeout(() => {
          this.mostraDetalhe = !this.mostraDetalhe;
        }, 2000
      );
    } else {
      this.mostraDetalhe = !this.mostraDetalhe;
    }
    this.mostraDetalheClass = this.mudaDetalhe ? 'cal-dir1' : 'cal-dir0';
    this.calEsq = this.mudaDetalhe ? 'cal-esq1' : 'cal-esq0';
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
      ev.textColor = 'white';
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

    if (info.event.extendedProps.duracao) {
      const hra: number = +info.event.extendedProps.duracao.substr(0, 2);
      const mnt: number = +info.event.extendedProps.duracao.substr(3, 2);

      let nhora = '\xa0' + 'hora';
      if (hra > 1) {
        nhora = '\xa0' + 'horas';
      }
      let dura1 = hra + nhora;
      if (mnt > 0 ) {
        dura1 += '\xa0\xa0' + 'e' + '\xa0\xa0' +  mnt + '\xa0' + 'minutos';
      }
      ev.tempo = dura1;
      ev.duracao = dura1;
    } else {
      if (!ev.allDay) {
        const dt4: DateTime = DateTime.fromJSDate(info.event.end);
        const dif = dt4.diff(dt1, ['days', 'hours', 'minutes']);
        if (dif.days) {
          let dura = dif.days + ' dia(s)';
          if (dif.hours) {
            dura += '\xa0\xa0' + 'e' + '\xa0\xa0' + dif.hours + '\xa0' + 'hora(s)';
            if (dif.minutes) {
              dura += '\xa0\xa0' + 'e' + '\xa0\xa0' + dif.minutes + '\xa0' + 'minutos';
            }
          }
          ev.tempo = dura;
          ev.duracao = dura;
        } else {
          delete ev.tempo;
        }
      } else {
        delete ev.tempo;
      }
    }

    if (info.event.fim) {
      const dt3: DateTime = DateTime.fromJSDate(info.event.fim);
      ev.fim = dt3.toFormat('DDDD');
      if (!ev.allDay) {
        ev.fimHora = dt3.toFormat('T');
      } else {
        delete ev.fimHora;
      }
    } else {
      delete ev.fim;
      delete ev.fimHora;
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
    if (info.event.extendedProps.description) {
      ev.description = info.event.extendedProps.description;
    } else {
      delete ev.description;
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
      this.cs.mostraCarregador();
      let evto: EventoInterface;
      this.sub.push(this.cl.getEventoId(ev.id)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            evto = dados[0];
          },
          error: err => {
            this.cs.escondeCarregador();
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
    const tmp = this.eventos.find( i => i.id === ev.id );
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
      this.cs.mostraCarregador();
      let resp: any[];
      this.sub.push(this.cl.eventoApagarId(ev.id)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            resp = dados;
          },
          error: err => {
            this.cs.escondeCarregador();
            console.error(err);
          },
          complete: () => {
            if (resp[0]) {
              if (+resp[1] === -1) {
                this.messageService.add({
                  key: 'calToast',
                  severity: 'success',
                  summary: 'APAGAR EVENTO',
                  detail: resp[2]
                });
                if (this.eventos.find(i => i.id === ev.id) !== undefined) {
                  this.fc.getApi().getEventById(ev.id).remove();
                  this.eventos.splice(this.eventos.indexOf(this.eventos.find(i => i.id === ev.id)), 1);
                }
                this.mostraExibir = false;
                this.cs.escondeCarregador();
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
                key: 'calToast',
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
    // console.log('onFecharExcluir', ev);
    if (ev.evento) {
      const et: EventApi =  this.fc.getApi().getEventById(ev.id);
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
        ev.forEach( (e: EventoInterface) => {
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
        // console.log('eve', eve);
        this.fc.getApi().addEvent(eve);
        setTimeout(() => {
          this.fc.getApi().render();
          // console.log('this.eventos', this.fc.getApi().getEvents());
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
    const r = parseInt(hexcolor.substr(0, 2), 16);
    const g = parseInt(hexcolor.substr(2, 2), 16);
    const b = parseInt(hexcolor.substr(4, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
  }

  imprimir() {
    let ev: any[];
    this.cs.mostraCarregador();
    this.sub.push(this.cl.imprimir(
      this.fc.getApi().view.currentStart.toISOString(),
      this.fc.getApi().view.currentEnd.toISOString())
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          ev = dados;
        },
        error: err => {
          this.cs.escondeCarregador();
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
            this.cs.escondeCarregador();
            this.messageService.add({
              key: 'calToast',
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

  imprimir2() {  }

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
    autoTable(doc, { html: vfc[0] });

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
      this.cl.calBusca.bsTitulo = this.bsTitulo ? this.bsTitulo.length > 0 ?  this.bsTitulo : null : null;
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
      this.headerStart = 'prevYear,prev,today,next,nextYear,btnBusca1';
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
    d = d ? d : new DateTime();
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

  resetForm() {
    this.cl.limpaFormulario();
    this.limpaFormulario();
  }

  fecharBusca() {
    this.mostraMenu = false;
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
