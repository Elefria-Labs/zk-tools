import React, { useEffect, useState } from 'react';
import {
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import { CopyIcon } from '@chakra-ui/icons';
import { useGetCoinPrice } from '@hooks/useGetCoinPrice';
import { useGetBaseFee } from '@hooks/useGetBaseFee';

function calculateValue(ethAmount: string, gasPrice: string): string {
  const ethValue = ethers.utils.parseEther(ethAmount.toString());
  const value = ethValue.mul(ethers.utils.parseUnits(gasPrice.toString(), 18));

  return ethers.utils.formatUnits(value, 18 * 2); // Convert the value to a human-readable format
}

export default function GasConvertorComponent() {
  const [weiValue, setWeiValue] = useState<string>('');
  const [gweiValue, setGweiValue] = useState<string>('');
  const [ethValue, setEthValue] = useState<string>('');

  const {
    data: ethPrice,
    // loading: isPriceLoading,
    // error: priceError,
  } = useGetCoinPrice(['eth']);
  const isValid = (value: string) => {
    return !(value == '' || BigInt(value) < 0);
  };
  const { gasDetails } = useGetBaseFee();

  const handleWeiChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const weiValue = event.target.value;
      if (!isValid(weiValue)) {
        return;
      }
      setWeiValue(weiValue);
      const gweiValue = ethers.utils.formatUnits(weiValue.toString(), 'gwei');
      setGweiValue(gweiValue);
      const eth = ethers.utils.formatUnits(weiValue.toString(), 'ether');
      setEthValue(eth);
    } catch (e) {
      console.log('error', e);
    }
  };

  const handleGweiChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const gweiValue = event.target.value;
    if (!isValid(gweiValue)) {
      return;
    }
    setGweiValue(gweiValue);
    const weiValue = ethers.utils.parseUnits(gweiValue, 'gwei');
    setWeiValue(weiValue.toString());
    const ethValue = ethers.utils.formatEther(weiValue);
    setEthValue(ethValue);
  };

  const handleEthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const ethValue = event.target.value;
    if (!isValid(ethValue)) {
      return;
    }
    setEthValue(ethValue);
    const weiValue = ethers.utils.parseEther(ethValue);
    setWeiValue(weiValue.toString());
    const gweiValue = ethers.utils.formatUnits(weiValue, 'gwei');
    setGweiValue(gweiValue);
  };

  const handleCopyClick = (value: string) => {
    navigator.clipboard.writeText(value);
  };

  useEffect(() => {
    const weiValue = ethers.utils.parseEther('0.01');
    setWeiValue(weiValue.toString());
    const gweiValue = ethers.utils.formatUnits(weiValue, 'gwei');
    setGweiValue(gweiValue);
    setEthValue('0.01');
  }, []);

  return (
    <Flex justifyContent="space-between">
      <VStack spacing={8}>
        <FormControl>
          <FormLabel htmlFor="wei-input">{'Wei'}</FormLabel>
          <InputGroup>
            <Input
              type="number"
              placeholder="Wei"
              minWidth={[100, 400]}
              value={weiValue}
              onChange={handleWeiChange}
            />
            <InputRightElement>
              <IconButton
                aria-label="Copy Wei Value"
                icon={<CopyIcon />}
                onClick={() => handleCopyClick(weiValue)}
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="gwei-input">{'Gwei'}</FormLabel>
          <InputGroup>
            <Input
              type="number"
              placeholder="Gwei"
              minWidth={[100, 400]}
              value={gweiValue}
              onChange={handleGweiChange}
            />
            <InputRightElement>
              <IconButton
                aria-label="Copy Gwei Value"
                icon={<CopyIcon />}
                onClick={() => handleCopyClick(gweiValue)}
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="eth-input">{'Eth'}</FormLabel>
          <InputGroup>
            <Input
              type="text"
              placeholder="ETH"
              minWidth={[100, 400]}
              value={ethValue}
              onChange={handleEthChange}
            />
            <InputRightElement>
              <IconButton
                aria-label="Copy ETH Value"
                icon={<CopyIcon />}
                onClick={() => handleCopyClick(ethValue)}
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>
        {!!ethPrice?.[0] && (
          <FormControl>
            <FormLabel htmlFor="eth-input">{'Eth Price'}</FormLabel>
            <InputGroup>
              <Input
                type="number"
                placeholder="ETH"
                minWidth={[100, 400]}
                value={ethPrice[0]?.data.amount}
                // value={calculateValue(
                //   Number(ethValue),
                //   Number(ethPrice[0]?.data.amount),
                // )}
                disabled
              />
              <InputRightElement>
                <IconButton
                  aria-label="Copy ETH Value"
                  icon={<CopyIcon />}
                  onClick={() =>
                    handleCopyClick(ethPrice[0]?.data.amount.toString()!)
                  }
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>
        )}
        {!!gasDetails && (
          <FormControl>
            <FormLabel htmlFor="eth-input">{'Suggested Base Fee'}</FormLabel>
            <InputGroup>
              <Input
                type="number"
                placeholder="ETH"
                minWidth={[100, 400]}
                value={ethers.utils
                  .formatUnits(gasDetails.gasPrice.toString(), 'gwei')
                  .toString()
                  .substring(0, 4)}
                disabled
              />
              <InputRightElement>
                <IconButton
                  aria-label="Copy ETH Value"
                  icon={<CopyIcon />}
                  onClick={() => handleCopyClick(ethValue)}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>
        )}
        {!!gasDetails && ethValue && (
          <FormControl>
            <FormLabel htmlFor="eth-input">{'Total Gas Cost'}</FormLabel>
            <InputGroup>
              <Input
                type="number"
                placeholder="ETH"
                minWidth={[100, 400]}
                value={calculateValue(
                  ethValue.toString(),
                  gasDetails.gasPrice.toString(),
                )}
                disabled
              />
              <InputRightElement>
                <IconButton
                  aria-label="Copy ETH Value"
                  icon={<CopyIcon />}
                  onClick={() => handleCopyClick(ethValue)}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>
        )}
      </VStack>
    </Flex>
  );
}
