import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ProcFormAnalisar} from "../_model/proc-form-analisar-i";
import {ProceListarI} from "../_model/proce-listar-i";
import {CpoEditor} from "../../_models/in-out-campo-texto";
import {ProceFormService} from "../_services/proce-form.service";
import {ProceService} from "../_services/proce.service";
import {AuthenticationService} from "../../_services";
import {MsgService} from "../../_services/msg.service";
import {Router} from "@angular/router";
import {ArquivoInterface} from "../../arquivo/_models";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-proce-analisar',
  templateUrl: './proce-analisar.component.html',
  styleUrls: ['./proce-analisar.component.css']
})
export class ProceAnalisarComponent implements OnInit, OnDestroy {
  sub: Subscription[] = [];
  formPro: FormGroup;
  procA: ProcFormAnalisar | null = null;
  resp: any[];
  pro?: ProceListarI;
  arquivoDesativado = false;
  formAtivo = true;
  processo_status_id = 0;

  bts: any[] = [
    {value: 1, label: 'EM ANDAMENTO'},
    {value: 2, label: 'INDEFERIDO'},
    {value: 3, label: 'DEFERIDO'},
    {value: 4, label: 'SUSPENSO'},
  ];

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
  format1: 'html' | 'object' | 'text' | 'json' = 'html';
  format2: 'html' | 'object' | 'text' | 'json' = 'html';

  constructor(
    private formBuilder: FormBuilder,
    public pfs: ProceFormService,
    public ps: ProceService,
    public aut: AuthenticationService,
    private ms: MsgService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.processo_status_id = this.pfs.procA.processo_status_id;
    this.criaForm();
  }

  criaForm() {
    this.format0 = 'html';
    this.cpoEditor['historico_andamento'] = null;
    this.cpoEditor['processo_carta'] = null;
    this.cpoEditor['solicitacao_aceita_recusada'] = null;

    this.formPro = this.formBuilder.group({
      processo_carta: [null],
      historico_andamento: [null],
      processo_status_id: [this.pfs.procA.processo_status_id],
    });

  }

  onSubmit() {
    if (this.criaEnvio()) {
      this.sub.push(this.ps.putProcessoAnalisar(this.procA)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: (err) => {
            this.ms.add({
              key: 'toastprincipal',
              severity: 'warn',
              summary: 'ERRO ANALISAR PROCESSO',
              detail: this.resp[2]
            });
            this.formAtivo = true;
            console.error(err);
          },
          complete: () => {
            if (!this.resp[0]) {
              this.ms.add({
                key: 'toastprincipal',
                severity: 'warn',
                summary: 'ERRO ANALISAR PROCESSO',
                detail: this.resp[2]
              });
              this.formAtivo = true;
            } else {
              sessionStorage.removeItem('proce-menu-dropdown');
              if (Array.isArray(this.resp[2])) {
                this.resp[2].forEach(r => {
                  console.log(r);
                  this.ms.add({
                    key: 'toastprincipal',
                    severity: 'success',
                    summary: 'PROCESSO ANALISADO',
                    detail: r
                  });
                });
              }
              this.router.navigate(['/proce/listar']);
            }
          }
        }));
    }
  }

  resetForm() {
    this.formPro.get('processo_status_id').setValue(this.pfs.procA.processo_status_id);
    this.formPro.get('processo_carta').setValue(null);
    this.formPro.get('historico_andamento').setValue(null);
  }

  criaEnvio(): boolean {
    if (+this.pfs.procA.processo_status_id === +this.formPro.get('processo_status_id').value) {
      return false;
    }
    this.formAtivo = false;
    this.procA = this.pfs.procA;
    this.procA.processo_status_id = +this.formPro.get('processo_status_id').value;
    if (this.cpoEditor['processo_carta'] !== undefined && this.cpoEditor['processo_carta'] !== null) {
      this.procA.processo_carta = this.cpoEditor['processo_carta'].html;
      this.procA.processo_carta_delta = JSON.stringify(this.cpoEditor['processo_carta'].delta);
      this.procA.processo_carta_texto = this.cpoEditor['processo_carta'].text;
    }
    if (this.cpoEditor['historico_andamento'] !== undefined && this.cpoEditor['historico_andamento'] !== null) {
      this.procA.historico_andamento = this.cpoEditor['historico_andamento'].html;
      this.procA.historico_andamento_delta = JSON.stringify(this.cpoEditor['historico_andamento'].delta);
      this.procA.historico_andamento_texto = this.cpoEditor['historico_andamento'].text;
    }
    return true;
  }

  voltarListar() {
    this.pfs.processo = null;
    this.pfs.resetProcessoFormAnalisar();
    if (sessionStorage.getItem('proc-busca')) {
      this.router.navigate(['/proce/listar']);
    } else {
      this.router.navigate(['/proce/listar2']);
    }
  }

  onArquivosGravados(arq: ArquivoInterface[]) {
    arq.forEach(a => {
      this.pfs.processo.processo_arquivos.push(a);
    });
  }

  onContentChanged(ev, campo: string) {
    this.cpoEditor[campo] = {
      html: ev.html,
      delta: ev.content,
      text: ev.text
    }
  }

  onChangeBtn(ev) {
    this.processo_status_id = +ev.value;
  }

  getInvalido(): boolean {
    return (+this.processo_status_id === +this.pfs.procA.processo_status_id);
  }

  ngOnDestroy() {
    this.pfs.processo = null;
    this.pfs.procA = null;
    this.sub.forEach(s => s.unsubscribe());
  }


}
