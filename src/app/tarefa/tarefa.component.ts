import { Component, OnInit } from '@angular/core';
import {MenuInternoService, MostraMenuService} from '../_services';
import { TarefaBuscaService } from './_services';
import { DialogService } from 'primeng/dynamicdialog';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-tarefa',
  templateUrl: './tarefa.component.html',
  styleUrls: ['./tarefa.component.css'],
  providers: [ DialogService ]
})
export class TarefaComponent implements OnInit {
  public altura = (window.innerHeight - 170) + 'px';
  sub: Subscription[] = [];
  public mostraMenuInterno = false;

  constructor(
    // public mm: MostraMenuService,
    public mi: MenuInternoService,
    private tbs: TarefaBuscaService
  ) { }

  ngOnInit() {
    this.tbs.criarTarefaBusca();
    if (!sessionStorage.getItem('tarefa-busca')) {
      this.tbs.buscaStateSN = false;
      this.mi.mudaMenuInterno(true);
    } else {
      if (this.tbs.buscaStateSN) {
        this.mi.mudaMenuInterno(false);
      } else {
        this.mi.mudaMenuInterno(true);
      }
    }
  }

  onHide() {
    this.mi.mudaMenuInterno(false);
  }
}
