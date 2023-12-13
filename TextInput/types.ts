import { SxProps, Theme } from "@mui/material";

export type TextInputProps = {
  value?: string;
  type?: "primary" | "secondary" | "rounded" | "transparent" | "form";
  label?: string;
  disabled?: boolean;
  password?: boolean;
  className?: string;
  width?: number | string;
  sx?: SxProps<Theme>;
  placeholder?: string;
  prependIcon?: JSX.Element;
  appendIcon?: JSX.Element;
  autoComplete?: "off" | "on" | "one-time-code";
  id?: string;
  showLimitWarning?: boolean;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onAppendIconClick?: () => void;
  size?: "small" | "medium";
  textLength?: number | undefined;
};
