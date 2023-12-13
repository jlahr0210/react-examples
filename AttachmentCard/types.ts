import { AttachmentProps } from "../Attachment/types";

export type AttachmentCardProps = {
  attachment: AttachmentProps;
  removeAttachment?: () => void;
  readonly?: boolean;
};
