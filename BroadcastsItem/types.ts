export type BroadcastItemProps = {
  onClick: () => void;
  id: string;
  hasUnreadMessages: boolean;
  date: string;
  body: string;
  subject: string;
  sentTo: string;
  type: "scheduled" | "drafts";
  unformattedDate: string;
  onDelete: (id: string) => void;
};
