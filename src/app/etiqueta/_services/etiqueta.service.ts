// noinspection CssInvalidPropertyValue

import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable, ChangeDetectionStrategy, ChangeDetectorRef,} from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';
import { UrlService } from '../../_services';
import { EtiquetaInterface, EtiquetaCelula } from '../_models';
import {CadastroEtiquetaI, CadastroEtiquetaListI} from "../_models/cadastro-etiqueta-i";
import {EtiquetaCadastroService} from "./etiqueta-cadastro.service";
import {CadastroBuscaI} from "../../cadastro/_models/cadastro-busca-i";
import {take} from "rxjs/operators";



@Injectable({
  providedIn: 'root',
})
export class EtiquetaService {
  private etiqueta$: Observable<EtiquetaInterface>;
  private url: string;
  pw: any = null; // global variable
  sub: Subscription[] = [];
  previousURL = null;
  etq_folha_horz: number;
  etq_folha_vert: number;
  etq_margem_superior: number;
  etq_margem_lateral: number;
  etq_distancia_vertical: number;
  etq_distancia_horizontal: number;
  etq_altura: number;
  etq_largura: number;
  etq_linhas: number;
  etq_colunas: number;
  // cadastro: CadastroEtiquetaI[];
  pag: string;
  cel: string;
  esph: string;
  espv: string;
  texto: string;
  ht: any;
  cpo = '';
  etq_num: number;
  total = 0;
  public impEtiqueta = new Subject();
  impEtq$ = this.impEtiqueta.asObservable();

  constructor(
    private urlService: UrlService,
    private http: HttpClient,
    public ecs: EtiquetaCadastroService,
    // private readonly cd: ChangeDetectorRef,
    // private changeDetection: ChangeDetectionStrategy.OnPush
  ) { }

  public getConfigEtiqueta(etq_id: number): Observable<EtiquetaInterface> {
    this.url = this.urlService.etiqueta;
    const url = this.url + '/getid/' + etq_id;
    this.etiqueta$ = this.http.get<EtiquetaInterface>(url);
    return this.etiqueta$;
  }

  public imprimirEtiqueta(etq_id: number) {
    this.getConfigEtiqueta(etq_id).subscribe({
      next: (dados) => {
        this.etq_folha_horz = dados.etq_folha_horz;
        this.etq_folha_vert = dados.etq_folha_vert;
        this.etq_margem_superior = dados.etq_margem_superior;
        this.etq_margem_lateral = dados.etq_margem_lateral;
        this.etq_distancia_vertical = dados.etq_distancia_vertical;
        this.etq_distancia_horizontal = dados.etq_distancia_horizontal;
        this.etq_altura = dados.etq_altura;
        this.etq_largura = dados.etq_largura;
        this.etq_linhas = dados.etq_linhas;
        this.etq_colunas = dados.etq_colunas;
        this.etq_margem_superior = dados.etq_margem_superior;
        this.etq_margem_superior = dados.etq_margem_superior;
        this.etq_margem_superior = dados.etq_margem_superior;
        this.etq_margem_superior = dados.etq_margem_superior;
        this.etq_margem_superior = dados.etq_margem_superior;
      },
      error: err => console.log ('erro', err.toString ()),
      complete: () => {
        // this.impEtiqueta.next();
        this.imprimeEtq();
        /*if (this.ecs.tplistagem !== 3) {
          this.imprimeEtq();
        } else {
          this.getEtiquetas(this.ecs.busca);
        }*/

      }
    });
  }

  pagina () {
    const cssPagina = `display:block;`;
    return cssPagina;
  }

  celula () {
    let cssCelula = `width:${this.etq_largura}mm;`;
    cssCelula += `height:${this.etq_altura}mm;`;
    cssCelula += `padding:2mm 3mm 0;`;
    cssCelula += `float: left;text-align:left;overflow: hidden; background-color: red`;
    return cssCelula;
  }

  espHorz () {
    let cssEspHorz = `width:${this.etq_distancia_horizontal - this.etq_largura}mm;`;
    cssEspHorz += `height:${this.etq_altura}mm;`;
    cssEspHorz += `float: left;overflow: hidden; background-color: green;`;
    return cssEspHorz;
  }

