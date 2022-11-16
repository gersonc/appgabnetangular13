import {Component, OnDestroy, OnInit} from '@angular/core';
import {MenuInternoService} from "../_services";
import {Subscription} from "rxjs";
import {WindowsService} from "../_layout/_service";

@Component({
  selector: 'app-grafico',
  templateUrl: './grafico.component.html',
  styleUrls: ['./grafico.component.css']
})
export class GraficoComponent implements OnInit , OnDestroy {
  public altura = WindowsService.getMain().altura + 'px'
  sub: Subscription[] = [];
  mostraMenuInterno = false;

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

  mostraMenu(): void {
    this.mi.mudaMenuInterno();
  }

  onHide() {
    this.mi.mudaMenuInterno(false);
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }
}
