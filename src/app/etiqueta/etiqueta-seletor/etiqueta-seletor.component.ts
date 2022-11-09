import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig} from 'primeng/dynamicdialog';
import { EtiquetaService } from '../_services';
import { Subscription } from 'rxjs';
import {DdService} from "../../_services/dd.service";
import {take} from "rxjs/operators";
import {EtiquetaDropdownI} from "../_models/etiqueta-dropdown-i";


@Component({
  selector: 'app-etiqueta-seletor',
  templateUrl: './etiqueta-seletor.component.html',
  styleUrls: ['./etiqueta-seletor.component.css']
})
export class EtiquetaSeletorComponent implements OnInit, OnDestroy {
  @Output() hideEtiqueta = new EventEmitter<boolean>();
  ddEtiqueta: EtiquetaDropdownI[] = [];
  etq_id: number;
  sub: Subscription[] = [];

  constructor(
    private dd: DdService,
    public etiquetaService: EtiquetaService
  ) { }

  ngOnInit() {
    this.sub.push(this.etiquetaService.impEtiqueta.subscribe(() => {
        this.fechar();
      },
      () => {
      },
      () => {
      }
    ));
    if (!sessionStorage.getItem('dropdown-etiqueta')) {
      this.sub.push(this.dd.getDd('dropdown-etiqueta')
        .pipe(take(1))
        .subscribe((dados) => {
            sessionStorage.setItem('dropdown-etiqueta', JSON.stringify(dados));
          },
          (err) => console.error(err),
          () => {
            this.carregaDD();
          }
        )
      );
    } else {
      this.carregaDD();
    }
  }

  carregaDD() {
    this.ddEtiqueta = JSON.parse(sessionStorage.getItem('dropdown-etiqueta'));
  }

  imprimeEtiqueta(event) {
    console.log('imprimeEtiqueta', event);
    /*const etqid = event.value;
    this.etiquetaService.imprimirEtiqueta(etqid);*/
  }

  fechar() {
    this.hideEtiqueta.emit(true);
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
