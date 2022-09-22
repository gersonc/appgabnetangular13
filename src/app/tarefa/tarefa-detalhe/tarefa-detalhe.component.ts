import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {TarefaI, TarefaUsuarioSituacaoAndamentoI} from "../_models/tarefa-i";
import {striptags} from "striptags";
import {Stripslashes} from "../../shared/functions/stripslashes";
import jsPDF from 'jspdf'
import {applyPlugin, autoTable, ColumnInput, UserOptions } from 'jspdf-autotable';
import {AuthenticationService} from "../../_services";

applyPlugin(jsPDF);

interface jsPDFCustom extends jsPDF {
  autoTable: (options: UserOptions) => void;
}

interface TarefaHistoricoI2 {
  th_id?: number;
  th_tarefa_id?: number;
  th_data?: string;
  th_data2?: string;
  th_data3?: Date;
  th_usuario_id?: number;
  th_usuario_nome?: string;
  th_historico?: string;
  th_historico_delta?: string;
  th_historico_texto?: string;
  usuarioSn?: boolean;
  situacao_id?: number;
}

@Component({
  selector: 'app-tarefa-detalhe',
  templateUrl: './tarefa-detalhe.component.html',
  styleUrls: ['./tarefa-detalhe.component.css']
})

export class TarefaDetalheComponent implements OnInit {
  @Input() tarefa: TarefaI;
  @Output() hideDetalhe = new EventEmitter<boolean>();
  @Output() gerarPdf = new EventEmitter<TarefaI>();
  @Output() onImprimir = new EventEmitter<TarefaI>();

  pdfOnOff = true;
  constructor(public aut: AuthenticationService) {
  }

  ngOnInit(): void {
    console.log('detalhe', this.tarefa);
  }


  rowColor(vl1: number): string {
    switch (vl1) {
      case 1:
        return '#f69ebc';
      case 2:
        return '#fde4a5';
      case 3:
        return '#b2ddb4';
      default:
        return '#ffffff';
    }
  }

  fcor(vl1: number): string | null {
        switch (vl1) {
          case 1:
            return 'tstatus-1';
          case 2:
            return 'tstatus-2';
          case 3:
            return 'tstatus-3';
          case 4:
            return 'tstatus-4';
          default:
            return 'tstatus-0';
        }
  }

  fechar() {
    this.hideDetalhe.emit(true);
  }

  stripslashes(str?: string): string | null {
    return Stripslashes(str)
  }

  imprimir(tarefa: TarefaI) {
    this.onImprimir.emit(tarefa);
  }

  getPdf(tarefa: TarefaI) {
    this.gerarPdf.emit(tarefa);
  }



}
