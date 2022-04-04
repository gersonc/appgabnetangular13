import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ArquivoInterface} from "../../arquivo/_models";

@Component({
  selector: 'app-detalhe-explorer',
  templateUrl: './detalhe-explorer.component.html',
  styleUrls: ['./detalhe-explorer.component.css']
})
export class DetalheExplorerComponent implements OnInit, OnChanges {
  @Input() arquivos?: ArquivoInterface[];
  @Input() modulo?: string;
  @Input() registro_id?: number;
  @Output() onBloqueiaBotoes = new EventEmitter<boolean>();

  arqs: ArquivoInterface[] = [];


  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if( changes.modulo) {
      this.filtarArquivos(changes.modulo.currentValue)
    }
    console.log('arquivos', this.arquivos);
    console.log('modulo', this.modulo);
    console.log('registro_id', this.registro_id);
  }

  onBlockSubmit(ev: boolean) {
    this.onBloqueiaBotoes.emit(ev);
  }

  filtarArquivos(modulo: string) {
    this.arqs = [];
    this.arquivos.forEach( a => {
      if (a.arquivo_registro_id === this.registro_id && a.arquivo_modulo === modulo) {
        this.arqs.push(a);
      }
    });
    console.log('arqs', this.arqs);

  }

}
