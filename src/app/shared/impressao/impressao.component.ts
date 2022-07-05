import {
  Component, DoCheck,
  ElementRef, EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
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
  @ViewChild('btnprint', {static: true}) public btnprint: ElementRef;
  @ViewChild('op', {static: true}) public op: ElementRef;
  @ViewChild('a4p', { static: false }) a4p: ElementRef;
  @Output() fecharImpressao = new EventEmitter<boolean>();
  @Input() colunas: ColunasI[];
  @Input() valores: any[];
  @Input() titulo: string;

  layout: layoutI = {
    size: 0,
    sizes: [],
    orientacao: 'p',
    colunas: []
  }
  val: any[] = [];

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.colunas.currentValue !== undefined && changes.colunas.currentValue !== null &&  Array.isArray(changes.colunas.currentValue)) {
      if(this.layout.colunas.length === 0) {
        this.getTamanho();
      }
    }

    if (changes.valores.currentValue !== undefined && changes.valores.currentValue !== null &&  Array.isArray(changes.valores.currentValue)) {
      if (this.valores !== undefined && this.valores !== null &&  Array.isArray(this.valores) && this.valores.length > 0) {
        if(this.val.length === 0) {
          this.val = this.valores;
        }
      }

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
  }

  imprimir() {
    let printSection = document.createElement("div");
    printSection.id = "printSection";
    document.body.appendChild(printSection);
    printSection.innerHTML = "";
    printSection.appendChild(this.a4p.nativeElement.cloneNode(true));
    window.print();
  }

  onHide() {
    console.log('onhide');
    this.fecharImpressao.emit(true);
  }

  ngOnInit(): void {
    setTimeout(()=> {
      this.btnprint.nativeElement.click();
    }, 3000);

  }

  ngOnDestroy() {
    let printSection = document.getElementById("printSection");
    if (printSection !== undefined) {
      document.body.removeAttribute('printSection');
    }
    let ov = document.getElementById("overp");
    if (ov !== undefined) {
      document.body.removeAttribute('overp');
    }
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
