import { Box } from "@mui/material";
import { When } from "react-if";
import styles from "./styles.module.scss";
import { ProfileEmptyStateIcon } from "@/assets/icons/ProfileEmptyStateIcon";
import { useDispatch, useSelector } from "react-redux";
import { Member } from "../DirectoryItem/types";
import { RootState } from "@/redux/store";
import { AppButton } from "@/components/basic/AppButton";
import { MessageIcon } from "@/assets/icons/MessageIcon";
import {
  closeDirectoryReducer,
  setSelectedMember,
  setSendMessageTo,
} from "@/redux/directory";
import { CloseIcon } from "@/assets/icons/CloseIcon";
import { setSelectedConversation } from "@/redux/conversation";
import { setIsComposing } from "@/redux/compose";
import {
  DARK_GRAY_400,
  RED_E_APP_GREY_400,
  RED_E_APP_GREY_700,
  RED_E_APP_WHITE,
} from "@/utils/constants";
import { getNetworkProfileFields, isDarkMode } from "@/utils/helpers";
import { Avatar } from "../../basic/Avatar";
import { Empty } from "../Empty";
import { AccountProfileFields } from "../NetworkSelector/types";

export function MemberProfile() {
  const selectedNetwork = useSelector(
    (state: RootState) => state.networks.currentNetwork
  );
  const profileFields: AccountProfileFields[] =
    getNetworkProfileFields(selectedNetwork);
  const dispatch = useDispatch();
  const context = useSelector((state: RootState) => state.theme.currentTheme);
  const member: Member | null = useSelector(
    (state: RootState) => state.directory.selectedMember
  );
  function findFieldValue(field: AccountProfileFields) {
    return member?.account.profile[field.name];
  }
  function closeProfile() {
    dispatch(setSelectedMember(null));
  }
  function sendMessage() {
    dispatch(setIsComposing(true));
    dispatch(setSelectedMember(null));
    dispatch(closeDirectoryReducer());
    dispatch(setSelectedConversation({ conversation: null, messageId: null }));
    dispatch(setSendMessageTo(member));
  }

  const closeIconColor = isDarkMode(context)
    ? DARK_GRAY_400
    : RED_E_APP_GREY_700;

  const emptyIconColor = isDarkMode(context)
    ? DARK_GRAY_400
    : RED_E_APP_GREY_400;

  return (
    <>
      <When condition={member !== null}>
        <Box
          className={`${styles.memberContainer} ${
            isDarkMode(context) && styles.darkMode
          }`}
        >
          <Box className={styles.header}>
            <Box className={styles.close} onClick={closeProfile}>
              <CloseIcon color={closeIconColor} />
            </Box>
            <Box className={styles.profileLabel}>Profile</Box>
          </Box>

          <Box className={styles.body}>
            <Box className={styles.bodyTop}>
              <Box>
                <Box>
                  <Avatar
                    width={215}
                    height={215}
                    url={member?.account.avatar_url || ""}
                    name={member?.account.name || ""}
                    borderRadius={20}
                  />
                </Box>
              </Box>
              <Box className={styles.bodyTopRight}>
                <Box className={styles.name}>{member?.account.name}</Box>
                {/* <Box className={styles.job}>{member?.account.job_title}</Box> */}
                <Box className={styles.messageBtn}>
                  <AppButton
                    label="Message"
                    type="secondary"
                    size="small"
                    className={styles.messageButton}
                    sx={{ width: `150px` }}
                    onClick={sendMessage}
                    prependIcon={<MessageIcon color={RED_E_APP_WHITE} />}
                  />
                </Box>
              </Box>
            </Box>
            <Box className={styles.bodyBottom}>
              {profileFields.map((field: AccountProfileFields, idx: number) => {
                return (
                  findFieldValue(field) && (
                    <Box className={styles.profileField} key={idx}>
                      <Box className={styles.emoji}>{field.emoji}</Box>
                      <Box className={styles.title}>{field.name}: </Box>
                      <Box className={styles.value}>
                        {member?.account.profile[field.name]}
                      </Box>
                    </Box>
                  )
                );
              })}
            </Box>
          </Box>
        </Box>
      </When>
      <When condition={member === null}>
        <Empty icon={<ProfileEmptyStateIcon color={emptyIconColor} />} />
      </When>
    </>
  );
}
