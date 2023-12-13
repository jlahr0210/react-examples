import styles from "./styles.module.scss";
import { LayoutMainColumn } from "../LayoutMainColumn";
import { LayoutMainTwoColumnsProps } from "./types";
import { Box, Grid } from "@mui/material";
import { isDarkMode } from "@/utils/helpers";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export function LayoutMainTwoColumns({
  leftContent,
  rightContent,
}: LayoutMainTwoColumnsProps) {
  const context = useSelector((state: RootState) => state.theme.currentTheme);
  return (
    <Box
      className={`${styles.fullHeight} ${
        isDarkMode(context) && styles.darkMode
      }`}
    >
      <Grid className={styles.fullHeight} container>
        <Grid
          className={`${styles.fullHeight} ${styles.borderLeft}`}
          width={`40%`}
        >
          <LayoutMainColumn>{leftContent}</LayoutMainColumn>
        </Grid>
        <Grid
          className={`${styles.fullHeight} ${styles.borderLeft}`}
          width={`60%`}
        >
          <LayoutMainColumn>{rightContent}</LayoutMainColumn>
        </Grid>
      </Grid>
    </Box>
  );
}
