import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthenticationService, CarregadorService } from "../../_services";
import { UsuarioService } from "../_services/usuario.service";
import { UsuarioInterface } from "../_models/usuario";
import { Subscription } from "rxjs";
import { take } from "rxjs/operators";
import { ConfirmationService, MessageService, SelectItem } from "primeng/api";
import { DropdownService } from "../../_services";

@Component({
  selector: "app-usuario-listar",
  templateUrl: "./usuario-listar.component.html",
  styleUrls: ["./usuario-listar.component.css"],
  providers: [ConfirmationService]
})
export class UsuarioListarComponent implements OnInit, OnDestroy {

  usuarios: UsuarioInterface[] = [];
  usuario?: UsuarioInterface;
  sub: Subscription[] = [];
  resp?: any[];
  botaoEnviarVF = false;
  id: number|undefined|null = 0;

  constructor(
    private messageService: MessageService,
    private cf: ConfirmationService,
    private cs: CarregadorService,
    public alt: AuthenticationService,
    private us: UsuarioService,
    private dd: DropdownService
  ) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.listar();
  }

  listar() {
    this.sub.push(
      this.us.listar()
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.usuarios = dados;
          },
          error: err => console.error("ERRO-->", err),
          complete: () => {
            this.cs.escondeCarregador();
          }
        })
    );
  }

  onIncluir() {
    this.us.novoUsuario();
    this.us.acao = "incluir";
  }

  onAlterar(u: any) {
    this.us.novoUsuario();
    this.us.usuario = u;
    const tmp = this.us.lerAcesso(u.usuario_acesso);
    this.us.acao = "alterar";

  }

  onApagar(u: UsuarioInterface) {
    const mshtmp: string = "Deseja apagar o usuário(a): " + u.usuario_nome;
    this.id = u.usuario_id;
    this.cf.confirm({
      message: mshtmp,
      header: "ATENÇÃO",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.apagar(this.id!);
      }
    });
  }

  strSn(v: number | string | null): string {
    if (v === 1 || v === "1") {
      return "SIM";
    } else {
      return "NÃO";
    }
  }

  apagar(usuario_id: number) {
    this.botaoEnviarVF = true;
    this.cs.mostraCarregador();
    this.sub.push(this.us.apagar(usuario_id)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.resp = dados;
        },
        error: (err) => {
          this.id = 0;
          this.botaoEnviarVF = false;
          this.cs.escondeCarregador();
          this.messageService.add({
            key: "usuarioToast",
            severity: "warn",
            summary: "ERRO APAGAR",
            // @ts-ignore
            detail: this.resp[2]
          });
          console.log(err);
        },
        complete: () => {
          this.id = null;
          this.cs.escondeCarregador();
          // @ts-ignore
          if (this.resp[0]) {
            const tmp = this.usuarios.find(i =>
              i.usuario_id === usuario_id
            );
            if (tmp) {
              this.usuarios!.splice(this.usuarios!.indexOf(tmp), 1);
            }
            this.corrigeDropdown();
            this.messageService.add({
              key: "usuarioToast",
              severity: "success",
              summary: "APAGAR USUÁRIO",
              // @ts-ignore
              detail: this.resp[2]
            });
          } else {
            // @ts-ignore
            console.error("ERRO - APAGAR ", this.resp[2]);
            this.messageService.add({
              key: "usuarioToast",
              severity: "warn",
              summary: "ATENÇÃO - ERRO",
              // @ts-ignore
              detail: this.resp[2]
            });
          }
        }
      })
    );
  }

  corrigeDropdown() {
    if (sessionStorage.getItem("dropdown-usuario")) {
      let dd: SelectItem[]|null = null;
      this.sub.push(this.dd.getDropdownNomeId("usuario", "usuario_id", "usuario_nome").pipe(take(1)).subscribe({
          next: (dados) => {
            dd = dados;
          },
          error: (erro) => {
            console.log(erro);
          },
          complete: () => {
            sessionStorage.removeItem("dropdown-usuario");
            sessionStorage.setItem("dropdown-usuario", JSON.stringify(dd));
          }
        })
      );
    }
  }


  ngOnDestroy(): void {
    console.log("destroi listar");
    this.sub.forEach(s => s.unsubscribe());
  }

}
