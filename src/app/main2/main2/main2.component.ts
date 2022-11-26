import { Component, OnInit } from '@angular/core';
import {MensagemOnoffService} from "../../_services/mensagem-onoff.service";

@Component({
  selector: 'app-main2',
  templateUrl: './main2.component.html',
  styleUrls: ['./main2.component.css']
})
export class Main2Component implements OnInit {

  constructor(
    public mo: MensagemOnoffService,
  ) { }

  ngOnInit(): void {
  }

  fechaMensagemForm(ev) {

  }

}
