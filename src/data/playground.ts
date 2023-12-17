import { Links } from '@config/constants';

export interface Item {
  title: string;
  description: string;
  link: string;
  isBeta?: boolean;
  isExternal?: boolean;
}

export const playgroundToolsList: Item[] = [
  {
    title: 'EVM Visualizer (beta)',
    description: 'Analyze EVM bytecode, slots and storage layout',
    link: Links.evm,
    isBeta: true,
    isExternal: true,
  },
  {
    title: 'ZK Boilerplate',
    description: 'ZK Boilerplate dapps using snarkjs and circom',
    link: Links.boilerplate,
    isBeta: false,
    isExternal: true,
  },
  {
    title: 'EIP 712',
    description:
      'EIP-712 is a protocol for hashing and signing of typed structured data instead of just bytestrings.',
    link: Links.eip712,
    isBeta: false,
  },
  {
    title: 'ERC 191',
    description:
      'This ERC proposes a specification about how to handle signed data in Ethereum contracts.',
    link: Links.erc191,
    isBeta: false,
  },
  {
    title: 'Uniswap V3 (beta)',
    description:
      'Get all V3 positions by address. Supported on Ethereum, Polygon, Optimism & BSC',
    link: Links.pools,
    isBeta: true,
  },
  {
    title: 'Transaction Decoder',
    description:
      'Analyze and decode EVM transactions aiding in transaction analysis and debugging.',
    link: Links.txDecoder,
    isBeta: false,
  },
  {
    title: 'Merkle Tree Generator',
    description:
      'Construct merkle trees and verify proofs using openzeppelin library.',
    link: Links.merkleTreeGenerator,
    isBeta: false,
  },
  {
    title: 'Gas Convertor',
    description:
      'Convert between various gas units (wei, gwei, eth) for smart contracts on the EVM networks.',
    link: Links.gasConverter,
    isBeta: false,
  },
  {
    title: 'Bytes & String Convertor',
    description: 'Convert between strings and bytes.',
    link: Links.byteconversion,
    isBeta: false,
  },
  {
    title: 'Burner Wallet',
    description: 'Generate random private and public key pairs for EVM chains.',
    link: Links.burnerWallet,
    isBeta: false,
  },
  {
    title: 'Deterministic Contracts',
    description:
      'Generate contract address for next contract deployment from an address.',
    link: Links.contractAddressGen,
    isBeta: false,
  },
];
