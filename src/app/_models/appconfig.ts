export interface AppConfig {
  usuario_uuid?: string | null;
  inputStyle?: string; // 'filled' ou "outlined" -> 'p-input-filled'
  dark?: boolean;
  theme?: string;
  ripple?: boolean;
  scale?: number;  // px
  dispositivo?: string; // 'mobile' ou 'desktop'
}
