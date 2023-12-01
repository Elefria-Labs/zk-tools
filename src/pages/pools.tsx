import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Heading,
  Icon,
  IconButton,
  Input,
  Progress,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import { chainId } from '@utils/wallet';
import {
  ConsolidateGainsType,
  calculatePositionBasedData,
  consolidateGains,
  fetchPoolInfo,
} from '@components/pools/utils';
import { ethers } from 'ethers';
import { toastOptions } from '@components/common/toast';
import PolygonIcon from '@components/icon/polygon';
import EthereumIcon from '@components/icon/ethereum';
import OptimismIcon from '@components/icon/optimism';
import BscIcon from '@components/icon/bsc';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useNetwork } from 'wagmi';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import ConsolidatedGainsRow from '@components/pools/ConsolidatedGainsRow';

// TODO: refactor for multiple rendering
export default function Pools() {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const [addressesInput, setAddressesInput] = useState('');
  const [addressesInputs, setAddressesInputs] = useState<string[]>(['']);

  const [loading, setLoading] = useState<boolean>(false);
  // const [poolsInfo, setPoolsInfo] = useState<any[]>([]);
  const [poolPositionDataAllAddr, setPoolPositionDataAllAddr] = useState<
    any[][]
  >([]);
  const [gains, setGains] = useState<ConsolidateGainsType[]>([]);
  const toast = useToast();

  useEffect(() => {
    if (address == null) {
      return;
    }
    setAddressesInput(address);
  }, [address]);

  const handleSubmit = async () => {
    if (
      addressesInputs.length == 0 ||
      chain?.id == null ||
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
    setLoading(true);
    const provider = new ethers.providers.JsonRpcProvider(
      chain.rpcUrls.public.http[0],
    );

    const promiseAll = Promise.all(
      addressesInputs.map((addr) => fetchPoolInfo(addr, provider)),
    );
    const poolInfos = await promiseAll;
    const consolidatedGains = [];
    const poolPositionDataAllAddr = [];
    for (let i = 0; i < poolInfos.length; ++i) {
      const pools = poolInfos[i] ?? [];
      if (pools.length == 0) {
        toast({
          ...toastOptions,
          title: 'No pools found for the connected address.',
        });
        continue;
      }
      const poolPositionData = await Promise.all(
        pools.map((p) => calculatePositionBasedData(p, chainId)),
      );
      poolPositionDataAllAddr.push(poolPositionData);
      consolidatedGains.push(consolidateGains(poolPositionData));
    }
    setGains(consolidatedGains);
    setPoolPositionDataAllAddr(poolPositionDataAllAddr);
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

  console.log('addressesInputs', addressesInputs);
  return (
    <Main
      meta={
        <Meta
          title="Uniswap V3 Pools | Zk block"
          description="View all the uniswap v3 pools by address"
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
          Pool Info
        </Heading>
        <Text>* currently only support Uniswap V3, connect your wallet!</Text>
        <Flex justifyContent="space-between" alignItems="center">
          <Flex>
            {[EthereumIcon, PolygonIcon, OptimismIcon, BscIcon].map(
              (icon, i) => (
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
              ),
            )}
            {/* <Icon
              as={ArbitrumIcon}
              display="block"
              cursor="pointer"
              w="6"
              h="6"
              mr={4}
            />
           
            <Icon
              as={BaseIcon}
              display="block"
              cursor="pointer"
              w="6"
              h="6"f
              mr={4}
            /> */}
          </Flex>
          <ConnectButton />
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
          </Flex>
          {/* <Input
            placeholder="connect your wallet"
            value={addressesInput}
            size="md"
            w={520}
            color="black"
            borderColor="black"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setAddressesInput(event.target.value);
            }}
          /> */}
          <Button
            colorScheme="teal"
            ml={3}
            onClick={handleSubmit}
            isLoading={false}
            disabled={!ethers.utils.isAddress(addressesInput)}
            loadingText="Submitting"
          >
            Get Pools
          </Button>
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
        {poolPositionDataAllAddr.length > 0 &&
          poolPositionDataAllAddr.map((poolPositionData, index: number) => {
            return (
              <Card my={8} key={index} mt={index == 0 ? 8 : 0}>
                <Box>
                  {/* <Badge colorScheme="green" mb={4}>
                    {addressesInputs[index]}
                  </Badge> */}
                  <Heading as="h3" size="md" m={4}>
                    {addressesInputs[index]}
                  </Heading>
                  {poolPositionData.length > 0 && (
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>positionId</Th>
                          <Th>Pair</Th>
                          <Th>Position</Th>
                          <Th>Claimed Fee</Th>
                          <Th>Unclaimed Fees</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {poolPositionData.map((pI) => (
                          <Tr key={pI.positionId}>
                            <Td>{pI.positionId}</Td>

                            <Td>
                              {pI.token0.symbol}/{pI.token1.symbol}
                            </Td>
                            <Td>{`${pI.token0Amount} ${pI.token0.symbol}/ ${pI.token1Amount} ${pI.token1.symbol}`}</Td>
                            <Td>{`${pI.claimedFee0} ${pI.token0.symbol} + ${pI.claimedFee1} ${pI.token1.symbol} ${pI.liquidity}`}</Td>
                            <Td>{`${pI.unclaimedFees0} ${pI.token0.symbol} + ${pI.unclaimedFees1} ${pI.token1.symbol}`}</Td>
                          </Tr>
                        ))}
                        {gains[index] != null && (
                          <ConsolidatedGainsRow gains={gains[index]!} />
                        )}
                      </Tbody>
                    </Table>
                  )}
                  <Divider />
                </Box>
              </Card>
            );
          })}
      </Container>
    </Main>
  );
}
