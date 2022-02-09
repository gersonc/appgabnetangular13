import {Component, OnDestroy, OnInit} from '@angular/core';
import { MenuInternoService } from '../_services';
import { PassagemBuscaService } from './_services';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-passagem',
  templateUrl: './passagem.component.html',
  styleUrls: ['./passagem.component.css']
})
export class PassagemComponent implements OnInit, OnDestroy {
  public altura = (window.innerHeight) + 'px';
  sub: Subscription[] = [];
  public mostraMenuInterno = false;

  constructor(
    public mi: MenuInternoService,
    private tbs: PassagemBuscaService
  ) { }

  ngOnInit() {
    this.sub.push(this.mi.mostraInternoMenu().subscribe(
      vf => {
        this.mostraMenuInterno = vf;
      })
    );
    this.tbs.criarPassagemBusca();
    if (!sessionStorage.getItem('passagem-busca')) {
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

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }
}
