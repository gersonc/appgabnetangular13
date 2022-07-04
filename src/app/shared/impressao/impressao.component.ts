import {Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ColunasI} from "../../_models/colunas-i";




interface ColunasImpressaoI {
  field?: string,
  header?: string,
  width?: string
}

interface layoutI {
  size: number;
  sizes: number[];
  orientacao: string;
  colunas: ColunasImpressaoI[];
}

@Component({
  selector: 'app-impressao',
  templateUrl: './impressao.component.html',
  styleUrls: ['./impressao.component.css']
})

export class ImpressaoComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('a4p', { static: true }) a4p: ElementRef;

  @Input() colunas: ColunasI[];
  @Input() valores: any[];

  layout: layoutI = {
    size: 0,
    sizes: [],
    orientacao: 'p',
    colunas: []
  }

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.colunas.currentValue !== undefined && changes.colunas.currentValue !== null) {
      this.getTamanho();
    }

    if (changes.valores.currentValue !== undefined && changes.valores.currentValue !== null) {
      // this.getTamanho();
    }

  }

  getTamanho(): void {
    this.colunas.forEach(t => {
      const v = (+t.width.replace('px', '') * 0.75);
      this.layout.size += v;
      this.layout.sizes.push(v);
      this.layout.colunas.push({
        field: t.field,
        header: t.header,
        width: v + 'pt'
      });
    });
    this.layout.orientacao = (this.layout.size <= 850) ? 'p' : 'l';
    console.log('layout', this.layout);
  }

  imprimir() {
    // this.print(this.a4p.nativeElement)
    let imp: HTMLElement = document.querySelector('#page');
    let printContainer: HTMLElement = document.querySelector('#print-container');

    if (!printContainer) {
      printContainer = document.createElement('div');
      printContainer.id = 'print-container';
    }

    printContainer.innerHTML = '';

    let elementCopy = imp.cloneNode(true);
    printContainer.appendChild(elementCopy);
    document.body.appendChild(printContainer);

    window.print();


  }

  public print(printEl: HTMLElement) {
    let printContainer: HTMLElement = document.querySelector('#print-container');

    if (!printContainer) {
      printContainer = document.createElement('div');
      printContainer.id = 'print-container';
    }

    printContainer.innerHTML = '';

    let elementCopy = printEl.cloneNode(true);
    printContainer.appendChild(elementCopy);
    document.body.appendChild(printContainer);

    window.print();
  }


  ngOnInit(): void {
  }














  ngOnDestroy() {

  }

/*


  1inch = 96px
  1inch = 72pt

  96px = 72pt
  1px = 72pt / 96

  pt = px * ( 72pt / 96 )
  21 cm = 595.2755907 Points


*/



}
