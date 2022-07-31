import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuInternoService } from '../_services';
import { ArquivoService } from '../arquivo/_services';
import { Subscription } from "rxjs";
import {ProposicaoService} from "./_services/proposicao.service";

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
    private ps: ProposicaoService
  ) { }

  ngOnInit() {
    this.sub.push(this.mi.mostraInternoMenu().subscribe(
      vf => {
        this.mostraMenuInterno = vf;
      })
    );
    this.as.getPermissoes();
    if (!sessionStorage.getItem('proposicao-busca')) {
      this.mi.mudaMenuInterno(true);
    } else {
      if (this.ps.stateSN) {
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
    this.ps.onDestroy();
    this.sub.forEach(s => s.unsubscribe());
  }
}
