import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {MenuInternoService} from "../_services";
import {SolicitacaoBuscarService} from "../solicitacao/_services";
import {ArquivoService} from "../arquivo/_services";

@Component({
  selector: 'app-solicitacao-simples',
  templateUrl: './solicitacao-simples.component.html',
  styleUrls: ['./solicitacao-simples.component.css']
})
export class SolicitacaoSimplesComponent implements OnInit, OnDestroy {
  public altura = (window.innerHeight) + 'px';
  sub: Subscription[] = [];
  public mostraMenuInterno = false;

  constructor(
    public mi: MenuInternoService,
    private sbs: SolicitacaoBuscarService,
    private as: ArquivoService,
  ) { }

  ngOnInit(): void {
    this.sub.push(this.mi.mostraInternoMenu().subscribe(
      vf => {
        this.mostraMenuInterno = vf;
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
