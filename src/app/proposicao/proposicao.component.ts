import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuInternoService } from '../_services';
import { ArquivoService } from '../arquivo/_services';
import { ProposicaoBuscaService } from './_services';
import { Subscription } from "rxjs";

@Component({
  selector: 'app-proposicao',
  templateUrl: './proposicao.component.html',
  styleUrls: ['./proposicao.component.css']
})
export class ProposicaoComponent implements OnDestroy, OnInit {
  public altura = (window.innerHeight) + 'px';
  public mostraMenuInterno = false;
  sub: Subscription[] = [];

  constructor(
    public mi: MenuInternoService,
    private as: ArquivoService,
    private pbs: ProposicaoBuscaService
  ) { }

  ngOnInit() {
    this.sub.push(this.mi.mostraInternoMenu().subscribe(
      vf => {
        this.mostraMenuInterno = vf;
      })
    );
    this.as.getPermissoes();
    this.pbs.criarProposicaoBusca();
    if (!sessionStorage.getItem('proposicao-busca')) {
      this.pbs.buscaStateSN = false;
      this.mi.mudaMenuInterno(true);
    } else {
      if (this.pbs.buscaStateSN) {
        this.mi.mudaMenuInterno(false);
      } else {
        this.mi.mudaMenuInterno(true);
      }
    }
  }

  onHide() {
    this.mi.mudaMenuInterno(false);
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
