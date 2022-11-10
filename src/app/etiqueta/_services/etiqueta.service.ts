// noinspection CssInvalidPropertyValue

import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable,} from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';
import {UrlService} from '../../_services';
import {CadastroEtiquetaI} from "../_models/cadastro-etiqueta-i";
import {EtiquetaCadastroService} from "./etiqueta-cadastro.service";
import {take} from "rxjs/operators";
import {EtiquetaInterface} from "../_models";
import {WindowsService} from "../../_layout/_service";


@Injectable({
  providedIn: 'root',
})
export class EtiquetaService {
  private url: string;
  pw: any = null; // global variable
  sub: Subscription[] = [];
  ht: any;
  cpo = '';
  etq_num: number;
  total = 0;
  public impEtiqueta = new Subject();
  imprimindoVF = false;
  posicao: string = '';

  etq: EtiquetaInterface | null = null;


  constructor(
    private urlService: UrlService,
    private http: HttpClient,
    public ecs: EtiquetaCadastroService,
  ) {
  }

  public getConfigEtiqueta(etq_id: number): Observable<EtiquetaInterface> {
    this.url = this.urlService.etiqueta;
    const url = this.url + '/getid/' + etq_id;
    return this.http.get<EtiquetaInterface>(url);
  }

  postEtiquetas() {
    const url = this.urlService.cadastro + '/listaretiqueta3';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.post<CadastroEtiquetaI[]>(url, this.ecs.busca, httpOptions);
  }

  imprimirEtiqueta(etq: EtiquetaInterface) {
    this.etq = etq;
    const etqsession = 'etiqueta-' + this.etq.etq_id;
    sessionStorage.setItem(etqsession, JSON.stringify(this.etq));
    if (this.pw !== null) {
      this.pw.close();
      this.pw = null;
    }
    if (this.ecs.tplistagem !== 3) {
      this.printSelectedArea();
    } else {
      this.getEtiquetas();
    }
  }

