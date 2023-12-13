import { ConversationItemProps } from "../ConversationItem/types";

export type BroadcastsItemListProps = {
  broadcasts: ConversationItemProps[];
  hasMore: boolean;
  loadMore: () => void;
  selectBroadcast: (broadcast: ConversationItemProps) => void;
  type: "scheduled" | "drafts";
  deleteBroadcast: (id: string) => void;
};
