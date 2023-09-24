import { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import { toastOptions } from '@components/common/toast';

function StringByteConversion() {
  const [stringInput, setStringInput] = useState('');
  const [bytesInput, setBytesInput] = useState('');
  const toast = useToast();
  const convertToBytes = (stringValue: string) => {
    try {
      const bytesValue = ethers.utils.formatBytes32String(stringValue);
      setBytesInput(bytesValue);
    } catch (error) {
      toast({
        ...toastOptions,
        title: 'Please check the input.',
      });
    }
  };

  const convertToString = (bytesValue: string) => {
    try {
      const stringValue = ethers.utils.parseBytes32String(bytesValue);
      setStringInput(stringValue);
    } catch (error) {
      toast({
        ...toastOptions,
        title: 'Please check the input.',
      });
    }
  };

  return (
    <Box w="100%">
      <Stack spacing={4}>
        <FormControl>
          <FormLabel>String Input</FormLabel>
          <Input
            type="text"
            value={stringInput}
            onChange={(e) => {
              setStringInput(e.target.value);
              convertToBytes(e.target.value);
            }}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Bytes32 Input</FormLabel>
          <Input
            type="text"
            value={bytesInput}
            onChange={(e) => {
              setBytesInput(e.target.value);
              convertToString(e.target.value);
            }}
          />
        </FormControl>
      </Stack>
    </Box>
  );
}

export default StringByteConversion;
