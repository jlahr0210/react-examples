import { Box } from "@mui/system";
import { When } from "react-if";
import styles from "./styles.module.scss";
import { isDarkMode } from "@/utils/helpers";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export function PasswordStrength({
  passwordStrength = 0,
  suggestions = [] as string[],
}) {
  const context = useSelector((state: RootState) => state.theme.currentTheme);
  return (
    <Box
      className={`${styles.container} ${
        isDarkMode(context) && styles.darkMode
      }`}
    >
      <Box className={styles.passwordStrengthContainer}>
        <When condition={passwordStrength >= 0}>
          <Box
            className={styles.passwordStrengthBox}
            sx={{ backgroundColor: "#9B2335" }}
          ></Box>
        </When>
        <When condition={passwordStrength >= 2}>
          <Box
            className={styles.passwordStrengthBox}
            sx={{ backgroundColor: "#DD4124" }}
          ></Box>
        </When>
        <When condition={passwordStrength >= 3}>
          <Box
            className={styles.passwordStrengthBox}
            sx={{ backgroundColor: `#34568B` }}
          ></Box>
        </When>
        <When condition={passwordStrength >= 4}>
          <Box
            className={styles.passwordStrengthBox}
            sx={{
              backgroundColor: "#88B04B",
            }}
          ></Box>
        </When>
      </Box>

      <When condition={suggestions.length > 0}>
        <Box className={styles.suggestions}>
          {suggestions.map((suggestion: string, idx: number) => (
            <Box key={idx}>{suggestion}</Box>
          ))}
        </Box>
      </When>
    </Box>
  );
}