  espVert () {
    let cssEspVert = `height:${this.etq_distancia_vertical - this.etq_altura}mm;`;
    cssEspVert += `page-break-after : auto`;
    return cssEspVert;
  }

  cssTexto () {
    const cssTxt = `font-size:8px;text-transform:uppercase;display:block;`;
    return cssTxt;
  }

  criaCorpo () {
    for (let cad of this.ecs.cadastro) {
      this.cpo += '<div class=\'cel\'>';
      this.cpo += '<div class=\'texto\'>' + cad.cadastro_tratamento_nome + '</div>';
      this.cpo += '<div class=\'texto\'>' + cad.cadastro_nome + '</div>';
      this.cpo += '<div class=\'texto\'>' + cad.cadastro_endereco + ' ';
      this.cpo += cad.cadastro_endereco_numero + ' ';
      this.cpo += cad.cadastro_endereco_complemento + '</div>';
      this.cpo += '<div class=\'texto\'>' + cad.cadastro_cep + ' ';
      this.cpo += cad.cadastro_municipio_nome + ' ';
      this.cpo += cad.cadastro_estado_nome + '</div>';
      this.cpo += '</div>';
      this.cpo += '<div class=\'cssEspVert\'></div>';
    }
  }

  printSelectedArea() {
    if (this.pw !== null) {
      this.pw.close();
      this.pw = null;
      this.printSelectedArea();
    } else {
      this.pw = window.open('',
        '_blank',
        'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no'
      );
      this.pw.document.open();
      this.pw.document.write(this.ht);
      this.pw.document.addEventListener("DOMContentLoaded", (event) => {
        console.log("DOM fully loaded and parsed");

      });
      if (this.ecs.tplistagem !== 3) {
        this.criaLinha();
      } else {
        this.sub.push(this.postEtiquetas()
          .pipe(take(1))
          .subscribe({
            next: (dados) => {
              //this.total = +dados.total.num;
              this.criaLinha2(dados)
            },
            error: (err) => {
              console.error(err);
            },
            complete: () => {
              this.sub.forEach(s => s.unsubscribe());
              this.pw.print();
              this.pw.close();
            }
          })
        );
      }


      this.pw.onDOMContentLoaded = (event) => {
        console.log("DOM fully loaded 111111111", event);
        if (this.pw.document.readyState === 'loading') {  // Loading hasn't finished yet
          console.log("DOM fully loaded 22222222");
        }
      };

      // this.pw.document.close();
    }

    // this.pw.print();
    // this.pw.close();
  }

  printSelectedArea2() {
    const popupWinindow = window.open ('',
      '_blank',
      'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no'
    );
    popupWinindow.document.open ();
    popupWinindow.document.write (this.ht);
    popupWinindow.print();
    popupWinindow.close();
  }

  paginaHtml () {
    this.ht = `
<html>
<head>
<meta http-equiv=Content-Type content="text/html; charset=utf-8">
<title>ETIQUETAS</title>
<style>
@page
{
	size: ${this.etq_folha_horz}mm ${this.etq_folha_vert}mm;
	margin: ${this.etq_margem_superior}mm ${this.etq_margem_lateral}mm 0mm ${this.etq_margem_lateral}mm;
}
body {
	font-size: 8.0pt;
	font-family:"Verdana, Arial, Helvetica, sans-serif",'sans-serif';
}
div.Section1
{
	page:Section1;
	font-size: 8.0pt;
	font-family:"Verdana, Arial, Helvetica, sans-serif",'sans-serif';
}
table {
  page-break-after:always
  border: 0.1px solid #000000;
}

td {
  border: 0.1px solid #000000;
}
</style>
</head>
<body>
	<div class='Section1'>
		<table id="table0" border="0" cellspacing="0" cellpadding="0" style='border-collapse:collapse;'>
		<tbody id="tbd">
			<tr id="linha" style='height:${this.etq_altura}mm;'>
				<td id='cola' style='font-size: 8.0pt; width:${this.etq_largura}mm; padding:0 .75pt 0 .75pt;height:${this.etq_altura}mm'>
				</td>
				<td id='colb' style='width:${this.etq_distancia_horizontal}mm; padding:0 .75pt 0 .75pt;height:${this.etq_altura}mm'>
					<p style='margin-top:0mm; margin-right:4.75pt; margin-bottom:0cm; margin-left:4.75pt; margin-bottom:.0001pt'>
						<span style='font-size:8.0pt'>&nbsp;</span>
					</p>
				</td>
        `;

      if (this.etq_colunas === 3) {
          this.ht += `
        <td id='cold' style='font-size: 8.0pt;width:${this.etq_largura}mm; padding:0cm .75pt 0mm .75pt;height:${this.etq_altura}mm'>
        </td>
        <td id='cole' style='width:${this.etq_distancia_horizontal}mm;padding:0cm .75pt 0mm .75pt;height:${this.etq_altura}mm'>
            <p style='margin-top:0mm;margin-right:4.75pt;margin-bottom:0cm;margin-left:4.75pt;margin-bottom:.0001pt'>
                <span style='font-size:8.0pt'>
                    &nbsp;
                </span>
            </p>
        </td>
        `;
        }
        this.ht += `
        <td id='colc' style='font-size: 8.0pt;width:${this.etq_largura}mm; padding:0cm .75pt 0mm .75pt;height:${this.etq_altura}mm'>
        </td>
		</tr>
		</tbody>
		</table>
	</div>
</body>
</html>
`;
  }

