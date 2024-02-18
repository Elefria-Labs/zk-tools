import {
  ERC20_ABI,
  allChainTokenInfo,
  tokenRegistry,
} from '@config/tokenRegistry';
import {
  createPublicClient,
  Address,
  formatEther,
  formatUnits,
  http,
} from 'viem';
import {
  arbitrum,
  base,
  bsc,
  linea,
  mainnet,
  manta,
  opBNB,
  optimism,
  polygon,
  polygonZkEvm,
  zkSync,
  scroll,
} from 'viem/chains';

const supportChains = [
  polygon,
  mainnet,
  arbitrum,

  polygonZkEvm,
  optimism,
  opBNB,
  bsc,
  base,
  linea,
  scroll,
  zkSync,
  manta,
];
export type ChainBalance = {
  address: string;
  balance: string;
  networkName: string;
  tokens: {
    name: string;
    symbol: string;
    decimals: number;
    balance: string;
    contractAddress: string;
  }[];
};

function getPublicClient(supportChain: typeof supportChains[0]) {
  return createPublicClient({
    chain: supportChain,
    transport: http(),
  });
}

// async function getAllTransferToEventsForAddr(
//   publicClient: any,
//   address: string,
// ) {
//   const filter = await publicClient.createEventFilter({
//     // abi: parseAbi([
//     //   'event Transfer(address indexed, address indexed, uint256)',
//     // ]),
//     abi: ERC20_ABI,
//     strict: true,
//     // event: {
//     //   name: 'Transfer',
//     //   inputs: [
//     //     { type: 'address', indexed: true, name: 'from' },
//     //     { type: 'address', indexed: true, name: 'to' },
//     //     { type: 'uint256', indexed: false, name: 'value' },
//     //   ],
//     // },
//     event: parseAbiItem(
//       'event Transfer(address indexed from, address indexed to, uint256 value)',
//     ),
//     // events: parseAbi([
//     //   'event Transfer(address indexed from, address indexed to, uint256 value)',
//     // ]),
//     // address,
//     args: {
//       from: address,
//     },
//   });

//   // const logs = await publicClient.getContractEvents({
//   //   abi: ERC20_ABI,
//   //   eventName: 'Transfer',
//   //   args: {
//   //     // from: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
//   //     to: address,
//   //   },
//   // });

//   const logs = await publicClient.getFilterLogs({
//     filter,
//   });
//   console.log('logs', logs);
// }

export async function getBalances(
  addresses: Address[],
): Promise<Record<string, ChainBalance>[]> {
  const finalBalances: Record<string, ChainBalance>[] = [];
  for (let i = 0; i < addresses.length; ++i) {
    const currentAddr = addresses[i];
    if (currentAddr == null) {
      continue;
    }
    const allBalancesOfCurrentAddr: Record<string, ChainBalance> = {};
    // let allTokens: any[] = [];
    for (let j = 0; j < supportChains.length; ++j) {
      const client = getPublicClient(supportChains[j]!);

      // await client.createContractEventFilter({
      //   abi: parseAbi([
      //     'event Transfer(address indexed, address indexed, uint256)',
      //   ]),
      //   strict: true,
      //   eventName: 'Transfer',
      //   args: {
      //     to: ['0x'],
      //   },
      // });

      console.log(` supportChains[j]`, supportChains[j]?.network);
      // await getAllTransferToEventsForAddr(client, currentAddr);

      const nativeBalance = await client.getBalance({ address: currentAddr });

      const formatBal = formatEther(nativeBalance);
      console.log('supportChains[j]?.network!', supportChains[j]?.network!);
      const chainTokenAddresses =
        tokenRegistry[supportChains[j]?.network!] ?? [];

      if (supportChains[j]?.network === 'homestead') {
        console.log({ chainTokenAddresses });
      }
      const chainTokens = [];

      for (let j = 0; j < chainTokenAddresses.length; ++j) {
        const currentToken = chainTokenAddresses[j];

        await new Promise((f) => setTimeout(f, 100));
        const tokenBal = await client.readContract({
          address: currentToken.address,
          functionName: 'balanceOf',
          args: [currentAddr],
          abi: ERC20_ABI,
        });

        if (BigInt(tokenBal as bigint) == BigInt(0)) {
          continue;
        }

        const tokenInfo = allChainTokenInfo.filter(
          (t) =>
            t.contractAddress == currentToken.address &&
            t.chainId == supportChains[j]?.id!,
        );

        if (tokenInfo.length == 0) {
          console.log(
            'Token info not found for token address',
            currentToken.address,
          );
          continue;
        }
        const tokenDetails = tokenInfo[0]!;

        chainTokens.push({
          name: tokenDetails.name,
          symbol: tokenDetails.symbol,
          balance: formatUnits(tokenBal as bigint, tokenDetails.decimals),
          decimals: tokenDetails.decimals,
          contractAddress: currentToken.address,
          networkName: supportChains[j]?.network!,
          chainId: supportChains[j]?.id!,
        });
      }
      //  allTokens = [...allTokens, ...chainTokens];
      // no token balances
      if (BigInt(nativeBalance) == BigInt(0) && chainTokens.length == 0) {
        continue;
      }
      allBalancesOfCurrentAddr[supportChains[j]?.id!] = {
        address: currentAddr,
        networkName: supportChains[j]?.network!,
        balance: formatBal.toString(),
        tokens: chainTokens,
      };
    }

    finalBalances.push(allBalancesOfCurrentAddr);
  }
  return finalBalances;
}
