import {Component, Input} from '@angular/core';
@Component({
  selector: 'app-quill-view',
  template: `<quill-view *ngIf="deltaSN()" [content]="cpdelta" [format]="'object'" theme="snow"></quill-view>
  <quill-view *ngIf="!deltaSN()"[content]="cphtml" [format]="'html'" theme="snow"></quill-view>`
})
export class QuillViewComponent {
  @Input() cpdelta?: any;
  @Input() cphtml?: string;
  constructor() {}
  deltaSN(): boolean {
    return (this.cpdelta !== null);
  }
}