  paginaHtml2 () {
    this.ht = `
<html>
<head>
<meta http-equiv=Content-Type content="text/html; charset=utf-8">
<title>ETIQUETAS</title>
<style>
@page
{
	size: ${this.etq_folha_horz}mm ${this.etq_folha_vert}mm;
	margin: ${this.etq_margem_superior}mm ${this.etq_margem_lateral}mm 0mm ${this.etq_margem_lateral}mm;
}
body {
	font-size: 8.0pt;
	font-family:"Verdana, Arial, Helvetica, sans-serif",'sans-serif';
}
div.Section1
{
	page:Section1;
	font-size: 8.0pt;
	font-family:"Verdana, Arial, Helvetica, sans-serif",'sans-serif';
}
table {
  page-break-after:always
  }
</style>
</head>
<body>
`;
    let a = 0;
    let cad: CadastroEtiquetaI;
    const b = this.ecs.cadastro.length - 1;
    while (this.ecs.cadastro.length > 0) {
      if (a === 0) {
        this.ht += `
	<div class=Section1>
		<table border="0" cellspacing="0" cellpadding="0" style='border-collapse:collapse'>
`;
      }
      if (this.ecs.cadastro.length === 0) {
        this.ht += `<td></td>`;
      } else {
        a++;
        cad = this.ecs.cadastro.shift ();
        this.ht += `
			<tr style='height:${this.etq_altura}mm;'>
				<td id='${a}_${this.etq_num}'
				style='font-size: 8.0pt;
				width:${this.etq_largura}mm;
				padding:0 .75pt 0 .75pt;height:${this.etq_altura}mm'>`;
        this.ht += EtiquetaCelula.montaCelula (cad);
        this.ht += `
				</td>
				<td style='width:${this.etq_distancia_horizontal}mm;
				padding:0 .75pt 0 .75pt;
				height:${this.etq_altura}mm'>
					<p style='margin-top:0mm;
					margin-right:4.75pt;
					margin-bottom:0cm;
					margin-left:4.75pt;
					margin-bottom:.0001pt'>
						<span style='font-size:8.0pt'>
							&nbsp;
						</span>
					</p>
				</td>
`;
      }
      if (this.etq_colunas === 3) {
        if (this.ecs.cadastro.length === 0) {
          this.ht += `<td></td>`;
        } else {
          a++;
          cad = this.ecs.cadastro.shift ();
          this.ht += `
            <td id='${a}_${this.etq_num}'
            style='font-size: 8.0pt;width:${this.etq_largura}mm;
            padding:0cm .75pt 0mm .75pt;height:${this.etq_altura}mm'>`;
          this.ht += EtiquetaCelula.montaCelula (cad);
          this.ht += `
            </td>
            <td style='width:${this.etq_distancia_horizontal}mm;padding:0cm .75pt 0mm .75pt;height:${this.etq_altura}mm'>
                <p style='margin-top:0mm;margin-right:4.75pt;margin-bottom:0cm;margin-left:4.75pt;margin-bottom:.0001pt'>
                    <span style='font-size:8.0pt'>
                        &nbsp;
                    </span>
                </p>
            </td>
            `;
        }
      }
      if (this.ecs.cadastro.length === 0) {
        this.ht += `<td></td>`;
      } else {
        a++;
        cad = this.ecs.cadastro.shift ();
        this.ht += `
        <td
          id='${a}_${this.etq_num}'
          style='font-size: 8.0pt;width:${this.etq_largura}mm;
          padding:0cm .75pt 0mm .75pt;height:${this.etq_altura}mm'
        >`;
        this.ht += EtiquetaCelula.montaCelula (cad);
        this.ht += `
        </td>
		</tr>
        `;
      }
      if (a >= this.etq_num || this.ecs.cadastro.length === 0) {
        a = 0;
        this.ht += `
		</table>
	</div>
    `;
      }
    }
    this.ht += `
</body>
</html>
`;
  }

