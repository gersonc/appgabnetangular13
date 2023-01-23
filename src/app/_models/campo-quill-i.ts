export interface CampoQuillI {
  campo_html?: string;
  campo_delta?: any;
  campo_txt?: string;
}

export interface HandlerQuillI {
  range: { index: number, length: number },
  oldRange: { index: number, length: number },
  source: string
}
