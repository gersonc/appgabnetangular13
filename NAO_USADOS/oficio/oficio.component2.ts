import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuInternoService } from '../_services';
import { OficioBuscaService } from './_services';
import { ArquivoService } from '../arquivo/_services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-oficio',
  templateUrl: './oficio.component.html',
  styleUrls: ['./oficio.component.css']
})
export class OficioComponent implements OnInit, OnDestroy {
  public altura = (window.innerHeight) + 'px';
  public mostraMenuInterno = false;
  sub: Subscription[] = [];

  constructor(
    public mi: MenuInternoService,
    private obs: OficioBuscaService,
    private as: ArquivoService
  ) { }

  ngOnInit() {
    this.sub.push(this.mi.mostraInternoMenu().subscribe(
      vf => {
        this.mostraMenuInterno = vf;
      })
    );
    this.as.getPermissoes();
    this.obs.criarOficioBusca();
    if (!sessionStorage.getItem('oficio-busca')) {
      this.obs.buscaStateSN = false;
      this.mi.mudaMenuInterno(true);
    } else {
      if (this.obs.buscaStateSN) {
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
