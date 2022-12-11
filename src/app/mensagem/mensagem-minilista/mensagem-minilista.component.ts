import { Component, OnInit } from '@angular/core';
import {MensagemI} from "../_models/mensagem-i";

@Component({
  selector: 'app-mensagem-minilista',
  templateUrl: './mensagem-minilista.component.html',
  styleUrls: ['./mensagem-minilista.component.css']
})
export class MensagemMinilistaComponent implements OnInit {

  mgs: MensagemI[] = [];

  constructor() { }

  ngOnInit(): void {
  }






}
