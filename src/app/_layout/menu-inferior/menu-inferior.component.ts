import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuService } from '../_service';

@Component({
  selector: 'app-menu-inferior',
  templateUrl: './menu-inferior.component.html',
  styleUrls: ['./menu-inferior.component.css']
})
export class MenuInferiorComponent implements OnInit {

  public menuAtivo = false;
  public items: MenuItem[];
  public largura?: number;

  constructor (private menuService: MenuService) {
    this.items = menuService.itens;
  }

  ngOnInit() {
  }

}
