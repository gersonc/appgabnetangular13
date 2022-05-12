import {AfterViewInit, Component, Input, OnInit} from '@angular/core';

/*

templateUrl: './texto-view.component.html',
styleUrls: ['./texto-view.component.css']

*/


@Component({
  selector: 'app-texto-view',
  template: `
    <div *ngIf="tag === 1"></div>
    <quill-view-html *ngIf="impressao && tag === 2" [content]="content" theme="snow"></quill-view-html>
    <quill-view *ngIf="impressao && tag === 3" [content]="content" format="text" theme="snow"></quill-view>
    <quill-view-html *ngIf="!impressao && tag === 2" [content]="content" theme="snow"></quill-view-html>
    <quill-view *ngIf="!impressao && tag === 3 && formato === 'object'" [content]="content" format="object" theme="snow"></quill-view>
    <quill-view *ngIf="!impressao && tag === 3 && formato === 'text'" [content]="content" format="text" theme="snow"></quill-view>
  `
})
export class TextoViewComponent implements OnInit, AfterViewInit {
  @Input() padrao?: string;
  @Input() delta?: any;
  @Input() texto?: string;
  @Input() impressao = false;

  content?: any;
  formato: string = 'html'
  tag = 1;


  constructor() { }

  ngOnInit(): void {
    if (!this.impressao) {
      if (this.delta) {
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

  }

  ngAfterViewInit() {
    // viewChildren is set
  }

}
