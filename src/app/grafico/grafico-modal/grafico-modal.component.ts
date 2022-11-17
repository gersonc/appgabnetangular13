import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GraficoService} from "../_services/grafico.service";

@Component({
  selector: 'app-grafico-modal',
  templateUrl: './grafico-modal.component.html',
  styleUrls: ['./grafico-modal.component.css']
})
export class GraficoModalComponent implements OnInit {
  @Output() hideGrafico = new EventEmitter<boolean>();
  @Input() busca: any;
  @Input() modulo: string;
  showMenu = true;
  showGrafico = false;

  constructor(
    public gs: GraficoService,
  ) { }

  ngOnInit(): void {
  }

  mostraMenu(): void {
    this.showMenu = !this.showMenu;
  }

  escondeGrafico() {

  }

}
