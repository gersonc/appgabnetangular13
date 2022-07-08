
import {Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter} from '@angular/core';
import { AuthenticationService } from '../../_services';
import {ProceListarI} from "../_model/proce-listar-i";
import {ProceService} from "../_services/proce.service";


@Component({
  selector: 'app-proce-detalhe',
  templateUrl: './proce-detalhe.component.html',
  styleUrls: ['./proce-detalhe.component.css']
})
export class ProceDetalheComponent implements OnInit {
  @ViewChild('detprocesso', {static: false}) el!: ElementRef;
  @ViewChild('detalheprocesso', {static: false}) detalheprocesso: ElementRef;
  @Input() pro: ProceListarI;
  @Output() hideDetalhe = new EventEmitter<boolean>();

  impressao = false;

  constructor(
    public aut: AuthenticationService,
    public ps: ProceService,

  ) { }

  ngOnInit() {
  }

  fechar() {
    this.hideDetalhe.emit(true);
  }

}
