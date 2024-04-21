import React, { useState } from 'react';
import {
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import { CopyIcon } from '@chakra-ui/icons';
import { toastOptions } from '@components/common/toast';

export default function EvmAddressChecksumComponent() {
  const [toChecksumAddress, setToChecksumAddress] = useState<string>('');
  const [checksummedAddress, setChecksummedAddress] = useState<string>('');
  //  const [isChecksumAddress, setIsChecksumAddress] = useState<string>('');

  // const [error, setEthValue] = useState<string>('');
  const toast = useToast();

  const handleToChecksumAddress = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const addressInput = event.target.value;
    setToChecksumAddress(addressInput);
    if (!ethers.utils.isAddress(addressInput)) {
      toast({
        ...toastOptions,
        title: 'Invalid address',
      });
    }
    setChecksummedAddress(ethers.utils.getAddress(addressInput));
  };

  // TODO
  // const handleIsChecksumAddress = (
  //   event: React.ChangeEvent<HTMLInputElement>,
  // ) => {
  //   const addressInput = event.target.value;
  //   setIsChecksumAddress(addressInput);
  //   if (!isAddress(addressInput)) {
  //     toast({
  //       ...toastOptions,
  //       title: 'Invalid address',
  //     });
  //     return;
  //   }

  //   try {
  //     ethers.utils.getAddress(addressInput);
  //   } catch (e) {
  //     console.log('e:', e);
  //     toast({
  //       ...toastOptions,
  //       title: 'Not a checksum address!',
  //     });
  //     return;
  //   }

  //   toast({
  //     ...toastOptions,
  //     title: 'Valid checksum address!',
  //     status: 'success',
  //   });
  // };

  const handleCopyClick = (value: string) => {
    navigator.clipboard.writeText(value);
  };

  return (
    <Flex justifyContent="space-between">
      <VStack spacing={8}>
        <FormControl>
          <FormLabel htmlFor="wei-input">{'toChecksumAddress'}</FormLabel>
          <InputGroup>
            <Input
              type="string"
              placeholder="address"
              minWidth={[200, 600]}
              value={toChecksumAddress}
              onChange={handleToChecksumAddress}
            />
          </InputGroup>
          <InputGroup mt={4}>
            <Input
              type="string"
              placeholder="address"
              minWidth={[100, 400]}
              value={checksummedAddress}
              disabled
            />
            <InputRightElement>
              <IconButton
                aria-label="Copy Wei Value"
                icon={<CopyIcon />}
                onClick={() =>
                  handleCopyClick(ethers.utils.getAddress(toChecksumAddress))
                }
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>

        {/* <FormControl>
              <FormLabel htmlFor="gwei-input">{'isChecksumAddress'}</FormLabel>
              <InputGroup>
                <Input
                  placeholder="address"
                  minWidth={[100, 400]}
                  value={isChecksumAddress}
                  onChange={handleIsChecksumAddress}
                />
        
              </InputGroup>
            </FormControl> */}
      </VStack>
    </Flex>
  );
}
