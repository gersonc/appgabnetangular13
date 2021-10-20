import { Component, OnInit } from '@angular/core';
import { MostraMenuService } from '../_services';
import { TarefaBuscaService } from './_services';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-tarefa',
  templateUrl: './tarefa.component.html',
  styleUrls: ['./tarefa.component.css'],
  providers: [ DialogService ]
})
export class TarefaComponent implements OnInit {
  public altura = (window.innerHeight - 170) + 'px';

  constructor(
    public mm: MostraMenuService,
    private tbs: TarefaBuscaService,
    public dialogService: DialogService,
  ) { }

  ngOnInit() {
    this.tbs.criarTarefaBusca();
    if (!sessionStorage.getItem('tarefa-busca')) {
      this.tbs.buscaStateSN = false;
      this.mm.mudaMenu(true);
    } else {
      if (this.tbs.buscaStateSN) {
        this.mm.mudaMenu(false);
      } else {
        this.mm.mudaMenu(true);
      }
    }
  }

  onHide() {
    this.mm.mudaMenu(false);
  }
}
