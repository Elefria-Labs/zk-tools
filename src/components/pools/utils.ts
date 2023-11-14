/* eslint-disable @typescript-eslint/naming-convention */
import {
  NONFUNGIBLE_POSITION_MANAGER_ADDRESSES,
  Token,
} from '@uniswap/sdk-core';
import { Position as V3Position, Pool as V3Pool } from '@uniswap/v3-sdk';
import { Token as V3Token } from '@uniswap/sdk-core';
import INONFUNGIBLE_POSITION_MANAGER from '@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json';
import axios from 'axios';
import bn from 'bignumber.js';
import { ethers } from 'ethers';

// Attribution: Uniswap fish
bn.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 });
const uriChainIdMap: Record<number, string> = {
  1: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
  137: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon',
  42161: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3-arbitrum',
  8453: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3-base',
  10: 'https://api.thegraph.com/subgraphs/name/ianlapham/optimism-post-regenesis',
  57: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-bsc',
};
const Q96 = new bn(2).pow(96);
const Q128 = new bn(2).pow(128);
const ZERO = new bn(0);
// const poolAddress = Pool.getAddress(
//   poolConfig.pool.token0,
//   poolConfig.pool.token1,
//   poolConfig.pool.fee,
// );

export interface Position {
  id: string;
  tickLower: {
    tickIdx: string;
    feeGrowthOutside0X128: string;
    feeGrowthOutside1X128: string;
  };
  tickUpper: {
    tickIdx: string;
    feeGrowthOutside0X128: string;
    feeGrowthOutside1X128: string;
  };
  depositedToken0: string;
  depositedToken1: string;
  liquidity: string;
  transaction: {
    timestamp: string;
  };
  collectedFeesToken0: string;
  collectedFeesToken1: string;
  feeGrowthInside0LastX128: string;
  feeGrowthInside1LastX128: string;
  token0: {
    decimals: string;
    id: string;
    symbol: string;
  };
  token1: {
    decimals: string;
    id: string;
    symbol: string;
  };
  pool: Pool;
}
export interface Pool {
  id: string;
  token0: {
    id: string;
    symbol: string;
  };
  token1: {
    id: string;
    symbol: string;
  };
  feeTier: string;
  tick: string;
  liquidity: string;
  sqrtPrice: string;
  feeGrowthGlobal0X128: string;
  feeGrowthGlobal1X128: string;
  token0Price: string;
  token1Price: string;
}

const expandDecimals = (n: number | string | bn, exp: number): bn => {
  return new bn(n).multipliedBy(new bn(10).pow(exp));
};
const encodeSqrtPriceX96 = (price: number | string | bn): bn => {
  return new bn(price).sqrt().multipliedBy(Q96).integerValue(3);
};
const mulDiv = (a: bn, b: bn, multiplier: bn) => {
  return a.multipliedBy(b).div(multiplier);
};

