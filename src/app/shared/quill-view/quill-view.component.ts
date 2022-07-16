import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Stripslashes} from "../functions/stripslashes";

@Component({
  selector: 'app-quill-view',
  template: `<quill-view *ngIf="dtSN" [content]="cpdelta" [format]="'json'" theme="snow"></quill-view><quill-view-html [content]="stripslashes(cphtml)" theme="snow"></quill-view-html>`
})
export class QuillViewComponent implements OnChanges {
  @Input() cpdelta?: any;
  @Input() cphtml?: string | null;
  dtSN: boolean;
  constructor() {}


  ngOnChanges(changes: SimpleChanges) {
    if (changes.cpdelta) {
      if (this.cpdelta !== undefined && this.cpdelta !== null) {
        this.deltaSN(true);
      }
    }

    if (changes.cphtml) {
      if (this.cphtml !== undefined && this.cphtml !== null) {
        this.deltaSN(false);
      }
    }

  }

  stripslashes(str?: string): string | null {
    return Stripslashes(str)
  }

  deltaSN(vf: boolean) {
    this.dtSN = vf;
  }

  delta(dt: string | null): string | null {
    return dt;
  }


}
