import { Component, OnInit } from '@angular/core';
import { MostraMenuService } from '../../_services';
import { ProcessoBuscaService } from '../_services';
import { Subscription } from 'rxjs';
import {CarregadorService} from '../../_services';

@Component({
  selector: 'app-processo-listar',
  templateUrl: './processo-listar.component.html',
  styleUrls: ['./processo-listar.component.css']
})
export class ProcessoListarComponent implements OnInit {
  public altura = (window.innerHeight - 170) + 'px';
  mostra = false;
  sub: Subscription[] = [];


  constructor(
    public mm: MostraMenuService,
    private pbs: ProcessoBuscaService,
    private cs: CarregadorService
  ) {  }

  ngOnInit() {
    this.pbs.criarProcessoBusca();
    if (!sessionStorage.getItem('processo-busca')) {
      this.pbs.buscaStateSN = false;
      this.mm.mudaMenu(true);
    } else {
      if (this.pbs.buscaStateSN) {
        this.mm.mudaMenu(false);
      } else {
        this.mm.mudaMenu(true);
      }
    }
  }

  onHide() {
    this.mm.mudaMenu(false);
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
