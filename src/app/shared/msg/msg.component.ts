import { Component, OnInit } from '@angular/core';
import {Message,MessageService} from 'primeng/api';
import {MsgI, MsgService} from "../../_services/msg.service";
import {delay, take} from "rxjs/operators";
import {timer} from "rxjs";
import {SpinnerService} from "../../_services/spinner.service";

@Component({
  selector: 'apmsg',
  template: `<p-toast id="toastprincipal"  styleClass="toastprincipal" autoZIndex="false" key="toastprincipal" (onClose)="onClose($event)"></p-toast><p-messages key="mensagem"></p-messages>`,
})
export class MsgComponent implements OnInit {

  constructor(
    public messageService: MessageService,
    private msg: MsgService,
    private sps: SpinnerService
  ) { }

  ngOnInit(): void {
    this.msg.msg$.subscribe((m: MsgI) => {
      if (m.key === 'mensagem') {
        const c = timer(5000).pipe(take(1)).subscribe(x => this.messageService.clear('mensagem'));
      }
      this.messageService.add(m);
    })
  }

  onClose(ev) {
    this.sps.fundoSN(true);
  }

}
