import React, { useEffect, useState } from 'react';
import {
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from '@chakra-ui/react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import { ethers } from 'ethers';
import { CopyIcon } from '@chakra-ui/icons';
import { useGetCoinPrice } from '@hooks/useGetCoinPrice';
import { calculateValue } from '@components/pools/utils';
import { useGetBaseFee } from '@hooks/useGetBaseFee';

export default function GasConvertor() {
  const [weiValue, setWeiValue] = useState<string>('');
  const [gweiValue, setGweiValue] = useState<string>('');
  const [ethValue, setEthValue] = useState<string>('');

  const {
    data: ethPrice,
    isLoading: isPriceLoading,
    error: priceError,
  } = useGetCoinPrice(['eth']);
  const isValid = (value: string) => {
    return !(value == '' || Number(value) < 0);
  };
  const { gasDetails } = useGetBaseFee();

  const handleWeiChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const weiValue = event.target.value;
    if (!isValid(weiValue)) {
      return;
    }
    setWeiValue(weiValue);
    const gweiValue = ethers.utils.formatUnits(weiValue, 'gwei');
    setGweiValue(gweiValue);
    const ethValue = ethers.utils.formatEther(weiValue);
    setEthValue(ethValue);
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
    <Main
      meta={
        <Meta
          title="Eth Gas Converter | Zk block"
          description="Convert between wei, gwei and eth"
        />
      }
    >
      <Container maxW={'container.lg'} position="relative">
        <Heading
          as="h1"
          color="black"
          fontSize={['35px', '35px', '40px']}
          fontWeight={700}
          mb="20px"
          mt="20px"
        >
          Ethereum Unit Convertor
        </Heading>
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
                  type="number"
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
            {!!ethPrice?.[0] && ethValue && (
              <FormControl>
                <FormLabel htmlFor="eth-input">{'Eth Price'}</FormLabel>
                <InputGroup>
                  <Input
                    type="number"
                    placeholder="ETH"
                    minWidth={[100, 400]}
                    value={calculateValue(
                      Number(ethValue),
                      ethPrice[0]?.data.amount,
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
            {!!gasDetails?.data && (
              <FormControl>
                <FormLabel htmlFor="eth-input">
                  {'Suggested Base Fee'}
                </FormLabel>
                <InputGroup>
                  <Input
                    type="number"
                    placeholder="ETH"
                    minWidth={[100, 400]}
                    value={gasDetails.data.result.suggestBaseFee}
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
      </Container>
    </Main>
  );
}
