import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MensagemListagemI} from "../_models/mensagem-listagem-i";

@Component({
  selector: 'app-mensagem-mensagem',
  templateUrl: './mensagem-mensagem.component.html',
  styleUrls: ['./mensagem-mensagem.component.css']
})
export class MensagemMensagemComponent implements OnInit {
  @Input() msg: MensagemListagemI;
  @Input() listagem_tipo: string;
  @Output() apagar = new EventEmitter<number>();
  @Output() apagar2 = new EventEmitter<number>();
  constructor() { }

  ngOnInit(): void {
  }

  visto(n: number): string {
    return (n===1) ? 'SIM' : 'NÃO';
  }

  onApagarMensagem() {
    if (this.listagem_tipo === 'recebidas') {
      this.apagar.emit(this.msg.usuario_mensagem_id);
    } else {
      this.apagar.emit(this.msg.mensagem_id);
    }
  }

  onApagarMensagemTodos() {
      this.apagar.emit(this.msg.mensagem_id);
  }

}
