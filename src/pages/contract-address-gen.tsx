import React from 'react';
import { Button, Container, Flex, Heading } from '@chakra-ui/react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import DeterministicAddress from '@components/eth-tools/DeterministicAddress';
import { useWalletConnect } from '@hooks/useWalletConnect';
import { truncateAddress } from '@utils/wallet';

export default function ContractAddressGen() {
  const { connectWallet, disconnect, account, provider } = useWalletConnect();
  return (
    <Main
      meta={
        <Meta
          title="Deterministic Contract Address | Zk block"
          description="Generate the next deployment contract address from an account"
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
          Deterministic Contract Address
        </Heading>
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
        <DeterministicAddress provider={provider} address={account} />
      </Container>
    </Main>
  );
}
