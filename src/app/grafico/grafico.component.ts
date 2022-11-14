import {Component, OnDestroy, OnInit} from '@angular/core';
import {MenuInternoService} from "../_services";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-grafico',
  templateUrl: './grafico.component.html',
  styleUrls: ['./grafico.component.css']
})
export class GraficoComponent implements OnInit , OnDestroy {
  public altura = (window.innerHeight) + 'px';
  sub: Subscription[] = [];
  public mostraMenuInterno = false;

  constructor(
    public mi: MenuInternoService,
  ) { }

  ngOnInit() {

    this.sub.push(this.mi.mostraInternoMenu().subscribe(
      vf => {
        this.mostraMenuInterno = vf;
      })
    );

    this.mi.mudaMenuInterno(true);
  }

  onHide() {
    this.mi.mudaMenuInterno(false);
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }
}
