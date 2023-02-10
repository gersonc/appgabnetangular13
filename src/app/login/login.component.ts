import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first, take} from 'rxjs/operators';

// import {AuthenticationService} from '../_services';
import {of, Subscription} from 'rxjs';
import {OnoffLineService} from "../shared/onoff-line/onoff-line.service";
import {AutenticacaoService} from "../_services/autenticacao.service";
import { numbers } from "quill-to-pdf/dist/src/default-styles";
import { telaI } from "../_models/telaI";

function _window(): any {
  // return the global native browser window object
  return window;
}



@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
})

export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loading = false;
  returnUrl: string;
  error = '';
  sub: Subscription[] = [];
  mostraForm = false;


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private as: AutenticacaoService,
    // private authenticationService: AuthenticationService,
    public ol: OnoffLineService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.min(7), Validators.max(50)]]
    });
    /*if (this.as.refLogin()) {
      this.router.navigate(['/']);
    }*/
  }

  ngOnInit() {
    let v: boolean
    /*this.sub.push(this.as.slogin.pipe(take(1)).subscribe({
        next: (vf)=> {
          if (!vf) {
            v = vf;
            this.resetar();
          }
        },
      error: err => {
          console.error(err);
      },
      complete: () => {
          if (v) {
            this.router.navigate(['home']);
          }
      }
      })
    )*/






    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  nativeWindow(): any {
    return _window();
  }

  getScreen(): telaI {
    const w = this.nativeWindow();
    const m = w.screen;
    const n = w.navigator;

    return  {
      height:m.height,
      width: m.width,
      innerWidth: w.innerWidth,
      innerHeight: w.innerHeight,
      availWidth: m.availWidth,
      availHeight: m.availHeight,
      pixelDepth: m.pixelDepth,
      colorDepth: m.colorDepth,
      userAgent: n.userAgent,
      onLine: n.onLine,
      hostname: w.location.hostname,
    };
  }



  submeter() {
    if (this.loginForm.valid) {
      const ss: telaI = this.getScreen();
      this.loading = true;
      const u: string = this.loginForm.get('username').value;
      const s: string = this.loginForm.get('password').value;
      this.enviar(u, s, ss);
    } else {
      this.verificaValidacoesForm(this.loginForm);
    }
  }

  enviar(u: string, s:string, ss: telaI) {
    this.as.login(u, s, ss);
  }

  resetar() {
    this.loginForm.reset();
  }


  verificaValidTouched(campo: string) {
    return (
      !this.loginForm.get(campo).valid &&
      (this.loginForm.get(campo).touched || this.loginForm.get(campo).dirty)
    );
  }

  verificaValidacoesForm(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(campo => {
      const controle = formGroup.get(campo);
      controle.markAsDirty();
      controle.markAsTouched();
      if (controle instanceof FormGroup) {
        this.verificaValidacoesForm(controle);
      }
    });
  }

  aplicaCssErro(campo: string) {
    return {
      'ng-invalid': this.verificaValidTouched(campo),
      'ng-dirty': this.verificaValidTouched(campo)
    };
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
