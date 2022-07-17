import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import { AuthenticationService, CarregadorService } from '../../_services';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import {EventoInterface} from "../_models/evento-interface";
import {CalendarioService} from "../_services/calendario.service";
import {MsgService} from "../../_services/msg.service";

@Component({
  selector: 'app-calendario-excluir',
  templateUrl: './calendario-excluir.component.html',
  styleUrls: ['./calendario-excluir.component.css']
})
export class CalendarioExcluirComponent implements OnInit, OnDestroy, OnChanges {
  @Input() dados: any = null;
  @Output() onFechar = new EventEmitter<any>();
  @Output() onReload = new EventEmitter<boolean>();

  acao: string;
  evento: EventoInterface;
  eventoData: Date;
  num: number;
  botaoEnviarVF = false;
  sub: Subscription[] = [];
  id = 0;
  config: any = null;

  constructor(
    // public ref: DynamicDialogRef,
    // public config: DynamicDialogConfig,
    public authenticationService: AuthenticationService,
    private messageService: MsgService,
    private cs: CarregadorService,
    public cl: CalendarioService
  ) { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    if (typeof changes.dados.currentValue !== 'undefined') {
      console.log('apagar currentValue', changes.dados.currentValue);
      if (changes.dados.currentValue.acao === 'apagar') {
        this.config = changes.dados.currentValue;
        this.cs.escondeCarregador();
        this.evento = this.config.evento;
        // this.id = this.config.evento.id;
        this.eventoData = this.config.eventoData;
        this.num = this.config.num;
        this.acao = this.config.acao;
        console.log('this.evento', this.evento);
        // this.carregaDados();
      }
    }
  }

  carregaDados() {
    this.cs.escondeCarregador();
    this.evento = this.config.data.evento;
    // this.id = this.config.data.evento.id;
    this.eventoData = this.config.data.eventoData;
    this.num = this.config.data.num;
    this.acao = this.config.data.acao;
  }

  excluirTodos() {
    this.botaoEnviarVF = true;
    this.cs.mostraCarregador();
    let resp: any[];
    this.sub.push(this.cl.eventoExcluirId(+this.evento.id)
      .pipe(take(1))
      .subscribe({
        next: value => {
          resp = value;
        },
        error: err => {
          this.cs.escondeCarregador();
          this.messageService.add({ key: 'toastprincipal', severity: 'warn', summary: 'ERRO INCLUIR', detail: resp[2] });
          this.botaoEnviarVF = false;

          console.log(err);
        },
        complete: () => {
          this.messageService.add({
            key: 'toastprincipal',
            severity: 'success',
            summary: 'APAGAR EVENTO',
            detail: resp[2]
          });
          this.id = +this.evento.id;
          this.cs.escondeCarregador();
          this.voltar();
        }
      })
    );
  }

  excluirUm() {
    this.botaoEnviarVF = true;
    this.cs.mostraCarregador();
    let resp: any[];
    this.sub.push(this.cl.eventoApagarData(+this.evento.id, this.eventoData)
      .pipe(take(1))
      .subscribe({
        next: value => {
          resp = value;
          console.log(value);
        },
        error: err => {
          this.messageService.add({key: 'toastprincipal', severity: 'warn', summary: 'ERRO INCLUIR', detail: resp[2]});
          this.botaoEnviarVF = false;
          this.cs.escondeCarregador();
          console.log(err);
        },
        complete: () => {
          this.messageService.add({
            key: 'toastprincipal',
            severity: 'success',
            summary: 'APAGAR EVENTO',
            detail: resp[2]
          });
          this.botaoEnviarVF = false;
          this.cs.escondeCarregador();
          this.voltar(resp[3]);
        }
      })
    );
  }

  voltar(res?: EventoInterface) {
    if (res) {
      const rp = {
        id: +this.evento.id,
        evento: res
      };
      // this.onFechar.emit(rp);
      // this.cs.escondeCarregador();
      this.onFechar.emit(rp);
      this.onReload.emit(true);
    } else {
      const rp = {
        id: +this.evento.id,
        evento: null
      };
      this.onFechar.emit(rp);
    }

  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
