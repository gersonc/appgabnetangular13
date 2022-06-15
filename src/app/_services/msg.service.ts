import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {delay} from "rxjs/operators";

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

  constructor() { }

  add(msg: MsgI) {
      if (typeof msg.key === 'undefined') {
        msg.key = 'principal'
      }
      this.msgSubject.next(msg);
      // this.msgSubject.next();
    }



}
