import { Component, OnInit } from '@angular/core';
import { MostraMenuService } from '../_services';
import { ArquivoService } from '../arquivo/_services';
import { ProposicaoBuscaService } from './_services';

@Component({
  selector: 'app-proposicao',
  templateUrl: './proposicao.component.html',
  styleUrls: ['./proposicao.component.css']
})
export class ProposicaoComponent implements OnInit {
  public altura = (window.innerHeight - 170) + 'px';

  constructor(
    public mm: MostraMenuService,
    private as: ArquivoService,
    private pbs: ProposicaoBuscaService
  ) { }

  ngOnInit() {
    console.log('proposicao1');
    this.as.getPermissoes();
    this.pbs.criarProposicaoBusca();
    if (!sessionStorage.getItem('proposicao-busca')) {
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

}
