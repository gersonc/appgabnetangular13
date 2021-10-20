import { Component, OnInit } from '@angular/core';
import { MostraMenuService } from '../../_services';
import { SolicitacaoBuscarService } from '../_services';

@Component({
  selector: 'app-solicitacao-listar',
  templateUrl: './solicitacao-listar.component.html',
  styleUrls: ['./solicitacao-listar.component.css']
})
export class SolicitacaoListarComponent implements OnInit {
  public altura = (window.innerHeight - 170) + 'px';
  public contaSBS = 0;

  constructor(
    public mm: MostraMenuService,
    private sbs: SolicitacaoBuscarService
  ) {
    this.sbs.criarSolicitacaoBusca();
    if (!sessionStorage.getItem('solicitacao-busca')) {
      this.sbs.buscaStateSN = false;
      this.mm.mudaMenu(true);
    } else {
      if (this.sbs.buscaStateSN) {
        this.mm.mudaMenu(false);
      } else {
        this.mm.mudaMenu(true);
      }
    }
  }

  ngOnInit() {
    this.sbs.busca$.subscribe(
      () => {
        this.contaSBS++;
      }
    );
  }

  onHide() {
    this.mm.mudaMenu(false);
  }

}
