import {
  NONFUNGIBLE_POSITION_MANAGER_ADDRESSES,
  SUPPORTED_CHAINS,
} from '@uniswap/sdk-core';
import INONFUNGIBLE_POSITION_MANAGER from '@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json';
import axios from 'axios';
import bn from 'bignumber.js';
import { ethers } from 'ethers';

bn.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 });

const Q96 = new bn(2).pow(96);

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

const queryUniswap = async (query: string): Promise<any> => {
  const { data } = await axios({
    url: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon',
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

const getPoolPositionsByPage = async (
  poolAddress: string,
  page: number,
): Promise<Position[]> => {
  try {
    const res = await queryUniswap(`{
    positions(where: {
      pool: "${poolAddress}",
      liquidity_gt: 0,
    }, first: 1000, skip: ${page * 1000}) {
      id
      tickLower {
        tickIdx
        feeGrowthOutside0X128
        feeGrowthOutside1X128
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
  }`);

    return res.positions;
  } catch (e) {
    return [];
  }
};

export const getPoolPositions = async (
  poolAddress: string,
): Promise<Position[]> => {
  const PAGE_SIZE = 3;
  let result: Position[] = [];
  let page = 0;
  while (true) {
    const [p1, p2, p3] = await Promise.all([
      getPoolPositionsByPage(poolAddress, page),
      getPoolPositionsByPage(poolAddress, page + 1),
      getPoolPositionsByPage(poolAddress, page + 2),
    ]);

    result = [...result, ...p1, ...p2, ...p3];
    if (p1.length === 0 || p2.length === 0 || p3.length === 0) {
      break;
    }
    page += PAGE_SIZE;
  }
  return result;
};

export const getPoolDetailsByIds = async (
  poolIds: string[],
): Promise<Pool[]> => {
  try {
    // pool: "${poolAddress}",
    const res = await queryUniswap(`{
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
  }`);

    return res.positions;
  } catch (e) {
    return [];
  }
};

export const fetchPoolInfo = async (
  address: string,
  provider: ethers.providers.Web3Provider,
): Promise<Position[]> => {
  const nfpmContract = new ethers.Contract(
    NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[SUPPORTED_CHAINS[5]]!,
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
    positions = await getPoolPositionsByIds(positionIds);
    // for (let id of positionIds) {
    //   positions.push(await getPoolPositionsById(id));
    //   // positionCalls.push(nfpmContract.positions(id));
    // }

    // const callResponses = await Promise.all(positionCalls);
    // const positionInfos = callResponses.map((position) => {
    //   return {
    //     tickLower: position.tickLower,
    //     tickUpper: position.tickUpper,
    //     liquidity: JSBI.BigInt(position.liquidity),
    //     feeGrowthInside0LastX128: JSBI.BigInt(
    //       position.feeGrowthInside0LastX128,
    //     ),
    //     feeGrowthInside1LastX128: JSBI.BigInt(
    //       position.feeGrowthInside1LastX128,
    //     ),
    //     tokensOwed0: JSBI.BigInt(position.tokensOwed0),
    //     tokensOwed1: JSBI.BigInt(position.tokensOwed1),
    //   };
    // });
    // setPoolInfo(positionInfos);
  } catch (error) {
    console.error('Error fetching positions:', error);
  }
  return positions ?? [];
};

export const getPoolPositionsByIds = async (
  poolIds: string[],
  poolAddress?: string,
  page?: number,
): Promise<Position[]> => {
  try {
    // pool: "${poolAddress}",
    const res = await queryUniswap(`{
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
  }`);

    return res.positions;
  } catch (e) {
    return [];
  }
};
