import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {MenuInternoService} from "../_services";
import {ArquivoService} from "../arquivo/_services";
import {SolicService} from "./_services/solic.service";

@Component({
  selector: 'app-solic',
  templateUrl: './solic.component.html',
  styleUrls: ['./solic.component.css']
})
export class SolicComponent implements OnInit, OnDestroy {
  public altura = (window.innerHeight) + 'px';
  sub: Subscription[] = [];
  public mostraMenuInterno = false;
  cps: string[] = [
    'solicitacao_situacao',
    'solicitacao_status_nome',
    'solicitacao_cadastro_nome',
    'solicitacao_cadastro_tipo_nome',
    'cadastro_endereco',
    'cadastro_endereco_numero',
    'cadastro_endereco_complemento',
    'cadastro_bairro',
    'cadastro_regiao_nome',
    'cadastro_municipio_nome',
    'cadastro_estado_nome',
    'cadastro_email',
    'cadastro_email2',
    'cadastro_telefone',
    'cadastro_telefone2',
    'cadastro_telcom',
    'cadastro_celular',
    'cadastro_celular2',
    'cadastro_fax',
    'solicitacao_data',
    'solicitacao_orgao',
    'solicitacao_assunto_nome',
    'solicitacao_area_interesse_nome',
    'solicitacao_numero_oficio',
    'solicitacao_indicacao_nome',
    'solicitacao_data_atendimento',
    'solicitacao_atendente_cadastro_nome',
    'solicitacao_descricao',
  ];

  constructor(
    public mi: MenuInternoService,
    private ss: SolicService,
    private as: ArquivoService,
  ) { }

  ngOnInit() {
    this.ss.criaTabela();
    // this.ss.getTitulosModulo(this.cps);
    this.sub.push(this.mi.mostraInternoMenu().subscribe(
      vf => {
        this.mostraMenuInterno = vf;
      })
    );
    this.as.getPermissoes();
    if (!sessionStorage.getItem('solic-busca')) {
      this.mi.mudaMenuInterno(true);
    } else {
      if (this.ss.stateSN) {
        this.mi.mudaMenuInterno(false);
      } else {
        this.mi.mudaMenuInterno(true);
      }
    }
  }

  onHide() {
    this.mi.mudaMenuInterno(false);
  }

  ngOnDestroy(): void {
    this.ss.onDestroy();
    this.sub.forEach(s => s.unsubscribe());
  }
}
