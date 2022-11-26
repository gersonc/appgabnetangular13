import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {DdService} from "../../_services/dd.service";
import {Subscription} from "rxjs";
import {take} from "rxjs/operators";
import {SelectItem} from "primeng/api";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MensagemFormI} from "../_models/mensagem-form-i";
import Quill from "quill";
import {CpoEditor} from "../../_models/in-out-campo-texto";
import {MensagemOnoffService} from "../../_services/mensagem-onoff.service";
import {MensagemFormService} from "../_services/mensagem-form.service";
import {MsgService} from "../../_services/msg.service";


@Component({
  selector: 'app-mensagem-form',
  templateUrl: './mensagem-form.component.html',
  styleUrls: ['./mensagem-form.component.css']
})
export class MensagemFormComponent implements OnInit, OnDestroy {
  @Output() fechaMensagemForm = new EventEmitter<boolean>();
  private sub: Subscription[] = [];
  displayForm = true;
  ddUsuario_id: SelectItem[] = null;
  formMensagem: FormGroup;
  msgF: MensagemFormI = null;
  botaoEnviarVF = false;
  resp: any[] = [];
  kill: Quill = null;
  kill0: Quill;
  cpoEditor: CpoEditor = null;
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

  constructor(
    private dd: DdService,
    private formBuilder: FormBuilder,
    private mo: MensagemOnoffService,
    private mfs: MensagemFormService,
    private ms: MsgService,
  ) { }

  ngOnInit(): void {
    console.log('MENSAGEM INICIO');
    this.carregaDropdown();
    this.criaForm();
  }

  carregaDropdown() {
    if (!sessionStorage.getItem('dropdown-usuario')) {
      this.sub.push(this.dd.getDd('dropdown-usuario')
        .pipe(take(1))
        .subscribe((dados) => {
            this.ddUsuario_id = dados;
          },
          (err) => console.error(err),
          () => {
            sessionStorage.setItem('dropdown-usuario', JSON.stringify(this.ddUsuario_id));
          }
        )
      );
    } else {
      this.ddUsuario_id= JSON.parse(sessionStorage.getItem('dropdown-usuario'));
    }
  }

  criaForm() {
    this.formMensagem = this.formBuilder.group({
      mensagem_usuario_id: [null, Validators.required],
      mensagem_titulo: [null, Validators.required],
      mensagem_texto: [null],
    });
  }

  onHide() {
    this.mo.msgform = false;
  }

  fechar() {
    this.displayForm = false;
    this.fechaMensagemForm.emit(false);
  }

  reset() {
    this.formMensagem.reset();
    this.formMensagem.get('mensagem_titulo').setValue(null);
    this.formMensagem.get('mensagem_usuario_id').setValue(null);
    this.formMensagem.get('mensagem_texto').setValue(null);
    // this.carregaDropdown();
    // this.botaoEnviarVF = false;
  }

  onSubmit() {
    console.log('onSubmit', this.formMensagem.getRawValue());
    if (this.verificaValidacoesForm(this.formMensagem)) {
      this.botaoEnviarVF = true;
      const m: MensagemFormI = {
        mensagem_titulo: this.formMensagem.get('mensagem_titulo').value,
        mensagem_usuario_id: this.formMensagem.get('mensagem_usuario_id').value,
        mensagem_texto: this.formMensagem.get('mensagem_texto').value
      }
      this.incluir(m);
    }
  }


  incluir(m: MensagemFormI) {
    this.sub.push(this.mfs.incluir(m)
      .pipe(take(1))
      .subscribe((dados) => {
          this.resp = dados;
        },
        (err) => console.error(err),
        () => {
          if (this.resp[0]) {
            this.ms.add({
              key: 'toastprincipal',
              severity: 'success',
              summary: 'INCLUIR MENSSAGEM',
              detail: this.resp[2]
            });
            this.fechar();
          } else {
            console.error('ERRO - INCLUIR ', this.resp[2]);
            this.ms.add({
              key: 'toastprincipal',
              severity: 'warn',
              summary: 'ATENÇÃO - ERRO',
              detail: this.resp[2]
            });
            this.fechar();
          }
        }
      )
    );
  }


  verificaValidTouched(campo: string) {
    return (
      (!this.formMensagem?.get(campo)?.valid || this.formMensagem.get(campo).hasError('required')) &&
      (this.formMensagem?.get(campo)?.touched || this.formMensagem?.get(campo)?.dirty)
    );
  }

  verificaValidacoesForm(formGroup: FormGroup): boolean {
    let ct = 0;
    let ct2 = 0;
    Object.keys(formGroup.controls).forEach(campo => {
      const controle = formGroup.get(campo);
      controle?.markAsDirty();
      controle?.markAsTouched();
      if (controle instanceof FormGroup) {
        this.verificaValidacoesForm(controle);
      }
      if (!controle.valid) {
        ct++;
      }
      ct2++;
    });
    return (ct === 0);
  }

  aplicaCssErro(campo: string) {
    return {
      'ng-invalid': this.verificaValidTouched(campo),
      'ng-dirty': this.verificaValidTouched(campo)
    };
  }

  onEditorCreated(ev) {
      this.kill = ev;
      this.kill.update('user');
  }

  onEditorChanged(ev) {
    console.log('onEditorChanged', ev);
    this.kill = ev;

  }

  onContentChanged(ev) {
    this.cpoEditor = {
      html: ev.html,
      delta: ev.content,
      text: ev.text
    }
  }

  ngOnDestroy() {
    this.sub.forEach(s => {
      s.unsubscribe()
    });
  }

}
