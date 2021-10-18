import { Component, OnInit, OnDestroy } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig} from 'primeng/dynamicdialog';
import { DropdownService } from '../../util/_services';
import { EtiquetaService } from '../_services';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-etiqueta-seletor',
  templateUrl: './etiqueta-seletor.component.html',
  styleUrls: ['./etiqueta-seletor.component.css']
})
export class EtiquetaSeletorComponent implements OnInit, OnDestroy {
  ddEtiqueta: SelectItem[] = [];
  etq_id: number;
  sub: Subscription[] = [];

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private dropdownService: DropdownService,
    private etiquetaService: EtiquetaService
  ) { }

  ngOnInit() {
    this.sub.push(this.etiquetaService.impEtiqueta.subscribe(() => {
        this.fechar();
      },
      () => {},
      () => {}
    ));
    this.sub.push(this.dropdownService.getDropdownNomeIdConcat('etiquetas', 'etq_id', 'etq_marca', 'etq_modelo')
      .subscribe((dados) => {
        this.ddEtiqueta = dados;
      }));
  }

  imprimeEtiqueta(event) {
    const etqid = event.value;
    this.etiquetaService.imprimirEtiqueta(etqid, this.config.data.cadastro);
  }

  fechar() {
    this.ref.close();
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
