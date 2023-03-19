import React from 'react';
import { Button, Container, Flex, Heading } from '@chakra-ui/react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import { useWalletConnect } from '@hooks/useWalletConnect';
import { truncateAddress } from '@utils/wallet';
import { PersonalSignComponent } from '@components/personal-sign/PersonalSignComponent';

export default function Erc191() {
  const { connectWallet, disconnect, account, provider } = useWalletConnect();
  return (
    <Main
      meta={
        <Meta
          title="ERC 191 Signing | Zk block"
          description="Sign typed data using ERC-191 | Personal message signing"
        />
      }
    >
      <Container maxW={'container.lg'}>
        <Heading
          as="h1"
          color="black"
          fontSize={['35px', '35px', '40px']}
          fontWeight={700}
          mb="20px"
          mt="20px"
        >
          ERC-191 Signature
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
        <PersonalSignComponent provider={provider} address={account} />
      </Container>
    </Main>
  );
}
