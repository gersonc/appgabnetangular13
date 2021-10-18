import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuService } from '../_service';
import {AuthenticationService, CarregadorService} from '../../_services';


@Component({
  selector: 'app-panelmenu',
  templateUrl: './panelmenu.component.html',
  styleUrls: ['./panelmenu.component.css']
})
export class PanelmenuComponent implements OnInit {
  public items!: MenuItem[];
  private vf?: boolean;

  constructor(
    private cs: CarregadorService,
    private menuService: MenuService,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.items = this.menuService.itens;
  }

}
