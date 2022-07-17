import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthenticationService, CarregadorService } from '../../_services';
import {EventoInterface} from "../_models/evento-interface";
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { saveAs } from 'file-saver';

import * as jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {CalendarioService} from "../_services/calendario.service";


declare interface ColumnsInterface {
  header: string;
  dataKey: string;
}
@Component({
  selector: 'app-calendario-exibir',
  templateUrl: './calendario-exibir.component.html',
  styleUrls: ['./calendario-exibir.component.css']
})
export class CalendarioExibirComponent2 implements OnInit, OnDestroy {
  @ViewChild('tabcalendario', { static: true }) tabcalendario: ElementRef;

  ev: EventoInterface = null ;
  evento: EventoInterface = null ;
  eve: any = null;

  scrollPanelStyle = 'detalhefull';
  tituloEstilo: {};
  subTituloStyle: {};
  observacaoStyle: {};
  headerStyle = 'var(--primary-color)';
  prioridadeStyle: {};
  prioridade: string = null;
  prioridadeBgColor: string = null;
  prioridadeColor: string = null;
  calendarioStatusStyle: {};
  calendarioStatus: string = null;
  calendarioStatusBgColor: string = null;
  calendarioStatusColor: string = null;
  tipoStyle: {};
  tipo: string = null;
  tipoBgColor: string = null;
  tipoColor: string = null;

  sub: Subscription[] = [];
  resp: any[];
  mostra = false;
  mostrabts = true;
  ddunico: SelectItem[];
  unico: string = null;
  startStr: string = null;
  endStr: string = null;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public authenticationService: AuthenticationService,
    public cl: CalendarioService

) { }

  ngOnInit(): void {
    this.ddunico = [
      {label: 'TODAS', value: 'n'},
      {label: 'ATUAL', value: 's'}
    ];
    this.carregaDados();
  }

  carregaDados() {
    this.ev = this.config.data.ev;
    this.startStr = this.config.data.startStr;
    this.endStr = this.config.data.endStr;
    this.mostrabts = this.config.data.mostrabts;
    this.criaEvento();
  }

  criaEvento() {
    this.prioridadeStyle = null;
    this.prioridade = null;
    this.prioridadeBgColor = null;
    this.prioridadeColor = null;
    this.calendarioStatusStyle = null;
    this.calendarioStatus = null;
    this.calendarioStatusBgColor = null;
    this.calendarioStatusColor = null;
    this.tipoStyle = null;
    this.tipo = null;
    this.tipoBgColor = null;
    this.tipoColor = null;
    if (this.ev.backgroundColor === 'var(--ativo)') {
      this.ev.backgroundColor = 'var(--primary-color)';
    }

    this.tituloEstilo = {
      padding: '0 5px 0 5px',
      backgroundColor: this.ev.backgroundColor,
      color: this.ev.textColor,
      fontSize: '1.2em',
      fontWeight: 500,
      textAlign: 'left',
      borderRadius: '5px'
    };
    this.subTituloStyle = {
      padding: '0 5px 0 5px',
      backgroundColor: this.ev.backgroundColor,
      color: this.ev.textColor,
      fontSize: '1.2em',
      opacity: .8,
      fontWeight: 400,
      borderRadius: '5px'
    };

    if (this.ev.prioridade_id) {
      if (this.ev.prioridade_id > 1) {
        this.prioridade = this.ev.prioridade_nome;
        if (this.ev.prioridade_color) {
          this.prioridadeBgColor = this.ev.prioridade_color;
          this.prioridadeColor = this.getContrastYIQ(this.ev.prioridade_color);
          this.prioridadeStyle = {
            padding: '0 5px 0 5px',
            backgroundColor: this.prioridadeBgColor,
            color: this.prioridadeColor,
            opacity: .8,
            fontWeight: 500
          };
        } else {
          this.prioridadeStyle = this.subTituloStyle;
        }
      }
    }

    if (this.ev.calendario_status_id) {
      if (this.ev.calendario_status_id > 1) {
        this.calendarioStatus = this.ev.calendario_status_nome;
        if (this.ev.calendario_status_color) {
          this.calendarioStatusBgColor = this.ev.calendario_status_color;
          this.calendarioStatusColor = this.getContrastYIQ(this.ev.calendario_status_color);
          this.calendarioStatusStyle = {
            padding: '0 5px 0 5px',
            backgroundColor: this.calendarioStatusBgColor,
            color: this.calendarioStatusColor,
            // opacity: .8,
            fontWeight: 500
          };
        } else {
          this.calendarioStatusStyle = this.subTituloStyle;
        }
      }
    }

    if (this.ev.type_id) {
      if (this.ev.type_id > 1) {
        this.tipo = this.ev.type_name;
        if (this.ev.type_color) {
          this.tipoBgColor = this.ev.type_color;
          this.tipoColor = this.getContrastYIQ(this.ev.type_color);
          this.tipoStyle = {
            padding: '0 5px 0 5px',
            backgroundColor: this.tipoBgColor,
            color: this.prioridadeColor,
            opacity: .8,
            fontWeight: 500
          };
        } else {
          this.tipoStyle = this.subTituloStyle;
        }
      }
    }

    this.observacaoStyle = {
      padding: '0 5px 0 5px',
      backgroundColor: 'var(--claro)'
    };

  }

  getContrastYIQ(hexcolor) {
    hexcolor = hexcolor.replace('#', '');
    const r = parseInt(hexcolor.substr(0, 2), 16);
    const g = parseInt(hexcolor.substr(2, 2), 16);
    const b = parseInt(hexcolor.substr(4, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
  }

  getPdf (imprimir = false) {

    const fileName = `calendario_${new Date().getTime()}.pdf`;

    // @ts-ignore
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
    autoTable(doc, {
      startY: 20,
      html: this.tabcalendario.nativeElement
    });

    setTimeout(() => {
      if (imprimir === false) {
        doc.save(fileName);
      } else {
        doc.autoPrint();
        window.open(doc.output('bloburl'));
      }
    }, 500);


  }

  fechar() {
    this.ref.close ();
  }

  editar() {
    this.ref.close ('editar');
  }

  excluir() {
    this.ref.close ('apagar');
  }

  exportar() {
    if (this.ev.recorrente) {
      this.mostra = true;
    } else {
      this.exportaIcs();
    }
  }

  exportaIcs() {
    let inicio = null;
    let fim = null;
    if (this.unico) {
      inicio = this.startStr ? this.startStr : null;
      fim = this.endStr ? this.endStr : null;
    }

    const nome = 'GabNet_' + this.ev.id + '_' + this.startStr.replace(':', '-').replace('.', '_') + '.ics';

    this.sub.push(this.cl.eventoGetIcs(+this.ev.id, this.unico, inicio, fim)
      .pipe(take(1))
      .subscribe({
        next: (ar) => {
          const file = new File([ar], nome, { type: 'text/calendar' });
          saveAs(file);
        },
        error: err => {
          console.error(err.toString());
          // this.mostraSpinner.next( false);
        },
        complete: () => {
          // this.mostraSpinner.next( false);
          console.log('fim');
        }
      })
    );
  }

  mudaUnico(evt) {
    this.unico = evt.value;
    this.exportaIcs();
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
