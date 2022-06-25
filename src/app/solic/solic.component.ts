import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {MenuInternoService} from "../_services";
import {ArquivoService} from "../arquivo/_services";
import {SolicService} from "./_services/solic.service";

@Component({
  selector: 'app-solic',
  templateUrl: './solic.component.html',
  styleUrls: ['./solic.component.css']
})
export class SolicComponent implements OnInit, OnDestroy {
  public altura = (window.innerHeight) + 'px';
  sub: Subscription[] = [];
  public mostraMenuInterno = false;

  constructor(
    public mi: MenuInternoService,
    private ss: SolicService,
    private as: ArquivoService,
  ) { }

  ngOnInit() {
    // this.ss.carregaTitulos();
    this.sub.push(this.mi.mostraInternoMenu().subscribe(
      vf => {
        this.mostraMenuInterno = vf;
      })
    );
    this.as.getPermissoes();
    if (!sessionStorage.getItem('solic-busca')) {
      this.mi.mudaMenuInterno(true);
    } else {
      if (this.ss.stateSN) {
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
    this.ss.onDestroy();
    this.sub.forEach(s => s.unsubscribe());
  }
}
