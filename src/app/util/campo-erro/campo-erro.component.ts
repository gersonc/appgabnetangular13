import {Component, Input, OnInit} from '@angular/core';
import {Message} from "primeng/api";

@Component({
  selector: 'app-campo-erro',
  templateUrl: './campo-erro.component.html',
  styleUrls: ['./campo-erro.component.css']
})
export class CampoErroComponent implements OnInit {
  @Input() msgErro: string | undefined;
  @Input() mostrarErro?: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
