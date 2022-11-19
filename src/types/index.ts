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

export interface BlockchainNetwork {
  name: string;
  title?: string;
  chainName: string;
  icon?: string;
  rpcUrls: string[];
  faucets?: string[];
  nativeCurrency: NativeCurrency;
  infoURL: string;
  shortName: string;
  chainId: number;
  networkId: number;
  ens?: Ens;
  blockExplorerUrls?: BlockExplorerUrlsEntity[];
  parent?: any;
  layer?: number;
  isZk?: boolean;
}
export interface NativeCurrency {
  name: string;
  symbol: string;
  decimals: number;
}
export interface Ens {
  registry: string;
}
export interface BlockExplorerUrlsEntity {
  name: string;
  url: string;
  standard?: string;
}
