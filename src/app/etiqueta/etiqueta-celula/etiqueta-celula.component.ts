import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {CadastroEtiquetaI} from "../_models/cadastro-etiqueta-i";

@Component({
  selector: 'app-etiqueta-celula',
  templateUrl: './etiqueta-celula.component.html',
  styleUrls: ['./etiqueta-celula.component.css']
})
export class EtiquetaCelulaComponent implements OnInit, OnChanges {
  @Input() cadastro: CadastroEtiquetaI | null = null;

  nc = 0;
  constructor() { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.cadastro.currentValue !== undefined) {
      if (this.cadastro !== undefined && this.cadastro !== null) {
        if (this.cadastro.cadastro_bairro !== undefined && this.cadastro.cadastro_bairro !== null) {
          this.nc += this.cadastro.cadastro_bairro.length;
        }
        if (this.nc > 0) {
          this.nc += this.cadastro.cadastro_municipio_nome.length + 2;
        }
      }
    } else {
      this.cadastro = null;
    }
  }

}
