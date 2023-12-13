import { Box } from "@mui/material";
import styles from "./styles.module.scss";
import { DirectoryItemProps } from "./types";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedMember } from "@/redux/directory";
import { isDarkMode } from "@/utils/helpers";
import { RootState } from "@/redux/store";
import { Avatar } from "../../basic/Avatar";

export function DirectoryItem({ member }: DirectoryItemProps) {
  const dispatch = useDispatch();
  const context = useSelector((state: RootState) => state.theme.currentTheme);
  function setMember() {
    dispatch(setSelectedMember(member));
  }
  return (
    <>
      <Box
        className={`${styles.container} ${
          isDarkMode(context) && styles.darkMode
        }`}
        onClick={setMember}
      >
        <Avatar
          width={36}
          height={36}
          url={member.account.avatar_url}
          name={member.account.name}
        />
        <Box className={styles.info}>
          <Box className={styles.name}>{member.account.name}</Box>
          <Box className={styles.job}>{member.account.job_title}</Box>
        </Box>
      </Box>
    </>
  );
}
