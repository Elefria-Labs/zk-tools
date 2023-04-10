import React from 'react';
import { Container, Heading } from '@chakra-ui/react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import ByteConvert from '@components/eth-tools/ByteConversion';

export default function ByteConversion() {
  return (
    <Main
      meta={
        <Meta
          title="Bytes32 & String Conversion | Zk block"
          description="Convert between Bytes32 & String "
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
          Bytes32 & String Conversion
        </Heading>
        <ByteConvert />
      </Container>
    </Main>
  );
}
