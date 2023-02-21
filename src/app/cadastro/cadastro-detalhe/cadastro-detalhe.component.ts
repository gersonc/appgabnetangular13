import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CadastroI, CadastroVinculosI} from "../_models/cadastro-i";
import {AuthenticationService} from "../../_services";
import {Stripslashes} from "../../shared/functions/stripslashes";


@Component({
  selector: 'app-cadastro-detalhe',
  templateUrl: './cadastro-detalhe.component.html',
  styleUrls: ['./cadastro-detalhe.component.css']
})
export class CadastroDetalheComponent implements OnInit {
  @Input() cadastro: CadastroI;
  @Input() cadVin?: CadastroVinculosI | null = null;
  @Input() completo?: boolean = false;
  @Output() hideDetalhe = new EventEmitter<boolean>();

  impressao = false;
  pdfOnOff = true;


  constructor(
    public aut: AuthenticationService,
  ) { }

  ngOnInit(): void {
  }

  fechar() {
    this.hideDetalhe.emit(true);
  }

  stripslashes(str?: string): string | null {
    return Stripslashes(str)
  }

  rowColor(vl1: number): string | null {
    return (typeof vl1 === 'undefined' || vl1 === null || vl1 === 0) ? 'status-0' : 'status-' + vl1;
  }

  rowColor2(vl1: number): string | null {
      switch (vl1) {
        case 0:
          return 'status-1';
        case 1:
          return 'status-3';
        case 2:
          return 'status-2';
        default:
          return 'status-1';
      }
  }

  onImprimir(ev: boolean) {
    this.impressao = ev;
  }


}
