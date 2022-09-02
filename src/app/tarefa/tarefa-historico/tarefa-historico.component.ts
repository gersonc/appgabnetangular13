import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TarefaHistoricoI} from "../_models/tarefa-historico-i";

@Component({
  selector: 'app-tarefa-historico',
  templateUrl: './tarefa-historico.component.html',
  styleUrls: ['./tarefa-historico.component.css']
})
export class TarefaHistoricoComponent implements OnInit {
  @Input() tah: TarefaHistoricoI[] = [];
  @Input() exibirh: boolean;
  @Output() exibirhChange = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

}
