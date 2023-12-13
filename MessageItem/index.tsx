import { Box } from "@mui/system";
import styles from "./styles.module.scss";
import { sanitizeMessage } from "@/utils/messages";
import { getUserFromStorage } from "@/utils/user";
import { When } from "react-if";
import { formatDateCustom, formatTime } from "@/utils/formatDate";
import { MessageItemProps, ReadBy } from "./types";
import { Attachment } from "../Attachment";
import { AttachmentProps } from "../Attachment/types";
import { useState, useEffect } from "react";
import { ClickAwayListener, Tooltip } from "@mui/material";
import { MessageMenu } from "../MessageMenu";
import { useDispatch, useSelector } from "react-redux";
import { SelectedConversationPayload } from "@/components/ui/ConversationItem/types";
import { RootState } from "@/redux/store";
import { ForwardIcon } from "@/assets/icons/ForwardIcon";
import {
  DARK_GRAY_400,
  DARK_GRAY_700,
  DARK_GRAY_900,
  RED_E_APP_GREY_700,
  RED_E_APP_WHITE,
} from "@/utils/constants";
import {
  hideLoader,
  isDarkMode,
  showLoader,
  showNotifications,
} from "@/utils/helpers";
import { Avatar } from "@/components/basic/Avatar";
import { ShiftsIcon } from "@/assets/icons/ShiftsIcon";
import { customShiftApi } from "@/services/shiftsService";
import useAuth from "@/hooks/useAuth";
import { Shift } from "@/views/Shifts/types";
import { setDialogContent } from "@/redux/dialog";
import { ShiftRequestDetails } from "../ShiftRequestDetails";
import { RequestDetails } from "@/views/ViewShift/types";
import { messageReadService } from "@/services/messagesService";
import { MessageReadDetails } from "../MessageReadDetails";