  imprimirEtiqueta2(etq_id: number) {
    const etqsession = 'etiqueta-' + etq_id;
    if (!sessionStorage.getItem(etqsession)) {
      this.getConfigEtiqueta(etq_id)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.etq = dados;
          },
          error: err => console.log('erro', err.toString()),
          complete: () => {
            sessionStorage.setItem(etqsession, JSON.stringify(this.etq));
            if (this.pw !== null) {
              this.pw.close();
              this.pw = null;
            }
            if (this.ecs.tplistagem !== 3) {
              this.printSelectedArea();
            } else {
              this.getEtiquetas();
            }

          }
        });
    } else {
      this.etq = JSON.parse(sessionStorage.getItem(etqsession));
      if (this.pw !== null) {
        this.pw.close();
        this.pw = null;
      }
      if (this.ecs.tplistagem !== 3) {
        this.printSelectedArea();
      } else {
        this.getEtiquetas();
      }
    }
  }

  printSelectedArea(res?: CadastroEtiquetaI[]) {
    if (res === undefined) {
      res = this.ecs.cadastro;
      this.ecs.cadastro = [];
    }
    this.total = +res.length;
    let ht: any = `
    <html lang="pt-BR">
    <head>
    <meta http-equiv=Content-Type content="text/html; charset=utf-8">
    <title>ETIQUETAS</title>
    <style>

    @page {
      background: white;
      display: block;
    }

    @page[size="latter"] {
      width: 215.9mm;
      height: 279.4mm;
    }
    @page[size="latter"][layout="landscape"] {
           width: 279.4mm;
           height: 215.9mm;
         }

    @page[size="A4"] {
           width: 21cm;
           height: 29.7cm;
         }

    @page[size="A4"][layout="landscape"] {
           width: 29.7cm;
           height: 21cm;
         }
    @page[size="A3"] {
           width: 29.7cm;
           height: 42cm;
         }
    @page[size="A3"][layout="landscape"] {
           width: 42cm;
           height: 29.7cm;
         }
    @page[size="A5"] {
           width: 14.8cm;
           height: 21cm;
         }
    @page[size="A5"][layout="landscape"] {
           width: 21cm;
           height: 14.8cm;
         }
    @media print {

  * {
    background: transparent !important;
    color:#000 !important;
    text-shadow: none !important;;
  }

  #contador {
     display: none;
  }


  article.artigo {
    width: 100%;
    padding: 0 !important;
    margin: 0 !important;
  }


  section.etq-secao {
    font-size: 8.0pt!important;
    font-family: 'Verdana', sans-serif;
  }

  section.etq-secao {
    display: block;
    box-sizing: border-box;
    justify-items: center;
    page-break-after: always;
    break-after: page;
  }

  etq-tbody {
    display: block;
  }

  table {
    width: 100%;
    border-collapse:collapse;
    background-color: transparent;
    font-size: 8.0pt!important;
    font-family: 'Verdana', sans-serif;
  }


  td {
    box-sizing: border-box !important;
    border: 1pt solid black;
    overflow: hidden!important;
    text-overflow: clip!important;
  }

  article.artigo {
    width: 100%;
    padding: 0 !important;
    margin: 0 !important;
  }
  section.etq-secao {
    font-size: 8.0pt!important;
    font-family: "Verdana, Arial, Helvetica, sans-serif", 'sans-serif';
  }
  section.etq-secao {
    display: block;
    box-sizing: border-box;
    justify-items: center;
    page-break-after: always;
    break-after: page;
  }

  .etq-secao {
    width: ${(this.etq.etq_folha_horz - (2 * this.etq.etq_margem_lateral))}mm;
    min-height: ${(this.etq.etq_folha_vert - (2 * this.etq.etq_margem_superior))}mm;
    padding: 0;
    margin-top: ${this.etq.etq_margem_superior}mm;
    margin-right: ${this.etq.etq_margem_lateral}mm;
    margin-left: ${this.etq.etq_margem_lateral}mm;
  }

  .linha {
    min-height: ${this.etq.etq_altura}mm;
  }

  .etq-tbody {
    display: block;
  }
  table.etq-tabela {
    width: 100%;
    border-collapse:collapse;
    background-color: transparent;
    font-size: 8.0pt!important;
    font-family: "Verdana, Arial, Helvetica, sans-serif", 'sans-serif';
  }

  .cola{
        width: ${this.etq.etq_largura}mm;
        height: ${this.etq.etq_altura}mm;
        padding-top: 1mm;
        padding-right: 2mm;
        padding-bottom: 1mm;
        padding-left: 2mm;
  }

  .colb{
        width: ${this.etq.etq_distancia_horizontal}mm;
        height: ${this.etq.etq_altura}mm;
        padding-top: 1mm;
        padding-right: 2mm;
        padding-bottom: 1mm;
        padding-left: 2mm;
  }

  .colc{
        width: ${this.etq.etq_largura}mm;
        height: ${this.etq.etq_altura}mm;
        padding-top: 1mm;
        padding-right: 2mm;
        padding-bottom: 1mm;
        padding-left: 2mm;
  }

  .cold{
        width: ${this.etq.etq_largura}mm;
        height: ${this.etq.etq_altura}mm;
        padding-top: 1mm;
        padding-right: 2mm;
        padding-bottom: 1mm;
        padding-left: 2mm;
  }

  .cole{
        width: ${this.etq.etq_distancia_horizontal}mm;
        height: ${this.etq.etq_altura}mm;
        padding-top: 1mm;
        padding-right: 2mm;
        padding-bottom: 1mm;
        padding-left: 2mm;
  }
  }
    @media screen {

      body {
        margin: 0;
        padding: 0;
        line-height: 1.4em;
      }

      article {
        width: 100%;
      }

      section {
        font-size: 10px;
        font-family: "Verdana, Arial, Helvetica, sans-serif", 'sans-serif';
        justify-items: center;
        box-shadow: 5px 10px 8px 5px #888888;
        margin: 15px;
      }

      table {
        width: ${this.etq.etq_folha_horz * 3.78}px;
        border-collapse:collapse;
        background-color: transparent;
      }

      table.etq-tabela {
        width: 100%;
        border-collapse:collapse;
        background-color: transparent;
        font-size: 10px!important;
        font-family: "Verdana, Arial, Helvetica, sans-serif", 'sans-serif';
      }


      .linha {
        height: ${this.etq.etq_altura * 3.78}px;
      }

      .cola {
        width: ${this.etq.etq_largura * 3.78}px;
        padding: 0 1em 0 1em;
        height: ${this.etq.etq_altura * 3.78}px;
      }

      .colb {
        width: ${this.etq.etq_distancia_horizontal * 3.78}px;
        padding: 0 1em 0 1em;
        height: ${this.etq.etq_altura * 3.78}px;
      }

      .colc {
        width:${this.etq.etq_largura * 3.78}px;
        padding: 0 1em 0 1em;
        height: ${this.etq.etq_altura * 3.78}px;
      }

      .cold {
        width: ${this.etq.etq_largura * 3.78}px;
        padding: 0 1em 0 1em;
        height: ${this.etq.etq_altura * 3.78}px;
      }

      .cole {
        width:${this.etq.etq_distancia_horizontal * 3.78}px;
        padding: 0 1em 0 1em;
        height: ${this.etq.etq_altura * 3.78}px;
      }

      td {
        border: 0.5px solid black;
        overflow: hidden!important;
        text-overflow: clip!important;
      }

    }

    #pcard {
      width: fit-content;
    }

    .p-card {
      background: #ffffff;
      color: #000000;
      padding: 5px;
      box-shadow: 5px 10px 8px 5px #888888;
      border-radius: 3px;
      margin: 15px;
    }

    .p-card .p-card-body {
      padding: 5px;
    }

    .p-card .p-card-footer {
      padding: 5px 0 0 0;
    }

    .btn {
      color: #ffffff;
      background: #007bff;
      border: 1px solid #007bff;
      padding: 0.3rem 1rem;
      font-size: .8rem;
      transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
      border-radius: 3px;
    }

    .btn:hover{
      background: #0d89ec;
      color: #ffffff;
      border-color: #0d89ec;
    }

    .btn2 {
      color: #ffffff;
      background: #6c757d;
      border: 1px solid #6c757d;
      padding: 0.3rem 1rem;
      font-size: .8rem;
      transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
      border-radius: 3px;
    }

    .btn2:hover {
      color: #ffffff;
      background: #5a6268;
      border: 1px solid #5a6268;
    }

    table.info {
      width: fit-content;
    }

    .info {
      font-size: 16px;
      font-family: "Arial, Helvetica", 'sans-serif';
    }

    .info td {
      width: fit-content;
      border: 0!important;
      text-align: left;
    }
    .info th {
      width: 4rem;
      border: 0!important;
      padding-right: 5px;
      text-align: right;
    }
</style>
</head>
<body>
<div id="pcard">
  <div></div>
  <div class="p-card">
    <div class="p-card-body">
      <table class="info">
        <tr><th>Marca:</th><td>${this.etq.etq_marca}</td><th>Modelo:</th><td>${this.etq.etq_modelo}</td></tr>
        <tr><th>Folhas:</th><td id="numfolha"></td><th>Etiquetas:</th><td>${this.total}</td></tr>
      </table>
    </div>
    <div class="p-card-footer">
      <button id="imprime" class="btn">IMPRIMIR</button>
      <button id="fecha" class="btn2">FECHAR</button>
    </div>
  </div>
  <div></div>
</div>
<article id="artigo" class="artigo">
	<section id="secao" class="etq-secao">
		<table id="tabela" class="etq-tabela">
		<tbody id="tbd" class="etq-tbody">
			<tr id="linha" class="linha">
				<td id='cola' class="cola">
				</td>
				<td id='colb' class="colb">
					<p>
						<span style='font-size:8.0pt'>&nbsp;</span>
					</p>
				</td>
        `;
    if (this.etq.etq_colunas === 3) {
      ht += `
        <td id='cold' class="cold">
        </td>
        <td id='cole' class="cole">
            <p>
                <span style='font-size:8.0pt'>
                    &nbsp;
                </span>
            </p>
        </td>
        `;
    }
    ht += `
        <td id='colc' class="colc">
        </td>
		</tr>
		</tbody>
		</table>
	</section>
	</article>
</body>
</html>
`;

    // ORIGINAL
    const feat = this.posicao + 'width=' + (this.etq.etq_folha_horz * 4) + ',height=' + (this.etq.etq_folha_vert * 4) + ',scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no';
    this.pw = window.open('', '_blank', feat);

    this.pw.document.write(ht);
    this.pw.document.addEventListener("DOMContentLoaded", (event) => {
    });

    this.pw.onafterprint = () => this.janelaPai(this.pw);

    const imprime = this.pw.document.getElementById('imprime');
    imprime.addEventListener('click', (event) => {
      event.preventDefault();
      let pcard = this.pw.document.getElementById("pcard");
      pcard.remove();
      this.pw.print();
    });

    const fecha = this.pw.document.getElementById('fecha');
    fecha.addEventListener('click', (event) => {
      this.ecs.btnDesativado = false;
      event.preventDefault();
      this.janelaPai(this.pw);
      this.pw.close();
    });


    this.pw.document.close();

    let artigo: any = null;
    let cloneSecao: any = null;
    let cloneTabela: any = null;
    let cloneTbdy: any = null;
    let cloneLinha: any = null;
    let cloneCola: any = null;
    let cloneColb: any = null;
    let cloneColc: any = null;
    let cloneCold: any = null;
    let cloneCole: any = null;

    let ctPagina = 0;
    let ctLinha = 0;
    let ct = 0;

    while (res.length !== 0) {
      cloneSecao = null;
      cloneTabela = null;
      cloneTbdy = null;

      cloneSecao = this.pw.document.getElementById('secao').cloneNode();
      cloneSecao.removeAttribute("id");

      cloneTabela = this.pw.document.getElementById('tabela').cloneNode();
      cloneTabela.removeAttribute("id");

      cloneTbdy = this.pw.document.getElementById('tbd').cloneNode();
      cloneTbdy.removeAttribute("id");

      ctLinha = 0;
      while (+ctLinha < +this.etq.etq_linhas) {
        cloneLinha = null;
        cloneCola = null;
        cloneColb = null;
        cloneColc = null;
        cloneCold = null;
        cloneCole = null;

        cloneLinha = this.pw.document.getElementById('linha').cloneNode();
        cloneLinha.removeAttribute("id");

        cloneCola = this.pw.document.getElementById('cola').cloneNode();
        cloneCola.removeAttribute("id");
        cloneCola.innerHTML = (res.length > 0) ? this.montaCelula(res.shift()) : "";
        cloneLinha.append(cloneCola);
        cloneColb = this.pw.document.getElementById('colb').cloneNode(true);
        cloneColb.removeAttribute("id");
        cloneLinha.append(cloneColb);
        if (this.etq.etq_colunas === 3) {
          cloneCold = this.pw.document.getElementById('cold').cloneNode();
          cloneCold.removeAttribute("id");
          cloneCold.innerHTML = (res.length > 0) ? this.montaCelula(res.shift()) : "";
          cloneLinha.append(cloneCold);
          cloneCole = this.pw.document.getElementById('cole').cloneNode(true);
          cloneCole.removeAttribute("id");
          cloneLinha.append(cloneCole);
        }
        cloneColc = this.pw.document.getElementById('colc').cloneNode();
        cloneColc.removeAttribute("id");
        cloneColc.innerHTML = (res.length > 0) ? this.montaCelula(res.shift()) : "";
        cloneLinha.append(cloneColc);

        cloneTbdy.append(cloneLinha);
        ctLinha++;
        if (+ctLinha === +this.etq.etq_linhas) {
          cloneTabela.append(cloneTbdy);
          cloneSecao.append(cloneTabela);
          artigo = this.pw.document.getElementById('artigo');
          artigo.append(cloneSecao);
          ctPagina++;
          if (res.length === 0) {
            let secao = this.pw.document.getElementById('secao');
            secao.remove();
            this.pw.document.getElementById('numfolha').textContent = ctPagina;
          }

        }
      }
    }


    this.pw.onDOMContentLoaded = (event) => {
      if (this.pw.document.readyState === 'loading') {  // Loading hasn't finished yet
      }
    };

    // this.pw.document.close();
  }

  janelaPai(w: any) {
    this.ecs.btnDesativado = false;
    this.ecs.btnClDesativado = true;
    w.opener.focus();
    let cl = w.opener.document.getElementById('impcl');
    cl.removeAttribute('disabled');
    cl.click();
    w.close();
  }

  montaCelula(cadastro: CadastroEtiquetaI) {
    let str = '';
    // ************ Pessoa Fisica
    if (cadastro.cadastro_tipo_tipo === 1) {
      str += cadastro.cadastro_tratamento_nome + '<br>';
      str += cadastro.cadastro_nome + '<br>';
      str += cadastro.cadastro_endereco;
      if (cadastro.cadastro_endereco_numero !== null) {
        str += ',' + cadastro.cadastro_endereco_numero;
      }
      if (cadastro.cadastro_endereco_complemento !== null) {
        str += ' ' + cadastro.cadastro_endereco_complemento;
      }
      str += '<br>';

      let nc = 0;
      if (cadastro.cadastro_bairro !== null) {
        nc += cadastro.cadastro_bairro.length;
      }
      if (nc > 0) {
        nc += cadastro.cadastro_municipio_nome.length + 2;
        if (nc <= 31) {
          str += cadastro.cadastro_bairro + '  ';
          str += cadastro.cadastro_municipio_nome + '  ';
          str += cadastro.cadastro_estado_nome + '<br>';
          str += cadastro.cadastro_cep;
        } else {
          str += cadastro.cadastro_bairro + '<br>';
          str += cadastro.cadastro_cep + '  ';
          str += cadastro.cadastro_municipio_nome + ' ';
          str += cadastro.cadastro_estado_nome;
        }
      } else {
        str += cadastro.cadastro_municipio_nome + '  ';
        str += cadastro.cadastro_estado_nome + '<br>' + cadastro.cadastro_cep;
      }
    }
    // **************** Pessoa Juridica
    if (cadastro.cadastro_tipo_tipo === 2) {

      if (cadastro.cadastro_responsavel !== null) {
        if (cadastro.cadastro_tratamento_nome !== null) {
          str += cadastro.cadastro_tratamento_nome + '<br>';
          str += cadastro.cadastro_responsavel + '<br>';
        }
      }
      if (cadastro.cadastro_nome !== null) {
        str += cadastro.cadastro_nome + '<br>';
      }
      if (cadastro.cadastro_cargo !== null) {
        if (cadastro.cadastro_cargo !== 'PESSOA JURÍDICA') {
          str += cadastro.cadastro_cargo + '<br>';
        }
      }
      str += cadastro.cadastro_endereco;
      if (cadastro.cadastro_endereco_numero !== null) {
        str += ',' + cadastro.cadastro_endereco_numero;
      }
      if (cadastro.cadastro_endereco_complemento !== null) {
        str += ' ' + cadastro.cadastro_endereco_complemento;
      }
      str += '<br>';
      let nc = 0;
      if (cadastro.cadastro_bairro !== null) {
        nc += cadastro.cadastro_bairro.length;
      }
      if (nc > 0) {
        nc += cadastro.cadastro_municipio_nome.length + 2;
        if (nc <= 31) {
          str += cadastro.cadastro_bairro + '  ';
          str += cadastro.cadastro_municipio_nome + '  ';
          str += cadastro.cadastro_estado_nome + '<br>';
          str += cadastro.cadastro_cep;
        } else {
          str += cadastro.cadastro_bairro + '<br>';
          str += cadastro.cadastro_cep + '  ';
          str += cadastro.cadastro_municipio_nome + ' ';
          str += cadastro.cadastro_estado_nome;
        }
      } else {
        str += cadastro.cadastro_municipio_nome + '  ';
        str += cadastro.cadastro_estado_nome + '<br>' + cadastro.cadastro_cep;
      }
    }
    return str;
  }

  getEtiquetas() {
    this.sub.push(this.postEtiquetas()
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.ecs.numEtqFinal = dados.length;
          this.printSelectedArea(dados);
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {

        }
      })
    );
  }

  ngDestroy() {

  }

}
