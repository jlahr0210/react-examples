import styles from "./styles.module.scss";
import { LayoutProps } from "../types";
import { Box } from "@mui/material";

export function LayoutMainColumn({ children }: LayoutProps) {
  return <Box className={styles.content}>{children}</Box>;
}