// Ref: https://ethereum.stackexchange.com/a/144704
export const calculatePositionFees = (
  pool: Pool,
  position: Position,
  token0: Token | null,
  token1: Token | null,
) => {
  const tickCurrent = Number(pool.tick);
  const tickLower = Number(position.tickLower.tickIdx);
  const tickUpper = Number(position.tickUpper.tickIdx);
  const liquidity = new bn(position.liquidity);

  // Check out the relevant formulas below which are from Uniswap Whitepaper Section 6.3 and 6.4
  // 𝑓𝑟 =𝑓𝑔−𝑓𝑏(𝑖𝑙)−𝑓𝑎(𝑖𝑢)
  // 𝑓𝑢 =𝑙·(𝑓𝑟(𝑡1)−𝑓𝑟(𝑡0))
  // Global fee growth per liquidity '𝑓𝑔' for both token 0 and token 1
  let feeGrowthGlobal_0 = new bn(pool.feeGrowthGlobal0X128);
  let feeGrowthGlobal_1 = new bn(pool.feeGrowthGlobal1X128);

  // Fee growth outside '𝑓𝑜' of our lower tick for both token 0 and token 1
  let tickLowerFeeGrowthOutside_0 = new bn(
    position.tickLower.feeGrowthOutside0X128,
  );
  let tickLowerFeeGrowthOutside_1 = new bn(
    position.tickLower.feeGrowthOutside1X128,
  );

  // Fee growth outside '𝑓𝑜' of our upper tick for both token 0 and token 1
  let tickUpperFeeGrowthOutside_0 = new bn(
    position.tickUpper.feeGrowthOutside0X128,
  );
  let tickUpperFeeGrowthOutside_1 = new bn(
    position.tickUpper.feeGrowthOutside1X128,
  );

  // These are '𝑓𝑏(𝑖𝑙)' and '𝑓𝑎(𝑖𝑢)' from the formula
  // for both token 0 and token 1
  let tickLowerFeeGrowthBelow_0 = ZERO;
  let tickLowerFeeGrowthBelow_1 = ZERO;
  let tickUpperFeeGrowthAbove_0 = ZERO;
  let tickUpperFeeGrowthAbove_1 = ZERO;

  // These are the calculations for '𝑓b(𝑖)' from the formula
  // for both token 0 and token 1
  if (tickCurrent >= tickLower) {
    tickLowerFeeGrowthBelow_0 = tickLowerFeeGrowthOutside_0;
    tickLowerFeeGrowthBelow_1 = tickLowerFeeGrowthOutside_1;
  } else {
    tickLowerFeeGrowthBelow_0 = feeGrowthGlobal_0.minus(
      tickLowerFeeGrowthOutside_0,
    );
    tickLowerFeeGrowthBelow_1 = feeGrowthGlobal_1.minus(
      tickLowerFeeGrowthOutside_1,
    );
  }

  // These are the calculations for '𝑓𝑎(𝑖)' from the formula
  // for both token 0 and token 1
  if (tickCurrent < tickUpper) {
    tickUpperFeeGrowthAbove_0 = tickUpperFeeGrowthOutside_0;
    tickUpperFeeGrowthAbove_1 = tickUpperFeeGrowthOutside_1;
  } else {
    tickUpperFeeGrowthAbove_0 = feeGrowthGlobal_0.minus(
      tickUpperFeeGrowthOutside_0,
    );
    tickUpperFeeGrowthAbove_1 = feeGrowthGlobal_1.minus(
      tickUpperFeeGrowthOutside_1,
    );
  }

  // Calculations for '𝑓𝑟(𝑡1)' part of the '𝑓𝑢 =𝑙·(𝑓𝑟(𝑡1)−𝑓𝑟(𝑡0))' formula
  // for both token 0 and token 1
  let fr_t1_0 = feeGrowthGlobal_0
    .minus(tickLowerFeeGrowthBelow_0)
    .minus(tickUpperFeeGrowthAbove_0);
  let fr_t1_1 = feeGrowthGlobal_1
    .minus(tickLowerFeeGrowthBelow_1)
    .minus(tickUpperFeeGrowthAbove_1);

  // '𝑓𝑟(𝑡0)' part of the '𝑓𝑢 =𝑙·(𝑓𝑟(𝑡1)−𝑓𝑟(𝑡0))' formula
  // for both token 0 and token 1
  let feeGrowthInsideLast_0 = new bn(position.feeGrowthInside0LastX128);
  let feeGrowthInsideLast_1 = new bn(position.feeGrowthInside1LastX128);

  // The final calculations for the '𝑓𝑢 =𝑙·(𝑓𝑟(𝑡1)−𝑓𝑟(𝑡0))' uncollected fees formula
  // for both token 0 and token 1 since we now know everything that is needed to compute it
  let uncollectedFees_0 = mulDiv(
    liquidity,
    fr_t1_0.minus(feeGrowthInsideLast_0),
    Q128,
  );
  let uncollectedFees_1 = mulDiv(
    liquidity,
    fr_t1_1.minus(feeGrowthInsideLast_1),
    Q128,
  );

  // Decimal adjustment to get final results
  let uncollectedFeesAdjusted_0 = uncollectedFees_0.div(
    expandDecimals(1, Number(token0?.decimals || 18)).toFixed(
      Number(token0?.decimals || 18),
    ),
  );
  let uncollectedFeesAdjusted_1 = uncollectedFees_1.div(
    expandDecimals(1, Number(token1?.decimals || 18)).toFixed(
      Number(token1?.decimals || 18),
    ),
  );

  return [
    uncollectedFeesAdjusted_0.toNumber(),
    uncollectedFeesAdjusted_1.toNumber(),
  ];
};
export const getPriceFromTick = (
  tick: number,
  token0Decimal: string,
  token1Decimal: string,
): number => {
  const sqrtPrice = new bn(Math.pow(Math.sqrt(1.0001), tick)).multipliedBy(
    new bn(2).pow(96),
  );
  const token0 = expandDecimals(1, Number(token0Decimal));
  const token1 = expandDecimals(1, Number(token1Decimal));
  const L2 = mulDiv(
    encodeSqrtPriceX96(token0),
    encodeSqrtPriceX96(token1),
    Q96,
  );
  const price = mulDiv(L2, Q96, sqrtPrice)
    .div(new bn(2).pow(96))
    .div(new bn(10).pow(token0Decimal))
    .pow(2);

  return price.toNumber();
};

const queryUniswap = async (query: string, chainId: number): Promise<any> => {
  const url = uriChainIdMap[chainId];
  const { data } = await axios({
    url,
    method: 'post',
    data: {
      query,
    },
  });

  const errors = data.errors;
  if (errors && errors.length > 0) {
    console.error('Uniswap Subgraph Errors', { errors, query });
    throw new Error(`Uniswap Subgraph Errors: ${JSON.stringify(errors)}`);
  }

  return data.data;
};

