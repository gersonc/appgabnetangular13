export interface ParagraphProperties {
  spacing?: {
    line?: number;
    before?: number;
    after?: number;
  };
  alignment?: AlignmentType;
  indent?: {
    left?: number;
    hanging?: number;
    right?: number;
  };
}

export interface RunProperties {
  font?: string;
  size?: number;
  bold?: boolean;
  color?: string;
  underline?: {
    type?: UnderlineType;
    color?: string;
  };
  italics?: boolean;
  highlight?: string;
}

export interface CustomLevels {
  level: number;
  format: 'decimal' | 'lowerLetter' | 'lowerRoman' | 'upperRoman' | 'upperLetter' | 'bullet';
  text: string;
  alignment: AlignmentType;
  style?: {
    paragraph?: ParagraphProperties;
    run?: RunProperties;
  };
}

export interface StyleProperties {
  paragraph?: ParagraphProperties;
  run?: RunProperties;
}

export interface StyleConfig {
  normal?: StyleProperties;
  header_1?: StyleProperties;
  header_2?: StyleProperties;
  list_paragraph?: StyleProperties;
  code_block?: StyleProperties;
  block_quote?: StyleProperties;
  citation?: StyleProperties;
}

export interface Config {
  paragraphStyles?: StyleConfig;
  customLevels?: CustomLevels[];
  customBulletLevels?: CustomLevels[];
  exportAs?: 'doc' | 'blob' | 'buffer' | 'base64';
}

export interface NumberedList {
  reference: string;
  levels: CustomLevels[];
}

export interface NumberingConfig {
  config: NumberedList[];
}

export interface InsertEmbed {
  image?: string;
  formula?: string;
  video?: string;
}

export interface RunAttributes {
  script?: 'super' | 'sub';
  color?: string;
  background?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  font?: string;
  link?: string;
  size?: 'small' | 'large' | 'huge';
}

export interface LineAttributes {
  header?: 1 | 2;
  direction?: 'rtl';
  align?: 'right' | 'left' | 'center' | 'justify';
  indent?: number;
  blockquote?: boolean;
  list?: 'ordered' | 'bullet';
  'code-block'?: boolean;
}

export interface Attributes extends RunAttributes, LineAttributes {}

export interface QuillOp {
  insert?: string | InsertEmbed;
  attributes?: Attributes;
  lineAttributes?: LineAttributes;
  runAttributes?: RunAttributes;
}

export interface RawQuillDelta {
  ops: QuillOp[];
}

// OUTPUT

export interface TextRun {
  text: string;
  attributes?: RunAttributes;
}

export interface Paragraph {
  textRuns?: (TextRun | { formula: string })[];
  embed?: InsertEmbed;
  attributes?: LineAttributes;
}

export interface QHyperLink {
  text: string;
  link: string;
}

export interface SetupInfo {
  numberedLists: number;
  hyperlinks: QHyperLink[];
}

export interface ParsedQuillDelta {
  paragraphs: Paragraph[];
  setup: SetupInfo;
}

export enum AlignmentType {
  START = 'start',
  END = 'end',
  CENTER = 'center',
  BOTH = 'both',
  JUSTIFIED = 'both',
  DISTRIBUTE = 'distribute',
  LEFT = 'left',
  RIGHT = 'right',
}

export enum UnderlineType {
  SINGLE = 'single',
  WORDS = 'words',
  DOUBLE = 'double',
  THICK = 'thick',
  DOTTED = 'dotted',
  DOTTEDHEAVY = 'dottedHeavy',
  DASH = 'dash',
  DASHEDHEAVY = 'dashedHeavy',
  DASHLONG = 'dashLong',
  DASHLONGHEAVY = 'dashLongHeavy',
  DOTDASH = 'dotDash',
  DASHDOTHEAVY = 'dashDotHeavy',
  DOTDOTDASH = 'dotDotDash',
  DASHDOTDOTHEAVY = 'dashDotDotHeavy',
  WAVE = 'wave',
  WAVYHEAVY = 'wavyHeavy',
  WAVYDOUBLE = 'wavyDouble',
}

export enum HeadingLevel {
  HEADING_1 = 'Heading1',
  HEADING_2 = 'Heading2',
  HEADING_3 = 'Heading3',
  HEADING_4 = 'Heading4',
  HEADING_5 = 'Heading5',
  HEADING_6 = 'Heading6',
  TITLE = 'Title',
}

export interface InsertEmbed {
  image?: string;
  formula?: string;
  video?: string;
}

export interface RunAttributes {
  script?: 'super' | 'sub';
  color?: string;
  background?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  font?: string;
  link?: string;
  size?: 'small' | 'large' | 'huge';
}

export interface LineAttributes {
  header?: 1 | 2;
  direction?: 'rtl';
  align?: 'right' | 'left' | 'center' | 'justify';
  indent?: number;
  blockquote?: boolean;
  list?: 'ordered' | 'bullet';
  'code-block'?: boolean;
}

export interface Attributes extends RunAttributes, LineAttributes {}

export interface QuillOp {
  insert?: string | InsertEmbed;
  attributes?: Attributes;
  lineAttributes?: LineAttributes;
  runAttributes?: RunAttributes;
}

export interface RawQuillDelta {
  ops: QuillOp[];
}


