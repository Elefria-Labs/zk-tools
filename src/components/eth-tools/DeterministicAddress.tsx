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
import { toastOptions } from '@components/common/toast';

type DeterministicAddressPropsType = {
  provider?: ethers.providers.JsonRpcProvider;
  address?: string;
};
const DeterministicAddress = (props: DeterministicAddressPropsType) => {
  const { provider, address } = props;
  const [account, setAccount] = useState(address);
  const [contractAddress, setContractAddress] = useState('');
  const toast = useToast();
  useEffect(() => {
    setAccount(address);
  }, [address]);

  const generateContractAddress = async () => {
    if (provider == null) {
      toast({ ...toastOptions, title: 'Please connect wallet.' });
      return;
    }
    if (!account) {
      toast({ ...toastOptions, title: 'Please check input.' });
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
