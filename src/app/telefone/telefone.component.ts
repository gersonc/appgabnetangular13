import {Component, OnDestroy, OnInit} from '@angular/core';
import {MenuInternoService} from '../_services';
import {Subscription} from "rxjs";
import {ArquivoService} from "../arquivo/_services";
import {TelefoneService} from "./_services/telefone.service";

@Component({
  selector: 'app-telefone',
  templateUrl: './telefone.component.html',
  styleUrls: ['./telefone.component.css']
})
export class TelefoneComponent implements OnInit, OnDestroy {
  public altura = (window.innerHeight) + 'px';
  public mostraMenuInterno = false;
  sub: Subscription[] = [];

  constructor(
    public mi: MenuInternoService,
    private as: ArquivoService,
    private ts: TelefoneService,
  ) {
  }

  ngOnInit() {
    this.sub.push(this.mi.mostraInternoMenu().subscribe(
      vf => {
        this.mostraMenuInterno = vf;
      })
    );
    this.as.getPermissoes();
    if (!sessionStorage.getItem('telefone-busca')) {
      this.mi.mudaMenuInterno(true);
    } else {
      if (this.ts.stateSN) {
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
    this.ts.onDestroy();
    this.sub.forEach(s => s.unsubscribe());
  }

}
