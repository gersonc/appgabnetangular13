import { Component, OnInit } from '@angular/core';
import { AuthenticationService, UrlService } from "../../_services";
import { MenuDatatableService } from "../../_services/menu-datatable.service";
import { DispositivoService } from "../../_services/dispositivo.service";
import { take } from "rxjs/operators";
import { Subscription } from "rxjs";
import { WindowsService } from "../_service";
import { HttpClient } from "@angular/common/http";
import { OnoffLineService } from "../../shared/onoff-line/onoff-line.service";
// import { OnlineService } from "../../_services/online.service";

@Component({
  selector: 'app-main-topo',
  templateUrl: './main-topo.component.html',
  styleUrls: ['./main-topo.component.css']
})
export class MainTopoComponent implements OnInit {
  classe: string = null;
  public mostraMenuPrincipal = false;
  mostraPessoal = false;
  sub: Subscription[] = [];

  constructor(
    public authenticationService: AuthenticationService,
    public md: MenuDatatableService,
    public ds: DispositivoService,
    public ws: WindowsService,
    public http: HttpClient,
    private urls: UrlService,
    public ol: OnoffLineService,
    // private ac: AppConfigService
  ) { }

  ngOnInit(): void {
    //this.ping();
  }

  abreFechaMenu() {
    this.mostraMenuPrincipal = !this.mostraMenuPrincipal;
    this.md.mdt = !this.md.mdt;
  }

  abreFechaMd() {
    this.md.mdt = !this.md.mdt;
  }

  /*ping() {
    this.sub.push(this.http.get(this.urls.ping).pipe(take(1)).subscribe({
      next: (data: any) => {
        this.ds.dispositivo = data.dispositivo;
      },
      error: (err) => console.log('ping-erro->', err)
    }));
  }*/

}
