import React, { useState } from 'react';
import {
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Textarea,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';
import { ethers } from 'ethers';
import JSONInput from 'react-json-editor-ajrm';
const locale = require('react-json-editor-ajrm/locale/en');

export default function TxDecoder() {
  const [rawTx, setRawTx] = useState<string>('');
  const [decodedTx, setDecodedTx] = useState<ethers.Transaction | undefined>();
  const [error, setError] = useState<string>('');

  const handleDecodeTx = () => {
    try {
      const tx = ethers.utils.parseTransaction(rawTx);
      setDecodedTx(tx);
      setError('');
    } catch (error) {
      setDecodedTx(undefined);
      setError('Error decoding transaction data.');
    }
  };

  return (
    <Main
      meta={
        <Meta
          title="Evm Transaction Decoder | Zk block"
          description="Decode raw evm transaction"
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
          Transaction Decoder
        </Heading>
        <Flex justifyContent="space-between">
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel htmlFor="rawTx">Raw Transaction Data</FormLabel>
              <Textarea
                id="rawTx"
                minW="480px"
                placeholder="Enter raw transaction data"
                value={rawTx}
                onChange={(e) => setRawTx(e.target.value)}
              />
            </FormControl>
            {error && <Text mb="8px">Error Decoding Tx data</Text>}
            <Button color="black" onClick={handleDecodeTx}>
              Decode Transaction
            </Button>
          </VStack>
          <Flex flexDirection="column">
            {decodedTx && (
              <>
                <Text mb="8px">{'Decoded Transaction Data'}</Text>
                <JSONInput placeholder={decodedTx} locale={locale} viewOnly />
              </>
            )}
          </Flex>
        </Flex>
      </Container>
    </Main>
  );
}
