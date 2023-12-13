import styles from "./styles.module.scss";
import { Box } from "@mui/material";
import { SelectedConversationPayload } from "@/components/ui/ConversationItem/types";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { sanitizeMessage } from "@/utils/messages";
import { When } from "react-if";
import { formatDateCustom } from "@/utils/formatDate";
import { ClockIcon } from "@/assets/icons/ClockIcon";
import { useState } from "react";
import { openBroadcastDraft, openBroadcastComposer } from "@/redux/broadcast";
import { getBroadcastById } from "@/services/broadcastsService";
import { getUserFromStorage } from "@/utils/user";
import { ConversationMenu } from "../ConversationMenu";
import {
  DARK_GRAY_400,
  DRAFTS,
  RED_E_APP_GREY_500,
  SCHEDULED,
} from "@/utils/constants";
import { deleteMessageService } from "@/services/conversationsService";
import useAuth from "@/hooks/useAuth";
import { BroadcastItemProps } from "./types";
import { isDarkMode } from "@/utils/helpers";

export function BroadcastsItem({
  onClick,
  id,
  hasUnreadMessages = false,
  date,
  body,
  subject,
  sentTo,
  type,
  unformattedDate,
  onDelete,
}: BroadcastItemProps) {
  const selectedConversation: SelectedConversationPayload = useSelector(
    (state: RootState) => state.conversation.selectedConversation
  );
  const context = useSelector((state: RootState) => state.theme.currentTheme);

  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();
  const user = getUserFromStorage();
  const auth = useAuth();

  const isDrafts = type === DRAFTS;
  const isScheduled = type === SCHEDULED;

  async function editDraft() {
    /* pulls up broadcast composer and populates draft */
    const draftData = await getBroadcastById(user.id, id, auth, dispatch);

    if (draftData?.results) {
      dispatch(openBroadcastComposer());
      dispatch(openBroadcastDraft(draftData.results[0]));
    }
  }

  async function deleteMessage() {
    await deleteMessageService(id, auth, dispatch);
    onDelete(id);
  }

  const clockIconColor = isDarkMode(context)
    ? DARK_GRAY_400
    : RED_E_APP_GREY_500;

  return (
    <Box
      onClick={onClick}
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
      id={id}
      className={`${hasUnreadMessages ? styles.bolderText : ""} ${
        isDarkMode(context) && styles.darkMode
      }`}
    >
      <Box
        className={`${styles.broadcast} ${
          id === selectedConversation?.conversation?.id ? styles.selected : ""
        }`}
      >
        <Box className={styles.row}>
          <Box className={styles.participants}>
            <When condition={sentTo}>
              To: <span className={styles.bolderText}>{sentTo}</span>
            </When>
            <When condition={!sentTo}>
              <span className={styles.noRecipients}>No recipients</span>
            </When>
          </Box>
          <When condition={isScheduled && !isHovered}>
            <Box className={`${styles.time} ${styles.bolderText}`}>
              <Box>
                <ClockIcon color={clockIconColor} />
              </Box>
              <Box sx={{ paddingLeft: `3px` }}>
                {formatDateCustom(unformattedDate || "", "MMM DD h:mma")}
              </Box>
            </Box>
          </When>
          <When condition={isHovered}>
            <ConversationMenu
              isDraft={true}
              flagItem={null}
              markItemRead={null}
              muteItem={null}
              deleteItem={deleteMessage}
              editItem={editDraft}
              type={isDrafts ? "Draft" : "Broadcast"}
            />
            <When condition={!isHovered && isDrafts}>
              <Box className={styles.time}>{date}</Box>
            </When>
          </When>
        </Box>
        <Box>
          <Box className={styles.subject}>{subject}</Box>
          <Box className={styles.message}>
            <Box
              className={styles.body}
              dangerouslySetInnerHTML={sanitizeMessage(body || "", true)}
            ></Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
