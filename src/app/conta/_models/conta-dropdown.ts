import { Injectable } from '@angular/core';
import { SelectItem } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ContaDropdown {

  constructor() {}

  ddConta_tipo: SelectItem[] = [
    {label: 'VARIÁVEL', value: 1},
    {label: 'FIXA', value: 0},
  ];

  ddConta_debito_automatico: SelectItem[] = [
    {label: 'SIM', value: 1},
    {label: 'NÃO', value: 0},
  ];

  ddConta_paga: SelectItem[] = [
    {label: 'SIM', value: 1},
    {label: 'NÃO', value: 0},
    {label: 'DEBT. AUT.', value: 2},
  ];

  ddRptdia: SelectItem[] = [
    {label: 'NÃO', value: 0},
    {label: 'DIARIAMENTE', value: 1},
    {label: 'SEMANALMENTE', value: 2},
    {label: 'MENSALMENTE', value: 3},
    {label: 'TRIMESTRALMENTE', value: 4},
    {label: 'SEMESTRALMENTE', value: 5},
    {label: 'ANUALMENTE', value: 6},
  ];

  ddParcelas: SelectItem[] = [
    // {label: 'Pgto. Unico', value: 1},
    {label: '2', value: 2},
    {label: '3', value: 3},
    {label: '4', value: 4},
    {label: '5', value: 5},
    {label: '6', value: 6},
    {label: '7', value: 7},
    {label: '8', value: 8},
    {label: '9', value: 9},
    {label: '10', value: 10},
    {label: '11', value: 11},
    {label: '12', value: 12}
  ];
}
