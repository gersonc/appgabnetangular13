import { Component, ElementRef, OnDestroy, OnInit } from "@angular/core";
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
export class MainConfigComponent implements OnInit, OnDestroy {

  active: boolean;

  scale = 14;
  scales: number[] = [12,13,14,15,16];

  outsideClickListener: any;

    scaleVF = false;

    menuActive: boolean;

    config: AppConfig = {
      theme: "lara-light-blue",
      dark: false,
      ripple: true,
      scale: '14px'
    };

    news_key = 'primenews';

    theme = "lara-light-blue";

    public subscription: Subscription;

    constructor(
      private configService: AppConfigService,
      private el: ElementRef,
      ) {
      // this.scale = +this.configService.config.scale.replace('px','');
    }

    /*ngOnInit() {
      console.log('SCALE1------->',this.config);
      this.config = this.configService.config;
      this.scale = +this.configService.config.scale.replace('px','');
      this.applyScale(this.configService.config.scale);
      console.log('SCALE2------->',this.config);
        this.subscription = this.configService.configUpdate$.subscribe(config => {
          console.log('SCALE33333------->',this.config);
          console.log('SCALE3------->',config);
            // this.config = config;
          if (this.config.theme !== 'nano' && config.theme === 'nano') {
            this.config.scale = '12px';
            this.config.theme = 'nano';
            if (this.scale !== 12) {
              this.scale = 12;
              this.applyScale('12px');
            }
          } else {
            if (config.scale !== undefined) {
              const n: number = +config.scale.replace('px','');
              console.log('SCALE444------->',config.scale, this.config.scale);
              if (config.scale !== this.config.scale) {
                this.config.scale = config.scale;
                console.log('SCALE4------->',config.scale);
                // this.scale = n;
                this.applyScale(config.scale);
              }
            }/!* else {
              console.log('SCALE5------->',this.config);
              this.scale = 14;
              this.config.scale = '14px';
              this.applyScale('14px');
            }*!/
          }
        });
      if (this.config.theme === 'nano'){
        if (this.scale !== 12) {
          console.log('SCALE6------->',this.config.theme);
          // this.config.scale = '12px';
          this.scale = 12;
          this.applyScale('12px');
        }
      }

    }*/

  ngOnInit() {
        this.subscription = this.configService.configUpdate$.subscribe(config => {
          // this.config = config;
          this.scaleVF = true;
          if (config.theme === 'nano') {
            if (this.scale !== 12) {
              this.scale = 12;
              this.applyScale('12px');
            }
          } else {
            if (config.scale !== undefined && this.scale !== +config.scale.replace('px','')) {
              this.scale =  +config.scale.replace('px','');
              this.applyScale(config.scale);
            }
          }
          if (config.theme !== this.config.theme) {
            this.changeTheme2(config.theme, config.dark);
          }






        });



    }

  decrementScale() {
    this.scale--;
    const s: string = this.scale + 'px';
    this.applyScale(s);
    this.configService.setScale(s);
    this.scaleVF = false;
  }

  incrementScale() {
    this.scale++;
    const s: string = this.scale + 'px';
    this.applyScale(s);
    this.configService.setScale(s);
    this.scaleVF = false;
  }

  applyScale(s: string) {
    document.documentElement.style.fontSize = s;
  }

  changeTheme(event: Event, theme: string, dark: boolean) {
    this.changeTheme2(theme, dark);
    event.preventDefault();
  }

  changeTheme2(theme: string, dark: boolean) {
    const linkElement = document.getElementById('theme-link');
    this.replaceLink(linkElement, theme);
    //this.configService.updateConfig({...this.config, ...{theme, dark}});
    this.config.theme = theme;
    this.config.dark = dark;
    this.configService.setThema(theme, dark);
  }

  replaceLink(linkElement, theme) {
    console.log('replaceLink(linkElement, theme)', linkElement, theme)
    const id = linkElement.getAttribute('id');
    const cloneLinkElement = linkElement.cloneNode(true);

    cloneLinkElement.setAttribute('href', linkElement.getAttribute('href').replace(this.config.theme, theme));
    cloneLinkElement.setAttribute('id', id + '-clone');

    linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);

    cloneLinkElement.addEventListener('load', () => {
      linkElement.remove();
      cloneLinkElement.setAttribute('id', id);
    });
  }

  toggleDarkMode() {
    // this.config.dark = !this.config.dark;
    const vf: boolean =  !this.config.dark;
    let theme = vf
      ? this.config.theme.replace("light", "dark")
      : this.config.theme.replace("dark", "light");
    // this.config = { ...this.config, dark: this.config.dark, theme: theme };
    this.changeTheme2(theme, vf);

    // this.configService.setDarkMode(this.config.dark, theme);
    // this.configService.updateConfig({...this.configService.config, ...{theme: this.config.dark ? 'lara-dark-blue' : 'lara-light-blue', dark: this.config.dark}});
    // this.changeTableTheme(theme);


  }

  inputStyleChange(s: string) {
    if (s === 'filled') {
      DomHandler.addClass(document.body, 'p-input-filled');
    } else {
      DomHandler.removeClass(document.body, 'p-input-filled');
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



  onRippleChange() {
    this.configService.setRipple(this.config.ripple);
    /*this.configService.updateConfig(this.config);
    if (this.config.ripple)
      DomHandler.removeClass(document.body, 'p-ripple-disabled');
    else
      DomHandler.addClass(document.body, 'p-ripple-disabled');*/
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




/*

  toggleDarkMode2() {
    this.config.dark = !this.config.dark;
    this.configService.setDarkMode(this.config.dark, this.config.theme);
    let theme = this.config.theme;
    theme = this.config.dark
      ? theme.replace("light", "dark")
      : theme.replace("dark", "light");

    this.configService.setDarkMode(this.config.dark, theme);

    /!*this.config = { ...this.config, dark: this.config.dark, theme: theme };

    this.configService.updateConfig(this.config);*!/
    // this.changeTableTheme(theme);
  }*/





























    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}

