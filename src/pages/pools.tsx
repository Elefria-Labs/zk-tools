import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Icon,
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
import ConsolidatedGainsRow from '@components/pools/ConsolidatedGainsRow';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useNetwork } from 'wagmi';

export default function Pools() {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const [addressesInput, setAddressesInput] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [poolsInfo, setPoolsInfo] = useState<any[]>([]);
  const [gains, setGains] = useState<ConsolidateGainsType>();
  const toast = useToast();

  useEffect(() => {
    if (address == null) {
      return;
    }
    setAddressesInput(address);
  }, [address]);

  const handleSubmit = async () => {
    if (addressesInput == null || chain?.id == null) {
      return;
    }
    if (!ethers.utils.isAddress(addressesInput)) {
      return;
    }
    setLoading(true);
    const provider = new ethers.providers.JsonRpcProvider(
      chain.rpcUrls.public.http[0],
    );

    const pools = await fetchPoolInfo(addressesInput, provider);
    if (pools.length == 0) {
      toast({
        ...toastOptions,
        title: 'No pools found for the connected address.',
      });
      return;
    }
    const poolsInfo = await Promise.all(
      pools.map((p) => calculatePositionBasedData(p, chainId)),
    );
    const consolidatedGains = consolidateGains(poolsInfo);
    setGains(consolidatedGains);

    setPoolsInfo(poolsInfo);
    setLoading(false);
  };

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
          <Input
            placeholder="connect your wallet"
            value={addressesInput}
            size="md"
            w={520}
            color="black"
            borderColor="black"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setAddressesInput(event.target.value);
            }}
          />
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
        {poolsInfo.length > 0 && (
          <Table variant="simple" mt={8}>
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
              {poolsInfo.map((pI) => (
                <Tr key={pI.positionId}>
                  <Td>{pI.positionId}</Td>

                  <Td>
                    {pI.token0.symbol}/{pI.token1.symbol}
                  </Td>
                  <Td>{`${pI.token0Amount} ${pI.token0.symbol}/ ${pI.token1Amount} ${pI.token1.symbol}`}</Td>
                  <Td>{`${pI.claimedFee0} ${pI.token0.symbol} + ${pI.claimedFee1} ${pI.token1.symbol}`}</Td>
                  <Td>{`${pI.unclaimedFees0} ${pI.token0.symbol} + ${pI.unclaimedFees1} ${pI.token1.symbol}`}</Td>
                </Tr>
              ))}
              {gains && <ConsolidatedGainsRow gains={gains} />}
            </Tbody>
          </Table>
        )}
      </Container>
    </Main>
  );
}
