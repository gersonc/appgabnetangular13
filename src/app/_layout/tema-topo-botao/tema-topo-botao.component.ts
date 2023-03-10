import { Component, OnInit } from '@angular/core';
import { AppConfigService } from "../../_services/appconfigservice";

@Component({
  selector: 'app-tema-topo-botao',
  templateUrl: './tema-topo-botao.component.html',
  styleUrls: ['./tema-topo-botao.component.css']
})
export class TemaTopoBotaoComponent implements OnInit {

  active = false;

  constructor(
    public configService: AppConfigService,
  ) { }

  ngOnInit(): void {
  }


  hideConfigurator(event) {
    this.active = !this.active;
    this.configService.menuAtivo = !this.configService.menuAtivo;
    // this.configService.gravaTema();
    event.preventDefault();
  }

  toggleConfigurator(event: Event) {
    this.configService.menuAtivo = !this.configService.menuAtivo;
    this.active = !this.active;
    event.preventDefault();
  }


}
