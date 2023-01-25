import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppConfig } from '../_models/appconfig';
import { AppConfigService } from "../_services/appconfigservice";


declare let gtag: Function;

@Component({
  selector: 'apmain-config2',
  styleUrls: ['./main-config.component.css'],
  templateUrl: './main-config.component2.html',
})
export class MainConfigComponent2 implements OnInit {
    menuActive: boolean;

    config: AppConfig;

    news_key = 'primenews';

    theme = "lara-light-blue";

    public subscription: Subscription;

    constructor(private configService: AppConfigService) {}

    ngOnInit() {
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(config => {
            this.config = config;
        });

    }

    onMenuButtonClick() {
        this.menuActive = true;
        this.addClass(document.body, 'blocked-scroll');
    }

    onMaskClick() {
        this.hideMenu();
    }

    hideMenu() {
        this.menuActive = false;
        this.removeClass(document.body, 'blocked-scroll');
    }

    addClass(element: any, className: string) {
        if (element.classList)
            element.classList.add(className);
        else
            element.className += ' ' + className;
    }

    removeClass(element: any, className: string) {
        if (element.classList)
            element.classList.remove(className);
        else
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    isDarkTheme(theme) {
        return theme.indexOf('dark') !== -1 || theme.indexOf('vela') !== -1 || theme.indexOf('arya') !== -1 || theme.indexOf('luna') !== -1;
    }

    applyScale(scale: number) {
        document.documentElement.style.fontSize = scale + 'px';
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}

