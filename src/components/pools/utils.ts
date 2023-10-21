import { SUPPORTED_CHAINS } from '@uniswap/sdk-core';
import { Position as V3Position, Pool as V3Pool } from '@uniswap/v3-sdk';
import { Token as V3Token } from '@uniswap/sdk-core';
import axios from 'axios';
import bn from 'bignumber.js';

bn.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 });

const Q96 = new bn(2).pow(96);

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

export const getPoolPositionsByIds = async (
  poolIds: string[],

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

export const calculatePositionBasedData = async (p: Position) => {
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
  // const network = getCurrentNetwork();
  const chainId = SUPPORTED_CHAINS[5];
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

    token0Amount,
    token1Amount,
    claimedFee0: Number(claimedFee0).toFixed(6),
    claimedFee1: Number(claimedFee1).toFixed(2),
  };
};
