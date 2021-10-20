import {Component, OnDestroy, OnInit} from '@angular/core';
import { MostraMenuService } from '../_services';
import { SolicitacaoBuscarService } from './_services';
import { ArquivoService } from '../arquivo/_services';
import { CarregadorService } from '../_services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-solicitacao',
  templateUrl: './solicitacao.component.html',
  styleUrls: ['./solicitacao.component.css']
})
export class SolicitacaoComponent implements OnInit, OnDestroy {
  public altura = (window.innerHeight) + 'px';
  mostra = false;
  sub: Subscription[] = [];

  constructor(
    public mm: MostraMenuService,
    private sbs: SolicitacaoBuscarService,
    private as: ArquivoService,
    private cs: CarregadorService
  ) {  }

  ngOnInit() {
    this.as.getPermissoes();
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

  onHide() {
    this.mm.mudaMenu(false);
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
