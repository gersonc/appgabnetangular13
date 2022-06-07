import { Injectable } from '@angular/core';
import {pdfExporter} from 'quill-to-pdf';
import * as quillToWord from 'quill-to-word';
import * as quill from 'quill';
// import * as Delta from 'Delta';
import {jsPDF} from "jspdf";
import autoTable, {applyPlugin} from "jspdf-autotable";
import {PDFDocument} from "pdf-lib";
import { saveAs } from 'file-saver';


applyPlugin(jsPDF);
@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }
}
