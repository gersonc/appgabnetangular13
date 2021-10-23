import {Component, OnDestroy, OnInit} from '@angular/core';
import { MenuInternoService } from '../_services';
import { SolicitacaoBuscarService } from './_services';
import { ArquivoService } from '../arquivo/_services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-solicitacao',
  templateUrl: './solicitacao.component.html',
  styleUrls: ['./solicitacao.component.css']
})
export class SolicitacaoComponent implements OnInit, OnDestroy {
  public altura = (window.innerHeight) + 'px';
  sub: Subscription[] = [];
  public mostraMenuInterno = false;

  constructor(
    public mi: MenuInternoService,
    private sbs: SolicitacaoBuscarService,
    private as: ArquivoService,
  ) {  }

  ngOnInit() {
    console.log('SOLICITACAO');
    this.sub.push(this.mi.mostraInternoMenu().subscribe(
      vf => {
        this.mostraMenuInterno = vf;
        console.log('mostraMenuInterno', this.mostraMenuInterno);
      })
    );
    this.as.getPermissoes();
    this.sbs.criarSolicitacaoBusca();
    if (!sessionStorage.getItem('solicitacao-busca')) {
      this.sbs.buscaStateSN = false;
      this.mi.mudaMenuInterno(true);
    } else {
      if (this.sbs.buscaStateSN) {
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
