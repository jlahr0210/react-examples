import { AttachmentProps } from "../Attachment/types";
export type MessageRecipients = {
  id: string;
  recipient_id: string;
  recipient_type?: string;
  profile: {
    name: string;
  };
};
type ReadReceiptNotifications = {
  id: string;
  read: boolean;
  read_at: string;
  owner_profile: {
    avatar_url: string;
    initials: string;
    name: string;
    owner_id: string;
    owner_type: string;
  };
};

export type MessageItemProps = {
  id: string;
  date: string;
  body: string;
  subject: string;
  recipients: MessageRecipients[];
  attachments: AttachmentProps[];
  forwarded_id?: string;
  forwarded?: MessageItemProps;
  use_case?: string;
  status?: string;
  notification?: {
    read: boolean;
  };
  sender_profile: {
    owner_id: string;
    owner_type: string;
    avatar_url: string;
    name: string;
  };
  read_receipts: {
    notifications: ReadReceiptNotifications[];
  };
};

export type ReadBy = {
  read_at: string;
  avatar_url: string;
  name: string;
};
