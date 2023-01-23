import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {MsgService} from "../../_services/msg.service";
import {Subscription} from "rxjs";
import {OficioService} from "../_services/oficio.service";
import {AuthenticationService} from "../../_services";
import {Stripslashes} from "../../shared/functions/stripslashes";
import {take} from "rxjs/operators";
import {SelectItem} from "primeng/api";
import {CpoEditor} from "../../_models/in-out-campo-texto";
import {ArquivoInterface} from "../../arquivo/_models";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-oficio-analisar',
  templateUrl: './oficio-analisar.component.html',
  styleUrls: ['./oficio-analisar.component.css']
})
export class OficioAnalisarComponent implements OnInit {
  // oficio: OficioInterface;
  formOfi: FormGroup;
  oficio_id: number;
  acao = '';
  resp: any[];
  sub: Subscription[] = [];
  def = false;
  indef = false;
  emand = false;
  botoesDesativados = false;
  botaoEnviarInativo = false;
  ddOficioStatusId: SelectItem[] = [];
  arquivoDesativado = false;
  modulos = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
      [{'header': 1}, {'header': 2}],               // custom button values
      [{'list': 'ordered'}, {'list': 'bullet'}],
      [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
      [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
      [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
      [{'header': [1, 2, 3, 4, 5, 6, false]}],
      [{'color': []}, {'background': []}],          // dropdown with defaults from theme
      [{'font': []}],
      [{'align': []}],
      ['clean']                        // link and image, video
    ]
  };
  cpoEditor: CpoEditor[] | null = [];
  format0: 'html' | 'object' | 'text' | 'json' = 'html';
  formAtivo = true;
  btnAtivo = true;


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public os: OficioService,
    public aut: AuthenticationService,
    private ms: MsgService,
  ) { }

  ngOnInit(): void {
    this.def =  (this.aut.oficio_deferir || this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn || this.os.oficioAnalisar.oficio_status_id === 1);
    this.indef =  (this.aut.oficio_indeferir || this.aut.usuario_principal_sn && this.aut.usuario_responsavel_sn || this.os.oficioAnalisar.oficio_status_id === 2);
    this.emand =  (this.aut.usuario_principal_sn && this.aut.usuario_responsavel_sn || this.os.oficioAnalisar.oficio_status_id === 0);
    this.ddOficioStatusId = [
      {label: 'EM ANDAMENTO', value: 0, disabled: !this.emand},
      {label: 'DEFERIDO', value: 1, disabled: !this.def},
      {label: 'INDEFERIDO', value: 2, disabled: !this.indef}
    ];
    this.criaForm();
  }

  criaForm() {
    this.format0 = 'html';
    this.cpoEditor['historico_andamento'] = null;
    this.formOfi = this.formBuilder.group({
      historico_andamento: [null],
      oficio_status: [this.os.oficioAnalisar.oficio_status_id],
    });

  }

  resetForm() {
    this.criaForm();
  }

  voltar() {
    this.os.stateSN = false;
    sessionStorage.removeItem('oficio-busca');
    this.router.navigate(['/oficio/listar2']);
  }

  stripslashes(str?: string): string | null {
    return Stripslashes(str)
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
    this.os.oficioAnalisar = null;
  }

  /*voltarListar() {
    this.router.navigate(['/oficio/listar/busca']);
  }*/

  onSubmit() {
    this.btnAtivo = false;
    const oficio_status: number = +this.formOfi.get('oficio_status').value;
    if (oficio_status === this.os.oficioAnalisar.oficio_status_id) {
      this.ms.add({
        key: 'toastprincipal',
        severity: 'warn',
        summary: 'ATENÇÃO - ERRO',
        detail: 'REGISTRO SEM ALTERAÇÃO.'
      });
      this.btnAtivo = true;
    } else {
      const dados: any = {
        oficio_id: this.os.oficioAnalisar.oficio_id,
        oficio_status: oficio_status,
        status_anterior: this.os.oficioAnalisar.oficio_status_id,
        oficio_processo_id: this.os.oficioAnalisar.oficio_processo_id,
        historico_andamento: null,
        historico_andamento_delta: null,
        historico_andamento_texto: null
      }
      if (this.cpoEditor['historico_andamento'] !== null) {
        dados.historico_andamento = this.cpoEditor['historico_andamento'].html;
        dados.historico_andamento_delta = JSON.stringify(this.cpoEditor['historico_andamento'].delta);
        dados.historico_andamento_texto = this.cpoEditor['historico_andamento'].text;
      }
      this.analisarOficio(dados);
    }
  }

  analisarOficio(dados: any) {
    this.sub.push(this.os.putOficioAnalisar(dados)
      .pipe(take(1))
      .subscribe({
        next: (dado) => {
          this.resp = dado;
        },
        error: (err) => {
          this.btnAtivo = true;
          this.ms.add({key: 'toastprincipal', severity: 'warn', summary: 'ERRO ANALISAR', detail: this.resp[2]});
          console.log(err);
        },
        complete: () => {
          if (this.resp[0]) {
            this.ms.add({
              key: 'toastprincipal',
              severity: 'success',
              summary: 'ANALISAR OFÍCIO',
              detail: this.resp[2]
            });
            this.os.stateSN = false;
            sessionStorage.removeItem('oficio-busca');
            this.os.oficios[this.os.idx].oficio_status_id = dados.oficio_status;
            this.os.oficios[this.os.idx].oficio_status_nome = this.ddOficioStatusId[dados.oficio_status].label;
            this.router.navigate(['/oficio/listar']);
            // this.voltarListar();
          } else {
            console.error('ERRO - ANALISAR ', this.resp[2]);
            this.ms.add({
              key: 'toastprincipal',
              severity: 'warn',
              summary: 'ATENÇÃO - ERRO',
              detail: this.resp[2]
            });
            this.btnAtivo = true;
          }
        }
      })
    );
  }

  onArquivosGravados(arq: ArquivoInterface[]) {
    console.log('onArquivosGravados', arq);
    arq.forEach(a => {
      this.os.oficioAnalisar.oficio_arquivos.push(a);
      this.os.oficios[this.os.idx].oficio_arquivos.push(a);
    });
  }

  onContentChanged(ev, campo: string) {
    this.cpoEditor[campo] = {
      html: ev.html,
      delta: ev.content,
      text: ev.text
    }
  }

  onPossuiArquivos(ev) {
    console.log('onPossuiArquivos', ev);
  }

  onBlockSubmit(ev) {
    console.log('onBlockSubmit', ev);
    this.btnAtivo = ev;
  }

}