export function MessageItem({
  message = {} as MessageItemProps,
  forwardable = false,
}) {
  const [showMenuButton, setShowMenuButton] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [receipts, setReceipts] = useState<ReadBy[]>([]);

  const context = useSelector((state: RootState) => state.theme.currentTheme);

  const dispatch = useDispatch();
  const auth = useAuth();

  const user = getUserFromStorage();
  const selectedConversation: SelectedConversationPayload = useSelector(
    (state: RootState) => state.conversation.selectedConversation
  );

  const isYourMessage = message.sender_profile?.owner_id === user.id;
  const isShiftMessage = message.use_case === "shifts_request";
  const isAccountRecipient =
    message.recipients[0]?.recipient_type === "account";

  const messageHasDetails = !isAccountRecipient && isYourMessage;

  async function showShiftDetails() {
    const index = message.body.indexOf("/api/shifts/");
    const apiEndpoint = message.body.substring(index);

    /* if body does not contain the api link */
    if (!apiEndpoint) {
      showNotifications(dispatch, "An error has occurred!", "error");
      return;
    }

    showLoader(dispatch);
    const response = await customShiftApi(apiEndpoint, auth, dispatch);
    hideLoader(dispatch);

    /* in case announcement no longer exists */
    if (!response.announcement) {
      showNotifications(
        dispatch,
        "Could not find shift announcement!",
        "error"
      );
      return;
    }

    const shift: Shift = response.announcement;

    const requestDetails: RequestDetails = {
      comment: response.comment,
      requesting_account: response.requesting_account,
      approver: response.approver,
    };

    shift.announcing_account = response.announcement.announcing_account;
    shift.is_approved = response.is_approved;

    dispatch(
      setDialogContent(
        <Box
          sx={{
            width: `500px`,
            height: `500px`,
            backgroundColor: isDarkMode(context)
              ? DARK_GRAY_900
              : RED_E_APP_WHITE,
          }}
        >
          <ShiftRequestDetails shift={shift} requestDetails={requestDetails} />
        </Box>
      )
    );
  }

  async function showMessageReadDetails() {
    dispatch(
      setDialogContent(
        <Box
          sx={{
            width: `550px`,
            height: `550px`,
            backgroundColor: isDarkMode(context)
              ? DARK_GRAY_900
              : RED_E_APP_WHITE,
          }}
        >
          <MessageReadDetails message={message} />
        </Box>
      )
    );
  }

  async function showMessageDetails() {
    if (isShiftMessage) {
      showShiftDetails();
    } else if (messageHasDetails) {
      showMessageReadDetails();
    }
  }

  useEffect(() => {
    let readBy: ReadBy[] = [];
    if (isYourMessage && message.read_receipts) {
      message.read_receipts.notifications.forEach((receipt) => {
        readBy.push({
          read_at: receipt.read_at,
          avatar_url: receipt.owner_profile.avatar_url,
          name: receipt.owner_profile.name,
        });
      });
    }
    setReceipts(readBy);
  }, []);

  const forwardIconColor = isDarkMode(context)
    ? DARK_GRAY_700
    : RED_E_APP_WHITE;

  const shiftIconColorDark = isYourMessage ? DARK_GRAY_400 : DARK_GRAY_700;
  const shiftIconColorLight = isYourMessage
    ? RED_E_APP_WHITE
    : RED_E_APP_GREY_700;

  const highlighted = selectedConversation.messageId === message.id;

  return (
    <>
      <ClickAwayListener onClickAway={() => setShowMenu(false)}>
        <Box
          onMouseOver={() => setShowMenuButton(true)}
          onMouseOut={() => setShowMenuButton(false)}
          className={`${styles.outerContainer} ${
            isYourMessage ? styles.ownOuter : ""
          } ${
            highlighted
              ? isDarkMode(context)
                ? styles.darkHighlighted
                : styles.highlighted
              : ""
          } ${isDarkMode(context) && styles.darkMode}`}
        >
          <Box>
            <When condition={!isYourMessage}>
              <Box className={styles.avatar}>
                <Box
                  sx={{
                    alignSelf: `flex-end`,
                  }}
                >
                  <Avatar
                    width={30}
                    height={30}
                    url={message.sender_profile?.avatar_url}
                    name={message.sender_profile?.name}
                    borderRadius={10}
                    showTip
                  />
                </Box>
              </Box>
            </When>
          </Box>
          <Box className={styles.infoContainer}>
            <Box>
              <Box className={styles.info}>
                <When condition={!isYourMessage}>
                  <Box sx={{ marginRight: `8px` }}>
                    {message.sender_profile?.name}
                  </Box>
                </When>
                <Box className={`${isYourMessage ? styles.alignRight : ""}`}>
                  {formatTime(message.date)}
                </Box>
              </Box>
            </Box>
            <Box className={styles.messageContainer}>
              {/* MessageMenu is listed twice because of positioning with own vs other message */}
              <When condition={isYourMessage && forwardable}>
                <Box className={styles.menu} onClick={() => setShowMenu(true)}>
                  <When condition={showMenuButton}>
                    <MessageMenu
                      show={showMenu}
                      message={message}
                      hasDetails={messageHasDetails}
                    />
                  </When>
                </Box>
              </When>
              <Box
                className={`${styles.innerContainer} ${
                  isYourMessage ? styles.ownInner : ""
                }`}
                onClick={showMessageDetails}
              >
                <Box className={styles.messageItem}>
                  <When condition={message.forwarded_id}>
                    <Box sx={{ marginRight: `3px` }}>
                      <ForwardIcon color={forwardIconColor} />
                    </Box>
                  </When>
                  <When condition={isShiftMessage}>
                    <Box sx={{ marginRight: `3px`, lineHeight: `12px` }}>
                      <ShiftsIcon
                        color={
                          isDarkMode(context)
                            ? shiftIconColorDark
                            : shiftIconColorLight
                        }
                        width={17}
                        height={17}
                      />
                    </Box>
                  </When>

                  <Box
                    dangerouslySetInnerHTML={sanitizeMessage(
                      isShiftMessage ? message.subject : message.body
                    )}
                  ></Box>
                </Box>
                <When
                  condition={message.forwarded_id && message.forwarded !== null}
                >
                  <Box className={styles.forwardedContainer}>
                    <Box className={styles.forwardedAvatar}>
                      <Avatar
                        url={
                          message.forwarded?.sender_profile?.avatar_url || ""
                        }
                        name={message.forwarded?.sender_profile?.name || ""}
                        width={15}
                        height={15}
                      />
                    </Box>
                    <Box
                      dangerouslySetInnerHTML={sanitizeMessage(
                        message.forwarded?.body || ""
                      )}
                    ></Box>
                  </Box>
                </When>
                <When condition={message.attachments?.length > 0}>
                  <Box>
                    {message.attachments?.map(
                      (attachment: AttachmentProps, idx: number) => (
                        <Box className={styles.attachment} key={idx}>
                          <Attachment
                            attachment={attachment}
                            messageId={message.id}
                          />
                        </Box>
                      )
                    )}
                  </Box>
                </When>
              </Box>
              <When condition={isYourMessage && message.read_receipts !== null}>
                <Box className={styles.receipt}>
                  {receipts.map((receipt: ReadBy, idx: number) => (
                    <Box key={idx} className={styles.readBy}>
                      <Tooltip
                        title={`Read by ${receipt.name} on ${formatDateCustom(
                          receipt.read_at,
                          "LLL"
                        )}`}
                        arrow
                      >
                        <Box>
                          <Avatar
                            url={receipt.avatar_url}
                            name={receipt.name}
                            height={15}
                            width={15}
                          />
                        </Box>
                      </Tooltip>
                    </Box>
                  ))}
                </Box>
              </When>
              <When condition={!isYourMessage && forwardable}>
                <Box className={styles.menu} onClick={() => setShowMenu(true)}>
                  <When condition={showMenuButton}>
                    <MessageMenu show={showMenu} message={message} />
                  </When>
                </Box>
              </When>
            </Box>
          </Box>
        </Box>
      </ClickAwayListener>
    </>
  );
}
