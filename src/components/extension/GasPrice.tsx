import React, { useEffect, useState } from 'react';
import { Flex, Spinner, Text } from '@chakra-ui/react';
import { ethers } from 'ethers';

export default function GasPrice() {
  const [gasFee, setGasFee] = useState<string | null>();

  useEffect(() => {
    const getGasFee = async () => {
      const provider = new ethers.providers.JsonRpcProvider(
        'https://eth.llamarpc.com',
      );
      const gasFeeData = await provider.getFeeData();

      if (gasFeeData.gasPrice) {
        setGasFee(
          ethers.utils
            .formatUnits(gasFeeData.gasPrice.toString(), 'gwei')
            .toString()
            .substring(0, 4),
        );
      }
    };
    getGasFee();
  }, []);
  return (
    <Flex>
      {/* <InfoIcon boxSize={2} /> */}
      <Text size="md">
        Gas: {gasFee ? `${gasFee} Gwei` : <Spinner size="xs" />}
      </Text>
    </Flex>
  );
}
