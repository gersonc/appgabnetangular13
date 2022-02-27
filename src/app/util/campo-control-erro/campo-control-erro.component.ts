import { Component, OnInit, Input } from '@angular/core';
import {Message} from "primeng/api";

@Component({
  selector: 'app-campo-control-erro',
  templateUrl: './campo-control-erro.component.html',
  styleUrls: ['./campo-control-erro.component.css']
})
export class CampoControlErroComponent implements OnInit {

  @Input() msgErro: string | undefined;
  @Input() mostrarErro?: boolean;
  msg: Message;

  constructor() { }

  ngOnInit() {
  }

}
