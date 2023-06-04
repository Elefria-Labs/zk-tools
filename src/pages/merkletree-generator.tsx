import React from 'react';
import { Container, Heading } from '@chakra-ui/react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import MerkleTreeVerifier from '@components/eth-tools/MerkleTreeVerifier';

export default function MerkleTreeGenerator() {
  return (
    <Main
      meta={
        <Meta
          title="Merkle Tree Generator | Zk block"
          description="Generate merkle trees and verify leaves"
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
          Merkle Tree Generator
        </Heading>
        <MerkleTreeVerifier />
      </Container>
    </Main>
  );
}
