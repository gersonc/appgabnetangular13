import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ProceListarI} from "../_model/proce-listar-i";
import {AuthenticationService} from "../../_services";
import {ProceService} from "../_services/proce.service";
import {Stripslashes} from "../../shared/functions/stripslashes";
import {ProceOficioI} from "../_model/proc-i";

@Component({
  selector: 'app-proce-oficio-listagem',
  templateUrl: './proce-oficio-listagem.component.html',
  styleUrls: ['./proce-oficio-listagem.component.css']
})
export class ProceOficioListagemComponent implements OnInit {
  @ViewChild('detprocesso', {static: false}) el!: ElementRef;
  @ViewChild('detalheoficio', {static: false}) detalheoficio: ElementRef;
  @Input() oficios: ProceOficioI[];
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

  stripslashes(str?: string): string | null {
    return Stripslashes(str)
  }

}
