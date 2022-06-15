import { Component, OnInit } from '@angular/core';
import {Message,MessageService} from 'primeng-lts/api';
import {MsgI, MsgService} from "../../_services/msg.service";
import {delay, take} from "rxjs/operators";
import {timer} from "rxjs";

@Component({
  selector: 'app-msg',
  template: `<p-toast baseZIndex="50000" key="principal"></p-toast><p-messages key="mensagem"></p-messages>`,
})
export class MsgComponent implements OnInit {

  constructor(
    public messageService: MessageService,
    private msg: MsgService
  ) { }

  ngOnInit(): void {
    this.msg.msg$.subscribe((m: MsgI) => {
      if (m.key === 'mensagem') {
        const c = timer(5000).pipe(take(1)).subscribe(x => this.messageService.clear('mensagem'));
      }
      this.messageService.add(m);
    })
  }

}
