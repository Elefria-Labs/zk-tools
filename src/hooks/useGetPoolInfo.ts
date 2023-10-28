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

const address = '0x834e46b5d28774C0AfeE6b2D96c15F55902B0117';
const test =
  'https://polygon-mainnet.infura.io/v3/6a22e5ded7f24c9e8998ae1205d4e663';

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
