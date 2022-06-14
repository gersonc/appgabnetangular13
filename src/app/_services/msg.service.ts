import { Injectable } from '@angular/core';
import {MessageService} from "primeng-lts/api";

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

  constructor(public m: MessageService) { }

  add(msg: MsgI) {
    if (typeof msg.key === 'undefined') {
      msg.key = 'principal'
    }
    this.m.add(msg);
  }


}
