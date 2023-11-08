import React, { useEffect, useState } from 'react';
import {
  Button,
  Container,
  Flex,
  Heading,
  Input,
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
import { useWalletConnect } from '@hooks/useWalletConnect';
import { truncateAddress } from '@utils/wallet';
import {
  calculatePositionBasedData,
  fetchPoolInfo,
} from '@components/pools/utils';
import { ethers } from 'ethers';
import { toastOptions } from '@components/common/toast';

export default function Eip712() {
  const { connectWallet, disconnect, account, provider, chainId } =
    useWalletConnect();
  const [addressesInput, setAddressesInput] = useState('');
  const [poolsInfo, setPoolsInfo] = useState<any[]>([]);
  const toast = useToast();

  useEffect(() => {
    if (account == null) {
      return;
    }
    setAddressesInput(account);
  }, [account]);

  const handleSubmit = async () => {
    if (addressesInput == null || provider == null || chainId == null) {
      return;
    }
    if (!ethers.utils.isAddress(addressesInput)) {
      return;
    }
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
    setPoolsInfo(poolsInfo);
  };
  return (
    <Main
      meta={
        <Meta
          title="EIP 712 Signing | Zk block"
          description="Sign typed data using EIP-712"
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
        <Flex justifyContent="end">
          {!account ? (
            <Button variant="solid" size="md" onClick={connectWallet}>
              Connect Wallet
            </Button>
          ) : (
            <Button variant="solid" size="md" onClick={disconnect}>
              Disconnect {truncateAddress(account)}
            </Button>
          )}
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

        {poolsInfo.length > 0 && (
          <Table variant="simple" mt={8}>
            <Thead>
              <Tr>
                <Th>positionId</Th>
                <Th>Pair</Th>
                <Th>Position</Th>
                <Th>Claimed Fee</Th>
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
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Container>
    </Main>
  );
}
