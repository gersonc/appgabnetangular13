import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { MenuItem } from 'primeng/api';
import { GraficosService } from "./_services/graficos.service";
import { AuthenticationService, CarregadorService } from "../_services";

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.css']
})
export class GraficosComponent implements OnInit {
  public menugrf: MenuItem[];

  constructor(
    private aut: AuthenticationService,
    private cs: CarregadorService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private gs: GraficosService
  ) { }

  ngOnInit(): void {
    console.log('conf');
    this.criaMemu();
  }

  criaMemu() {
    this.menugrf = [
      {
        label: 'Gráficos',
        items: [
          {
            label: 'Cadastros',
            command: () => {
              this.cs.mostraCarregador();
            },
            routerLink: ['cadastro']
          },
          {
            label: 'Solicitações',
            command: () => {
              this.cs.mostraCarregador();
            },
            routerLink: ['solicitacao']
          },
          {
            label: 'Ofícios',
            command: () => {
              this.cs.mostraCarregador();
            },
            routerLink: ['oficio']
          },
          {
            label: 'Processos',
            command: () => {
              this.cs.mostraCarregador();
            },
            routerLink: ['processo']
          },
          {
            label: 'Emendas',
            command: () => {
              this.cs.mostraCarregador();
            },
            routerLink: ['emenda']
          },
        ]
      }
    ];
  }




}
