import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {SelectItem} from "primeng/api";
import {Dropdown, DropdownItem} from "primeng/dropdown/dropdown";
import {PrimeTemplate} from "primeng/api/shared";

@Component({
  selector: 'app-dropdown-colorido',
  templateUrl: './dropdown-colorido.component.html',
  styleUrls: ['./dropdown-colorido.component.css']
})
export class DropdownColoridoComponent implements OnInit {
  @ViewChild('tdd', { static: false }) drd: Dropdown;
  @Input() dropDown?: SelectItem[] = null;
  @Input() variavel?: SelectItem = null;
  @Output() variavelChange = new EventEmitter<SelectItem>();
  @Output() onMuda = new EventEmitter<SelectItem>();

  tpl: TemplateRef<any>;

  constructor() { }

  ngOnInit(): void {
    console.log('drd',this.drd);
  }

  mudaDD(opc: SelectItem) {
    this.onMuda.emit(opc);
    this.variavelChange.emit(opc);
  }


  mudaCor(cor?: string): any {
    const b: string = (cor === undefined || cor === null) ? 'transparent' : cor;
    const c: string = (
      cor === undefined ||
      cor === null ||
      cor === 'transparent' ||
      cor.substring(0, 4) === 'var(' ||
      cor.length < 3 ||
      (cor.length > 4 && cor.length < 6) ||
      cor.length > 7
    ) ? 'var(--text-color)' : this.setForegroundColor(cor);
    console.log('c1', c);
/*    if (c === 'var(--text-color)' || c.substring(0, 4) === 'var(' || c.length < 3 || (c.length > 4 && c.length < 6) || c.length > 7) {
      c = 'var(--text-color)';
      console.log('c2', c);
    } else {
      c = this.setForegroundColor(cor);
      console.log('c3', c.toString());
    }*/
    return {
      margin: 0,
      padding: '1px 0',
      border: '3px solid transparent',
      color: c,
      background: b,
      transition: 'box-shadow 0.2s',
      borderRadius: 0

    }
  }

  setForegroundColor(cor: string) {
    const rgb  = this.hexToRGB(cor, false);
    console.log('rgb', rgb);
    const sum = Math.round(((parseInt(rgb[0]) * 299) + (parseInt(rgb[1]) * 587) + (parseInt(rgb[2]) * 114)) / 1000);
    console.log('sum', sum);
    return (sum > 128) ? 'black' : 'white';
  }

  hexToRGB(h,isPct) {
    const ex = /^#([\da-f]{3}){1,2}$/i;
    if (ex.test(h)) {
      let r: any = 0, g: any = 0, b: any = 0;
      isPct = isPct === true;

      // 3 digits
      if (h.length == 4) {
        r = "0x" + h[1] + h[1];
        g = "0x" + h[2] + h[2];
        // @ts-ignore
        b = "0x" + h[3] + h[3];
      } else if (h.length == 7) {
        r = "0x" + h[1] + h[2];
        g = "0x" + h[3] + h[4];
        b = "0x" + h[5] + h[6];
      }
      if (isPct) {
        r = +(r / 255 * 100).toFixed(1);
        g = +(g / 255 * 100).toFixed(1);
        b = +(b / 255 * 100).toFixed(1);
      }
      // return "rgb("+ (isPct ? r + "%," + g + "%," + b + "%" : +r + "," + +g + "," + +b) + ")";
      return [r,g,b];

    } else {
      return null;
    }
  }


/*

  ddcor(cor?: string): any {
    const b: string =  (cor === undefined || cor === null) ? 'transparent' : cor;
    let c: string =  (cor === undefined || cor === null ) ? 'var(--text-color)' : cor;
    if (c === 'var(--text-color)' || c.substring(0,4) === 'var(' || ((c.length < 3 || c.length > 4 ) && (c.length < 6 || c.length > 7))){
      c = 'var(--text-color)';
    } else {
      c = this.setForegroundColor(cor);
    }


    return {
      margin: 0,
      padding: '0.2rem 1rem',
      border: 0,
      color: c,
      background: b,
      transition: 'box-shadow 0.2s',
      borderRadius: 0
    }
  }
*/

}