  imprimeEtq() {
    this.etq_num = this.etq_linhas * this.etq_colunas;
    this.pag = this.pagina ();
    this.cel = this.celula ();
    this.esph = this.espHorz ();
    this.espv = this.espVert ();
    this.texto = this.cssTexto ();
    // this.criaCorpo ();
    this.paginaHtml();
    this.printSelectedArea();
    /*if (this.ecs.tplistagem !== 3) {
      this.total = this.ecs.cadastro.length;
      this.printSelectedArea();
    } else {
      this.getEtiquetas();
    }*/
    return true;
  }

  imprimeEtq2() {
    this.etq_num = this.etq_linhas * this.etq_colunas;
    this.pag = this.pagina ();
    this.cel = this.celula ();
    this.esph = this.espHorz ();
    this.espv = this.espVert ();
    this.texto = this.cssTexto ();
    // this.criaCorpo ();
    this.paginaHtml();
    this.printSelectedArea ();
    return true;
  }

  criaLinha() {

    // const tabela = this.pw.document.getElementById('table0');

    let a = 0;
    let tbdy: any = null;
    let linha: any = null;
    let cloneLinha: any = null;
    let cola: any = null;
    let colb: any = null;
    let colc: any = null;
    let cold: any = null;
    let cole: any = null;
    let cloneCola: any = null;
    let cloneColb: any = null;
    let cloneColc: any = null;
    let cloneCold: any = null;
    let cloneCole: any = null;

    let cad: CadastroEtiquetaI;

    while (this.ecs.cadastro.length > 0) {

      tbdy = this.pw.document.getElementById('tbd');
      linha = this.pw.document.getElementById('linha');
      cloneLinha = linha.cloneNode();
      cloneLinha.setAttribute("id", 'linha' + a);
      cola = this.pw.document.getElementById('cola');
      cloneCola = cola.cloneNode();
      cloneCola.setAttribute("id", 'cola' + a);
      colb = this.pw.document.getElementById('colb');
      cloneColb = colb.cloneNode();
      cloneColb.setAttribute("id", 'colb' + a);
      colc = this.pw.document.getElementById('colc');
      cloneColc = colc.cloneNode();
      cloneColc.setAttribute("id", 'colc' + a);
      if (this.etq_colunas === 3) {
        cold = this.pw.document.getElementById('cold');
        cloneCold = cold.cloneNode();
        cloneCold.setAttribute("id", 'cold' + a);
        cole = this.pw.document.getElementById('cole');
        cloneCole = cole.cloneNode();
        cloneCole.setAttribute("id", 'cole' + a);
      }

      a++;
      cad = this.ecs.cadastro.shift();

      cloneCola.innerHTML = this.montaCelula2(cad);
      cloneLinha.append(cloneCola);
      cloneLinha.append(cloneColb);
      if (this.etq_colunas === 3) {
        if (this.ecs.cadastro.length > 0) {
          cad = this.ecs.cadastro.shift();
          cloneCold.innerHTML = this.montaCelula2(cad);
        }
        cloneLinha.append(cloneCold);
        cloneLinha.append(cloneCole);
      }
      if (this.ecs.cadastro.length > 0) {
        cad = this.ecs.cadastro.shift();
        cloneColc.innerHTML = this.montaCelula2(cad);
      }
      cloneLinha.append(cloneColc);
      tbdy.appendChild(cloneLinha);
      if (this.ecs.cadastro.length === 0) {
        linha = this.pw.document.getElementById('linha');
        linha.remove();
        this.pw.document.close();
      }
    }

  }

