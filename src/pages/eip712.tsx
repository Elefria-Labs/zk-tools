import React from 'react';
import { Button, Container, Flex, Heading } from '@chakra-ui/react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import { Eip712Component } from '@components/eip712/Eip712Component';
import { useWalletConnect } from '@hooks/useWalletConnect';
import { truncateAddress } from '@utils/wallet';

export default function Eip712() {
  const { connectWallet, disconnect, account, provider } = useWalletConnect();
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
          EIP-712 Signature
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
        <Eip712Component provider={provider} address={account} />
      </Container>
    </Main>
  );
}
