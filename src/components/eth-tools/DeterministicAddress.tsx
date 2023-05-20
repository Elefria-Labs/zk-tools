import { useEffect, useState } from 'react';
import {
  Heading,
  Text,
  VStack,
  Button,
  Input,
  useToast,
} from '@chakra-ui/react';
import { ethers } from 'ethers';

type DeterministicAddressPropsType = {
  provider?: ethers.providers.JsonRpcProvider;
  address?: string;
};
const DeterministicAddress = ({
  provider,
  address,
}: DeterministicAddressPropsType) => {
  const [account, setAccount] = useState(address);
  const [contractAddress, setContractAddress] = useState('');
  const toast = useToast();
  useEffect(() => {
    setAccount(address);
  }, [address]);

  const generateContractAddress = async () => {
    if (provider == null) {
      toast({
        title: 'Please connect wallet.',
        status: 'error',
        position: 'top',
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    if (!account) {
      toast({
        title: 'Please check input.',
        status: 'error',
        position: 'top',
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    const nonce = await provider.getTransactionCount(account);
    const contractAddress = ethers.utils.getContractAddress({
      from: account,
      nonce: nonce,
    });
    setContractAddress(contractAddress);
  };

  return (
    <VStack>
      <Heading size="sm">
        Contract address when deployed from the below account
      </Heading>
      <Input
        type="text"
        placeholder="0xAccountAddress.."
        value={account}
        onChange={(e) => setAccount(e.target.value)}
      />
      <Button onClick={generateContractAddress}>Generate</Button>
      {contractAddress && (
        <Text as="b">Contract Address: {contractAddress}</Text>
      )}
    </VStack>
  );
};

export default DeterministicAddress;
