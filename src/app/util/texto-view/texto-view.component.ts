import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {Editor} from "primeng/editor";
import {QuillOp} from "../campo-editor/quill.-interfaces";

/*

templateUrl: './texto-view.component.html',
styleUrls: ['./texto-view.component.css']

*/


@Component({
  selector: 'app-texto-view',
  template: `
    <div *ngIf="tag === 1"></div>
    <quill-view-html #qv1 *ngIf="impressao && tag === 2" [content]="content" theme="snow"></quill-view-html>
    <quill-view #qv1 *ngIf="impressao && tag === 3" [content]="content" format="text" theme="snow"></quill-view>
    <quill-view-html #qv1 *ngIf="!impressao && tag === 2" [content]="content" theme="snow"></quill-view-html>
    <quill-view #qv1 *ngIf="!impressao && tag === 3 && formato === 'object'" [content]="content" format="json" theme="snow"></quill-view>
    <quill-view #qv1 *ngIf="!impressao && tag === 3 && formato === 'text'" [content]="content" format="text" theme="snow"></quill-view>
  `
})
export class TextoViewComponent implements OnInit, AfterViewInit {
  @ViewChild('qv1', { static: true }) qv1: Editor;
/*  @ViewChild('qv2', { static: true }) solacerecus: Editor;
  @ViewChild('qv3', { static: true }) histand: Editor;
  @ViewChild('qv4', { static: true }) solcar: Editor;
  @ViewChild('qv5', { static: true }) solcar: Editor;*/
  @Input() padrao?: string;
  @Input() delta?: any;
  @Input() texto?: string;
  @Input() impressao = false;

  content?: any;
  formato = 'html';
  tag = 1;


  constructor() { }

  ngOnInit(): void {
    console.log('textview impresso' , this.impressao, ' padrao ', this.padrao);
    if (!this.impressao) {
      if (this.delta) {
        console.log('delta', this.delta);
        // const q: any = this.qv1.getQuill();

        this.content = this.delta;
        this.formato = 'object';
        this.tag = 3;
      } else {
        if (this.padrao) {
          this.content = this.padrao;
          this.formato = 'html';
          this.tag = 2;
        } else {
          if (this.texto) {
            this.content = this.texto;
            this.formato = 'text';
            this.tag = 3;
          } else {
            this.tag = 1;
          }
        }
      }
    } else {
      if (this.padrao) {
        this.content = this.padrao;
        this.formato = 'html';
        this.tag = 2;
      } else {
        if (this.texto) {
          this.content = this.texto;
          this.formato = 'text';
          this.tag = 3;
        } else {
          this.tag = 1;
        }
      }
    }
    console.log('textview impresso', this.impressao, ' formato ', this.formato, ' tab ',this.tag);
  }

  ngAfterViewInit() {
    // viewChildren is set
  }

}
