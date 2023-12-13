import { Box } from "@mui/system";
import { BadgeProps } from "./types";
import styles from "./styles.module.scss";

export function Badge({
  count = 1,
  type = "normal",
  size = "normal",
}: BadgeProps) {
  const totalCount = count > 99 ? "99+" : count;
  return (
    <Box
      className={`${styles.badge} ${type === "count" && styles.count} ${
        size === "small" && styles.small
      }`}
    >
      {totalCount}
    </Box>
  );
}
