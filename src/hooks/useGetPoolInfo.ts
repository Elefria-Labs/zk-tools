import { useEffect, useState } from 'react';
import JSBI from 'jsbi';
import { Position } from '@uniswap/v3-sdk';

interface PositionInfo {
  tickLower: number;
  tickUpper: number;
  liquidity: JSBI;
  feeGrowthInside0LastX128: JSBI;
  feeGrowthInside1LastX128: JSBI;
  tokensOwed0: JSBI;
  tokensOwed1: JSBI;
}

export const useGetPoolInfo = (): {
  poolInfo: PositionInfo[];
  positionData: Position[][];
} => {
  const [poolInfo, setPoolInfo] = useState<PositionInfo[]>([]);
  const [positionData, setPositionData] = useState<Position[][]>([]);

  useEffect(() => {
    // fetchPoolInfo();
  }, []);

  return { positionData, poolInfo };
};
