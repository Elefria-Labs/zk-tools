import React, { useState } from 'react';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Textarea,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import JSONInput from 'react-json-editor-ajrm';
// @ts-ignore
import * as locale from 'react-json-editor-ajrm/locale/en';

export default function TxDecoderComponent() {
  const [rawTx, setRawTx] = useState<string>('');
  const [decodedTx, setDecodedTx] = useState<ethers.Transaction | undefined>();
  const toast = useToast();

  const handleDecodeTx = () => {
    try {
      const tx = ethers.utils.parseTransaction(rawTx);
      setDecodedTx(tx);
    } catch (error) {
      setDecodedTx(undefined);
      toast({
        title: 'Error decoding transaction data. Please check input.',
        status: 'error',
        position: 'top',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      flexDirection={['column', 'column', 'row']}
      justifyContent="space-between"
    >
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel htmlFor="rawTx">Raw Transaction Data</FormLabel>
          <Textarea
            id="rawTx"
            minW={[380, 380, 600]}
            minH={[320, 320, 480]}
            placeholder="Enter raw transaction data"
            value={rawTx}
            onChange={(e) => setRawTx(e.target.value)}
          />
        </FormControl>
        <Button color="black" onClick={handleDecodeTx}>
          Decode Transaction
        </Button>
      </VStack>
      <Flex flexDirection="column" mt={[8, 8, 0]}>
        {decodedTx && (
          <>
            <FormLabel mb="8px">{'Decoded Transaction Data'}</FormLabel>
            <JSONInput placeholder={decodedTx} locale={locale} viewOnly />
          </>
        )}
      </Flex>
    </Flex>
  );
}
