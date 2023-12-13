import { Box } from "@mui/system";
import styles from "./styles.module.scss";
import { TrashIcon } from "@/assets/icons/TrashIcon";
import { AttachmentCardProps } from "./types";
import { FilePdfIcon } from "@/assets/icons/FilePdfIcon";
import { Case, Default, Switch, When } from "react-if";
import { convertToKb, isDarkMode } from "@/utils/helpers";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { FileImageIcon } from "@/assets/icons/FileImageIcon";
import {
  DARK_GRAY_200,
  DARK_GRAY_400,
  DOC_TYPES,
  IMAGE_TYPES,
  MOVIE_TYPES,
  PDF_TYPES,
  PPT_TYPES,
  RED_E_APP_GREY_700,
  RED_E_APP_RED,
  TEXT_TYPES,
  XLS_TYPES,
} from "@/utils/constants";
import { FileMovieIcon } from "@/assets/icons/FileMovieIcon";
import { FileTextIcon } from "@/assets/icons/FileTextIcon";
import { FileDocIcon } from "@/assets/icons/FileDocIcon";
import { FilePowerpointIcon } from "@/assets/icons/FilePowerpointIcon";
import { FileExcelIcon } from "@/assets/icons/FileExcelIcon";
import { AttachmentIcon } from "@/assets/icons/AttachmentIcon";

export function AttachmentCard({
  attachment,
  removeAttachment = undefined,
  readonly = false,
}: AttachmentCardProps) {
  const context = useSelector((state: RootState) => state.theme.currentTheme);
  function isInType(types: string[]) {
    return types.indexOf(attachment.content_type) !== -1;
  }
  function openAttachment() {
    if (readonly) {
      window.open(attachment.url || "");
    }
  }

  const trashIconColor = isDarkMode(context) ? DARK_GRAY_400 : RED_E_APP_RED;

  return (
    <Box
      className={`${styles.container} ${readonly ? styles.cursorPointer : ""} ${
        isDarkMode(context) && styles.darkMode
      }`}
      onClick={openAttachment}
    >
      <Box className={styles.column} sx={{ width: `15%` }}>
        <Box className={styles.type}>
          <Switch>
            <Case condition={isInType(IMAGE_TYPES)}>
              <FileImageIcon width={18} height={24} />
            </Case>

            <Case condition={isInType(MOVIE_TYPES)}>
              <FileMovieIcon width={18} height={24} />
            </Case>

            <Case condition={isInType(TEXT_TYPES)}>
              <FileTextIcon width={18} height={24} />
            </Case>

            <Case condition={isInType(PDF_TYPES)}>
              <FilePdfIcon width={18} height={24} />
            </Case>

            <Case condition={isInType(DOC_TYPES)}>
              <FileDocIcon width={18} height={24} />
            </Case>

            <Case condition={isInType(PPT_TYPES)}>
              <FilePowerpointIcon width={18} height={24} />
            </Case>

            <Case condition={isInType(XLS_TYPES)}>
              <FileExcelIcon width={18} height={24} />
            </Case>

            <Default>
              <AttachmentIcon width={24} height={24} />
            </Default>
          </Switch>
        </Box>
      </Box>
      <Box className={styles.column} sx={{ width: `70%` }}>
        <Box className={styles.name}>{attachment.filename}</Box>
        <Box className={styles.size}>{convertToKb(attachment.size || 0)}</Box>
      </Box>
      <When condition={readonly === false && removeAttachment !== undefined}>
        <Box className={styles.column} sx={{ width: `15%` }}>
          <Box className={styles.remove} onClick={removeAttachment}>
            <TrashIcon width={25} height={25} color={trashIconColor} />
          </Box>
        </Box>
      </When>
    </Box>
  );
}
