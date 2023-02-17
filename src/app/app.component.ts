import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { WindowsService } from "./_layout/_service";
import { AuthenticationService } from "./_services";
import { ResizedEvent } from "angular-resize-event";
import { CoordenadaXY } from "./_layout/_service/coordenada-x-y";
import { PrimeNGConfig } from "primeng/api";
import { SpinnerService } from "./_services/spinner.service";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";
import { AppConfig } from "./_models/appconfig";
import { AppConfigService } from "./_services/appconfigservice";
import { DispositivoService } from "./_services/dispositivo.service";
import { AuthService } from "./_services/auth.service";
// import { fcoresDD, fcoresDD2 } from "./shared/functions/cores";


declare global {
  interface Window {
    __VERSAOID__: number;
    __VERSAO__: any;
  }
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild("principal", { static: true }) principal: ElementRef;

  title = "app";

  public carregadorSN = false;
  inicio = true;
  mostraPessoal = false;
  s: Subscription[] = [];
  appconfig: AppConfig = {
    usuario_uuid: null,
    theme: "lara-light-blue",
    dark: false,
    inputStyle: "filled",
    ripple: true,
    scale: "14px", // px
    dispositivo: "desktop"
  };
  theme = "lara-light-blue";
  subscription: Subscription;

  private evs: CoordenadaXY[] = [];

  constructor(
    private config: PrimeNGConfig,
    private ath: AuthService,
    public authenticationService: AuthenticationService,
    private windowsService: WindowsService,
    private router: Router,
    public sps: SpinnerService,
    public ds: DispositivoService,
    public cf: AppConfigService
  ) { }

  ngOnInit() {
    this.s.push(this.ath.logado$.subscribe({
        next: (n) => {
          console.log('AppComponent logado$', n);
          if (n === 1) {
            this.cf.getUuid();
            this.mostraPessoal = true;
            this.router.navigate(["/home"]);
          }
          if (n === 2) {
            this.ath.parseLogado();
          }
          if (n === 3 || n == 4) {
            this.router.navigate(["/login"]);
          }
        }
      })
    );

    window.__VERSAOID__ = +this.authenticationService.versao;
    window.__VERSAO__ = this.authenticationService.versao;
    this.configPrime();
    WindowsService.all();

    /*console.log('cores', fcoresDD());
    console.log('cores2', fcoresDD2());*/
  }


  onResized(id: string, event: ResizedEvent): void {
    const ev = new CoordenadaXY();
    ev.oldX = event.oldRect?.width;
    ev.oldY = event.oldRect?.height;
    ev.x = event.newRect.width;
    ev.y = event.newRect.height;

    switch (id) {
      case "app": {
        this.windowsService.coorApp = ev;
        this.windowsService.changeScreen(ev.x, ev.y);
        break;
      }
      case "topo": {
        this.windowsService.coorTopo = ev;
        break;
      }
      case "topo1": {
        this.windowsService.coorTopo = ev;
        break;
      }
      case "main": {
        this.windowsService.coorMain = ev;
        break;
      }
      case "rodape": {
        this.windowsService.coorRodape = ev;
        break;
      }
    }
  }

  public mostraEsconde(vf: boolean) {
    this.carregadorSN = vf;
  }

  configPrime() {
    this.config.setTranslation({
      "startsWith": "Começa com",
      "contains": "Contêm",
      "notContains": "Não contém",
      "endsWith": "Termina com",
      "equals": "igual",
      "notEquals": "Diferente de",
      "noFilter": "Sem filtro",
      "lt": "Menor que",
      "lte": "Menor ou igual a",
      "gt": "Maior que",
      "gte": "Melhor, então ou igual",
      "is": "É",
      "isNot": "Não é",
      "before": "Antes",
      "after": "Depois",
      "clear": "Limpar",
      "apply": "Aplicar",
      "matchAll": "Coincidir todos",
      "matchAny": "Coincidir algum",
      "addRule": "Adicionar Regra",
      "removeRule": "Remover Regra",
      "accept": "Sim",
      "reject": "Não",
      "choose": "Escolha",
      "upload": "Upload",
      "cancel": "Cancelar",
      "dayNames": ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
      "dayNamesShort": ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
      "dayNamesMin": ["D", "Se", "Tr", "Qa", "Qi", "Sx", "Sb"],
      "monthNames": ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", " Dezembro"],
      "monthNamesShort": ["Jan", "Fev", "Mar", "Abr", "Maio", "Jun", "Jul", "Ago", "Set", "Out", "Nov", " Dez "],
      "today": "Hoje",
      "weekHeader": "Sm",
      "emptyMessage": "Sem resultados",
      "weak": "Fraca",
      "medium": "Media",
      "strong": "Forte",
      "passwordPrompt": "Entre com a senha",
      "emptyFilterMessage": "Sem resultados encontrados"
    });
    this.config.ripple = true;
  }

  ngOnDestroy() {
    this.s.forEach(ss => ss.unsubscribe());
  }


}

