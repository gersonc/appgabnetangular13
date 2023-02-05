export interface AppConfig {
  usuario_uuid?: string | null;
  inputStyle?: string; // 'filled' ou "outlined" -> 'p-input-filled'
  dark?: boolean;
  theme?: string;
  ripple?: boolean;
  scale?: string;  // px
  dispositivo?: string; // 'mobile' ou 'desktop'
}

export interface AppConfigServerI {
  usuario_uuid?: string | null;
  inputstyle?: string; // 'filled' ou "outlined" -> 'p-input-filled'
  dark?: number;
  theme?: string;
  ripple?: number;
  scale?: string;  // px
  dispositivo?: string; // 'mobile' ou 'desktop'
}
