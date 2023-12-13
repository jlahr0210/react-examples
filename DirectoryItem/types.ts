type MemberAccount = {
  profile?: any;
  avatar_url: string;
  name: string;
  job_title?: string;
  initials?: string;
  location?: string;
  bio?: string;
};

export type Member = {
  account_id: string;
  account: MemberAccount;
};

export type DirectoryItemProps = {
  member: Member;
};