// const getPoolPositionsByPage = async (
//   poolAddress: string,
//   chainId: number,
//   page: number,
// ): Promise<Position[]> => {
//   try {
//     const res = await queryUniswap(
//       `{
//     positions(where: {
//       pool: "${poolAddress}",
//       liquidity_gt: 0,
//     }, first: 1000, skip: ${page * 1000}) {
//       id
//       tickLower {
//         tickIdx
//         feeGrowthOutside0X128
//         feeGrowthOutside1X128
//       }
//       tickUpper {
//         tickIdx
//         feeGrowthOutside0X128
//         feeGrowthOutside1X128
//       }
//       depositedToken0
//       depositedToken1
//       liquidity
//       collectedFeesToken0
//       collectedFeesToken1
//       feeGrowthInside0LastX128
//       feeGrowthInside1LastX128
//       transaction {
//         timestamp
//       }
//     }
//   }`,
//       chainId,
//     );

//     return res.positions;
//   } catch (e) {
//     return [];
//   }
// };

// export const getPoolPositions = async (
//   poolAddress: string,
// ): Promise<Position[]> => {
//   const PAGE_SIZE = 3;
//   let result: Position[] = [];
//   let page = 0;
//   while (true) {
//     const [p1, p2, p3] = await Promise.all([
//       getPoolPositionsByPage(poolAddress, page),
//       getPoolPositionsByPage(poolAddress, page + 1),
//       getPoolPositionsByPage(poolAddress, page + 2),
//     ]);

//     result = [...result, ...p1, ...p2, ...p3];
//     if (p1.length === 0 || p2.length === 0 || p3.length === 0) {
//       break;
//     }
//     page += PAGE_SIZE;
//   }
//   return result;
// };

export const getPoolDetailsByIds = async (
  poolIds: string[],
  chainId: number,
): Promise<Pool[]> => {
  try {
    // pool: "${poolAddress}",
    const res = await queryUniswap(
      `{
      pool(where:{
        id_in: [${poolIds}]
      }) {
        id
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
        feeTier
        tick
        liquidity
        sqrtPrice
        feeGrowthGlobal0X128
        feeGrowthGlobal1X128
      }
  }`,
      chainId,
    );

    return res.positions;
  } catch (e) {
    return [];
  }
};

export const getPoolPositionsByIds = async (
  poolIds: string[],
  chainId: number,
  page?: number,
): Promise<Position[]> => {
  try {
    // pool: "${poolAddress}",
    const res = await queryUniswap(
      `{
    positions(where: {
      liquidity_gt: 0,
      id_in: [${poolIds}],
    }, first: 1000, skip: ${page ?? 0 * 1000}) {
      id
      pool {
        id
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
        feeTier
        tick
        liquidity
        sqrtPrice
        feeGrowthGlobal0X128
        feeGrowthGlobal1X128
        token0Price
        token1Price
      }
      tickLower {
        tickIdx
        feeGrowthOutside0X128
        feeGrowthOutside1X128
      }
      token0 {
        id
        symbol
        decimals
      }
      token1 {
        id
        symbol
        decimals
      }
      tickUpper {
        tickIdx
        feeGrowthOutside0X128
        feeGrowthOutside1X128
      }
      depositedToken0
      depositedToken1
      liquidity
      collectedFeesToken0
      collectedFeesToken1
      feeGrowthInside0LastX128
      feeGrowthInside1LastX128
      transaction {
        timestamp
      }
    }
  }`,
      chainId,
    );

    return res.positions;
  } catch (e) {
    return [];
  }
};
function fixDecimals(value: number, n: number = 6): number {
  return Number(Number(value).toFixed(n));
}
export const fetchPoolInfo = async (
  address: string,
  provider: ethers.providers.Web3Provider,
): Promise<Position[]> => {
  const chainId = (await provider.getNetwork()).chainId;
  const nfpmContract = new ethers.Contract(
    NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId]!,
    INONFUNGIBLE_POSITION_MANAGER.abi,
    provider,
  );
  let positions;
  try {
    const numPositions = await nfpmContract.balanceOf(address);
    const calls = [];

    for (let i = 0; i < numPositions; i++) {
      calls.push(nfpmContract.tokenOfOwnerByIndex(address, i));
    }

    const positionIds = await Promise.all(calls);
    positions = await getPoolPositionsByIds(positionIds, chainId);
  } catch (error) {
    console.error('Error fetching positions:', error);
  }
  return positions ?? [];
};
type CalculatePositionBasedDataType = {
  key: string;
  positionId: string;
  token0: Position['token0'];
  token1: Position['token0'];
  liquidity: number;
  priceRange: any;
  createdAt: number;
  token0Amount: number;
  token1Amount: number;
  claimedFee0: number;
  claimedFee1: number;
  unclaimedFees0: number;
  unclaimedFees1: number;
};

