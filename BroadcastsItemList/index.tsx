import styles from "./styles.module.scss";
import { Box } from "@mui/material";
import { When } from "react-if";
import { BroadcastsItem } from "../BroadcastsItem";
import { ConversationItemProps } from "../ConversationItem/types";
import { BroadcastsItemListProps } from "./types";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { isDarkMode } from "@/utils/helpers";
import { LoadMore } from "../LoadMore";

export function BroadcastsItemList({
  broadcasts = [],
  hasMore = false,
  loadMore,
  selectBroadcast,
  type,
  deleteBroadcast,
}: BroadcastsItemListProps) {
  const context = useSelector((state: RootState) => state.theme.currentTheme);
  return (
    <Box className={`${isDarkMode(context) && styles.darkMode}`}>
      <When condition={broadcasts && broadcasts.length === 0}>
        <Box className={styles.noneFound}>No broadcasts found</Box>
      </When>
      <When condition={broadcasts && broadcasts.length > 0}>
        <Box className={styles.container}>
          <Box>
            {broadcasts?.map(
              (broadcast: ConversationItemProps, index: number) => (
                <BroadcastsItem
                  type={type}
                  id={broadcast.id}
                  key={index}
                  body={broadcast.body || ""}
                  subject={broadcast.subject || ""}
                  date={broadcast.date}
                  unformattedDate={broadcast.unformattedDate || ""}
                  hasUnreadMessages={broadcast.hasUnreadMessages}
                  sentTo={broadcast.sentTo || ""}
                  onClick={() => selectBroadcast(broadcast)}
                  onDelete={(id: string) => deleteBroadcast(id)}
                />
              )
            )}
            <When condition={hasMore}>
              <LoadMore action={loadMore} label="Show more broadcasts" />
            </When>
          </Box>
        </Box>
      </When>
    </Box>
  );
}
