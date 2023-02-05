import {Component, OnDestroy, OnInit} from '@angular/core';
import {ErroService} from "../_services/erro.service";

@Component({
  selector: 'app-erro',
  templateUrl: './erro.component.html',
  styleUrls: ['./erro.component.css']
})
export class ErroComponent implements OnInit, OnDestroy {

  display = true;
  constructor(
    public es: ErroService
  ) { }

  ngOnInit(): void {;
    this.es.erro$.subscribe((d: boolean) => {
      if (d) {
        this.abrir();
      }
    })
  }

  abrir() {
    this.display = true;
  }

  fechar() {
    this.es.clear();
    this.es.display = false;
  }

  ngOnDestroy() {
    this.es.clear();
    this.es.display = false;
  }


}
