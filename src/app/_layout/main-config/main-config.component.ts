import { Component, ElementRef, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AppConfig } from "../../_models/appconfig";
import { AppConfigService } from "../../_services/appconfigservice";
import { DomHandler } from "primeng/dom";


declare let gtag: Function;

@Component({
  selector: "apmain-config",
  styleUrls: ["./main-config.component.css"],
  templateUrl: "./main-config.component.html"
})
export class MainConfigComponent implements OnInit, OnDestroy {

  active: boolean;

  scale = 14;
  scales: number[] = [10, 11, 12, 13, 14, 15, 16, 17, 18];

  outsideClickListener: any;

  scaleVF = false;
  ripple = true;

  menuActive: boolean;

  config: AppConfig = {
    usuario_uuid: null,
    theme: "lara-light-blue",
    dark: false,
    inputStyle: "filled",
    ripple: true,
    scale: "14px",
    dispositivo: "desktop"
  };

  theme = "lara-light-blue";

  public subscription: Subscription[] = [];

  constructor(
    public configService: AppConfigService,
    private el: ElementRef
  ) { }

  ngOnInit() {
    this.subscription.push(this.configService.configUpdate$.subscribe(config => {
      this.scaleVF = true;
      if (config.theme === "nano") {
        if (this.scale !== 12) {
          this.scale = 12;
          this.applyScale("12px");
        }
      } else {
        if (config.scale !== undefined && this.scale !== +config.scale.replace("px", "")) {
          this.scale = +config.scale.replace("px", "");
          this.applyScale(config.scale);
        }
      }
      if (config.theme !== this.config.theme) {
        this.changeTheme2(config.theme, config.dark);
      }

      if (config.ripple !== this.config.ripple) {
        this.config.ripple = config.ripple;
        this.mudaRipple(config.ripple);
      }
      this.config.usuario_uuid = config.usuario_uuid;
      this.config.dark = config.dark;
      this.config.dispositivo = config.dispositivo;
      this.config.inputStyle = config.inputStyle;


    })
    );
    this.configService.getConfig();
  }

  decrementScale() {
    this.scale--;
    const s: string = this.scale + "px";
    this.applyScale(s);
    this.configService.setScale(s);
    this.scaleVF = false;
  }

  incrementScale() {
    this.scale++;
    const s: string = this.scale + "px";
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
    const linkElement = document.getElementById("theme-link");
    this.replaceLink(linkElement, theme);
    this.config.theme = theme;
    this.config.dark = dark;
    this.configService.setThema(theme, dark);
  }

  replaceLink(linkElement, theme) {
    const id = linkElement.getAttribute("id");
    const cloneLinkElement = linkElement.cloneNode(true);
    cloneLinkElement.setAttribute("href", linkElement.getAttribute("href").replace(this.config.theme, theme));
    cloneLinkElement.setAttribute("id", id + "-clone");
    linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);
    cloneLinkElement.addEventListener("load", () => {
      linkElement.remove();
      cloneLinkElement.setAttribute("id", id);
    });
  }

  toggleDarkMode() {
    const vf: boolean = !this.config.dark;
    let theme = vf
      ? this.config.theme.replace("light", "dark")
      : this.config.theme.replace("dark", "light");
    this.changeTheme2(theme, vf);
  }

  onRippleChange() {
    this.ripple = !this.ripple;
    this.configService.setRipple(this.ripple);
  }

  mudaRipple(vf: boolean) {
    if (vf) {
      DomHandler.removeClass(document.body, "p-ripple-disabled");
    } else {
      DomHandler.addClass(document.body, "p-ripple-disabled");
    }
  }

  hideConfigurator(event) {
    this.active = false;
    this.configService.menuAtivo = false
    this.configService.gravaTema();
    this.unbindOutsideClickListener();
    event.preventDefault();
  }

  toggleConfigurator(event: Event) {
    this.active = !this.active;
    this.configService.menuAtivo = this.active;
    if (this.active === false) {
      this.configService.gravaTema();
    }
    event.preventDefault();
    if (this.active)
      this.bindOutsideClickListener();
    else
      this.unbindOutsideClickListener();
  }

  onMenuButtonClick() {
    this.menuActive = true;
    this.addClass(document.body, "blocked-scroll");
  }

  onMaskClick() {
    this.hideMenu();
  }

  hideMenu() {
    this.menuActive = false;
    this.configService.menuAtivo = false;
    this.removeClass(document.body, "blocked-scroll");
  }

  addClass(element: any, className: string) {
    if (element.classList)
      element.classList.add(className);
    else
      element.className += " " + className;
  }

  removeClass(element: any, className: string) {
    if (element.classList)
      element.classList.remove(className);
    else
      element.className = element.className.replace(new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"), " ");
  }

  isDarkTheme(theme) {
    return theme.indexOf("dark") !== -1 || theme.indexOf("vela") !== -1 || theme.indexOf("arya") !== -1 || theme.indexOf("luna") !== -1;
  }

  bindOutsideClickListener() {
    if (!this.outsideClickListener) {
      this.outsideClickListener = (event) => {
        if (this.active && this.isOutsideClicked(event)) {
          this.active = false;
        }
      };
      document.addEventListener("click", this.outsideClickListener);
    }
  }

  unbindOutsideClickListener() {
    if (this.outsideClickListener) {
      document.removeEventListener("click", this.outsideClickListener);
      this.outsideClickListener = null;
    }
  }

  isOutsideClicked(event) {
    return !(this.el.nativeElement.isSameNode(event.target) || this.el.nativeElement.contains(event.target));
  }

  ngOnDestroy() {
    this.subscription.forEach(s => s.unsubscribe());
  }
}

