export type ToolsType = {
  id: number;
  category: string;
  name: string;
  description: string;
  tags?: string;
  languages?: string;
  github?: string;
  website?: string;
  twitter?: string;
};

export type AuthorType = {
  username: string;
  name: string;
  twitter: string;
  picture: string;
  bio: string;
};

export type GuideType = {
  id: string;
  title: string;
  description: string;
  isNew: boolean;
  isDraft: boolean;
  createdAt: string;
  updatedAt: string;
  formattedCreatedAt?: string;
  type?: 'visual' | 'textual';
  formattedUpdatedAt?: string;
  authorUsername: string;
  author?: AuthorType;
};
