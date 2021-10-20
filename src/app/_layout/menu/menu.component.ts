import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AuthenticationService } from '../../_services';
import { MenuService } from '../_service';
import { MostraMenuService } from '../../_services';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  public items: MenuItem[];
  subscription!: Subscription;

  constructor (
    private menuService: MenuService,
    private authenticationService: AuthenticationService,
    ) {
    this.items = this.menuService.itens;
  }

  ngOnInit() {
  }




  changeTheme(event: Event, theme: string) {
    const themeLink: HTMLLinkElement = <HTMLLinkElement> document.getElementById('theme-css');
    themeLink.href = './assets/themes/' + theme + '/theme.css';
    console.log('themeLink->', themeLink);
    event.preventDefault();
  }

}

