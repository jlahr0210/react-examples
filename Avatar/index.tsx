import { Box } from "@mui/system";
import styles from "./styles.module.scss";
import { Image } from "@/components/basic/Image";
import { AvatarProps } from "./types";
import { When } from "react-if";
import { getAvatarImage, getInitials, isDarkMode } from "@/utils/helpers";
import { Tooltip } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export function Avatar({
  url,
  width,
  height,
  borderRadius,
  name = null,
  showTip = false,
}: AvatarProps) {
  const context = useSelector((state: RootState) => state.theme.currentTheme);
  /* borderRadius can be defined otherwise use width to decide */
  const borderRad = (borderRadius || Math.floor(width / 4.5)) + "px";
  /* easy formula to decide font size for initials */
  const initialsFontSize = width / 2.2;

  const circleColor = isDarkMode(context)
    ? "rgb(189,189,189)"
    : "rgb(148,163,184)";

  const avatarUrl = getAvatarImage(url);
  return (
    <Tooltip title={showTip ? name || null : null} placement="top" arrow>
      <Box
        className={styles.avatarContainer}
        sx={{ height: `${height}px`, width: `${width}px` }}
      >
        <Box
          className={styles.avatar}
          sx={{ height: `${height}px`, width: `${width}px` }}
        >
          <When condition={avatarUrl !== null}>
            <Image
              width={width}
              height={height}
              src={avatarUrl || ""}
              borderRadius={borderRad}
            />
          </When>
          <When condition={avatarUrl === null && name !== null}>
            {/* Tooltip causes glitch when using background color so did svg as workaround */}
            <Box
              sx={{
                width: `${width}px`,
                height: `${height}px`,
                fontSize: `${initialsFontSize}px`,
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='${circleColor}' width='100' height='100' rx='25' /%3E%3C/svg%3E")`,
              }}
              className={styles.initials}
            >
              {getInitials(name)}
            </Box>
          </When>
        </Box>
      </Box>
    </Tooltip>
  );
}
