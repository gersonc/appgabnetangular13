import { Component, ElementRef, OnInit } from "@angular/core";
import { Subscription } from 'rxjs';
import { AppConfig } from '../_models/appconfig';
import { AppConfigService } from "../_services/appconfigservice";
import { DomHandler } from "primeng/dom";


declare let gtag: Function;

@Component({
  selector: 'apmain-config',
  styleUrls: ['./main-config.component.css'],
  templateUrl: './main-config.component.html',
})
export class MainConfigComponent implements OnInit {

  active: boolean;

  scale = 14;
  scales: number[] = [12,13,14,15,16];

  outsideClickListener: any;


    menuActive: boolean;

    config: AppConfig;

    news_key = 'primenews';

    theme = "lara-light-blue";

    public subscription: Subscription;

    constructor(
      private configService: AppConfigService,
      private el: ElementRef,
      ) {}

    ngOnInit() {
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(config => {
            this.config = config;
          if (this.config.theme === 'nano') {
            this.scale = 12;
          } else {
            if (this.config.scale !== undefined) {
              this.scale = this.config.scale;
            } else {
              this.scale = 14;
            }
          }
          this.onRippleChange();
          this.applyScale();
        });
      if (this.config.theme === 'nano'){
        this.scale = 12;
      }

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

















  toggleConfigurator(event: Event) {
    this.active = !this.active;
    event.preventDefault();

    if (this.active)
      this.bindOutsideClickListener();
    else
      this.unbindOutsideClickListener();
  }

  hideConfigurator(event) {
    this.active = false;
    this.unbindOutsideClickListener();
    event.preventDefault();
  }

  changeTheme(event: Event, theme: string, dark: boolean) {
    this.configService.updateConfig({...this.config, ...{theme, dark}});
    event.preventDefault();
  }

  onRippleChange() {
    this.configService.updateConfig(this.config);
    if (this.config.ripple)
      DomHandler.removeClass(document.body, 'p-ripple-disabled');
    else
      DomHandler.addClass(document.body, 'p-ripple-disabled');
  }

  bindOutsideClickListener() {
    if (!this.outsideClickListener) {
      this.outsideClickListener = (event) => {
        if (this.active && this.isOutsideClicked(event)) {
          this.active = false;
        }
      };
      document.addEventListener('click', this.outsideClickListener);
    }
  }

  unbindOutsideClickListener() {
    if (this.outsideClickListener) {
      document.removeEventListener('click', this.outsideClickListener);
      this.outsideClickListener = null;
    }
  }

  isOutsideClicked(event) {
    return !(this.el.nativeElement.isSameNode(event.target) || this.el.nativeElement.contains(event.target));
  }

  decrementScale() {
    this.scale--;
    this.applyScale();
  }

  incrementScale() {
    this.scale++;
    this.applyScale();
  }

  applyScale() {
    document.documentElement.style.fontSize = this.scale + 'px';
  }

  toggleDarkMode() {
    this.config.dark = !this.config.dark;

    let theme = this.config.theme;
    theme = this.config.dark
      ? theme.replace("light", "dark")
      : theme.replace("dark", "light");
    this.config = { ...this.config, dark: this.config.dark, theme: theme };

    this.configService.updateConfig(this.config);
    // this.changeTableTheme(theme);
  }





























    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}

