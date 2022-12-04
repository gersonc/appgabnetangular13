import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-teste',
  templateUrl: './teste.component.html',
  styleUrls: ['./teste.component.css']
})
export class TesteComponent implements OnInit {

  texto = "";

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id: number = +this.route.snapshot.paramMap.get('id');
    switch (id) {
      case 1 : {
        this.texto = 'REFLEX VALIDO';
        break;
      }
      case 2 : {
        this.texto = 'REFLEX EXPIRADO';
        break;
      }
      case 3 : {
        this.texto = 'ERRO';
        break;
      }
      default: {
        this.texto = 'default';
        break;
      }
    }
  }

}