export const calculatePositionBasedData = async (
  p: Position,
  chainId: number,
): Promise<CalculatePositionBasedDataType> => {
  const lowerTick = Number(p.tickLower.tickIdx);
  const upperTick = Number(p.tickUpper.tickIdx);

  let lowerPrice = getPriceFromTick(
    upperTick,
    p.token0?.decimals || '18',
    p.token1?.decimals || '18',
  );
  let upperPrice = getPriceFromTick(
    lowerTick,
    p.token0?.decimals || '18',
    p.token1?.decimals || '18',
  );
  // Calculate isActive
  // const isActive = currentTick >= lowerTick && currentTick <= upperTick;
  const isPairToggled = false;
  // Calculate createdAt
  const createdAt = Number(p.transaction.timestamp) * 1000;
  // Calculate liquidity
  const tokenA = new V3Token(
    chainId,
    p.token0?.id || '',
    Number(p.token0?.decimals),
  );
  const tokenB = new V3Token(
    chainId,
    p.token1?.id || '',
    Number(p.token1?.decimals),
  );
  // const poolDetails = (await getPoolDetailsByIds([p.pool.id]))[0]!;
  const v3Pool = new V3Pool(
    tokenA,
    tokenB,
    Number(p.pool.feeTier),
    p.pool.sqrtPrice,
    p.pool.liquidity,
    Number(p.pool.tick),
  );
  const position = new V3Position({
    pool: v3Pool,
    liquidity: p.liquidity,
    tickLower: lowerTick,
    tickUpper: upperTick,
  });
  const amount0 = Number(position.amount0.toSignificant(4));
  const amount1 = Number(position.amount1.toSignificant(4));
  const token0Amount = isPairToggled ? amount1 : amount0;
  const token1Amount = isPairToggled ? amount0 : amount1;
  const liquidity =
    token0Amount * Number(p.pool.token0Price) +
    token1Amount * Number(p.pool.token1Price);
  // Calculate earning fee
  const claimedFee0 = isPairToggled
    ? Number(p.collectedFeesToken1)
    : Number(p.collectedFeesToken0);
  const claimedFee1 = isPairToggled
    ? Number(p.collectedFeesToken0)
    : Number(p.collectedFeesToken1);
  const unclaimedFees = await calculatePositionFees(p.pool, p, tokenA, tokenB);
  console.log('unclaimed', unclaimedFees);
  const unclaimedFees0 = isPairToggled ? unclaimedFees[1]! : unclaimedFees[0]!;

  const unclaimedFees1 = isPairToggled ? unclaimedFees[0]! : unclaimedFees[1]!;

  return {
    key: p.id,
    positionId: p.id,
    token0: p.token0,
    token1: p.token1,
    liquidity,
    priceRange: {
      lower: lowerPrice,
      upper: upperPrice,
    },
    createdAt,
    token0Amount: fixDecimals(token0Amount),
    token1Amount: fixDecimals(token1Amount),
    claimedFee0: fixDecimals(claimedFee0),
    claimedFee1: fixDecimals(claimedFee1),
    unclaimedFees0: fixDecimals(unclaimedFees0),
    unclaimedFees1: fixDecimals(unclaimedFees1),
  };
};
type ConsolidateGainsType = {
  claimed: Record<string, number>;
  unclaimed: Record<string, number>;
};
export function consolidateGains(
  positionData: CalculatePositionBasedDataType[],
): ConsolidateGainsType {
  const gains: ConsolidateGainsType = positionData.reduce<ConsolidateGainsType>(
    (prev, curr) => {
      const {
        token0,
        token1,
        claimedFee0,
        claimedFee1,
        unclaimedFees0,
        unclaimedFees1,
      } = curr;

      if (prev.claimed[token0.symbol] != null) {
        prev.claimed[token0.symbol] += claimedFee0;
      } else {
        prev.claimed[token0.symbol] = claimedFee0;
      }
      if (prev.claimed[token1.symbol] != null) {
        prev.claimed[token1.symbol] += claimedFee1;
      } else {
        prev.claimed[token1.symbol] = claimedFee1;
      }

      if (prev.unclaimed[token0.symbol] != null) {
        prev.unclaimed[token0.symbol] += unclaimedFees0 ?? 0;
      } else {
        prev.unclaimed[token0.symbol] = unclaimedFees0;
      }
      if (prev.unclaimed[token1.symbol] != null) {
        prev.unclaimed[token1.symbol] += unclaimedFees1 ?? 0;
      } else {
        prev.unclaimed[token1.symbol] = unclaimedFees1;
      }
      return prev;
    },
    { claimed: {}, unclaimed: {} },
  );

  return gains;
}
