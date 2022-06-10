export interface CampoQuillI {
  campo_html?: string;
  campo_delta?: any;
  campo_txt?: string;
}

export interface HandlerQuillI {
  range: { index: Number, length: Number },
  oldRange: { index: Number, length: Number },
  source: String
}
