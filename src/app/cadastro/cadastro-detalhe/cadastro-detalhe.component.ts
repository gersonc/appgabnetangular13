import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CadastroI} from "../_models/cadastro-i";
import {AuthenticationService} from "../../_services";
import {Stripslashes} from "../../shared/functions/stripslashes";

@Component({
  selector: 'app-cadastro-detalhe',
  templateUrl: './cadastro-detalhe.component.html',
  styleUrls: ['./cadastro-detalhe.component.css']
})
export class CadastroDetalheComponent implements OnInit {
  @Input() cadastro: CadastroI;
  @Output() hideDetalhe = new EventEmitter<boolean>();

  impressao = false;
  pdfOnOff = true;

  constructor(
    public aut: AuthenticationService,
  ) { }

  ngOnInit(): void {
  }

  fechar() {
    this.hideDetalhe.emit(true);
  }

  stripslashes(str?: string): string | null {
    return Stripslashes(str)
  }

}
