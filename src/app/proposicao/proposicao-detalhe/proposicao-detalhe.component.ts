import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ProposicaoListarI} from "../_models/proposicao-listar-i";
import {AuthenticationService} from "../../_services";
import {Stripslashes} from "../../shared/functions/stripslashes";

@Component({
  selector: 'app-proposicao-detalhe',
  templateUrl: './proposicao-detalhe.component.html',
  styleUrls: ['./proposicao-detalhe.component.css']
})
export class ProposicaoDetalheComponent implements OnInit{
  @Input() proposicao: ProposicaoListarI;
  @Output() hideDetalhe = new EventEmitter<boolean>();

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


