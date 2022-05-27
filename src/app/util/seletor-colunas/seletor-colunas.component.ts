import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {ColunasI} from "../../_models/colunas-i";
import {WindowsService} from "../../_layout/_service";
@Component({
  selector: 'app-seletor-colunas',
  templateUrl: './seletor-colunas.component.html',
  styleUrls: ['./seletor-colunas.component.css']
})
export class SeletorColunasComponent implements OnInit {
  @Input() todas: ColunasI[] = [];
  @Input() ativas!: ColunasI[];
  @Output() ativasChange = new EventEmitter<ColunasI[]>();

  disponiveis: ColunasI[] = [];
  altura = `${(WindowsService.altura - 210) / 2}` + 'px';

  constructor() { }

  ngOnInit(): void {
    const a: string[] = this.ativas.map( b => b.field);
    const t: string[] = this.todas.map( c => c.field);
    this.todas.forEach(d => {
      if (a.indexOf(d.field) === -1) {
        this.disponiveis.push(d);
      }
    });
    this.ativasChange.emit(this.ativas);
  }


}
