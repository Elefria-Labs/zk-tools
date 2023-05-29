import React from 'react';
import { Button, Container, Flex, Heading } from '@chakra-ui/react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import { useWalletConnect } from '@hooks/useWalletConnect';
import { truncateAddress } from '@utils/wallet';
import LiquidityPoolList from '@components/testing/UniswapPrices';
import { MultiSend } from '@components/MultiSend';

export default function SendEth() {
  const { connectWallet, disconnect, account, provider } = useWalletConnect();
  return (
    <Main
      meta={
        <Meta
          title="MultiSend | Zk block"
          description="Send multiple tokens in one transaction"
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
          Multi Token Send
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
        <LiquidityPoolList pools={[]} />
        {provider && <MultiSend provider={provider} />}
      </Container>
    </Main>
  );
}
