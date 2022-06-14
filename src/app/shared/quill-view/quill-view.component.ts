import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
@Component({
  selector: 'app-quill-view',
  template: `<quill-view *ngIf="dtSN" [content]="cpdelta" [format]="'json'" theme="snow"></quill-view>
  <quill-view *ngIf="!dtSN" [content]="cphtml" [format]="'html'" theme="snow"></quill-view>`
})
export class QuillViewComponent implements OnChanges {
  @Input() cpdelta?: any;
  @Input() cphtml?: string;
  dtSN: boolean;
  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.cpdelta) {
      if (changes.cpdelta.currentValue !== null) {
        this.deltaSN(true);
        if (changes.cpdelta.currentValue instanceof Object) {
          this.deltaSN(false);
          this.delta(null);
          this.htm(this.cphtml);
        } else {
          this.deltaSN(true);
          this.htm(this.cphtml);
          this.delta(changes.cpdelta.currentValue);
        }
        this.htm(null);
      } else {
        this.deltaSN(false);
        this.delta(null);
        this.htm(this.cphtml);
      }
    }

  }

  deltaSN(vf: boolean) {
    this.dtSN = vf;
  }

  delta(dt: string | null): string | null {
    return dt;
  }

  htm(ht: string | null): string | null {
    return ht;
  }

}
