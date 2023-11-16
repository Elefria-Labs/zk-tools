import React, { useEffect, useState } from 'react';
import { Td, Tr } from '@chakra-ui/react';
import { ConsolidateGainsType, fixDecimals } from '@components/pools/utils';
import { useGetCoinPrice } from '@hooks/useGetCoinPrice';

type ConsolidatedGainsRowPropsType = {
  gains: ConsolidateGainsType;
};
export default function ConsolidatedGainsRow(
  props: ConsolidatedGainsRowPropsType,
) {
  const { gains } = props;
  const [claimedTotal, setClaimedTotal] = useState(0);
  const [unclaimedTotal, setUnclaimedTotal] = useState(0);
  const { data, loading } = useGetCoinPrice([
    ...Object.keys(gains.claimed),
    ...Object.keys(gains.unclaimed),
  ]);
  useEffect(() => {
    if (data == null) {
      return;
    }
    const claimedUsd = Object.keys(gains.claimed).map((coin) => {
      const priceData = data.filter(
        (d) => d.data.base === coin.toUpperCase(),
      )[0];
      return gains.claimed[coin]! * Number(priceData?.data?.amount ?? 0);
    });
    const unclaimedUsd = Object.keys(gains.unclaimed).map((coin) => {
      const priceData = data.filter(
        (d) => d.data.base === coin.toUpperCase(),
      )[0];
      return gains.unclaimed[coin]! * Number(priceData?.data?.amount ?? 0);
    });
    setClaimedTotal(claimedUsd.reduce((sum, current) => sum + current, 0));
    setUnclaimedTotal(unclaimedUsd.reduce((sum, current) => sum + current, 0));
  }, [data, gains.claimed, gains.unclaimed]);

  return (
    <Tr key="consolidated">
      <Td></Td>
      <Td></Td>
      <Td></Td>
      <Td>{loading ? 'loading...' : fixDecimals(claimedTotal)} USD</Td>
      <Td>{loading ? 'loading...' : fixDecimals(unclaimedTotal)} USD</Td>
    </Tr>
  );
}
