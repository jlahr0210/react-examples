import styles from "./styles.module.scss";
import { LayoutMainColumn } from "../LayoutMainColumn";
import { LayoutMainOneColumnProps } from "./types";
import { Box, Grid } from "@mui/material";
import { isDarkMode } from "@/utils/helpers";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export function LayoutMainOneColumn({ content }: LayoutMainOneColumnProps) {
  const context = useSelector((state: RootState) => state.theme.currentTheme);
  return (
    <Box
      className={`${styles.fullHeight} ${
        isDarkMode(context) && styles.darkMode
      }`}
    >
      <Grid className={styles.fullHeight} container>
        <Grid
          width={`100%`}
          className={`${styles.fullHeight} ${styles.borderLeft}`}
        >
          <LayoutMainColumn>{content}</LayoutMainColumn>
        </Grid>
      </Grid>
    </Box>
  );
}
