import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Container,
  Flex,
  Heading,
  Icon,
  IconButton,
  Input,
  Progress,
  Text,
  useToast,
} from '@chakra-ui/react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';

import { ethers } from 'ethers';
import { toastOptions } from '@components/common/toast';
import PolygonIcon from '@components/icon/polygon';
import EthereumIcon from '@components/icon/ethereum';
import OptimismIcon from '@components/icon/optimism';
import BscIcon from '@components/icon/bsc';
import { Address } from 'wagmi';
import { AddIcon, CopyIcon, MinusIcon } from '@chakra-ui/icons';
import { ChainBalance, getBalances } from '@components/balance-tracker/utils';
import ArbitrumIcon from '@components/icon/arbitrum';
import BaseIcon from '@components/icon/base';
import BalanceTrackerTable from '@components/balance-tracker/BalanceTrackerTable';

// TODO: refactor for multiple rendering
export default function BalanceTracker() {
  const [saveAddress, setSaveAddress] = useState<boolean>(true);
  const [addressesInputs, setAddressesInputs] = useState<string[]>(['']);

  const [loading, setLoading] = useState<boolean>(false);

  const [chainBalances, setChainBalances] = useState<
    Record<string, ChainBalance>[]
  >([]);
  const toast = useToast();

  // const { data: coinPriceData, loading: isCoinPriceLoading } = useGetCoinPrice(

  // );
  useEffect(() => {
    const addresses: string[] = JSON.parse(
      localStorage.getItem('addresses') ?? JSON.stringify(['']),
    );
    setAddressesInputs(addresses);
  }, []);

  // useEffect(() => {
  //   if (coinPriceData == null) {
  //     return;
  //   }

  //   // setGains(consolidatedGains);
  // }, [coinPriceData, poolPositionDataAllAddr]);

  const handleSubmit = async () => {
    if (
      addressesInputs.length == 0 ||
      addressesInputs.filter((addr) => !ethers.utils.isAddress(addr)).length > 0
    ) {
      toast({
        ...toastOptions,
        title: 'Please enter a valid address/s.',
      });
      return;
    }
    if (
      addressesInputs.filter(
        (item, index) => addressesInputs.indexOf(item) !== index,
      ).length > 0
    ) {
      toast({
        ...toastOptions,
        title: 'Please remove duplicate addresses.',
      });
      return;
    }
    if (saveAddress) {
      localStorage.setItem('addresses', JSON.stringify(addressesInputs));
    }

    setLoading(true);

    const balances = await getBalances(addressesInputs as Address[]);
    console.log('balances', balances);
    setChainBalances(balances);
    setLoading(false);
  };

  const handleAddInput = () => {
    setAddressesInputs([...addressesInputs, '']);
  };
  const handleRemoveInput = (index: number) => {
    const updatedFields = [...addressesInputs];
    updatedFields.splice(index, 1);
    setAddressesInputs(updatedFields);
  };

  const handleInputChange = (index: number, value: string) => {
    const updatedFields = [...addressesInputs];
    updatedFields[index] = value;
    setAddressesInputs(updatedFields);
  };
  const handleCopy = () => {
    if (chainBalances.length == 0) {
      return;
    }
    navigator.clipboard.writeText(JSON.stringify(chainBalances));
  };

  return (
    <Main
      meta={
        <Meta
          title="Multi chain balance tracker | Zk block"
          description="View on chain balances across evm chains by address"
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
          Multi-chain Balance Tracker
        </Heading>
        <Text mb={4}>connect your wallet & add accounts!</Text>
        <Flex justifyContent="space-between" alignItems="center">
          <Flex>
            {/* // TODO add icons */}
            {[
              EthereumIcon,
              PolygonIcon,
              OptimismIcon,
              BscIcon,
              ArbitrumIcon,
              BaseIcon,
            ].map((icon, i) => (
              <Icon
                key={i}
                as={icon}
                display="block"
                cursor="pointer"
                color="black"
                w="6"
                h="6"
                mr={4}
              />
            ))}
          </Flex>
          {/* <ConnectButton /> */}
        </Flex>
        <Flex mt={4}>
          <Flex flexDir="column">
            {addressesInputs.map((value, index) => {
              return (
                <Flex key={index} mb={4}>
                  {index == 0 ? (
                    <IconButton
                      mr={4}
                      aria-label="Add Input"
                      icon={<AddIcon />}
                      onClick={handleAddInput}
                    />
                  ) : (
                    <IconButton
                      mr={4}
                      aria-label="Remove Input"
                      icon={<MinusIcon />}
                      onClick={() => handleRemoveInput(index)}
                    />
                  )}

                  <Input
                    key={index}
                    w={520}
                    value={value}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    placeholder={`Input ${index + 1}`}
                    color="black"
                    borderColor="black"
                  />
                </Flex>
              );
            })}
            <Checkbox
              defaultChecked
              colorScheme="teal"
              ml={16}
              onChange={(e) => setSaveAddress(e.target.checked)}
            >
              Save address locally
            </Checkbox>
          </Flex>

          <Button
            colorScheme="teal"
            ml={3}
            onClick={handleSubmit}
            isLoading={false}
            disabled={addressesInputs.filter(ethers.utils.isAddress).length > 0}
            loadingText="Submitting"
          >
            Get Balances
          </Button>
          {chainBalances.length > 0 && (
            <Button
              leftIcon={<CopyIcon />}
              w={40}
              colorScheme="teal"
              variant="solid"
              ml={4}
              onClick={handleCopy}
            >
              Copy Balances
            </Button>
          )}
        </Flex>

        <Box>
          {loading && (
            <Progress
              my="8"
              size="md"
              isIndeterminate
              colorScheme="green"
              color="green"
            />
          )}
        </Box>

        {chainBalances.length > 0 && (
          <BalanceTrackerTable chainBalances={chainBalances} />
        )}
      </Container>
    </Main>
  );
}
