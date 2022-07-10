import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {delay} from "rxjs/operators";
import {SpinnerService} from "./spinner.service";

export interface MsgI{
  severity: string,
  summary: string,
  detail: string,
  key?: string
}



@Injectable({
  providedIn: 'root'
})
export class MsgService {
  msgSubject = new BehaviorSubject({});
  msg$ = this.msgSubject.asObservable();

  constructor(
    private sps: SpinnerService
  ) { }

  fundoSN(vf?: boolean) {
    if (vf === undefined) {
      this.sps.fundoSN();
    } else {
      this.sps.fundoSN(vf);
    }
  }

  add(msg: MsgI) {
      this.sps.fundoSN(false);
      if (typeof msg.key === 'undefined') {
        msg.key = 'toastprincipal'
      }
      this.msgSubject.next(msg);
      // this.msgSubject.next();
  }



}
