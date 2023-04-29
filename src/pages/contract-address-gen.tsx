import React from 'react';
import { Container, Heading } from '@chakra-ui/react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import DeterministicAddress from '@components/eth-tools/DeterministicAddress';

export default function ContractAddressGen() {
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
        <DeterministicAddress />
      </Container>
    </Main>
  );
}
