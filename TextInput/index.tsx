import TextField from "@mui/material/TextField";
import "./styles.scss";
import { useState } from "react";
import { TextInputProps } from "./types";
import { RED_E_APP_RED } from "@/utils/constants";
import InputAdornment from "@mui/material/InputAdornment";
import { isDarkMode } from "@/utils/helpers";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Box } from "@mui/material";
import { When } from "react-if";

const style = {
  "& label.Mui-focused": {
    color: RED_E_APP_RED,
  },
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": {
      borderColor: RED_E_APP_RED,
    },
  },
};

export function TextInput({
  onChange,
  onKeyDown,
  onFocus,
  onBlur,
  value,
  label,
  type = "primary",
  className,
  width = "100%",
  size = "small",
  password = false,
  disabled = false,
  showLimitWarning = false,
  id = "",
  placeholder,
  prependIcon,
  appendIcon,
  autoComplete = "on",
  textLength = undefined,
  onAppendIconClick,
}: TextInputProps) {
  const context = useSelector((state: RootState) => state.theme.currentTheme);
  const [charCount, setCharCount] = useState(0);

  const showWarning =
    showLimitWarning && textLength && charCount >= textLength - 20;

  function updateTotalChars(e: React.ChangeEvent<HTMLInputElement>) {
    setCharCount(e.currentTarget.value.length);
    if (onChange) {
      onChange(e);
    }
  }
  return (
    <>
      <TextField
        onKeyDown={onKeyDown}
        onChange={updateTotalChars}
        onFocus={onFocus}
        onBlur={onBlur}
        autoComplete={autoComplete}
        value={value}
        sx={style}
        label={label}
        id={id}
        className={`red-e-text-input red-e-text-input-${type} red-e-text-input-${type}-${
          disabled ? "disabled" : ""
        } ${className || ""} ${
          isDarkMode(context) && `red-e-text-input-${type}-dark`
        }`}
        style={{ width: width }}
        size={size}
        disabled={disabled}
        type={password ? "password" : ""}
        placeholder={placeholder}
        inputProps={{ maxLength: textLength }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">{prependIcon}</InputAdornment>
          ),
          endAdornment: (
            <InputAdornment
              sx={{ cursor: "pointer" }}
              onClick={onAppendIconClick}
              position="end"
            >
              {appendIcon}
            </InputAdornment>
          ),
        }}
      ></TextField>
      <When condition={showWarning}>
        <Box className={`warning`}>
          Character limit: {charCount + `/` + textLength}
        </Box>
      </When>
    </>
  );
}
