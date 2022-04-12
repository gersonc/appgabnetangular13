import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewContainerRef
} from '@angular/core';
import {ArquivoInterface} from "../../arquivo/_models";

@Component({
  selector: 'app-detalhe-explorer',
  templateUrl: './detalhe-explorer.component.html',
  styleUrls: ['./detalhe-explorer.component.css']
})
export class DetalheExplorerComponent implements OnChanges {
  @Input() arquivos?: ArquivoInterface[];
  @Input() modulo?: string;
  @Input() registro_id?: number;

  arqs: ArquivoInterface[];
  ref: ViewContainerRef;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if( changes.modulo) {
      this.filtarArquivos(changes.modulo.currentValue)
    }
  }

  filtarArquivos(modulo: string) {
    this.arqs = this.arquivos.filter( a => a.arquivo_modulo === modulo && a.arquivo_registro_id === this.registro_id)
    console.log('arqs', this.arqs);
  }

}
