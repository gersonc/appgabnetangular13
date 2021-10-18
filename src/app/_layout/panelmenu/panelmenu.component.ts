import {Component, Input, OnChanges, OnDestroy, SimpleChanges, OnInit} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuService } from '../_service';
import { AuthenticationService, CarregadorService } from '../../_services';
import {Subscription} from "rxjs";


@Component({
  selector: 'app-panelmenu',
  templateUrl: './panelmenu.component.html',
  styleUrls: ['./panelmenu.component.css']
})
export class PanelmenuComponent implements OnInit, OnChanges, OnDestroy {
  @Input() mostra = false;
  public items!: MenuItem[];
  private vf?: boolean;
  private sub: Subscription[] = [];
  changeLog: string[] = [];

  constructor(
    private cs: CarregadorService,
    private menuService: MenuService,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      const chng = changes[propName];
      const cur  = JSON.stringify(chng.currentValue);
      const prev = JSON.stringify(chng.previousValue);
      this.changeLog.push(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
      console.log(this.changeLog);
    }
  }

  ngOnInit(): void {
    this.items = this.menuService.itens;
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => {
      s.unsubscribe();
    });
  }

}
