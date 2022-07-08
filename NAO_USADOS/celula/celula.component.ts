import {Component, Input, OnInit} from '@angular/core';
import {CelulaI} from "../../_models/celula-i";
import {CelulaService} from "../../_services/celula.service";
import {limpaTextoNull} from "../functions/limpa-texto";

@Component({
  selector: 'app-celula',
  templateUrl: './celula.component.html',
  styleUrls: ['./celula.component.css']
})
export class CelulaComponent implements OnInit {
  @Input() celula: CelulaI;

  constructor(
    public cs: CelulaService
  ) { }

  ngOnInit(): void {
  }

  mostraTexto() {
    this.cs.mostraTexto(this.celula);
  }

  limpaTextoNull(str: any): any {
    return limpaTextoNull(str);
  }

}
