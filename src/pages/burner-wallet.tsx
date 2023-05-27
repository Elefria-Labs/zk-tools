import React, { useState } from 'react';
import {
  Button,
  Box,
  Text,
  FormControl,
  FormLabel,
  Input,
  Container,
  Heading,
} from '@chakra-ui/react';

import { ethers } from 'ethers';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';

export default function BurnerWallet() {
  const [privateKey, setPrivateKey] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [publicAddress, setPublicAddress] = useState('');

  const generateKeys = () => {
    const wallet = ethers.Wallet.createRandom();
    setPrivateKey(wallet.privateKey);
    setPublicKey(wallet.publicKey);
    setPublicAddress(wallet.address);
  };

  return (
    <Main
      meta={
        <Meta
          title="Burner Wallet | Zk block"
          description="Generate random private keys for evm chains"
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
          Burner Wallet
        </Heading>
        <Box p={4}>
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            Generate Random Private Key Pair
          </Text>
          <Button colorScheme="blue" onClick={generateKeys} mb={4}>
            Generate Keys
          </Button>
          <FormControl>
            <FormLabel>Private Key</FormLabel>
            <Input value={privateKey} isReadOnly />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Public Key</FormLabel>
            <Input value={publicKey} isReadOnly />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Public Address</FormLabel>
            <Input value={publicAddress} isReadOnly />
          </FormControl>
        </Box>
      </Container>
    </Main>
  );
}
