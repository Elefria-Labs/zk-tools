import React from 'react';
import { Container, Flex, Heading } from '@chakra-ui/react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import { PersonalSignComponent } from '@components/personal-sign/PersonalSignComponent';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Erc191() {
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
          <ConnectButton />
        </Flex>
        <PersonalSignComponent />
      </Container>
    </Main>
  );
}
