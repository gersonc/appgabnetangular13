import {Component, OnDestroy, OnInit} from '@angular/core';
import {DdService} from "../../_services/dd.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {take} from "rxjs/operators";
import {SelectItem} from "primeng/api";
import {Subscription} from "rxjs";
import {MenuInternoService} from "../../_services";
import {DateTime} from "luxon";
import {MensagemService} from "../_services/mensagem.service";
import {MansagemBuscaI} from "../_models/mansagem-busca-i";

@Component({
  selector: 'app-mensagem-menu',
  templateUrl: './mensagem-menu.component.html',
  styleUrls: ['./mensagem-menu.component.css']
})
export class MensagemMenuComponent implements OnInit , OnDestroy {
  ptBr: any;
  sub: Subscription[] = [];
  public formMenuMensagem?: FormGroup;
  public ddusuario_mensagem_usuario_id: SelectItem[] = [];
  public ddusuario_id: SelectItem[] = [];
  public ddTipo_listagem: SelectItem[] = [
    {label: 'Enviadas', value: 1},
    {label: 'Recebidas', value: 2},
  ];
  public ddMensagem_vistas: SelectItem[] = [
    {label: 'Todas', value: 0},
    {label: 'Lidas', value: 1},
    {label: 'Não lidas', value: 2},
  ];




  constructor(
    private formBuilder: FormBuilder,
    private dd: DdService,
    public mi: MenuInternoService,
    public ms: MensagemService
    ) { }

  ngOnInit() {

    this.formMenuMensagem = this.formBuilder.group({
      usuario_mensagem_usuario_id: [null],
      usuario_id: [null],
      mensagem_data1: [null],
      mensagem_data2: [null],
      usuario_mensagem_visto: [null],
      tipo_listagem: [null],
      mensagem_titulo: [null],
    });

    this.carregaDropDown();

    this.mi.showMenuInterno();
  }

  carregaDropDown() {
    if (sessionStorage.getItem('dropdown-usuario')) {
      this.ddusuario_mensagem_usuario_id = JSON.parse(sessionStorage.getItem('dropdown-usuario'));
      this.ddusuario_id = JSON.parse(sessionStorage.getItem('dropdown-usuario')!);
    } else {
      this.populaDropdown();
    }
  }

  populaDropdown() {
    this.sub.push(this.dd.getDd('dropdown-usuario')
      .pipe(take(1))
      .subscribe({
        next: (dados) => sessionStorage.setItem('dropdown-usuario', JSON.stringify(dados)),
        error: (err) => console.error(err),
        complete: () => this.carregaDropDown()
      })
    );
  }



  onMudaForm() {
    this.ms.resetMensagemBusca();
    this.ms.novaBusca(this.criaBusca());
    this.ms.buscaMenu();
    this.mi.hideMenu();
  }

  criaBusca(): MansagemBuscaI {
    let b: MansagemBuscaI = {};
    const f = this.formMenuMensagem.getRawValue();
    console.log('criaBusca1', f);
    if (f.tipo_listagem !== null) {
      b.tipo_listagem = +f.tipo_listagem;
    }
    if (f.usuario_mensagem_usuario_id !== null) {
      b.usuario_mensagem_usuario_id = f.usuario_mensagem_usuario_id;
    }
    if (f.usuario_id !== null) {
      b.usuario_id = f.usuario_id;
    }
    if (f.mensagem_titulo !== null && Array.isArray(f.mensagem_titulo)) {
      const c: string[] = f.mensagem_titulo;
      b.mensagem_titulo = c.map(a => {return a.toUpperCase()});
    }
    if (f.mensagem_data1 !== null) {
      b.mensagem_data1 = DateTime.fromJSDate(f.mensagem_data1).toFormat('yyyy-LL-dd');
    }
    if (f.mensagem_data2 !== null) {
      b.mensagem_data2 = DateTime.fromJSDate(f.mensagem_data2).toFormat('yyyy-LL-dd');
    }
    if (f.usuario_mensagem_visto !== null) {
      b.usuario_mensagem_visto = f.usuario_mensagem_visto;
    }
    console.log('criaBusca', b);
    return b;
  }

  limpar() {
    this.formMenuMensagem = this.formBuilder.group({
      usuario_mensagem_usuario_id: [null],
      usuario_id: [null],
      mensagem_data1: [null],
      mensagem_data2: [null],
      usuario_mensagem_visto: [null],
      tipo_listagem: [null],
      mensagem_titulo: [null],
    });
  }

  onKey(event) {
    let a = 0;
    event.key.toString() === 'Enter' ? this.onMudaForm() : a++;
  }

  onAddTitulo(ev, ev2) {
    const v1: string = ev.value;
    const v2: string[] = ev2;
    if (v1.length < 4) {
      if (v2.length === 1) {
        this.formMenuMensagem.get('mensagem_titulo').patchValue(null);
      } else {
        ev2.pop();
        this.formMenuMensagem.get('mensagem_titulo').patchValue(ev2);
      }
    }
    console.log('mensagem_titulo',ev, ev2);
  }


  mudaTipo(ev, tipo) {
    console.log('mudaTipo', ev, tipo);
  }







  fechar() {
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
