import { Component, Input, OnInit } from "@angular/core";


function _window(): any {
  // return the global native browser window object
  return window;
}


function closePrint() {
  document.body.removeChild(this.__container__);
}

function setPrint() {
  this.contentWindow.__container__ = this;
  this.contentWindow.onbeforeunload = closePrint;
  this.contentWindow.onafterprint = closePrint;
  this.contentWindow.focus(); // Required for IE
  this.contentWindow.print();
}

function printPage(sURL) {
  const prt = document.getElementById(sURL);
  const hideFrame = document.createElement("iframe");
  hideFrame.onload = setPrint;
  hideFrame.style.position = "fixed";
  hideFrame.style.right = "0";
  hideFrame.style.bottom = "0";
  hideFrame.style.width = "0";
  hideFrame.style.height = "0";
  hideFrame.style.border = "0";
  hideFrame.appendChild(prt.cloneNode(true));
  document.body.appendChild(hideFrame);
}

function imprimirPag(dados) {
  // const ref = document.getElementById(dados);
  const ref = dados;
  window.addEventListener('afterprint', (event) => {
    const y = document.getElementById("printSection");
    if (y) {
      const c = document.getElementById('body');
      c.removeChild(y);
    }
    window.removeEventListener('afterprint', event => {});
  });
  // const ref: HTMLTableElement = this.dados[1];

  const t = document.getElementById("printSection");
  if (t) {
    const b = document.getElementById('body');
    const throwawayNode = b.removeChild(t);
  }

  const printSection = document.createElement("div");
  printSection.id = "printSection";
  document.body.appendChild(printSection);
  printSection.innerHTML = "";
  // printSection.appendChild(ref);
  printSection.appendChild(ref.cloneNode(false));
  window.print();
  const y = document.getElementById("printSection");
  if (y) {
    const c = document.getElementById('body');
    c.removeChild(y);
  }
}


@Component({
  selector: 'app-printbotao',
  templateUrl: './printbotao.component.html',
  styleUrls: ['./printbotao.component.css']
})
export class PrintbotaoComponent implements OnInit {
  @Input() dados: string = '';
  @Input() tb: HTMLTableElement;

  constructor() {
    const y = document.getElementById("detalhecadastro");
  }

  ngOnInit(): void {
  }

  get nativeWindow(): any {
    return _window();
  }

  imprimir() {
    console.log(this.tb);
    imprimirPag(this.tb);
  }


}