  criaLinha2(res: CadastroEtiquetaI[]) {
    // const tabela = this.pw.document.getElementById('table0');
    this.total = +res.length;
    let a = 0;
    let tbdy: any = null;
    let linha: any = null;
    let cloneLinha: any = null;
    let cola: any = null;
    let colb: any = null;
    let colc: any = null;
    let cold: any = null;
    let cole: any = null;
    let cloneCola: any = null;
    let cloneColb: any = null;
    let cloneColc: any = null;
    let cloneCold: any = null;
    let cloneCole: any = null;

    let cad: CadastroEtiquetaI;

    while (res.length > 0) {

      tbdy = this.pw.document.getElementById('tbd');
      linha = this.pw.document.getElementById('linha');
      cloneLinha = linha.cloneNode();
      cloneLinha.setAttribute("id", 'linha' + a);
      cola = this.pw.document.getElementById('cola');
      cloneCola = cola.cloneNode();
      cloneCola.setAttribute("id", 'cola' + a);
      colb = this.pw.document.getElementById('colb');
      cloneColb = colb.cloneNode();
      cloneColb.setAttribute("id", 'colb' + a);
      colc = this.pw.document.getElementById('colc');
      cloneColc = colc.cloneNode();
      cloneColc.setAttribute("id", 'colc' + a);
      if (this.etq_colunas === 3) {
        cold = this.pw.document.getElementById('cold');
        cloneCold = cold.cloneNode();
        cloneCold.setAttribute("id", 'cold' + a);
        cole = this.pw.document.getElementById('cole');
        cloneCole = cole.cloneNode();
        cloneCole.setAttribute("id", 'cole' + a);
      }

      a++;
      cad = res.shift();

      cloneCola.innerHTML = this.montaCelula2(cad);
      cloneLinha.append(cloneCola);
      cloneLinha.append(cloneColb);
      if (this.etq_colunas === 3) {
        if (res.length > 0) {
          cad = res.shift();
          cloneCold.innerHTML = this.montaCelula2(cad);
        }
        cloneLinha.append(cloneCold);
        cloneLinha.append(cloneCole);
      }
      if (res.length > 0) {
        cad = res.shift();
        cloneColc.innerHTML = this.montaCelula2(cad);
      }
      cloneLinha.append(cloneColc);
      tbdy.appendChild(cloneLinha);
      if (res.length === 0) {
        linha = this.pw.document.getElementById('linha');
        linha.remove();
        this.pw.document.close();
      }
    }

  }

  public montaCelula2(cadastro: CadastroEtiquetaI) {
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
          // this.total = +dados.total.num;
          this.criaLinha2(dados)
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {
          this.printSelectedArea()
        }
      })
    );
  }

  postEtiquetas() {
    const url = this.urlService.cadastro + '/listaretiqueta3';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.post<CadastroEtiquetaI[]>(url, this.ecs.busca, httpOptions);
  }

  public async getEtiquetas2(busca: CadastroBuscaI): Promise<void> {
    const url = this.urlService.cadastro + '/listaretiqueta3';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(busca),
      allowHTTP1ForStreamingUpload: true,
    } as any);

    if (response.body == null) {
      throw new Error('Not possible in current scenario');
    }

    const reader = response.body.getReader();

    // const cd = this.cd;
    async function printStream() {
      const { done, value } = await reader.read();
      //const textDecoder = new TextDecoder();
      if (done) {
        return;
      }

        this.pw = window.open('',
          '_blank',
          'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no'
        );
        this.pw.document.open();
        this.pw.document.write(this.ht);
        this.pw.document.addEventListener("DOMContentLoaded", (event) => {
          console.log("DOM fully loaded and parsed");
          this.criaLinha(value);
        });

        this.pw.onDOMContentLoaded = (event) => {
          if (this.pw.document.readyState === 'loading') {  // Loading hasn't finished yet
            console.log("DOM fully loaded and parsed.....");
          } else {  // `DOMContentLoaded` has already fired
            this.criaLinha(value);
          }
        };

        this.pw.document.close();


      this.pw.print();
      this.pw.close();


      // cd.markForCheck();
      await printStream();
    }
    await printStream();
  }
}
